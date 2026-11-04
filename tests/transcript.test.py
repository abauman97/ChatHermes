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


@pytest.mark.parametrize("limit", [1, 2, 3, 7, 120])
@pytest.mark.parametrize("rotate", [False, True])
def test_uncovered_old_prompts_keep_their_original_interleaving(db, limit, rotate):
    db.create_session("gaps", source="desktop")
    expected = []
    for n in range(8):
        # Repetition is intentional; timestamps even regress. Order is occurrence order.
        expected.extend([("user", "Repeat"), ("assistant", f"Reply {n}")])
        db.append_message("gaps", "user", "Repeat", timestamp=1700000100 - n)
        db.append_message("gaps", "assistant", f"Reply {n}", timestamp=1700000100 - n)
    original = db.get_messages("gaps")
    # Real coverage verb, with old user rows missing from compressor coverage.
    # This reproduces the observed flags/clones without asserting why coverage was lost.
    db.archive_and_compact(
        "gaps",
        [{"role": "user", "content": "INTERNAL SUMMARY", "_compressed_summary": True}],
        covered_ids=[row["id"] for row in original if row["role"] == "assistant"],
    )
    if rotate:
        db.publish_compression_child(
            parent_session_id="gaps",
            child_session_id="continued",
            source="desktop",
            messages=db.get_messages("gaps"),
            require_compression_lease=False,
        )
    rows = []
    offset, revision = 0, None
    while True:
        page = transcript.read_page(db, "gaps", "default", limit, offset, revision)
        rows = page["data"] + rows
        cursor = page["transcript"]
        if not cursor["has_more"]:
            break
        offset, revision = cursor["next_offset"], cursor["revision"]
    visible = [row for row in rows if row.get("display_kind") not in ("hidden", "compaction")]
    assert [(row["role"], row["content"]) for row in visible] == expected
    assert len({row["display_id"] for row in visible}) == len(expected)
    assert len([row for row in rows if row.get("display_kind") == "compaction"]) == 1 + int(rotate)


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
    visible = [row for row in rows if row.get("display_kind") not in ("hidden", "compaction")]
    assert [(row["role"], row["content"]) for row in visible] == [
        item
        for n in range(168)
        for item in (
            ("user", f"Persisted prompt {n:03d}"),
            ("assistant", f"Persisted answer {n:03d}"),
        )
    ] + [("user", "Replacement after rewind"), ("assistant", "Replacement saved answer")]
    assert len({str(row["id"]) for row in rows}) == len(rows)
    assert len([row for row in rows if row.get("display_kind") == "compaction"]) == 3
    assert "INTERNAL COMPACTION SUMMARY" not in str(rows)
    assert "Persisted prompt 168" not in str(rows)
    for n, preceding in (
        (1, "Persisted answer 079"),
        (2, "Persisted answer 119"),
        (3, "Persisted answer 139"),
    ):
        markers = [i for i, row in enumerate(rows) if row.get("display_kind") == "compaction"]
        assert (
            next(
                row["content"]
                for row in reversed(rows[: markers[n - 1]])
                if row.get("display_kind") != "hidden"
            )
            == preceding
        )


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
    fresh = transcript.read_page(db, seeded["id"], "default")
    db.publish_compression_child(
        parent_session_id=seeded["tip"],
        child_session_id="new-tip",
        source="desktop",
        messages=db.get_messages(seeded["tip"])[-4:],
        require_compression_lease=False,
    )
    with pytest.raises(HTTPException) as error:
        transcript.read_page(
            db, seeded["id"], "default", offset=120, revision=fresh["transcript"]["revision"]
        )
    assert error.value.status_code == 409


def test_distinct_uids_preserve_identical_prompts_and_answers_at_the_same_timestamp(db):
    db.create_session("repeated", source="desktop")
    for _ in range(3):
        db.append_message("repeated", "user", "Repeat", timestamp=1700000000)
        db.append_message("repeated", "assistant", "Repeated answer", timestamp=1700000000)
    result = transcript.read_page(db, "repeated", "default")
    assert [row["role"] for row in result["data"]] == ["user", "assistant"] * 3
    assert len({row["display_id"] for row in result["data"]}) == 6


@pytest.mark.parametrize("rotate", [False, True])
@pytest.mark.parametrize("limit", [1, 2, 120])
@pytest.mark.parametrize("rewind", [False, True])
@pytest.mark.parametrize("rotate_again", [False, True])
def test_compaction_tool_stub_preserves_occurrences_and_child_rewind(
    db, rotate, limit, rewind, monkeypatch, rotate_again
):
    from hermes_cli.web_routers import sessions

    monkeypatch.setattr(sessions, "_history_profile_home", lambda profile: db.db_path.parent)
    db.create_session("tools", source="desktop", profile_name="alpha")
    # Same call ID, name, body and timestamp, but distinct durable occurrences.
    # A tool_call_id/content-based fix would incorrectly fold these real calls.
    for _ in range(2):
        db.append_message("tools", "user", "Ask", timestamp=1700000000)
        db.append_message(
            "tools",
            "tool",
            "Full original tool output",
            tool_call_id="call",
            tool_name="terminal",
            timestamp=1700000000,
        )
    held = db.get_messages_as_conversation("tools", include_row_ids=True)
    handoff = [
        {"role": "user", "content": "INTERNAL TOOL SUMMARY", "_compressed_summary": True},
        held[-2],
        {**held[-1], "content": "Shortened compaction stub"},
    ]
    tip = "tools"
    if rotate:
        tip = "tools-child"
        db.publish_compression_child(
            parent_session_id="tools",
            child_session_id=tip,
            source="desktop",
            profile_name="alpha",
            messages=handoff,
            require_compression_lease=False,
        )
        originals = db._read_all("SELECT * FROM messages WHERE session_id = 'tools'")
        assert len(originals) == 4
        assert all(row["active"] and not row["compacted"] for row in originals)
    else:
        db.archive_and_compact("tools", handoff)
    initial = transcript.read_page(db, "tools", "alpha")["data"]
    assert [row["content"] for row in initial if row["role"] == "tool"] == [
        "Full original tool output",
        "Full original tool output",
    ]
    # Carry the stub through another real rotation, where local display_order
    # coordinates need not increase. Then append another genuinely repeated call.
    if rotate_again:
        db.publish_compression_child(
            parent_session_id=tip,
            child_session_id="tools-tip",
            source="desktop",
            profile_name="alpha",
            messages=[
                {"role": "user", "content": "NEXT SUMMARY", "_compressed_summary": True},
                *db.get_messages_as_conversation(tip, include_row_ids=True)[-2:],
            ],
            require_compression_lease=False,
        )
        tip = "tools-tip"
    db.append_message(tip, "user", "Ask", timestamp=1700000000)
    db.append_message(
        tip,
        "tool",
        "Full original tool output",
        tool_call_id="call",
        tool_name="terminal",
        timestamp=1700000000,
    )
    if rewind:
        users = [row for row in db.get_messages(tip) if row["role"] == "user"]
        # Retire both the fresh occurrence and the carried shortened occurrence.
        db.rewind_to_message(tip, users[-2]["id"])
    before = [dict(row) for row in db._read_all("SELECT * FROM messages ORDER BY id")]
    rows, offset, revision = [], 0, None
    while True:
        page = transcript.read_page(db, "tools", "alpha", limit, offset, revision)
        assert page["session_id"] == tip
        rows = page["data"] + rows
        cursor = page["transcript"]
        if not cursor["has_more"]:
            break
        offset, revision = cursor["next_offset"], cursor["revision"]
    visible = [row for row in rows if row.get("display_kind") not in ("hidden", "compaction")]
    assert [(row["role"], row["content"]) for row in visible] == [
        ("user", "Ask"),
        ("tool", "Full original tool output"),
    ] * (1 if rewind else 3)
    assert len({row["display_id"] for row in visible}) == len(visible)
    assert [dict(row) for row in db._read_all("SELECT * FROM messages ORDER BY id")] == before
    for sid in ("tools", tip):
        with pytest.raises(HTTPException) as error:
            transcript.read_page(db, sid, "beta", limit)
        assert error.value.status_code == 404


@pytest.mark.parametrize("role", ["tool", "assistant"])
def test_in_place_prune_keeps_one_live_representative(db, role):
    db.create_session("prune", source="desktop")
    db.append_message(
        "prune", role, "Original output", tool_call_id="call" if role == "tool" else None
    )
    original = db.get_messages_as_conversation("prune", include_row_ids=True)[0]
    db.rewrite_pruned_rows("prune", [(original, {**original, "content": "Pruned output"})])
    rows = transcript.read_page(db, "prune", "default")["data"]
    assert [row["content"] for row in rows] == ["Pruned output"]


@pytest.mark.parametrize("carried", [1, 2])
@pytest.mark.parametrize("rewind", [False, True])
@pytest.mark.parametrize("limit", [1, 120])
@pytest.mark.parametrize("rotate", [False, True])
def test_legacy_backfilled_compaction_copies_preserve_occurrences_and_rewind(
    db, rewind, limit, carried, rotate
):
    db.create_session("legacy", source="desktop")
    for _ in range(2):
        db.append_message("legacy", "user", "Repeat", timestamp=1700000000)
        db.append_message("legacy", "assistant", "Answer", timestamp=1700000000)
    held = db.get_messages_as_conversation("legacy", include_row_ids=True)
    handoff = [
        {"role": "user", "content": "SUMMARY", "_compressed_summary": True},
        *held[-carried * 2 :],
    ]
    tip = "legacy"
    if rotate:
        tip = "legacy-child"
        db.publish_compression_child(
            parent_session_id="legacy",
            child_session_id=tip,
            source="desktop",
            messages=handoff,
            require_compression_lease=False,
        )
        # The real rotation contract leaves parent rows active, unlike an
        # in-place compaction. Do not emulate rotation by retiring those rows.
        originals = db._read_all("SELECT active FROM messages WHERE session_id = 'legacy'")
        assert len(originals) == 4
        assert all(row["active"] for row in originals)
        assert db.get_session("legacy")["end_reason"] == "compression"
    else:
        db.archive_and_compact("legacy", handoff)

    # Emulate pre-v31 storage, then execute the actual pinned migration. No
    # hand-assigned UIDs or adapter mocks: each historical copy gets a fresh UID.
    def legacy(conn):
        conn.execute("UPDATE messages SET message_uid = NULL")
        conn.execute(
            "DELETE FROM state_meta WHERE key IN ('message_uid_backfill', 'message_uid_backfill_id')"
        )
        db._advance_message_uid_backfill(conn.cursor())

    db._execute_write(legacy)
    copies = db._read_all(
        "SELECT message_uid, display_identity FROM messages WHERE role = 'assistant'"
    )
    assert len({row["message_uid"] for row in copies}) == 2 + carried
    assert len({row["display_identity"] for row in copies}) == 1
    if rewind:
        users = [row for row in db.get_messages(tip) if row["role"] == "user"]
        db.rewind_to_message(tip, users[-1]["id"])
    before = [dict(row) for row in db._read_all("SELECT * FROM messages ORDER BY id")]
    rows, offset, revision = [], 0, None
    while True:
        page = transcript.read_page(db, "legacy", "default", limit, offset, revision)
        assert page["session_id"] == tip
        rows = page["data"] + rows
        cursor = page["transcript"]
        if not cursor["has_more"]:
            break
        offset, revision = cursor["next_offset"], cursor["revision"]
    visible = [row for row in rows if row.get("display_kind") != "compaction"]
    assert [(row["role"], row["content"]) for row in visible] == [
        ("user", "Repeat"),
        ("assistant", "Answer"),
    ] * (1 if rewind else 2)
    assert len({row["display_id"] for row in visible}) == len(visible)
    assert [dict(row) for row in db._read_all("SELECT * FROM messages ORDER BY id")] == before


@pytest.mark.parametrize("rotate", [False, True])
def test_backfilled_copies_still_fold_after_new_uid_preserving_compaction(db, rotate):
    seed_legacy = load(ROOT / "tests/fixtures/transcript.py").seed_legacy_pruned
    seed_legacy(db, "upgraded")
    held = db.get_messages_as_conversation("upgraded", include_row_ids=True)[1:]
    summary = {"role": "user", "content": "NEXT SUMMARY", "_compressed_summary": True}
    if rotate:
        db.publish_compression_child(
            parent_session_id="upgraded",
            child_session_id="child",
            source="desktop",
            messages=[summary, *held],
            require_compression_lease=False,
        )
    else:
        db.archive_and_compact("upgraded", [summary, *held])
    rows = transcript.read_page(db, "upgraded", "default")["data"]
    visible = [row for row in rows if row.get("display_kind") != "compaction"]
    assert [row["content"] for row in visible] == [
        "Repeated legacy ask",
        "Repeated legacy answer",
        "Repeated legacy ask",
        "Repeated legacy answer",
        "Inspect assistant prune",
        "Pruned assistant response",
    ]


def test_rotation_uid_links_keep_distinct_repeated_sends_and_branch_isolation(db):
    db.create_session("repeats", source="desktop")

    def send(sid):
        db.append_message(sid, "user", "Repeat", timestamp=1700000000)
        db.append_message(sid, "assistant", "Answer", timestamp=1700000000)

    send("repeats")
    send("repeats")
    held = db.get_messages_as_conversation("repeats", include_row_ids=True)
    db.publish_compression_child(
        parent_session_id="repeats",
        child_session_id="repeat-child",
        source="desktop",
        messages=[
            {"role": "user", "content": "SUMMARY", "_compressed_summary": True},
            *held[-2:],
        ],
        require_compression_lease=False,
    )
    send("repeat-child")
    for rewound in (False, True):
        if rewound:
            users = [row for row in db.get_messages("repeat-child") if row["role"] == "user"]
            db.rewind_to_message("repeat-child", users[-1]["id"])
        before = [dict(row) for row in db._read_all("SELECT * FROM messages ORDER BY id")]
        rows = transcript.read_page(db, "repeats", "default")["data"]
        visible = [row for row in rows if row.get("display_kind") != "compaction"]
        assert [(row["role"], row["content"]) for row in visible] == [
            ("user", "Repeat"),
            ("assistant", "Answer"),
        ] * (2 if rewound else 3)
        assert len({row["display_id"] for row in visible}) == len(visible)
        assert [dict(row) for row in db._read_all("SELECT * FROM messages ORDER BY id")] == before

    db.create_session(
        "repeat-branch",
        source="desktop",
        parent_session_id="repeats",
        model_config={"_branched_from": "repeats"},
    )
    send("repeat-branch")
    assert [
        row["content"]
        for row in transcript.read_page(db, "repeat-branch", "default")["data"]
        if row.get("display_kind") != "compaction"
    ] == [
        "Repeat",
        "Answer",
    ]


def test_payload_and_sidecar_rewrites_invalidate_pagination(db):
    db.create_session("rewrite", source="desktop")
    db.append_message("rewrite", "user", "Ask")
    answer = db.append_message("rewrite", "assistant", "Before")
    for column, value in (("content", "Edited"), ("reasoning_content", "Thought")):
        first = transcript.read_page(db, "rewrite", "default", limit=1)
        # Same row, same length content and unchanged display identity.
        db._execute_write(
            lambda conn, column=column, value=value: conn.execute(
                f"UPDATE messages SET {column} = ? WHERE id = ?", (value, answer)
            )
        )
        with pytest.raises(HTTPException) as error:
            transcript.read_page(
                db,
                "rewrite",
                "default",
                limit=1,
                offset=1,
                revision=first["transcript"]["revision"],
            )
        assert error.value.status_code == 409


def test_mutation_during_page_read_is_rejected(db, monkeypatch):
    db.create_session("race", source="desktop")
    db.append_message("race", "user", "Original")
    original = db._row_to_message_dict

    def concurrent(*args, **kwargs):
        result = original(*args, **kwargs)
        db.append_message("race", "assistant", "Concurrent append")
        return result

    monkeypatch.setattr(db, "_row_to_message_dict", concurrent)
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, "race", "default")
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


def test_rotation_without_flag_uses_proven_compression_edge(db):
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
        "",
        "After rotation",
    ]
    assert visible[2]["display_kind"] == "compaction"


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


@pytest.mark.parametrize("rotate", [False, True])
def test_large_session_initial_page_never_materializes_all_payloads(db, monkeypatch, rotate):
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
    if rotate:
        db.publish_compression_child(
            parent_session_id="large",
            child_session_id="large-child",
            source="desktop",
            messages=db.get_messages("large")[-8:],
            require_compression_lease=False,
        )
    original = db._row_to_message_dict
    reads = []

    def bounded(*args, **kwargs):
        reads.append(args[0]["id"])
        assert len(reads) <= 121
        return original(*args, **kwargs)

    monkeypatch.setattr(db, "_row_to_message_dict", bounded)
    result = transcript.read_page(db, "large", "default")
    assert len([row for row in result["data"] if row.get("display_kind") != "compaction"]) == 120
    assert result["data"][0]["content"].startswith("02280 ")
    assert next(row for row in reversed(result["data"]) if row.get("display_kind") != "compaction")[
        "content"
    ].startswith("02399 ")
    assert result["transcript"]["has_more"] is True
    assert len(reads) == 121
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


@pytest.mark.parametrize("rotate", [False, True])
def test_reopened_read_only_history_matches_desktop_for_unambiguous_occurrences(
    tmp_path, rotate, monkeypatch
):
    from agent.context_compressor import _SUMMARY_END_MARKER, ContextCompressor
    from hermes_cli.web_routers import sessions
    from hermes_cli.web_routers.sessions import _project_for_display
    from tui_gateway import server

    monkeypatch.setattr(sessions, "_history_profile_home", lambda profile: tmp_path)
    path = tmp_path / "persisted.db"
    with SessionDB(db_path=path) as writer:
        writer.create_session("saved", source="desktop", profile_name="alpha")
        for n in range(10):
            writer.append_message("saved", "user", f"Ask {n}")
            writer.append_message("saved", "assistant", f"Answer {n}")
        tail = writer.get_messages_as_conversation("saved", include_row_ids=True)[-4:]
        summary = {
            "role": "user",
            "content": ContextCompressor._with_summary_prefix("INTERNAL SUMMARY")
            + "\n"
            + _SUMMARY_END_MARKER,
            "_compressed_summary": True,
        }
        if rotate:
            writer.publish_compression_child(
                parent_session_id="saved",
                child_session_id="continued",
                source="desktop",
                profile_name="alpha",
                messages=[summary, *tail],
                require_compression_lease=False,
            )
        else:
            writer.archive_and_compact("saved", [summary, *tail])
    # Reopen the actual persisted database, as authenticated history routes do.
    with SessionDB(db_path=path, read_only=True) as reader:
        tip = reader.resolve_resume_session_id("saved")
        rest = reader.get_messages(tip, include_compacted=True, include_ancestors=True)
        _, resume = reader.get_resume_conversations(tip)

        def visible(rows):
            return [
                (row["role"], row.get("display_content", row.get("content")))
                for row in _project_for_display(rows, home=tmp_path)
                if row.get("display_kind") not in ("hidden", "compaction")
            ]

        expected = [
            (role, f"{prefix} {n}")
            for n in range(10)
            for role, prefix in (("user", "Ask"), ("assistant", "Answer"))
        ]
        assert visible(rest) == expected
        assert [
            (row["role"], row["text"])
            for row in vars(server)["_history_to_messages"](resume, profile_home=tmp_path)
        ] == expected
        before = [dict(row) for row in reader._read_all("SELECT * FROM messages ORDER BY id")]
        rows, offset, revision = [], 0, None
        while True:
            page = transcript.read_page(reader, "saved", "alpha", 3, offset, revision)
            rows = page["data"] + rows
            cursor = page["transcript"]
            if not cursor["has_more"]:
                break
            offset, revision = cursor["next_offset"], cursor["revision"]
        assert visible(rows) == expected
        assert [
            dict(row) for row in reader._read_all("SELECT * FROM messages ORDER BY id")
        ] == before
        with pytest.raises(HTTPException) as error:
            transcript.read_page(reader, "saved", "beta")
        assert error.value.status_code == 404


def test_foreign_compression_ancestor_is_not_disclosed(db):
    db.create_session("root", source="desktop", profile_name="alpha")
    db.append_message("root", "user", "Private ancestor")
    db.publish_compression_child(
        parent_session_id="root",
        child_session_id="child",
        source="desktop",
        profile_name="beta",
        messages=[{"role": "user", "content": "Child"}],
        require_compression_lease=False,
    )
    with pytest.raises(HTTPException) as error:
        transcript.read_page(db, "child", "beta")
    assert error.value.status_code == 404


def test_profile_page_reopens_only_the_selected_profile_store(tmp_path, monkeypatch):
    from hermes_cli import web_server_sessions
    from hermes_cli.web_routers import sessions

    paths = {name: tmp_path / f"{name}.db" for name in ("alpha", "beta")}
    for name, path in paths.items():
        with SessionDB(db_path=path) as writer:
            writer.create_session("same-id", source="desktop", profile_name=name)
            writer.append_message("same-id", "user", f"{name} persisted ask")

    opened = []

    def open_db(profile, *, read_only):
        assert read_only
        opened.append(profile)
        return SessionDB(db_path=paths[profile], read_only=True)

    monkeypatch.setattr(web_server_sessions, "_open_session_db_for_profile", open_db)
    monkeypatch.setattr(sessions, "_history_profile_home", lambda profile: tmp_path)
    for name in paths:
        result = transcript.read_profile_page(name, "same-id", 120, 0, None)
        assert [row["content"] for row in result["data"]] == [f"{name} persisted ask"]
    assert opened == ["alpha", "beta"]
