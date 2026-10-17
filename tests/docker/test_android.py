"""Exercise the shell launcher with a fake Docker daemon and PWA installer."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

RUNNER = Path(__file__).with_name("android.sh").resolve()


class AndroidLauncherTest(unittest.TestCase):
    def test_browser_target_recovery(self):
        result = subprocess.run(
            ["node", "--test", str(RUNNER.with_name("android-browser.test.mjs")),
             str(RUNNER.with_name("android-pwa.test.mjs"))],
            capture_output=True, text=True, timeout=15,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def run_launcher(self, mode="start", **overrides):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docker = root / "docker"
            docker.write_text('''#!/bin/sh
printf '%s\\n' "$*" >> "$CALLS"
case "$*" in
  info) exit "$DAEMON_EXIT" ;;
  'container inspect '*) [ "$EXISTING" = 1 ] || [ -f "$STARTED" ]; exit $? ;;
  'inspect -f '*chathermes.android.instance*)
    if [ "$EXISTING" = 1 ] || [ -f "$STARTED" ]; then echo "$OWNER"; fi ;;
  'inspect -f '*chathermes.live.instance*) echo "$HERMES_OWNER" ;;
  'inspect -f '*State.Health.Status*) echo "$HEALTH" ;;
  'inspect -f '*NetworkSettings*) echo '172.17.0.2' ;;
  'inspect -f '*Mounts*) echo "$MOUNTS" ;;
  'inspect -f '*'.Id'*) echo "$CURRENT_ID" ;;
  'inspect -f '*State.Running*) echo false ;;
  'run -d '*) touch "$STARTED"; echo launched-device-id; exit "$RUN_EXIT" ;;
  'exec '*getprop*) echo "$BOOT" ;;
esac
''')
            docker.chmod(0o755)
            node = root / "node"
            node.write_text('#!/bin/sh\nprintf "node %s\\n" "$*" >> "$CALLS"\nexit "$INSTALL_EXIT"\n')
            node.chmod(0o755)
            env = {
                **os.environ, "PATH": f'{root}:{os.environ["PATH"]}',
                "CALLS": str(root / "calls"), "STARTED": str(root / "started"),
                "CHATHERMES_INSTANCE": "test", "EXISTING": "0", "OWNER": "test",
                "HERMES_OWNER": "test", "HEALTH": "healthy", "MOUNTS": "0",
                "BOOT": "1", "CURRENT_ID": "launched-device-id", "RUN_EXIT": "0", "INSTALL_EXIT": "0", "DAEMON_EXIT": "0",
                "CHATHERMES_ANDROID_VNC_PORT": "6080", "CHATHERMES_ANDROID_CDP_PORT": "9223",
                **overrides,
            }
            result = subprocess.run(["sh", str(RUNNER), mode], env=env,
                                    capture_output=True, text=True, timeout=10)
            return result, (root / "calls").read_text() if (root / "calls").exists() else ""

    def test_device_is_ephemeral_and_routes_android_localhost_to_hermes(self):
        result, calls = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("run -d --rm --name chathermes-test-android", calls)
        self.assertIn("--device /dev/kvm --shm-size 2g --log-driver none", calls)
        self.assertIn("-p 127.0.0.1:6080:6080 -p 127.0.0.1:9223:9222", calls)
        self.assertIn("budtmo/docker-android:emulator_14.0", calls)
        self.assertIn("adb reverse tcp:9119 tcp:9119", calls)
        self.assertIn("9119 172.17.0.2 9119", calls)
        self.assertIn("node tests/docker/android-install.mjs chathermes-test-android 9223", calls)
        for option in (" -v ", "--volume", "--mount", "--privileged", "build ", "rm -f"):
            self.assertNotIn(option, calls)
        self.assertIn("Android PWA ready", result.stdout)

    def test_install_run_mount_and_boot_failures_remove_only_device(self):
        for failure in ({"INSTALL_EXIT": "1"}, {"RUN_EXIT": "1"}, {"MOUNTS": "1"}, {"BOOT": "0"}):
            with self.subTest(failure=failure):
                result, calls = self.run_launcher(**failure)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("rm -f -v chathermes-test-android", calls)
                self.assertNotIn("rm -f -v chathermes-test-hermes", calls)
                self.assertNotIn("Android PWA ready", result.stdout)

    def test_foreign_container_is_preserved_on_launch_and_stop(self):
        for mode in ("start", "stop"):
            with self.subTest(mode=mode):
                result, calls = self.run_launcher(mode, EXISTING="1", OWNER="another")
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn("rm -f", calls)
                self.assertNotIn("run -d", calls)

    def test_stop_does_not_require_hermes_or_provider_settings(self):
        result, calls = self.run_launcher("stop", EXISTING="1", HERMES_OWNER="", HEALTH="")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("rm -f -v chathermes-test-android", calls)
        self.assertNotIn("chathermes.live.instance", calls)

    def test_invalid_options_and_unavailable_hermes_fail_before_mutations(self):
        for failure in ({"CHATHERMES_INSTANCE": "../foreign"},
                        {"CHATHERMES_ANDROID_VNC_PORT": "0"},
                        {"CHATHERMES_ANDROID_VNC_PORT": "65536"},
                        {"CHATHERMES_ANDROID_VNC_PORT": "bad"},
                        {"CHATHERMES_ANDROID_CDP_PORT": "6080"},
                        {"HERMES_OWNER": "foreign"}, {"HEALTH": "starting"},
                        {"DAEMON_EXIT": "1"}):
            with self.subTest(failure=failure):
                result, calls = self.run_launcher(**failure)
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn("rm -f", calls)
                self.assertNotIn("run -d", calls)

    def test_custom_ports_and_instance(self):
        result, calls = self.run_launcher(CHATHERMES_INSTANCE="second", OWNER="second",
                                         HERMES_OWNER="second", CHATHERMES_ANDROID_VNC_PORT="6081",
                                         CHATHERMES_ANDROID_CDP_PORT="9224")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("--name chathermes-second-android", calls)
        self.assertIn("-p 127.0.0.1:6081:6080 -p 127.0.0.1:9224:9222", calls)

    def test_failed_old_launcher_preserves_a_replacement_with_the_same_instance(self):
        result, calls = self.run_launcher(INSTALL_EXIT="1", CURRENT_ID="replacement-device-id")
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn("rm -f", calls)
