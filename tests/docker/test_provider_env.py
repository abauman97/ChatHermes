"""Test dotenv parsing with synthetic credentials and disposable files."""
import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("provider_env", Path(__file__).with_name("provider_env.py"))
start = importlib.util.module_from_spec(spec)
spec.loader.exec_module(start)


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


class ProviderLaunchTest(unittest.TestCase):
    def test_dotenv_settings_reach_legacy_runtime_without_shell_evaluation(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / ".env").write_text(
                'TEST_LLM_API_BASE_URL=https://provider.example/v1\n'
                "TEST_LLM_API_KEY='literal-$(touch sentinel)'\n"
                'TEST_LLM_API_MODEL=dotenv-model\n'
            )
            previous = Path.cwd()
            self.addCleanup(os.chdir, previous)
            os.chdir(root)
            with patch.dict(os.environ, {"TEST_LLM_API_MODEL": "exported-model"}, clear=True), \
                    patch.object(start.sys, "argv", ["provider_env.py", "real"]), \
                    patch.object(start.os, "execvp") as execute:
                start.launch()
                self.assertEqual(os.environ["LLM_API_BASE_URL"], "https://provider.example/v1")
                self.assertEqual(os.environ["LLM_API_KEY"], "literal-$(touch sentinel)")
                self.assertEqual(os.environ["LLM_API_MODEL"], "exported-model")
                execute.assert_called_once_with("sh", ["sh", "tests/docker/run.sh", "real"])
            self.assertFalse((root / "sentinel").exists())
