"""Regression coverage for duplicate profile plugin dependency workspace members."""
import shutil
import subprocess
import tomllib
from pathlib import Path


def test_profile_copies_get_unique_metadata_only_workspace_members(tmp_path):
    source = Path(__file__).resolve().parents[1] / "plugin" / "chathermes"
    default = tmp_path / "profiles" / "default" / "plugins" / "chathermes"
    developer = tmp_path / "profiles" / "developer" / "plugins" / "chathermes"
    shutil.copytree(source, default, ignore=shutil.ignore_patterns("dist", "__pycache__"))
    shutil.copytree(source, developer, ignore=shutil.ignore_patterns("dist", "__pycache__"))

    script = r'''
import pathlib, sys
from pm.workspace import _generate_pyproject
root = pathlib.Path(sys.argv[1])
profiles = [root / "profiles/default/plugins/chathermes", root / "profiles/developer/plugins/chathermes"]
_generate_pyproject(profiles, root / "workspace", source=pathlib.Path("/opt/hermes"))
'''
    subprocess.run(
        ["/opt/hermes/.venv/bin/python", "-c", script, str(tmp_path)],
        check=True,
        cwd="/opt/hermes",
        capture_output=True,
        text=True,
    )

    projects = [
        tomllib.loads(path.read_text())["project"]
        for path in sorted((tmp_path / "workspace" / "plugin-sources").glob("*/pyproject.toml"))
    ]
    assert len(projects) == 2
    assert len({project["name"] for project in projects}) == 2
    assert all(project["dependencies"] == ["pywebpush==2.5.0", "py-vapid==1.9.4"] for project in projects)
    assert all("build-system" not in tomllib.loads(path.read_text()) for path in
               (tmp_path / "workspace" / "plugin-sources").glob("*/pyproject.toml"))
