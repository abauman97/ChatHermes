"""Run inside the pinned Docker image; never against a personal Hermes home.

These probes record native admission limits and explicit queue semantics.
"""
import pytest
from pydantic import ValidationError
from tui_gateway.contracts.prompt_voice import PromptSubmitParams
from tui_gateway.contracts.sessions import LiveSessionSnapshot
from tui_gateway import event_replay


def test_pin_has_no_atomic_admission_receipt_or_busy_reject_param():
    fields = PromptSubmitParams.model_fields
    assert 'idempotency_key' not in fields
    assert 'receipt' not in fields
    assert 'reject_if_busy' not in fields
    with pytest.raises(ValidationError):
        PromptSubmitParams.model_validate({'session_id': 'fixture', 'text': 'hello', 'idempotency_key': 'receipt'})


def test_snapshot_has_no_sequence_epoch_watermark():
    fields = LiveSessionSnapshot.model_fields
    assert not {'seq', 'latest_seq', 'epoch', 'replay_epoch', 'last_seen'} & fields.keys()


def test_replay_objects_are_params_and_latest_seq_is_not_an_applied_watermark():
    event_replay.reset_replay_state()
    try:
        def stamp(text):
            frame = {'jsonrpc': '2.0', 'method': 'event', 'params': {'session_id': 'fixture', 'type': 'message.delta', 'payload': {'text': text}}}
            event_replay._stamp_event(frame)
        stamp('first')
        events = event_replay.events_since('fixture', 0)
        # A writer may stamp another event between the pin's events_since and
        # latest_seq calls. Advancing to latest_seq here would skip that event.
        stamp('second')
        latest = event_replay.latest_seq('fixture')
        assert [e['seq'] for e in events] == [1] and latest == 2
        assert 'params' not in events[0] and events[0]['type'] == 'message.delta'
        assert [e['seq'] for e in event_replay.events_since('fixture', events[-1]['seq'])] == [2]
        assert event_replay.events_since('fixture', latest) == []
    finally:
        event_replay.reset_replay_state()


def test_explicit_queue_never_redirects_or_steers_even_under_desktop_policy(monkeypatch):
    import threading
    from types import SimpleNamespace
    from tui_gateway import server
    def forbidden(*args, **kwargs):
        raise AssertionError('ordinary plugin send must never correct an active turn')
    session = {'agent': SimpleNamespace(steer=forbidden, redirect=forbidden,
                  interrupt=forbidden, _supports_active_turn_redirect=True),
               'session_key': 'probe', 'history': [], 'history_lock': threading.Lock(),
               'history_version': 0, 'running': True, 'transport': None, 'attached_images': []}
    monkeypatch.setattr(server, '_load_busy_input_mode', lambda: 'interrupt')
    monkeypatch.setattr(server, '_persist_queued_user_row', lambda *a: None)
    result = server._handle_busy_submit('probe', 'probe', session, 'ordinary input', None, queued=True)
    assert result['result']['status'] == 'queued'
    assert session['running'] is True
    assert session['queued_prompt']['text'] == 'ordinary input'
