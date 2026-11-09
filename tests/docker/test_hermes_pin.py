"""Fail closed when a retained fixture image differs from the reviewed release."""

import importlib.util
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location(
    "verify_hermes", Path(__file__).with_name("verify-hermes.py")
)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
PIN = json.loads(Path(__file__).with_name("hermes-pin.json").read_text())


def test_fixture_and_capabilities_use_the_reviewed_image():
    from chathermes.dashboard.execution_viewer import PIN as reviewed

    assert PIN["commit"] == reviewed == "2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19"
    assert "FROM " + PIN["image"] + "\n" in (ROOT / "tests/docker/Dockerfile").read_text()
    assert "@sha256:" in PIN["image"]


def test_image_provenance_accepts_only_the_reviewed_commit(tmp_path):
    stamp = tmp_path / "install-stamp.json"
    stamp.write_text(json.dumps({"commit": PIN["commit"]}))
    assert MODULE.verify(root=tmp_path) == PIN["commit"]
    for commit in ("bf0203a794a07aac3ff764972ab9087baa4e4f4e", "0" * 40, None):
        stamp.write_text(json.dumps({"commit": commit}))
        with pytest.raises(ValueError, match="revision differs"):
            MODULE.verify(root=tmp_path)
    stamp.write_text("{}")
    with pytest.raises(ValueError, match="revision differs"):
        MODULE.verify(root=tmp_path)
    stamp.unlink()
    with pytest.raises(FileNotFoundError):
        MODULE.verify(root=tmp_path)


@pytest.mark.skipif(shutil.which("node") is None, reason="Node.js is required for the runner")
def test_integration_refuses_a_retained_image_with_its_own_older_pin(tmp_path):
    docker = tmp_path / "docker"
    docker.write_text(
        f"#!{sys.executable}\n"
        "import sys\n"
        "if sys.argv[1] == 'exec':\n"
        "    print('Verified Hermes source revision: bf0203a794a07aac3ff764972ab9087baa4e4f4e')\n"
        "elif 'ps' in sys.argv:\n"
        "    print('retained-fixture')\n"
    )
    docker.chmod(0o755)
    result = subprocess.run(
        ["node", "tests/docker/integration.mjs"],
        cwd=ROOT,
        env={**os.environ, "PATH": str(tmp_path) + os.pathsep + os.environ["PATH"]},
        capture_output=True,
        text=True,
        timeout=20,
    )
    assert result.returncode != 0
    assert "Retained Hermes container differs from this checkout's source pin" in result.stderr


@pytest.mark.skipif(shutil.which("node") is None, reason="Node.js is required for the runner")
@pytest.mark.parametrize("explicit_image", [None, "custom-fixture:reviewed"])
@pytest.mark.parametrize("retained_current_build", [False, True])
def test_integration_checks_plugin_build_even_when_hermes_pin_matches(
    tmp_path, explicit_image, retained_current_build
):
    current = "sha256:" + "a" * 64
    retained = current if retained_current_build else "sha256:" + "b" * 64
    image = explicit_image or "isolated-fixture-hermes"
    config = {"name": "isolated-fixture", "services": {"hermes": {}}}
    if explicit_image:
        config["services"]["hermes"]["image"] = explicit_image
    calls = tmp_path / "calls.jsonl"
    docker = tmp_path / "docker"
    docker.write_text(
        f"#!{sys.executable}\n"
        "import json, sys\n"
        f"with open({str(calls)!r}, 'a') as log: log.write(json.dumps(sys.argv[1:]) + '\\n')\n"
        "if sys.argv[1] == 'exec':\n"
        "    if sys.argv[-1] == '/opt/chathermes/verify-hermes.py':\n"
        f"        print('Verified Hermes source revision: {PIN['commit']}')\n"
        "    else:\n"
        "        print('False')  # Stop at provider guard; never load fixtures/run browsers.\n"
        "elif sys.argv[1:3] == ['image', 'inspect']:\n"
        f"    assert sys.argv[-1] == {image!r}\n"
        f"    print({current!r})\n"
        "elif sys.argv[1] == 'inspect':\n"
        f"    print({retained!r})\n"
        "elif 'config' in sys.argv:\n"
        f"    print({json.dumps(config)!r})\n"
        "elif 'ps' in sys.argv:\n"
        "    print('retained-fixture')\n"
    )
    docker.chmod(0o755)
    result = subprocess.run(
        ["node", "tests/docker/integration.mjs"],
        cwd=ROOT,
        env={**os.environ, "PATH": str(tmp_path) + os.pathsep + os.environ["PATH"]},
        capture_output=True,
        text=True,
        timeout=20,
    )
    assert result.returncode != 0
    commands = [json.loads(line) for line in calls.read_text().splitlines()]
    provider_checks = [cmd for cmd in commands if "-c" in cmd]
    if retained_current_build:
        assert "Verified Compose fixture image: " + current in result.stdout
        assert "not checkout freshness" in result.stdout
        assert "Refusing workflow tests against a real-provider container" in result.stderr
        assert len(provider_checks) == 1
    else:
        assert "differs from the current Compose fixture image" in result.stderr
        assert not provider_checks
    assert not any("node_modules/@playwright/test/cli.js" in cmd for cmd in commands)
