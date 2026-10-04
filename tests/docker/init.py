"""Idempotent native fixtures, exclusively in the dedicated /opt/data test home."""
import json
import os
import shutil
from pathlib import Path

from hermes_cli import projects_db

home = Path('/opt/data')
home.mkdir(parents=True, exist_ok=True)
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
