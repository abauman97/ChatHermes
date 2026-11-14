"""Integration with the pinned runtime's real SQLite, compaction and projection."""

import importlib.util
from pathlib import Path

import pytest
from fastapi import HTTPException
from hermes_state import SessionDB

ROOT = Path(__file__).resolve().parents[1]


def load(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


transcript = load(ROOT / "plugin/chathermes/dashboard/transcript.py")
seed = load(ROOT / "tests/fixtures/transcript.py").seed


@pytest.fixture
def db(tmp_path):
    store = SessionDB(db_path=tmp_path / "history.db")
    try:
        yield store
    finally:
        store.close()


@pytest.mark.parametrize("limit", [1, 7, 119, 120])
def test_full_incremental_history_compaction_rotations_dedupe_and_rewind(db, limit):
    seeded = seed(db, "transcript")
    first = transcript.read_page(db, seeded["id"], "default", limit=limit)
    assert first["session_id"] == seeded["tip"]
    assert first["pagination"]["returned"] == limit
    assert first["transcript"]["has_more"]
    pages = [first]
    while pages[-1]["transcript"]["has_more"]:
        last = pages[-1]["transcript"]
        pages.append(
            transcript.read_page(
                db,
                seeded["id"],
                "default",
                limit=limit,
                offset=last["next_offset"],
                revision=last["revision"],
            )
        )
    rows = [row for page in reversed(pages) for row in page["data"]]
    prompts = [
        row["content"]
        for row in rows
        if row["role"] == "user" and row.get("display_kind") != "hidden"
    ]
    assert prompts == [f"Persisted prompt {n:03d}" for n in range(168)] + [
        "Replacement after rewind"
    ]
    assert len({str(row["id"]) for row in rows}) == len(rows)
    assert len([row for row in rows if row.get("display_kind") == "compaction"]) == 0
    assert "INTERNAL COMPACTION SUMMARY" not in str(rows)
    assert "Persisted prompt 168" not in str(rows)


def test_revision_rejects_append_rewind_and_rotation_between_pages(db):
    seeded = seed(db, "changing")
    first = transcript.read_page(db, seeded["id"], "default")
    cursor = first["transcript"]
    db.append_message(seeded["tip"], "user", "New message while reading")
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, seeded["id"], "default", offset=120, revision=cursor["revision"])
    assert error.value.status_code == 409
    fresh = transcript.read_page(db, seeded["id"], "default")
    target = db.get_messages(seeded["tip"])[-1]
    db.rewind_to_message(seeded["tip"], target["id"])
    with pytest.raises(HTTPException) as error:
        transcript.read_page(
            db, seeded["id"], "default", offset=120, revision=fresh["transcript"]["revision"]
        )
    assert error.value.status_code == 409


def test_profile_ownership_and_display_content(db):
    db.create_session("private", source="desktop", profile_name="alpha")
    db.append_message("private", "user", "Private text")
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, "private", "beta")
    assert error.value.status_code == 404
    db.create_session("display", source="desktop")
    from agent.context_compressor import _SUMMARY_END_MARKER

    db.append_message(
        "display",
        "user",
        "Internal summary" + _SUMMARY_END_MARKER + "Visible ask",
        _compressed_summary=True,
    )
    result = transcript.read_page(db, "display", "default")
    assert any(row.get("content") == "Visible ask" for row in result["data"])
    assert "Internal summary" not in str(result["data"])


def test_rotation_without_flag_matches_desktop_without_invented_marker(db):
    db.create_session("root", source="desktop")
    db.append_message("root", "user", "Original")
    db.append_message("root", "assistant", "Before rotation")
    db.publish_compression_child(
        parent_session_id="root",
        child_session_id="child",
        source="desktop",
        messages=db.get_messages("root"),
        require_compression_lease=False,
    )
    db.append_message("child", "user", "After rotation")
    result = transcript.read_page(db, "root", "default")
    visible = [row for row in result["data"] if row.get("display_kind") != "hidden"]
    assert [row.get("content") for row in visible] == [
        "Original",
        "Before rotation",
        "After rotation",
    ]
    assert not any(row.get("display_kind") == "compaction" for row in visible)


def test_no_marker_for_summary_looking_user_text_or_branch(db):
    db.create_session("root", source="desktop")
    db.append_message("root", "user", "Context compacted. INTERNAL COMPACTION SUMMARY")
    db.create_session(
        "branch",
        source="desktop",
        parent_session_id="root",
        model_config={"_branched_from": "root"},
    )
    db.append_message("branch", "user", "Branched question")
    assert not any(
        row.get("display_kind") == "compaction"
        for row in transcript.read_page(db, "root", "default")["data"]
    )
    assert not any(
        row.get("display_kind") == "compaction"
        for row in transcript.read_page(db, "branch", "default")["data"]
    )


def test_single_segment_page_limits_payloads(db, monkeypatch):
    db.create_session("large", source="desktop")
    rows = [
        {
            "role": "user" if n % 2 == 0 else "assistant",
            "content": f"{n:05d} " + "payload " * 400,
            "timestamp": 1700000000 + n,
        }
        for n in range(2400)
    ]
    db.append_messages_batch("large", rows)
    original = db.get_messages
    reads = []

    def bounded(*args, **kwargs):
        reads.append(kwargs.get("limit"))
        assert kwargs.get("limit") == 121
        return original(*args, **kwargs)

    monkeypatch.setattr(db, "get_messages", bounded)
    result = transcript.read_page(db, "large", "default")
    assert len(result["data"]) == 120
    assert result["data"][0]["content"].startswith("02280 ")
    assert result["data"][-1]["content"].startswith("02399 ")
    assert result["transcript"]["has_more"] is True
    assert reads == [121]
    assert len(str(result)) < 500000


def test_compacted_inline_images_keep_bounded_authenticated_addresses(db, monkeypatch):
    from hermes_cli import web_server_sessions
    from hermes_cli.web_routers import sessions

    monkeypatch.setattr(sessions, "_history_profile_home", lambda profile: db.db_path.parent)
    db.create_session("images", source="desktop", profile_name="alpha")
    data = "data:image/png;base64,aGVsbG8="
    image_id = db.append_message(
        "images",
        "user",
        [
            {"type": "text", "text": "Original image"},
            {"type": "image_url", "image_url": {"url": data}},
        ],
    )
    db.archive_and_compact(
        "images", [{"role": "user", "content": "internal summary", "_compressed_summary": True}]
    )
    result = transcript.read_page(db, "images", "alpha")
    image = next(row for row in result["data"] if row.get("id") == image_id)
    assert (
        image["content"][1]["image_url"]["url"]
        == f"/api/plugins/chathermes/artifact-images/images/{image_id}/1"
    )
    assert data not in str(result)
    monkeypatch.setattr(
        web_server_sessions,
        "_open_session_db_for_profile",
        lambda profile, *, read_only: SessionDB(db_path=db.db_path, read_only=True),
    )
    assert transcript.read_inline_image("alpha", "images", str(image_id), 1) == data
    with pytest.raises(ValueError):
        transcript.read_inline_image("beta", "images", str(image_id), 1)


def desktop_page(db, monkeypatch, sid, limit, offset=0):
    """Execute the pinned Desktop REST handler, not a second selector."""
    import asyncio

    from hermes_cli.web_routers import sessions

    monkeypatch.setattr(sessions, "_with_db", lambda profile, read, **kw: read(db))
    monkeypatch.setattr(sessions, "_history_profile_home", lambda profile: db.db_path.parent)
    return asyncio.run(
        sessions.get_session_messages(
            sid,
            profile="default",
            limit=limit,
            offset=offset,
            order="latest",
            include_compacted=True,
            inline_images=True,
        )
    )["messages"]


@pytest.mark.parametrize("limit", [1, 7, 119, 120])
def test_desktop_route_parity_for_same_source_history(db, monkeypatch, limit):
    seeded = seed(db, "desktop-comparison")
    offset = 0
    while True:
        expected = desktop_page(db, monkeypatch, seeded["id"], limit, offset)
        actual = transcript.read_page(db, seeded["id"], "default", limit, offset)
        # Hidden scaffold bodies are deliberately withheld by the plugin. All
        # source identities and their sequence must still be Desktop's sequence.
        assert [row["id"] for row in actual["data"]] == [row["id"] for row in expected]
        for plugin, desktop in zip(actual["data"], expected, strict=True):
            assert plugin.get("display_kind") == desktop.get("display_kind")
            if desktop.get("display_kind") != "hidden":
                assert plugin["content"] == desktop.get("display_content", desktop["content"])
        offset = actual["transcript"]["next_offset"]
        if not actual["transcript"]["has_more"]:
            break


def test_uncovered_clone_shape_shares_desktop_limitation(db, monkeypatch):
    fixture = load(ROOT / "tests/fixtures/transcript.py").seed_uncovered_clones(db, "clones")
    expected = desktop_page(db, monkeypatch, fixture["id"], 120)
    actual = transcript.read_page(db, fixture["id"], "default")["data"]

    def visible(rows):
        return [(row["id"], row["content"]) for row in rows if row.get("display_kind") != "hidden"]

    assert visible(actual) == visible(expected)
    # The pinned Desktop path returns retained answers, then newly placed user
    # clones. Passing parity is not a fix for the user's requested interleaving.
    assert [row["content"] for row in expected if row.get("display_kind") != "hidden"] == [
        *[f"Clone answer {n}" for n in range(6)],
        *[f"Clone prompt {n}" for n in range(6)],
    ]
    retired = db._read_all(
        "SELECT id, message_uid, display_order FROM messages WHERE active=0 AND compacted=0 ORDER BY id"
    )
    clones = [
        row for row in expected if row["role"] == "user" and row.get("display_kind") != "hidden"
    ]
    assert len(retired) == len(clones) == 6
    assert all(new["id"] > old["id"] for old, new in zip(retired, clones, strict=True))


def test_repeated_occurrences_follow_desktop_identity_rules(db, monkeypatch):
    db.create_session("repeat", source="desktop", profile_name="default")
    for stamp in (1700000100, 1700000102):
        db.append_message("repeat", "user", "Repeat", timestamp=stamp)
        db.append_message("repeat", "assistant", "Same answer", timestamp=stamp + 1)
    rows = transcript.read_page(db, "repeat", "default")["data"]
    expected = desktop_page(db, monkeypatch, "repeat", 120)
    assert [row["id"] for row in rows] == [row["id"] for row in expected]
    assert len(rows) == 4
    # Even separate append calls at an identical timestamp/content collapse by
    # Hermes display identity. Do not invent local occurrence UIDs to undo that.
    db.append_message("repeat", "user", "Repeat", timestamp=1700000102)
    assert len(desktop_page(db, monkeypatch, "repeat", 120)) == 4
    assert len(transcript.read_page(db, "repeat", "default")["data"]) == 4


def test_multi_rotation_work_is_measured_separately_from_response_size(db, monkeypatch):
    db.create_session("cost", source="desktop", profile_name="default")
    db.append_messages_batch(
        "cost",
        [
            {"role": "user", "content": str(n) + "x" * 2048, "timestamp": 1700000000 + n}
            for n in range(1200)
        ],
    )
    for parent, child in (("cost", "cost-1"), ("cost-1", "cost-2")):
        db.publish_compression_child(
            parent_session_id=parent,
            child_session_id=child,
            source="desktop",
            messages=db.get_messages(parent)[-2:],
            require_compression_lease=False,
        )
    read = db._read_all
    payloads = []

    def measured(sql, params=()):
        result = read(sql, params)
        if "SELECT * FROM messages" in sql and "session_id IN" in sql:
            payloads.append((len(result), sum(len(str(row["content"])) for row in result)))
        return result

    monkeypatch.setattr(db, "_read_all", measured)
    result = transcript.read_page(db, "cost", "default")
    assert len(result["data"]) == 120
    assert payloads and payloads[0][0] >= 1200
    assert payloads[0][1] > 2_400_000
    print(f"multi-rotation: response={len(result['data'])} payload_reads={payloads}")


def test_cursor_detects_in_place_rewrite_and_mid_read_mutation(db, monkeypatch):
    db.create_session("rewrite", source="desktop", profile_name="default")
    message = db.append_message("rewrite", "user", "Before")
    first = transcript.read_page(db, "rewrite", "default")
    db._conn.execute("UPDATE messages SET content=? WHERE id=?", ("After!", message))
    db._conn.commit()
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, "rewrite", "default", revision=first["transcript"]["revision"])
    assert error.value.status_code == 409
    original = db.get_messages

    def changed(*args, **kwargs):
        rows = original(*args, **kwargs)
        db.append_message("rewrite", "assistant", "Raced")
        return rows

    monkeypatch.setattr(db, "get_messages", changed)
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, "rewrite", "default")
    assert error.value.status_code == 409


def test_desktop_projection_tools_attachments_and_hidden_rows(db, monkeypatch):
    db.create_session("parts", source="desktop", profile_name="default")
    db.append_message("parts", "user", "Question with file\n@file:/tmp/synthetic.txt")
    db.append_message(
        "parts",
        "assistant",
        "Checking",
        tool_calls=[
            {"id": "call", "type": "function", "function": {"name": "terminal", "arguments": "{}"}}
        ],
    )
    db.append_message("parts", "tool", "Tool output", tool_call_id="call", tool_name="terminal")
    db.append_message("parts", "assistant", "Answer", reasoning="Saved thought")
    db.append_message("parts", "user", "[System: scaffold]")
    expected = desktop_page(db, monkeypatch, "parts", 120)
    actual = transcript.read_page(db, "parts", "default")["data"]
    assert [row["id"] for row in actual] == [row["id"] for row in expected]
    for plugin, desktop in zip(actual, expected, strict=True):
        if desktop.get("display_kind") == "hidden":
            assert plugin["content"] == ""
        else:
            for key in (
                "role",
                "content",
                "reasoning",
                "tool_calls",
                "tool_call_id",
                "tool_name",
                "display_metadata",
            ):
                assert plugin.get(key) == desktop.get(key)


def test_revision_rejects_rotation_and_cross_profile_lineage(db):
    db.create_session("rotate", source="desktop", profile_name="default")
    db.append_message("rotate", "user", "Original")
    cursor = transcript.read_page(db, "rotate", "default")["transcript"]["revision"]
    db.publish_compression_child(
        parent_session_id="rotate",
        child_session_id="rotated",
        source="desktop",
        profile_name="default",
        messages=db.get_messages("rotate"),
        require_compression_lease=False,
    )
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, "rotate", "default", revision=cursor)
    assert error.value.status_code == 409
    db._conn.execute("UPDATE sessions SET profile_name='beta' WHERE id='rotate'")
    db._conn.commit()
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, "rotated", "default")
    assert error.value.status_code == 404


def test_native_skill_display_survives_paging_and_preserves_model_history(db):
    from agent.skill_commands import describe_skill_invocation

    content = (
        '[IMPORTANT: The user has invoked the "work" skill. '
        "The full skill content is loaded below.]\n\n"
        "MODEL-ONLY-SKILL-BODY\n\n"
        "The user has provided the following instruction alongside the skill invocation: "
        "fix the title"
    )
    expected = describe_skill_invocation(content, separator=" ")
    assert expected == "/work fix the title"
    db.create_session("skill", source="desktop")
    db.append_message("skill", "user", content)
    db.append_message("skill", "assistant", "Done")
    page = transcript.read_page(db, "skill", "default", limit=1, offset=1)
    assert page["data"][0]["content"] == expected
    assert page["data"][0]["display_kind"] == "skill_invocation"
    assert "MODEL-ONLY-SKILL-BODY" not in str(page)
    assert db.get_messages("skill")[0]["content"] == content
    parts = [
        {"type": "text", "text": content},
        {"type": "image_url", "image_url": {"url": "synthetic-image"}},
    ]
    assert transcript._skill_display(parts) == [{"type": "text", "text": expected}, parts[1]]
    db.append_message("skill", "user", content, display_kind="hidden")
    hidden = transcript.read_page(db, "skill", "default", limit=1)["data"][0]
    assert hidden["display_kind"] == "hidden"
    assert hidden["content"] == ""
