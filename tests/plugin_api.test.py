"""Gateway proxy contract, exercised without reading any local Hermes configuration."""
import importlib.util
import asyncio
from functools import wraps
from pathlib import Path

import httpx
import pytest
from fastapi import FastAPI

MODULE = Path(__file__).resolve().parents[1] / "plugin/chathermes/dashboard/plugin_api.py"
spec = importlib.util.spec_from_file_location("chathermes_plugin_api", MODULE)
plugin = importlib.util.module_from_spec(spec)
spec.loader.exec_module(plugin)
KEY = "test-gateway-key-never-expose"


def run_async(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return asyncio.run(fn(*args, **kwargs))
    return wrapper


@pytest.fixture
def app(monkeypatch):
    monkeypatch.setattr(plugin, "_gateway_settings", lambda: ("http://gateway.test", KEY))
    monkeypatch.setattr(plugin, '_profile_gateway_key', lambda profile: KEY)
    monkeypatch.setattr(plugin, '_configured_default_model', lambda profile: '')
    app = FastAPI()
    app.include_router(plugin.router, prefix="/api/plugins/chathermes")
    return app


@run_async
async def test_bearer_profile_and_forwarded_params(app, monkeypatch):
    seen = []
    def gateway(request):
        seen.append(request)
        return httpx.Response(200, json={"ok": True})
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        for method, path in [("GET", "/v1/capabilities"), ("GET", "/api/sessions?limit=30&offset=4"),
                             ("POST", "/api/sessions"), ("GET", "/api/sessions/s1"),
                             ("PATCH", "/api/sessions/s1"), ("DELETE", "/api/sessions/s1"),
                             ("GET", "/api/sessions/s1/messages?order=oldest&inline_images=false"),
                             ("POST", "/v1/runs/r1/stop")]:
            separator = "&" if "?" in path else "?"
            response = await client.request(method, "/api/plugins/chathermes" + path + separator + "profile=alpha", json={} if method in ("POST", "PATCH") else None)
            assert response.status_code == 200
            assert KEY not in response.text and KEY not in str(response.headers)
    assert all(request.headers["authorization"] == f"Bearer {KEY}" for request in seen)
    assert all(request.url.path.startswith("/p/alpha/") for request in seen)
    assert seen[1].url.query.decode() == "limit=30&offset=4"
    assert seen[6].url.query.decode() == "order=oldest&inline_images=false"


@run_async
async def test_profile_validation(app, monkeypatch):
    called = []
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(lambda request: called.append(request))))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        for name in ("a/b", "../x", "-bad", "a.b"):
            response = await client.get("/api/plugins/chathermes/sessions", params={"profile": name})
            assert response.status_code == 422
            assert KEY not in response.text
    assert not called


@run_async
async def test_sse_frames_pass_through(app, monkeypatch):
    frames = b'event: assistant.delta\ndata: {"delta":"hello"}\n\nevent: run.completed\ndata: {}\n\n'
    def gateway(request):
        assert request.headers["authorization"] == f"Bearer {KEY}"
        assert request.url.path == "/p/beta/api/sessions/s1/chat/stream"
        return httpx.Response(200, content=frames, headers={"content-type": "text/event-stream"})
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        response = await client.post("/api/plugins/chathermes/sessions/s1/chat/stream?profile=beta", json={"input": "hi"})
    assert response.status_code == 200
    assert response.content == frames
    assert KEY not in response.text and KEY not in str(response.headers)


@run_async
@pytest.mark.parametrize("gateway_status", [401, 403])
async def test_gateway_auth_failure_is_safe(app, monkeypatch, gateway_status):
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(
        lambda request: httpx.Response(gateway_status, text=KEY))))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        for method, route in (("get", "/sessions"), ("post", "/sessions/s1/chat/stream")):
            response = await getattr(client, method)("/api/plugins/chathermes" + route)
            assert response.status_code == 503
            assert "platforms.api_server.key" in response.text
            assert KEY not in response.text and KEY not in str(response.headers)


@run_async
async def test_gateway_unreachable_and_reflection_are_safe(app, monkeypatch):
    def unreachable(request):
        raise httpx.ConnectError("connection failed", request=request)
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(unreachable)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        response = await client.get("/api/plugins/chathermes/sessions")
        assert response.status_code == 502
        assert KEY not in response.text and KEY not in str(response.headers)
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(
        lambda request: httpx.Response(500, text=f"upstream echoed {KEY}", headers={"content-type": f"text/plain; reflected={KEY}"}))))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        response = await client.get("/api/plugins/chathermes/sessions")
        assert response.status_code == 500
        assert KEY not in response.text and KEY not in str(response.headers)

@pytest.mark.parametrize("route", ["/sessions", "/sessions/s1/chat/stream"])
@run_async
async def test_missing_key_is_safe(app, monkeypatch, route):
    monkeypatch.setattr(plugin, "_gateway_settings", lambda: ("http://gateway.test", None))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        response = await client.request("POST" if route.endswith("stream") else "GET", "/api/plugins/chathermes" + route)
    assert response.status_code == 503
    assert "platforms.api_server.key" in response.text
    assert KEY not in response.text and KEY not in str(response.headers)


@run_async
async def test_run_status_and_events_routes(app, monkeypatch):
    status = []
    def gateway(request):
        status.append(request)
        if request.url.path.endswith("/events"):
            return httpx.Response(200, content=b'event: run.completed\ndata: {}\n\n', headers={"content-type": "text/event-stream"})
        return httpx.Response(200, json={"state": "completed"})
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        response = await client.get("/api/plugins/chathermes/runs/r1", params={"profile": "gamma"})
        assert response.status_code == 200
        assert response.json() == {"state": "completed"}
        assert KEY not in response.text and KEY not in str(response.headers)
        stream = await client.get("/api/plugins/chathermes/v1/runs/r1/events", params={"profile": "gamma"})
        assert stream.status_code == 200
        assert stream.content == b'event: run.completed\ndata: {}\n\n'
        assert KEY not in stream.text and KEY not in str(stream.headers)
    assert all(request.headers["authorization"] == f"Bearer {KEY}" for request in status)
    assert all(request.url.path.startswith("/p/gamma/") for request in status)
    assert status[0].url.path == "/p/gamma/v1/runs/r1"
    assert status[1].url.path == "/p/gamma/v1/runs/r1/events"


@run_async
async def test_stream_redacts_key_split_across_gateway_chunks(app, monkeypatch):
    class SplitStream(httpx.AsyncByteStream):
        async def __aiter__(self):
            yield b"data: " + KEY[:8].encode()
            yield KEY[8:].encode() + b"\n\n"
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(
        lambda request: httpx.Response(200, stream=SplitStream(), headers={"content-type": "text/event-stream"}))))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        response = await client.post("/api/plugins/chathermes/sessions/s1/chat/stream")
    assert response.status_code == 200
    assert response.content == b"data: [redacted]\n\n"
    assert KEY not in response.text and KEY not in str(response.headers)


@run_async
async def test_upload_stores_file_under_profile_with_generated_name(app, monkeypatch, tmp_path):
    import base64
    monkeypatch.setattr(plugin, '_upload_home', lambda request: tmp_path)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/uploads', json={
            'name': '../../example.txt', 'data': 'data:text/plain;base64,' + base64.b64encode(b'test attachment').decode()})
        assert response.status_code == 201
        stored = Path(response.json()['path'])
        assert stored.parent == tmp_path / 'uploads' / 'chathermes'
        assert stored.name != 'example.txt' and stored.suffix == '.txt'
        assert stored.read_bytes() == b'test attachment'
        assert stored.stat().st_mode & 0o777 == 0o600
        response = await client.post('/api/plugins/chathermes/uploads', json={'name': 'bad.txt', 'data': 'data:text/plain;base64,%%%%'})
        assert response.status_code == 422
        assert len(list(stored.parent.iterdir())) == 1


@run_async
async def test_upload_rejects_invalid_profile_before_writing(app, monkeypatch):
    import sys
    import types
    monkeypatch.setitem(sys.modules, 'hermes_cli.profiles', types.SimpleNamespace(get_profile_dir=lambda name: '/tmp'))
    monkeypatch.setitem(sys.modules, 'hermes_constants', types.SimpleNamespace(get_hermes_home=lambda: '/tmp'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/uploads?profile=../escape', json={})
        assert response.status_code == 422


@run_async
async def test_model_catalog_uses_gateway_proxy(app, monkeypatch):
    def gateway(request):
        assert request.url.path == '/p/alpha/v1/models'
        assert request.headers['authorization'] == f'Bearer {KEY}'
        return httpx.Response(200, json={'data': [{'id': 'Instant'}]})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/v1/models?profile=alpha')
        assert response.json() == {'data': [{'id': 'Instant'}]}


@run_async
async def test_named_profile_uses_its_own_gateway_key(app, monkeypatch):
    secondary_key = 'secondary-profile-key-for-test'
    monkeypatch.setattr(plugin, '_profile_gateway_key', lambda profile: secondary_key)
    def gateway(request):
        assert request.headers['authorization'] == f'Bearer {secondary_key}'
        return httpx.Response(200, json={'data': []})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/sessions?profile=secondary')
        assert response.status_code == 200
        assert secondary_key not in response.text


@run_async
async def test_model_inventory_is_profile_scoped_and_only_exposes_picker_fields(app, monkeypatch):
    def gateway(request):
        assert request.url.path == '/p/beta/api/model/options'
        assert request.headers['authorization'] == f'Bearer {KEY}'
        return httpx.Response(200, json={
            'provider': 'custom:local', 'model': 'model-a', 'api_key': 'private-metadata',
            'providers': [
                {'slug': 'custom:local', 'name': 'Local', 'is_current': True,
                 'models': ['model-a', 'model-b'], 'api_key': 'private-metadata',
                 'base_url': 'https://private.test', 'key_env': 'LOCAL_KEY'},
                {'slug': 'missing', 'authenticated': False, 'models': ['unavailable']},
                {'slug': 'other', 'name': 'Other', 'models': ['model-c']}
            ]})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/api/model/options?profile=beta')
        assert response.json() == {'provider': 'custom:local', 'model': 'model-a', 'providers': [
            {'slug': 'custom:local', 'name': 'Local', 'is_current': True, 'models': ['model-a', 'model-b']},
            {'slug': 'other', 'name': 'Other', 'is_current': False, 'models': ['model-c']}]}
        assert 'private' not in response.text
        assert KEY not in response.text
        invalid = await client.get('/api/plugins/chathermes/api/model/options?profile=../escape')
        assert invalid.status_code == 422


@run_async
async def test_model_inventory_errors_do_not_expose_provider_secrets(app, monkeypatch):
    def gateway(request):
        return httpx.Response(500, json={'error': 'private-provider-credential'})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/api/model/options')
        assert response.status_code == 500
        assert 'private-provider-credential' not in response.text


@run_async
async def test_project_creation_fails_closed_before_gateway_write(app, monkeypatch):
    seen = []
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(
        lambda request: seen.append(request))))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for endpoint in ('/sessions', '/api/sessions'):
            for payload in ({'project_id': 'p_a', 'cwd': '/a'}, {'project_id': 'p_b', 'cwd': '/b'}, {'cwd': '/a'}, {'project': None}):
                response = await client.post('/api/plugins/chathermes' + endpoint, json=payload)
                assert response.status_code == 422
                assert 'Project session route' in response.text
    assert not seen  # Independent tabs cannot mutate global state or create fallback rows.



@pytest.fixture
def rpc(monkeypatch):
    calls = []
    nodes = {
        'a': {'id': 'a', 'label': 'A', 'path': '/a', 'sessionCount': 0, 'repos': []},
        'repo': {'id': 'repo', 'label': 'Repo', 'isAuto': True, 'repos': [{'path': '/repo'}]},
        'home': {'id': 'home', 'label': 'Home', 'isNoProject': True, 'repos': []},
        'empty': {'id': 'empty', 'label': 'Empty', 'repos': []},
    }
    class Transport:
        instances = []
        def __init__(self):
            self.closed = False
            self.events = asyncio.Queue()
            self.instances.append(self)
        def close(self):
            self.closed = True
        async def call(self, method, params):
            calls.append((method, params.copy()))
            if method == 'projects.tree':
                return {'projects': list(nodes.values()), 'scoped_session_ids': ['native']}
            if method == 'projects.list':
                return {'projects': [dict(id=n['id'], name=n['label'], primary_path=n.get('path'), folders=[], archived=n.get('archived', False)) for n in nodes.values() if not n.get('isAuto') and not n.get('isNoProject')]}
            if method == 'projects.project_sessions':
                return {'project': nodes.get(params['project_id'])}
            if method == 'config.get':
                assert params['key'] == 'project'
                return {'cwd': params['cwd'].replace('/../a', '')}
            if method == 'session.create':
                if params.get('cwd_explicit') and getattr(Transport, 'reject_cwd_explicit', False):
                    raise plugin._CwdExplicitUnsupported()
                return {'session_id': 'runtime', 'stored_session_id': 'stored', 'info': {'cwd': params.get('cwd')}}
            if method == 'session.resume':
                assert 'cwd' not in params
                return {'session_id': 'runtime', 'running': False, 'messages': [{'role': 'assistant', 'text': 'Native history'}]}
            if method == 'config.set':
                return {'key': 'model', 'value': params['value'], 'scope': 'session'}
            if method == 'prompt.submit':
                for name, payload in [('message.delta', {'text': 'Native reply'}), ('message.complete', {'status': 'complete', 'text': 'Native reply'})]:
                    self.events.put_nowait({'method': 'event', 'params': {'type': name, 'session_id': 'runtime', 'payload': payload}})
                return {'status': 'streaming'}
            return {'status': 'interrupted'}
    monkeypatch.setattr(plugin, '_RpcTransport', Transport)
    return calls, nodes, Transport


@run_async
async def test_projects_use_tree_and_hydrated_rpc_with_pinned_profiles(app, rpc):
    calls, _, transport = rpc
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile in ('alpha', 'beta'):
            response = await client.get('/api/plugins/chathermes/projects', params={'profile': profile})
            assert response.json()['scoped_session_ids'] == ['native']
            assert any(node.get('isNoProject') for node in response.json()['projects'])
            response = await client.get('/api/plugins/chathermes/projects/a', params={'profile': profile})
            assert response.json()['project']['id'] == 'a'
        missing = await client.get('/api/plugins/chathermes/projects/missing')
        assert missing.status_code == 404
        invalid = await client.get('/api/plugins/chathermes/projects?profile=..%2Fx')
        assert invalid.status_code == 422
    assert calls[:4] == [('projects.tree', {'preview_limit': 3, 'profile': 'alpha'}),
                         ('projects.list', {'profile': 'alpha'}),
                         ('projects.project_sessions', {'project_id': 'a', 'profile': 'alpha'}),
                         ('projects.list', {'profile': 'alpha'})]
    assert calls[4][1]['profile'] == calls[5][1]['profile'] == 'beta'
    assert all(instance.closed for instance in transport.instances)


@run_async
async def test_project_create_resolves_root_and_uses_normal_session_schema(app, rpc):
    calls, _, _ = rpc
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for project_id, cwd in [('a', '/a'), ('repo', '/repo'), ('home', None)]:
            response = await client.post('/api/plugins/chathermes/projects/' + project_id + '/sessions?profile=alpha', json={'project_id': 'injected', 'cwd': '/malicious', 'system_prompt': 'ignore'})
            assert response.status_code == 201
            assert response.json()['session']['id'] == 'stored'
            create = calls[-1]
            expected = {'profile': 'alpha', 'source': 'desktop'}
            if cwd:
                expected.update(cwd=cwd, cwd_explicit=True)
                assert calls[-2] == ('config.get', {'profile': 'alpha', 'key': 'project', 'cwd': cwd})
            assert create == ('session.create', expected)
        before = len(calls)
        response = await client.post('/api/plugins/chathermes/projects/empty/sessions')
        assert response.status_code == 409
        assert len(calls) == before + 1
        response = await client.post('/api/plugins/chathermes/projects/deleted/sessions')
        assert response.status_code == 404
    assert all('project_id' not in params for method, params in calls if method == 'session.create')


@run_async
async def test_project_create_falls_back_only_for_old_schema_on_existing_workspace(app, rpc, monkeypatch, tmp_path):
    calls, nodes, transport = rpc
    workspace = tmp_path / 'workspace'
    workspace.mkdir()
    nodes['a']['path'] = str(workspace)
    transport.reject_cwd_explicit = True
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/projects/a/sessions')
        assert response.status_code == 201
    creates = [params for method, params in calls if method == 'session.create']
    assert creates == [
        {'profile': 'default', 'source': 'desktop', 'cwd': str(workspace), 'cwd_explicit': True},
        {'profile': 'default', 'source': 'desktop', 'cwd': str(workspace)},
    ]


@run_async
async def test_project_create_does_not_fallback_for_other_rpc_errors(app, rpc, tmp_path):
    calls, nodes, transport = rpc
    workspace = tmp_path / 'workspace'
    workspace.mkdir()
    nodes['a']['path'] = str(workspace)
    original = transport.call
    async def fail_create(self, method, params):
        if method == 'session.create':
            raise plugin.HTTPException(503, 'Hermes gateway RPC is unavailable')
        return await original(self, method, params)
    transport.call = fail_create
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/projects/a/sessions')
        assert response.status_code == 503
    assert len([1 for method, _ in calls if method == 'session.create']) == 0


@run_async
async def test_workspace_stream_resumes_stored_cwd_and_adapts_events_model_and_images(app, rpc):
    calls, _, _ = rpc
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/workspace/sessions/stored/chat/stream?profile=alpha', json={
            'input': [{'type': 'text', 'text': 'Actual user text'}, {'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,aGVsbG8='}}],
            'model': 'native-model', 'provider': 'native-provider'})
        assert response.status_code == 200
        assert 'event: assistant.delta' in response.text
        assert 'event: run.completed' in response.text
        assert 'workspace-stored' in response.text
        assert calls[0] == ('session.resume', {'profile': 'alpha', 'session_id': 'stored', 'source': 'desktop', 'inline_images': False})
        assert ('config.set', {'profile': 'alpha', 'session_id': 'runtime', 'key': 'model', 'value': 'native-model --session --provider native-provider', 'scope': 'session'}) in calls
        assert ('image.attach_bytes', {'profile': 'alpha', 'session_id': 'runtime', 'content_base64': 'aGVsbG8='}) in calls
        assert calls[-1] == ('prompt.submit', {'profile': 'alpha', 'session_id': 'runtime', 'text': 'Actual user text'})
        response = await client.get('/api/plugins/chathermes/workspace/sessions/stored/messages?profile=alpha')
        assert response.json()['messages'] == [{'role': 'assistant', 'content': 'Native history'}]
        response = await client.post('/api/plugins/chathermes/workspace/runs/stored/stop?profile=alpha')
        assert response.status_code == 200
        assert calls[-1] == ('session.interrupt', {'session_id': 'runtime', 'profile': 'alpha'})


@run_async
async def test_rpc_dispatch_errors_are_generic_and_transport_cleanup_is_safe(app, monkeypatch):
    import sys
    import types
    def dispatch(req, transport):
        return {'id': req['id'], 'error': {'code': -32000, 'message': KEY}}
    server = types.SimpleNamespace(dispatch=dispatch, unregister_live_transport=lambda t: None, _close_sessions_for_transport=lambda t, **kwargs: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/projects')
        assert response.status_code == 409
        assert KEY not in response.text


def test_workspace_event_adapter_preserves_order_ids_and_safe_failure():
    def frame(kind, payload, sid='runtime'):
        return {'method': 'event', 'params': {'type': kind, 'session_id': sid, 'payload': payload}}
    assert plugin._workspace_frame(frame('message.delta', {'text': 'Text'}), 'runtime')[1]['delta'] == 'Text'
    assert plugin._workspace_frame(frame('message.delta', {'text': 'Wrong'}, 'other'), 'runtime') is None
    tool = plugin._workspace_frame(frame('tool.complete', {'name': 'terminal', 'tool_id': 'call', 'result': {'output': 'ok'}}), 'runtime')
    assert tool[0] == 'tool.completed' and tool[1]['tool_call_id'] == 'call' and 'ok' in tool[1]['output']
    assert KEY not in str(plugin._workspace_frame(frame('message.complete', {'status': 'error', 'error': KEY}), 'runtime'))


@run_async
async def test_model_flags_and_malformed_input_cannot_mutate_profile_config(app, rpc):
    calls, _, _ = rpc
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for body in ({'input': 'hello', 'model': 'model --global'}, {'input': 'hello', 'provider': 'bad provider', 'model': 'model'}, {'input': [None]}, {'input': [{'type': 'text', 'text': 7}]}):
            response = await client.post('/api/plugins/chathermes/workspace/sessions/stored/chat/stream?profile=alpha', json=body)
            assert response.status_code == 422
        response = await client.post('/api/plugins/chathermes/workspace/sessions/stored/chat/stream', content='{bad')
        assert response.status_code == 422
    assert not any(method in ('config.set', 'prompt.submit') for method, _ in calls)


@run_async
async def test_automatic_project_path_ids_use_query_parameters(app, rpc):
    calls, nodes, _ = rpc
    nodes['/repo/with space'] = {'id': '/repo/with space', 'label': 'Auto repo', 'isAuto': True, 'path': '/repo/with space', 'repos': []}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        params = {'project_id': '/repo/with space', 'profile': 'alpha'}
        response = await client.get('/api/plugins/chathermes/projects/detail', params=params)
        assert response.status_code == 200 and response.json()['project']['id'] == params['project_id']
        response = await client.post('/api/plugins/chathermes/projects/session', params=params)
        assert response.status_code == 201
    assert calls[-1] == ('session.create', {'source': 'desktop', 'profile': 'alpha', 'cwd': '/repo/with space', 'cwd_explicit': True})


def test_native_history_projection_keeps_tool_output_and_durable_row_ids():
    assert plugin._workspace_message({'role': 'tool', 'text': None, 'content': '{"output":"/project/worktree"}', 'name': 'terminal', 'row_id': 42}) == {
        'role': 'tool', 'content': '{"output":"/project/worktree"}', 'tool_name': 'terminal', 'id': '42'}
    assert '/project/worktree' in plugin._workspace_message({'role': 'tool', 'content': {'output': '/project/worktree'}})['content']
    assert plugin._workspace_message({'role': 'assistant', 'text': 'Visible text', 'content': 'raw'})['content'] == 'Visible text'


@pytest.mark.parametrize('error', [
    {'code': 4000, 'message': 'invalid params for session.create: cwd_explicit: Extra inputs are not permitted'},
    {'code': 4000, 'message': 'cwd_explicit', 'data': {'detail': 'Extra inputs are not permitted'}},
])
@run_async
async def test_rpc_transport_preserves_cwd_schema_rejection_for_retry(monkeypatch, error):
    import sys
    import types

    def dispatch(request, transport):
        return {'id': request['id'], 'error': error}

    server = types.SimpleNamespace(dispatch=dispatch, unregister_live_transport=lambda t: None, _close_sessions_for_transport=lambda t, **kwargs: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server))
    transport = plugin._RpcTransport()
    try:
        with pytest.raises(plugin._CwdExplicitUnsupported):
            await transport.call('session.create', {'cwd_explicit': True})
    finally:
        transport.close()


@run_async
async def test_workspace_resume_retries_native_rejection_of_inline_images(monkeypatch):
    import sys
    import types
    calls = []

    def dispatch(request, transport):
        calls.append(request['params'].copy())
        if 'inline_images' in request['params']:
            return {'id': request['id'], 'error': {'code': 4000,
                'message': 'invalid params for session.resume: inline_images: Extra inputs are not permitted'}}
        return {'id': request['id'], 'result': {'session_id': 'runtime', 'messages': []}}

    server = types.SimpleNamespace(dispatch=dispatch, unregister_live_transport=lambda t: None, _close_sessions_for_transport=lambda t, **kwargs: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server))
    transport = plugin._RpcTransport()
    try:
        result = await plugin._workspace_resume(transport, 'alpha', 'stored')
        assert result['session_id'] == 'runtime'
        assert calls == [
            {'profile': 'alpha', 'session_id': 'stored', 'source': 'desktop', 'inline_images': False},
            {'profile': 'alpha', 'session_id': 'stored', 'source': 'desktop'},
        ]
    finally:
        transport.close()


def test_workspace_history_preserves_reasoning_and_tool_identity():
    row = {'role': 'assistant', 'row_id': 7, 'text': 'Answer',
           'reasoning_content': 'Plan', 'tool_calls': [{'id': 'call', 'function': {'name': 'terminal', 'arguments': '{}'}}]}
    mapped = plugin._workspace_message(row)
    assert mapped['reasoning_content'] == 'Plan'
    assert mapped['tool_calls'] == row['tool_calls']
    assert mapped['id'] == '7'
    result = plugin._workspace_message({'role': 'tool', 'name': 'terminal', 'tool_call_id': 'call', 'content': {'output': 'ok'}})
    assert result['tool_call_id'] == 'call'
    assert 'ok' in result['content']


def test_workspace_tool_error_retains_native_identity_and_details():
    frame = {'method': 'event', 'params': {'type': 'tool.complete', 'session_id': 'runtime',
             'payload': {'name': 'terminal', 'tool_id': 'call', 'is_error': True,
                         'duration_s': 1.8, 'result': {'error': 'Command failed'}}}}
    name, data = plugin._workspace_frame(frame, 'runtime', 'stored')
    assert name == 'tool.failed'
    assert data['tool_call_id'] == 'call'
    assert data['duration_s'] == 1.8
    assert 'Command failed' in data['output']


@run_async
async def test_workspace_resume_emits_text_snapshot_not_replayed_delta():
    class Transport:
        closed = False
        def close(self):
            self.closed = True
    class Request:
        async def is_disconnected(self):
            return False
    transport = Transport()
    response = plugin._workspace_events(Request(), transport, 'runtime', 'stored',
                                        {'running': False, 'inflight': {'assistant': 'Already received'}})
    body = ''.join([part async for part in response.body_iterator])
    assert 'event: assistant.snapshot' in body
    assert '"text": "Already received"' in body
    assert 'event: assistant.delta' not in body
    assert 'event: run.completed' in body
    assert transport.closed


@run_async
async def test_runs_admission_actions_and_replay_cursor(app, monkeypatch):
    import json
    bodies = [{"session_id": "s1", "input": [{"role": "user", "content": [{"type": "text", "text": "hi"}]}]},
              {"choice": "once", "request_id": "req1"}, {"input": "guidance"}, None]
    seen = []
    def gateway(request):
        seen.append(request)
        assert request.headers["authorization"] == f"Bearer {KEY}"
        return httpx.Response(202 if request.url.path.endswith('/runs') else 200,
                              json={"run_id": "run_1", "status": "started"})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for path, body in zip(['/v1/runs', '/v1/runs/run_1/approval', '/v1/runs/run_1/steer', '/v1/runs/run_1/stop'], bodies):
            response = await client.post('/api/plugins/chathermes' + path + '?profile=alpha', json=body)
            assert response.status_code in (200, 202)
            assert KEY not in response.text
        response = await client.get('/api/plugins/chathermes/v1/runs/run_1/events?profile=alpha&last_seq=42')
        assert response.status_code == 200
    assert [json.loads(request.content) for request in seen[:3]] == bodies[:3]
    assert all(request.url.path.startswith('/p/alpha/v1/runs') for request in seen)
    assert seen[-1].url.query == b'last_seq=42'


@pytest.fixture
def scheduled(monkeypatch, tmp_path):
    import sys
    import types
    from contextlib import nullcontext
    from datetime import datetime
    homes = {name: tmp_path / name for name in ('default', 'beta')}
    jobs = {name: [{'id': 'audit', 'name': 'Security Audit', 'enabled': True,
                    'prompt': KEY, 'base_url': 'private', 'hermes_home': '/secret'}] for name in homes}
    history = {name: [] for name in homes}
    messages = {}
    conversations = {}
    tips = {}
    opened = []
    class DB:
        def __init__(self, profile): self.profile = profile
        def list_cron_job_runs(self, job, limit, offset): return history[self.profile][offset:offset + limit]
        def get_session(self, run): return next((row for row in history[self.profile] if row['id'] == run), None)
        def get_messages(self, run): return messages.get((self.profile, run), [])
        def get_messages_as_conversation(self, run, include_ancestors, include_compacted):
            return conversations.get((self.profile, run), self.get_messages(run))
        def resolve_resume_session_id(self, run): return tips.get((self.profile, run), run)
        def close(self): pass
    def open_db(profile, read_only):
        assert read_only
        opened.append(profile)
        return DB(profile)
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_cron', types.SimpleNamespace(
        _cron_profile_home=lambda profile: (profile or 'default', homes[profile or 'default']),
        _call_cron_for_profile=lambda profile, method, *args: jobs[profile],
        _cron_store_scope=lambda home: nullcontext()))
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_sessions', types.SimpleNamespace(_open_session_db_for_profile=open_db))
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_routers.cron', types.SimpleNamespace(
        _iso_to_epoch=lambda value: datetime.fromisoformat(value).timestamp() if value else None,
        _execution_contains=lambda attempt, stamp, grace: stamp >= attempt['claimed_at'] and (attempt['finished_at'] is None or stamp <= attempt['finished_at'] + grace),
        _cron_output_run_timestamp=lambda path: datetime.strptime(path.stem, '%Y-%m-%d_%H-%M-%S').timestamp(),
        _doc_matches_session=lambda stamp, row, grace: row['started_at'] - grace <= stamp <= (row.get('ended_at') or row['started_at']) + grace))
    monkeypatch.setattr(plugin, '_scheduled_attempts', lambda home, job: [])
    return homes, jobs, history, messages, opened


@run_async
async def test_scheduled_profile_history_pagination_output_and_redaction(app, scheduled):
    homes, jobs, history, messages, opened = scheduled
    history['beta'] = [{'id': f'cron_audit_20260101_{i:06d}', 'source': 'cron', 'started_at': i,
                        'ended_at': i + 1, 'system_prompt': 'private'} for i in range(530)]
    run = history['beta'][0]['id']
    messages['beta', run] = [{'role': 'system', 'content': 'hidden'}, {'role': 'assistant', 'content': KEY},
                            {'role': 'tool', 'content': 'full tool output', 'tool_name': 'terminal'}]
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        listed = await client.get('/api/plugins/chathermes/scheduled?profile=beta')
        assert listed.status_code == 200
        assert KEY not in listed.text and '/secret' not in listed.text and 'base_url' not in listed.text
        page = await client.get('/api/plugins/chathermes/scheduled/runs?profile=beta&job_id=audit&offset=500')
        assert page.status_code == 200
        assert len(page.json()['runs']) == 30 and not page.json()['has_more']
        assert page.json()['runs'][0]['started_at'] == 29
        assert 'system_prompt' not in page.text
        output = await client.get('/api/plugins/chathermes/scheduled/output', params={'profile': 'beta', 'job_id': 'audit', 'run_id': run})
        assert output.status_code == 200 and KEY not in output.text
        assert [row['role'] for row in output.json()['messages']] == ['assistant', 'tool']
        assert output.json()['session_id'] == run
        denied = await client.get('/api/plugins/chathermes/scheduled/output', params={'job_id': 'audit', 'run_id': run})
        assert denied.status_code == 404
    assert set(opened) == {'default', 'beta'}


@run_async
async def test_scheduled_saved_outputs_mixed_history_and_invalid_selections(app, scheduled):
    from datetime import datetime
    homes, jobs, history, messages, _ = scheduled
    root = homes['default'] / 'cron' / 'output' / 'audit'
    root.mkdir(parents=True)
    (root / '2026-01-01_00-00-00.md').write_text('# Old audit\nAll clear')
    (root / '2026-01-02_00-00-00.md').write_text('Duplicate agent output')
    (root / '2026-01-03_00-00-00.md').symlink_to(root / '2026-01-01_00-00-00.md')
    history['default'] = [{'id': 'cron_audit_20260102_000000', 'source': 'cron', 'started_at': datetime(2026, 1, 2).timestamp()}]
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        result = await client.get('/api/plugins/chathermes/scheduled/runs?job_id=audit')
        assert [row['id'] for row in result.json()['runs']] == ['cron_audit_20260102_000000', 'output:2026-01-01_00-00-00']
        output = await client.get('/api/plugins/chathermes/scheduled/output?job_id=audit&run_id=output:2026-01-01_00-00-00')
        assert output.json()['output'] == '# Old audit\nAll clear'
        for params in ({'job_id': '../audit'}, {'job_id': 'missing'}, {'job_id': 'audit', 'offset': -1}, {'job_id': 'audit', 'limit': 101}):
            assert (await client.get('/api/plugins/chathermes/scheduled/runs', params=params)).status_code in (404, 422)
        for run in ('output:../../secret', 'output:2026-01-03_00-00-00', 'cron_other_20260102_000000'):
            assert (await client.get('/api/plugins/chathermes/scheduled/output', params={'job_id': 'audit', 'run_id': run})).status_code in (404, 422)


@run_async
async def test_scheduled_internal_failure_does_not_expose_details(app, monkeypatch):
    def fail(request): raise RuntimeError(KEY + '/private/home')
    monkeypatch.setattr(plugin, '_scheduled_context', fail)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        response = await client.get('/api/plugins/chathermes/scheduled')
    assert response.status_code == 502 and KEY not in response.text and '/private' not in response.text


@run_async
async def test_scheduled_failed_execution_without_output_is_inspectable(app, scheduled, monkeypatch):
    import sys
    import types
    homes, *_ = scheduled
    run = 'execution:' + 'a' * 32
    monkeypatch.setattr(plugin, '_scheduled_attempts', lambda home, job: [
        {'id': run, 'started_at': 100, 'source': 'cron_execution', 'title': 'Failed', 'end_reason': 'failed'}])
    monkeypatch.setitem(sys.modules, 'cron.executions', types.SimpleNamespace(get_execution=lambda identifier: {
        'job_id': 'audit', 'claimed_at': '2026-01-01T00:00:00', 'error': KEY}))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        page = await client.get('/api/plugins/chathermes/scheduled/runs?job_id=audit')
        assert page.json()['runs'][0]['id'] == run
        output = await client.get('/api/plugins/chathermes/scheduled/output', params={'job_id': 'audit', 'run_id': run})
        assert output.status_code == 200 and output.json()['messages'] == [] and KEY not in output.text


def test_scheduled_execution_ledger_reads_older_pages_in_profile_scope(monkeypatch, tmp_path):
    import sys
    import types
    from contextlib import contextmanager
    from datetime import datetime, timedelta
    scoped = []
    @contextmanager
    def scope(home):
        scoped.append(home)
        yield
        scoped.pop()
    rows = [{'id': f'{i:032x}', 'claimed_at': (datetime(2026, 1, 1) + timedelta(seconds=i)).isoformat(), 'status': 'failed'} for i in range(520)]
    rows.reverse()
    calls = []
    def page(*, job_id, limit, before_claimed_at):
        assert scoped == [tmp_path]
        assert job_id == 'audit'
        calls.append(before_claimed_at)
        return [row for row in rows if not before_claimed_at or row['claimed_at'] < before_claimed_at][:limit]
    monkeypatch.setitem(sys.modules, 'cron.executions', types.SimpleNamespace(list_executions=page))
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_cron', types.SimpleNamespace(_cron_store_scope=scope))
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_routers.cron', types.SimpleNamespace(_iso_to_epoch=lambda value: datetime.fromisoformat(value).timestamp() if value else None))
    result = plugin._scheduled_attempts(tmp_path, 'audit')
    assert len(result) == 520 and len(calls) == 2
    assert result[-1]['id'] == 'execution:' + '0' * 32
    assert not scoped


@run_async
async def test_scheduled_older_hermes_returns_compatibility_error(app, monkeypatch):
    import sys
    import types
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_cron', types.SimpleNamespace())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        response = await client.get('/api/plugins/chathermes/scheduled')
    assert response.status_code == 503
    assert response.json()['detail'] == 'Scheduled history is unavailable in this Hermes version'


@run_async
async def test_scheduled_distinct_failed_attempts_are_never_deduplicated(app, scheduled, monkeypatch):
    import sys
    import types
    attempts = [
        {'id': 'execution:' + '1' * 32, 'source': 'cron_execution', 'started_at': 101, 'ended_at': 102, 'title': 'Failed'},
        {'id': 'execution:' + '2' * 32, 'source': 'cron_execution', 'started_at': 102, 'ended_at': 103, 'title': 'Failed'},
    ]
    monkeypatch.setattr(plugin, '_scheduled_attempts', lambda home, job: attempts)
    monkeypatch.setattr(plugin, '_scheduled_docs', lambda home, job: [])
    monkeypatch.setattr(plugin, '_scheduled_job', lambda profile, job: {'id': job})
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_sessions', types.SimpleNamespace(_open_session_db_for_profile=lambda profile, read_only: type('DB', (), {'list_cron_job_runs': lambda self, job, limit, offset: [], 'close': lambda self: None})()))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        response = await client.get('/api/plugins/chathermes/scheduled/runs?job_id=audit')
    assert response.status_code == 200, response.text
    assert len(response.json()['runs']) == 2


@run_async
async def test_scheduled_reads_complete_compressed_run_lineage(app, scheduled, monkeypatch):
    import sys
    import types
    root = 'cron_audit_20260101_000000'
    child = root + '_child'
    class DB:
        def get_session(self, run):
            return {'id': run, 'source': 'cron', 'started_at': 100} if run in (root, child) else None
        def resolve_resume_session_id(self, run):
            assert run == root
            return child
        def get_messages_as_conversation(self, run, include_ancestors, include_compacted):
            assert run == child and include_ancestors and include_compacted
            return [{'role': 'system', 'content': 'hidden'},
                    {'role': 'tool', 'tool_name': 'terminal', 'content': 'Earlier audit checks'},
                    {'role': 'assistant', 'content': 'Final answer from compressed child', 'reasoning_content': 'Audited dependencies'}]
        def close(self): pass
    def open_db(profile, read_only):
        assert profile == 'beta' and read_only
        return DB()
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_sessions', types.SimpleNamespace(_open_session_db_for_profile=open_db))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        output = await client.get('/api/plugins/chathermes/scheduled/output', params={'profile': 'beta', 'job_id': 'audit', 'run_id': root})
    assert output.status_code == 200
    assert output.json()['session_id'] == root
    assert [row['content'] for row in output.json()['messages']] == ['Earlier audit checks', 'Final answer from compressed child']
    assert output.json()['messages'][-1]['reasoning_content'] == 'Audited dependencies'
