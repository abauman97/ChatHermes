"""Check the dashboard and gateway without printing credentials or responses."""
import os
import sys
from urllib.request import urlopen

try:
    for port, path in (
        (os.environ["HERMES_DASHBOARD_PORT"], "/api/auth/providers"),
        (os.environ["API_SERVER_PORT"], "/health"),
    ):
        with urlopen("http://127.0.0.1:" + port + path, timeout=2) as response:
            if response.status != 200:
                sys.exit(1)
except Exception:
    sys.exit(1)
