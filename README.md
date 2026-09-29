# ChatHermes

A Vue PWA for browsing and chatting in Hermes sessions. The browser connects directly to each configured Hermes API endpoint with that profile’s bearer key.

## Run locally

```sh
npm ci
npm run dev
```

Open the Vite URL, select **Manage connections**, and add a label, Hermes base URL, and API key. Use `http://localhost:8642/` for a local API or `https://hermes.example.com/p/personal/` for a remote shared multiplexer profile. Build a static deployment with `npm run build` and serve `dist/` from a trusted single-user origin with SPA fallback for `/p/...` routes.

The Hermes API must allow your ChatHermes origin through CORS, including `Authorization`, `Content-Type`, GET, POST, and PATCH. The installed Hermes gateway's preflight omits PATCH, so browser rename needs an upstream CORS change or a trusted reverse proxy. SSE uses fetch with bearer authorization. See [deployment](docs/deployment.md) for setup and security limits, and [API contract](docs/api-contract.md) for live verification status.

Profiles and keys are stored in browser `localStorage`. Anyone with access to this browser profile or script execution on this origin can read them. Use a trusted single-user origin and device. ChatHermes does not cache API responses; its service worker caches the static shell only. Offline messaging is unavailable.
