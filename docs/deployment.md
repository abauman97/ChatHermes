# Dashboard plugin deployment

Install `plugin/chathermes` using Hermes plugins or `npm run install:plugin` from
a clone. Hermes reads the shipped plugin-root `pyproject.toml` when installing
through its CLI; the dashboard JSON manifest does not install Python packages.
`npm run build` rebuilds the committed assets.

`npm run install:plugin` only copies files, including the dependency declaration.
The copy-only script prints the concrete install command for its target path.
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

The plugin is served entirely by the Hermes dashboard. It relies on dashboard authentication for `/api/plugins/chathermes/` and proxies only explicit gateway routes. Set `platforms.api_server.enabled`, `host`, `port`, and a strong `key` in Hermes configuration. The gateway key stays server-side. Install `httpx` in the dashboard Python environment. Use the reviewed native gateway contract and session history API. The browser requires dashboard authentication and host WebSocket tickets; native admission fails closed when these are unavailable.

Use HTTPS when accessing the dashboard remotely. Set the host dashboard's authentication as appropriate to the installation. Do not expose the isolated test environment publicly: its ports bind to loopback, and its fixed API key exists only for local isolated tests.

File uploads are bounded, receive generated filenames, and are written under the selected Hermes profile. The agent must have access to that filesystem to read non-image files. Images use native multipart input with durable authenticated original-file references. Native camera capture is offered on supported devices.

See [PWA and Web Push setup](push-notifications.md) for HTTPS/iOS requirements,
the explicit enable flow, dependency installation, persistent VAPID state,
notification privacy, and troubleshooting.

## Native rollout gate

Keep the checked-in source/archive/base-image pins. `npm run live` builds
`tests/docker/Dockerfile` with instance-scoped services and no Compose dependency. The
shell fixture launcher puts Hermes/model on an internal network and publishes
only the dashboard through an inbound relay. It preserves its dedicated named
volume; optional real-provider mode is explicitly separate. Restart/rebuild
Python route changes; sibling `gateway_transport.py` and `chat_gateway.py` are
copied by the existing whole-plugin installer.

The native socket admits Other and Project chats in bounded native mode. Copy
`native_channel.py` alongside the transport/gateway modules and rebuild assets.
Keep legacy routes for existing run pointers. Never change transport or retry
an uncertain submission. The capability endpoint explicitly marks durable
idempotency, atomic snapshot replay and offline leases unavailable; see the
[API contract](api-contract.md). Viewer recovery follows Hermes's default
20-second orphan grace, with active-work freshness able to defer reaping.
No long-lived owner is created. Socket ticket renewal after 600 seconds does
not extend the upstream offline guarantee. A multi-worker deployment requires
native runtime/socket affinity; proxy-prefix, process-crash and physical iOS
parity remain unverified.
