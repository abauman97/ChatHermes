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


def test_large_session_initial_page_never_materializes_all_payloads(db, monkeypatch):
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
