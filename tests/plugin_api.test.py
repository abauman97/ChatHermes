"""Gateway proxy contract, exercised without reading any local Hermes configuration."""
import importlib.util
import asyncio
import re
import sys
from functools import wraps
from pathlib import Path

import httpx
import pytest
from fastapi import FastAPI

MODULE = Path(__file__).resolve().parents[1] / "plugin/chathermes/dashboard/plugin_api.py"
spec = importlib.util.spec_from_file_location("chathermes_plugin_api", MODULE)
plugin = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = plugin
spec.loader.exec_module(plugin)
KEY = "test-gateway-key-never-expose"


def run_async(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return asyncio.run(fn(*args, **kwargs))
    return wrapper


@pytest.mark.parametrize('body,key,expected', [
    (b'safe result', '', b'safe result'),
    (b'', '', b''),
    (b'key result key', 'key', b'[redacted] result [redacted]'),
    ('café result'.encode(), '', 'café result'.encode()),
])
def test_safe_body_redacts_only_nonempty_credentials(body, key, expected):
    assert plugin._safe_body(body, key) == expected


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
@pytest.mark.parametrize('selected', ['alpha', 'beta', 'default'])
async def test_real_secondary_host_forwarding_keeps_profile_and_query(app, monkeypatch, tmp_path, selected):
    """Run the real forwarder; only replace its IPC hop with the hosted ASGI app."""
    from types import SimpleNamespace
    from fastapi import Request
    forwarder = pytest.importorskip('hermes_cli.web_server_plugin_profiles')
    from hermes_cli import plugins, web_server_profiles
    from hermes_cli import plugin_host_http_auth as admission

    seen, forwarded = [], []
    profile_key = KEY if selected == 'default' else f'synthetic-{selected}-key'
    monkeypatch.setattr(plugin, '_profile_gateway_key', lambda name: profile_key if name == selected else None)
    monkeypatch.setattr(web_server_profiles, 'serving_profile_name', lambda: selected)
    monkeypatch.setenv('HERMES_PLUGIN_HOST_PROCESS', '1')
    monkeypatch.setattr(forwarder, '_secondary_hosted_plugin', lambda name: {'_dir': 'synthetic', '_api_file': 'plugin_api.py'})
    monkeypatch.setattr(forwarder, 'secondary_profile_home', lambda: tmp_path / 'profiles' / selected)
    monkeypatch.setattr(admission, 'admitted_for_sensitive_route', lambda request: True)

    def gateway(request):
        seen.append(request)
        if request.url.path != f'/p/{selected}/api/sessions' or request.headers['authorization'] != f'Bearer {profile_key}':
            return httpx.Response(401)
        return httpx.Response(200, json={'sessions': [{'id': f'{selected}-only'}]})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    hosted = FastAPI()
    hosted.include_router(plugin.router)

    def asgi_request(name, directory, api_file, method, path, query, headers, body, **options):
        forwarded.append((query, headers))
        async def dispatch():
            transport = httpx.ASGITransport(app=admission.with_hosted_admission(hosted, options['authenticated']))
            async with httpx.AsyncClient(transport=transport, base_url='http://plugin-host') as client:
                response = await client.request(method, path, params=query, headers=headers, content=body)
            return {'status': response.status_code, 'headers': list(response.headers.multi_items()), 'body': response.content}
        return asyncio.run(dispatch())

    monkeypatch.setattr(plugins, 'get_plugin_manager', lambda: SimpleNamespace(
        _plugin_host=lambda: SimpleNamespace(asgi_request=asgi_request)))
    dashboard = FastAPI()
    @dashboard.get('/api/plugins/chathermes/{path:path}')
    async def forward(request: Request):
        return await forwarder.forward_secondary_plugin_request(request, 'chathermes')

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=dashboard), base_url='http://dashboard.test') as client:
        response = await client.get(f'/api/plugins/chathermes/api/sessions?profile={selected}&limit=30&offset=4&tag=a&tag=b&empty=',
                                    headers={'cookie': 'synthetic-dashboard-cookie'})
    assert forwarded[0][0] == 'limit=30&offset=4&tag=a&tag=b&empty='
    assert not {'authorization', 'cookie', 'host'} & {key.lower() for key, _ in forwarded[0][1]}
    assert response.status_code == 200
    assert response.json() == {'sessions': [{'id': f'{selected}-only'}]}
    assert seen[0].url.query.decode() == 'limit=30&offset=4&tag=a&tag=b&empty='
    assert 'cookie' not in seen[0].headers
    assert profile_key not in response.text and KEY not in response.text


@run_async
@pytest.mark.parametrize('profile,scoped_key,default_key,expected_key', [
    ('alpha', 'alpha-key', 'default-key', 'alpha-key'),
    ('alpha', '', 'default-key', 'default-key'),
    ('alpha', '', '', ''),
    ('default', 'ignored-scoped-key', 'default-key', 'default-key'),
])
async def test_profile_gateway_key_falls_back_to_default_only_when_scoped_key_missing(
    monkeypatch, profile, scoped_key, default_key, expected_key
):
    from contextlib import nullcontext
    monkeypatch.setattr(plugin, '_config_profile_scope', nullcontext, raising=False)
    monkeypatch.setitem(__import__('sys').modules, 'agent.secret_scope',
                        __import__('types').SimpleNamespace(get_secret=lambda name, default: scoped_key))
    monkeypatch.setitem(__import__('sys').modules, 'hermes_cli.web_server_profiles',
                        __import__('types').SimpleNamespace(_config_profile_scope=lambda name: nullcontext()))
    monkeypatch.setattr(plugin, '_gateway_settings', lambda: ('http://gateway.test', default_key))
    assert plugin._profile_gateway_key(profile) == expected_key


@pytest.mark.parametrize('hosted,query,expected,status', [
    ('alpha', '', 'alpha', None),
    ('beta', '', 'beta', None),
    ('default', '', 'default', None),
    ('alpha', 'profile=alpha', 'alpha', None),
    ('alpha', 'profile=beta', None, 422),
    ('alpha', 'profile=default', None, 422),
    ('alpha', 'profile=../bad', None, 422),
    ('', '', None, 503),
    ('../bad', '', None, 503),
])
def test_hosted_profile_is_pinned_and_fails_closed(monkeypatch, hosted, query, expected, status):
    import sys
    from types import SimpleNamespace
    from starlette.datastructures import QueryParams
    monkeypatch.setenv('HERMES_PLUGIN_HOST_PROCESS', '1')
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_profiles', SimpleNamespace(serving_profile_name=lambda: hosted))
    request = SimpleNamespace(query_params=QueryParams(query))
    if status:
        with pytest.raises(plugin.HTTPException) as failure:
            plugin._request_profile(request)
        assert failure.value.status_code == status
    else:
        assert plugin._request_profile(request) == expected
        assert plugin._rpc_profile(request) == expected


def test_in_process_profile_selection_does_not_use_client_host_hints(monkeypatch):
    from starlette.requests import Request
    monkeypatch.delenv('HERMES_PLUGIN_HOST_PROCESS', raising=False)
    for query, expected in [(b'', ''), (b'profile=alpha', 'alpha'), (b'profile=default', 'default')]:
        request = Request({'type': 'http', 'query_string': query,
                           'headers': [(b'x-hermes-plugin-host-process', b'1'), (b'x-profile', b'beta')]})
        assert plugin._request_profile(request) == expected


@pytest.mark.parametrize('selected', ['alpha', 'beta', 'default'])
def test_host_identity_is_resolved_from_process_home(monkeypatch, tmp_path, selected):
    from types import SimpleNamespace
    from starlette.datastructures import QueryParams
    profiles = pytest.importorskip('hermes_cli.profiles')
    from hermes_cli import web_server_profiles
    from hermes_constants import reset_hermes_home_override, set_hermes_home_override

    home = tmp_path if selected == 'default' else tmp_path / 'profiles' / selected
    home.mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr(profiles, '_get_default_hermes_home', lambda: tmp_path)
    monkeypatch.setattr(web_server_profiles, 'get_process_hermes_home', lambda: home)
    monkeypatch.setenv('HERMES_PLUGIN_HOST_PROCESS', '1')
    token = set_hermes_home_override(home)
    try:
        assert plugin._request_profile(SimpleNamespace(query_params=QueryParams('limit=30'))) == selected
    finally:
        reset_hermes_home_override(token)


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
                 'base_url': 'https://private.test', 'key_env': 'LOCAL_KEY',
                 'capabilities': {'model-a': {'reasoning': True, 'api_key': 'secret'},
                                  'model-b': {'reasoning': False},
                                  'malformed': {'reasoning': 'yes'},
                                  'not-an-object': True}},
                {'slug': 'missing', 'authenticated': False, 'models': ['unavailable']},
                {'slug': 'other', 'name': 'Other', 'models': ['model-c']}
            ]})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/api/model/options?profile=beta')
        assert response.json() == {'provider': 'custom:local', 'model': 'model-a', 'providers': [
            {'slug': 'custom:local', 'name': 'Local', 'is_current': True, 'models': ['model-a', 'model-b'],
             'capabilities': {'model-a': {'reasoning': True}, 'model-b': {'reasoning': False}}},
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
        {'input': 'hello', 'require_model_lock': True},
    ]
    for body in bodies:
        with pytest.raises(plugin.HTTPException) as failure:
            plugin._validated_workspace_turn(body)
        assert failure.value.status_code in (422, 413)
    assert calls == []


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


@pytest.mark.parametrize('status', [404, 410])
def test_push_sender_expiry_serializes_with_api_registration(monkeypatch, tmp_path, status):
    import concurrent.futures, threading, types, pywebpush
    from unittest.mock import Mock
    api_store = plugin._push_store_module
    sender = plugin._push_sender_module
    sender_store = sender.push_store
    # Patch both pre-fix instances to the same disposable backing file, as in
    # production. The fix makes these the same instance and lock.
    for store in (api_store, sender_store):
        monkeypatch.setattr(store, '_path', lambda: tmp_path / 'push.json')
    monkeypatch.setenv('HERMES_DASHBOARD_PUBLIC_URL', 'https://dashboard.example.test')
    assert api_store.config()['available']
    expired = api_store.upsert('alpha', {'endpoint': 'https://push.test/expired',
        'keys': {'p256dh': 'synthetic_key', 'auth': 'synthetic_auth'}})
    error = pywebpush.WebPushException('synthetic expiry',
        response=types.SimpleNamespace(status_code=status))
    sending = threading.Event()
    expire_delivery = threading.Event()

    def expired_transport(*args, **kwargs):
        sending.set()
        assert expire_delivery.wait(5)
        raise error

    webpush = Mock(side_effect=expired_transport)
    monkeypatch.setattr(pywebpush, 'webpush', webpush)
    deleting = threading.Event()
    deleted = threading.Event()
    registration_read = threading.Event()
    resume_registration = threading.Event()
    read = api_store._read
    remove = sender_store.remove_endpoint

    def paused_read():
        data = read()
        if threading.current_thread().name.startswith('registration'):
            registration_read.set()
            assert resume_registration.wait(5)
        return data

    def observed_remove(identity):
        deleting.set()
        remove(identity)
        deleted.set()

    monkeypatch.setattr(api_store, '_read', paused_read)
    monkeypatch.setattr(sender_store, 'remove_endpoint', observed_remove)
    with concurrent.futures.ThreadPoolExecutor(max_workers=1, thread_name_prefix='registration') as registrations, concurrent.futures.ThreadPoolExecutor(max_workers=1) as deliveries:
        delivery = deliveries.submit(sender._deliver, 'alpha', 'stored', 'turn.complete', '1')
        assert sending.wait(5)
        registration = registrations.submit(api_store.upsert, 'beta', {
            'endpoint': 'https://push.test/new',
            'keys': {'p256dh': 'synthetic_key', 'auth': 'synthetic_auth'}})
        try:
            assert registration_read.wait(5)
            expire_delivery.set()
            assert deleting.wait(5)
            # Cleanup must wait for the registration's read-modify-write lock.
            # Before the fix it completes here, then upsert resurrects alpha.
            cleanup_waited = not deleted.wait(0.2)
        finally:
            expire_delivery.set()
            resume_registration.set()
        saved = registration.result(timeout=5)
        delivery.result(timeout=5)
    webpush.assert_called_once()
    assert api_store.subscriptions('alpha') == []
    assert api_store.status('alpha', 'https://push.test/expired')['enabled'] is False
    assert api_store.status('beta', 'https://push.test/new') == {
        'profile': 'beta', 'enabled': True, 'id': saved['id']}
    assert expired['id'] not in [row['id'] for row in api_store._read()['subscriptions']]
    assert cleanup_waited


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


@run_async
async def test_native_artifact_file_routes(app, monkeypatch):
    import sys
    from types import ModuleType
    from fastapi import HTTPException
    from fastapi.responses import Response
    files = ModuleType('hermes_cli.web_routers.files')
    seen = []
    async def preview(path, request, profile=None, session_id=None):
        seen.append(('preview', path, profile, session_id))
        if path == '/secret':
            raise HTTPException(403, KEY)
        return {'dataUrl': 'data:text/plain;base64,aGk='}
    async def download(path, request, profile=None, session_id=None):
        seen.append(('download', path, profile, session_id))
        return Response(b'hi', media_type='text/plain')
    files.fs_read_data_url = preview
    files.fs_download = download
    package = ModuleType('hermes_cli.web_routers')
    package.files = files
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_routers', package)
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_routers.files', files)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        query = {'path': '/tmp/report.txt', 'profile': 'work', 'session_id': 'stored-1'}
        response = await client.get('/api/plugins/chathermes/files/preview', params=query)
        assert response.status_code == 200
        assert response.json() == {'dataUrl': 'data:text/plain;base64,aGk='}
        assert response.headers['cache-control'] == 'private, no-store'
        response = await client.get('/api/plugins/chathermes/files/download', params={**query, 'name': 'report.txt\r\nInjected: bad'})
        assert response.content == b'hi'
        assert '\r' not in response.headers['content-disposition']
        assert '\n' not in response.headers['content-disposition']
        assert response.headers['x-content-type-options'] == 'nosniff'
        response = await client.get('/api/plugins/chathermes/files/preview', params={**query, 'path': '/secret'})
        assert response.status_code == 403 and KEY not in response.text
        for changed in ({'profile': '../x'}, {'path': '\x00'}, {'session_id': '../s'}):
            response = await client.get('/api/plugins/chathermes/files/preview', params={**query, **changed})
            assert response.status_code == 422
    assert seen[:2] == [('preview', '/tmp/report.txt', 'work', 'stored-1'), ('download', '/tmp/report.txt', 'work', 'stored-1')]


@run_async
async def test_artifact_deletion_uses_native_policy_and_refuses_remote_files(app, monkeypatch, tmp_path):
    monkeypatch.setattr(plugin._push_store_module, '_path', lambda: tmp_path / 'push.json')
    import sys
    from types import ModuleType, SimpleNamespace
    from fastapi import HTTPException
    from fastapi.responses import Response
    files = ModuleType('hermes_cli.web_routers.files')
    deleted = []
    async def download(path, request, profile=None, session_id=None):
        if path == '/sensitive':
            raise HTTPException(403, KEY)
        return Response(b'')
    async def remove(payload, request):
        assert payload.recursive is False
        deleted.append((payload.path, request.query_params['profile']))
    files.fs_download = download
    files.delete_managed_file = remove
    files._fs_backend = lambda profile: None
    package = ModuleType('hermes_cli.web_routers')
    package.files = files
    models = ModuleType('hermes_cli.web_models')
    models.ManagedFileDelete = SimpleNamespace
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_routers', package)
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_routers.files', files)
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_models', models)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        query = {'path': '/opt/data/report.txt', 'profile': 'work', 'session_id': 'stored-1'}
        response = await client.delete('/api/plugins/chathermes/files', params=query)
        assert response.status_code == 200 and response.json() == {'ok': True}
        assert deleted == [('/opt/data/report.txt', 'work')]
        response = await client.delete('/api/plugins/chathermes/files', params={**query, 'path': '/sensitive'})
        assert response.status_code == 403 and KEY not in response.text
        files._fs_backend = lambda profile: object()
        response = await client.delete('/api/plugins/chathermes/files', params=query)
        assert response.status_code == 501
        assert len(deleted) == 1


def test_native_general_file_refs_are_profile_bound_and_refuse_symlinks(monkeypatch, tmp_path):
    import sys, types
    from contextlib import nullcontext
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_profiles', types.SimpleNamespace(_config_profile_scope=lambda profile: nullcontext()))
    monkeypatch.setitem(sys.modules, 'hermes_constants', types.SimpleNamespace(get_hermes_home=lambda: tmp_path))
    root = tmp_path / 'uploads' / 'chathermes'
    root.mkdir(parents=True)
    original = root / ('a' * 32 + '.txt')
    original.write_text('synthetic file')
    plugin._native_validation.verify_file_refs('work', [str(original)])
    foreign = tmp_path / 'another-profile' / ('b' * 32 + '.txt')
    foreign.parent.mkdir()
    foreign.write_text('foreign')
    link = root / ('c' * 32 + '.txt')
    link.symlink_to(foreign)
    for path in (foreign, link, root / 'supplied-name.txt'):
        with pytest.raises(plugin.HTTPException) as rejected:
            plugin._native_validation.verify_file_refs('work', [str(path)])
        assert rejected.value.status_code == 422
        assert str(path) not in rejected.value.detail

@run_async
async def test_session_project_move_resolves_profile_workspace_and_rejects_browser_paths(app, monkeypatch):
    calls = []

    async def rpc(request, method, params=None):
        calls.append((plugin._rpc_profile(request), method, params))
        if method == 'projects.project_sessions':
            return {'project': {'id': 'notes', 'label': 'Notes', 'path': '/workspace/notes', 'repos': []}}
        if method == 'projects.list':
            return {'projects': [{'id': 'notes', 'name': 'Notes', 'primary_path': '/workspace/notes', 'folders': []}]}
        return {'cwd': params['cwd']}

    monkeypatch.setattr(plugin, '_rpc', rpc)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        route = '/api/plugins/chathermes/api/sessions/stored-one/project?profile=alpha'
        response = await client.post(route, json={'project_id': 'notes'})
        assert response.status_code == 200
        assert calls[-1] == ('alpha', 'session.workspace.move', {'session_key': 'stored-one', 'cwd': '/workspace/notes'})
        calls.clear()
        for body in ({'project_id': 'notes', 'cwd': '/other'}, {'project_id': 2}, {}, {'method': 'session.delete'}):
            assert (await client.post(route, json=body)).status_code == 422
        assert calls == []
        assert (await client.post(route.replace('alpha', '../other'), json={'project_id': 'notes'})).status_code == 422
        assert calls == []

@pytest.mark.parametrize('kind', ['hidden', 'auto_continue', 'process_complete', 'async_delegation_complete', 'model_switch', 'failed_turn'])
def test_workspace_message_preserves_display_contract(kind):
    metadata = {'display_text': 'Synthetic timeline label'}
    projected = plugin._workspace_message({'row_id': 17, 'role': 'user', 'text': 'Internal context', 'display_kind': kind, 'display_metadata': metadata})
    assert projected == {'id': '17', 'role': 'user', 'content': 'Internal context', 'display_kind': kind, 'display_metadata': metadata}


@run_async
async def test_native_creation_uses_profile_gateway_not_host_runtime(app, monkeypatch):
    seen = []
    def gateway(request):
        seen.append(request)
        return httpx.Response(201, json={'session': {'id': 'persisted'}})
    monkeypatch.setattr(plugin, '_client', lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway)))
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda *args: pytest.fail('must not create a host runtime'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile in ('default', 'alpha', 'beta'):
            response = await client.post('/api/plugins/chathermes/chat/sessions', params={'profile': profile}, json={})
            assert response.status_code == 201
            assert response.json()['session']['id'] == 'persisted'
    assert [request.url.path for request in seen] == ['/p/default/api/sessions', '/p/alpha/api/sessions', '/p/beta/api/sessions']


@run_async
async def test_native_preparation_is_profile_local_and_never_admits(app, monkeypatch):
    seen = []
    monkeypatch.setattr(plugin._native_validation, 'verify_file_refs', lambda profile, refs: seen.append((profile, refs)))
    monkeypatch.setattr(plugin._native_validation, 'model_selection', lambda profile, model, provider, collector: ('runtime-model', 'runtime-provider'))
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda *args: pytest.fail('preparation must not dispatch'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile in ('default', 'alpha', 'beta'):
            response = await client.post('/api/plugins/chathermes/chat/prepare', params={'profile': profile}, json={
                'input': 'Hello\nAttached file note.txt: /synthetic/upload', 'model': 'Alias'})
            assert response.status_code == 200
            assert response.headers['cache-control'] == 'no-store'
            assert response.json() == {'input': 'Hello\nAttached file note.txt: /synthetic/upload',
                'files': [{'name': 'note.txt', 'path': '/synthetic/upload'}], 'model': 'runtime-model', 'provider': 'runtime-provider'}
        for body in ({'input': 'Hello', 'profile': 'foreign'}, {'input': 'Hello', 'provider': 'orphan'}, {'input': []}):
            response = await client.post('/api/plugins/chathermes/chat/prepare', json=body)
            assert response.status_code == 422
    assert seen == [(profile, ['/synthetic/upload']) for profile in ('default', 'alpha', 'beta')]


@run_async
async def test_native_membership_accepts_only_the_selected_profile_owner(app, monkeypatch):
    calls = []
    def check(profile, stored):
        calls.append((profile, stored))
        if stored != 'owned':
            raise plugin.HTTPException(404, 'Session unavailable in this profile')
    monkeypatch.setattr(plugin._native_validation, 'check_profile_session', check)
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda *args: pytest.fail('membership cannot create a runtime'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile in ('default', 'alpha', 'beta'):
            response = await client.get('/api/plugins/chathermes/chat/sessions/owned/membership', params={'profile': profile})
            assert response.status_code == 200 and response.json() == {'member': True}
            response = await client.get('/api/plugins/chathermes/chat/sessions/foreign/membership', params={'profile': profile})
            assert response.status_code == 404
    assert calls == [(profile, stored) for profile in ('default', 'alpha', 'beta') for stored in ('owned', 'foreign')]


@run_async
async def test_native_chat_and_project_creation_preparation_never_builds_an_agent(app, rpc, monkeypatch):
    calls, nodes, transport = rpc
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile in ('default', 'alpha', 'beta'):
            response = await client.post('/api/plugins/chathermes/chat/sessions', params={'profile': profile, 'prepare': '1'}, json={})
            assert response.status_code == 200
            assert response.json() == {'native_create': {'source': 'desktop'}}
            assert response.headers['cache-control'] == 'no-store'
        response = await client.post('/api/plugins/chathermes/projects/session', params={'profile': 'alpha', 'project_id': 'a', 'prepare': '1'}, json={})
        assert response.status_code == 200
        assert response.json()['native_create']['source'] == 'desktop'
        assert 'profile' not in response.json()['native_create']
    assert all(method != 'session.create' for method, _ in calls)


@run_async
async def test_native_preparation_flattens_text_only_parts_for_native_file_expansion(app):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/chat/prepare', json={'input': [
            {'type': 'text', 'text': 'Question'}, {'type': 'text', 'text': 'Context'}]})
    assert response.status_code == 200
    assert response.json() == {'input': 'Question\nContext', 'files': []}


@run_async
async def test_native_contract_is_pinned_read_only_and_has_no_plugin_websocket(app, monkeypatch):
    from fastapi.routing import APIWebSocketRoute
    assert not any(isinstance(route, APIWebSocketRoute) for route in plugin.router.routes)
    monkeypatch.setattr(plugin._RpcTransport, 'call', lambda *args: pytest.fail('capabilities cannot dispatch'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/chat/capabilities')
    assert response.status_code == 200
    body = response.json()
    assert body['protocol'] == 'hermes.native.bf0203a7'
    assert body['reviewed_source'] == plugin._execution_viewer.PIN
    assert body['mode'] == 'native-gateway'
    assert body['guarantees'] == {'offline_turn_lease': True, 'crash_safe_idempotency': False, 'lossless_snapshot_replay': False}
    assert all(not method.startswith('chat.') for method in body['operations'])


@run_async
async def test_native_retention_delegates_only_after_profile_membership(app, monkeypatch):
    seen = []
    def check(profile, session):
        seen.append(('member', profile, session))
        if profile == 'beta':
            raise plugin.HTTPException(404, 'Session unavailable in this profile')
    class Service:
        async def retain(self, profile, session, ticket):
            seen.append(('retain', profile, session))
            assert ticket == 'single-use-grant'
            return 'runtime'
    monkeypatch.setattr(plugin._native_validation, 'check_profile_session', check)
    monkeypatch.setattr(plugin, '_executions', lambda: Service())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile, status in [('alpha', 200), ('beta', 404)]:
            response = await client.post('/api/plugins/chathermes/chat/retain?profile=' + profile,
                                         json={'session_id': 'stored', 'ticket': 'single-use-grant'})
            assert response.status_code == status
            assert 'single-use-grant' not in response.text
        for body in ({}, {'session_id': '../foreign', 'ticket': 'grant'},
                     {'session_id': 'stored', 'ticket': 'grant', 'profile': 'beta'},
                     {'session_id': 'stored', 'ticket': KEY + '\n'}):
            assert (await client.post('/api/plugins/chathermes/chat/retain', json=body)).status_code == 422
    assert seen == [('member', 'alpha', 'stored'), ('retain', 'alpha', 'stored'), ('member', 'beta', 'stored')]


@run_async
async def test_native_retention_failure_is_safe_and_cannot_dispatch(app, monkeypatch):
    monkeypatch.setattr(plugin._native_validation, 'check_profile_session', lambda *args: None)
    class Service:
        async def retain(self, *args):
            raise ValueError(KEY)
    monkeypatch.setattr(plugin, '_executions', lambda: Service())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        result = await client.post('/api/plugins/chathermes/chat/retain', json={'session_id': 'stored', 'ticket': 'grant'})
    assert result.status_code == 503 and KEY not in result.text


@run_async
async def test_native_schema_rejection_does_not_retry_an_alternate_shape(monkeypatch):
    import sys
    from types import SimpleNamespace
    calls = []
    def dispatch(request, transport):
        calls.append(request)
        return {'id': request['id'], 'error': {'code': 4000, 'message': 'inline_images: Extra inputs are not permitted ' + KEY}}
    monkeypatch.setitem(sys.modules, 'tui_gateway', SimpleNamespace(server=SimpleNamespace(dispatch=dispatch)))
    transport = plugin._RpcTransport()
    try:
        with pytest.raises(plugin.HTTPException) as error:
            await plugin._workspace_resume(transport, 'alpha', 'stored')
        assert error.value.status_code == 409 and KEY not in error.value.detail
        assert len(calls) == 1 and calls[0]['params']['inline_images'] is False
    finally:
        transport.close()


@run_async
async def test_media_upload_preparation_keeps_profile_validation_and_native_staging(app, monkeypatch):
    checked = []
    monkeypatch.setattr(plugin._native_validation, 'verify_file_refs', lambda profile, refs: checked.append((profile, refs)))
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda *args: pytest.fail('must not admit a turn'))
    path = '/profile/uploads/chathermes/' + 'a' * 32 + '.txt'
    text = f'Review\nAttached file original name.txt: {path}\nMEDIA:"{path}"'
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.post('/api/plugins/chathermes/chat/prepare?profile=alpha', json={
            'input': [{'type': 'text', 'text': text}]})
        assert response.status_code == 200
        assert response.json() == {'input': text, 'files': [{'name': 'original name.txt', 'path': path}]}
        assert checked == [('alpha', [path])]
        # A MEDIA line never becomes permission to stage arbitrary host paths.
        response = await client.post('/api/plugins/chathermes/chat/prepare?profile=alpha', json={
            'input': 'Review\nMEDIA:/private/secret.txt'})
        assert response.status_code == 200 and response.json()['files'] == []
        assert checked == [('alpha', [path])]


@run_async
async def test_response_branch_checks_membership_and_uses_native_history(app, monkeypatch):
    seen = []
    def check(profile, stored):
        seen.append(('member', profile, stored))
        if profile == 'beta':
            raise plugin.HTTPException(404, 'Session unavailable in this profile')
    class Transport:
        async def call(self, method, params):
            seen.append((method, params))
            if method == 'session.resume':
                return {'session_id': 'runtime', 'running': False, 'queued': False}
            return {'stored_session_id': 'child'}
        def close(self):
            seen.append('closed')
    monkeypatch.setattr(plugin._native_validation, 'check_profile_session', check)
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda request: Transport())
    monkeypatch.setattr(plugin, '_branch_response_count', lambda p, s, r: 4 if (p, s, r) == ('alpha', 'stored', '42') else pytest.fail('wrong scope'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        result = await client.post('/api/plugins/chathermes/api/sessions/stored/branch?profile=alpha', json={'response_id': '42'})
        assert result.status_code == 201 and result.json() == {'id': 'child'}
        denied = await client.post('/api/plugins/chathermes/api/sessions/stored/branch?profile=beta', json={'response_id': '42'})
        assert denied.status_code == 404
        for body in ({'count': 4}, {'response_id': '42', 'cwd': '/other'}, {'response_id': 'native-user-1'}):
            invalid = await client.post('/api/plugins/chathermes/api/sessions/stored/branch?profile=alpha', json=body)
            assert invalid.status_code == 422
    assert seen == [('member', 'alpha', 'stored'),
                    ('session.resume', {'profile': 'alpha', 'session_id': 'stored', 'source': 'desktop', 'inline_images': False}),
                    ('session.branch', {'profile': 'alpha', 'session_id': 'runtime', 'count': 4}),
                    'closed', ('member', 'beta', 'stored')]


def test_response_branch_ordinal_includes_hidden_prose_but_not_tools(monkeypatch):
    import sys
    from types import SimpleNamespace
    closed = []
    rows = [
        {'role': 'user', 'content': 'hidden context', 'display_kind': 'hidden', '_row_id': 1},
        {'role': 'user', 'content': 'question', '_row_id': 2},
        {'role': 'assistant', 'content': '', 'tool_calls': [{}], '_row_id': 3},
        {'role': 'tool', 'content': 'result', '_row_id': 4},
        {'role': 'assistant', 'content': [{'type': 'text', 'text': 'answer'}], '_row_id': 5},
        {'role': 'user', 'content': 'later question', '_row_id': 6},
    ]
    class DB:
        def get_resume_conversations(self, stored):
            assert stored == 'stored'
            return [], rows
        def close(self):
            closed.append(True)
    def db(profile, read_only):
        assert profile == 'alpha' and read_only
        return DB()
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_sessions', SimpleNamespace(_open_session_db_for_profile=db))
    monkeypatch.setitem(sys.modules, 'tui_gateway.session_history', SimpleNamespace(_coerce_message_text=lambda content: content if isinstance(content, str) else ''.join(part['text'] for part in content)))
    assert plugin._branch_response_count('alpha', 'stored', '5') == 3
    for row_id in ('4', '6', '999'):
        with pytest.raises(plugin.HTTPException) as error:
            plugin._branch_response_count('alpha', 'stored', row_id)
        assert error.value.status_code == 409
    assert len(closed) == 4


@run_async
@pytest.mark.parametrize('running,break_branch,status', [(True, False, 409), (False, True, 503)])
async def test_response_branch_busy_and_failure_do_not_leak(app, monkeypatch, running, break_branch, status):
    called = []
    monkeypatch.setattr(plugin._native_validation, 'check_profile_session', lambda *args: None)
    monkeypatch.setattr(plugin, '_branch_response_count', lambda *args: 2)
    class Transport:
        async def call(self, method, params):
            called.append(method)
            if method == 'session.resume':
                return {'session_id': 'runtime', 'running': running}
            if break_branch:
                raise ValueError(KEY)
        def close(self):
            called.append('closed')
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda request: Transport())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        result = await client.post('/api/plugins/chathermes/api/sessions/stored/branch', json={'response_id': '42'})
    assert result.status_code == status and KEY not in result.text
    assert called == (['session.resume', 'closed'] if running else ['session.resume', 'session.branch', 'closed'])


@run_async
async def test_native_reasoning_preparation_validates_effort_without_dispatch(app, monkeypatch):
    monkeypatch.setattr(plugin, '_new_rpc_transport', lambda *args: pytest.fail('preparation must not dispatch'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for profile in ('default', 'alpha', 'beta'):
            for effort in ('none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'):
                response = await client.post('/api/plugins/chathermes/chat/prepare', params={'profile': profile},
                    json={'input': 'Hello', 'reasoning_effort': effort})
                assert response.status_code == 200
                assert response.json() == {'input': 'Hello', 'files': [], 'reasoning_effort': effort}
        for effort in (None, False, 0, [], {}, '', 'show', 'hide', 'HIGH', 'high --global', 'bogus'):
            response = await client.post('/api/plugins/chathermes/chat/prepare', json={'input': 'Hello', 'reasoning_effort': effort})
            assert response.status_code == 422


@run_async
async def test_artifact_api_pages_index_without_gateway_and_validates_scope(app, monkeypatch, tmp_path):
    monkeypatch.setattr(plugin._push_store_module, '_path', lambda: tmp_path / 'push.json')
    session = {'id': 's', 'title': 'Files', 'projectId': 'project/path'}
    files = [{'path': f'/tmp/{i}.txt', 'name': f'{i}.txt', 'type': 'text/plain', 'direction': 'generated', 'createdAt': '2026-10-26T00:00:00+00:00'} for i in range(4)]
    plugin._artifact_store.replace_session(plugin._push_store_module, 'alpha', session, 'revision', files)
    monkeypatch.setattr(plugin, '_client', lambda: pytest.fail('Artifact pages cannot fetch histories'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        root = '/api/plugins/chathermes/artifacts'
        first = await client.get(root, params={'profile': 'alpha', 'project_id': 'project/path', 'limit': 2})
        assert first.status_code == 200
        assert first.headers['cache-control'] == 'private, no-store'
        assert len(first.json()['files']) == 2
        cursor = first.json()['nextCursor']
        second = await client.get(root, params={'profile': 'alpha', 'project_id': 'project/path', 'limit': 2, 'cursor': cursor})
        assert second.json()['nextCursor'] is None
        assert len({row['path'] for page in (first, second) for row in page.json()['files']}) == 4
        empty = await client.get(root, params={'profile': 'beta'})
        assert empty.json() == {'files': [], 'nextCursor': None}
        for query in ({'limit': 0}, {'limit': 101}, {'cursor': 'invalid'}, {'profile': 'beta', 'cursor': cursor}, {'profile': '../alpha'}):
            assert (await client.get(root, params={'profile': 'alpha', **query})).status_code == 422


@run_async
async def test_artifact_index_profile_host_boundary(app, monkeypatch, tmp_path):
    import sys
    from types import SimpleNamespace
    monkeypatch.setattr(plugin._push_store_module, '_path', lambda: tmp_path / 'push.json')
    monkeypatch.setenv('HERMES_PLUGIN_HOST_PROCESS', '1')
    monkeypatch.setitem(sys.modules, 'hermes_cli.web_server_profiles', SimpleNamespace(serving_profile_name=lambda: 'alpha'))
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        assert (await client.get('/api/plugins/chathermes/artifacts?profile=beta')).status_code == 422
        assert (await client.get('/api/plugins/chathermes/artifacts')).json() == {'files': [], 'nextCursor': None}


@run_async
async def test_indexed_inline_images_are_authenticated_profile_history_addresses(app, monkeypatch):
    seen = []
    async def messages(source, profile, session, inline=False):
        seen.append((profile, session, inline))
        return [{'id': 12, 'role': 'user', 'content': [{'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,aGVsbG8='}}]}]
    monkeypatch.setattr(plugin._artifact_indexer.Source, 'messages', messages)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        root = '/api/plugins/chathermes/artifact-images/s/12/0?profile=alpha'
        response = await client.get(root)
        assert response.status_code == 200 and response.content == b'hello'
        assert response.headers['content-type'] == 'image/png'
        assert response.headers['cache-control'] == 'private, no-store'
        assert 'attachment' in (await client.get(root + '&download=true')).headers['content-disposition']
        assert (await client.get(root.replace('/12/', '/13/'))).status_code == 404
        assert (await client.get(root.replace('/0?', '/1?'))).status_code == 404
        assert (await client.get(root.replace('/0?', '/-1?'))).status_code == 422
    assert all(profile == 'alpha' and session == 's' and inline for profile, session, inline in seen)


@run_async
async def test_start_and_stop_artifact_service_are_nonblocking_and_join_workers(monkeypatch, tmp_path):
    monkeypatch.setattr(plugin._push_store_module, '_path', lambda: tmp_path / 'push.json')
    waiting = asyncio.Event()
    async def profiles(source):
        await waiting.wait()
        return []
    monkeypatch.setattr(plugin._artifact_indexer.Source, 'profiles', profiles)
    await asyncio.wait_for(plugin._start_artifact_indexing(), timeout=1)
    service = plugin._artifact_service
    assert len(service.tasks) == 4
    await asyncio.wait_for(plugin._stop_artifact_indexing(), timeout=1)
    assert service.tasks == [] and plugin._artifact_service is None
