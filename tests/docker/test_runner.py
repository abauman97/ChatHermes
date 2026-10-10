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
  'run -d --init '*) printf '%s' "$CHATHERMES_TEST_CONFIG_B64" > "$CONFIG_CAPTURE" ;;
  info)
    if [ -n "${EXPECTED_HOST:-}" ] && [ "${DOCKER_HOST:-}" != "$EXPECTED_HOST" ]; then exit 1; fi
    exit "${INFO_EXIT:-0}" ;;
  'container inspect '*) [ "${EXISTING_CONTAINER:-}" = 1 ]; exit $? ;;
  'inspect -f '*) echo "${OWNER_LABEL:-foreign}"; exit 0 ;;
  'network inspect --format {{.Internal}} '*) echo "${INTERNAL_NETWORK:-true}"; exit 0 ;;
  'network inspect '*)
    if { [ -n "${EXISTING_NETWORK:-}" ] && [ "$*" = "network inspect $EXISTING_NETWORK" ]; } || [ "$*" = 'network inspect chathermes-test-internal' ] || [ "$*" = 'network inspect chathermes-issue30-internal' ]; then exit 0; fi
    exit 1 ;;
esac
exit 0
''')
            curl = root / 'curl'
            curl.write_text('#!/bin/sh\nprintf "curl %s\\n" "$*" >> "$CALLS"\nexit 0\n')
            docker.chmod(0o755)
            curl.chmod(0o755)
            extra_environment = {key: value for key, value in environment.items() if key != 'inspect_config'}
            inspect_config = environment.get('inspect_config', False)
            expected_host = environment.get('EXPECTED_HOST', 'tcp://172.25.0.2:2375')
            env = {**os.environ, 'PATH': f'{root}:{os.environ["PATH"]}',
                   'CALLS': str(root / 'calls'), 'DOCKER_HOST': 'tcp://docker:2375',
                   'TMPDIR': str(root), 'CONFIG_CAPTURE': str(root / 'config.b64'),
                   'CHATHERMES_BIND_ADDRESS': '0.0.0.0',
                   'CHATHERMES_DAEMON_ADDRESS': '172.25.0.2',
                   'CHATHERMES_DASHBOARD_PORT': '9119',
                   'LLM_API_KEY': '', 'LLM_API_BASE_URL': '', 'LLM_API_MODEL': '',
                   'TEST_LLM_API_KEY': '', 'TEST_LLM_API_BASE_URL': '', 'TEST_LLM_API_MODEL': '',
                   'EXPECTED_HOST': expected_host, 'CHATHERMES_INSTANCE': 'test', **extra_environment}
            result = subprocess.run(['sh', str(RUNNER), mode], env=env, capture_output=True, text=True)
            calls = (root / 'calls').read_text() if (root / 'calls').exists() else ''
            config = ''
            if inspect_config:
                import base64
                captured = root / 'config.b64'
                config = base64.b64decode(captured.read_text()).decode() if captured.exists() else ''
            return result, calls, config

    def test_test_provider_names_override_legacy_runtime_names(self):
        result, calls, config = self.run_launcher('real', inspect_config=True,
            TEST_LLM_API_KEY='synthetic-new-secret', TEST_LLM_API_BASE_URL='https://provider.example/v1',
            TEST_LLM_API_MODEL='new-model', LLM_API_MODEL='legacy-model')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('default: "new-model"', config)
        self.assertNotIn('synthetic-new-secret', calls + result.stdout + result.stderr + config)

    def test_credential_urls_fail_before_docker_mutations(self):
        for url in ('https://user:private@provider.example/v1', 'https://provider.example/v1?key=private'):
            result, calls, _ = self.run_launcher('real', TEST_LLM_API_KEY='synthetic-key',
                TEST_LLM_API_BASE_URL=url, TEST_LLM_API_MODEL='model')
            self.assertNotEqual(result.returncode, 0)
            self.assertNotIn('private', result.stdout + result.stderr)
            self.assertNotIn('build ', calls)
            self.assertNotIn('rm ', calls)

    def test_foreign_containers_are_preserved_on_launch_and_stop(self):
        for mode in ('fixture', 'stop'):
            result, calls, _ = self.run_launcher(mode, EXISTING_CONTAINER='1')
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('unowned container', result.stderr)
            self.assertNotIn('rm ', calls)
            self.assertNotIn('build ', calls)

    def test_owned_containers_can_stop_without_removing_the_volume(self):
        result, calls, _ = self.run_launcher('stop', EXISTING_CONTAINER='1', OWNER_LABEL='test')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('rm -f chathermes-test-hermes', calls)
        self.assertNotIn('volume ', calls)
        self.assertNotIn('rm -f -v', calls)

    def test_fixture_builds_current_checkout_and_keeps_services_private(self):
        result, calls, _ = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('docker endpoint tcp://172.25.0.2:2375', result.stderr.lower())
        self.assertIn('build -f tests/docker/Dockerfile -t chathermes-test:ac28abc9 .', calls)
        self.assertIn('CHATHERMES_RELAY_UPSTREAM=http://hermes:9119', calls)
        self.assertIn('-v chathermes-test-hermes-data:/opt/data', calls)
        self.assertIn('--network-alias model', calls)
        self.assertIn('network inspect --format {{.Internal}} chathermes-test-internal', calls)
        self.assertIn('--name chathermes-test-hermes --network chathermes-test-internal --network-alias hermes', calls)
        self.assertIn('--name chathermes-test-browser --network chathermes-test-browser -p 0.0.0.0:9119:9119', calls)
        self.assertIn('network connect chathermes-test-internal chathermes-test-browser', calls)
        self.assertNotIn(':8642', calls)
        self.assertNotIn(':4000', calls)

    def test_fixture_can_use_only_an_explicitly_internal_shared_network(self):
        result, calls, _ = self.run_launcher(CHATHERMES_INTERNAL_DOCKER_NETWORK='isolated-shared',
                                             EXISTING_NETWORK='isolated-shared')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('network inspect isolated-shared', calls)
        self.assertIn('--name chathermes-test-hermes --network isolated-shared', calls)

    def test_fixture_rejects_untrusted_shared_network(self):
        result, calls, _ = self.run_launcher(CHATHERMES_INTERNAL_DOCKER_NETWORK='isolated-shared',
                                             INTERNAL_NETWORK='false', EXISTING_NETWORK='isolated-shared')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Fixture network must be internal', result.stderr)
        self.assertNotIn('run -d', calls)

    def test_basic_auth_provider_is_explicitly_enabled_for_dashboard_scope(self):
        result, calls, _ = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('HERMES_DASHBOARD_BASIC_AUTH_USERNAME=tester', calls)
        self.assertIn('HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=chathermes-local-test', calls)

    def test_fixture_rejects_existing_network_with_egress(self):
        result, calls, _ = self.run_launcher(INTERNAL_NETWORK='false')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Fixture network must be internal', result.stderr)
        self.assertNotIn('run -d', calls)

    def test_fixture_adds_second_generic_model_only_to_disposable_config(self):
        before = Path('.hermes/config.yaml').read_bytes()
        result, _, config = self.run_launcher(inspect_config=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('fixture-model-2:', config)
        self.assertEqual(Path('.hermes/config.yaml').read_bytes(), before)

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
        self.assertNotIn('build ', calls)
        self.assertNotIn('volume create ', calls)

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
        self.assertIn('--name chathermes-issue30-browser', calls)
        self.assertIn('network inspect --format {{.Internal}} chathermes-issue30-internal', calls)
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
        for environment in ({'CHATHERMES_BIND_ADDRESS': '999.2.3.4'},
                            {'CHATHERMES_BIND_ADDRESS': '1.2.3'},
                            {'CHATHERMES_DASHBOARD_PORT': '65536'}, {},
                            {'LLM_API_KEY': 'key', 'LLM_API_BASE_URL': 'http://provider/v1'},
                            {'LLM_API_KEY': 'key', 'LLM_API_MODEL': 'model'},
                            {'LLM_API_BASE_URL': 'http://provider/v1', 'LLM_API_MODEL': 'model'}):
            result, calls, _ = self.run_launcher('real', **environment)
            self.assertNotEqual(result.returncode, 0)
            self.assertNotIn('build ', calls)

    def test_wildcard_publish_uses_docker_host_for_browser_and_readiness(self):
        result, calls, _ = self.run_launcher(CHATHERMES_BIND_ADDRESS='0.0.0.0',
                                             CHATHERMES_DAEMON_ADDRESS='172.25.0.2',
                                             CHATHERMES_DASHBOARD_PORT='9123')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('-p 0.0.0.0:9123:9119', calls)
        self.assertIn('curl --noproxy * --connect-timeout 2 --max-time 5 -fsS http://172.25.0.2:9123/api/auth/providers', calls)
        self.assertIn('http://172.25.0.2:9123/chathermes', result.stdout)

    def test_local_daemon_can_select_loopback_url_and_publish_scope(self):
        result, calls, _ = self.run_launcher(CHATHERMES_BIND_ADDRESS='127.0.0.1',
                                             CHATHERMES_DASHBOARD_URL_HOST='127.0.0.1')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('-p 127.0.0.1:9119:9119', calls)
        self.assertIn('curl --noproxy * --connect-timeout 2 --max-time 5 -fsS http://127.0.0.1:9119/api/auth/providers', calls)

    def test_wildcard_bind_requires_reachable_daemon_url_address(self):
        result, calls, _ = self.run_launcher(CHATHERMES_BIND_ADDRESS='0.0.0.0',
                                             CHATHERMES_DAEMON_ADDRESS='docker')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Set CHATHERMES_DAEMON_ADDRESS', result.stderr)
        self.assertNotIn('build ', calls)

    def test_stop_preserves_volume_and_other_containers(self):
        result, calls, _ = self.run_launcher('stop')
        self.assertEqual(result.returncode, 0)
        self.assertIn('container inspect chathermes-test-hermes', calls)
        self.assertIn('container inspect chathermes-test-model', calls)
        self.assertIn('container inspect chathermes-test-browser', calls)
        self.assertNotIn('volume ', calls)
        self.assertNotIn('chathermes-gateway', calls)

    def test_quoted_environment_endpoint_and_explicit_endpoint(self):
        result, _, _ = self.run_launcher('stop', DOCKER_HOST='"tcp://docker:2375"')
        self.assertEqual(result.returncode, 0, result.stderr)
        result, _, _ = self.run_launcher('stop', DOCKER_HOST='unix:///test/docker.sock',
                                      EXPECTED_HOST='unix:///test/docker.sock')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn('Using documented Docker endpoint', result.stderr)


class NativeRunnerGuards(unittest.TestCase):
    def run_native(self, image='chathermes-test:ac28abc9', mount='volume:chathermes-ptuigateway-hermes-data', real='0', instance='ptuigateway'):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docker = root / 'docker'
            docker.write_text('''#!/bin/sh
printf '%s\\n' "$*" >> "$CALLS"
case "$*" in
  *Config.Image*) printf '%s\\n' "$TEST_IMAGE" ;;
  *Mounts*) printf '%s\\n' "$TEST_MOUNT" ;;
  *Config.Env*) printf 'CHATHERMES_TEST_REAL=%s\\n' "$TEST_REAL" ;;
esac
''')
            docker.chmod(0o755)
            npx = root / 'npx'
            npx.write_text('#!/bin/sh\nprintf "browser-probe\\n" >> "$CALLS"\n')
            npx.chmod(0o755)
            env = {**os.environ, 'PATH': f'{root}:{os.environ["PATH"]}', 'CALLS': str(root / 'calls'),
                   'TEST_IMAGE': image, 'TEST_MOUNT': mount, 'TEST_REAL': real,
                   'CHATHERMES_INSTANCE': instance}
            result = subprocess.run(['sh', str(RUNNER.with_name('native-tests.sh'))], env=env, capture_output=True, text=True)
            calls = (root / 'calls').read_text() if (root / 'calls').exists() else ''
            return result, calls

    def test_refuses_foreign_image_volume_and_real_provider_before_probes(self):
        for environment in ({'image': 'production:latest'}, {'mount': 'bind:/personal/hermes'},
                            {'mount': 'volume:chathermes-other-hermes-data'}, {'real': '1'}):
            result, calls = self.run_native(**environment)
            self.assertNotEqual(result.returncode, 0)
            self.assertNotIn('exec ', calls)
            self.assertNotIn('cp ', calls)
            self.assertNotIn('browser-probe', calls)

    def test_scoped_fixture_is_the_only_probe_target(self):
        result, calls = self.run_native()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('exec -w /opt/hermes chathermes-ptuigateway-hermes', calls)
        self.assertIn('exec -u hermes', calls)
        self.assertIn('browser-probe', calls)
        self.assertNotIn('chathermes-test-hermes', calls)

    def test_invalid_instance_cannot_reach_docker(self):
        result, calls = self.run_native(instance='../personal')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, '')
