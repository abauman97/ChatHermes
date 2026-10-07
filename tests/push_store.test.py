from pathlib import Path
import importlib.util
import json
import pytest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('chathermes_push_store_under_test', Path(__file__).parents[1] / 'plugin/chathermes/dashboard/push_store.py')
store = importlib.util.module_from_spec(spec)
spec.loader.exec_module(store)


def test_upsert_validation_scoping_and_unsubscribe(tmp_path, monkeypatch):
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'state' / 'push.json')
    first = {'endpoint': 'https://push.test/a', 'keys': {'p256dh': 'abc_DEF', 'auth': 'auth_123'}}
    one = store.upsert('alpha', first)
    again = store.upsert('alpha', first)
    two = store.upsert('beta', {**first, 'endpoint': 'https://push.test/b'})
    assert one['id'] == again['id']
    assert [row['profile'] for row in store.subscriptions('alpha')] == ['alpha']
    assert len(store.subscriptions('beta')) == 1
    assert 'endpoint' not in one and 'p256dh' not in one
    assert store.remove('beta', two['id'])
    assert store.subscriptions('beta') == []
    for bad in ({}, {'endpoint': 'http://push.test/a', 'keys': first['keys']}, {'endpoint': 'https://push.test/a', 'keys': {'p256dh': 'x', 'auth': 'y'}, 'extra': 1}):
        try:
            store.upsert('alpha', bad)
            assert False, 'invalid subscription accepted'
        except ValueError:
            pass


@pytest.mark.parametrize('missing', ['py_vapid', 'pywebpush'])
def test_missing_dependency_disables_push_without_creating_state(tmp_path, monkeypatch, missing):
    path = tmp_path / 'state' / 'push.json'
    monkeypatch.setattr(store, '_path', lambda: path)
    with patch.dict('sys.modules', {missing: None}):
        assert store.config() == {'available': False, 'vapid_public_key': None}
    assert not path.exists()


def test_keypair_is_persisted_and_private_never_returned(tmp_path, monkeypatch):
    path = tmp_path / 'state' / 'push.json'
    monkeypatch.setattr(store, '_path', lambda: path)
    # from_raw decodes base64url; arbitrary random bytes are not a key.
    from py_vapid import Vapid
    with patch.object(Vapid, 'from_raw', side_effect=AssertionError('raw decoder is not a key generator')):
        first = store.config()
    assert first['available'] is True
    assert len(first['vapid_public_key']) == 87
    saved = json.loads(path.read_text())
    assert saved['vapid']['private_key'] not in json.dumps(first)
    assert path.stat().st_mode & 0o777 == 0o600
    assert store.config() == first
    assert json.loads(path.read_text()) == saved
    # Existing keys must not make a missing delivery library appear available.
    with patch.dict('sys.modules', {'pywebpush': None}):
        assert store.config() == {'available': False, 'vapid_public_key': None}
    assert json.loads(path.read_text()) == saved
    saved['vapid']['public_key'] = 'mismatched-key'
    path.write_text(json.dumps(saved))
    assert store.config() == {'available': False, 'vapid_public_key': None}


def test_installed_sender_uses_persisted_key_and_content_free_payload(tmp_path, monkeypatch):
    import pywebpush
    sender_spec = importlib.util.spec_from_file_location('chathermes_push_sender_under_test',
                                                       Path(store.__file__).with_name('push_sender.py'))
    sender = importlib.util.module_from_spec(sender_spec)
    sender_spec.loader.exec_module(sender)
    monkeypatch.setattr(sender, 'push_store', store)
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'push.json')
    configuration = store.config()
    assert configuration['available'] is True
    store.upsert('alpha', {'endpoint': 'https://push.test/a', 'keys': {'p256dh': 'key_123', 'auth': 'auth_123'}})
    store.upsert('beta', {'endpoint': 'https://push.test/b', 'keys': {'p256dh': 'key_456', 'auth': 'auth_456'}})
    sent = []
    monkeypatch.setattr(pywebpush, 'webpush', lambda subscription, payload, **options: sent.append((subscription, json.loads(payload), options)))
    sender._deliver('alpha', 'session_123', 'turn.complete', 'event_123')
    assert len(sent) == 1
    subscription, payload, options = sent[0]
    assert subscription['endpoint'] == 'https://push.test/a'
    assert payload['body'] == 'Hermes finished responding.'
    assert payload['session_id'] == 'session_123'
    assert options['vapid_claims']['aud'] == 'https://push.test'
    assert options['timeout'] == 5
    assert options['vapid_private_key'] not in json.dumps(payload)
    assert store.config() == configuration


def test_availability_diagnostics_do_not_log_exception_details(tmp_path, monkeypatch, caplog):
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'push.json')
    private_detail = 'synthetic-private-key-material'
    def fail_write(value):
        raise PermissionError(private_detail)
    monkeypatch.setattr(store, '_write', fail_write)
    assert store.config() == {'available': False, 'vapid_public_key': None}
    assert 'PermissionError' in caplog.text
    assert 'dependencies and push state permissions' in caplog.text
    assert private_detail not in caplog.text


@pytest.mark.parametrize('status', [404, 410, 500, None])
def test_delivery_failure_isolated_and_diagnostics_safe(tmp_path, monkeypatch, caplog, status):
    import logging, types, pywebpush
    sender_spec = importlib.util.spec_from_file_location('sender_failure', Path(store.__file__).with_name('push_sender.py'))
    sender = importlib.util.module_from_spec(sender_spec)
    sender_spec.loader.exec_module(sender)
    monkeypatch.setattr(sender, 'push_store', store)
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'push.json')
    assert store.config()['available']
    secret = 'NEVER_LOG_PRIVATE_CONTENT'
    for profile, endpoint in [('alpha', 'first'), ('alpha', 'second'), ('beta', 'first')]:
        store.upsert(profile, {'endpoint': 'https://push.test/' + endpoint, 'keys': {'p256dh': secret, 'auth': secret}})
    calls = []
    def send(subscription, payload, **options):
        calls.append(json.loads(payload))
        if len(calls) == 1:
            error = RuntimeError(secret + subscription['endpoint'] + options['vapid_private_key'])
            error.response = types.SimpleNamespace(status_code=status)
            raise error
        return types.SimpleNamespace(status_code=201)
    monkeypatch.setattr(pywebpush, 'webpush', send)
    with caplog.at_level(logging.INFO):
        sender._deliver('alpha', '', 'test', secret)
    assert len(calls) == 2 and all(p['type'] == 'test' and p['session_id'] == '' for p in calls)
    assert len(store.subscriptions('alpha')) == (1 if status in (404, 410) else 2)
    assert len(store.subscriptions('beta')) == 1
    records = [json.loads(r.message.split('ChatHermes push ', 1)[1]) for r in caplog.records if r.message.startswith('ChatHermes push ')]
    assert records[0]['matching_enabled'] == 2 and records[0]['available']
    results = [r for r in records if r['stage'] == 'pywebpush.result']
    assert results[0]['success'] is False and results[0]['http_status'] == status
    assert results[0]['exception'] == 'RuntimeError'
    assert results[1]['success'] is True and results[1]['http_status'] == 201
    assert secret not in caplog.text and 'https://push.test' not in caplog.text
    assert 'PRIVATE KEY' not in caplog.text


def test_store_and_thread_failures_do_not_escape(tmp_path, monkeypatch, caplog):
    import logging, threading
    sender_spec = importlib.util.spec_from_file_location('sender_isolation', Path(store.__file__).with_name('push_sender.py'))
    sender = importlib.util.module_from_spec(sender_spec)
    sender_spec.loader.exec_module(sender)
    monkeypatch.setattr(sender, 'push_store', store)
    def fail(*a, **k):
        raise PermissionError('private-secret')
    monkeypatch.setattr(store, 'subscriptions', fail)
    with caplog.at_level(logging.INFO):
        sender._deliver('alpha', 'session', 'attention', '1')
        monkeypatch.setattr(threading, 'Thread', fail)
        assert sender.notify('alpha', 'session', 'attention', '1') is False
    assert 'deliver.failure' in caplog.text and 'sender.failure' in caplog.text
    assert 'PermissionError' in caplog.text and 'private-secret' not in caplog.text


def test_expired_removal_failure_does_not_skip_next_device(tmp_path, monkeypatch):
    import types, pywebpush
    sender_spec = importlib.util.spec_from_file_location('sender_removal', Path(store.__file__).with_name('push_sender.py'))
    sender = importlib.util.module_from_spec(sender_spec)
    sender_spec.loader.exec_module(sender)
    monkeypatch.setattr(sender, 'push_store', store)
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'push.json')
    for endpoint in ('one', 'two'):
        store.upsert('alpha', {'endpoint': 'https://push.test/' + endpoint, 'keys': {'p256dh': 'key', 'auth': 'auth'}})
    calls = []
    def send(*a, **k):
        calls.append(a)
        if len(calls) == 1:
            error = RuntimeError('secret')
            error.response = types.SimpleNamespace(status_code=410)
            raise error
    def fail(*a):
        raise OSError('secret')
    monkeypatch.setattr(pywebpush, 'webpush', send)
    monkeypatch.setattr(store, 'remove_endpoint', fail)
    sender._deliver('alpha', 'session', 'approval', '1')
    assert len(calls) == 2


@pytest.mark.parametrize('available', [False, True])
def test_no_matching_enabled_subscriptions_never_attempt_transport(tmp_path, monkeypatch, caplog, available):
    import logging, pywebpush
    from unittest.mock import Mock
    sender_spec = importlib.util.spec_from_file_location('sender_unavailable', Path(store.__file__).with_name('push_sender.py'))
    sender = importlib.util.module_from_spec(sender_spec)
    sender_spec.loader.exec_module(sender)
    monkeypatch.setattr(sender, 'push_store', store)
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'push.json')
    store.upsert('alpha', {'endpoint': 'https://push.test/disabled', 'keys': {'p256dh': 'key', 'auth': 'auth'}})
    data = store._read()
    data['subscriptions'][0]['enabled'] = False
    store._write(data)
    store.upsert('beta', {'endpoint': 'https://push.test/other', 'keys': {'p256dh': 'key', 'auth': 'auth'}})
    monkeypatch.setattr(store, 'config', lambda: {'available': available})
    send = Mock()
    monkeypatch.setattr(pywebpush, 'webpush', send)
    with caplog.at_level(logging.INFO):
        sender._deliver('alpha', 'session', 'turn.complete', '1')
    send.assert_not_called()
    assert '"matching_enabled":0' in caplog.text
    assert '"available":' + str(available).lower() in caplog.text


def test_structured_diagnostics_filter_untrusted_fields(caplog):
    import logging
    sender_spec = importlib.util.spec_from_file_location('sender_diagnostics', Path(store.__file__).with_name('push_sender.py'))
    sender = importlib.util.module_from_spec(sender_spec)
    sender_spec.loader.exec_module(sender)
    secret = 'https://private.test/key-secret'
    with caplog.at_level(logging.INFO):
        sender.diagnostic('deliver.failure', secret, secret, secret, endpoint=secret,
            payload=secret, http_status=secret, matching_enabled=secret, exception=secret)
    record = json.loads(caplog.records[-1].message.split('ChatHermes push ', 1)[1])
    assert record == {'stage': 'deliver.failure', 'profile': None, 'session': None, 'kind': None}
    assert secret not in caplog.text


def test_notify_reports_thread_start_result(monkeypatch):
    import threading
    sender_spec = importlib.util.spec_from_file_location('sender_schedule', Path(store.__file__).with_name('push_sender.py'))
    sender = importlib.util.module_from_spec(sender_spec)
    sender_spec.loader.exec_module(sender)
    starts = []
    class Thread:
        def __init__(self, target, args, daemon):
            assert target == sender._deliver and daemon is True
            assert args == ('alpha', 'stored', 'turn.complete', '1')
        def start(self): starts.append(True)
    monkeypatch.setattr(threading, 'Thread', Thread)
    assert sender.notify('alpha', 'stored', 'turn.complete', '1') is True
    assert starts == [True]
    def fail(self): raise OSError('private-secret')
    monkeypatch.setattr(Thread, 'start', fail)
    assert sender.notify('alpha', 'stored', 'turn.complete', '1') is False
