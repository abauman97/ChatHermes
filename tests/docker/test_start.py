"""Exercise runtime configuration with disposable paths and synthetic secrets."""
import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import yaml

spec = importlib.util.spec_from_file_location("container_start", Path(__file__).with_name("start.py"))
start = importlib.util.module_from_spec(spec)
spec.loader.exec_module(start)


class RuntimeConfigTest(unittest.TestCase):
    def setUp(self):
        self.yaml_patch = patch.dict("sys.modules", {"hermes_yaml": yaml})
        self.yaml_patch.start()
        self.addCleanup(self.yaml_patch.stop)
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        assets = self.root / "assets"
        (assets / "plugin" / "dashboard").mkdir(parents=True)
        (assets / "plugin" / "dashboard" / "test.js").write_text("plugin")
        (assets / "config.yaml").write_text(Path(__file__).with_name("config.yaml").read_text())
        self.assets = assets
        self.env = {
            "HERMES_HOME": str(self.root / "home"),
            "TEST_LLM_API_BASE_URL": "https://provider.example/v1",
            "TEST_LLM_API_KEY": "synthetic-secret-not-for-yaml",
            "TEST_LLM_API_MODEL": "vendor/model:latest",
            "HERMES_DASHBOARD_PORT": "9120",
            "API_SERVER_PORT": "8643",
            "API_SERVER_HOST": "127.0.0.1",
        }

    def test_runtime_model_and_secret_isolation(self):
        with patch.dict(os.environ, self.env, clear=True):
            start.configure(self.assets)
            home = Path(self.env["HERMES_HOME"])
            config = yaml.safe_load((home / "config.yaml").read_text())
            self.assertEqual(config["model"]["default"], self.env["TEST_LLM_API_MODEL"])
            self.assertEqual(config["providers"]["chathermes-test"]["base_url"], self.env["TEST_LLM_API_BASE_URL"])
            self.assertEqual(config["platforms"]["api_server"]["port"], 8643)
            self.assertFalse(config["gateway"]["multiplex_profiles"])
            self.assertTrue((home / "plugins/chathermes/dashboard/test.js").exists())
            for filename in ("config.yaml", ".env"):
                self.assertNotIn(self.env["TEST_LLM_API_KEY"], (home / filename).read_text())
                self.assertEqual((home / filename).stat().st_mode & 0o777, 0o600)
            key = (home / ".env").read_text()
            self.assertGreaterEqual(len(key.split("=", 1)[1].strip()), 16)
            start.configure(self.assets)
            self.assertEqual((home / ".env").read_text(), key)

    def test_missing_provider_values_fail_before_seeding(self):
        for name in ("TEST_LLM_API_MODEL", "TEST_LLM_API_KEY", "TEST_LLM_API_BASE_URL"):
            env = dict(self.env)
            env.pop(name)
            with self.subTest(name=name), patch.dict(os.environ, env, clear=True):
                with self.assertRaisesRegex(ValueError, name):
                    start.configure(self.assets)
                self.assertFalse(Path(self.env["HERMES_HOME"]).exists())

    def test_invalid_ports_and_credential_urls_fail(self):
        for overrides in (
            {"HERMES_DASHBOARD_PORT": "0"},
            {"API_SERVER_PORT": "65536"},
            {"API_SERVER_PORT": "9120"},
            {"API_SERVER_PORT": "09120"},
            {"TEST_LLM_API_BASE_URL": "https://user:secret@provider.example/v1"},
            {"TEST_LLM_API_BASE_URL": "https://provider.example/v1?key=secret"},
        ):
            with self.subTest(overrides=overrides), patch.dict(os.environ, self.env | overrides, clear=True):
                with self.assertRaises(ValueError):
                    start.configure(self.assets)


class DotEnvTest(unittest.TestCase):
    def test_quoted_values_and_exported_overrides(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".env"
            path.write_bytes(
                b'# Synthetic provider only\r\n'
                b'export TEST_LLM_API_BASE_URL="https://provider.example/v1"\r\n'
                b"TEST_LLM_API_KEY='literal-$(touch sentinel)-$key'\r\n"
                b'TEST_LLM_API_MODEL="vendor/model:latest" # model\r\n'
                b'UNRELATED_SECRET=ignored\r\n'
            )
            for override in (None, "synthetic-exported-override"):
                env = {} if override is None else {"TEST_LLM_API_KEY": override}
                with self.subTest(override=override), patch.dict(os.environ, env, clear=True):
                    start.load_env(path)
                    self.assertEqual(os.environ["TEST_LLM_API_BASE_URL"], "https://provider.example/v1")
                    self.assertEqual(os.environ["TEST_LLM_API_MODEL"], "vendor/model:latest")
                    self.assertEqual(os.environ["TEST_LLM_API_KEY"], override or "literal-$(touch sentinel)-$key")
                    self.assertNotIn("UNRELATED_SECRET", os.environ)
            self.assertFalse((Path(directory) / "sentinel").exists())

    def test_invalid_quotes_fail_without_exposing_value(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".env"
            path.write_text('TEST_LLM_API_KEY="synthetic-private-value')
            with self.assertRaises(ValueError) as error:
                start.load_env(path)
            self.assertNotIn("synthetic-private-value", str(error.exception))
