"""Readiness must prove the fixture offers password login, not just HTTP 200."""

import io
import json
import runpy
import unittest
from pathlib import Path
from unittest.mock import patch


class AuthReadinessTest(unittest.TestCase):
    def check(self, providers):
        class Response(io.BytesIO):
            status = 200

        with (
            patch.dict("os.environ", HERMES_DASHBOARD_PORT="9119", API_SERVER_PORT="8642"),
            patch(
                "urllib.request.urlopen",
                side_effect=[Response(json.dumps({"providers": providers}).encode()), Response()],
            ),
        ):
            runpy.run_path(str(Path(__file__).with_name("healthcheck.py")))

    def test_password_provider_is_ready(self):
        self.check([{"name": "basic", "supports_password": True}])

    def test_oauth_only_or_incomplete_basic_is_not_ready(self):
        for providers in (
            [{"name": "nous", "supports_password": False}],
            [{"name": "basic", "supports_password": False}],
            [],
        ):
            with self.subTest(providers=providers), self.assertRaises(SystemExit) as error:
                self.check(providers)
            self.assertEqual(error.exception.code, 1)
