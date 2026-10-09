"""Gateway proxy contract, exercised without reading any local Hermes configuration."""
import importlib.util
import asyncio
import re
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
async def test_pwa_assets_are_served_with_safe_types_and_path_containment(app):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        manifest = await client.get('/api/plugins/chathermes/assets/dist/manifest.webmanifest')
        assert manifest.status_code == 200
        assert manifest.headers['content-type'].startswith('application/manifest+json')
        assert manifest.headers['x-content-type-options'] == 'nosniff'
        assert [icon['sizes'] for icon in manifest.json()['icons']] == ['192x192', '512x512']

        icon = await client.get('/api/plugins/chathermes/assets/dist/icons/icon-192.png')
        assert icon.status_code == 200
        assert icon.headers['content-type'].startswith('image/png')
        touch_icon = await client.get('/api/plugins/chathermes/assets/dist/apple-touch-icon.png')
        assert touch_icon.status_code == 200
        assert touch_icon.headers['content-type'].startswith('image/png')
        assert touch_icon.content.startswith(bytes.fromhex('89504e470d0a1a0a'))
        assert touch_icon.content == icon.content

        for path in ('../../plugin_api.py', 'push-service-worker.js', 'unknown.txt'):
            response = await client.get('/api/plugins/chathermes/assets/dist/' + path)
            assert response.status_code == 404


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
                             ("GET", "/api/sessions/s1/messages?order=oldest&inline_images=false")]:
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
@pytest.mark.parametrize('missing', [None, 'pywebpush', 'py_vapid'])
async def test_push_config_checks_dashboard_runtime_dependencies(app, monkeypatch, tmp_path, missing):
    import sys
    store = plugin._push_store_module
    state = tmp_path / 'push.json'
    monkeypatch.setattr(store, '_path', lambda: state)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        # Restore only the simulated missing dependency. Snapshotting all of
        # sys.modules unloads new cryptography imports and breaks native class
        # identity when a later test imports them again.
        with monkeypatch.context() as dependencies:
            if missing:
                dependencies.setitem(sys.modules, missing, None)
            response = await client.get('/api/plugins/chathermes/push/config')
        assert response.status_code == 200
        result = response.json()
        if missing:
            assert result == {'available': False, 'vapid_public_key': None}
            assert not state.exists()
        else:
            assert result['available'] is True
            assert len(result['vapid_public_key']) == 87
            assert set(result) == {'available', 'vapid_public_key'}
            assert (await client.get('/api/plugins/chathermes/push/config')).json() == result
            import json
            assert json.loads(state.read_text())['vapid']['private_key'] not in response.text
            # Dependency probes must leave native cryptography imports usable
            # when a later profile needs a fresh keypair in the same process.
            fresh_state = tmp_path / 'fresh-push.json'
            monkeypatch.setattr(store, '_path', lambda: fresh_state)
            fresh = await client.get('/api/plugins/chathermes/push/config')
            assert fresh.json()['available'] is True
            assert fresh_state.exists()
        # Missing optional libraries do not take unrelated plugin routes down.
        assert (await client.get('/api/plugins/chathermes/push-service-worker.js')).status_code == 200


@run_async
async def test_push_subscription_routes_validate_scope_and_never_echo_key_material(app, monkeypatch):
    import types
    from pathlib import Path
    worker = Path(plugin.__file__ or __file__).parent / 'dist' / 'push-service-worker.js'
    existed = worker.exists()
    if not existed:
        worker.parent.mkdir(parents=True, exist_ok=True)
        worker.write_bytes(b"self.addEventListener('push', () => {})")
    def upsert(profile, value):
        if not value.get('endpoint', '').startswith('https://'):
            raise ValueError('Invalid push endpoint')
        return {'id': 'sub_123', 'profile': profile, 'enabled': True}
    store = types.SimpleNamespace(
        config=lambda: {'available': True, 'vapid_public_key': 'public-only'},
        upsert=upsert,
        remove=lambda profile, identity: profile == 'alpha' and identity == 'sub_123')
    monkeypatch.setattr(plugin, '_push_store_module', store)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/push/config')
        assert response.json() == {'available': True, 'vapid_public_key': 'public-only'}
        service_worker = await client.get('/api/plugins/chathermes/push-service-worker.js')
        assert service_worker.status_code == 200
        assert service_worker.headers['service-worker-allowed'] == '/chathermes'
        assert re.search(r"""addEventListener\(\s*(['"])push\1""", service_worker.text)
        body = {'endpoint': 'https://push.test/private-endpoint', 'keys': {'p256dh': 'secret-key', 'auth': 'secret-auth'}}
        response = await client.post('/api/plugins/chathermes/push/subscriptions?profile=alpha', json=body)
        assert response.status_code == 200
        assert response.json() == {'id': 'sub_123', 'profile': 'alpha', 'enabled': True}
        assert all(secret not in response.text for secret in ('private-endpoint', 'secret-key', 'secret-auth'))
        assert (await client.delete('/api/plugins/chathermes/push/subscriptions/sub_123?profile=alpha')).json() == {'removed': True}
        assert (await client.post('/api/plugins/chathermes/push/subscriptions', json={'endpoint': 'http://bad'})).status_code == 422
        too_large = await client.post('/api/plugins/chathermes/push/subscriptions', content=b' ' * 8193)
        assert too_large.status_code == 413
    if not existed:
        worker.unlink()


@run_async
@pytest.mark.parametrize("gateway_status", [401, 403])
async def test_gateway_auth_failure_is_safe(app, monkeypatch, gateway_status):
    monkeypatch.setattr(plugin, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(
        lambda request: httpx.Response(gateway_status, text=KEY))))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        for method, route in (("get", "/sessions"), ("get", "/sessions/s1/messages")):
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

@pytest.mark.parametrize("route", ["/sessions", "/sessions/s1/messages"])
@run_async
async def test_missing_key_is_safe(app, monkeypatch, route):
    monkeypatch.setattr(plugin, "_gateway_settings", lambda: ("http://gateway.test", None))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test") as client:
        response = await client.request("POST" if route.endswith("stream") else "GET", "/api/plugins/chathermes" + route)
    assert response.status_code == 503
    assert "platforms.api_server.key" in response.text
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

@run_async
async def test_native_rollout_gate_is_explicit_and_cannot_dispatch(app, monkeypatch):
    def forbidden(*args, **kwargs):
        raise AssertionError('Capability gate must not dispatch/admit native work')
    monkeypatch.setattr(plugin._RpcTransport, 'call', forbidden)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        result = await client.get('/api/plugins/chathermes/chat/capabilities')
    assert result.status_code == 200
    body = result.json()
    assert body['admission'] is True and body['mode'] == 'native-retained'
    assert body['guarantees']['offline_turn_lease'] is True
    assert body['guarantees']['crash_safe_idempotency'] is False
    for method in ('prompt.submit', 'session.resume', 'session.events.since', 'config.set', 'image.attach_bytes', 'chat.submit'):
        assert plugin._chat_gateway.response({'jsonrpc': '2.0', 'id': 1, 'method': method})['error']['code'] == -32601
    assert KEY not in result.text


@pytest.mark.parametrize('frame', [[], None, {'jsonrpc': '2.0', 'id': True},
    {'jsonrpc': '2.0', 'id': {}}, {'jsonrpc': '2.0', 'id': 'x' * 129}])
def test_native_probe_rejects_invalid_frames(frame):
    assert plugin._chat_gateway.response(frame)['error']['code'] == -32600


def test_native_probe_preserves_numeric_string_ids_and_rejects_hidden_params():
    for rid in (0, 7, '7'):
        assert plugin._chat_gateway.response({'jsonrpc': '2.0', 'id': rid, 'method': 'gateway.ping'}) == {
            'jsonrpc': '2.0', 'id': rid, 'result': {'ok': True}}
    for params in ({'profile': 'other'}, {'session_id': 'foreign'}, [], None):
        assert plugin._chat_gateway.response({'jsonrpc': '2.0', 'id': 1, 'method': 'chat.capabilities', 'params': params})['error']['code'] == -32602
    assert plugin._chat_gateway.response({'jsonrpc': '2.0', 'id': 1, 'result': {'choice': 'allow'}})['error']['code'] == -32602


@run_async
async def test_transport_async_response_request_distinction_and_recursive_redaction(monkeypatch):
    import sys
    import types
    def dispatch(req, transport):
        # A native server request is not an RPC reply even if its ID collides.
        transport.write({'jsonrpc': '2.0', 'id': req['id'], 'method': 'approval', 'params': {'ticket': 'private'}})
        transport.write({'id': req['id'], 'result': {'value': KEY, 'nested': {'authorization': 'private'}}})
    server = types.SimpleNamespace(dispatch=dispatch, unregister_live_transport=lambda t: None,
                                   _close_sessions_for_transport=lambda t, **kw: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server))
    transport = plugin._RpcTransport()
    transport.secret = KEY
    try:
        assert await transport.call('session.resume', {}) == {'value': '[redacted]', 'nested': {'authorization': '[redacted]'}}
        request = await transport.events.get()
        assert request['method'] == 'approval' and request['params']['ticket'] == '[redacted]'
        transport.write({'id': 'late', 'result': {}})
        await asyncio.sleep(0)
        assert transport.events.empty()
        assert not transport.pending
    finally:
        transport.close()


@run_async
async def test_transport_overflow_wakes_waiters_and_event_consumer(monkeypatch):
    import sys
    import types
    attached = []
    def dispatch(req, transport):
        attached.append(transport)
        for index in range(257):
            transport.write({'method': 'event', 'params': {'type': 'message.delta', 'seq': index}})
    server = types.SimpleNamespace(dispatch=dispatch, unregister_live_transport=lambda t: None,
                                   _close_sessions_for_transport=lambda t, **kw: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server))
    transport = plugin._RpcTransport()
    with pytest.raises(plugin.HTTPException) as exc:
        await asyncio.wait_for(transport.call('session.resume', {}), 2)
    assert exc.value.status_code == 503
    assert transport.closed and not transport.pending
    frames = []
    while not transport.events.empty():
        frames.append(transport.events.get_nowait())
    assert frames[-1]['method'] == 'transport.closed'
    with pytest.raises(plugin.HTTPException):
        await transport.call('session.resume', {})


@run_async
async def test_all_workspace_content_is_validated_before_native_mutation(app, rpc):
    calls, _, _ = rpc
    valid_image = {'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,iVBORw0KGgo='}}
    bodies = [
        {'input': [valid_image, {'type': 'text', 'text': None}], 'model': 'valid-model'},
        {'input': [valid_image, {'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,%%%'}}]},
        {'input': [{'type': 'image_url', 'image_url': {'url': 'data:image/jpeg;base64,iVBORw0KGgo='}}]},
        {'input': [valid_image] * 9}, {'input': 'hello', 'provider': 'litellm'},
        {'input': 'hello', 'profile': 'foreign'}, {'input': ''},
    ]
    for body in bodies:
        with pytest.raises(plugin.HTTPException) as failure:
            plugin._validated_workspace_turn(body)
        assert failure.value.status_code in (422, 413)
    assert calls == []


@pytest.mark.parametrize('case,expected', [
    ('valid', None), ('no-ticket', 4401), ('query-secret', 4401), ('no-auth', 4401),
    ('no-identity', 4401), ('bad-origin', 4403), ('missing-origin', 4403),
    ('disabled', 4404), ('missing-profile', 4403), ('oversize', 1009), ('disable-after-accept', 4404),
])
@run_async
async def test_native_socket_auth_gates_before_accept_and_runtime_disable(monkeypatch, case, expected):
    import sys
    import types
    from fastapi import WebSocketDisconnect
    gate = plugin._chat_gateway
    enabled = [True]
    monkeypatch.setattr(gate, '_enabled', lambda: case != 'disabled' and enabled[0])
    def profile(ws):
        if case == 'missing-profile':
            raise plugin.HTTPException(404, 'private profile detail')
    monkeypatch.setattr(gate, '_profile', profile)
    def auth(ws):
        if case != 'no-identity':
            ws._hermes_auth_identity = {'user_id': 'fixture-user', 'provider': 'basic'}
        return ('invalid' if case == 'no-auth' else None, 'ticket-subprotocol')
    auth_module = types.SimpleNamespace(
        _gateway_ws_ticket_from_subprotocol=lambda ws: ('' if case == 'no-ticket' else 'ephemeral', 'ok'),
        _ws_auth_reason=auth, _ws_request_is_allowed=lambda ws: case != 'bad-origin')
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_chat', auth_module)
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server', types.SimpleNamespace(app=types.SimpleNamespace(state=types.SimpleNamespace(auth_required=True))))
    class WS:
        headers = {'origin': '' if case == 'missing-origin' else 'https://dashboard.test'}
        query_params = {'ticket': 'must-not-be-accepted'} if case == 'query-secret' else {}
        accepted = False
        closes = []
        frames = []
        received = False
        async def accept(self, subprotocol):
            assert subprotocol == 'hermes-gateway-v1'
            self.accepted = True
        async def close(self, code):
            self.closes.append(code)
        async def send_json(self, frame):
            self.frames.append(frame)
        async def receive_text(self):
            if self.received:
                raise WebSocketDisconnect()
            self.received = True
            if case == 'disable-after-accept':
                enabled[0] = False
            if case == 'oversize':
                return 'x' * (gate.MAX_FRAME_BYTES + 1)
            return '{"jsonrpc":"2.0","id":1,"method":"prompt.submit"}'
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None,
        unregister_live_transport=lambda t: None, _close_sessions_for_transport=lambda *a, **kw: None)
    requests = types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server, server_requests=requests))
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda ws: plugin._RpcTransport())
    ws = WS()
    await gate.socket(ws, plugin)
    if expected:
        assert ws.closes == [expected]
        assert ws.accepted == (case in ('oversize', 'disable-after-accept'))
    else:
        assert ws.accepted and ws.frames[0]['method'] == 'chat.ready'
        assert ws.frames[-1]['error']['code'] == 409
    assert 'ephemeral' not in str(ws.frames) and KEY not in str(ws.frames)


@run_async
async def test_rpc_timeout_cleans_correlation_and_late_response_is_discarded(monkeypatch):
    import sys
    import types
    requests = []
    server = types.SimpleNamespace(dispatch=lambda request, transport: requests.append(request),
                                   unregister_live_transport=lambda t: None, _close_sessions_for_transport=lambda t, **kw: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server))
    transport = plugin._RpcTransport()
    transport.timeout = 0.01
    try:
        with pytest.raises(plugin.HTTPException) as exc:
            await transport.call('session.resume', {})
        assert exc.value.status_code == 503 and not transport.pending
        transport.write({'id': requests[0]['id'], 'result': {'session_id': 'late'}})
        await asyncio.sleep(0)
        assert transport.events.empty()
    finally:
        transport.close()


@run_async
async def test_native_facade_requires_explicit_busy_queue(monkeypatch):
    import sys, types
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server_requests=types.SimpleNamespace()))
    calls = []
    class Transport:
        async def call(self, method, params):
            calls.append((method, params))
            if method == 'session.activate':
                return {'running': True}
            return {'status': 'queued', 'user_row_id': 4}
    channel = plugin._native_channel.Channel(plugin, Transport(), 'test-profile')
    channel.runtime = 'runtime'
    rejected = await channel.handle({'jsonrpc': '2.0', 'id': 1, 'method': 'chat.submit', 'params': {'input': 'hello'}})
    assert rejected['error']['data']['outcome'] == 'rejected'
    assert all(method != 'prompt.submit' for method, _ in calls)
    result = await channel.operation('chat.submit', {'input': 'hello', 'queued': True})
    assert result['status'] == 'queued'
    assert calls[-1] == ('prompt.submit', {'profile': 'test-profile', 'session_id': 'runtime', 'text': 'hello', 'queued': True})
    with pytest.raises(plugin.HTTPException):
        await channel.operation('prompt.submit', {'profile': 'default'})


@run_async
@pytest.mark.parametrize('error_code', [409, 503])
async def test_native_submit_timeout_is_unknown_not_rejected(monkeypatch, error_code):
    import sys
    import types
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server_requests=types.SimpleNamespace()))
    class Transport:
        async def call(self, method, params):
            if method == 'session.activate':
                return {'running': False}
            raise plugin.HTTPException(error_code, 'Hermes gateway RPC unavailable')
    channel = plugin._native_channel.Channel(plugin, Transport(), 'default')
    channel.runtime = 'runtime'
    result = await channel.handle({'jsonrpc': '2.0', 'id': 'send', 'method': 'chat.submit', 'params': {'input': 'hello'}})
    assert result['error']['outcome'] == 'unknown'


@run_async
@pytest.mark.parametrize('profile', ['default', 'alpha'])
async def test_native_attach_and_first_submit_with_resume_schema_without_inline_images(app, monkeypatch, tmp_path, profile):
    import sys
    import types
    import threading
    from contextlib import contextmanager
    from contextvars import ContextVar
    from pydantic import BaseModel, ConfigDict, ValidationError

    # us1's older native contract rejects unknown fields before any resume.
    class ResumeParams(BaseModel):
        model_config = ConfigDict(extra='forbid')
        profile: str
        session_id: str
        source: str
        omit_messages: bool = False

    launch_home = tmp_path / 'default'
    home = tmp_path / profile
    scoped_home = ContextVar('first_send_home', default=launch_home)
    sessions = {}
    lookups = []

    @contextmanager
    def profile_scope(selected):
        token = scoped_home.set(tmp_path / selected)
        try:
            yield
        finally:
            scoped_home.reset(token)

    @contextmanager
    def profile_db(params):
        assert params == {'profile': profile}
        # session.create deliberately leaves an empty draft without a DB row.
        def get_session(stored):
            lookups.append(stored)
            return None
        yield types.SimpleNamespace(get_session=get_session)

    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_profiles', types.SimpleNamespace(_config_profile_scope=profile_scope))
    monkeypatch.setitem(sys.modules, 'hermes_constants', types.SimpleNamespace(
        get_hermes_home=scoped_home.get, get_process_hermes_home=lambda: launch_home))

    calls = []
    def dispatch(request, transport):
        calls.append(request)
        if request['method'] == 'session.create':
            assert request['params'] == {'profile': profile, 'source': 'desktop'}
            sessions['runtime'] = {'session_key': 'stored',
                'profile_home': None if profile == 'default' else str(home), 'transport': transport}
            result = {'session_id': 'runtime', 'stored_session_id': 'stored'}
        elif request['method'] == 'session.resume':
            try:
                params = ResumeParams.model_validate(request['params'])
            except ValidationError:
                return {'id': request['id'], 'error': {'code': 4000,
                    'message': 'invalid params for session.resume: inline_images: Extra inputs are not permitted'}}
            assert params.profile == profile and params.session_id == 'stored'
            assert params.source == 'desktop' and not params.omit_messages
            result = {'session_id': 'runtime', 'messages': [], 'message_count': 0}
        elif request['method'] == 'session.activate':
            result = {'session_id': 'runtime', 'messages': [], 'running': False}
        elif request['method'] == 'session.events.since':
            assert request['params'] == {'profile': profile, 'session_id': 'runtime', 'last_seen': 0}
            result = {'events': [], 'latest_seq': 0, 'epoch': 'first-send', 'truncated': False, 'open_requests': []}
        else:
            assert request['method'] == 'prompt.submit'
            result = {'status': 'streaming', 'user_row_id': 1}
        return {'id': request['id'], 'result': result}

    def detach(transport, **kw):
        for record in sessions.values():
            if record['transport'] is transport:
                record['transport'] = None

    server = types.SimpleNamespace(dispatch=dispatch, unregister_live_transport=lambda t: None,
        _close_sessions_for_transport=detach, _profile_db=profile_db,
        _sessions=sessions, _sessions_lock=threading.RLock(), register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server, server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None),
        event_replay=types.SimpleNamespace(replay_epoch=lambda: 'first-send')))
    monkeypatch.setattr(plugin._native_channel, 'register_profile_secrets', lambda *args: None)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        created = await client.post('/api/plugins/chathermes/chat/sessions', params={'profile': profile}, json={})
    assert created.status_code == 200
    assert created.json()['session']['id'] == 'stored'
    assert sessions['runtime']['transport'] is None

    transport = plugin._RpcTransport()
    channel = plugin._native_channel.Channel(plugin, transport, profile)
    try:
        # A foreign draft must never reach resume's cold-adoption path.
        sessions['foreign-runtime'] = {'session_key': 'foreign', 'profile_home': str(tmp_path / 'other'), 'transport': None}
        foreign = await channel.handle({'jsonrpc': '2.0', 'id': 'foreign', 'method': 'chat.attach', 'params': {'session_id': 'foreign'}})
        assert foreign['error']['code'] == 404 and foreign['error']['outcome'] == 'rejected'
        assert [call['method'] for call in calls] == ['session.create']
        attached = await channel.handle({'jsonrpc': '2.0', 'id': 'attach', 'method': 'chat.attach', 'params': {'session_id': 'stored'}})
        assert attached.get('result', {}).get('session_id') == 'runtime', attached
        replay = await channel.handle({'jsonrpc': '2.0', 'id': 'replay', 'method': 'chat.replay', 'params': {'offset': 0, 'through': 0}})
        assert replay['result']['frames'] == []
        submitted = await channel.handle({'jsonrpc': '2.0', 'id': 'send', 'method': 'chat.submit', 'params': {'input': 'first message'}})
        assert submitted['result']['outcome'] == 'accepted'
        assert lookups == ['foreign', 'stored']
        assert [call['method'] for call in calls] == ['session.create', 'session.resume', 'session.events.since', 'session.activate', 'prompt.submit']
        assert calls[-1]['params'] == {'profile': profile, 'session_id': 'runtime', 'text': 'first message'}
    finally:
        if channel.owner:
            channel.owner.close()
        else:
            transport.close()


@run_async
async def test_native_image_route_validates_mime_and_profile_boundary(app, monkeypatch, tmp_path):
    image_id = 'a' * 32 + '.png'
    home = tmp_path / 'default'
    root = home / 'uploads' / 'chathermes'
    root.mkdir(parents=True)
    (root / image_id).write_bytes(b'\x89PNG\r\n\x1a\nfixture')
    monkeypatch.setattr(plugin, '_upload_home', lambda request: home if not request.query_params.get('profile') else tmp_path / 'other')
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/images/' + image_id)
        assert response.status_code == 200 and response.headers['content-type'] == 'image/png'
        assert response.headers['cache-control'] == 'private, no-store'
        assert (await client.get('/api/plugins/chathermes/images/' + image_id + '?profile=other')).status_code == 404
        (root / image_id).write_text('<script>fixture</script>')
        assert (await client.get('/api/plugins/chathermes/images/' + image_id)).status_code == 404
        (root / image_id).unlink()
        (root / image_id).symlink_to(tmp_path / 'missing')
        assert (await client.get('/api/plugins/chathermes/images/' + image_id)).status_code == 404


@run_async
async def test_native_selected_model_must_be_confirmed_before_admission(monkeypatch):
    import sys
    import types
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server_requests=types.SimpleNamespace()))
    monkeypatch.setattr(plugin._native_channel, 'model_selection', lambda *args: ('selected-model', 'litellm'))
    calls = []
    class Transport:
        async def call(self, method, params):
            calls.append(method)
            if method == 'session.activate':
                return {'info': {'model': 'old-model', 'provider': 'litellm'}}
            return {}
    channel = plugin._native_channel.Channel(plugin, Transport(), 'default')
    channel.runtime = 'runtime'
    result = await channel.handle({'jsonrpc': '2.0', 'id': 'select', 'method': 'chat.submit', 'params': {'input': 'hello', 'model': 'selected-model'}})
    assert result['error']['code'] == 409 and result['error']['outcome'] == 'rejected'
    assert calls == ['session.activate', 'approval.pending', 'session.activate', 'config.set', 'session.activate']
    assert 'prompt.submit' not in calls


@run_async
async def test_native_image_directory_symlink_is_rejected(app, monkeypatch, tmp_path):
    home = tmp_path / 'home'
    home.mkdir()
    foreign = tmp_path / 'foreign'
    root = foreign / 'chathermes'
    root.mkdir(parents=True)
    image_id = 'b' * 32 + '.png'
    (root / image_id).write_bytes(b'\x89PNG\r\n\x1a\nfixture')
    (home / 'uploads').symlink_to(foreign, target_is_directory=True)
    monkeypatch.setattr(plugin, '_upload_home', lambda request: home)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        assert (await client.get('/api/plugins/chathermes/images/' + image_id)).status_code == 404


@run_async
@pytest.mark.parametrize('failure', ['http', 'exception'])
async def test_native_model_preflight_failure_rejects_without_prompt_dispatch(monkeypatch, failure):
    import sys
    import types
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server_requests=types.SimpleNamespace()))
    monkeypatch.setattr(plugin._native_channel, 'model_selection', lambda *args: ('selected-model', 'litellm'))
    calls = []
    class Transport:
        async def call(self, method, params):
            calls.append(method)
            if failure == 'http':
                raise plugin.HTTPException(503, 'Hermes gateway RPC unavailable')
            raise RuntimeError('private provider detail')
    channel = plugin._native_channel.Channel(plugin, Transport(), 'default')
    channel.runtime = 'runtime'
    result = await channel.handle({'jsonrpc': '2.0', 'id': 'send', 'method': 'chat.submit', 'params': {'input': 'hello', 'model': 'selected-model'}})
    assert result['error']['outcome'] == 'rejected'
    assert calls == ['session.activate']
    assert 'private provider detail' not in str(result)

@run_async
async def test_retained_owner_recovers_beyond_native_ring_and_browser_absence(monkeypatch):
    import sys, types, threading
    closed = []
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None,
        _sessions={'runtime': {'running': True}}, _sessions_lock=threading.RLock())
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server,
        server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None),
        event_replay=types.SimpleNamespace(replay_epoch=lambda: 'epoch')))
    class Transport:
        closed = False
        loop = asyncio.get_running_loop()
        sanitize = staticmethod(lambda value: value)
        def close(self):
            self.closed = True
            closed.append(True)
    owner = plugin._native_owners.Owner(plugin, Transport(), 'alpha', 'stored')
    owner.runtime = 'runtime'
    queue = asyncio.Queue(maxsize=2); owner.subscribers.add(queue)
    owner.begin({'messages': [{'row_id': 1}]}, 'Question')
    owner.unsubscribe(queue)
    try:
        for seq in range(1, 801):
            owner.capture({'jsonrpc': '2.0', 'method': 'event', 'params': {
                'session_id': 'runtime', 'seq': seq, 'type': 'reasoning.delta', 'payload': {'text': str(seq)}}})
        owner.expire()  # active work must survive even a cleanup deadline
        assert not closed
        recovered, cursor = [], 0
        while cursor < 801:
            page = owner.replay(cursor, 801)
            recovered.extend(page['frames']); cursor = page['offset']
        assert len(recovered) == 801
        assert recovered[0]['method'] == 'chat.input'
        assert [f['params']['seq'] for f in recovered[1:]] == list(range(1, 801))
        owner.capture(recovered[-1])  # duplicate native replay cannot duplicate spool
        assert len(owner.offsets) == 801
        with pytest.raises(plugin.HTTPException):
            owner.replay(True, 801)
        previous_spool = owner.spool
        owner.retire()
        assert previous_spool.closed and not owner.offsets and owner.start_offset == 801
        owner.begin({'messages': [{'row_id': 1}, {'row_id': 2}]}, 'Next')
        assert owner.start_offset == 801 and owner.offsets == [0]
        assert owner.replay(801, 802)['frames'][0]['chat_offset'] == 802
    finally:
        owner.close()
    assert closed == [True] and owner.spool.closed


@run_async
async def test_retained_owner_storage_failure_keeps_live_execution(monkeypatch):
    import sys, types, threading
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None,
        _sessions={}, _sessions_lock=threading.RLock())
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server,
        server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None)))
    class Transport:
        closed = False
        def close(self): self.closed = True
    owner = plugin._native_owners.Owner(plugin, Transport(), 'alpha', 'stored')
    owner.runtime = 'runtime'
    queue = asyncio.Queue(maxsize=4); owner.subscribers.add(queue)
    owner.spool.close()
    try:
        owner.capture({'jsonrpc': '2.0', 'method': 'event', 'params': {
            'session_id': 'runtime', 'seq': 1, 'type': 'message.delta', 'payload': {'text': 'Still running'}}})
        assert owner.degraded and not owner.transport.closed
        assert (await queue.get())['method'] == 'chat.unsupported'
        assert (await queue.get())['params']['payload']['text'] == 'Still running'
    finally:
        owner.close()

@run_async
async def test_retained_queued_input_starts_after_previous_terminal_frame(monkeypatch):
    import sys, types, threading
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None,
        _sessions={}, _sessions_lock=threading.RLock())
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server,
        server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None),
        event_replay=types.SimpleNamespace(replay_epoch=lambda: 'epoch')))
    class Transport:
        sanitize = staticmethod(lambda value: value)
        def close(self): pass
    owner = plugin._native_owners.Owner(plugin, Transport(), 'alpha', 'stored')
    owner.runtime = 'runtime'
    def event(seq, kind):
        owner.capture({'jsonrpc': '2.0', 'method': 'event', 'params': {'session_id': 'runtime', 'seq': seq, 'type': kind}})
    try:
        owner.begin({'messages': []}, 'Same prompt')
        event(1, 'message.start')
        owner.begin({'messages': []}, 'Same prompt', queued=True)
        event(2, 'message.complete')
        event(3, 'message.start')
        frames = owner.replay(0, 5)['frames']
        assert [f['params'].get('type') or f['method'] for f in frames] == [
            'chat.input', 'message.start', 'message.complete', 'chat.input', 'message.start']
        assert len([f for f in frames if f['method'] == 'chat.input']) == 2
        assert not owner.queued_inputs
    finally:
        owner.close()


@run_async
@pytest.mark.parametrize('status, expected', [('complete', 'turn.complete'), ('failed', 'attention'), ('stopped', 'attention'), ('error', 'attention'), ('interrupted', 'attention')])
async def test_retained_owner_completion_uses_loaded_push_sender(monkeypatch, status, expected):
    import sys, types
    from unittest.mock import Mock
    # The plugin loads siblings by spec without registering them in sys.modules.
    monkeypatch.delitem(sys.modules, 'chathermes_push_sender', raising=False)
    sender = Mock()
    monkeypatch.setattr(plugin._push_sender_module, 'notify', sender)
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server,
        server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None)))
    transport = types.SimpleNamespace(close=lambda: None)
    owner = plugin._native_owners.Owner(plugin, transport, 'alpha', 'stored')
    owner.runtime = 'runtime'
    frame = {'jsonrpc': '2.0', 'method': 'event', 'params': {
        'session_id': 'runtime', 'seq': 1, 'type': 'message.complete', 'payload': {'status': status, 'text': 'Actual final reply', 'reasoning': 'private thinking'}}}
    try:
        owner.capture({**frame, 'params': {**frame['params'], 'session_id': 'other'}})
        sender.assert_not_called()
        owner.capture(frame)
        owner.capture(frame)
        owner.notify(expected, 1)
        # Native message.complete is the only completion trigger, even if an
        # adapter also emits a derived turn.complete/attention event.
        owner.capture({'method': 'event', 'params': {'session_id': 'runtime',
            'seq': 2, 'type': expected}})
        sender.assert_called_once_with('alpha', 'stored', expected, '1', message='Actual final reply')
        assert len(owner.offsets) == 2
        # A delivery scheduling failure must still retain/publish the next frame.
        sender.side_effect = RuntimeError('delivery unavailable')
        owner.capture({**frame, 'params': {**frame['params'], 'seq': 3}})
        assert len(owner.offsets) == 3
    finally:
        owner.close()


@run_async
@pytest.mark.parametrize('filename', plugin._INSTRUCTION_NAMES)
async def test_project_instructions_load_and_save_precedence(app, rpc, tmp_path, filename):
    calls, nodes, _ = rpc
    nodes['a']['path'] = str(tmp_path)
    index = plugin._INSTRUCTION_NAMES.index(filename)
    for name in plugin._INSTRUCTION_NAMES[index:]:
        (tmp_path / name).write_text('Original ' + name)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        url = '/api/plugins/chathermes/project-instructions?project_id=a&profile=alpha'
        result = await client.get(url)
        assert result.status_code == 200
        body = result.json()
        assert body['filename'] == filename and body['content'] == 'Original ' + filename
        assert KEY not in result.text and str(tmp_path) not in result.text
        body['content'] = 'Updated instructions\n'
        result = await client.put(url, json=body)
        assert result.status_code == 200
        assert (tmp_path / filename).read_text() == body['content']
        for name in plugin._INSTRUCTION_NAMES[index + 1:]:
            assert (tmp_path / name).read_text() == 'Original ' + name
    assert all(params['profile'] == 'alpha' for _, params in calls)
    if filename != '.hermes.md':
        assert not (tmp_path / '.hermes.md').exists()


@run_async
async def test_project_instructions_create_only_on_save_and_reject_stale_changes(app, rpc, tmp_path):
    _, nodes, _ = rpc
    nodes['a']['path'] = str(tmp_path)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        url = '/api/plugins/chathermes/project-instructions?project_id=a'
        body = (await client.get(url)).json()
        assert body == {'filename': '.hermes.md', 'content': '', 'revision': None}
        assert list(tmp_path.iterdir()) == []
        body['content'] = 'New instructions'
        response = await client.put(url, json=body)
        assert response.status_code == 200
        assert (tmp_path / '.hermes.md').read_text() == body['content']
        assert (await client.put(url, json=body)).status_code == 409
        stale = response.json()
        (tmp_path / '.hermes.md').write_text('External change')
        assert (await client.put(url, json={**stale, 'content': 'Overwrite'})).status_code == 409
        assert (tmp_path / '.hermes.md').read_text() == 'External change'
        # A new higher-priority file also invalidates an open editor.
        (tmp_path / '.hermes.md').unlink()
        (tmp_path / 'AGENTS.md').write_text('Agents')
        stale = (await client.get(url)).json()
        (tmp_path / '.hermes.md').write_text('Higher priority')
        assert (await client.put(url, json={**stale, 'content': 'Overwrite'})).status_code == 409
        assert (tmp_path / 'AGENTS.md').read_text() == 'Agents'


@run_async
async def test_project_instructions_reject_paths_links_oversize_and_bad_scope(app, rpc, tmp_path):
    _, nodes, _ = rpc
    workspace = tmp_path / 'workspace'; workspace.mkdir()
    nodes['a']['path'] = str(workspace)
    secret = tmp_path / 'secret'; secret.write_text(KEY)
    instructions = workspace / '.hermes.md'
    instructions.symlink_to(secret)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        url = '/api/plugins/chathermes/project-instructions?project_id=a'
        response = await client.get(url)
        assert response.status_code == 409 and KEY not in response.text
        assert (await client.put(url, json={'filename': '.hermes.md', 'content': 'bad', 'revision': None})).status_code == 409
        assert secret.read_text() == KEY
        instructions.unlink(); instructions.mkdir()
        assert (await client.get(url)).status_code == 409
        instructions.rmdir(); instructions.write_text('x' * (plugin._INSTRUCTION_LIMIT + 1))
        assert (await client.get(url)).status_code == 413
        instructions.unlink(); instructions.write_bytes(b'\xff')
        assert (await client.get(url)).status_code == 409
        for body in ({'filename': '../secret', 'content': 'bad', 'revision': None},
                     {'filename': '.hermes.md', 'content': None, 'revision': None},
                     {'filename': '.hermes.md', 'content': 'bad', 'revision': None, 'cwd': str(tmp_path)},
                     {'filename': '.hermes.md', 'content': 'bad', 'revision': 'invalid'}):
            assert (await client.put(url, json=body)).status_code == 422
        assert (await client.put(url, json={'filename': '.hermes.md', 'content': 'x' * (plugin._INSTRUCTION_LIMIT + 1), 'revision': None})).status_code == 413
        for project_id, status in [('empty', 409), ('home', 409), ('missing', 404)]:
            assert (await client.get('/api/plugins/chathermes/project-instructions', params={'project_id': project_id})).status_code == status
        assert (await client.get(url + '&profile=../bad')).status_code == 422
        nodes['a']['path'] = str(tmp_path / 'unavailable')
        assert (await client.get(url)).status_code == 409


@run_async
async def test_project_instructions_use_existing_empty_file_and_refuse_hardlinks(app, rpc, tmp_path):
    import os
    _, nodes, _ = rpc
    nodes['a']['path'] = str(tmp_path)
    (tmp_path / 'AGENTS.override.md').write_text('')
    (tmp_path / 'AGENTS.md').write_text('Lower priority')
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        url = '/api/plugins/chathermes/project-instructions?project_id=a'
        body = (await client.get(url)).json()
        assert body['filename'] == 'AGENTS.override.md' and body['content'] == ''
        body['content'] = 'Updated override'
        assert (await client.put(url, json=body)).status_code == 200
        assert (tmp_path / 'AGENTS.md').read_text() == 'Lower priority'
        os.link(tmp_path / 'AGENTS.md', tmp_path / '.hermes.md')
        assert (await client.get(url)).status_code == 409


@run_async
@pytest.mark.parametrize('kind', ['approval', 'clarify'])
async def test_push_owner_request_and_event_triggers(monkeypatch, caplog, kind):
    import sys, types, logging
    from unittest.mock import Mock
    sender = Mock(return_value=True)
    monkeypatch.setattr(plugin._push_sender_module, 'notify', sender)
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server,
        server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None)))
    owner = plugin._native_owners.Owner(plugin, types.SimpleNamespace(close=lambda: None), 'alpha', 'stored')
    owner.runtime = 'runtime'
    frame = {'method': kind, 'id': 'request_1',
        'params': {'session_id': 'runtime', 'seq': 1, 'type': kind, 'payload': {'content': 'private-content'}}}
    try:
        with caplog.at_level(logging.INFO):
            owner.capture({**frame, 'params': {**frame['params'], 'session_id': 'foreign'}})
            sender.assert_not_called()
            owner.capture(frame)
            owner.capture(frame)
        owner.capture({'method': 'event', 'id': 'request_1', 'params': {
            'session_id': 'runtime', 'seq': 1, 'type': kind}})
        sender.assert_called_once_with('alpha', 'stored', kind, 'request_1', message=None)
        assert 'event.detected' in caplog.text and 'owner.notify' in caplog.text
        assert 'private-content' not in caplog.text
        # Scheduling failure cannot stop the native frame reaching viewers.
        queue = asyncio.Queue()
        owner.subscribers.add(queue)
        sender.side_effect = RuntimeError('private-content')
        owner.capture({**frame, 'id': 'request_2', 'params': {**frame['params'], 'seq': 2}})
        assert queue.get_nowait()['params']['session_id'] == 'runtime'
    finally:
        owner.close()


@run_async
async def test_push_test_endpoint_scopes_normal_transport_and_is_content_free(app, monkeypatch):
    from unittest.mock import Mock
    sender = Mock(return_value=True)
    monkeypatch.setattr(plugin._push_sender_module, 'notify', sender)
    monkeypatch.setattr(plugin._push_store_module, 'config', lambda: {'available': True})
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile in ('alpha', 'beta', ''):
            response = await client.post('/api/plugins/chathermes/push/test' + ('?profile=' + profile if profile else ''), json={'content': KEY})
            assert response.json() == {'scheduled': True}
            request = sender.call_args.kwargs['request']
            assert str(request.base_url) == 'http://dashboard.test/'
            args = sender.call_args.args
            assert args[:3] == (profile or 'default', '', 'test')
            assert KEY not in str(args) and KEY not in response.text
        assert (await client.post('/api/plugins/chathermes/push/test?profile=../bad')).status_code == 422
        monkeypatch.setattr(plugin._push_store_module, 'config', lambda: {'available': False})
        assert (await client.post('/api/plugins/chathermes/push/test')).status_code == 503
        monkeypatch.setattr(plugin._push_store_module, 'config', lambda: {'available': True})
        for result in (False, None):
            sender.return_value = result
            assert (await client.post('/api/plugins/chathermes/push/test')).status_code == 503
        sender.side_effect = RuntimeError(KEY)
        response = await client.post('/api/plugins/chathermes/push/test')
        assert response.status_code == 503 and KEY not in response.text
        monkeypatch.setattr(plugin._push_sender_module, 'notify', None)
        response = await client.post('/api/plugins/chathermes/push/test')
        assert response.status_code == 503


@run_async
async def test_push_test_config_failure_is_content_free(app, monkeypatch):
    def fail():
        raise OSError(KEY)
    monkeypatch.setattr(plugin._push_store_module, 'config', fail)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/push/test')
        assert response.status_code == 503 and KEY not in response.text


@run_async
async def test_push_stored_session_survives_native_attach_alias(monkeypatch):
    import sys, types
    from unittest.mock import Mock
    sender = Mock(return_value=True)
    monkeypatch.setattr(plugin._push_sender_module, 'notify', sender)
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server,
        server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None)))
    class Transport:
        def close(self): pass
        async def call(self, method, params):
            if method == 'session.resume':
                assert params['session_id'] == 'stored'
                return {'session_id': 'runtime_alias'}
            assert method == 'session.events.since' and params['session_id'] == 'runtime_alias'
            return {'epoch': 'epoch', 'events': []}
    owner = plugin._native_owners.Owner(plugin, Transport(), 'alpha', 'stored')
    try:
        # Sessionless requests arriving before resume must never trigger push.
        owner.capture({'method': 'approval', 'id': 'unscoped', 'params': {}})
        sender.assert_not_called()
        await owner.attach()
        owner.capture({'method': 'event', 'params': {'session_id': 'runtime_alias',
            'seq': 1, 'type': 'message.complete', 'payload': {'status': 'complete'}}})
        sender.assert_called_once_with('alpha', 'stored', 'turn.complete', '1', message=None)
    finally:
        owner.close()


@run_async
async def test_push_status_matches_device_and_profile_without_exposing_secrets(app, monkeypatch, tmp_path):
    store = plugin._push_store_module
    monkeypatch.setattr(store, '_path', lambda: tmp_path / 'push.json')
    body = {'endpoint': 'https://push.test/private-device', 'keys': {'p256dh': 'private_key', 'auth': 'private_auth'}}
    alpha = store.upsert('alpha', body)
    beta = store.upsert('beta', body)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url='http://dashboard') as client:
        async def status(profile, endpoint=body['endpoint']):
            result = await client.post('/api/plugins/chathermes/push/status', params={'profile': profile}, json={'endpoint': endpoint})
            assert result.status_code == 200
            assert all(value not in result.text for value in ('private-device', 'private_key', 'private_auth'))
            return result.json()
        assert await status('alpha') == {'profile': 'alpha', 'enabled': True, 'id': alpha['id']}
        assert await status('beta') == {'profile': 'beta', 'enabled': True, 'id': beta['id']}
        assert (await status('alpha', 'https://push.test/other'))['enabled'] is False
        assert (await status(''))['profile'] == 'default'
        # An ID from another profile cannot disable its registration.
        assert (await client.delete('/api/plugins/chathermes/push/subscriptions/' + alpha['id'] + '?profile=beta')).json() == {'removed': False}
        assert (await client.delete('/api/plugins/chathermes/push/subscriptions/' + alpha['id'] + '?profile=alpha')).json() == {'removed': True}
        assert (await status('alpha'))['enabled'] is False
        assert (await status('beta'))['enabled'] is True
        for data in ({}, [], {'endpoint': 2}, {'endpoint': 'x' * 2049}, {'endpoint': 'ok', 'extra': True}):
            assert (await client.post('/api/plugins/chathermes/push/status', json=data)).status_code == 422
        assert (await client.post('/api/plugins/chathermes/push/status', content=b' ' * 8193)).status_code == 413
        assert (await client.post('/api/plugins/chathermes/push/status?profile=../x', json={'endpoint': body['endpoint']})).status_code == 422


@run_async
async def test_push_completion_uses_authoritative_redacted_text_without_logging_content(monkeypatch, caplog):
    import sys, types, logging
    from unittest.mock import Mock
    sender = Mock(return_value=True)
    monkeypatch.setattr(plugin._push_sender_module, 'notify', sender)
    server = types.SimpleNamespace(register_live_transport=lambda t: None,
        _start_backend_heartbeat_refresher=lambda: None, _schedule_startup_orphan_sweep=lambda: None)
    monkeypatch.setitem(sys.modules, 'tui_gateway', types.SimpleNamespace(server=server,
        server_requests=types.SimpleNamespace(advertise=lambda *a: None, forget=lambda *a: None)))
    transport = plugin._RpcTransport()
    transport.secret = KEY
    owner = plugin._native_owners.Owner(plugin, transport, 'alpha', 'stored')
    owner.runtime = 'runtime'
    try:
        with caplog.at_level(logging.INFO):
            for seq, kind, payload in [
                (1, 'message.delta', {'text': 'Earlier streamed content'}),
                (2, 'message.complete', {'status': 'complete', 'text': 'Rewritten final reply ' + KEY,
                                         'reasoning': 'Private reasoning', 'warning': 'Private warning'})]:
                transport.write({'method': 'event', 'params': {'session_id': 'runtime',
                    'seq': seq, 'type': kind, 'payload': payload}})
                await asyncio.sleep(0)
        sender.assert_called_once_with('alpha', 'stored', 'turn.complete', '2', message='Rewritten final reply [redacted]')
        for private in ('Rewritten final reply', 'Earlier streamed content', 'Private reasoning', 'Private warning', KEY):
            assert private not in caplog.text
    finally:
        owner.close()


@run_async
async def test_legacy_chat_routes_are_absent_and_capabilities_advertise_only_tui(app, monkeypatch):
    seen = []
    def gateway(request):
        seen.append(request)
        return httpx.Response(200, json={
            'features': {'runs': True, 'run_status': True, 'run_stop': True, 'run_steer': True, 'run_events_sse': True, 'session_chat': True, 'session_chat_streaming': True, 'session_model_lock': True, 'sessions': True, 'scheduled_runs': True},
            'endpoints': {'runs': {'method': 'POST', 'path': '/v1/runs'},
                          'run_status': {'method': 'GET', 'path': '/v1/runs/{id}'},
                          'session_chat_stream': {'path': '/api/sessions/{id}/chat/stream'},
                          'legacy_follow': {'method': 'GET', 'path': '/runs/{id}/events'},
                          'legacy_workspace': {'path': '/workspace/runs/{id}'},
                          'legacy_chat': {'path': '/api/sessions/{id}/chat'},
                          'models': {'method': 'GET', 'path': '/v1/models'},
                          'scheduled_runs': {'method': 'GET', 'path': '/scheduled/runs'}}})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for method, path in [('POST', '/v1/runs'), ('GET', '/v1/runs/r1'),
                             ('GET', '/runs/r1'), ('GET', '/runs/r1/events'),
                             ('GET', '/v1/runs/r1/events'), ('POST', '/runs/r1/stop'),
                             ('POST', '/v1/runs/r1/stop'), ('POST', '/v1/runs/r1/approval'),
                             ('POST', '/v1/runs/r1/steer'), ('GET', '/workspace/runs/s1'),
                             ('GET', '/workspace/runs/s1/events'), ('POST', '/workspace/runs/s1/stop'),
                             ('POST', '/sessions/s1/chat/stream'), ('POST', '/api/sessions/s1/chat/stream'),
                             ('POST', '/workspace/sessions/s1/chat/stream'),
                             ('POST', '/sessions/s1/chat'), ('POST', '/api/sessions/s1/chat'),
                             ('POST', '/workspace/sessions/s1/chat')]:
            assert (await client.request(method, '/api/plugins/chathermes' + path)).status_code == 404
        assert seen == []
        result = (await client.get('/api/plugins/chathermes/v1/capabilities')).json()
        assert result['features'] == {'native_chat': True, 'sessions': True, 'scheduled_runs': True}
        assert result['endpoints'] == {'models': {'method': 'GET', 'path': '/v1/models'},
                                       'scheduled_runs': {'method': 'GET', 'path': '/scheduled/runs'}}


@run_async
async def test_workspace_draft_history_remains_available(app, rpc):
    calls, _, _ = rpc
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/workspace/sessions/stored/messages?profile=alpha')
    assert response.status_code == 200
    assert response.json()['messages'] == [{'role': 'assistant', 'content': 'Native history'}]
    assert calls == [('session.resume', {'profile': 'alpha', 'session_id': 'stored', 'source': 'desktop', 'inline_images': False})]
