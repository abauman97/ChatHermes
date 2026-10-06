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
