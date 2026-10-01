"""Cookie-gated dashboard routes that proxy the Bearer-only Hermes gateway."""

import os
import re
from urllib.parse import quote

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response, StreamingResponse

try:
    import httpx
except ImportError:  # The dashboard can still start and show an actionable error.
    httpx = None

router = APIRouter()
_PROFILE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
_AUTH_ERROR = "Hermes gateway authentication failed; check platforms.api_server.key"


def _gateway_settings():
    from hermes_cli.config import load_config

    from hermes_cli.web_server_profiles import _config_profile_scope
    with _config_profile_scope(None):
        config = load_config() or {}
    server = (config.get("platforms") or {}).get("api_server") or {}
    host = server.get("host") or os.environ.get("API_SERVER_HOST") or "127.0.0.1"
    port = server.get("port") or os.environ.get("API_SERVER_PORT") or "8642"
    key = server.get("key") or os.environ.get("API_SERVER_KEY")
    return f"http://{host}:{port}", key


def _target(request: Request, route: str):
    profile = request.query_params.get("profile", "")
    if profile and not _PROFILE.fullmatch(profile):
        raise HTTPException(422, "Invalid profile name")
    base, key = _gateway_settings()
    if profile and profile != "default":
        key = _profile_gateway_key(profile)
    if not key:
        raise HTTPException(503, _AUTH_ERROR)
    prefix = f"/p/{profile}" if profile else ""
    params = [(name, value) for name, value in request.query_params.multi_items() if name != "profile"]
    return base.rstrip("/") + prefix + route, key, params


def _client():
    if httpx is None:
        raise HTTPException(503, "httpx is required for ChatHermes; install httpx in the dashboard environment")
    return httpx.AsyncClient(timeout=httpx.Timeout(30.0, read=None))


def _safe_body(body: bytes, key: str) -> bytes:
    # A broken gateway must never reflect credentials to the browser.
    return body.replace(key.encode(), b"[redacted]")


def _error_response(upstream, key: str):
    if upstream.status_code in (401, 403):
        raise HTTPException(503, _AUTH_ERROR)
    media_type = upstream.headers.get("content-type", "application/json")
    if key in media_type:
        media_type = "application/octet-stream"
    return Response(_safe_body(upstream.content, key), status_code=upstream.status_code,
                    media_type=media_type)


async def _proxy(request: Request, route: str):
    url, key, params = _target(request, route)
    body = await request.body()
    try:
        async with _client() as client:
            upstream = await client.request(request.method, url, params=params,
                content=body if body else None,
                headers={"Authorization": f"Bearer {key}",
                         **({"Content-Type": request.headers["content-type"]} if "content-type" in request.headers else {})})
    except HTTPException:
        raise
    except httpx.RequestError:
        raise HTTPException(502, "Hermes gateway is unreachable")
    return _error_response(upstream, key)


async def _stream(request: Request, route: str):
    url, key, params = _target(request, route)
    body = await request.body()
    client = _client()
    stream = client.stream(request.method, url, params=params, content=body if body else None,
        headers={"Authorization": f"Bearer {key}", "Content-Type": request.headers.get("content-type", "application/json"),
                 "Accept": "text/event-stream"})
    try:
        upstream = await stream.__aenter__()
    except httpx.RequestError:
        await client.aclose()
        raise HTTPException(502, "Hermes gateway is unreachable")
    if upstream.status_code in (401, 403):
        await stream.__aexit__(None, None, None)
        await client.aclose()
        raise HTTPException(503, _AUTH_ERROR)
    if upstream.status_code >= 400:
        try:
            await upstream.aread()
            return _error_response(upstream, key)
        finally:
            await stream.__aexit__(None, None, None)
            await client.aclose()

    async def frames():
        # Hold a short suffix so a reflected key split across network chunks is redacted.
        pending = b""
        secret = key.encode()
        try:
            async for chunk in upstream.aiter_bytes():
                if await request.is_disconnected():
                    break
                pending += chunk
                safe = pending.replace(secret, b"[redacted]")
                keep = max(len(secret) - 1, 0)
                if len(safe) > keep:
                    emit, pending = safe[:-keep] if keep else safe, safe[-keep:] if keep else b""
                    yield emit
            if pending:
                yield pending.replace(secret, b"[redacted]")
        finally:
            await stream.__aexit__(None, None, None)
            await client.aclose()

    return StreamingResponse(frames(), status_code=upstream.status_code, media_type="text/event-stream")


@router.get("/capabilities")
@router.get("/v1/capabilities", include_in_schema=False)
async def capabilities(request: Request):
    return await _proxy(request, "/v1/capabilities")


@router.get("/sessions")
@router.post("/sessions")
@router.get("/api/sessions", include_in_schema=False)
@router.post("/api/sessions", include_in_schema=False)
async def sessions(request: Request):
    return await _proxy(request, "/api/sessions")


@router.get("/sessions/{session_id}")
@router.patch("/sessions/{session_id}")
@router.delete("/sessions/{session_id}")
@router.get("/api/sessions/{session_id}", include_in_schema=False)
@router.patch("/api/sessions/{session_id}", include_in_schema=False)
@router.delete("/api/sessions/{session_id}", include_in_schema=False)
async def session(request: Request, session_id: str):
    return await _proxy(request, "/api/sessions/" + quote(session_id, safe=""))


@router.get("/sessions/{session_id}/messages")
@router.get("/api/sessions/{session_id}/messages", include_in_schema=False)
async def messages(request: Request, session_id: str):
    return await _proxy(request, "/api/sessions/" + quote(session_id, safe="") + "/messages")


@router.post("/sessions/{session_id}/chat/stream")
@router.post("/api/sessions/{session_id}/chat/stream", include_in_schema=False)
async def chat_stream(request: Request, session_id: str):
    return await _stream(request, "/api/sessions/" + quote(session_id, safe="") + "/chat/stream")


@router.post("/runs/{run_id}/stop")
@router.post("/v1/runs/{run_id}/stop", include_in_schema=False)
async def stop(request: Request, run_id: str):
    return await _proxy(request, "/v1/runs/" + quote(run_id, safe="") + "/stop")


@router.get("/runs/{run_id}")
@router.get("/v1/runs/{run_id}", include_in_schema=False)
async def run_status(request: Request, run_id: str):
    return await _proxy(request, "/v1/runs/" + quote(run_id, safe=""))


@router.get("/runs/{run_id}/events")
@router.get("/v1/runs/{run_id}/events", include_in_schema=False)
async def run_events(request: Request, run_id: str):
    return await _stream(request, "/v1/runs/" + quote(run_id, safe="") + "/events")


@router.get('/profiles')
async def profiles():
    from hermes_cli.profiles import list_profiles
    from starlette.concurrency import run_in_threadpool
    entries = await run_in_threadpool(list_profiles)
    return {'profiles': [{'name': entry.name} for entry in entries]}


@router.get('/v1/models')
async def models(request: Request):
    import json
    from fastapi.responses import JSONResponse
    response = await _proxy(request, '/v1/models')
    if response.status_code != 200:
        return response
    payload = json.loads(response.body)
    default = _configured_default_model(request.query_params.get('profile', ''))
    if default:
        payload['default_model'] = default
    return JSONResponse(payload)


@router.get('/api/model/options')
async def model_options(request: Request):
    """Expose only picker IDs and labels, never provider transport/auth metadata."""
    import json
    from fastapi.responses import JSONResponse
    response = await _proxy(request, '/api/model/options')
    if response.status_code != 200:
        raise HTTPException(response.status_code, 'Could not load model options')
    try:
        payload = json.loads(response.body)
        providers = []
        for row in payload.get('providers', []):
            if not isinstance(row, dict) or not isinstance(row.get('slug'), str):
                continue
            if row.get('authenticated') is False and not row.get('is_current'):
                continue
            providers.append({
                'slug': row['slug'],
                'name': row.get('name') if isinstance(row.get('name'), str) else row['slug'],
                'is_current': row.get('is_current') is True,
                'models': [mid for mid in row.get('models', []) if isinstance(mid, str)]
            })
        return JSONResponse({
            'providers': providers,
            'provider': payload.get('provider') if isinstance(payload.get('provider'), str) else '',
            'model': payload.get('model') if isinstance(payload.get('model'), str) else ''
        })
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(502, 'Invalid Hermes model options')


def _profile_gateway_key(profile: str):
    from agent.secret_scope import get_secret
    from hermes_cli.web_server_profiles import _config_profile_scope
    with _config_profile_scope(profile):
        return get_secret('API_SERVER_KEY', '')


def _configured_default_model(profile: str):
    from hermes_cli.config import load_config
    from hermes_cli.web_server_profiles import _config_profile_scope
    with _config_profile_scope(profile or None):
        config = load_config() or {}
        model = config.get('model', {})
        value = model.get('default', '') if isinstance(model, dict) else model
        return value if isinstance(value, str) else ''


def _upload_home(request: Request):
    from pathlib import Path
    from hermes_cli.profiles import get_profile_dir
    from hermes_constants import get_hermes_home
    profile = request.query_params.get('profile', '')
    if profile and not _PROFILE.fullmatch(profile):
        raise HTTPException(422, 'Invalid profile name')
    home = Path(get_profile_dir(profile) if profile else get_hermes_home())
    if not home.is_dir():
        raise HTTPException(404, 'Profile not found')
    return home


@router.post('/uploads', status_code=201)
async def upload(request: Request):
    """Store bounded file uploads in the agent's profile, without accepting client paths."""
    import base64
    import binascii
    import json
    import uuid
    from starlette.concurrency import run_in_threadpool

    home = _upload_home(request)
    limit = 20 * 1024 * 1024
    body = bytearray()
    async for chunk in request.stream():
        body.extend(chunk)
        if len(body) > (limit * 4 // 3) + 4096:
            raise HTTPException(413, 'File must be 20 MB or smaller')
    try:
        payload = json.loads(body)
        name = payload['name']
        encoded = payload['data']
        if not isinstance(name, str) or len(name) > 255 or not isinstance(encoded, str):
            raise ValueError()
        header, separator, data = encoded.partition(',')
        if not separator or not header.startswith('data:') or not header.endswith(';base64'):
            raise ValueError()
        content = base64.b64decode(data, validate=True)
    except (ValueError, KeyError, TypeError, binascii.Error):
        raise HTTPException(422, 'Invalid file upload')
    if len(content) > limit:
        raise HTTPException(413, 'File must be 20 MB or smaller')
    if not content:
        raise HTTPException(422, 'File is empty')
    # Never use the supplied filename as a path; retain only a short safe extension.
    extension = name.rsplit('.', 1)[-1].lower() if '.' in name else ''
    extension = '.' + extension if re.fullmatch(r'[a-z0-9]{1,12}', extension) else ''
    path = home / 'uploads' / 'chathermes' / (uuid.uuid4().hex + extension)
    def store():
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open('xb') as handle:
            handle.write(content)
        path.chmod(0o600)
    await run_in_threadpool(store)
    return {'path': str(path)}
