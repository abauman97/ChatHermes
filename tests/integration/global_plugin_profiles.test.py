"""Run in an isolated Hermes runtime, with /opt/plugins-src/chathermes copied in.

Uses Hermes's real plugin dependency and profile scopes; no personal state or LLM.
Reviewed contract: bf0203a794a07aac3ff764972ab9087baa4e4f4e.
"""
import importlib.util
import json
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient
from starlette.datastructures import QueryParams


@pytest.fixture(params=['root', 'named-launch'])
def scoped_plugin(tmp_path, monkeypatch, request):
    root = tmp_path / 'custom-hermes-root'
    developer = root / 'profiles' / 'developer'
    launch = root if request.param == 'root' else root / 'profiles' / 'dashboard'
    for home in {root, developer, launch}:
        home.mkdir(parents=True, exist_ok=True)
        config = {
            'plugins': {'enabled': ['chathermes'] if home == launch else []},
            'platforms': {'api_server': {
                'host': '127.0.0.1' if home == launch else 'wrong-profile.invalid',
                'port': 8642 if home == launch else 9999,
                'key': 'synthetic-launch-key' if home == launch else 'synthetic-developer-key',
            }},
        }
        (home / 'config.yaml').write_text(json.dumps(config))
        (home / '.env').write_text('API_SERVER_KEY=synthetic-developer-key\n')
    monkeypatch.setenv('HERMES_HOME', str(launch))

    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_cli.web_server_dashboard import _plugin_route_secret_scope
    from hermes_constants import get_hermes_home

    source = Path('/opt/plugins-src/chathermes/dashboard/plugin_api.py')
    spec = importlib.util.spec_from_file_location('global_profile_plugin', source)
    api = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, spec.name, api)
    spec.loader.exec_module(api)
    app = FastAPI()
    # The production mount's async yield dependency also wraps WebSockets.
    app.include_router(api.router, prefix='/api/plugins/chathermes',
                       dependencies=[Depends(_plugin_route_secret_scope)])
    return SimpleNamespace(api=api, app=app, launch=launch, developer=developer,
                           scope=_config_profile_scope, home=get_hermes_home)




def test_rest_target_uses_launch_address_and_selected_profile_key(scoped_plugin):
    f = scoped_plugin
    with f.scope('developer'):
        request = SimpleNamespace(query_params=QueryParams('profile=developer&limit=20'))
        url, key, params = f.api._target(request, '/api/sessions')
        assert url == 'http://127.0.0.1:8642/p/developer/api/sessions'
        assert key == 'synthetic-developer-key'
        assert params == [('limit', '20')]
        assert f.home() == f.developer






@pytest.mark.parametrize('stored,allowed', [('own-row', True), ('own-draft', True), ('foreign-draft', False)])
def test_native_session_guard_uses_selected_profile_store_and_drafts(scoped_plugin, monkeypatch, stored, allowed):
    f = scoped_plugin
    from hermes_cli import web_server_sessions
    from tui_gateway import server
    opened, closed = [], []
    def open_db(path, *, read_only):
        opened.append((path, read_only))
        return SimpleNamespace(get_session=lambda key: {'id': key} if key == 'own-row' else None,
                               close=lambda: closed.append(path))
    monkeypatch.setattr(web_server_sessions, '_open_session_db_at_path', open_db)
    monkeypatch.setattr(server, '_hermes_home', str(f.launch))
    monkeypatch.setattr(server, '_sessions', {
        'own-runtime': {'session_key': 'own-draft', 'profile_home': str(f.developer)},
        'foreign-runtime': {'session_key': 'foreign-draft', 'profile_home': None},
    })
    with f.scope('developer'):
        if allowed:
            f.api._native_validation.check_profile_session('developer', stored)
        else:
            with pytest.raises(f.api.HTTPException) as failure:
                f.api._native_validation.check_profile_session('developer', stored)
            assert failure.value.status_code == 404
        assert f.home() == f.developer
    assert opened == [(f.developer / 'state.db', True)]
    assert closed == [f.developer / 'state.db']
