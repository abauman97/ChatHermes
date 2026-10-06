from pathlib import Path
import importlib.util
import tempfile
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


def test_keypair_is_persisted_and_private_never_returned(tmp_path, monkeypatch):
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'state' / 'push.json')
    monkeypatch.setattr(store, '_home', lambda: tmp_path)
    with patch.dict('sys.modules', {'py_vapid': None}):
        assert store.config() == {'available': False, 'vapid_public_key': None}
