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
  'network inspect '*) exit 1 ;;
esac
exit 0
''')
            curl = root / 'curl'
            curl.write_text('#!/bin/sh\nexit 0\n')
            docker.chmod(0o755)
            curl.chmod(0o755)
            extra_environment = {key: value for key, value in environment.items() if key != 'inspect_config'}
            inspect_config = environment.get('inspect_config', False)
            env = {**os.environ, 'PATH': f'{root}:{os.environ["PATH"]}',
                   'CALLS': str(root / 'calls'), 'DOCKER_HOST': 'tcp://docker:2375',
                   'TMPDIR': str(root),
                   'CHATHERMES_BIND_ADDRESS': '127.0.0.1',
                   'CHATHERMES_DASHBOARD_PORT': '9119',
                   'LLM_API_KEY': '', 'LLM_API_BASE_URL': '', 'LLM_API_MODEL': '',
                   'EXPECTED_HOST': 'tcp://172.25.0.2:2375', 'CHATHERMES_INSTANCE': 'test', **extra_environment}
            result = subprocess.run(['sh', str(RUNNER), mode], env=env, capture_output=True, text=True)
            config_path = next(root.glob('chathermes-test-config-*.yaml'), None) if inspect_config else None
            config = config_path.read_text() if config_path else ''
            calls = (root / 'calls').read_text() if (root / 'calls').exists() else ''
            return result, calls, config

    def test_fixture_builds_current_checkout_and_keeps_services_private(self):
        result, calls, _ = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('docker endpoint tcp://172.25.0.2:2375', result.stderr.lower())
        self.assertIn('build -f tests/docker/Dockerfile -t chathermes-test:3632f917 .', calls)
        self.assertIn('-p 127.0.0.1:9119:9119', calls)
        self.assertIn('-v chathermes-test-hermes-data:/opt/data', calls)
        self.assertIn('--network-alias model', calls)
        self.assertNotIn(':8642', calls)
        self.assertNotIn(':4000', calls)

    def test_remote_scoped_port_and_secret_inheritance(self):
        result, calls, _ = self.run_launcher('real', CHATHERMES_BIND_ADDRESS='172.25.0.2',
                                         CHATHERMES_DASHBOARD_PORT='9121',
                                         LLM_API_KEY='synthetic-secret', LLM_API_BASE_URL='http://provider/v1',
                                         LLM_API_MODEL='custom-model')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('-p 172.25.0.2:9121:9119', calls)
        self.assertIn('-e LLM_API_KEY -e LLM_API_BASE_URL -e LLM_API_MODEL', calls)
        self.assertNotIn('synthetic-secret', calls + result.stdout + result.stderr)
        self.assertNotIn('run -d --name chathermes-test-model', calls)

    def test_real_mode_forwards_generic_provider_settings_without_values(self):
        result, calls, _ = self.run_launcher('real',
                                         LLM_API_KEY='synthetic-secret',
                                         LLM_API_BASE_URL='http://provider/v1',
                                         LLM_API_MODEL='custom-model')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('-e LLM_API_KEY -e LLM_API_BASE_URL -e LLM_API_MODEL', calls)
        self.assertNotIn('synthetic-secret', calls + result.stdout + result.stderr)
        self.assertNotIn('http://provider/v1', calls + result.stdout + result.stderr)
        self.assertNotIn('custom-model', calls + result.stdout + result.stderr)

    def test_real_mode_resolves_model_in_temporary_runtime_config(self):
        result, _, config = self.run_launcher('real', inspect_config=True,
                                             LLM_API_KEY='synthetic-secret',
                                             LLM_API_BASE_URL='http://provider/v1',
                                             LLM_API_MODEL='provider/model-v3')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('default: "provider/model-v3"', config)
        self.assertNotIn('${LLM_API_MODEL', config)

    def test_real_mode_rejects_unsafe_model_ids_before_build(self):
        result, calls, _ = self.run_launcher('real', LLM_API_KEY='key',
                                             LLM_API_BASE_URL='http://provider/v1',
                                             LLM_API_MODEL='model\nplugins:')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('LLM_API_MODEL may contain only', result.stderr)

    def test_fixture_mode_uses_safe_fixed_settings_even_if_host_has_llm_values(self):
        result, calls, _ = self.run_launcher(LLM_API_KEY='host-secret',
                                         LLM_API_BASE_URL='http://host-provider/v1',
                                         LLM_API_MODEL='private-model')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn('host-secret', calls + result.stdout + result.stderr)
        self.assertNotIn('host-provider', calls + result.stdout + result.stderr)
        self.assertNotIn('private-model', calls + result.stdout + result.stderr)

    def test_fixture_does_not_expose_provider_credentials(self):
        result, calls, _ = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn('synthetic-secret', calls + result.stdout + result.stderr)

    def test_instance_name_scopes_containers_network_and_volume(self):
        result, calls, _ = self.run_launcher(CHATHERMES_INSTANCE='issue30')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('network inspect chathermes-issue30', calls)
        self.assertIn('--name chathermes-issue30-hermes', calls)
        self.assertIn('--name chathermes-issue30-model', calls)
        self.assertIn('-v chathermes-issue30-hermes-data:/opt/data', calls)

    def test_invalid_instance_name_fails_before_docker_mutations(self):
        result, calls, _ = self.run_launcher(CHATHERMES_INSTANCE='../unsafe')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, 'info\n')

    def test_unavailable_daemon_fails_before_mutations(self):
        result, calls, _ = self.run_launcher(INFO_EXIT='1')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, 'info\n')

    def test_invalid_scope_and_missing_real_credentials_fail_before_build(self):
        for environment in ({'CHATHERMES_BIND_ADDRESS': '0.0.0.0'},
                            {'CHATHERMES_BIND_ADDRESS': '999.2.3.4'},
                            {'CHATHERMES_BIND_ADDRESS': '1.2.3'},
                            {'CHATHERMES_DASHBOARD_PORT': '65536'}, {},
                            {'LLM_API_KEY': 'key', 'LLM_API_BASE_URL': 'http://provider/v1'},
                            {'LLM_API_KEY': 'key', 'LLM_API_MODEL': 'model'},
                            {'LLM_API_BASE_URL': 'http://provider/v1', 'LLM_API_MODEL': 'model'}):
            result, calls, _ = self.run_launcher('real', **environment)
            self.assertNotEqual(result.returncode, 0)
            self.assertNotIn('build ', calls)

    def test_stop_preserves_volume_and_other_containers(self):
        result, calls, _ = self.run_launcher('stop')
        self.assertEqual(result.returncode, 0)
        self.assertIn('container inspect chathermes-test-hermes', calls)
        self.assertIn('container inspect chathermes-test-model', calls)
        self.assertNotIn('volume ', calls)
        self.assertNotIn('chathermes-gateway', calls)

    def test_quoted_environment_endpoint_and_explicit_endpoint(self):
        result, _, _ = self.run_launcher('stop', DOCKER_HOST='"tcp://docker:2375"')
        self.assertEqual(result.returncode, 0, result.stderr)
        result, _, _ = self.run_launcher('stop', DOCKER_HOST='unix:///test/docker.sock',
                                      EXPECTED_HOST='unix:///test/docker.sock')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn('Using documented Docker endpoint', result.stderr)
