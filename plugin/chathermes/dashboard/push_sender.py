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

# Only fixed labels leave the traceback. Never format an exception, frame,
# filename, source line, or locals: all can contain subscription/key material.
# Locations are the qualified code names in the pinned pywebpush/py-vapid APIs.
_SOURCES = {
    ('pywebpush', 'webpush'): 'webpush',
    ('pywebpush', 'WebPusher.__init__'): 'subscription_decode',
    ('pywebpush', 'WebPusher.as_curl_token'): 'subscription_decode',
    ('pywebpush', 'WebPusher._prepare_send_data'): 'vapid_key_decode',
    ('pywebpush', 'WebPusher.encode'): 'payload_encrypt',
    ('pywebpush', 'WebPusher.send'): 'http_send',
    ('py_vapid', 'Vapid01.from_der'): 'vapid_key_decode',
    ('py_vapid', 'Vapid01._base_sign'): 'vapid_claims',
    ('py_vapid', 'Vapid02.sign'): 'vapid_sign',
    ('http_ece', 'encrypt'): 'payload_encrypt',
    ('http_ece', 'derive_key.<locals>.derive_dh'): 'subscription_key',
    ('cryptography.hazmat.primitives.asymmetric.ec', 'EllipticCurvePublicKey.from_encoded_point'): 'subscription_key',
}
_SOURCE_LABELS = {'.'.join(location) for location in _SOURCES} | {'unknown'}
_FAILURE_STAGES = set(_SOURCES.values()) | {
    'schedule', 'subscriptions', 'configuration', 'dependencies', 'state_read',
    'vapid_key_load', 'vapid_key_export', 'payload_build', 'endpoint_parse', 'expired_remove',
}
_EXCEPTION_CLASSES = {
    'ValueError', 'TypeError', 'KeyError', 'IndexError', 'RuntimeError',
    'OSError', 'PermissionError', 'FileNotFoundError', 'ImportError',
    'ModuleNotFoundError', 'TimeoutError', 'Error', 'WebPushException',
    'VapidException', 'ECEException', 'InvalidKey', 'UnsupportedAlgorithm',
    'RequestException', 'ConnectionError', 'Timeout', 'ConnectTimeout',
    'ReadTimeout', 'SSLError', 'InvalidURL', 'MissingSchema', 'InvalidSchema',
}
_ERROR_CATEGORIES = {'invalid_value', 'invalid_type', 'missing_field', 'invalid_index',
                     'permission_denied', 'dependency_missing', 'timeout', 'library_error'}
_PUSH_HEADER_ALLOWLIST = {'content-type', 'retry-after', 'www-authenticate', 'date',
                          'x-webpush-status', 'x-request-id', 'apns-id'}


def _failure_details(error, failure_stage):
    """Use the innermost known library frame, without exposing arbitrary text.

    Unknown/new library locations retain the caller's stage. This reports where
    the error propagated, not a guessed root cause; no message matching needed.
    """
    name = type(error).__name__
    details = {
        'exception': name if name in _EXCEPTION_CLASSES else 'UnknownException',
        'failure_stage': failure_stage,
        'error_source': 'unknown',
        'error_category': {
            'ValueError': 'invalid_value', 'TypeError': 'invalid_type',
            'KeyError': 'missing_field', 'IndexError': 'invalid_index',
            'PermissionError': 'permission_denied', 'ImportError': 'dependency_missing',
            'ModuleNotFoundError': 'dependency_missing', 'TimeoutError': 'timeout',
            'Timeout': 'timeout', 'ConnectTimeout': 'timeout', 'ReadTimeout': 'timeout',
        }.get(name, 'library_error'),
    }
    tb = error.__traceback__
    selected = None
    while tb is not None:
        location = (tb.tb_frame.f_globals.get('__name__'), tb.tb_frame.f_code.co_qualname)
        if location in _SOURCES:
            selected = (location, tb.tb_lineno)
        tb = tb.tb_next
    error.__traceback__ = None
    if selected is not None:
        location, line = selected
        details.update(failure_stage=_SOURCES[location], error_source='.'.join(location),
                       error_line=line)
    return details


def _response_details(response):
    """Return bounded provider diagnostics without body, URL, or arbitrary headers."""
    if response is None:
        return {}
    details = {}
    reason = getattr(response, 'reason', None)
    if isinstance(reason, str) and re.fullmatch(r'[A-Za-z0-9 _.-]{1,80}', reason):
        details['http_reason'] = reason
    headers = getattr(response, 'headers', None)
    if headers is not None:
        safe_headers = {}
        for name, value in headers.items():
            key = str(name).lower()
            if key not in _PUSH_HEADER_ALLOWLIST or not isinstance(value, str):
                continue
            if re.fullmatch(r'[A-Za-z0-9 _.,:/+-]{1,160}', value):
                safe_headers[key] = value
        if safe_headers:
            details['provider_headers'] = safe_headers
    body = getattr(response, 'text', None)
    if isinstance(body, str) and body:
        details['provider_body'] = _sanitize_provider_body(body)
    return details


def _sanitize_provider_body(body):
    """Keep diagnostic wording but redact likely identifiers, endpoints and credentials."""
    text = body[:4096]
    text = re.sub(r'https?://\S+', '[redacted-url]', text, flags=re.IGNORECASE)
    text = re.sub(r'(?i)(authorization|token|secret|key|endpoint|subscription)\s*[=:]([^\s,;]+)',
                  r'\1=[redacted]', text)
    text = re.sub(r'(?i)bearer\s+\S+', 'Bearer [redacted]', text)
    text = re.sub(r'(?<![A-Za-z0-9])[A-Za-z0-9_-]{48,}(?![A-Za-z0-9])', '[redacted-token]', text)
    if len(text) > 2000:
        text = text[:1989] + '[truncated]'
    return text



def diagnostic(stage, profile, session_id, kind, **fields):
    def safe(value):
        return value if isinstance(value, str) and re.fullmatch(r'[A-Za-z0-9_-]{1,128}', value) else None
    write = log.warning if fields.get('exception') or fields.get('success') is False else log.info
    write('ChatHermes push %s', json.dumps(dict(stage=stage, profile=safe(profile),
        session=safe(session_id), kind=kind if kind in BODIES else None,
        **{key: value for key, value in fields.items() if
            (key in ('available', 'attempted', 'success', 'removed') and type(value) is bool) or
            (key == 'matching_enabled' and type(value) is int and value >= 0) or
            (key == 'http_status' and (value is None or type(value) is int and 100 <= value <= 599)) or
            (key == 'exception' and isinstance(value, str) and
             (value in _EXCEPTION_CLASSES or value == 'UnknownException')) or
            (key == 'failure_stage' and isinstance(value, str) and value in _FAILURE_STAGES) or
            (key == 'error_source' and isinstance(value, str) and value in _SOURCE_LABELS) or
            (key == 'error_category' and isinstance(value, str) and value in _ERROR_CATEGORIES) or
            (key == 'error_line' and type(value) is int and 1 <= value <= 100000) or
            (key == 'http_reason' and isinstance(value, str) and re.fullmatch(r'[A-Za-z0-9 _.-]{1,80}', value)) or
            (key == 'provider_body' and isinstance(value, str) and len(value) <= 2000) or
            (key == 'provider_headers' and isinstance(value, dict) and
             all(k in _PUSH_HEADER_ALLOWLIST and isinstance(v, str) and len(v) <= 160 for k, v in value.items()))}), separators=(',', ':')))


BODIES = {'turn.complete': 'Hermes finished responding.', 'approval': 'Hermes needs your approval.',
          'clarify': 'Hermes has a question.', 'attention': 'Hermes needs attention.',
          'test': 'This is a ChatHermes test notification.'}


def notify(profile, session_id, kind, dedupe_id, request=None):
    """Schedule delivery off the native event callback; never block Hermes."""
    diagnostic('sender.notify', profile, session_id, kind)
    try:
        import threading
        thread = threading.Thread(target=_deliver, args=(profile, session_id, kind, dedupe_id, request), daemon=True)
        thread.start()
        diagnostic('sender.scheduled', profile, session_id, kind, success=True)
        return True
    except Exception as error:
        diagnostic('sender.failure', profile, session_id, kind, **_failure_details(error, 'schedule'))
        return False


def _deliver(profile, session_id, kind, dedupe_id, request=None):
    if kind not in BODIES or not isinstance(profile, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]{0,63}', profile):
        diagnostic('deliver.invalid', profile, session_id, kind)
        return
    if not isinstance(session_id, str) or (not re.fullmatch(r'[A-Za-z0-9_-]{1,128}', session_id) and not (kind == 'test' and session_id == '')):
        diagnostic('deliver.invalid', profile, session_id, kind)
        return
    report = lambda stage, **fields: diagnostic(stage, profile, session_id, kind, **fields)
    failure_stage = 'subscriptions'
    try:
        rows = push_store.subscriptions(profile)
        failure_stage = 'configuration'
        configuration = push_store.config()
        report('deliver.config', matching_enabled=len(rows), available=bool(configuration.get('available')))
        if not configuration.get('available') or not rows:
            return
        failure_stage = 'dependencies'
        from pywebpush import webpush
        from py_vapid import Vapid
        with push_store._LOCK:
            failure_stage = 'state_read'
            data = push_store._read()
            failure_stage = 'vapid_key_load'
            vapid = Vapid.from_pem(data['vapid']['private_key'].encode())
        failure_stage = 'payload_build'
        payload = json.dumps({'type': kind, 'title': 'ChatHermes', 'body': BODIES[kind], 'profile': profile,
            'session_id': session_id, 'tag': f'chathermes:{profile}:{session_id}:{kind}'}, separators=(',', ':'))
        subject = push_store.vapid_subject(request)
        for row in rows:
            report('pywebpush.attempt', subscription=row.get('id'), attempted=True)
            try:
                failure_stage = 'endpoint_parse'
                endpoint = urlparse(row['endpoint'])
                failure_stage = 'webpush'
                response = webpush({'endpoint': row['endpoint'], 'keys': {'p256dh': row['p256dh'], 'auth': row['auth']}}, payload, vapid_private_key=vapid, vapid_claims={'sub': subject, 'aud': f'{endpoint.scheme}://{endpoint.netloc}'}, timeout=5)
                status = getattr(response, 'status_code', None)
                report('pywebpush.result', attempted=True, success=True, http_status=status if type(status) is int else None)
            except Exception as error:
                status = getattr(getattr(error, 'response', None), 'status_code', None)
                status = status if type(status) is int else None
                response = getattr(error, 'response', None)
                report('pywebpush.result', attempted=True, success=False, http_status=status,
                       **_failure_details(error, failure_stage), **_response_details(response))
                if status in (404, 410):
                    try:
                        push_store.remove_endpoint(row['id'])
                        report('deliver.expired', http_status=status, removed=True)
                    except Exception as removal_error:
                        report('deliver.expired', http_status=status, removed=False, **_failure_details(removal_error, 'expired_remove'))
    except Exception as error:
        report('deliver.failure', **_failure_details(error, failure_stage))
