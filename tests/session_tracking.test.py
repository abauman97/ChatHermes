"""Durable manual tracking against the shared DB and pinned Hermes lineage."""

import importlib.util
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest
from hermes_state import SessionDB

ROOT = Path(__file__).resolve().parents[1] / "plugin/chathermes/dashboard"
spec = importlib.util.spec_from_file_location(
    "tracking_contract", ROOT / "session_tracking.py", submodule_search_locations=[str(ROOT)]
)
assert spec is not None and spec.loader is not None
tracking = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = tracking
spec.loader.exec_module(tracking)


@pytest.fixture
def state(tmp_path):
    return SimpleNamespace(_path=lambda: tmp_path / "push.json")


def test_persistence_isolation_idempotency_and_reactivation(state):
    assert tracking.entries(state, "alpha") == []
    first = tracking.mark(state, "alpha", "one", "open", new=True)
    assert tracking.mark(state, "alpha", "one", "open") == first
    tracking.mark(state, "alpha", "two", "open")
    settled = tracking.mark(state, "alpha", "one", "settled")
    assert settled["updated_at"] > first["updated_at"]
    assert tracking.mark(state, "alpha", "one", "open", new=True) == settled
    tracking.mark(state, "beta", "one", "open")
    # A fresh caller/connection sees persisted metadata; no in-memory cache.
    fresh = SimpleNamespace(_path=state._path)
    assert tracking.entries(fresh, "alpha")[0] == settled
    assert tracking.entries(fresh, "beta")[0]["status"] == "open"
    tracking.mark(fresh, "alpha", "one", "open")
    assert [row["session_id"] for row in tracking.entries(fresh, "alpha")] == ["one", "two"]
    tracking.remove(fresh, "alpha", "one")
    assert len(tracking.entries(fresh, "alpha")) == 1
    assert len(tracking.entries(fresh, "beta")) == 1
    with pytest.raises(ValueError):
        tracking.mark(fresh, "alpha", "one", "invalid")


@pytest.fixture
def history(tmp_path, monkeypatch):
    from hermes_cli import web_server_sessions

    path = tmp_path / "history.db"
    db = SessionDB(db_path=path)
    monkeypatch.setattr(
        web_server_sessions,
        "_open_session_db_for_profile",
        lambda profile, *, read_only: SessionDB(db_path=path, read_only=read_only),
    )
    try:
        yield db
    finally:
        db.close()


def test_listing_old_open_without_transcripts_archive_and_delete(state, history, monkeypatch):
    for index in range(40):
        history.create_session(f"session-{index}", source="desktop")
    history.set_session_title("session-0", "Older open chat")
    tracking.mark(state, "alpha", "session-0", "open")
    tracking.mark(state, "alpha", "session-1", "settled")
    # Sidebar reads must never request a transcript or runtime viewer.
    for method in ("get_messages", "get_messages_as_conversation"):
        monkeypatch.setattr(SessionDB, method, lambda *a, **k: pytest.fail("full history read"))
    result = tracking.listing(state, "alpha")
    assert [row["id"] for row in result["sessions"]] == ["session-0"]
    assert result["sessions"][0]["title"] == "Older open chat"
    history.set_session_archived("session-0", True)
    assert tracking.listing(state, "alpha")["sessions"] == []
    assert tracking.entries(state, "alpha")[1]["status"] == "open"
    history.set_session_archived("session-0", False)
    assert len(tracking.listing(state, "alpha")["sessions"]) == 1
    history.delete_session("session-0")
    tracking.remove_deleted(state, "alpha", "session-0")
    assert [row["session_id"] for row in tracking.entries(state, "alpha")] == ["session-1"]


@pytest.mark.parametrize("status", ["open", "settled"])
def test_compaction_preserves_status_order_and_does_not_inherit_forks(state, history, status):
    history.create_session("root", source="desktop")
    history.append_message("root", "user", "Keep this transcript intact")
    original = tracking.mark(state, "alpha", "root", status)
    history.archive_and_compact("root", [{"role": "user", "content": "summary"}], tail_count=0)
    assert tracking.reconcile(state, "alpha", history) == [original]
    history.publish_compression_child(
        parent_session_id="root",
        child_session_id="tip",
        source="desktop",
        messages=[{"role": "user", "content": "continuation"}],
        require_compression_lease=False,
    )
    history.create_session(
        "branch", source="desktop", parent_session_id="tip", model_config={"_branched_from": "tip"}
    )
    history.append_message("branch", "user", "Independent branch")
    history.create_session(
        "delegate", source="tool", parent_session_id="tip", model_config={"_delegate_from": "tip"}
    )
    history.append_message("delegate", "user", "Independent worker")
    expected = {**original, "session_id": "tip"}
    assert tracking.reconcile(state, "alpha", history) == [expected]
    assert tracking.reconcile(state, "alpha", history) == [expected]
    assert tracking.entries(state, "beta") == []
    assert tracking.listing(state, "alpha")["aliases"] == {"root": "tip"}
    # Settling writes only ChatHermes metadata. The running owner's DB is untouched.
    before = history.get_session("tip")
    messages = history.get_messages("tip")
    tracking.set_status(state, "alpha", "root", "settled")
    assert history.get_session("tip") == before
    assert history.get_messages("tip") == messages
    history.append_message("tip", "assistant", "Still allowed to complete")
    assert tracking.listing(state, "alpha")["tracking"][0]["status"] == "settled"


def test_newer_explicit_tip_status_wins_during_lineage_merge(state, history):
    history.create_session("root", source="desktop")
    history.append_message("root", "user", "Original")
    tracking.mark(state, "alpha", "root", "open")
    history.publish_compression_child(
        parent_session_id="root",
        child_session_id="tip",
        source="desktop",
        messages=[{"role": "user", "content": "continuation"}],
        require_compression_lease=False,
    )
    settled = tracking.mark(state, "alpha", "tip", "settled")
    assert tracking.reconcile(state, "alpha", history) == [settled]


def test_delete_captures_old_tracking_before_lineage_disappears(state, history):
    history.create_session("root", source="desktop")
    history.append_message("root", "user", "Original")
    tracking.mark(state, "alpha", "root", "open")
    tracking.mark(state, "alpha", "unrelated-draft", "open")
    history.publish_compression_child(
        parent_session_id="root",
        child_session_id="tip",
        source="desktop",
        messages=[{"role": "user", "content": "continuation"}],
        require_compression_lease=False,
    )
    targets = tracking.deletion_ids(state, "alpha", "tip")
    assert "root" in targets and "tip" in targets
    assert "unrelated-draft" not in targets
    history.delete_session("tip")
    tracking.remove_deleted(state, "alpha", targets)
    assert [row["session_id"] for row in tracking.entries(state, "alpha")] == ["unrelated-draft"]
