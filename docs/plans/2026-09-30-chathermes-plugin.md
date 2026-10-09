# ChatHermes as a Hermes Dashboard Plugin — Implementation Spec

Historical plan: REST Runs chat execution, its drain adapter and chat SSE routes
were removed on 2026-10-09. The current [API contract](../api-contract.md)
supersedes transport and recovery guidance below. Scheduled-job history is retained.
Date: 2026-09-30 · Status: PROPOSED (awaiting approval) · Supersedes: Bearer-key/localStorage auth (PR #1) and the PR #2 standalone-PWA direction for auth.

## 1. Goal

Ship ChatHermes as a **Hermes dashboard plugin** so authentication is exactly what the web
dashboard already uses: the browser's **session cookies** on the dashboard origin. This
eliminates, end to end: per-profile Bearer keys in localStorage, the ProfileManager key
entry, `Authorization` headers, `credentials: 'omit'`, and the CORS/PATCH workaround
documented in `docs/deployment.md`.

## 2. Verified facts about the plugin system (source-verified, 2026-09-30)

All paths relative to `/opt/hermes` unless noted. These are the contract constraints:

1. **Discovery**: dashboard scans `<plugins root>/*/dashboard/manifest.json`. User roots are
   `get_process_hermes_home()/"plugins"` and the default hermes root `"/plugins"`
   (`hermes_cli/web_server_dashboard.py:489-493, 548-579`). For this deployment the developer
   profile root is `/opt/data/profiles/developer/plugins/` (and/or the hermes root's `plugins/`).
2. **Manifest fields** (`_dashboard_plugin_entry`, `web_server_dashboard.py:507-545`):
   `name`, `label`, `description`, `icon`, `version`, `tab.{path,position}`, `entry`
   (default `dist/index.js`), `css`, `api` (must be a **relative path inside the plugin's
   `dashboard/` dir** — absolute/`..` paths are refused).
3. **Static serving**: `GET /dashboard-plugins/{plugin_name}/{file_path}` serves files from the
   plugin's `dashboard/` dir (`web_routers/dashboard_ui.py:383-412`). Unauthenticated by design
   (script/link tags can't send headers), suffix-allowlisted, path-traversal-guarded. **User
   plugins must be enabled** (`plugins.enabled` allowlist) or every asset + API route 404s
   (runtime gate at `web_server.py:607-644`).
4. **Frontend injection**: the SPA (React) fetches `GET /api/dashboard/plugins`, then injects
   `<link href="/dashboard-plugins/{name}/{css}">` and
   `<script src="/dashboard-plugins/{name}/{entry}">` (`web/src/plugins/usePlugins.ts:97-155`).
   The bundle **must call `window.__HERMES_PLUGINS__.register(name, Component)`** where
   `Component` is a **React component**; the host renders it in a tab at `tab.path`
   (`web/src/plugins/registry.ts:64-68, 112-116`, `PluginPage.tsx`).
5. **SDK globals** (`web/src/plugins/registry.ts:112-191`, contract in `web/src/plugins/sdk.d.ts`):
   `window.__HERMES_PLUGIN_SDK__` exposes host `React` + hooks (plugins must **not bundle their
   own React**), `fetchJSON` / `authedFetch` (host auth handling for `/api/*`), `buildWsUrl`,
   UI components, `useI18n`. `sdkVersion` 1.1.0.
6. **API router**: the `api` file must define `router = APIRouter()`; the host imports it and
   mounts it at **`/api/plugins/{name}/`** (`web_server_dashboard.py:854-872`).
7. **Auth on the API mount**: every non-public `/api/*` route — including plugin routes — passes
   `gated_auth_middleware` (dashboard **session cookie**: `hermes_session_at` / `hermes_session_rt` /
   `hermes_session_provider`, HttpOnly, `SameSite=Lax`) and `auth_middleware`
   (`web_server.py:648-677`). **No extra auth code is needed in the plugin.** Unauthenticated
   JSON requests get structured 401s (HTML gets a redirect to `/login`).
8. **Chat transport**: the dashboard (FastAPI) has **no HTTP SSE chat** — its chat is
   WebSocket-only (`/api/ws` → `tui_gateway`, `/api/console`, `/api/pty`; `web_routers/chat_ws.py`).
   The **gateway** (aiohttp, separate origin; default `127.0.0.1:8642`, key from
   `platforms.api_server.key` or `API_SERVER_KEY` env; `gateway/platforms/api_server.py:220-235,1193`)
   is **Bearer-only** (`_check_auth`, line 1444-1462) and is what the current ChatHermes client
   already speaks: `/v1/capabilities`, `/api/sessions*`, `/api/sessions/{id}/chat/stream` (SSE),
   `/v1/runs/{run}/stop`. It also supports per-profile prefixing `/p/<profile>/...`
   (`_make_profile_prefix_middleware`, line 1578-1601).

**Consequence**: the browser (same-origin, cookie-authenticated) cannot talk Bearer to the
gateway, so the Bearer key must live **server-side in the plugin API**, which proxies to the
gateway. The browser never sees or stores a key.

## 3. Architecture

```
Browser (dashboard origin, logged in via session cookies)
  └─ ChatHermes tab (React wrapper → Vue app, Tailwind v4, unchanged UI)
       │  same-origin fetch, credentials: same-origin (cookies automatic)
       ▼
  /api/plugins/chathermes/...            ← plugin FastAPI router (cookie-gated by host)
       │  injects Authorization: Bearer <key from server config>
       │  optional /p/<profile>/ prefix (profile from query param)
       ▼
  Hermes gateway 127.0.0.1:8642  (v1 + api endpoints, SSE chat/stream)
```

Design choice: the plugin API **proxies the gateway endpoints 1:1** (the contract the Vue
client already works against, verified in visual tests) rather than re-pointing the client at
the dashboard's own `/api/sessions` (different implementation, unverified response shapes).
Using the dashboard's native session endpoints in-browser is a documented follow-up (§9), not
part of this change.

## 4. Repository layout (new)

```
plugin/chathermes/dashboard/
  manifest.json          # name "chathermes", tab {path: "/chathermes"}, entry "dist/index.js",
                         # css "dist/style.css", api "plugin_api.py"
  plugin_api.py          # FastAPI router (see §6)
  dist/                  # BUILT OUTPUT, committed (matches kanban plugin convention:
    index.js               #   plugins/kanban/dashboard ships committed dist/)
    style.css
    assets/...
  package.json           # (optional) — build scripts live in the repo root, see §7
scripts/
  build-plugin.mjs       # vite build → plugin/chathermes/dashboard/dist/ (relative base)
  install-plugin.mjs     # copy plugin/chathermes/ → <hermes plugins root>/chathermes/
                         # + print the plugins.enabled snippet
tests/
  plugin_api.test.py     # pytest for the proxy (httpx MockTransport fake gateway)
```

Existing repo: `src/` (Vue app, mostly unchanged), `docs/`, `tests/` (vitest).

## 5. Frontend changes (Vue side)

1. **Entry bridge** — new Vite entry (separate lib-mode build, IIFE/ES, `base: './'` so asset
   URLs resolve under `/dashboard-plugins/chathermes/dist/`):
   - Reads `window.__HERMES_PLUGIN_SDK__` (host React + hooks) — does **not** bundle React.
   - Defines a tiny React function component: on mount, `createApp(ChatHermesApp).mount(el)`
     into a div ref; on unmount, `app.unmount()`.
   - Calls `window.__HERMES_PLUGINS__.register('chathermes', Component)` at load.
2. **`src/lib/hermes-api.ts`** — remove `endpoint()` Bearer construction, `credentials: 'omit'`,
   and per-profile key lookups. All calls become relative same-origin:
   `/api/plugins/chathermes/v1/capabilities`, `/api/plugins/chathermes/api/sessions?...`,
   `/api/plugins/chathermes/api/sessions/{id}/chat/stream`, etc. Optional `?profile=<name>`
   query param where profile scoping applies (sidebar/profile picker). Default = no profile
   (the dashboard's active profile).
3. **Profile model** — delete `src/lib/profiles.ts`, `src/components/ProfileManager.vue`,
   `src/components/ProfileSwitcher.vue` (key storage + manager are obsolete). Replace with a
   lightweight free-text profile field in the sidebar footer (default: current profile, blank
   allowed). No stored credentials anywhere.
4. **PWA removal** — drop `VitePWA` from `vite.config.ts`, the service-worker registration /
   `src/pwa.d.ts`, and `src/components/UpdatePrompt.vue`. It is a dashboard tab, not an
   installable app.
5. **`src/main.ts`** — export the `App` creation for the bridge; remove the standalone
   `createApp(App).mount('#app')` auto-mount (the React wrapper owns mounting).
6. **Keep** (unchanged): all chat UI, Tailwind v4 styling, dark mode (system preference — see
   §9 re: host theme), SSE parser (`src/lib/sse.ts`), send-button/drawer/label work from PR #2.
7. **Tests** — update `src/App.test.ts`, `src/components/ChatComposer.test.ts`,
   `src/lib/hermes-api.test.ts`, `src/lib/sse.test.ts` to the new relative-URL shape (mock
   `fetch` on `/api/plugins/chathermes/...`). Delete `ProfileManager.test.ts` (component gone).
   Do **not** weaken remaining assertions.

## 6. `plugin_api.py` (server-side)

- `router = APIRouter()`; no auth code (host middleware handles cookie gate).
- Gateway base + key resolved **server-side, per request**: `platforms.api_server.host/port`
  from config (fallback env `API_SERVER_HOST`/`API_SERVER_PORT`, defaults `127.0.0.1:8642`) and
  key from `platforms.api_server.key` (fallback env `API_SERVER_KEY`). **Never log, return, or
  embed the key in responses.**
- Endpoints (all proxy to the gateway, injecting `Authorization: Bearer <key>`; `profile`
  query param → `/p/<profile>/` prefix, validated `^[A-Za-z0-9][A-Za-z0-9_-]*$` to prevent path
  injection; forwarded params pass through):
  | Plugin route                                                        | Gateway route               |
  | ------------------------------------------------------------------- | --------------------------- |
  | `GET /capabilities`                                                 | `GET /v1/capabilities`      |
  | `GET /sessions` (limit, offset)                                     | `GET /api/sessions`         |
  | `POST /sessions`                                                    | `POST /api/sessions`        |
  | `GET /sessions/{id}`                                                | `GET /api/sessions/{id}`    |
  | `PATCH /sessions/{id}` (rename)                                     | `PATCH /api/sessions/{id}`  |
  | `DELETE /sessions/{id}`                                             | `DELETE /api/sessions/{id}` |
  | `GET /sessions/{id}/messages` (limit, offset, order, inline_images) | same                        |
  | `POST /sessions/{id}/chat/stream`                                   | same — **SSE passthrough**  |
  | `POST /runs/{run}/stop`                                             | `POST /v1/runs/{run}/stop`  |
- SSE passthrough: `httpx.AsyncClient.stream()` → FastAPI `StreamingResponse(media_type='text/event-stream')`,
  line-by-line; close upstream when the client disconnects. Verify `httpx` is importable in the
  dashboard process (it is used across Hermes); if it is ever missing, raise a clear 503 with an
  install hint rather than a stack trace.
- Error mapping: gateway 401/403 (key unset/rotated) → `503` `{"detail": "Hermes gateway
  authentication failed; check platforms.api_server.key"}` (no key material). Gateway
  unreachable → `502`. Everything else passes through status + body.

## 7. Build & install

- `npm run build:plugin`: Vite lib-mode build (two outputs: the app bundle + the entry bridge),
  **`base: './'`** (critical — absolute `/assets/` URLs would 404 under
  `/dashboard-plugins/...`), Tailwind v4 via `@tailwindcss/vite` (already in PR #2), output to
  `plugin/chathermes/dashboard/dist/` (`index.js`, `style.css`, `assets/`).
- `npm run install:plugin`: copies `plugin/chathermes/` to the user plugin root
  (`$HERMES_HOME/plugins/chathermes/` — `/opt/data/profiles/developer/plugins/` here) and prints:
  add `"chathermes"` to `plugins.enabled` in config.yaml (user plugins are allowlisted,
  `web_server.py:630-644`), then restart the dashboard.
- Built `dist/` is **committed** (kanban convention) so the plugin is drop-in deployable.

## 8. Verification plan

1. `npm test` (updated vitest suite) + `npm run build` + `npm run build:plugin` + `git diff --check`.
2. `pytest tests/plugin_api.test.py`: fake-gateway (httpx MockTransport) asserts Bearer
   injection, `/p/<profile>/` prefixing, profile-name validation, SSE frame passthrough,
   401→503 mapping, key never in response bodies/headers.
3. Live E2E (developer profile dashboard): install plugin, enable, restart dashboard, log in via
   the normal dashboard login (cookie), open the ChatHermes tab → sessions list, open history,
   send a message (SSE streams), rename session, switch profile field. Confirm **no** API key in
   browser storage, headers, or Network tab (only cookies).
4. Negative: log out → tab shows the host's 401/login behavior; disable plugin in config → tab
   404s cleanly.

## 9. Out of scope / follow-ups

- Pointing the browser at the dashboard's **native** cookie-gated `/api/sessions*` (removes a
  proxy hop for list/history/rename) — requires verifying its response shapes against the
  client's expectations first.
- Syncing Vue `dark:` with the host dashboard theme (currently: system preference, as in PR #2).
- Multi-profile session lists in one view; session create/delete UI polish; hub publishing.

## 10. Risks & mitigations

| Risk                                                | Mitigation                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| User plugin not in `plugins.enabled` → silent 404   | install script prints the exact config snippet; E2E step covers it     |
| Gateway key unset at proxy time                     | 503 with actionable detail, no key leakage                             |
| SSE buffering through FastAPI                       | `StreamingResponse` with chunked passthrough; tested with fake gateway |
| Absolute asset URLs 404 under `/dashboard-plugins/` | `base: './'` in build; E2E covers                                      |
| Entry bundle accidentally imports React             | lint rule / code review; host exposes React only via SDK               |
| `httpx` missing in dashboard env                    | import-time check → 503 with hint                                      |
