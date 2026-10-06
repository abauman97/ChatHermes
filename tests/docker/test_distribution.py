"""Verify shipped push assets and explicit dashboard-runtime provisioning."""
from pathlib import Path
import subprocess
import json
import os
import shutil
import sys
import tempfile
import tomllib
import unittest

ROOT = Path(__file__).resolve().parents[2]


class DistributionTests(unittest.TestCase):
    def run_runtime_install(self, directory, *, uv_available=True, install_status=0, import_status=0):
        directory = Path(directory)
        tools = directory / 'runtime tools'
        tools.mkdir()
        calls = directory / 'calls.jsonl'
        # Record argv without a shell so spaces in executable/package paths matter.
        executable = f'''#!{sys.executable}
import json, os, sys
from pathlib import Path
name = Path(sys.argv[0]).name
with open(os.environ['CALLS'], 'a') as out:
    out.write(json.dumps([name, *sys.argv[1:]]) + '\\n')
if name == 'uv' and sys.argv[1:] == ['--version']:
    sys.exit(int(os.environ['UV_STATUS']))
if 'install' in sys.argv[1:]:
    sys.exit(int(os.environ['INSTALL_STATUS']))
if sys.argv[1:] == ['-c', 'from pywebpush import webpush; from py_vapid import Vapid']:
    sys.exit(int(os.environ['IMPORT_STATUS']))
'''
        for name in ('dashboard-python', 'uv'):
            path = tools / name
            path.write_text(executable)
            path.chmod(0o755)
        python = tools / 'dashboard-python'
        target_root = directory / 'plugin files'
        result = subprocess.run([shutil.which('node'), str(ROOT / 'scripts/install-plugin.mjs'),
                                 str(target_root), '--python', str(python)], cwd=directory,
                                env={**os.environ, 'PATH': str(tools), 'CALLS': str(calls),
                                     'UV_STATUS': '0' if uv_available else '1',
                                     'INSTALL_STATUS': str(install_status), 'IMPORT_STATUS': str(import_status)},
                                capture_output=True, text=True)
        return result, [json.loads(line) for line in calls.read_text().splitlines()], python, target_root / 'chathermes'

    def test_provisions_and_checks_explicit_dashboard_runtime(self):
        for uv_available in (True, False):
            with self.subTest(uv=uv_available), tempfile.TemporaryDirectory() as directory:
                result, calls, python, target = self.run_runtime_install(directory, uv_available=uv_available)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue((target / 'pyproject.toml').is_file())
                install = (['uv', 'pip', 'install', '--python', str(python), str(target)] if uv_available
                           else ['dashboard-python', '-m', 'pip', 'install', str(target)])
                self.assertIn(install, calls)
                self.assertEqual(calls[-1], ['dashboard-python', '-c',
                                            'from pywebpush import webpush; from py_vapid import Vapid'])
                self.assertIn(f'Verified push dependencies in {python}', result.stdout)
                self.assertNotIn('copy-only installer', result.stdout)

    def test_runtime_install_and_verification_failures_are_not_reported_as_success(self):
        for install_status, import_status in ((1, 0), (0, 1)):
            with self.subTest(install=install_status), tempfile.TemporaryDirectory() as directory:
                result, calls, _, target = self.run_runtime_install(
                    directory, install_status=install_status, import_status=import_status)
                self.assertNotEqual(result.returncode, 0)
                self.assertTrue((target / 'pyproject.toml').is_file())
                self.assertNotIn('Verified push dependencies', result.stdout)
                self.assertNotIn('restart the dashboard.', result.stdout)
                if install_status:
                    self.assertNotIn('from pywebpush', str(calls))

    def test_invalid_runtime_does_not_copy_plugin(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'plugins'
            result = subprocess.run(['node', 'scripts/install-plugin.mjs', str(target),
                                     '--python', str(Path(directory) / 'missing-python')], cwd=ROOT,
                                    capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse(target.exists())

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
            for asset in ('push-service-worker.js', 'manifest.webmanifest', 'apple-touch-icon.png',
                          'icons/icon-192.png', 'icons/icon-512.png'):
                self.assertEqual((installed / 'dashboard' / 'dist' / asset).read_bytes(),
                                 (ROOT / 'public' / asset).read_bytes())
            self.assertIn('does not install Python dependencies', result.stdout)
            self.assertIn('uv pip install --python', result.stdout)
            self.assertIn(str(installed), result.stdout)
