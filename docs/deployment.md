# Dashboard plugin deployment

Install `plugin/chathermes` using Hermes plugins or `npm run install:plugin` from
a clone. Hermes reads the shipped plugin-root `pyproject.toml` when installing
through its CLI; the dashboard JSON manifest does not install Python packages.
`npm run build` rebuilds the committed assets.

Without options, `npm run install:plugin` only copies files, including the dependency declaration.
The copy-only script prints the concrete install command for its target path.
To copy and provision dependencies together, pass the dashboard's Python
executable explicitly (never an unrelated shell Python):

```sh
npm run install:plugin -- /path/to/hermes-home/plugins --python /absolute/path/to/dashboard/python
```

This installs the shipped `pyproject.toml` with `uv pip --python` (or the
selected Python's `-m pip` when uv is unavailable), then verifies both push
imports in that runtime. Installation or import failure exits nonzero; files
remain copied so the command can be retried. Omitting `--python` retains the
copy-only behavior. No Hermes configuration or running service is changed.

For older Hermes installers without dependency support, or existing installs
missing Web Push, install the shipped dependency package explicitly into
the **same Python runtime that starts the dashboard**, before restarting:

```sh
uv pip install --python /absolute/path/to/hermes/.venv/bin/python ./plugin/chathermes
# If that runtime has pip, this is equivalent:
/absolute/path/to/hermes/.venv/bin/python -m pip install ./plugin/chathermes
/absolute/path/to/hermes/.venv/bin/python -c 'from pywebpush import webpush; from py_vapid import Vapid'
```

Run from the cloned repository; after copy-only installation, the installed
`~/.hermes/plugins/chathermes` directory can replace `./plugin/chathermes`.
Installing into an unrelated shell Python does not repair the dashboard.
No packages are installed on import or through an HTTP request. After restart,
check the authenticated `/api/plugins/chathermes/push/config` route: it must
return `available: true` and a public key. An unavailable result also covers
unwritable or invalid persistent VAPID state; never print the private state file.

The dashboard loads `dashboard/plugin_api.py` into its own Python process;
`dashboard/manifest.json` does not provision dependencies. In the pinned Hermes
test source (`ac28abc96ce83f22f6b831f80d9007e2aba81f21`), CLI dependency consent
is in `hermes_cli/plugins_cmd_install.py`, enable admission prepares the shared
runtime through `hermes_cli/plugins_admission.py`, and backend imports occur in
`hermes_cli/web_server_dashboard.py`. Copying files bypasses that admission.
The build also copies the service worker, manifest and icons after Vite clears
the output directory, so installed plugin distributions retain these assets.

The plugin is served entirely by the Hermes dashboard. It relies on dashboard authentication for `/api/plugins/chathermes/` and proxies only explicit gateway routes. Set `platforms.api_server.enabled`, `host`, `port`, and a strong `key` in Hermes configuration. The gateway key stays server-side. Install `httpx` in the dashboard Python environment. Use the reviewed native gateway contract and session history API. The browser requires dashboard authentication and host WebSocket tickets; native admission fails closed when these are unavailable.

Use HTTPS when accessing the dashboard remotely. Set the host dashboard's authentication as appropriate to the installation. Do not expose the isolated test environment publicly: its ports bind to loopback, and its fixed API key exists only for local isolated tests.

File uploads are bounded, receive generated filenames, and are written under the selected Hermes profile. The agent must have access to that filesystem to read non-image files. Images use native multipart input with durable authenticated original-file references. Native camera capture is offered on supported devices.

See [PWA and Web Push setup](push-notifications.md) for HTTPS/iOS requirements,
the explicit enable flow, dependency installation, persistent VAPID state,
notification privacy, and troubleshooting.

## Native runtime

`npm run live` extends the latest official Hermes release in one disposable
real-provider container, with no bind mounts or personal Hermes state. Set
provider settings in the root `.env` and remove only the owned container and
anonymous volume with `npm run live:stop`.

Deploy the whole plugin directory and rebuild assets after Python or frontend
changes. The native contract targets Hermes 0.22.5 at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. Unsupported contracts fail closed.
Browser and server execution viewers use the same native dashboard gateway.
The server viewer connects over loopback using `HERMES_DASHBOARD_PORT` (9119 by
default) and a delegated single-use dashboard ticket. It must reach the same
native runtime as the browser. Keep native runtime affinity in multi-worker
hosting; do not distribute a live session across independent runtimes.

Persist `state/chathermes-completions.sqlite3` alongside the existing push state.
It contains completion addresses and per-device delivery receipts. Startup retries
pending push deliveries. Active execution retention lasts for the plugin host
process; a host or runtime crash is not a guarantee of execution continuation.
See the [API contract](api-contract.md) for recovery and delivery limits.
