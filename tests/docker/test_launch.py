"""Check the Compose security boundary without starting containers."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[2]


@unittest.skipUnless(shutil.which("docker"), "Docker CLI is required for Compose validation")
class ComposeBoundaryTest(unittest.TestCase):
    def config(self, project):
        result = subprocess.run(
            ["docker", "compose", "--project-directory", str(ROOT), "-f",
             str(ROOT / "tests/docker/compose.yml"), "--profile", "android", "config", "--format", "json"],
            env={**os.environ, "COMPOSE_PROJECT_NAME": project, "CHATHERMES_BIND_ADDRESS": "127.0.0.1",
                 "CHATHERMES_ANDROID_BIND_ADDRESS": "127.0.0.1",
                 "TEST_LLM_API_KEY": "must-not-enter-deterministic-environment"},
            capture_output=True, text=True, check=True,
        )
        return json.loads(result.stdout)

    def test_deterministic_environment_never_inherits_provider_secrets_or_host_state(self):
        config = self.config("chathermes-boundary-a")
        services = config["services"]
        self.assertEqual(services["mockserver"]["image"], "mockserver/mockserver:9.1.0")
        self.assertNotIn("build", services["mockserver"])
        self.assertNotIn("volumes", services["mockserver"])
        self.assertEqual(services["hermes"]["environment"]["TEST_LLM_API_KEY"], "synthetic-test-only")
        self.assertEqual(services["hermes"]["environment"]["TEST_LLM_API_BASE_URL"], "http://mockserver:1080/v1")
        for service in services.values():
            self.assertNotIn("container_name", service)
            self.assertNotIn("privileged", service)
            self.assertFalse(any(v.get("type") == "bind" for v in service.get("volumes", [])))
        self.assertEqual([p["target"] for p in services["hermes"]["ports"]], [9119])
        self.assertEqual(sorted(p["target"] for p in services["android"]["ports"]), [6080, 9222])
        for service in services.values():
            for port in service.get("ports", []):
                self.assertEqual(port["host_ip"], "127.0.0.1")

    def test_projects_own_distinct_networks_and_no_fixed_container_names(self):
        first, second = self.config("chathermes-boundary-a"), self.config("chathermes-boundary-b")
        self.assertNotEqual(first["networks"]["default"]["name"], second["networks"]["default"]["name"])
        self.assertNotIn("external", first["networks"]["default"])
