"""Credential contracts against pinned Hermes scopes and disposable profile files."""

import asyncio

import httpx
import pytest
from fastapi import FastAPI, HTTPException
from starlette.requests import Request


@pytest.fixture(params=["default", "host"])
def homes(tmp_path, monkeypatch, request, hermes_startup):
    root = tmp_path / "hermes"
    host = root if request.param == "default" else root / "profiles" / "host"
    host.mkdir(parents=True)
    for name in ("alpha", "beta", "empty"):
        home = root / "profiles" / name
        home.mkdir(parents=True)
        (home / "config.yaml").write_text("model: {}\n")
        (home / ".env").write_text(
            "" if name == "empty" else f"API_SERVER_KEY={name}-scope-credential\n"
        )
    (host / "config.yaml").write_text("platforms:\n  api_server:\n    port: 8642\n")
    (host / ".env").write_text("API_SERVER_KEY=host-scope-credential\n")
    monkeypatch.setenv("HERMES_HOME", str(host))
    monkeypatch.delenv("HERMES_PLUGIN_HOST_PROCESS", raising=False)
    monkeypatch.setenv("API_SERVER_KEY", "launch-environment-credential")
    return root, host


@pytest.mark.parametrize("suffix", ["-scope-credential", '-scope-"quoted"\\credential'])
def test_real_scopes_route_redact_and_restore(homes, monkeypatch, suffix):
    from agent.secret_scope import current_secret_scope, get_secret
    from chathermes.dashboard import plugin_api
    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_constants import get_hermes_home

    root, host = homes
    for name in ("alpha", "beta"):
        (root / "profiles" / name / ".env").write_text(f"API_SERVER_KEY='{name}{suffix}'\n")
    seen = []

    def gateway(request):
        seen.append((request.url.path, request.headers["authorization"]))
        key = request.headers["authorization"].removeprefix("Bearer ")
        return httpx.Response(200, json={"result": f"result {key}"})

    monkeypatch.setattr(
        plugin_api, "_client", lambda: httpx.AsyncClient(transport=httpx.MockTransport(gateway))
    )
    app = FastAPI()
    app.include_router(plugin_api.router, prefix="/plugin")

    async def exercise():
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://dashboard.test"
        ) as client:
            for profile in ("alpha", "beta", "alpha"):
                response = await client.get(f"/plugin/v1/capabilities?profile={profile}")
                assert response.status_code == 200
                assert response.json()["result"] == "result [redacted]"

    with _config_profile_scope("beta"):
        caller_scope = current_secret_scope()
        assert get_hermes_home() == root / "profiles" / "beta"
        assert plugin_api._gateway_settings()[1] == "host-scope-credential"
        asyncio.run(exercise())
        assert current_secret_scope() is caller_scope
        assert get_secret("API_SERVER_KEY") == "beta" + suffix
        assert get_hermes_home() == root / "profiles" / "beta"
    assert current_secret_scope() is None
    assert get_hermes_home() == host
    assert seen == [
        (f"/p/{name}/v1/capabilities", f"Bearer {name}{suffix}")
        for name in ("alpha", "beta", "alpha")
    ]
    # Both persistence disclosures also hold for a named-profile host.
    from chathermes.dashboard import database, push_store

    assert push_store._path() == root / "state" / "chathermes-push.json"
    assert database.database_path() == root / "state" / "chathermes.sqlite3"


def test_missing_credentials_and_exception_restore_real_scopes(homes, monkeypatch):
    from agent.secret_scope import current_secret_scope, get_secret
    from chathermes.dashboard import plugin_api
    from hermes_cli import config
    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_constants import get_hermes_home

    root, host = homes
    (host / ".env").write_text("")
    monkeypatch.delenv("API_SERVER_KEY")
    with _config_profile_scope("beta"):
        # Activation freezes launch credentials. A later process value must not leak.
        monkeypatch.setenv("API_SERVER_KEY", "foreign-process-credential")
        caller_scope = current_secret_scope()
        with _config_profile_scope("empty"):
            assert get_secret("API_SERVER_KEY", "") == ""
        assert plugin_api._gateway_settings()[1] == ""
        assert plugin_api._profile_gateway_key("empty") == ""
        request = Request({"type": "http", "query_string": b"profile=empty"})
        with pytest.raises(HTTPException) as error:
            plugin_api._target(request, "/v1/capabilities")
        assert error.value.status_code == 503
        assert "foreign-process-credential" not in str(error.value.detail)
        assert current_secret_scope() is caller_scope

        def fail_config():
            raise RuntimeError("synthetic config failure")

        monkeypatch.setattr(config, "load_config", fail_config)
        with pytest.raises(RuntimeError, match="synthetic config failure"):
            plugin_api._gateway_settings()
        assert current_secret_scope() is caller_scope
        assert get_secret("API_SERVER_KEY") == "beta-scope-credential"
        assert get_hermes_home() == root / "profiles" / "beta"
    assert current_secret_scope() is None
    assert get_hermes_home() == host


def test_configured_host_key_precedes_real_secret_scope(homes):
    from agent.secret_scope import get_secret
    from chathermes.dashboard import plugin_api
    from hermes_cli.web_server_profiles import _config_profile_scope

    _, host = homes
    (host / "config.yaml").write_text(
        "platforms:\n  api_server:\n    key: configured-host-credential\n"
    )
    with _config_profile_scope("beta"):
        assert plugin_api._gateway_settings()[1] == "configured-host-credential"
        assert plugin_api._profile_gateway_key("alpha") == "alpha-scope-credential"
        # Existing compatibility fallback for profiles intentionally sharing a
        # listener key. The gateway remains responsible for validating that key.
        assert plugin_api._profile_gateway_key("empty") == "configured-host-credential"
        assert get_secret("API_SERVER_KEY") == "beta-scope-credential"


@pytest.mark.parametrize("credentials", ["alpha", "host-fallback", "missing"])
def test_cron_redacts_with_real_profile_credentials(homes, monkeypatch, credentials):
    from agent.secret_scope import current_secret_scope
    from chathermes import cron_delivery
    from cron.execution_identity import enter_cron_execution, exit_cron_execution
    from cron.executions import create_execution, mark_execution_running
    from cron.jobs import save_job_output, save_jobs, use_cron_store
    from hermes_cli.web_server_profiles import _config_profile_scope

    root, host = homes
    profile = "alpha" if credentials == "alpha" else "empty"
    secret = "alpha-scope-credential" if profile == "alpha" else "host-scope-credential"
    if credentials == "missing":
        (host / ".env").write_text("")
        monkeypatch.delenv("API_SERVER_KEY")
        secret = "no gateway key"
    # Opaque gateway keys exercise ChatHermes's exact-key scrub; the assignment
    # exercises Hermes's forced Cron redactor independently of gateway credentials.
    text = f"Result {secret} PASSWORD=syntheticpassword123"
    job = {"id": "credential-audit", "name": f"Audit {secret}"}
    sends = []
    monkeypatch.setattr(
        cron_delivery.push_sender, "_deliver", lambda *a, **kw: sends.append((a, kw)) or True
    )
    home = root / "profiles" / profile
    with _config_profile_scope(profile), use_cron_store(home):
        caller_scope = current_secret_scope()
        save_jobs([job])
        execution = create_execution(job["id"], source="direct")
        execution = mark_execution_running(execution["id"])
        assert execution is not None
        token = enter_cron_execution(job, execution["id"], execution)
        try:
            path = save_job_output(job["id"], text)
            original = path.read_bytes()
            result = asyncio.run(cron_delivery.standalone_send(None, "scheduled", "wrapper"))
            assert result.get("success"), result
            args, sent = sends[0]
            assert args[0] == profile
            expected = "[redacted]" if credentials != "missing" else secret
            assert sent["title"] == f"Audit {expected}"
            assert f"Result {expected} PASSWORD=" in sent["message"]
            assert "syntheticpassword123" not in sent["message"]
            assert path.read_bytes() == original
            assert current_secret_scope() is caller_scope
        finally:
            exit_cron_execution(token)
