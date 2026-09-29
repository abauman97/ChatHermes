# Local deployment

1. Install Node 26 and run `npm ci && npm run build`.
2. Start one or more Hermes API endpoints bound to loopback, each with a strong, distinct `API_SERVER_KEY` in its private Hermes environment. A shared gateway may expose named profiles under `/p/<profile>/`.
3. Pass `CHATHERMES_PROFILES_JSON` to the ChatHermes server process using a private process environment. See `.env.example` for placeholders. Each entry has `id`, `label`, `url`, and `key`. URLs must be loopback HTTP roots or `/p/<profile>/` prefixes. Do not put these keys in Vite environment variables or browser storage.
4. Run `npm start`. Open `http://127.0.0.1:8787`. The server serves `dist/` and proxies `/api/profiles/{id}/…` to the mapped Hermes endpoint. It binds to loopback only.

For development, run `npm run server:dev` and `npm run dev` in separate terminals. Vite forwards `/api` to the same loopback proxy.

ChatHermes is a single-user local app. Add real authentication, HTTPS, and a deliberate network binding strategy before remote access. The service worker caches the static shell only. It cannot load uncached history or send while offline. The browser never receives Hermes bearer keys; the proxy sends a profile's key only to its configured loopback upstream.

The published session API documents streaming turns, but this build has not been exercised with an authenticated live gateway. Before relying on it, use a disposable session to check list/create/history/stream/rename, named-profile routing, and source-specific continuation rules on the installed Hermes version.

Navigating away aborts the browser stream, but it is not a confirmed Hermes stop request. Check the session or Hermes run status before retrying an uncertain turn. This client does not expose a stop or approval button until the installed gateway's run ID and approval flow can be verified.
