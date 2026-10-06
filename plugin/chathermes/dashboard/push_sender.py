"""Optional Web Push delivery; transport and storage failures are isolated."""
import json
import logging
from urllib.parse import urlparse

try:
    from . import push_store
except ImportError:
    import importlib.util
    from pathlib import Path
    spec = importlib.util.spec_from_file_location('chathermes_push_store', Path(__file__).with_name('push_store.py'))
    push_store = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(push_store)

log = logging.getLogger(__name__)


def notify(profile, session_id, kind, dedupe_id):
    """Schedule delivery off the native event callback; never block Hermes."""
    try:
        import threading
        thread = threading.Thread(target=_deliver, args=(profile, session_id, kind, dedupe_id), daemon=True)
        thread.start()
    except Exception:
        log.warning('ChatHermes push could not be scheduled; chat execution continues')


def _deliver(profile, session_id, kind, dedupe_id):
    if kind not in {'turn.complete', 'approval', 'clarify', 'attention'}:
        return
    if not isinstance(profile, str) or not isinstance(session_id, str):
        return
    if (not profile.replace('_', '').replace('-', '').isalnum()
            or not session_id or len(session_id) > 128
            or not all(c.isalnum() or c in '_-' for c in session_id)):
        return
    configuration = push_store.config()
    if not configuration.get('available'):
        return
    try:
        from pywebpush import webpush
        from py_vapid import Vapid
        from cryptography.hazmat.primitives import serialization
        import base64
        with push_store._LOCK:
            data = push_store._read()
            private = data['vapid']['private_key']
            vapid = Vapid.from_pem(private.encode())
        key = vapid.private_key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()).decode()
        bodies = {'turn.complete': 'Hermes finished responding.', 'approval': 'Hermes needs your approval.', 'clarify': 'Hermes has a question.', 'attention': 'Hermes needs attention.'}
        payload = json.dumps({'type': kind, 'title': 'ChatHermes', 'body': bodies[kind], 'profile': profile, 'session_id': session_id, 'event_id': str(dedupe_id)[:128], 'tag': f'chathermes:{profile}:{session_id}:{kind}'}, separators=(',', ':'))
        for row in push_store.subscriptions(profile):
            try:
                endpoint = urlparse(row['endpoint'])
                webpush({'endpoint': row['endpoint'], 'keys': {'p256dh': row['p256dh'], 'auth': row['auth']}}, payload, vapid_private_key=key, vapid_claims={'sub': 'mailto:notifications@chathermes.local', 'aud': f'{endpoint.scheme}://{endpoint.netloc}'}, timeout=5)
            except Exception as error:
                status = getattr(getattr(error, 'response', None), 'status_code', None)
                if status in (404, 410):
                    push_store.remove_endpoint(row['id'])
                else:
                    log.warning('ChatHermes Web Push delivery failed (status=%s)', status)
    except Exception:
        log.warning('ChatHermes Web Push is unavailable; chat execution continues')
