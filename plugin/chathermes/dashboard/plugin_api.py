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
    stream = client.stream("POST", url, params=params, content=body,
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
