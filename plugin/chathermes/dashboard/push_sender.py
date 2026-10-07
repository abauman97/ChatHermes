"""Optional Web Push delivery; transport and storage failures are isolated."""
import json
import logging
import re
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


def diagnostic(stage, profile, session_id, kind, **fields):
    def safe(value):
        return value if isinstance(value, str) and re.fullmatch(r'[A-Za-z0-9_-]{1,128}', value) else None
    write = log.warning if fields.get('exception') or fields.get('success') is False else log.info
    write('ChatHermes push %s', json.dumps(dict(stage=stage, profile=safe(profile),
        session=safe(session_id), kind=kind if kind in BODIES else None,
        **{key: value for key, value in fields.items() if
            (key == 'subscription' and safe(value) is not None) or
            (key in ('available', 'attempted', 'success', 'removed') and type(value) is bool) or
            (key == 'matching_enabled' and type(value) is int and value >= 0) or
            (key == 'http_status' and (value is None or type(value) is int and 100 <= value <= 599)) or
            (key == 'exception' and isinstance(value, str) and re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]{0,127}', value))}), separators=(',', ':')))


BODIES = {'turn.complete': 'Hermes finished responding.', 'approval': 'Hermes needs your approval.',
          'clarify': 'Hermes has a question.', 'attention': 'Hermes needs attention.',
          'test': 'This is a ChatHermes test notification.'}


def notify(profile, session_id, kind, dedupe_id):
    """Schedule delivery off the native event callback; never block Hermes."""
    diagnostic('sender.notify', profile, session_id, kind)
    try:
        import threading
        thread = threading.Thread(target=_deliver, args=(profile, session_id, kind, dedupe_id), daemon=True)
        thread.start()
        diagnostic('sender.scheduled', profile, session_id, kind, success=True)
        return True
    except Exception as error:
        diagnostic('sender.failure', profile, session_id, kind, exception=type(error).__name__)
        return False


def _deliver(profile, session_id, kind, dedupe_id):
    if kind not in BODIES or not isinstance(profile, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]{0,63}', profile):
        diagnostic('deliver.invalid', profile, session_id, kind)
        return
    if not isinstance(session_id, str) or (not re.fullmatch(r'[A-Za-z0-9_-]{1,128}', session_id) and not (kind == 'test' and session_id == '')):
        diagnostic('deliver.invalid', profile, session_id, kind)
        return
    report = lambda stage, **fields: diagnostic(stage, profile, session_id, kind, **fields)
    try:
        rows = push_store.subscriptions(profile)
        configuration = push_store.config()
        report('deliver.config', matching_enabled=len(rows), available=bool(configuration.get('available')))
        if not configuration.get('available') or not rows:
            return
        from pywebpush import webpush
        from py_vapid import Vapid
        from cryptography.hazmat.primitives import serialization
        with push_store._LOCK:
            data = push_store._read()
            vapid = Vapid.from_pem(data['vapid']['private_key'].encode())
        key = vapid.private_key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()).decode()
        payload = json.dumps({'type': kind, 'title': 'ChatHermes', 'body': BODIES[kind], 'profile': profile,
            'session_id': session_id, 'tag': f'chathermes:{profile}:{session_id}:{kind}'}, separators=(',', ':'))
        for row in rows:
            report('pywebpush.attempt', subscription=row.get('id'), attempted=True)
            try:
                endpoint = urlparse(row['endpoint'])
                response = webpush({'endpoint': row['endpoint'], 'keys': {'p256dh': row['p256dh'], 'auth': row['auth']}}, payload, vapid_private_key=key, vapid_claims={'sub': 'mailto:notifications@chathermes.local', 'aud': f'{endpoint.scheme}://{endpoint.netloc}'}, timeout=5)
                status = getattr(response, 'status_code', None)
                report('pywebpush.result', subscription=row.get('id'), attempted=True, success=True, http_status=status if type(status) is int else None)
            except Exception as error:
                status = getattr(getattr(error, 'response', None), 'status_code', None)
                status = status if type(status) is int else None
                report('pywebpush.result', subscription=row.get('id'), attempted=True, success=False, http_status=status, exception=type(error).__name__)
                if status in (404, 410):
                    try:
                        push_store.remove_endpoint(row['id'])
                        report('deliver.expired', subscription=row.get('id'), http_status=status, removed=True)
                    except Exception as removal_error:
                        report('deliver.expired', subscription=row.get('id'), http_status=status, removed=False, exception=type(removal_error).__name__)
    except Exception as error:
        report('deliver.failure', exception=type(error).__name__)
