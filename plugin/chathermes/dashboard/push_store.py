"""Persistent, profile-scoped Web Push subscriptions and VAPID identity."""
import base64
import json
import logging
import os
import re
import secrets
import threading
import time
from pathlib import Path

_LOCK = threading.RLock()
_LOG = logging.getLogger(__name__)
_PROFILE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]{0,63}\Z")


def _home():
    from hermes_constants import get_process_hermes_home
    return Path(get_process_hermes_home()).resolve()


def _path():
    return _home() / 'state' / 'chathermes-push.json'


def _read():
    path = _path()
    try:
        value = json.loads(path.read_text())
        if isinstance(value, dict) and isinstance(value.get('subscriptions'), list):
            return value
    except (OSError, ValueError):
        if path.exists():
            _LOG.warning('ChatHermes push state could not be read; push disabled')
        pass
    return {'subscriptions': []}


def _write(value):
    path = _path()
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(path.parent, 0o700)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(value, separators=(',', ':')))
    os.chmod(tmp, 0o600)
    os.replace(tmp, path)
    os.chmod(path, 0o600)


def config():
    try:
        from pywebpush import webpush  # noqa: F401 - availability includes delivery transport.
        from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
        from py_vapid import Vapid
        with _LOCK:
            data = _read()
            vapid = data.get('vapid')
            if not isinstance(vapid, dict) or not isinstance(vapid.get('private_key'), str) or not isinstance(vapid.get('public_key'), str):
                key = Vapid()
                key.generate_keys()
                vapid = {'private_key': key.private_pem().decode('ascii'), 'public_key': _b64url(key.public_key.public_bytes(encoding=Encoding.X962, format=PublicFormat.UncompressedPoint))}
                data['vapid'] = vapid
                _write(data)
            else:
                key = Vapid.from_pem(vapid['private_key'].encode())
                if _b64url(key.public_key.public_bytes(encoding=Encoding.X962, format=PublicFormat.UncompressedPoint)) != vapid['public_key']:
                    _LOG.warning('ChatHermes Web Push is unavailable: persisted VAPID keys do not match')
                    return {'available': False, 'vapid_public_key': None}
            return {'available': True, 'vapid_public_key': vapid['public_key']}
    except Exception as error:
        # Third-party exception text can contain private key material. Log only
        # the exception class and actionable, static guidance.
        _LOG.warning('ChatHermes Web Push is unavailable (%s); check Hermes plugin dependencies and push state permissions', type(error).__name__)
        return {'available': False, 'vapid_public_key': None}


def _b64url(value):
    return base64.urlsafe_b64encode(value).rstrip(b'=').decode('ascii')


def upsert(profile, subscription):
    if not isinstance(profile, str) or not _PROFILE.fullmatch(profile):
        raise ValueError('Invalid profile')
    if not isinstance(subscription, dict) or set(subscription) != {'endpoint', 'keys'} or not isinstance(subscription['keys'], dict) or set(subscription['keys']) != {'p256dh', 'auth'}:
        raise ValueError('Invalid subscription')
    endpoint, p256dh, auth = subscription['endpoint'], subscription['keys']['p256dh'], subscription['keys']['auth']
    from urllib.parse import urlparse
    parsed = urlparse(endpoint) if isinstance(endpoint, str) else None
    if not isinstance(endpoint, str) or len(endpoint) > 2048 or not parsed or parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password or any(c in endpoint for c in '\r\n'):
        raise ValueError('Invalid endpoint')
    if not isinstance(p256dh, str) or len(p256dh) > 256 or not re.fullmatch(r'[A-Za-z0-9_-]+', p256dh) or not isinstance(auth, str) or len(auth) > 128 or not re.fullmatch(r'[A-Za-z0-9_-]+', auth):
        raise ValueError('Invalid subscription keys')
    with _LOCK:
        data = _read()
        found = next((row for row in data['subscriptions'] if row['endpoint'] == endpoint and row['profile'] == profile), None)
        if found is None:
            found = {'id': secrets.token_urlsafe(18), 'created_at': int(time.time())}
            data['subscriptions'].append(found)
        found.update({'profile': profile, 'endpoint': endpoint, 'p256dh': p256dh, 'auth': auth, 'updated_at': int(time.time()), 'enabled': True})
        _write(data)
        return {'id': found['id'], 'profile': profile, 'created_at': found['created_at'], 'enabled': True}


def remove(profile, identity):
    with _LOCK:
        data = _read()
        old = len(data['subscriptions'])
        data['subscriptions'] = [row for row in data['subscriptions'] if not (row.get('id') == identity and row.get('profile') == profile)]
        if old != len(data['subscriptions']):
            _write(data)
            return True
        return False


def subscriptions(profile):
    with _LOCK:
        return [dict(row) for row in _read()['subscriptions'] if row.get('profile') == profile and row.get('enabled') is True]


def remove_endpoint(identity):
    with _LOCK:
        data = _read()
        old = len(data['subscriptions'])
        data['subscriptions'] = [row for row in data['subscriptions'] if row.get('id') != identity]
        if old != len(data['subscriptions']):
            _write(data)
