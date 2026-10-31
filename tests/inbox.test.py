"""Inbox contracts through real Hermes SQLite, reconciliation and durable plugin state."""

import asyncio
import importlib.util
import sys
import time
from pathlib import Path
from types import SimpleNamespace

import pytest
from hermes_state import SessionDB

ROOT = Path(__file__).resolve().parents[1] / "plugin/chathermes/dashboard"
spec = importlib.util.spec_from_file_location(
    "inbox_contract", ROOT / "inbox.py", submodule_search_locations=[str(ROOT)]
)
assert spec is not None and spec.loader is not None
inbox = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = inbox
spec.loader.exec_module(inbox)


@pytest.fixture
def state(tmp_path):
    return SimpleNamespace(_path=lambda: tmp_path / "plugin" / "push.json")


def test_offline_multi_profile_recovery_restart_read_and_no_initial_flood(
    state, tmp_path, monkeypatch
):
    paths = {name: tmp_path / f"{name}.db" for name in ("alpha", "beta")}
    for path in paths.values():
        db = SessionDB(db_path=path)
        db.create_session("same", source="desktop")
        db.set_session_title("same", "A chat")
        db.append_message("same", "user", "Old prompt", timestamp=1)
        db.append_message("same", "assistant", "Old response", timestamp=2)
        db.close()

    from hermes_cli import web_server_sessions

    def open_db(profile, *, read_only):
        assert read_only
        return SessionDB(db_path=paths[profile], read_only=True)

    monkeypatch.setattr(web_server_sessions, "_open_session_db_for_profile", open_db)

    class Source(inbox.Source):
        def __init__(self):
            self.offline = set()

        async def profiles(self):
            return ["alpha", "beta"]

        async def sessions(self, profile):
            if profile in self.offline:
                raise OSError("offline")
            db = open_db(profile, read_only=True)
            try:
                return db.list_sessions_rich(limit=100, order_by_last_active=True)
            finally:
                db.close()

        def attention(self, profile):
            return []

        def busy(self, profile):
            return set()

        def redact(self, profile):
            return lambda text: text.replace("provider-secret", "[redacted]")

    async def run():
        source = Source()
        await inbox.Service(source, state).reconcile()
        assert inbox.page(state, ["alpha", "beta"])["items"] == []
        # Both profiles complete while there is no service/frontend running.
        for profile, path in paths.items():
            db = SessionDB(db_path=path)
            db.append_message("same", "user", "New prompt")
            db.append_message("same", "assistant", "Calling a tool", tool_calls=[{"id": "t"}])
            db.append_message("same", "tool", "Tool result")
            db.append_message("same", "assistant", f"{profile} provider-secret final")
            db.close()
        source.offline.add("alpha")
        await inbox.Service(source, state).reconcile()
        assert inbox.page(state, ["alpha", "beta"])["unread"] == 1
        source.offline.clear()
        # Recreated service simulates restart; no in-memory deduplication survives.
        await inbox.Service(source, state).reconcile()
        result = inbox.page(state, ["alpha", "beta"])
        assert result["unread"] == 2
        assert result["byProfile"] == {"alpha": 1, "beta": 1}
        assert all("provider-secret" not in row["preview"] for row in result["items"])
        first = result["items"][0]
        assert inbox.mark_read(state, [first["profile"]], first["id"])
        # Live viewer replay of the identical committed row has the same address.
        inbox.record(state, first["profile"], "same", first["event_id"], first["kind"])
        await inbox.Service(source, state).reconcile()
        assert inbox.page(state, ["alpha", "beta"])["unread"] == 1
        assert len(inbox.page(state, ["alpha", "beta"])["items"]) == 2
        inbox.delete_read(state, ["alpha", "beta"])
        inbox.record(state, first["profile"], "same", first["event_id"], first["kind"])
        assert len(inbox.page(state, ["alpha", "beta"])["items"]) == 1

    asyncio.run(run())


def test_keyset_pages_filters_and_read_are_profile_scoped(state):
    for profile in ("alpha", "beta"):
        for n in range(3):
            inbox.record(state, profile, "same", n, "approval", occurred=100)
    result = inbox.page(state, ["alpha", "beta"], limit=2)
    ids = [item["id"] for item in result["items"]]
    while result["nextCursor"]:
        result = inbox.page(state, ["alpha", "beta"], limit=2, cursor=result["nextCursor"])
        ids.extend(item["id"] for item in result["items"])
    assert len(ids) == len(set(ids)) == 6
    item = inbox.page(state, ["alpha"])["items"][0]
    assert not inbox.mark_read(state, ["beta"], item["id"])
    assert inbox.mark_read(state, ["alpha"], item["id"])
    assert inbox.mark_read(state, ["alpha"], item["id"])
    assert inbox.delete_item(state, ["alpha"], item["id"])
    assert not inbox.delete_item(state, ["alpha"], item["id"])
    assert len(inbox.page(state, ["alpha"], unread=True)["items"]) == 2
    assert inbox.page(state, ["beta"])["unread"] == 3
    for cursor in ("oops", "nan:1", "100:0", "inf:2", "1:2:3"):
        with pytest.raises(ValueError):
            inbox.page(state, ["alpha"], cursor=cursor)


def test_native_requests_use_original_identity_and_read_never_resolves_them(state, monkeypatch):
    from tui_gateway import server

    native = {"session_key": "stored", "profile_home": "alpha-home"}
    request = {
        "id": "srq-42",
        "method": "approval",
        "params": {"request_id": "origin", "command": "private-secret"},
    }
    monkeypatch.setattr(server, "_snapshot_sessions", lambda _: ([("runtime", native)], None))
    monkeypatch.setattr(server, "_profile_home", lambda p: p + "-home")
    monkeypatch.setattr(server, "_open_requests", lambda sid: [request])
    monkeypatch.setattr(server, "_pending_connection_request_payload", lambda sid: None)
    source = inbox.Source(None)
    assert source.attention("beta") == []
    assert source.attention("alpha") == [("stored", "origin", "approval")]
    for session, identity, kind in source.attention("alpha"):
        inbox.record(state, "alpha", session, identity, kind)
    item = inbox.page(state, ["alpha"])["items"][0]
    assert item["preview"] == "Approval required"
    assert inbox.mark_read(state, ["alpha"], item["id"])
    assert source.attention("alpha") == [("stored", "origin", "approval")]
    assert "private-secret" not in str(inbox.page(state, ["alpha"]))


def test_initial_cutoff_is_durable_even_when_first_scan_fails(state):
    first = inbox.initialize(state, "alpha")
    assert inbox.initialize(state, "alpha") == first
    inbox.reconcile_rows(
        state,
        "alpha",
        {"id": "s"},
        [
            {"id": 1, "role": "assistant", "content": "Old", "timestamp": first - 1},
            {"id": 2, "role": "assistant", "content": "New", "timestamp": time.time()},
        ],
        first,
        "new",
        lambda s: s,
    )
    assert [row["preview"] for row in inbox.page(state, ["alpha"])["items"]] == ["New"]


def test_compaction_copies_keep_one_origin_and_preserve_read_state(state):
    since = inbox.initialize(state, "alpha")
    row = {
        "id": 1,
        "message_uid": "original-occurrence",
        "role": "assistant",
        "content": "Final",
        "timestamp": since + 1,
    }
    inbox.reconcile_rows(state, "alpha", {"id": "parent"}, [row], since, "parent", lambda s: s)
    item = inbox.page(state, ["alpha"])["items"][0]
    inbox.mark_read(state, ["alpha"], item["id"])
    inbox.reconcile_rows(
        state, "alpha", {"id": "continuation"}, [{**row, "id": 99}], since, "child", lambda s: s
    )
    result = inbox.page(state, ["alpha"])
    assert len(result["items"]) == 1 and result["unread"] == 0


def test_history_notices_exclude_interim_tool_and_summary_rows(state):
    since = inbox.initialize(state, "alpha")
    rows = [
        {"id": 1, "role": "user", "content": "Prompt"},
        {"id": 2, "role": "assistant", "content": "Intermediate"},
        {"id": 3, "role": "assistant", "content": "Tool call", "tool_calls": [{"id": "tool"}]},
        {"id": 4, "role": "tool", "content": "Private output"},
        {"id": 5, "role": "assistant", "content": "Final"},
        {"id": 6, "role": "user", "content": "Next"},
        {"id": 7, "role": "assistant", "content": "Summary", "_compressed_summary": True},
    ]
    inbox.reconcile_rows(
        state,
        "alpha",
        {"id": "s"},
        [{**row, "timestamp": since + 1} for row in rows],
        since,
        "v1",
        lambda s: s,
    )
    assert [row["preview"] for row in inbox.page(state, ["alpha"])["items"]] == ["Final"]
