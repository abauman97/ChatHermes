# ChatHermes

A chat UI for Hermes Agent sessions. The primary path is a dashboard plugin (cookie auth, no keys in the browser); the same Vue app also runs standalone as a PWA that connects directly to Hermes API endpoints with per-profile bearer keys.

## Install as a Hermes dashboard plugin

The repo includes a pre-built dashboard plugin (`plugin/chathermes/`). From a public repo, install it in one command:

```sh
hermes plugins install abauman97/ChatHermes#plugin/chathermes --enable
```

Restart the dashboard and a **ChatHermes** tab appears. No keys in the browser: the dashboard's cookie auth gates the tab, and a server-side proxy carries the gateway key (`platforms.api_server.key`) to the gateway. The `httpx` package must be available in the dashboard environment.

To rebuild the plugin assets from source: `npm ci && npm run build:plugin` (output lands in `plugin/chathermes/dashboard/dist/`, which is committed for drop-in installs). To install manually from a clone, use `npm run install:plugin` after the build, then `hermes plugins enable chathermes`.

## Run locally

```sh
npm ci
npm run dev
```

Open the Vite URL, select **Manage connections**, and add a label, Hermes base URL, and API key. Use `http://localhost:8642/` for a local API or `https://hermes.example.com/p/personal/` for a remote shared multiplexer profile. Build a static deployment with `npm run build` and serve `dist/` from a trusted single-user origin with SPA fallback for `/p/...` routes.

The Hermes API must allow your ChatHermes origin through CORS, including `Authorization`, `Content-Type`, GET, POST, and PATCH. The installed Hermes gateway's preflight omits PATCH, so browser rename needs an upstream CORS change or a trusted reverse proxy. SSE uses fetch with bearer authorization. See [deployment](docs/deployment.md) for setup and security limits, and [API contract](docs/api-contract.md) for live verification status.

Profiles and keys are stored in browser `localStorage`. Anyone with access to this browser profile or script execution on this origin can read them. Use a trusted single-user origin and device. ChatHermes does not cache API responses; its service worker caches the static shell only. Offline messaging is unavailable.
