"""Idempotent native fixtures, exclusively in the dedicated /opt/data test home."""
import json
import os
import shutil
import base64
from pathlib import Path

from hermes_cli import projects_db

home = Path('/opt/data')
home.mkdir(parents=True, exist_ok=True)
config_data = os.environ.pop('CHATHERMES_TEST_CONFIG_B64', None)
if config_data:
    (home / '.chathermes-config.yaml').write_bytes(base64.b64decode(config_data, validate=True))
    shutil.copyfile(home / '.chathermes-config.yaml', '/test/config.yaml')
    (home / '.chathermes-config.yaml').unlink()
shutil.copyfile('/test/config.yaml', home / 'config.yaml')
real = os.environ.get('CHATHERMES_TEST_REAL') == '1'
# Real credentials stay in the process environment. The pin's multiplexer reads
# credentials from profile .env files, so real integration uses the default
# single-profile gateway. Normal tests exercise multiplexing with fixture keys.
if real:
    import yaml
    config = yaml.safe_load((home / 'config.yaml').read_text())
    config['gateway']['multiplex_profiles'] = False
    (home / 'config.yaml').write_text(yaml.safe_dump(config))
    (home / '.env').unlink(missing_ok=True)
else:
    if (os.environ.get('LLM_API_KEY') != 'chathermes-model-fixture'
            or os.environ.get('LLM_API_BASE_URL') != 'http://model:4000/v1'
            or os.environ.get('LLM_API_MODEL') != 'fixture-model'):
        raise RuntimeError('Fixture mode requires its isolated fixture endpoint and key; use CHATHERMES_TEST_REAL=1 for real integration')
    values = {
        'LLM_API_BASE_URL': os.environ['LLM_API_BASE_URL'],
        'LLM_API_KEY': 'chathermes-model-fixture',
        'LLM_API_MODEL': os.environ['LLM_API_MODEL'],
        'API_SERVER_KEY': 'chathermes-isolated-test-key-2026',
    }
    (home / '.env').write_text(''.join(key + '=' + json.dumps(value) + '\n' for key, value in values.items()))
    (home / '.env').chmod(0o600)
# Native hosting activates even with multiplex_profiles=false if a second home
# exists. Real integration must be genuinely single-profile to consume injected
# environment credentials without profile files. This is only our test profile.
secondary = home / 'profiles' / 'test-profile'
if real:
    if secondary.exists():
        shutil.rmtree(secondary)
else:
    secondary.mkdir(parents=True, exist_ok=True)
    shutil.copyfile('/test/config.yaml', secondary / 'config.yaml')
    (secondary / '.env').write_text(
        'LLM_API_KEY=chathermes-model-fixture\n'
        'API_SERVER_KEY=chathermes-isolated-test-key-2026\n'
        'LLM_API_BASE_URL=' + json.dumps(os.environ['LLM_API_BASE_URL']) + '\n'
        'LLM_API_MODEL=' + json.dumps(os.environ['LLM_API_MODEL']) + '\n'
    )
    (secondary / '.env').chmod(0o600)

workspace = Path('/tmp/chathermes-issue7-runtime/workspace-a')
workspace.mkdir(parents=True, exist_ok=True)
(workspace / '.hermes.md').write_text('CHATHERMES_NATIVE_CONTEXT: isolated Project workspace.\n')
(workspace / 'AGENTS.md').write_text('CHATHERMES_LOWER_PRIORITY_CONTEXT\n')
with projects_db.connect_closing(db_path=home / 'projects.db') as conn:
    for name, slug, path in (
        ('Hermes Mobile', 'hermes-mobile', str(workspace)),
        ('AcumaticaMCP', 'acumaticamcp', None),
        ('Unavailable workspace', 'unavailable-workspace', '/tmp/chathermes-issue7-runtime/missing'),
    ):
        if projects_db.get_project(conn, slug) is None:
            projects_db.create_project(conn, name=name, slug=slug, primary_path=path)
# Do not set active_id or fabricate Project/session links.

# Scheduled history fixtures use native cron jobs and SessionDB. Every document
# and message is synthetic; no personal cron store is read or mounted.
if not real:
    from datetime import datetime, timedelta, timezone
    from hermes_cli.web_server_cron import _cron_store_scope
    from hermes_state import SessionDB
    for profile_home in (home, secondary):
        with _cron_store_scope(profile_home) as cron_jobs:
            existing = cron_jobs.list_jobs(include_disabled=True)
            audit = next((row for row in existing if row.get('name') == 'Security Audit'), None)
            if audit is None:
                audit = cron_jobs.create_job(prompt='Review this synthetic security audit fixture.', schedule='0 0 1 1 *', name='Security Audit', deliver='local')
            if not any(row.get('name') == 'Paused audit' for row in existing):
                cron_jobs.create_job(prompt='Paused synthetic fixture.', schedule='0 0 1 1 *', name='Paused audit', paused=True)
            failed_job = next((row for row in existing if row.get('name') == 'Failed run fixture'), None)
            if failed_job is None:
                failed_job = cron_jobs.create_job(prompt='Synthetic failure with no output.', schedule='0 0 1 1 *', name='Failed run fixture', paused=True)
            from cron.executions import create_execution, finish_execution, list_executions
            if not list_executions(job_id=failed_job['id'], limit=1):
                attempt = create_execution(failed_job['id'], source='manual')
                finish_execution(attempt['id'], success=False, error='Synthetic fixture failure')
            output_dir = profile_home / 'cron' / 'output' / audit['id']
            output_dir.mkdir(parents=True, exist_ok=True)
            for index in range(35):
                when = datetime(2025, 1, 1, tzinfo=timezone.utc) + timedelta(days=index)
                (output_dir / (when.strftime('%Y-%m-%d_%H-%M-%S') + '.md')).write_text(
                    f'# Security audit {index + 1}\n\nSynthetic saved output for {profile_home.name}.\n\nNo critical findings.\n')
            db = SessionDB(db_path=profile_home / 'state.db')
            try:
                run_id = f"cron_{audit['id']}_20250205_000000"
                if not db.get_session(run_id):
                    db.create_session(run_id, source='cron')
                    db.append_message(run_id, 'user', content='Run the synthetic security audit')
                    db.append_message(run_id, 'assistant', content='', tool_calls=[{'id': 'audit-tool', 'type': 'function', 'function': {'name': 'terminal', 'arguments': '{"command":"audit"}'}}])
                    db.append_message(run_id, 'tool', content='Synthetic audit checks passed.', tool_name='terminal', tool_call_id='audit-tool')
                    db.append_message(run_id, 'assistant', content='# Security audit\n\nSynthetic persisted agent output. No critical findings.\n\n' + '\n\n'.join(f'Check {i}: passed.' for i in range(30)))
                    db.end_session(run_id, 'completed')
            finally:
                db.close()
