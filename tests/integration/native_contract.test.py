"""Run inside the pinned Docker image; never against a personal Hermes home.

These probes record native admission limits and explicit queue semantics.
"""

import pytest
from pydantic import ValidationError
from tui_gateway import event_replay
from tui_gateway.contracts.prompt_voice import PromptSubmitParams
from tui_gateway.contracts.sessions import LiveSessionSnapshot


def test_pin_has_no_atomic_admission_receipt_or_busy_reject_param():
    fields = PromptSubmitParams.model_fields
    assert "idempotency_key" not in fields
    assert "receipt" not in fields
    assert "reject_if_busy" not in fields
    with pytest.raises(ValidationError):
        PromptSubmitParams.model_validate(
            {"session_id": "fixture", "text": "hello", "idempotency_key": "receipt"}
        )


def test_snapshot_has_no_sequence_epoch_watermark():
    fields = LiveSessionSnapshot.model_fields
    assert not {"seq", "latest_seq", "epoch", "replay_epoch", "last_seen"} & fields.keys()


def test_replay_objects_are_params_and_latest_seq_is_not_an_applied_watermark():
    event_replay.reset_replay_state()
    try:

        def stamp(text):
            frame = {
                "jsonrpc": "2.0",
                "method": "event",
                "params": {
                    "session_id": "fixture",
                    "type": "message.delta",
                    "payload": {"text": text},
                },
            }
            event_replay._stamp_event(frame)

        stamp("first")
        events = event_replay.events_since("fixture", 0)
        # A writer may stamp another event between the pin's events_since and
        # latest_seq calls. Advancing to latest_seq here would skip that event.
        stamp("second")
        latest = event_replay.latest_seq("fixture")
        assert [e["seq"] for e in events] == [1] and latest == 2
        assert "params" not in events[0] and events[0]["type"] == "message.delta"
        assert [e["seq"] for e in event_replay.events_since("fixture", events[-1]["seq"])] == [2]
        assert event_replay.events_since("fixture", latest) == []
    finally:
        event_replay.reset_replay_state()


def test_explicit_queue_never_redirects_or_steers_even_under_desktop_policy(monkeypatch):
    import threading
    from types import SimpleNamespace

    from tui_gateway import server

    def forbidden(*args, **kwargs):
        raise AssertionError("ordinary plugin send must never correct an active turn")

    session: dict = {
        "agent": SimpleNamespace(
            steer=forbidden,
            redirect=forbidden,
            interrupt=forbidden,
            _supports_active_turn_redirect=True,
        ),
        "session_key": "probe",
        "history": [],
        "history_lock": threading.Lock(),
        "history_version": 0,
        "running": True,
        "transport": None,
        "attached_images": [],
    }
    monkeypatch.setattr(server, "_load_busy_input_mode", lambda: "interrupt")
    monkeypatch.setattr(server, "_persist_queued_user_row", lambda *a: None)
    result = server._handle_busy_submit(  # ty: ignore[unresolved-attribute]  # Hermes binds split modules dynamically.
        "probe", "probe", session, "ordinary input", None, queued=True
    )
    assert result["result"]["status"] == "queued"
    assert session["running"] is True
    assert session["queued_prompt"]["text"] == "ordinary input"


def test_completion_watermark_uses_real_profile_database(tmp_path, monkeypatch):
    import importlib.util
    from pathlib import Path

    from hermes_cli import web_server_sessions
    from persistence import SessionId
    from persistence.conversation.messages import NewMessage
    from persistence.conversation.sessions import NewSession
    from persistence_assembly import open_persistence, open_persistence_reader, profile_scope

    source = Path("/opt/plugins-src/chathermes/dashboard/execution_viewer.py")
    spec = importlib.util.spec_from_file_location("native_completion_contract", source)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    paths = {}
    for profile in ("alpha", "beta"):
        path = paths[profile] = tmp_path / profile
        db = open_persistence(profile_scope(home=path), eager=True)
        try:
            db.sessions.create(NewSession(session_id=SessionId("same-id"), source="desktop"))
            db.messages.append("same-id", NewMessage(role="user", content="First"))
            db.messages.append("same-id", NewMessage(role="assistant", content=profile + " final"))
        finally:
            db.close()
    monkeypatch.setattr(
        web_server_sessions,
        "_open_session_db_for_profile",
        lambda profile, *, read_only: open_persistence_reader(paths[profile]),
    )
    before = module.watermark("alpha", "same-id")
    assert module.committed_completion("alpha", "same-id", before, "alpha final") is None
    db = open_persistence(profile_scope(home=paths["alpha"]), eager=True)
    try:
        db.messages.append("same-id", NewMessage(role="user", content="Second"))
        db.messages.append("same-id", NewMessage(role="assistant", content="alpha final"))
    finally:
        db.close()
    committed = module.committed_completion("alpha", "same-id", before, "alpha final")
    assert committed > before
    assert module.committed_completion("beta", "same-id", before, "alpha final") is None
    assert module.committed_completion("alpha", "same-id", committed, "alpha final") is None
