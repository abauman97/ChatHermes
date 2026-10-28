"""Run with PYTHONPATH=<pinned Hermes source>:plugin uv run pytest tests/cron_delivery.test.py.

Uses disposable native Hermes stores; no gateway, browser, TUI, or provider.
"""

import asyncio
import shutil
from pathlib import Path

import pytest


@pytest.fixture
def runtime(tmp_path, monkeypatch):
    pytest.importorskip("cron.execution_identity")
    monkeypatch.syspath_prepend(str(Path(__file__).resolve().parents[1] / "plugin"))
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.setenv("HERMES_DASHBOARD_PUBLIC_URL", "https://dashboard.example.test")
    import chathermes
    from chathermes import cron_delivery as delivery
    from chathermes.dashboard import plugin_api
    from cron.jobs import use_cron_store
    from hermes_constants import reset_hermes_home_override, set_hermes_home_override

    monkeypatch.setattr(
        plugin_api, "_gateway_settings", lambda: ("http://gateway.test", "scoped-gateway-secret")
    )
    monkeypatch.setattr(plugin_api, "_profile_gateway_key", lambda profile: "scoped-gateway-secret")
    token = set_hermes_home_override(tmp_path)
    with use_cron_store(tmp_path):
        yield tmp_path, chathermes, delivery
    reset_hermes_home_override(token)


def _execution(home, job):
    from cron.jobs import save_jobs

    save_jobs([job])
    from cron.execution_identity import enter_cron_execution
    from cron.executions import create_execution, mark_execution_running

    record = create_execution(job["id"], source="direct")
    record = mark_execution_running(record["id"])
    assert record is not None
    token = enter_cron_execution(job, record["id"], record)
    return record, token


def test_native_discovery_and_home_target(runtime, monkeypatch):
    home, _, delivery = runtime
    monkeypatch.setenv("CHATHERMES_HOME_CHANNEL", "scheduled")
    from cron.scheduler_delivery import _is_known_delivery_platform, _resolve_delivery_targets
    from gateway.platform_registry import platform_registry
    from hermes_cli.plugins import PluginManager

    source = Path(delivery.__file__).parent
    shutil.copytree(
        source,
        home / "plugins" / "chathermes",
        ignore=shutil.ignore_patterns("dist", "__pycache__"),
    )
    (home / "config.yaml").write_text("plugins:\n  enabled: [chathermes]\n")
    manager = PluginManager()
    manager.discover_and_load()
    entry = platform_registry.get("chathermes")
    assert entry and callable(entry.standalone_sender_fn)
    assert entry.cron_deliver_env_var == "CHATHERMES_HOME_CHANNEL"
    from hermes_cli.web_routers.cron import get_cron_delivery_targets

    target = next(
        t for t in asyncio.run(get_cron_delivery_targets())["targets"] if t["id"] == "chathermes"
    )
    assert target["name"] == "ChatHermes"
    assert target["home_target_set"] is True
    assert _is_known_delivery_platform("chathermes")
    assert (
        _resolve_delivery_targets({"id": "audit", "deliver": "chathermes"})[0]["chat_id"]
        == "scheduled"
    )
    assert (
        _resolve_delivery_targets({"id": "audit", "deliver": "chathermes:device_1"})[0]["chat_id"]
        == "device_1"
    )


def test_direct_delivery_awaits_push_and_reuses_output(runtime, monkeypatch):
    home, _, delivery = runtime
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_job_output

    job = {"id": "audit", "name": "Audit"}
    execution, token = _execution(home, job)
    try:
        output = save_job_output("audit", "native saved result")
        calls = []
        monkeypatch.setattr(
            delivery.push_sender,
            "_deliver",
            lambda *args, **kwargs: calls.append((args, kwargs)) or True,
        )
        result = asyncio.run(delivery.standalone_send(None, "scheduled", "result"))
        assert result["success"] is True
        assert calls[0][0][0] == "default"
        assert calls[0][1]["target"] == {"job_id": "audit", "run_id": "output:" + output.stem}
        assert calls[0][1]["destination"] is None
        assert calls[0][1]["title"] == "Audit"
        assert "native saved result" in calls[0][1]["message"]
        assert calls[0][1]["message"] != "result"
        assert not (home / "state.db").exists()
        again = asyncio.run(delivery.standalone_send(None, "_device_1", "result"))
        assert again["success"] is True
        assert calls[-1][1]["destination"] == "_device_1"
        assert list(output.parent.glob("*.md")) == [output]
        monkeypatch.setattr(delivery.push_sender, "_deliver", lambda *args, **kwargs: False)
        assert "error" in asyncio.run(delivery.standalone_send(None, "scheduled", "result"))
    finally:
        exit_cron_execution(token)


@pytest.mark.parametrize("has_session", [False, True])
def test_native_queue_identity_and_duplicate_ownership(runtime, monkeypatch, has_session):
    home, _, delivery = runtime
    from cron.execution_identity import exit_cron_execution
    from cron.executions import finish_execution
    from cron.jobs import save_job_output

    from cron import delivery_queue

    job = {"id": "audit", "name": "Audit", "deliver": "chathermes"}
    execution, token = _execution(home, job)
    exit_cron_execution(token)
    output = save_job_output("audit", "native result")
    if has_session:
        _cron_session(home, "cron_audit_20261019_102136", "Agent result")
    finish_execution(execution["id"], success=True)
    delivery_queue.enqueue(execution["id"], job, "result")
    sends = []
    monkeypatch.setattr(delivery.push_sender, "_deliver", lambda *a, **kw: sends.append(kw) or True)

    def send(queued_job, content, for_failure):
        result = asyncio.run(delivery.standalone_send(None, "scheduled", content))
        assert result.get("success"), result
        return None

    assert delivery_queue.drain(send) == 1
    delivery_queue.enqueue(execution["id"], job, "result")
    assert delivery_queue.drain(send) == 0
    assert len(sends) == 1
    expected = "cron_audit_20261019_102136" if has_session else "output:" + output.stem
    assert sends[0]["target"] == {"job_id": "audit", "run_id": expected}
    status = delivery_queue.get_status(execution["id"])
    assert status is not None
    assert status["status"] == "delivered"
    assert delivery._queued_execution(home, "result") is None


@pytest.mark.parametrize("source", ["output", "session", "execution"])
def test_cron_push_emits_structured_route_identity_without_legacy_url(runtime, monkeypatch, source):
    import json
    from types import SimpleNamespace

    import pywebpush
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_job_output

    home, _, delivery = runtime
    sender = delivery.push_sender
    monkeypatch.setattr(sender.push_store, "_path", lambda: home / "push.json")
    sender.push_store.upsert(
        "default", {"endpoint": "https://push.test/cron", "keys": {"p256dh": "key", "auth": "auth"}}
    )
    execution, token = _execution(home, {"id": "audit", "name": "Audit", "deliver": "chathermes"})
    run_id = "execution:" + execution["id"]
    if source == "output":
        run_id = "output:" + save_job_output("audit", "Saved result").stem
    elif source == "session":
        run_id = "cron_audit_20261019_102136"
        _cron_session(home, run_id, "Transcript result")
    sent = []
    monkeypatch.setattr(
        pywebpush,
        "webpush",
        lambda subscription, payload, **kw: (
            sent.append(json.loads(payload)) or SimpleNamespace(status_code=201)
        ),
    )
    try:
        result = asyncio.run(delivery.standalone_send(None, "scheduled", "result"))
        assert result.get("success"), result
        assert len(sent) == 1
        assert sent[0]["type"] == "scheduled"
        assert sent[0]["profile"] == "default"
        assert sent[0]["session_id"] == ""
        assert sent[0]["job_id"] == "audit"
        assert sent[0]["run_id"] == run_id
        # No query-format URL can bypass the worker's canonical URL builder.
        assert set(sent[0]) == {
            "type",
            "title",
            "body",
            "profile",
            "session_id",
            "tag",
            "job_id",
            "run_id",
        }
    finally:
        exit_cron_execution(token)


def test_unattributed_or_ambiguous_delivery_fails_closed(runtime, monkeypatch):
    home, _, delivery = runtime
    from cron import delivery_queue

    sends = []
    monkeypatch.setattr(delivery.push_sender, "_deliver", lambda *a, **kw: sends.append(kw) or True)
    assert "error" in asyncio.run(delivery.standalone_send(None, "scheduled", "no identity"))
    for i in range(2):
        delivery_queue.enqueue(str(i) * 32, {"id": "job" + str(i)}, "same result")
        delivery_queue.claim_next()
    assert delivery._queued_execution(home, "same result") is None
    assert "error" in asyncio.run(delivery.standalone_send(None, "../other", "same result"))
    monkeypatch.setattr(
        delivery, "_queued_execution", lambda *a: (_ for _ in ()).throw(RuntimeError("SECRET"))
    )
    result = asyncio.run(delivery.standalone_send(None, "scheduled", "result"))
    assert result == {"error": "ChatHermes cron delivery unavailable"}
    assert not sends


def test_scheduler_routes_wrapped_queue_payload_without_live_adapter(runtime, monkeypatch):
    home, plugin, delivery = runtime
    monkeypatch.setenv("CHATHERMES_HOME_CHANNEL", "scheduled")
    from types import SimpleNamespace

    from cron.execution_identity import exit_cron_execution
    from cron.executions import finish_execution
    from cron.jobs import save_job_output
    from cron.scheduler_delivery import _deliver_result
    from gateway.platform_registry import PlatformEntry, platform_registry

    from cron import delivery_queue

    plugin.register(
        SimpleNamespace(
            register_platform=lambda **kw: platform_registry.register(PlatformEntry(**kw))
        )
    )
    job = {"id": "audit", "name": "Audit", "deliver": "chathermes", "execution_id": ""}
    execution, token = _execution(home, job)
    exit_cron_execution(token)
    job["execution_id"] = execution["id"]
    save_job_output("audit", "native result")
    finish_execution(execution["id"], success=True)
    delivery_queue.enqueue(execution["id"], job, "result")
    sends = []
    monkeypatch.setattr(delivery.push_sender, "_deliver", lambda *a, **kw: sends.append(kw) or True)
    errors = []

    def send(job, content, failure):
        result = _deliver_result(job, content, adapters={})
        errors.append(result)
        return result

    assert delivery_queue.drain(send) == 1
    assert errors == [None]
    assert len(sends) == 1


def test_install_does_not_enable_or_redirect_existing_tui_cron(runtime, monkeypatch):
    home, plugin, _ = runtime
    from types import SimpleNamespace

    from gateway.config import Platform, load_gateway_config
    from gateway.platform_registry import PlatformEntry, platform_registry

    monkeypatch.delenv("CHATHERMES_HOME_CHANNEL", raising=False)
    plugin.register(
        SimpleNamespace(
            register_platform=lambda **kw: platform_registry.register(PlatformEntry(**kw))
        )
    )
    config = load_gateway_config()
    assert Platform("chathermes") not in config.get_connected_platforms()
    assert config.get_home_channel(Platform("chathermes")) is None
    from cron.scheduler_delivery import _resolve_delivery_targets, cron_delivery_targets

    assert "chathermes" not in {t["id"] for t in cron_delivery_targets()}
    assert _resolve_delivery_targets({"id": "audit", "deliver": "chathermes"}) == []
    assert _resolve_delivery_targets({"id": "audit", "deliver": "origin"}) == []


@pytest.mark.parametrize(
    "enabled, destination, visible",
    [
        (None, "scheduled", False),
        (True, "scheduled", True),
        (True, "device_1", True),
        (False, "scheduled", False),
        (True, None, False),
    ],
)
def test_discovered_yaml_home_is_a_native_cron_ui_target(
    runtime, monkeypatch, enabled, destination, visible
):
    home, _, delivery = runtime
    monkeypatch.delenv("CHATHERMES_HOME_CHANNEL", raising=False)
    from cron.scheduler_delivery import _resolve_delivery_targets
    from gateway.config import Platform, load_gateway_config
    from gateway.platform_registry import platform_registry
    from gateway.platforms.base import BasePlatformAdapter
    from hermes_cli.plugins import PluginManager
    from hermes_cli.web_routers.cron import get_cron_delivery_targets

    shutil.copytree(
        Path(delivery.__file__).parent,
        home / "plugins" / "chathermes",
        ignore=shutil.ignore_patterns("dist", "__pycache__"),
    )
    block = "plugins:\n  enabled: [chathermes]\nplatforms:\n  chathermes:\n"
    if enabled is not None:
        block += f"    enabled: {str(enabled).lower()}\n"
    if destination:
        block += (
            "    home_channel:\n      platform: chathermes\n"
            f"      chat_id: {destination}\n      name: Scheduled results\n"
        )
    (home / "config.yaml").write_text(block)
    PluginManager().discover_and_load()
    entry = platform_registry.get("chathermes")
    assert entry and isinstance(
        entry.adapter_factory(load_gateway_config().platforms[Platform("chathermes")]),
        BasePlatformAdapter,
    )
    targets = asyncio.run(get_cron_delivery_targets())["targets"]
    target = next((t for t in targets if t["id"] == "chathermes"), None)
    assert bool(target) is visible
    assert targets[0]["id"] == "local"
    if visible:
        assert target is not None and entry.is_connected is not None
        config = load_gateway_config().platforms[Platform("chathermes")]
        assert entry.is_connected(config)
        assert target["name"] == "ChatHermes"
        assert target["home_target_set"] is True
        assert target["home_env_var"] == "CHATHERMES_HOME_CHANNEL"
        resolved = _resolve_delivery_targets({"id": "audit", "deliver": "chathermes"})
        assert [(t["platform"], t["chat_id"]) for t in resolved] == [("chathermes", destination)]


def test_named_profile_reads_shared_push_store_and_routes_own_history(runtime, monkeypatch):
    root, _, delivery = runtime
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_job_output, use_cron_store
    from hermes_constants import reset_hermes_home_override, set_hermes_home_override

    named = root / "profiles" / "beta"
    named.mkdir(parents=True)
    (root / "config.yaml").touch()
    monkeypatch.setenv("HERMES_HOME", str(named))
    override = set_hermes_home_override(named)
    try:
        with use_cron_store(named):
            execution, token = _execution(named, {"id": "audit"})
            try:
                output = save_job_output("audit", "beta only")
                calls = []
                monkeypatch.setattr(
                    delivery.push_sender, "_deliver", lambda *a, **kw: calls.append((a, kw)) or True
                )
                result = asyncio.run(delivery.standalone_send(None, "scheduled", "result"))
                assert result.get("success"), result
                assert calls[0][0][0] == "beta"
                assert calls[0][1]["target"]["run_id"] == "output:" + output.stem
                assert calls[0][1]["title"] == "audit"
                assert "beta only" in calls[0][1]["message"]
                assert delivery.push_sender.push_store._home() == root
            finally:
                exit_cron_execution(token)
    finally:
        reset_hermes_home_override(override)


def test_cron_display_name_changes_only_matching_target_and_wraps_once(runtime, monkeypatch):
    _, plugin, _ = runtime
    from cron import scheduler_delivery

    targets = [
        {
            "id": "chathermes",
            "name": "Chathermes",
            "home_target_set": True,
            "home_env_var": "CHATHERMES_HOME_CHANNEL",
        },
        {"id": "telegram", "name": "Telegram", "home_target_set": False, "home_env_var": None},
        {"id": "bot_chat:chathermes", "name": "Bot Chat (chathermes)"},
    ]
    monkeypatch.setattr(scheduler_delivery, "cron_delivery_targets", lambda: targets)
    plugin._register_cron_display_name()
    wrapped = scheduler_delivery.cron_delivery_targets
    plugin._register_cron_display_name()
    assert scheduler_delivery.cron_delivery_targets is wrapped
    assert wrapped() == [dict(targets[0], name="ChatHermes"), *targets[1:]]
    assert targets[0]["name"] == "Chathermes"


@pytest.mark.parametrize("saved", [False, True])
def test_notification_reads_safe_scoped_result_without_changing_history(
    runtime, monkeypatch, saved
):
    home, _, delivery = runtime
    from chathermes.dashboard import plugin_api
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_job_output

    job = {"id": "audit", "name": "Audit scoped-gateway-secret"}
    execution, token = _execution(home, job)
    try:
        text = "Whole result scoped-gateway-secret " + "漢字😀" * 4000 + " END"
        path = save_job_output("audit", text) if saved else None
        original = path.read_bytes() if path else None
        if not saved:
            monkeypatch.setattr(
                plugin_api,
                "_scheduled_output_sync",
                lambda *args: {
                    "messages": [
                        {"role": "assistant", "content": "first"},
                        {"role": "assistant", "content": text},
                    ]
                },
            )
        sends = []
        monkeypatch.setattr(
            delivery.push_sender, "_deliver", lambda *a, **kw: sends.append(kw) or True
        )
        result = asyncio.run(
            delivery.standalone_send(None, "scheduled", "Untrusted transport wrapper SECRET")
        )
        assert result.get("success"), result
        sent = sends[0]
        assert sent["title"] == "Audit [redacted]"
        assert "scoped-gateway-secret" not in sent["message"]
        assert "Untrusted transport" not in sent["message"]
        if saved:
            assert path is not None
            assert sent["message"].endswith(" END")
            assert "[redacted]" in sent["message"]
            assert path.read_bytes() == original
            assert plugin_api._scheduled_output_sync(
                "default", home, "audit", sent["target"]["run_id"]
            )["output"].endswith(" END")
        else:
            assert sent["message"].endswith(" END")
            assert "[redacted]" in sent["message"]
            assert sent["target"]["run_id"] == "execution:" + execution["id"]
    finally:
        exit_cron_execution(token)


def test_delivery_rejects_job_owned_only_by_another_profile(runtime, monkeypatch):
    home, _, delivery = runtime
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_jobs, use_cron_store

    execution, token = _execution(home, {"id": "audit", "name": "Private title"})
    try:
        save_jobs([], replace=True)
        named = home / "profiles" / "beta"
        named.mkdir(parents=True)
        with use_cron_store(named):
            save_jobs([{"id": "audit", "name": "Other profile private title"}])
        sends = []
        monkeypatch.setattr(
            delivery.push_sender, "_deliver", lambda *a, **kw: sends.append(kw) or True
        )
        assert "error" in asyncio.run(delivery.standalone_send(None, "scheduled", "Private output"))
        assert not sends
    finally:
        exit_cron_execution(token)


def _cron_session(home, session_id, content, started_at=None):
    from hermes_state import SessionDB

    db = SessionDB(db_path=home / "state.db")
    try:
        db.create_session(session_id, source="cron")
        db.append_message(session_id, "assistant", content)
        if started_at is not None:
            db._write_sql(
                "UPDATE sessions SET started_at = ? WHERE id = ?", (started_at, session_id)
            )
    finally:
        db.close()


@pytest.mark.parametrize("profile", ["default", "beta"])
@pytest.mark.parametrize("has_session", [True, False])
def test_notification_deep_link_opens_profile_transcript_or_script_output(
    runtime, monkeypatch, profile, has_session
):
    root, _, delivery = runtime
    from chathermes.dashboard import plugin_api
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_job_output, save_jobs, use_cron_store
    from hermes_cli.web_server_cron import _cron_store_scope

    (root / "config.yaml").touch()
    named = root / "profiles" / "beta"
    named.mkdir(parents=True)
    (named / "config.yaml").touch()
    home = root if profile == "default" else named
    other = named if profile == "default" else root
    session_id = "cron_audit_20261019_102136"
    job = {"id": "audit", "name": "Own job", "no_agent": not has_session}
    with _cron_store_scope(other):
        save_jobs([dict(job, name="Other private job")])
        _cron_session(other, session_id, "Other private transcript")
        save_job_output("audit", "Other private output")
    with _cron_store_scope(home), use_cron_store(home):
        execution, token = _execution(home, job)
        try:
            output = save_job_output("audit", "Own saved output")
            if has_session:
                _cron_session(home, session_id, "Own final answer scoped-gateway-secret")
            else:
                _cron_session(home, "cron_other_20261019_102136", "Unrelated job")
            original = output.read_bytes()
            sends = []
            monkeypatch.setattr(
                delivery.push_sender, "_deliver", lambda *a, **kw: sends.append((a, kw)) or True
            )
            result = asyncio.run(delivery.standalone_send(None, "scheduled", "Untrusted wrapper"))
            assert result.get("success"), result
            args, notification = sends[0]
            run_id = session_id if has_session else "output:" + output.stem
            assert args[0] == profile
            assert notification["target"] == {"job_id": "audit", "run_id": run_id}
            assert notification["title"] == "Own job"
            expected = "Own final answer [redacted]" if has_session else "Own saved output"
            assert notification["message"] == expected
            history = plugin_api._scheduled_runs_sync(profile, home, "audit", 0, 30)
            assert run_id in [run["id"] for run in history["runs"]]
            opened = plugin_api._scheduled_output_sync(profile, home, "audit", run_id)
            if has_session:
                assert opened["messages"][-1]["content"] == "Own final answer scoped-gateway-secret"
            else:
                assert opened["output"] == "Own saved output"
            assert output.read_bytes() == original
        finally:
            exit_cron_execution(token)


@pytest.mark.parametrize("matches", [0, 1, 2])
def test_deep_link_matches_execution_window_and_exact_job(runtime, monkeypatch, matches):
    home, _, delivery = runtime
    from datetime import datetime

    from chathermes.dashboard import plugin_api
    from cron.execution_identity import exit_cron_execution

    from cron import executions

    execution, token = _execution(home, {"id": "audit"})
    exit_cron_execution(token)
    start = datetime.fromisoformat(execution["claimed_at"]).timestamp()
    # Include a fractional claim to exercise whole-second output filenames.
    start = int(start) + 0.5
    monkeypatch.setattr(
        executions,
        "get_execution",
        lambda identifier: dict(
            execution,
            claimed_at=datetime.fromtimestamp(start).isoformat(),
            finished_at=datetime.fromtimestamp(start + 10).isoformat(),
        ),
    )
    _cron_session(home, "cron_audit_20261019_102100", "Old", start - 100)
    _cron_session(home, "cron_audit_20261019_102200", "Next run", start + 11)
    _cron_session(home, "cron_audit_other_20261019_102136", "Different job", start + 1)
    for i in range(matches):
        _cron_session(home, f"cron_audit_20261019_10213{i}", "Matching", start + 1 + i)
    # A doc from the claim's second is valid; a later fire's doc is excluded.
    monkeypatch.setattr(
        plugin_api,
        "_scheduled_docs",
        lambda *a: [
            {"id": "output:2026-10-19_10-21-36", "started_at": int(start)},
            {"id": "output:2026-10-19_10-22-00", "started_at": start + 11},
        ],
    )
    if matches > 1:
        with pytest.raises(ValueError, match="Ambiguous cron session"):
            delivery._result(home, "audit", execution["id"])
    else:
        expected = "cron_audit_20261019_102130" if matches else "output:2026-10-19_10-21-36"
        assert delivery._result(home, "audit", execution["id"])["run_id"] == expected


def test_matching_transcript_precedes_ambiguous_output(runtime, monkeypatch):
    home, _, delivery = runtime
    from chathermes.dashboard import plugin_api
    from cron.execution_identity import exit_cron_execution

    execution, token = _execution(home, {"id": "audit"})
    exit_cron_execution(token)
    session_id = "cron_audit_20261019_102136"
    _cron_session(home, session_id, "Final answer")

    def unexpected_docs(*args):
        pytest.fail("Saved output should only be read when no transcript matches")

    monkeypatch.setattr(plugin_api, "_scheduled_docs", unexpected_docs)
    assert delivery._result(home, "audit", execution["id"])["run_id"] == session_id


def test_deep_link_pages_session_history_and_closes_reader(runtime, monkeypatch):
    home, _, delivery = runtime
    from datetime import datetime

    import hermes_cli.web_server_sessions as sessions
    from cron.execution_identity import exit_cron_execution

    execution, token = _execution(home, {"id": "audit"})
    exit_cron_execution(token)
    start = datetime.fromisoformat(execution["claimed_at"]).timestamp()
    session_id = "cron_audit_20261019_102136"
    (home / "state.db").touch()
    offsets = []
    closed = []

    class SessionDB:
        def list_cron_job_runs(self, job_id, limit, offset):
            assert job_id == "audit" and limit == 500
            offsets.append(offset)
            return (
                [{"id": "cron_audit_20261018_102136", "started_at": start - 100}] * 500
                if offset == 0
                else [{"id": session_id, "started_at": start + 1}]
            )

        def close(self):
            closed.append(True)

    monkeypatch.setattr(sessions, "_open_session_db_for_profile", lambda *a, **kw: SessionDB())
    assert delivery._result(home, "audit", execution["id"])["run_id"] == session_id
    assert offsets == [0, 500]
    assert closed == [True]


def test_deep_link_rejects_mismatched_profile_home(runtime):
    home, _, delivery = runtime
    from cron.execution_identity import exit_cron_execution

    execution, token = _execution(home, {"id": "audit"})
    exit_cron_execution(token)
    (home / "config.yaml").touch()
    named = home / "profiles" / "beta"
    named.mkdir(parents=True)
    (named / "config.yaml").touch()
    with pytest.raises(ValueError, match="profile does not match"):
        delivery._result(home, "audit", execution["id"], profile="beta")


@pytest.mark.parametrize("count", [0, 2])
def test_deep_link_missing_or_ambiguous_saved_output(runtime, monkeypatch, count):
    home, _, delivery = runtime
    from datetime import datetime

    from chathermes.dashboard import plugin_api
    from cron.execution_identity import exit_cron_execution

    execution, token = _execution(home, {"id": "audit", "no_agent": True})
    exit_cron_execution(token)
    start = datetime.fromisoformat(execution["claimed_at"]).timestamp()
    monkeypatch.setattr(
        plugin_api,
        "_scheduled_docs",
        lambda *a: [
            {"id": f"output:2026-10-19_10-21-3{i}", "started_at": start + i} for i in range(count)
        ],
    )
    if count:
        with pytest.raises(ValueError, match="Ambiguous cron output"):
            delivery._result(home, "audit", execution["id"])
    else:
        assert delivery._result(home, "audit", execution["id"]) == {
            "job_id": "audit",
            "run_id": "execution:" + execution["id"],
        }
    assert not (home / "state.db").exists()
