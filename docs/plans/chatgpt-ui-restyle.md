# ChatHermes: zoom prevention, ChatGPT-style UI, thinking indicator, full-screen overlay, visibility reconnect

You are implementing a bounded, feature-complete change to the **ChatHermes** repo at
`/opt/data/projects/ChatHermes` (branch `feat/chatgpt-ui`, already checked out, clean tree).

This is a **Vue 3 + Vite + Tailwind** PWA that is BOTH a standalone app (`index.html` →
`src/standalone.ts`) AND a **Hermes dashboard plugin** (`src/plugin-entry.ts` renders a
`div.chathermes-plugin chathermes-embedded` and mounts the same Vue app into it). The plugin
build (`scripts/build-plugin.mjs`) compiles `src/main.ts` → `plugin/chathermes/dashboard/dist/`.
The app talks to the gateway ONLY through the cookie-gated plugin proxy at
`/api/plugins/chathermes/*` (see `src/lib/hermes-api.ts` `ROOT` and
`plugin/chathermes/dashboard/plugin_api.py`).

Six ChatGPT mobile reference screenshots are attached to this prompt (also saved at
`docs/reference/chatgpt/01..06-*.jpg`). Use them as the visual target for requirement 4.

## HARD CONSTRAINTS (violating any = scope violation)
1. **Do NOT modify the test files** `src/App.test.ts`, `src/components/ChatComposer.test.ts`,
   or anything under `tests/`. They are the contract.
2. **Preserve every test hook.** The suite depends on these exact selectors/labels — they MUST
   still exist and render with the same behavior after your changes:
   - `.profile-field` (an `<input>`), `.topbar-profile` (element whose **text** is the profile or
     `'Current profile'`), `.sidebar [role="alert"]`, `.load-more`, `.session-row`,
     `.composer`, `.composer textarea`, `.notice`, `.notice button`, `.message`, `role="log"`.
   - Text assertions that must remain true/false as the tests expect (e.g. after a completed
     turn, `Working…` and `Stream ended without confirmation` are absent; `Loading sessions…`,
     `Approval is pending`, `Select or create a conversation to begin.`, `Invalid profile name`
     present in the right states).
3. **Do NOT change the state machine, streaming logic, API call shapes, or storage behavior.**
   Keep `send()`, the SSE loop, capability gating, generation/abort guards, profile/session URL
   sync, and `api.*` request semantics working exactly as before. You may ADD to them (e.g. a
   visibility handler, a thinking flag, run-status calls) but must not alter existing outcomes.
4. **Do NOT touch the gateway.** Changes are client-side only (Vue app, `src/lib`, and the
   plugin proxy `plugin_api.py` / `manifest.json` if needed for a new proxied route).
5. Keep the code style consistent (the codebase uses dense single-line statements, Tailwind
   arbitrary values, `dark:` variants). Don't introduce new dependencies.

## GATE (must all pass before you finish)
- `npm test` (vitest, 27 tests) — green.
- `npm run build` (vue-tsc type-check + vite build) — green.
- `git diff --check` — no whitespace errors.
Re-run these yourself after every edit; do not report success without running them.

---

## Requirement 1 + 2 — Prevent zoom into the composer AND prevent pinch-to-zoom completely
Mirror the SWOL PWA approach. Two layers, applied so they cover BOTH standalone and plugin mode:

a) **Viewport meta.** In `index.html`, set:
   `content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"`.
   (Standalone only — the host dashboard owns the viewport in plugin mode, so also do (b).)

b) **Global CSS** (in `src/style.css`, which is imported by `src/main.ts` and therefore loaded in
   both modes): 
   - `html, body { touch-action: manipulation; overscroll-behavior: none; }` — `manipulation`
     disables double-tap zoom and pinch-zoom while keeping pan + one-finger scroll.
   - Ensure the app root and the transcript use `touch-action: pan-y` (or `manipulation`) so the
     composer textarea never double-tap-zooms. Add `-webkit-text-size-adjust: 100%` to `html`.
   - Make sure the fixed/overlay surfaces (requirement 4) inherit `touch-action: manipulation`.

c) **Composer guard** in `ChatComposer.vue`: add a `@touchend`/double-tap guard on the textarea is
   NOT needed if (b) is in place — prefer CSS `touch-action` over JS. If you add any JS, it must
   not break the existing `@keydown` Enter-to-send and `@submit.prevent` behavior or the
   `.composer textarea` / `.composer` hooks.

## Requirement 3 — Thinking indicator before a response streams
Show an explicit, visible "thinking" state for the window **after the user sends but before the
first streamed content arrives** (i.e. from `sending=true` until the first `assistant.delta` or
first `tool.started` frame is observed). It must be gone by the time the turn completes (the
existing test asserts `Working…` is absent after completion — keep that true).

Implementation: add a `thinking` ref in `App.vue`, set it `true` at the top of `send()`, set it
`false` the moment the first `assistant.delta`/`tool.started`/`run.*` frame is processed (and in
`finally`). Pass it to `ChatTranscript` (new prop) and/or render it in the transcript area as a
distinct, clearly-visible indicator — a small pulsing/spinning "Thinking…" chip with animated
dots or a spinner (CSS keyframes, Tailwind-friendly). It must read as "Hermes is working" and be
visually distinct from the final assistant message. Keep the existing `progress[]` tool lines and
the streaming `draft` message; the thinking chip appears *above* them during the pre-token window.
Do not let the chip's text contain the literal string `Working…` in a way that leaks into the
final rendered output after completion.

## Requirement 4 — Make the UI like the ChatGPT app; full-screen layer over the host
Study the six attached screenshots and restyle toward that look. Targets, mapped to the refs:
- **Empty home** (01): when no session is selected, show a clean, centered empty state with a
  suggested-prompt card or two (like "Hermes PR …" / "Send me the most useful …"), a prominent
  rounded composer near the bottom, and a slim top bar with a **hamburger (left)** and the
  **ChatHermes logo (right)**. Dark theme by default.
- **Top bar** (01,05): hamburger left, title/logo, profile pill. Keep the `.topbar-profile` hook
  (text = profile or 'Current profile').
- **Navigation drawer** (02): hamburger opens a left drawer with a "New chat" primary button and
  a "Recents" list of sessions (this is the current sidebar restyled: keep `.session-row`,
  `.load-more`, `.sidebar [role="alert"]`, rename ✎, profile field `.profile-field`, and the
  status dot). On mobile it's a slide-over with a scrim; on desktop it's a static panel.
- **Message rendering** (04): user messages as right-aligned rounded bubbles; assistant messages
  as full-width/left text (ChatGPT style, not a bubble) with comfortable line-height. Keep the
  `.message` wrapper and `role="log"` container.
- **Composer** (01,05,06): a single rounded pill/rounded-2xl bar with a **plus button**, the
  textarea (placeholder like "Message Hermes…"), and a **blue/rounded send button** on the right
  (the current gold send button → restyle toward the ChatGPT blue circular send). Keep `.composer`
  and `.composer textarea` hooks, Enter-to-send, and the `disabled`/`reason` behavior. The
  disabled/reason hint (e.g. 'Select or create a conversation to begin.') must still render.
- **Dark theme** (01-06): default to the ChatGPT dark palette (near-black background ~#212121,
  muted grays, white text, subtle separators). You may keep the existing `dark:` variant system
  but make **dark the default look** of the chat surfaces.

**Full-screen layer:** In **plugin mode** the app currently renders inside the dashboard's
content pane. Make it cover the **entire viewport** so it reads as a full app layering over the
host dashboard chrome: in `plugin-entry.ts`, keep mounting the Vue app, but the app's outer shell
should use `position: fixed; inset: 0;` (or `100dvh` full-bleed) with a high `z-index` so it fills
the screen. **CRITICAL:** add a visible **exit/close affordance** (e.g. a small "← Back" or "×"
button in the top bar, or honor Escape) that navigates the host back out of the plugin route (use
`history.back()` / `location.href` to the dashboard root) so the user can get back to the host —
do not trap them. In **standalone mode** it should simply fill the viewport (no exit needed).
Guard the full-bleed CSS so it does not break the existing `h-dvh` layout the tests rely on.

## Requirement 5 — Reconnect + reload all messages when the page returns to view
There is **no persistent websocket**; turns stream via SSE. When the tab is hidden, the browser
kills the in-flight SSE fetch and the **gateway interrupts the run on SSE disconnect**, so you
cannot truly resume a dead run. Implement the correct, honest behavior:

- Track the **active `run_id`** for the current session (the stream frames include `run_id`;
  capture the first one and store it in a ref, e.g. `activeRun`).
- Add a `visibilitychange` listener (registered in `onMounted`, removed in `onUnmounted`):
  when `document.visibilityState` becomes `'visible'` AND there is a selected session:
  1. **Re-fetch the full message history** for the session (`api.messages(...)`), replacing the
     local list so any messages that completed while hidden appear ("all session messages loaded
     to date"). Reuse the existing generation/abort guards so a stale reload can't clobber a
     newer session.
  2. **If `activeRun` is still set and the stream had not completed:** attempt to **reattach** by
     opening the gateway's run-events SSE, `GET /v1/runs/{run_id}/events`, and re-consume its
     frames through the SAME reducer logic used in `send()` (so deltas/tool events still update
     the transcript). If the run is already finished/unknown (404/not found), just clear
     `activeRun` and rely on the history re-fetch. If the run is still running, keep the thinking
     indicator active until it completes.
  3. On completion/failure of the reattached run, clear `activeRun` and refresh history.
- **Proxy the run endpoints.** The client currently only allows a whitelist of paths in
  `src/lib/hermes-api.ts` `endpoint()` and the proxy only exposes a fixed set of routes in
  `plugin_api.py`. Add support for:
  - `GET /v1/runs/{run_id}` (run status) and `GET /v1/runs/{run_id}/events` (SSE).
  - Update the client `endpoint()` path whitelist regex to allow `/v1/runs/[A-Za-z0-9_-]+` and
    `/v1/runs/[A-Za-z0-9_-]+/events` (keep the existing `/v1/runs/{id}/stop`), and add a
    `runStatus(profile, runId)` (JSON) + `runEvents(profile, runId, signal)` (SSE, reusing
    `readSSE`) to `api`.
  - Add matching FastAPI routes in `plugin_api.py`: a JSON proxy for `GET /runs/{run_id}` and an
    SSE `_stream` for `GET /runs/{run_id}/events`, mirroring the existing `chat_stream`/`stop`
    route style. Preserve the credential-redaction behavior for the SSE path (reuse `_stream`).
- Keep it **best-effort and non-fatal**: a failed visibility re-fetch or reattach must not break
  the UI or throw unhandled; it should leave the existing history in place.

## Definition of done
- All five requirements implemented and working in both standalone and plugin modes.
- `npm test` green (27), `npm run build` green, `git diff --check` clean.
- No test file, state-machine, or API-shape changes. New behavior is additive.
- Commit your work on `feat/chatgpt-ui` (one or a few clear commits). Do NOT push, do NOT open a
  PR — the parent agent handles that.

Start by re-reading the current `src/App.vue`, `src/components/*.vue`, `src/lib/hermes-api.ts`,
`src/style.css`, `index.html`, `src/plugin-entry.ts`, and `plugin/chathermes/dashboard/plugin_api.py`.
Then implement, then run the gate, then commit.
