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
    if request.method == 'POST':
        # REST creation ignores workspace fields on the pin. Use the RPC route.
        try:
            body = await request.json()
        except ValueError:
            raise HTTPException(422, 'Invalid session request')
        if not isinstance(body, dict):
            raise HTTPException(422, 'Invalid session request')
        if any(field in body for field in ('project_id', 'project', 'cwd')):
            raise HTTPException(422, 'Use the Project session route for workspace chats')
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


# Projects and workspace chats use the dashboard's own gateway dispatcher. This
# is the same RPC admission/profile/runtime path as /api/ws, without a browser
# connection, credentials, native database writes, or a second session store.
class _RpcTransport:
    def __init__(self):
        import asyncio
        self.loop = asyncio.get_running_loop()
        self.events = asyncio.Queue(maxsize=256)
        self.pending = {}
        self.closed = False
        self.sequence = 0
        self.secret = ''

    @property
    def _closed(self):
        # Hermes transport liveness and reapers inspect this field.
        return self.closed

    def write(self, frame):
        if self.closed or self.loop.is_closed():
            return False
        def redact(value):
            if isinstance(value, str):
                return value.replace(self.secret, '[redacted]') if self.secret else value
            if isinstance(value, dict):
                return {key: redact(item) for key, item in value.items()}
            if isinstance(value, list):
                return [redact(item) for item in value]
            return value
        frame = redact(frame)
        def deliver():
            if self.closed:
                return
            future = self.pending.get(frame.get('id'))
            if future is not None:
                if not future.done():
                    future.set_result(frame)
            elif self.events.full():
                self.close()
            else:
                self.events.put_nowait(frame)
        self.loop.call_soon_threadsafe(deliver)
        return True

    async def call(self, method, params):
        import asyncio
        from starlette.concurrency import run_in_threadpool
        self.sequence += 1
        rid = str(self.sequence)
        future = self.loop.create_future()
        self.pending[rid] = future
        try:
            from tui_gateway import server
            response = await run_in_threadpool(server.dispatch,
                {'jsonrpc': '2.0', 'id': rid, 'method': method, 'params': params}, self)
            if response is not None:
                self.write(response)
            frame = await asyncio.wait_for(future, timeout=90)
            if 'error' in frame:
                error = frame['error']
                code = error.get('code')
                message = error.get('message', '')
                data = error.get('data')
                if isinstance(message, str) and 'cwd_explicit' in message and isinstance(data, dict):
                    message += ' ' + str(data)
                if isinstance(message, str) and 'cwd_explicit' in message and 'Extra inputs are not permitted' in message:
                    raise _CwdExplicitUnsupported()
                raise HTTPException(501 if code == -32601 else 409, 'Hermes RPC could not complete this operation')
            return frame['result']
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(503, 'Hermes gateway RPC is unavailable')
        finally:
            self.pending.pop(rid, None)

    def close(self):
        if self.closed:
            return
        self.closed = True
        try:
            from tui_gateway import server
            server.unregister_live_transport(self)
            server._close_sessions_for_transport(self, end_reason='ws_disconnect')
        except ImportError:
            pass


class _CwdExplicitUnsupported(Exception):
    pass


def _rpc_profile(request):
    profile = request.query_params.get('profile', '') or 'default'
    if not _PROFILE.fullmatch(profile):
        raise HTTPException(422, 'Invalid profile name')
    return profile


def _new_rpc_transport(request):
    profile = _rpc_profile(request)
    transport = _RpcTransport()
    # Match the existing proxy's reflected-Bearer protection for RPC responses,
    # including asynchronous tool/model errors. Never expose raw RPC exceptions.
    try:
        transport.secret = (_gateway_settings()[1] if profile == 'default' else _profile_gateway_key(profile)) or ''
    except Exception:
        transport.close()
        raise HTTPException(503, 'Could not access the Hermes profile')
    return transport


async def _rpc(request, method, params=None):
    transport = _new_rpc_transport(request)
    try:
        return await transport.call(method, {**(params or {}), 'profile': _rpc_profile(request)})
    finally:
        transport.close()


@router.get('/projects')
async def projects(request: Request):
    return await _rpc(request, 'projects.tree', {'preview_limit': 3})


@router.get('/projects/{project_id}')
@router.get('/projects/detail')
async def project(request: Request, project_id: str):
    result = await _rpc(request, 'projects.project_sessions', {'project_id': project_id})
    if result.get('project') is None:
        raise HTTPException(404, 'Project no longer exists')
    return result


@router.post('/projects/{project_id}/sessions', status_code=201)
@router.post('/projects/session', status_code=201)
async def project_session(request: Request, project_id: str):
    # Read the authoritative node again; no client supplied cwd or membership.
    profile = _rpc_profile(request)
    transport = _new_rpc_transport(request)
    try:
        node = (await transport.call('projects.project_sessions',
            {'profile': profile, 'project_id': project_id})).get('project')
        if node is None:
            raise HTTPException(404, 'Project no longer exists')
        root = node.get('path') or next((repo['path'] for repo in node.get('repos', []) if repo.get('path')), None)
        if not root and not node.get('isNoProject'):
            raise HTTPException(409, 'This Project has no workspace')
        params = {'profile': profile, 'source': 'desktop'}
        if root:
            resolved = await transport.call('config.get', {'key': 'project', 'cwd': root, 'profile': profile})
            cwd = resolved.get('cwd')
            if not isinstance(cwd, str) or not cwd:
                raise HTTPException(409, 'Hermes could not resolve this workspace')
            # This pin silently falls back to its launch cwd for missing local
            # directories. Accept canonicalisation and remote paths, never that
            # unrelated fallback as a Project workspace.
            if cwd != root and os.path.normpath(cwd) != os.path.abspath(os.path.expanduser(root)):
                raise HTTPException(409, 'The Project workspace is unavailable')
            params.update(cwd=cwd, cwd_explicit=True)
        try:
            made = await transport.call('session.create', params)
        except _CwdExplicitUnsupported:
            # Older Hermes infers explicit cwd from an existing directory. Retry
            # only the exact schema-validation rejection, never operational errors.
            if 'cwd' not in params or not os.path.isdir(params['cwd']):
                raise HTTPException(409, 'The Project workspace is unavailable')
            params.pop('cwd_explicit')
            made = await transport.call('session.create', params)
        return {'session': {'id': made['stored_session_id'], 'source': 'desktop',
                            'cwd': made['info'].get('cwd'), 'workspace_rpc': True}}
    finally:
        transport.close()


@router.get('/project-events')
async def project_events(request: Request):
    import asyncio
    import json
    from tui_gateway import server
    profile = _rpc_profile(request)
    transport = _new_rpc_transport(request)
    server._ensure_skin_watcher()
    server.register_live_transport(transport)
    stored_id = request.query_params.get('session', '')
    if stored_id:
        try:
            await _workspace_resume(transport, profile, stored_id)
        except BaseException:
            transport.close()
            raise
    async def frames():
        try:
            yield 'event: refresh\ndata: {}\n\n'
            while not transport.closed and not await request.is_disconnected():
                try:
                    frame = await asyncio.wait_for(transport.events.get(), 15)
                except asyncio.TimeoutError:
                    yield ': keepalive\n\n'
                    continue
                event = frame.get('params') or {}
                payload = event.get('payload') or {}
                if event.get('type') in ('sessions.changed', 'projects.changed') and payload.get('profile') in (None, profile):
                    yield 'event: refresh\ndata: ' + json.dumps({'type': event['type']}) + '\n\n'
        finally:
            transport.close()
    return StreamingResponse(frames(), media_type='text/event-stream')


async def _workspace_resume(transport, profile, stored_id):
    # Crucially, no cwd here. Hermes restores the session's own workspace.
    return await transport.call('session.resume', {'profile': profile, 'session_id': stored_id,
        'source': 'desktop', 'inline_images': False})


def _workspace_message(row):
    import json
    role = row.get('role', 'assistant')
    # Native tool rows use raw content; renderer prose rows use text. A null
    # text field must not discard tool output when completed history replaces SSE.
    content = row.get('content') if role == 'tool' else row.get('text') or row.get('content')
    if role == 'tool' and content is not None and not isinstance(content, str):
        content = json.dumps(content)
    return {'role': role, 'content': content or '',
            **({'id': str(row['row_id'])} if row.get('row_id') is not None else {}),
            **({'tool_name': row['name']} if role == 'tool' and row.get('name') else {})}


@router.get('/workspace/sessions/{session_id}/messages')
async def workspace_messages(request: Request, session_id: str):
    transport = _new_rpc_transport(request)
    try:
        result = await _workspace_resume(transport, _rpc_profile(request), session_id)
        return {'messages': [_workspace_message(row) for row in result.get('messages', [])]}
    finally:
        transport.close()


def _workspace_frame(frame, runtime_id, stored_id=None):
    import json
    event = frame.get('params') or {}
    if event.get('session_id') != runtime_id:
        return None
    name = event.get('type')
    payload = event.get('payload') or {}
    data = {'run_id': 'workspace-' + (stored_id or runtime_id), **payload}
    if name == 'error':
        return 'run.failed', {'run_id': data['run_id']}
    if name == 'message.delta':
        return 'assistant.delta', {**data, 'delta': payload.get('text', '')}
    if name == 'message.complete':
        status = payload.get('status')
        return ('run.completed' if status == 'complete' else 'run.cancelled' if status == 'interrupted' else 'run.failed'), data if status == 'complete' else {'run_id': data['run_id']}
    if name in ('tool.start', 'tool.complete'):
        return ('tool.started' if name == 'tool.start' else 'tool.completed'), {
            **data, 'tool_name': payload.get('name'), 'tool_call_id': payload.get('tool_id'), 'preview': payload.get('context', ''),
            'output': payload.get('result_text') or (json.dumps(payload['result']) if payload.get('result') is not None else '')}
    if name in ('reasoning.delta', 'thinking.delta', 'reasoning.available', 'tool.progress'):
        return name, {**data, 'delta': payload.get('delta', payload.get('text', ''))}
    if frame.get('method') in ('approval.request', 'clarify.request') or name == 'approval.request':
        return 'approval.request', {'run_id': 'workspace-' + (stored_id or runtime_id)}
    return None


@router.post('/workspace/sessions/{session_id}/chat/stream')
async def workspace_stream(request: Request, session_id: str):
    import asyncio
    import json
    profile = _rpc_profile(request)
    try:
        body = await request.json()
    except ValueError:
        raise HTTPException(422, 'Invalid workspace turn')
    if not isinstance(body, dict) or not isinstance(body.get('input'), (str, list)):
        raise HTTPException(422, 'Invalid workspace turn')
    transport = _new_rpc_transport(request)
    try:
        resumed = await _workspace_resume(transport, profile, session_id)
        runtime_id = resumed['session_id']
        if resumed.get('running') or resumed.get('pending_approval'):
            raise HTTPException(409, 'This session already has an active turn or approval')
        params = {'profile': profile, 'session_id': runtime_id}
        if body.get('model'):
            model = body['model']
            provider = body.get('provider')
            if not isinstance(model, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._:/@+~-]{0,255}', model):
                raise HTTPException(422, 'Invalid workspace model')
            if provider and (not isinstance(provider, str) or not _PROFILE.fullmatch(provider)):
                raise HTTPException(422, 'Invalid workspace provider')
            # Hermes parses model switches as words, not shell quoting. Explicit
            # --session prevents model.persist_switch_by_default from writing config.
            selection = model + ' --session'
            if provider:
                selection += ' --provider ' + provider
            switched = await transport.call('config.set', {**params, 'key': 'model', 'value': selection, 'scope': 'session'})
            if switched.get('confirm_required') or switched.get('warning') or switched.get('deferred'):
                raise HTTPException(409, 'Hermes could not apply the selected model')
        parts = body['input']
        if isinstance(parts, list):
            texts = []
            for part in parts:
                if not isinstance(part, dict):
                    raise HTTPException(422, 'Invalid workspace content')
                if part.get('type') == 'text':
                    if not isinstance(part.get('text'), str):
                        raise HTTPException(422, 'Invalid workspace text')
                    texts.append(part.get('text', ''))
                elif part.get('type') == 'image_url':
                    data = (part.get('image_url') or {}).get('url', '')
                    if not data.startswith('data:image/') or ';base64,' not in data or len(data) > 28 * 1024 * 1024:
                        raise HTTPException(422, 'Invalid workspace image')
                    await transport.call('image.attach_bytes', {**params, 'content_base64': data.split(',', 1)[1]})
                else:
                    raise HTTPException(422, 'Unsupported workspace content')
            parts = '\n'.join(texts)
        submitted = await transport.call('prompt.submit', {**params, 'text': parts})
        if submitted.get('status') != 'streaming':
            raise HTTPException(409, 'Hermes did not start the turn')
    except BaseException:
        transport.close()
        raise
    return _workspace_events(request, transport, runtime_id, session_id)


def _workspace_events(request, transport, runtime_id, stored_id, snapshot=None):
    import asyncio
    import json
    async def frames():
        try:
            yield 'event: run.started\ndata: ' + json.dumps({'run_id': 'workspace-' + stored_id}) + '\n\n'
            if snapshot and (snapshot.get('inflight') or {}).get('assistant'):
                yield 'event: assistant.delta\ndata: ' + json.dumps({'delta': snapshot['inflight']['assistant']}) + '\n\n'
            if snapshot and not snapshot.get('running'):
                yield 'event: run.completed\ndata: {}\n\n'
                return
            while not transport.closed and not await request.is_disconnected():
                try:
                    frame = await asyncio.wait_for(transport.events.get(), 15)
                except asyncio.TimeoutError:
                    yield ': keepalive\n\n'
                    continue
                mapped = _workspace_frame(frame, runtime_id, stored_id)
                if mapped:
                    name, data = mapped
                    if name == 'run.completed' and isinstance(data.get('text'), str):
                        yield 'event: assistant.completed\ndata: ' + json.dumps({'content': data['text']}) + '\n\n'
                    yield 'event: ' + name + '\ndata: ' + json.dumps(data) + '\n\n'
                    if name in ('run.completed', 'run.failed', 'run.cancelled', 'approval.request'):
                        break
        finally:
            transport.close()
    return StreamingResponse(frames(), media_type='text/event-stream')


@router.get('/workspace/runs/{stored_id}')
async def workspace_run(request: Request, stored_id: str):
    transport = _new_rpc_transport(request)
    try:
        result = await _workspace_resume(transport, _rpc_profile(request), stored_id)
        return {'status': 'running' if result.get('running') else 'completed'}
    finally:
        transport.close()


@router.get('/workspace/runs/{stored_id}/events')
async def workspace_run_events(request: Request, stored_id: str):
    transport = _new_rpc_transport(request)
    try:
        result = await _workspace_resume(transport, _rpc_profile(request), stored_id)
        return _workspace_events(request, transport, result['session_id'], stored_id, result)
    except BaseException:
        transport.close()
        raise


@router.post('/workspace/runs/{stored_id}/stop')
async def workspace_stop(request: Request, stored_id: str):
    transport = _new_rpc_transport(request)
    try:
        profile = _rpc_profile(request)
        result = await _workspace_resume(transport, profile, stored_id)
        return await transport.call('session.interrupt', {'profile': profile, 'session_id': result['session_id']})
    finally:
        transport.close()
