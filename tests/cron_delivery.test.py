"""Run with PYTHONPATH=<pinned Hermes source>:plugin python -m pytest tests/cron_delivery.test.py.

Uses disposable native Hermes stores; no gateway, browser, TUI, or provider.
"""
import asyncio
import shutil
from pathlib import Path

import pytest


@pytest.fixture
def runtime(tmp_path, monkeypatch):
    pytest.importorskip('cron.execution_identity')
    monkeypatch.syspath_prepend(str(Path(__file__).resolve().parents[1] / 'plugin'))
    monkeypatch.setenv('HERMES_HOME', str(tmp_path))
    monkeypatch.setenv('HERMES_DASHBOARD_PUBLIC_URL', 'https://dashboard.example.test')
    from hermes_constants import set_hermes_home_override, reset_hermes_home_override
    from cron.jobs import use_cron_store
    import chathermes
    from chathermes import cron_delivery as delivery
    from chathermes.dashboard import plugin_api
    monkeypatch.setattr(plugin_api, '_gateway_settings', lambda: ('http://gateway.test', 'scoped-gateway-secret'))
    monkeypatch.setattr(plugin_api, '_profile_gateway_key', lambda profile: 'scoped-gateway-secret')
    token = set_hermes_home_override(tmp_path)
    with use_cron_store(tmp_path):
        yield tmp_path, chathermes, delivery
    reset_hermes_home_override(token)


def _execution(home, job):
    from cron.jobs import save_jobs
    save_jobs([job])
    from cron.executions import create_execution, mark_execution_running
    from cron.execution_identity import enter_cron_execution
    record = create_execution(job['id'], source='direct')
    record = mark_execution_running(record['id'])
    token = enter_cron_execution(job, record['id'], record)
    return record, token


def test_native_discovery_and_home_target(runtime, monkeypatch):
    home, _, delivery = runtime
    monkeypatch.setenv('CHATHERMES_HOME_CHANNEL', 'scheduled')
    from hermes_cli.plugins import PluginManager
    from gateway.platform_registry import platform_registry
    from cron.scheduler_delivery import _is_known_delivery_platform, _resolve_delivery_targets
    source = Path(delivery.__file__).parent
    shutil.copytree(source, home / 'plugins' / 'chathermes', ignore=shutil.ignore_patterns('dist', '__pycache__'))
    (home / 'config.yaml').write_text('plugins:\n  enabled: [chathermes]\n')
    manager = PluginManager()
    manager.discover_and_load()
    entry = platform_registry.get('chathermes')
    assert entry and callable(entry.standalone_sender_fn)
    assert entry.cron_deliver_env_var == 'CHATHERMES_HOME_CHANNEL'
    from hermes_cli.web_routers.cron import get_cron_delivery_targets
    target = next(t for t in asyncio.run(get_cron_delivery_targets())['targets'] if t['id'] == 'chathermes')
    assert target['name'] == 'ChatHermes'
    assert target['home_target_set'] is True
    assert _is_known_delivery_platform('chathermes')
    assert _resolve_delivery_targets({'id': 'audit', 'deliver': 'chathermes'})[0]['chat_id'] == 'scheduled'
    assert _resolve_delivery_targets({'id': 'audit', 'deliver': 'chathermes:device_1'})[0]['chat_id'] == 'device_1'


def test_direct_delivery_awaits_push_and_reuses_output(runtime, monkeypatch):
    home, _, delivery = runtime
    from cron.jobs import save_job_output
    from cron.execution_identity import exit_cron_execution
    job = {'id': 'audit', 'name': 'Audit'}
    execution, token = _execution(home, job)
    try:
        output = save_job_output('audit', 'native saved result')
        calls = []
        monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *args, **kwargs: calls.append((args, kwargs)) or True)
        result = asyncio.run(delivery.standalone_send(None, 'scheduled', 'result'))
        assert result['success'] is True
        assert calls[0][0][0] == 'default'
        assert calls[0][1]['target'] == {'job_id': 'audit', 'run_id': 'output:' + output.stem}
        assert calls[0][1]['destination'] is None
        assert calls[0][1]['title'] == 'Audit'
        assert 'native saved result' in calls[0][1]['message']
        assert calls[0][1]['message'] != 'result'
        again = asyncio.run(delivery.standalone_send(None, '_device_1', 'result'))
        assert again['success'] is True
        assert calls[-1][1]['destination'] == '_device_1'
        assert list(output.parent.glob('*.md')) == [output]
        monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *args, **kwargs: False)
        assert 'error' in asyncio.run(delivery.standalone_send(None, 'scheduled', 'result'))
    finally:
        exit_cron_execution(token)


def test_native_queue_identity_and_duplicate_ownership(runtime, monkeypatch):
    home, _, delivery = runtime
    from cron import delivery_queue
    from cron.executions import finish_execution
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_job_output
    job = {'id': 'audit', 'name': 'Audit', 'deliver': 'chathermes'}
    execution, token = _execution(home, job)
    exit_cron_execution(token)
    save_job_output('audit', 'native result')
    finish_execution(execution['id'], success=True)
    delivery_queue.enqueue(execution['id'], job, 'result')
    sends = []
    monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *a, **kw: sends.append(kw) or True)
    def send(queued_job, content, for_failure):
        result = asyncio.run(delivery.standalone_send(None, 'scheduled', content))
        assert result.get('success'), result
        return None
    assert delivery_queue.drain(send) == 1
    delivery_queue.enqueue(execution['id'], job, 'result')
    assert delivery_queue.drain(send) == 0
    assert len(sends) == 1
    assert delivery_queue.get_status(execution['id'])['status'] == 'delivered'
    assert delivery._queued_execution(home, 'result') is None


def test_unattributed_or_ambiguous_delivery_fails_closed(runtime, monkeypatch):
    home, _, delivery = runtime
    from cron import delivery_queue
    sends = []
    monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *a, **kw: sends.append(kw) or True)
    assert 'error' in asyncio.run(delivery.standalone_send(None, 'scheduled', 'no identity'))
    for i in range(2):
        delivery_queue.enqueue(str(i) * 32, {'id': 'job' + str(i)}, 'same result')
        delivery_queue.claim_next()
    assert delivery._queued_execution(home, 'same result') is None
    assert 'error' in asyncio.run(delivery.standalone_send(None, '../other', 'same result'))
    monkeypatch.setattr(delivery, '_queued_execution', lambda *a: (_ for _ in ()).throw(RuntimeError('SECRET')))
    result = asyncio.run(delivery.standalone_send(None, 'scheduled', 'result'))
    assert result == {'error': 'ChatHermes cron delivery unavailable'}
    assert not sends


def test_scheduler_routes_wrapped_queue_payload_without_live_adapter(runtime, monkeypatch):
    home, plugin, delivery = runtime
    monkeypatch.setenv('CHATHERMES_HOME_CHANNEL', 'scheduled')
    from gateway.platform_registry import PlatformEntry, platform_registry
    from cron.scheduler_delivery import _deliver_result
    from cron import delivery_queue
    from cron.executions import finish_execution
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_job_output
    from types import SimpleNamespace
    plugin.register(SimpleNamespace(register_platform=lambda **kw: platform_registry.register(PlatformEntry(**kw))))
    job = {'id': 'audit', 'name': 'Audit', 'deliver': 'chathermes', 'execution_id': ''}
    execution, token = _execution(home, job)
    exit_cron_execution(token)
    job['execution_id'] = execution['id']
    save_job_output('audit', 'native result')
    finish_execution(execution['id'], success=True)
    delivery_queue.enqueue(execution['id'], job, 'result')
    sends = []
    monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *a, **kw: sends.append(kw) or True)
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
    from gateway.platform_registry import PlatformEntry, platform_registry
    from gateway.config import load_gateway_config, Platform
    from types import SimpleNamespace
    monkeypatch.delenv('CHATHERMES_HOME_CHANNEL', raising=False)
    plugin.register(SimpleNamespace(register_platform=lambda **kw: platform_registry.register(PlatformEntry(**kw))))
    config = load_gateway_config()
    assert Platform('chathermes') not in config.get_connected_platforms()
    assert config.get_home_channel(Platform('chathermes')) is None
    from cron.scheduler_delivery import cron_delivery_targets, _resolve_delivery_targets
    assert 'chathermes' not in {t['id'] for t in cron_delivery_targets()}
    assert _resolve_delivery_targets({'id': 'audit', 'deliver': 'chathermes'}) == []
    assert _resolve_delivery_targets({'id': 'audit', 'deliver': 'origin'}) == []


@pytest.mark.parametrize('enabled, destination, visible', [
    (None, 'scheduled', False),
    (True, 'scheduled', True),
    (True, 'device_1', True),
    (False, 'scheduled', False),
    (True, None, False),
])
def test_discovered_yaml_home_is_a_native_cron_ui_target(runtime, monkeypatch, enabled, destination, visible):
    home, _, delivery = runtime
    monkeypatch.delenv('CHATHERMES_HOME_CHANNEL', raising=False)
    from hermes_cli.plugins import PluginManager
    from gateway.platform_registry import platform_registry
    from cron.scheduler_delivery import _resolve_delivery_targets
    from hermes_cli.web_routers.cron import get_cron_delivery_targets
    from gateway.config import load_gateway_config, Platform
    shutil.copytree(Path(delivery.__file__).parent, home / 'plugins' / 'chathermes',
                    ignore=shutil.ignore_patterns('dist', '__pycache__'))
    block = 'plugins:\n  enabled: [chathermes]\nplatforms:\n  chathermes:\n'
    if enabled is not None:
        block += f'    enabled: {str(enabled).lower()}\n'
    if destination:
        block += ('    home_channel:\n      platform: chathermes\n'
                  f'      chat_id: {destination}\n      name: Scheduled results\n')
    (home / 'config.yaml').write_text(block)
    PluginManager().discover_and_load()
    entry = platform_registry.get('chathermes')
    assert entry and entry.adapter_factory(None) is None
    targets = asyncio.run(get_cron_delivery_targets())['targets']
    target = next((t for t in targets if t['id'] == 'chathermes'), None)
    assert bool(target) is visible
    assert targets[0]['id'] == 'local'
    if visible:
        config = load_gateway_config().platforms[Platform('chathermes')]
        assert entry.is_connected(config)
        assert target['name'] == 'ChatHermes'
        assert target['home_target_set'] is True
        assert target['home_env_var'] == 'CHATHERMES_HOME_CHANNEL'
        resolved = _resolve_delivery_targets({'id': 'audit', 'deliver': 'chathermes'})
        assert [(t['platform'], t['chat_id']) for t in resolved] == [('chathermes', destination)]


def test_named_profile_reads_shared_push_store_and_routes_own_history(runtime, monkeypatch):
    root, _, delivery = runtime
    from hermes_constants import set_hermes_home_override, reset_hermes_home_override
    from cron.jobs import use_cron_store, save_job_output
    from cron.execution_identity import exit_cron_execution
    named = root / 'profiles' / 'beta'
    named.mkdir(parents=True)
    (root / 'config.yaml').touch()
    monkeypatch.setenv('HERMES_HOME', str(named))
    override = set_hermes_home_override(named)
    try:
        with use_cron_store(named):
            execution, token = _execution(named, {'id': 'audit'})
            try:
                output = save_job_output('audit', 'beta only')
                calls = []
                monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *a, **kw: calls.append((a, kw)) or True)
                result = asyncio.run(delivery.standalone_send(None, 'scheduled', 'result'))
                assert result.get('success'), result
                assert calls[0][0][0] == 'beta'
                assert calls[0][1]['target']['run_id'] == 'output:' + output.stem
                assert calls[0][1]['title'] == 'audit'
                assert 'beta only' in calls[0][1]['message']
                assert delivery.push_sender.push_store._home() == root
            finally:
                exit_cron_execution(token)
    finally:
        reset_hermes_home_override(override)


def test_cron_display_name_changes_only_matching_target_and_wraps_once(runtime, monkeypatch):
    _, plugin, _ = runtime
    from cron import scheduler_delivery
    targets = [
        {'id': 'chathermes', 'name': 'Chathermes', 'home_target_set': True,
         'home_env_var': 'CHATHERMES_HOME_CHANNEL'},
        {'id': 'telegram', 'name': 'Telegram', 'home_target_set': False, 'home_env_var': None},
        {'id': 'bot_chat:chathermes', 'name': 'Bot Chat (chathermes)'},
    ]
    monkeypatch.setattr(scheduler_delivery, 'cron_delivery_targets', lambda: targets)
    plugin._register_cron_display_name()
    wrapped = scheduler_delivery.cron_delivery_targets
    plugin._register_cron_display_name()
    assert scheduler_delivery.cron_delivery_targets is wrapped
    assert wrapped() == [dict(targets[0], name='ChatHermes'), *targets[1:]]
    assert targets[0]['name'] == 'Chathermes'


@pytest.mark.parametrize('saved', [False, True])
def test_notification_reads_safe_scoped_result_without_changing_history(runtime, monkeypatch, saved):
    home, _, delivery = runtime
    from cron.jobs import save_job_output
    from cron.execution_identity import exit_cron_execution
    from chathermes.dashboard import plugin_api
    job = {'id': 'audit', 'name': 'Audit scoped-gateway-secret'}
    execution, token = _execution(home, job)
    try:
        text = 'Whole result scoped-gateway-secret ' + '漢字😀' * 4000 + ' END'
        path = save_job_output('audit', text) if saved else None
        original = path.read_bytes() if path else None
        original_reader = plugin_api._scheduled_output_sync
        if not saved:
            monkeypatch.setattr(plugin_api, '_scheduled_output_sync', lambda *args: {
                'messages': [{'role': 'assistant', 'content': 'first'},
                             {'role': 'assistant', 'content': text}]})
        sends = []
        monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *a, **kw: sends.append(kw) or True)
        result = asyncio.run(delivery.standalone_send(None, 'scheduled', 'Untrusted transport wrapper SECRET'))
        assert result.get('success'), result
        sent = sends[0]
        assert sent['title'] == 'Audit [redacted]'
        assert 'scoped-gateway-secret' not in sent['message']
        assert 'Untrusted transport' not in sent['message']
        if saved:
            assert sent['message'].endswith(' END')
            assert '[redacted]' in sent['message']
            assert path.read_bytes() == original
            assert plugin_api._scheduled_output_sync('default', home, 'audit', sent['target']['run_id'])['output'].endswith(' END')
        else:
            assert sent['message'].endswith(' END')
            assert '[redacted]' in sent['message']
            assert sent['target']['run_id'] == 'execution:' + execution['id']
    finally:
        exit_cron_execution(token)


def test_delivery_rejects_job_owned_only_by_another_profile(runtime, monkeypatch):
    home, _, delivery = runtime
    from cron.execution_identity import exit_cron_execution
    from cron.jobs import save_jobs, use_cron_store
    execution, token = _execution(home, {'id': 'audit', 'name': 'Private title'})
    try:
        save_jobs([], replace=True)
        named = home / 'profiles' / 'beta'
        named.mkdir(parents=True)
        with use_cron_store(named):
            save_jobs([{'id': 'audit', 'name': 'Other profile private title'}])
        sends = []
        monkeypatch.setattr(delivery.push_sender, '_deliver', lambda *a, **kw: sends.append(kw) or True)
        assert 'error' in asyncio.run(delivery.standalone_send(None, 'scheduled', 'Private output'))
        assert not sends
    finally:
        exit_cron_execution(token)
