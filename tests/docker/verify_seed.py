"""Run inside the test image: verify native seeding and native context discovery."""
import runpy
import os
from pathlib import Path

from agent.prompt_builder import build_context_files_prompt
from hermes_cli import projects_db

if os.environ.get('CHATHERMES_TEST_REAL') == '1':
    key = os.environ['LITELLM_API_KEY']
    for path in (Path('/opt/data/.env'), Path('/opt/data/config.yaml')):
        assert not path.exists() or key not in path.read_text(), 'Real credentials must remain environment-only'

with projects_db.connect_closing(db_path=Path('/opt/data/projects.db')) as conn:
    before = {p.slug: p.id for p in projects_db.list_projects(conn)}
    active = projects_db.get_active_id(conn)
runpy.run_path('/test/init.py')
with projects_db.connect_closing(db_path=Path('/opt/data/projects.db')) as conn:
    after = {p.slug: p.id for p in projects_db.list_projects(conn)}
    assert before == after, 'Seeding must preserve native Project IDs on restart'
    assert projects_db.get_active_id(conn) == active, 'Seeding must not change active Project'
    available = projects_db.get_project(conn, 'hermes-mobile')
    assert Path(available.primary_path).is_dir()
    assert projects_db.get_project(conn, 'acumaticamcp').primary_path is None
    assert not Path(projects_db.get_project(conn, 'unavailable-workspace').primary_path).exists()
context = build_context_files_prompt(cwd=available.primary_path, skip_soul=True)
assert 'CHATHERMES_NATIVE_CONTEXT' in context
assert 'CHATHERMES_LOWER_PRIORITY_CONTEXT' not in context
print('Native seed IDs, active Project isolation, paths and Hermes context precedence verified')
