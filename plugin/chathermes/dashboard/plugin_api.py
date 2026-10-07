"""Cookie-gated dashboard routes that proxy the Bearer-only Hermes gateway."""

import os
import re
import sys
from pathlib import Path
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
_push_store_module = None
_push_sender_module = None


def _load_sibling(name):
    import importlib.util
    path = Path(__file__).with_name(name + '.py')
    spec = importlib.util.spec_from_file_location('chathermes_' + name, path, submodule_search_locations=[str(path.parent)])
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _push_store():
    if _push_store_module is None:
        raise HTTPException(503, 'Push storage unavailable')
    return _push_store_module


@router.get('/push/config')
async def push_config():
    return _push_store().config()


@router.post('/push/test')
async def push_test(request: Request):
    """Inherits dashboard authentication, just like the subscription routes."""
    from starlette.concurrency import run_in_threadpool
    import secrets
    profile = _rpc_profile(request)
    try:
        if not (await run_in_threadpool(_push_store().config)).get('available') or _push_sender_module is None:
            raise HTTPException(503, 'Push notifications are unavailable')
        if _push_sender_module.notify(profile, '', 'test', secrets.token_urlsafe(18), request=request) is not True:
            raise HTTPException(503, 'Could not schedule test notification')
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(503, 'Could not schedule test notification') from None
    return {'scheduled': True}


@router.get('/push-service-worker.js')
async def push_service_worker():
    from fastapi.responses import FileResponse
    path = Path(__file__).with_name('dist') / 'push-service-worker.js'
    return FileResponse(path, media_type='application/javascript', headers={
        'Service-Worker-Allowed': '/chathermes', 'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'})


@router.post('/push/subscriptions')
async def push_subscribe(request: Request):
    from starlette.concurrency import run_in_threadpool
    body = bytearray()
    async for chunk in request.stream():
        body.extend(chunk)
        if len(body) > 8192:
            raise HTTPException(413, 'Push subscription is too large')
    try:
        import json
        body = json.loads(body)
    except (ValueError, UnicodeDecodeError):
        raise HTTPException(422, 'Invalid push subscription')
    try:
        result = await run_in_threadpool(_push_store().upsert, _rpc_profile(request), body)
    except (ValueError, KeyError, TypeError) as error:
        raise HTTPException(422, str(error))
    return result


@router.delete('/push/subscriptions/{identity}')
async def push_unsubscribe(request: Request, identity: str):
    from starlette.concurrency import run_in_threadpool
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', identity):
        raise HTTPException(422, 'Invalid subscription identity')
    removed = await run_in_threadpool(_push_store().remove, _rpc_profile(request), identity)
    return {'removed': removed}


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
    result = await _proxy(request, "/v1/capabilities")
    if result.status_code == 200:
        import json
        body = json.loads(result.body)
        body.setdefault('features', {})['native_chat'] = True
        return body
    return result


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


@router.post('/chat/sessions')
async def native_session_create(request: Request):
    made = await _rpc(request, 'session.create', {'source': 'desktop'})
    return {'session': {'id': made['stored_session_id'], 'source': 'desktop', 'title': ''}}


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


@router.post("/v1/runs")
async def create_run(request: Request):
    return await _proxy(request, "/v1/runs")


@router.post("/v1/runs/{run_id}/approval")
async def approve_run(request: Request, run_id: str):
    return await _proxy(request, "/v1/runs/" + quote(run_id, safe="") + "/approval")


@router.post("/v1/runs/{run_id}/steer")
async def steer_run(request: Request, run_id: str):
    return await _proxy(request, "/v1/runs/" + quote(run_id, safe="") + "/steer")


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


@router.get('/images/{file_id}')
async def native_image(request: Request, file_id: str):
    # Authenticated profile file references only; no arbitrary paths or HTML.
    from fastapi.responses import FileResponse
    if not re.fullmatch(r'[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)', file_id):
        raise HTTPException(404, 'Image unavailable')
    home = _upload_home(request).resolve()
    root = home / 'uploads' / 'chathermes'
    path = root / file_id
    if root.resolve() != root or path.is_symlink() or not path.is_file() or path.resolve().parent != root:
        raise HTTPException(404, 'Image unavailable')
    with path.open('rb') as stream:
        head = stream.read(16)
    mime = ('image/png' if head.startswith(b'\x89PNG\r\n\x1a\n') else
            'image/jpeg' if head.startswith(b'\xff\xd8\xff') else
            'image/gif' if head.startswith((b'GIF87a', b'GIF89a')) else
            'image/webp' if head.startswith(b'RIFF') and head[8:12] == b'WEBP' else None)
    if mime is None:
        raise HTTPException(404, 'Image unavailable')
    return FileResponse(path, media_type=mime, headers={'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff'})


# Projects and workspace chats use the dashboard's own gateway dispatcher. This
# is the same RPC admission/profile/runtime path as /api/ws, without a browser
# connection, credentials, native database writes, or a second session store.
# Hermes imports this file by spec rather than as a package. Resolve siblings
# relative to this trusted plugin directory, never through sys.path/CWD.
def _load_sibling(name):
    import importlib.util
    spec = importlib.util.spec_from_file_location('chathermes_' + name, Path(__file__).with_name(name + '.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_gateway_transport = _load_sibling('gateway_transport')
_RpcTransport = _gateway_transport._RpcTransport
_CwdExplicitUnsupported = _gateway_transport._CwdExplicitUnsupported
_InlineImagesUnsupported = _gateway_transport._InlineImagesUnsupported

_chat_gateway = _load_sibling('chat_gateway')
_native_owners = _load_sibling('native_owners')
_push_store_module = _load_sibling('push_store')
_push_sender_module = _load_sibling('push_sender')
_native_channel = _load_sibling('native_channel')
router.add_event_handler('shutdown', _native_owners.shutdown)


@router.get('/chat/capabilities')
async def chat_capabilities():
    return _chat_gateway.capabilities()


# Authentication is checked inside this handler before accept: dashboard HTTP
# middleware does not authorize a WebSocket upgrade.
from fastapi import WebSocket


@router.websocket('/chat/ws')
async def chat_socket(ws: WebSocket):
    import sys
    await _chat_gateway.socket(ws, sys.modules[__name__])


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


def _project_node(stored, node=None):
    # Keep Hermes's session hierarchy; enrich it with the native management row.
    return {**(node or {'sessionCount': 0, 'repos': []}),
            'id': stored['id'], 'label': stored['name'], 'path': stored.get('primary_path'),
            **{key: stored.get(key) for key in
               ('folders', 'description', 'icon', 'color', 'board_slug', 'archived')}}


@router.get('/projects')
async def projects(request: Request):
    tree = await _rpc(request, 'projects.tree', {'preview_limit': 3})
    stored = (await _rpc(request, 'projects.list'))['projects']
    by_id = {node['id']: node for node in tree['projects']}
    ids = {row['id'] for row in stored}
    return {**tree, 'projects': [_project_node(row, by_id.get(row['id'])) for row in stored]
            + [node for node in tree['projects'] if node['id'] not in ids]}


@router.get('/projects/{project_id}')
@router.get('/projects/detail')
async def project(request: Request, project_id: str):
    result = await _rpc(request, 'projects.project_sessions', {'project_id': project_id})
    node = result.get('project')
    if node and (node.get('isAuto') or node.get('isNoProject')):
        return result
    # Archived projects are deliberately absent from the native active tree.
    stored = (await _rpc(request, 'projects.list'))['projects']
    row = next((row for row in stored if row['id'] == project_id), None)
    if row is None:
        raise HTTPException(404, 'Project no longer exists')
    return {'project': _project_node(row, node)}


# Directory instruction precedence requested by the project editor. Only these
# fixed filenames in the authoritative workspace are accessible to the browser.
_INSTRUCTION_NAMES = ('.hermes.md', 'HERMES.md', 'AGENTS.override.md', 'AGENTS.md', 'CLAUDE.md', '.cursorrules')
_INSTRUCTION_LIMIT = 128 * 1024


def _project_instructions_sync(root, body=None):
    import hashlib
    import stat
    import fcntl
    try:
        directory = Path(root).expanduser().resolve(strict=True)
        if not directory.is_dir():
            raise HTTPException(409, 'The Project workspace is unavailable')
        # Resolve filenames through an open directory, never a client path. Refuse
        # links (including dangling links), non-regular files, and oversized files.
    except (OSError, ValueError):
        raise HTTPException(409, 'The Project workspace is unavailable')
    try:
        directory_fd = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
    except OSError:
        raise HTTPException(409, 'The Project workspace is unavailable')
    try:
        filename = next((name for name in _INSTRUCTION_NAMES
                         if os.path.lexists(directory / name)), '.hermes.md')
        exists = os.path.lexists(directory / filename)
        if body is not None and (body['filename'] != filename or (body['revision'] is None) != (not exists)):
            raise HTTPException(409, 'Instructions changed. Reload before saving.')
        if not exists and body is None:
            return {'filename': filename, 'content': '', 'revision': None}
        flags = os.O_NOFOLLOW | os.O_NONBLOCK | (os.O_RDONLY if body is None else os.O_RDWR)
        if not exists:
            flags |= os.O_CREAT | os.O_EXCL
        fd = os.open(filename, flags, 0o644, dir_fd=directory_fd)
        with os.fdopen(fd, 'rb' if body is None else 'r+b') as handle:
            fcntl.flock(handle, fcntl.LOCK_SH if body is None else fcntl.LOCK_EX)
            info = os.fstat(handle.fileno())
            if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1:
                raise HTTPException(409, 'Instructions must be a regular workspace file')
            raw = handle.read(_INSTRUCTION_LIMIT + 1)
            if len(raw) > _INSTRUCTION_LIMIT:
                raise HTTPException(413, 'Instructions are too large to edit')
            revision = hashlib.sha256(raw).hexdigest() if exists else None
            if body is not None:
                if body['revision'] != revision:
                    raise HTTPException(409, 'Instructions changed. Reload before saving.')
                raw = body['content'].encode('utf-8')
                handle.seek(0)
                handle.write(raw)
                handle.truncate()
                handle.flush()
                os.fsync(handle.fileno())
                revision = hashlib.sha256(raw).hexdigest()
            return {'filename': filename, 'content': raw.decode('utf-8'), 'revision': revision}
    except HTTPException:
        raise
    except (OSError, ValueError, UnicodeError):
        # Do not return filesystem paths, file contents, or raw OS diagnostics.
        raise HTTPException(409, 'Could not access the workspace instructions')
    finally:
        os.close(directory_fd)


async def _project_instructions(request, project_id, body=None):
    from starlette.concurrency import run_in_threadpool
    result = await project(request, project_id)
    node = result['project']
    root = node.get('path') or next((repo['path'] for repo in node.get('repos', []) if repo.get('path')), None)
    if not root or node.get('isNoProject'):
        raise HTTPException(409, 'This Project has no workspace')
    return await run_in_threadpool(_project_instructions_sync, root, body)


@router.get('/project-instructions')
async def project_instructions(request: Request, project_id: str):
    return await _project_instructions(request, project_id)


@router.put('/project-instructions')
async def save_project_instructions(request: Request, project_id: str):
    _rpc_profile(request)
    raw = bytearray()
    async for chunk in request.stream():
        raw.extend(chunk)
        if len(raw) > _INSTRUCTION_LIMIT * 6 + 1024:
            raise HTTPException(413, 'Instructions are too large to edit')
    try:
        import json
        body = json.loads(raw)
    except (ValueError, UnicodeError):
        raise HTTPException(422, 'Invalid instructions')
    if (not isinstance(body, dict) or set(body) != {'content', 'filename', 'revision'}
            or not isinstance(body['content'], str) or body['filename'] not in _INSTRUCTION_NAMES
            or (body['revision'] is not None and (not isinstance(body['revision'], str)
                or not re.fullmatch(r'[a-f0-9]{64}', body['revision'])))):
        raise HTTPException(422, 'Invalid instructions')
    try:
        size = len(body['content'].encode('utf-8'))
    except UnicodeError:
        raise HTTPException(422, 'Invalid instructions')
    if size > _INSTRUCTION_LIMIT:
        raise HTTPException(413, 'Instructions are too large to edit')
    return await _project_instructions(request, project_id, body)


@router.post('/projects/manage')
async def manage_project(request: Request):
    # Fixed native operations and schemas: never dispatch browser-supplied RPC names.
    schemas = {
        'create': {'name': str, 'primary_path': str},
        'update': {'id': str, 'name': str, 'description': str, 'icon': str, 'color': str, 'board_slug': str},
        'add_folder': {'id': str, 'path': str, 'label': str, 'is_primary': bool},
        'remove_folder': {'id': str, 'path': str},
        'set_primary': {'id': str, 'path': str},
        'archive': {'id': str, 'restore': bool},
        'delete': {'id': str},
    }
    _rpc_profile(request)
    try:
        body = await request.json()
    except ValueError:
        raise HTTPException(422, 'Invalid project operation')
    if not isinstance(body, dict) or not isinstance(body.get('action'), str) or body.get('action') not in schemas:
        raise HTTPException(422, 'Invalid project operation')
    action = body['action']
    schema = schemas[action]
    params = {key: value for key, value in body.items() if key != 'action'}
    if any(key not in schema or type(value) is not schema[key] for key, value in params.items()):
        raise HTTPException(422, 'Invalid project fields')
    required = ['name'] if action == 'create' else ['id']
    if action in ('add_folder', 'remove_folder', 'set_primary'):
        required.append('path')
    if any(not params.get(key, '').strip() for key in required):
        raise HTTPException(422, 'Missing project fields')
    if 'name' in params and (not params['name'].strip() or len(params['name']) > 160):
        raise HTTPException(422, 'Invalid project name')
    if any(isinstance(value, str) and ('\x00' in value or len(value) > 4096) for value in params.values()):
        raise HTTPException(422, 'Invalid project fields')
    return await _rpc(request, 'projects.' + action, params)


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
    params = {'profile': profile, 'session_id': stored_id, 'source': 'desktop', 'inline_images': False}
    try:
        return await transport.call('session.resume', params)
    except _InlineImagesUnsupported:
        # Some published images lack this optional history projection flag.
        params.pop('inline_images')
        return await transport.call('session.resume', params)


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
            **({'tool_name': row['name']} if role == 'tool' and row.get('name') else {}),
            **{key: row[key] for key in ('tool_call_id', 'tool_calls', 'reasoning', 'reasoning_content') if row.get(key) is not None}}


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
        return ('tool.started' if name == 'tool.start' else 'tool.failed' if payload.get('is_error') else 'tool.completed'), {
            **data, 'tool_name': payload.get('name'), 'tool_call_id': payload.get('tool_id'), 'preview': payload.get('context', ''),
            'output': payload.get('result_text') or (json.dumps(payload['result']) if payload.get('result') is not None else '')}
    if name in ('reasoning.delta', 'thinking.delta', 'reasoning.available', 'tool.progress'):
        return name, {**data, 'delta': payload.get('delta', payload.get('text', ''))}
    if frame.get('method') in ('approval.request', 'clarify.request') or name == 'approval.request':
        return 'approval.request', {'run_id': 'workspace-' + (stored_id or runtime_id)}
    return None


def _validated_workspace_turn(body):
    """Validate the entire turn before config/image/submit native mutations."""
    import base64
    import binascii
    if not isinstance(body, dict) or set(body) - {'input', 'model', 'provider', 'require_model_lock'}:
        raise HTTPException(422, 'Invalid workspace turn')
    model, provider = body.get('model'), body.get('provider')
    if model is not None and (not isinstance(model, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._:/@+~-]{0,255}', model)):
        raise HTTPException(422, 'Invalid workspace model')
    if provider is not None and (not model or not isinstance(provider, str) or not _PROFILE.fullmatch(provider)):
        raise HTTPException(422, 'Invalid workspace provider')
    if 'require_model_lock' in body and not isinstance(body['require_model_lock'], bool):
        raise HTTPException(422, 'Invalid workspace turn')
    parts = body.get('input')
    if isinstance(parts, str):
        parts = [{'type': 'text', 'text': parts}]
    if not isinstance(parts, list) or len(parts) > 32:
        raise HTTPException(422, 'Invalid workspace content')
    texts, images, total = [], [], 0
    for part in parts:
        if not isinstance(part, dict):
            raise HTTPException(422, 'Invalid workspace content')
        if part.get('type') == 'text':
            text = part.get('text')
            if not isinstance(text, str) or len(text.encode('utf-8')) > 1024 * 1024:
                raise HTTPException(422, 'Invalid workspace text')
            texts.append(text)
        elif part.get('type') == 'image_url':
            image = part.get('image_url')
            data = image.get('url') if isinstance(image, dict) else None
            if not isinstance(data, str) or len(data) > 28 * 1024 * 1024:
                raise HTTPException(422, 'Invalid workspace image')
            header, sep, encoded = data.partition(',')
            if not sep or header not in ('data:image/png;base64', 'data:image/jpeg;base64', 'data:image/gif;base64', 'data:image/webp;base64'):
                raise HTTPException(422, 'Invalid workspace image')
            try:
                decoded = base64.b64decode(encoded, validate=True)
            except (ValueError, binascii.Error):
                raise HTTPException(422, 'Invalid workspace image')
            total += len(decoded)
            if not decoded or total > 20 * 1024 * 1024 or len(images) >= 8:
                raise HTTPException(413, 'Workspace images exceed the attachment limit')
            # Native attach_bytes decodes bytes and determines their image type.
            # Reject a mismatched declaration before any queued-image mutation.
            mime = header[5:-7]
            valid = (mime == 'image/png' and decoded.startswith(b'\x89PNG\r\n\x1a\n') or
                     mime == 'image/jpeg' and decoded.startswith(b'\xff\xd8\xff') or
                     mime == 'image/gif' and decoded.startswith((b'GIF87a', b'GIF89a')) or
                     mime == 'image/webp' and decoded.startswith(b'RIFF') and decoded[8:12] == b'WEBP')
            if not valid:
                raise HTTPException(422, 'Invalid workspace image')
            images.append(encoded)
        else:
            raise HTTPException(422, 'Unsupported workspace content')
    text = '\n'.join(texts)
    if len(text.encode('utf-8')) > 1024 * 1024 or not text.strip() and not images:
        raise HTTPException(422, 'Invalid workspace text')
    return text, images


@router.post('/workspace/sessions/{session_id}/chat/stream')
async def workspace_stream(request: Request, session_id: str):
    import asyncio
    import json
    profile = _rpc_profile(request)
    raw = bytearray()
    async for chunk in request.stream():
        raw.extend(chunk)
        if len(raw) > 29 * 1024 * 1024:
            raise HTTPException(413, 'Workspace turn exceeds the content limit')
    try:
        body = json.loads(raw)
    except ValueError:
        raise HTTPException(422, 'Invalid workspace turn')
    text, images = _validated_workspace_turn(body)
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
        for encoded in images:
            await transport.call('image.attach_bytes', {**params, 'content_base64': encoded})
        submitted = await transport.call('prompt.submit', {**params, 'text': text})
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
                yield 'event: assistant.snapshot\ndata: ' + json.dumps({'text': snapshot['inflight']['assistant']}) + '\n\n'
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


# Scheduled history uses the pinned dashboard's local cron/SessionDB contracts,
# not the gateway Runs buffer (which expires and is unrelated to cron history).
def _scheduled_context(request):
    from hermes_cli.web_server_cron import _cron_profile_home
    profile = request.query_params.get('profile', '')
    if profile and not _PROFILE.fullmatch(profile):
        raise HTTPException(422, 'Invalid profile name')
    return _cron_profile_home(profile or None)


def _scheduled_job(profile, job_id):
    from hermes_cli.web_server_cron import _call_cron_for_profile
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]{0,159}', job_id):
        raise HTTPException(422, 'Invalid scheduled job')
    # Exact ID lookup in one profile. Never use the native route's cross-profile
    # ownership fallback, or resolve a user-supplied name as a different job.
    jobs = _call_cron_for_profile(profile, 'list_jobs', True)
    job = next((row for row in jobs if row.get('id') == job_id), None)
    if job is None:
        raise HTTPException(404, 'Scheduled job not found')
    return job


def _scheduled_jobs_sync(profile, home):
    from hermes_cli.web_server_cron import _call_cron_for_profile
    jobs = _call_cron_for_profile(profile, 'list_jobs', True)
    return {'jobs': [{key: row.get(key) for key in
        ('id', 'name', 'prompt', 'schedule_display', 'state', 'enabled', 'last_run_at', 'next_run_at')}
        for row in jobs]}


def _scheduled_docs(home, job_id):
    from hermes_cli.web_routers.cron import _cron_output_run_timestamp
    root = home / 'cron' / 'output'
    directory = root / job_id
    # Do not read symlinked directories/files or return filesystem paths.
    if (home / 'cron').is_symlink() or root.is_symlink() or directory.is_symlink():
        return []
    return [{'id': 'output:' + path.stem, 'started_at': _cron_output_run_timestamp(path),
             'title': 'Saved output', 'source': 'cron_output'}
            for path in directory.glob('*.md')
            if not path.is_symlink() and path.is_file()
            and re.fullmatch(r'\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}', path.stem)]


def _scheduled_attempts(home, job_id):
    # Native ledger also retains failed script fires that never wrote a document.
    from cron.executions import list_executions
    from hermes_cli.web_server_cron import _cron_store_scope
    from hermes_cli.web_routers.cron import _iso_to_epoch
    attempts = []
    cursor = None
    with _cron_store_scope(home):
        while True:
            page = list_executions(job_id=job_id, limit=500, before_claimed_at=cursor)
            attempts.extend(page)
            if len(page) < 500:
                break
            next_cursor = page[-1]['claimed_at']
            if next_cursor == cursor:
                break
            cursor = next_cursor
    return [{'id': 'execution:' + row['id'], 'source': 'cron_execution',
             'started_at': _iso_to_epoch(row.get('started_at') or row.get('claimed_at')) or 0,
             'ended_at': _iso_to_epoch(row.get('finished_at')), '_claimed_at': _iso_to_epoch(row.get('claimed_at')) or 0,
             'title': row['status'].capitalize(),
             'end_reason': row['status']}
            for row in attempts if row['status'] in ('completed', 'failed', 'unknown')]


def _scheduled_runs_sync(profile, home, job_id, offset, limit):
    from hermes_cli.web_server_sessions import _open_session_db_for_profile
    from hermes_cli.web_server_cron import _cron_store_scope
    from hermes_cli.web_routers.cron import _doc_matches_session, _execution_contains
    _scheduled_job(profile, job_id)
    db = _open_session_db_for_profile(profile, read_only=True)
    sessions = []
    try:
        # Native dashboard caps history at 100. Page the actual DB contract so
        # older retained runs remain reachable, including mixed agent/script jobs.
        while True:
            page = db.list_cron_job_runs(job_id, limit=500, offset=len(sessions))
            sessions.extend(page)
            if len(page) < 500:
                break
    finally:
        db.close()
    with _cron_store_scope(home):
        docs = _scheduled_docs(home, job_id)
    sessions = [row for row in sessions if re.fullmatch(r'cron_' + re.escape(job_id) + r'_\d{8}_\d{6}', row['id'])]
    rows = sessions + [doc for doc in docs if doc['started_at'] is not None
        and not any(_doc_matches_session(doc['started_at'], session, 300) for session in sessions)]
    attempts = _scheduled_attempts(home, job_id)
    representations = list(rows)
    for attempt in attempts:
        # Match persisted output against execution windows; never deduplicate
        # two independent ledger records based on nearby timestamps.
        window = {'claimed_at': attempt.get('_claimed_at', attempt['started_at']),
                  'finished_at': attempt.get('ended_at')}
        matched = any(_execution_contains(window, float(row.get('started_at') or 0), 300)
                      for row in representations)
        if not matched:
            rows.append(attempt)
    rows.sort(key=lambda row: (float(row.get('started_at') or 0), row['id']), reverse=True)
    fields = ('id', 'title', 'started_at', 'ended_at', 'source', 'preview', 'end_reason')
    return {'runs': [{key: row.get(key) for key in fields} for row in rows[offset:offset + limit]],
            'offset': offset, 'limit': limit, 'has_more': offset + limit < len(rows)}


def _scheduled_output_sync(profile, home, job_id, run_id):
    from hermes_cli.web_server_sessions import _open_session_db_for_profile
    _scheduled_job(profile, job_id)
    if run_id.startswith('execution:'):
        from cron.executions import get_execution
        from hermes_cli.web_server_cron import _cron_store_scope
        from hermes_cli.web_routers.cron import _iso_to_epoch
        identifier = run_id.removeprefix('execution:')
        if not re.fullmatch(r'[a-f0-9]{32}', identifier):
            raise HTTPException(422, 'Invalid scheduled run')
        with _cron_store_scope(home):
            attempt = get_execution(identifier)
        if not attempt or attempt.get('job_id') != job_id:
            raise HTTPException(404, 'Scheduled run not found')
        return {'messages': [], 'started_at': _iso_to_epoch(attempt.get('started_at') or attempt.get('claimed_at'))}
    if run_id.startswith('output:'):
        stamp = run_id.removeprefix('output:')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}', stamp):
            raise HTTPException(422, 'Invalid scheduled run')
        root = home / 'cron' / 'output'
        directory = root / job_id
        path = directory / (stamp + '.md')
        if (home / 'cron').is_symlink() or root.is_symlink() or directory.is_symlink() or path.is_symlink() or not path.is_file():
            raise HTTPException(404, 'Saved output is no longer available')
        from hermes_cli.web_server_cron import _cron_store_scope
        from hermes_cli.web_routers.cron import _cron_output_run_timestamp
        with _cron_store_scope(home):
            started_at = _cron_output_run_timestamp(path)
        return {'output': path.read_text(encoding='utf-8-sig', errors='replace'), 'messages': [], 'started_at': started_at}
    if not re.fullmatch(r'cron_' + re.escape(job_id) + r'_\d{8}_\d{6}', run_id):
        raise HTTPException(404, 'Scheduled run not found')
    db = _open_session_db_for_profile(profile, read_only=True)
    try:
        session = db.get_session(run_id)
        if not session or session.get('source') != 'cron':
            raise HTTPException(404, 'Scheduled run not found')
        # A compressed cron run may continue under a child session ID; resolve
        # the persisted continuation lineage instead of losing its final turns.
        resolve = getattr(db, 'resolve_resume_session_id', None)
        transcript_id = resolve(run_id) if resolve else run_id
        transcript_session = db.get_session(transcript_id)
        if not transcript_session or transcript_session.get('source') != 'cron':
            transcript_id = run_id
            transcript_session = session
        messages = db.get_messages_as_conversation(transcript_id, include_ancestors=True, include_compacted=True)
        return {'session_id': run_id, 'started_at': session.get('started_at'), 'messages': [{key: row.get(key) for key in
            ('role', 'content', 'tool_name', 'tool_call_id', 'tool_calls', 'reasoning', 'reasoning_content')}
            for row in messages if row.get('role') != 'system']}
    finally:
        db.close()


async def _scheduled_read(request, worker, *args):
    import json
    from starlette.concurrency import run_in_threadpool
    try:
        profile, home = _scheduled_context(request)
        result = await run_in_threadpool(worker, profile, home, *args)
        key = (_gateway_settings()[1] if not request.query_params.get('profile') or profile == 'default'
               else _profile_gateway_key(profile)) or ''
        return Response(_safe_body(json.dumps(result).encode(), key) if key else json.dumps(result).encode(),
                        media_type='application/json')
    except HTTPException as error:
        if error.status_code in (404, 422):
            raise HTTPException(error.status_code, 'Scheduled history is unavailable for this selection')
        raise HTTPException(503, 'Scheduled history is unavailable in this Hermes version')
    except (ImportError, AttributeError):
        raise HTTPException(503, 'Scheduled history is unavailable in this Hermes version')
    except Exception:
        raise HTTPException(502, 'Could not read scheduled history')


@router.get('/scheduled')
async def scheduled_jobs(request: Request):
    return await _scheduled_read(request, _scheduled_jobs_sync)


@router.get('/scheduled/runs')
async def scheduled_runs(request: Request, job_id: str, offset: int = 0, limit: int = 30):
    if offset < 0 or not 1 <= limit <= 100:
        raise HTTPException(422, 'Invalid history page')
    return await _scheduled_read(request, _scheduled_runs_sync, job_id, offset, limit)


@router.get('/scheduled/output')
async def scheduled_output(request: Request, job_id: str, run_id: str):
    return await _scheduled_read(request, _scheduled_output_sync, job_id, run_id)
