# Dashboard plugin deployment

Install `plugin/chathermes` using Hermes plugins or `npm run install:plugin` from a clone. Enable the plugin and restart the dashboard. `npm run build` rebuilds the committed assets.

The plugin is served entirely by the Hermes dashboard. It relies on dashboard authentication for `/api/plugins/chathermes/` and proxies only explicit gateway routes. Set `platforms.api_server.enabled`, `host`, `port`, and a strong `key` in Hermes configuration. The gateway key stays server-side. Install `httpx` in the dashboard Python environment. The gateway must support session chat streaming and model locks for explicit model selection.

Use HTTPS when accessing the dashboard remotely. Set the host dashboard's authentication as appropriate to the installation. Do not expose the compose test environment publicly: its ports bind to loopback, and its fixed API key exists only for local isolated tests.

File uploads are bounded, receive generated filenames, and are written under the selected Hermes profile. The agent must have access to that filesystem to read non-image files. Image content uses the session API's multimodal input. Native camera capture is offered on supported devices.

Standalone SPA and PWA builds are no longer supported.
