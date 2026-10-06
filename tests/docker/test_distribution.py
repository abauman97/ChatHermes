"""Ensure the copy-only path ships the same installable dependency declaration."""
from pathlib import Path
import subprocess
import tempfile
import tomllib
import unittest

ROOT = Path(__file__).resolve().parents[2]


class DistributionTests(unittest.TestCase):
    def test_local_install_ships_dependency_package_and_warns_about_runtime(self):
        with tempfile.TemporaryDirectory() as directory:
            result = subprocess.run(['node', 'scripts/install-plugin.mjs', directory], cwd=ROOT,
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            installed = Path(directory) / 'chathermes'
            declaration = tomllib.loads((installed / 'pyproject.toml').read_text())
            self.assertIn('pywebpush==2.5.0', declaration['project']['dependencies'])
            self.assertIn('py-vapid==1.9.4', declaration['project']['dependencies'])
            self.assertTrue((installed / 'dashboard' / 'push_sender.py').is_file())
            self.assertIn('does not install Python dependencies', result.stdout)
            self.assertIn('uv pip install --python', result.stdout)
            self.assertIn(str(installed), result.stdout)
