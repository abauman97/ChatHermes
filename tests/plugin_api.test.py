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
                assert response.status_code == 501
                assert 'explicit Project membership' in response.text
    assert not seen  # Independent tabs cannot mutate global state or create fallback rows.


@run_async
async def test_native_projects_store_and_profile_isolation(app, monkeypatch, tmp_path):
    import os
    monkeypatch.syspath_prepend(os.environ.get('HERMES_SOURCE', '/opt/hermes'))
    projects_db = pytest.importorskip('hermes_cli.projects_db', reason='Native store integration requires installed Hermes source or HERMES_SOURCE')
    homes = {name: tmp_path / name for name in ('alpha', 'beta')}
    ids = {}
    for name, home in homes.items():
        home.mkdir()
        workspace = home / 'workspace'
        workspace.mkdir()
        with projects_db.connect_closing(db_path=home / 'projects.db') as conn:
            ids[name] = projects_db.create_project(conn, name=name, folders=[str(workspace)], primary_path=str(workspace))
    monkeypatch.setattr(plugin, '_upload_home', lambda request: homes[request.query_params['profile']])
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        for name in homes:
            response = await client.get('/api/plugins/chathermes/projects', params={'profile': name})
            assert response.status_code == 200
            assert [p['id'] for p in response.json()['projects']] == [ids[name]]
            detail = await client.get('/api/plugins/chathermes/projects/' + ids[name], params={'profile': name})
            assert detail.json()['project']['primary_path'] == str(homes[name] / 'workspace')
            assert detail.json()['project']['workspace_available'] is True
        wrong = await client.get('/api/plugins/chathermes/projects/' + ids['alpha'], params={'profile': 'beta'})
        assert wrong.status_code == 404
        (homes['alpha'] / 'workspace').rmdir()
        missing = await client.get('/api/plugins/chathermes/projects/' + ids['alpha'], params={'profile': 'alpha'})
        assert missing.json()['project']['workspace_available'] is False
    for home in homes.values():
        with projects_db.connect_closing(db_path=home / 'projects.db') as conn:
            assert projects_db.get_active_id(conn) is None


@run_async
async def test_projects_failures_do_not_expose_secrets(app, monkeypatch):
    def broken(*args):
        raise RuntimeError(KEY)
    monkeypatch.setattr(plugin, '_read_projects', broken)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://dashboard.test') as client:
        response = await client.get('/api/plugins/chathermes/projects')
        assert response.status_code == 503
        assert KEY not in response.text
