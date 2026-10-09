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


@pytest.mark.parametrize('method, answer', [
    ('clarify', 'Blue (Recommended)'), ('clarify', 'My exact other response'),
    ('clarify', 'Blue (Recommended), Green'), ('secret', 'synthetic-secret-response')])
def test_request_adapter_delivers_exact_payload_to_pinned_response_handler(monkeypatch, method, answer):
    import asyncio
    import importlib.util
    from pathlib import Path
    from tui_gateway import server_requests

    def load(name):
        source = Path('/opt/plugins-src/chathermes/dashboard') / (name + '.py')
        spec = importlib.util.spec_from_file_location('clarification_' + name, source)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    module, gateway = load('native_channel'), load('gateway_transport')
    received, frames = [], []
    params = ({'questions': [{'qid': 'q0', 'question': 'Colour?', 'choices': ['Blue (Recommended)', 'Green'], 'multi_select': True}]}
              if method == 'clarify' else {'env_var': 'SYNTHETIC_TOKEN', 'prompt': 'Synthetic token?'})
    result = {'answers': {'q0': answer}} if method == 'clarify' else {'value': answer}
    request = server_requests.ServerRequest('request-ui-probe', method, params,
        qids=['q0'] if method == 'clarify' else [], on_result=received.append)
    resolve = server_requests.resolve_response
    # Keep the pinned one-argument API: a stale transport argument must fail.
    def capture(frame):
        frames.append(frame)
        return resolve(frame)
    monkeypatch.setattr(server_requests, 'resolve_response', capture)
    async def answer_request():
        transport = gateway._RpcTransport()
        try:
            monkeypatch.setattr(server_requests, '_write', transport.write)
            server_requests._register(request)
            # Exercise the actual thread-safe frame delivery and correlation:
            # the srq ID belongs to the server request, not the chat.answer RPC.
            incoming = await asyncio.wait_for(transport.events.get(), timeout=5)
            assert incoming == request.frame()
            channel = module.Channel(None, transport, 'synthetic-profile')
            channel.runtime = incoming['params']['session_id']
            reply = await channel.handle({
                'jsonrpc': '2.0', 'id': 'c-answer', 'method': 'chat.answer',
                'params': {'request_id': incoming['id'],
                           'result': result}
            })
            assert reply == {'jsonrpc': '2.0', 'id': 'c-answer', 'result': {'settled': True}}
            if method == 'secret':
                assert transport.sanitize(answer) == '[redacted]'
        finally:
            transport.close()
    try:
        asyncio.run(answer_request())
        assert frames == [{'jsonrpc': '2.0', 'id': request.id, 'result': result}]
        expected = {**result, 'outcome': 'submitted'} if method == 'clarify' else result
        assert received == [expected]
        assert request.answered and request.event.is_set()
        assert not server_requests.open_requests(request.sid)
    finally:
        with server_requests._lock:
            server_requests._open.pop(request.id, None)


def test_unsupported_request_uses_pinned_one_argument_resolver(monkeypatch):
    import importlib.util
    from pathlib import Path
    from tui_gateway import server_requests
    source = Path('/opt/plugins-src/chathermes/dashboard/native_owners.py')
    spec = importlib.util.spec_from_file_location('unsupported_native_owners', source)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    responses, published = [], []
    # A strict one-argument stub catches accidental transport arguments here too.
    monkeypatch.setattr(server_requests, 'resolve_response', lambda frame: responses.append(frame))
    owner = module.Owner.__new__(module.Owner)
    owner.runtime, owner.profile = 'synthetic-runtime', 'synthetic-profile'
    owner.publish = published.append
    owner.capture({'jsonrpc': '2.0', 'id': 'unsupported-1', 'method': 'unsupported.fixture',
                   'params': {'session_id': owner.runtime}})
    assert responses == [{'id': 'unsupported-1', 'error': {
        'code': server_requests.NOT_SHOWN_CODE, 'message': 'Unavailable in ChatHermes'}}]
    assert published == [{'jsonrpc': '2.0', 'method': 'chat.unsupported',
                          'params': {'method': 'unsupported.fixture'}}]


def test_secret_request_is_delivered_without_recording(monkeypatch):
    import importlib.util
    from pathlib import Path
    from tui_gateway import server_requests
    source = Path('/opt/plugins-src/chathermes/dashboard/native_owners.py')
    spec = importlib.util.spec_from_file_location('secret_native_owners', source)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    def forbidden(*args):
        raise AssertionError('secret request must not be declined or persisted')
    monkeypatch.setattr(server_requests, 'resolve_response', forbidden)
    owner = module.Owner.__new__(module.Owner)
    owner.runtime, owner.profile = 'synthetic-runtime', 'synthetic-profile'
    owner.record = forbidden
    owner.notified = set()
    notifications = []
    owner.notify = lambda *args: notifications.append(args)
    published = []
    owner.publish = published.append
    frame = {'jsonrpc': '2.0', 'id': 'secret-1', 'method': 'secret', 'params': {
        'session_id': owner.runtime, 'env_var': 'SYNTHETIC_TOKEN', 'prompt': 'Synthetic token?'}}
    owner.capture(frame)
    assert notifications == [('secret', 'secret-1')]
    assert published == [frame]
