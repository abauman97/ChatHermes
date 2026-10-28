"""Retain focused browser lifecycle and CDP contract checks."""

import subprocess
import unittest
from pathlib import Path


class AndroidBrowserTest(unittest.TestCase):
    def test_browser_and_installed_window_contracts(self):
        directory = Path(__file__).parent
        result = subprocess.run(
            [
                "node",
                "--test",
                str(directory / "android-browser.test.mjs"),
                str(directory / "android-pwa.test.mjs"),
            ],
            capture_output=True,
            text=True,
            timeout=15,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
