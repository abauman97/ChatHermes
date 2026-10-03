"""Exercise the launcher without a daemon or real credentials."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

RUNNER = Path(__file__).with_name('run.sh').resolve()


class RunnerTests(unittest.TestCase):
    def run_launcher(self, mode='fixture', **environment):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docker = root / 'docker'
            docker.write_text('''#!/bin/sh
printf '%s\\n' "$*" >> "$CALLS"
case "$*" in
  info)
    if [ -n "${EXPECTED_HOST:-}" ] && [ "${DOCKER_HOST:-}" != "$EXPECTED_HOST" ]; then exit 1; fi
    exit "${INFO_EXIT:-0}" ;;
  'container inspect '*) exit 1 ;;
esac
exit 0
''')
            curl = root / 'curl'
            curl.write_text('#!/bin/sh\nexit 0\n')
            docker.chmod(0o755)
            curl.chmod(0o755)
            env = {**os.environ, 'PATH': f'{root}:{os.environ["PATH"]}',
                   'CALLS': str(root / 'calls'), 'DOCKER_HOST': 'tcp://docker:2375',
                   'CHATHERMES_BIND_ADDRESS': '127.0.0.1',
                   'CHATHERMES_DASHBOARD_PORT': '9119', 'CHATHERMES_TEST_URL': 'http://127.0.0.1:9119',
                   'LITELLM_API_KEY': '', 'LITELLM_BASE_URL': '',
                   'EXPECTED_HOST': 'tcp://172.25.0.2:2375', **environment}
            result = subprocess.run(['sh', str(RUNNER), mode], env=env, capture_output=True, text=True)
            return result, (root / 'calls').read_text() if (root / 'calls').exists() else ''

    def test_fixture_builds_current_checkout_and_keeps_services_private(self):
        result, calls = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('docker endpoint tcp://172.25.0.2:2375', result.stderr.lower())
        self.assertIn('build -f tests/docker/Dockerfile -t chathermes-test:3632f917 .', calls)
        self.assertIn('-p 127.0.0.1:9119:9119', calls)
        self.assertIn('-v chathermes-test-hermes-test-data:/opt/data', calls)
        self.assertIn('--network-alias model', calls)
        self.assertNotIn(':8642', calls)
        self.assertNotIn(':4000', calls)

    def test_remote_scoped_port_and_secret_inheritance(self):
        result, calls = self.run_launcher('real', CHATHERMES_BIND_ADDRESS='172.25.0.2',
                                         CHATHERMES_DASHBOARD_PORT='9121',
                                         LITELLM_API_KEY='synthetic-secret', LITELLM_BASE_URL='http://provider/v1')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('-p 172.25.0.2:9121:9119', calls)
        self.assertIn('-e LITELLM_API_KEY -e LITELLM_BASE_URL', calls)
        self.assertNotIn('synthetic-secret', calls + result.stdout + result.stderr)
        self.assertNotIn('run -d --name chathermes-test-model', calls)

    def test_unavailable_daemon_fails_before_mutations(self):
        result, calls = self.run_launcher(INFO_EXIT='1')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, 'info\n')

    def test_invalid_scope_and_missing_real_credentials_fail_before_build(self):
        for environment in ({'CHATHERMES_BIND_ADDRESS': '0.0.0.0'},
                            {'CHATHERMES_DASHBOARD_PORT': '65536'}, {}):
            result, calls = self.run_launcher('real', **environment)
            self.assertNotEqual(result.returncode, 0)
            self.assertNotIn('build ', calls)

    def test_stop_preserves_volume_and_other_containers(self):
        result, calls = self.run_launcher('stop')
        self.assertEqual(result.returncode, 0)
        self.assertIn('container inspect chathermes-test-hermes', calls)
        self.assertIn('container inspect chathermes-test-model', calls)
        self.assertNotIn('volume ', calls)
        self.assertNotIn('chathermes-gateway', calls)

    def test_quoted_environment_endpoint_and_explicit_endpoint(self):
        result, _ = self.run_launcher('stop', DOCKER_HOST='"tcp://docker:2375"')
        self.assertEqual(result.returncode, 0, result.stderr)
        result, _ = self.run_launcher('stop', DOCKER_HOST='unix:///test/docker.sock',
                                      EXPECTED_HOST='unix:///test/docker.sock')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn('Using documented Docker endpoint', result.stderr)
