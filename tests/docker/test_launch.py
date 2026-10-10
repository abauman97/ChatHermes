"""Check the disposable launcher using a fake daemon and synthetic settings."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

RUNNER = Path(__file__).with_name("run.sh").resolve()


class DisposableLauncherTest(unittest.TestCase):
    def run_launcher(self, mode="real", **overrides):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docker = root / "docker"
            docker.write_text('''#!/bin/sh
printf '%s\\n' "$*" >> "$CALLS"
case "$*" in
  'container inspect '*) [ "$EXISTING" = 1 ] || [ -f "$STARTED" ]; exit $? ;;
  'inspect -f '*chathermes.live.instance*)
    if [ "$EXISTING" = 1 ] || [ -f "$STARTED" ]; then echo "$OWNER"; fi ;;
  'inspect -f '*State.Health.Status*) echo "$HEALTH" ;;
  'inspect -f '*State.Running*) echo false ;;
  'build '*) exit "$BUILD_EXIT" ;;
  'run -d '*) touch "$STARTED" ;;
esac
''')
            docker.chmod(0o755)
            env = {
                **os.environ, "PATH": f'{root}:{os.environ["PATH"]}',
                "CALLS": str(root / "calls"), "STARTED": str(root / "started"),
                "CHATHERMES_ENV_LOADED": "1", "CHATHERMES_INSTANCE": "test",
                "TEST_LLM_API_KEY": "synthetic-private-key",
                "TEST_LLM_API_BASE_URL": "https://provider.example/v1",
                "TEST_LLM_API_MODEL": "synthetic-model",
                "CHATHERMES_BIND_ADDRESS": "127.0.0.1",
                "CHATHERMES_DASHBOARD_PORT": "9128",
                "EXISTING": "0", "OWNER": "test", "HEALTH": "healthy", "BUILD_EXIT": "0",
                **overrides,
            }
            result = subprocess.run(["sh", str(RUNNER), mode], env=env, capture_output=True, text=True)
            calls = (root / "calls").read_text() if (root / "calls").exists() else ""
            return result, calls

    def test_real_launch_uses_one_disposable_container_and_no_named_resources(self):
        result, calls = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("build --pull -f tests/docker/Dockerfile", calls)
        self.assertIn("run -d --rm --name chathermes-test-hermes", calls)
        self.assertIn("--label chathermes.live.instance=test", calls)
        self.assertIn("-p 127.0.0.1:9128:9119", calls)
        self.assertIn("-e TEST_LLM_API_BASE_URL -e TEST_LLM_API_KEY -e TEST_LLM_API_MODEL", calls)
        self.assertNotIn("synthetic-private-key", calls + result.stdout + result.stderr)
        self.assertNotIn("network ", calls)
        self.assertNotIn("volume ", calls)
        self.assertNotIn("--init", calls)
        self.assertNotIn(" -v ", calls)
        self.assertEqual(calls.count("run -d "), 1)

    def test_foreign_container_is_preserved_on_launch_and_stop(self):
        for mode in ("real", "stop"):
            with self.subTest(mode=mode):
                result, calls = self.run_launcher(mode, EXISTING="1", OWNER="other")
                self.assertNotIn("rm -f", calls)
                self.assertNotIn("build ", calls)
                if mode == "real":
                    self.assertNotEqual(result.returncode, 0)

    def test_stop_removes_only_owned_container_and_anonymous_data(self):
        result, calls = self.run_launcher("stop", EXISTING="1")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("rm -f -v chathermes-test-hermes", calls)
        self.assertNotIn("volume ", calls)
        self.assertNotIn("build ", calls)

    def test_unhealthy_startup_removes_owned_container(self):
        result, calls = self.run_launcher(HEALTH="unhealthy")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("rm -f -v chathermes-test-hermes", calls)
        self.assertNotIn("synthetic-private-key", result.stdout + result.stderr)

    def test_invalid_scope_and_port_fail_before_mutations(self):
        for overrides in ({"CHATHERMES_INSTANCE": "../foreign"}, {"CHATHERMES_DASHBOARD_PORT": "65536"}):
            with self.subTest(overrides=overrides):
                result, calls = self.run_launcher(**overrides)
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn("build ", calls)
                self.assertNotIn("rm -f", calls)
