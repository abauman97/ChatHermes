# ChatHermes Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a lightweight, installable, ChatGPT-style Vue interface for browsing Hermes sessions and chatting in them, without exposing Hermes's API key to the browser.

**Architecture:** Vue 3 + TypeScript SPA consumes Hermes's existing authenticated HTTP session API through a small same-origin Node proxy. The proxy keeps the bearer key server-side and forwards streaming responses without buffering. Hermes `state.db` remains the source of truth; the PWA only caches the static application shell, not transcripts, API results, or credentials. Start with one profile and one user; do not create a second session store.

**Tech Stack:** Vue 3.5.x, Vite 8.x, TypeScript 6.x, `vite-plugin-pwa` 1.3.x, Node 26, npm. Existing scaffold: `src/App.vue`, `src/main.ts`, `src/style.css`, `vite.config.ts`; PWA manifest/icons already configured. Use Node built-ins for the proxy and Vitest + Vue Test Utils for component/contract tests when implementing.

**Scope and decisions:** MVP = list/paginate sessions, create/select one, render history, send a prompt with streaming progress, rename, and cancel if supported. Responsive sidebar/composer, connection/error states, keyboard accessibility, and explicit PWA update UI. Search, delete, fork, attachments, voice, multi-profile selection, and offline messaging are later increments. Existing CLI/Telegram sessions are readable; verify whether the installed Hermes version allows continuing each source via the session chat endpoint before promising cross-platform writes. No fake chat data or offline-send queue.

**Reference contract:** https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server describes `GET/POST /api/sessions`, `GET /api/sessions/{id}/messages`, `PATCH /api/sessions/{id}`, `POST /api/sessions/{id}/chat/stream`, `/v1/capabilities`, and `/v1/runs`. The OpenAI `chat/completions` endpoint is stateless, so do not use it for canonical session browsing. Check the live Hermes gateway's capabilities and actual JSON/SSE shapes before writing parser tests. API authentication permits terminal-capable agent execution: never expose `API_SERVER_KEY` in client bundles, Vite `VITE_*` vars, localStorage, browser requests, or logs.

**Manual prerequisite:** Run a Hermes gateway with API server enabled and a strong `API_SERVER_KEY` in its private `.env`. Keep Hermes bound to loopback. The proxy is a single-user local deployment, not a public authentication system; add real auth and HTTPS before exposing it to a network.

---

### Task 1: Inspect the actual Hermes contract

**Files:** Create `docs/api-contract.md`; Test: `tests/fixtures/` (sanitized samples only).

1. Query `/v1/capabilities` and a small `GET /api/sessions?limit=2`; inspect response shape and optional feature flags without saving secrets or private transcript content.
2. In a disposable test session, inspect create, messages, streaming events, and cancellation semantics; record method, payload, error, and pagination shapes in `docs/api-contract.md`. Never delete existing user sessions for testing.
3. Save only redacted/synthetic examples to `tests/fixtures/`; confirm `API_SERVER_KEY` and actual messages do not appear in tracked files.
4. Verify capability gaps on the installed Hermes version and adjust the following tasks before implementation. If the gateway is unavailable, mark contract checks unverified instead of inventing response formats.

### Task 2: Add a same-origin Hermes proxy

**Files:** Create `server/index.ts`, `server/hermes-proxy.ts`, `server/hermes-proxy.test.ts`; Modify `package.json`, `vite.config.ts`, `.gitignore`; Create `.env.example`.

1. Install development tooling for TS server/test execution (`tsx`, `vitest`, `@vue/test-utils`, `jsdom`) and add `test`, `server:dev`, `start` scripts. Do not add Express unless Node built-ins prove insufficient.
2. Write failing proxy tests using a local fake Hermes HTTP server: forwarded GET/POST/PATCH, authorization injected only upstream, streaming SSE passed chunk-by-chunk, upstream 401/429/5xx preserved, unexpected paths rejected.
3. Implement strict allowlist for required `/api/sessions*`, `/v1/capabilities`, and run control routes only. Reject arbitrary URLs, absolute-form paths, traversal, and non-allowlisted methods; enforce request size/time limits. Keep key in server env; strip inbound `Authorization`, cookies, and unsafe hop-by-hop headers. No logging of request bodies or secrets.
4. Serve `dist/` with SPA fallback for document routes only; never fallback for API requests. Bind loopback by default. For development, Vite proxies `/api` and `/v1` to the local proxy so browser traffic remains same-origin.
5. Run `npm test` for proxy tests and verify a browser request to `/api/sessions` contains no bearer key while upstream fake server sees it. Document env names in `.env.example` with placeholders only.

### Task 3: Typed API client and SSE decoding

**Files:** Create `src/lib/hermes-api.ts`, `src/lib/sse.ts`, `src/lib/sse.test.ts`, `src/types/hermes.ts`.

1. Add failing tests against the recorded sanitized fixtures: pagination, session metadata/messages, chunk boundaries splitting an SSE frame, multi-line data, event types, HTTP errors, and abort.
2. Implement `fetch` wrappers with `AbortSignal`, typed responses, status-specific errors, and `ReadableStream` SSE framing via `TextDecoder` streaming mode. Render text only after parsing; do not treat event data as HTML.
3. Run `npm test` and `npm run build`; explicitly verify partial UTF-8/event chunks and cancellation close the stream.

### Task 4: Session list and navigation

**Files:** Create `src/components/SessionSidebar.vue`, `src/composables/useSessions.ts`, `src/components/SessionSidebar.test.ts`; Modify `src/App.vue`.

1. Write failing component tests for load, empty, paging, selected state, create, rename, error/retry, and mobile drawer keyboard behavior.
2. Implement session list backed only by Hermes, with loading/empty/error states, pagination, new chat, accessible item labels, and title edit. Preserve selected ID in URL (history/hash as appropriate), not a duplicate transcript database.
3. Run `npm test` and `npm run build`; verify existing sessions load from the live gateway if available.

### Task 5: History and chat streaming

**Files:** Create `src/components/ChatTranscript.vue`, `src/components/ChatComposer.vue`, `src/composables/useChat.ts`, corresponding `*.test.ts`; Modify `src/App.vue`.

1. Write failing tests for source roles, tool events, in-progress answer, failed send, retry semantics (avoid blind duplicate sends), abort on navigation, and keyboard send (`Enter` vs `Shift+Enter`).
2. Read the selected session's messages and stream a turn via `/api/sessions/{id}/chat/stream` using the verified request/response contract. Keep interim content in memory, then reconcile from canonical Hermes history on completion; avoid duplicated optimistic messages.
3. Show tools/approvals only when supported by discovered capabilities. If no safe approval flow exists, display a blocked/error state rather than auto-approving. Stop button must use a supported cancel endpoint or be omitted; do not imply aborting fetch stops the agent.
4. Run targeted tests, `npm test`, and `npm run build`; smoke-test one disposable chat turn and reload to verify persistence.

### Task 6: Intentional responsive UI and PWA behavior

**Files:** Modify `src/style.css`, `src/App.vue`, `src/components/*`, `vite.config.ts`, `index.html`; Create `src/components/UpdatePrompt.vue` and tests.

1. Write failing tests for offline/connection status, PWA update prompt, focus return from mobile drawer, and primary chat actions.
2. Use a warm parchment/deep-forest palette, distinct display/text typefaces, clear session grouping, readable markdown/text presentation, and one restrained entry animation. Keep spacing and focus states usable at mobile widths; never render untrusted HTML unsanitized.
3. Register update prompt using `virtual:pwa-register` (add its client type per plugin docs), confirm no API responses are cached, and show read-only offline shell with send disabled.
4. Run `npm test`, `npm run build`, `npm run preview`; inspect manifest, icon dimensions, service worker and network caching in browser devtools. Audit mobile/desktop and keyboard interactions.

### Task 7: Deployment docs and end-to-end verification

**Files:** Modify `README.md`; Create `docs/deployment.md`, `tests/e2e/` (if adding browser tests).

1. Document setup, localhost binding, production proxy launch, HTTPS/auth requirement for remote access, and why the PWA cannot send messages offline. Do not include a real key in examples.
2. Against the user's running Hermes gateway, verify: list, create, send, stream, reload, rename, error handling, and navigation; use only a disposable session. If unavailable, run equivalent tests against a local fake server and mark live integration pending.
3. Run `npm test`, `npm run build`, and browser smoke tests on desktop/mobile widths; check no secret appears in `dist/`, logs, requests, or offline caches. Capture screenshots of both modified page sizes.
4. Review `git diff --check` and tracked files; make focused commits per task once each task passes. Do not commit generated `dist/` or `.env`.

**Acceptance:** Installed PWA shell, real Hermes-backed session list/history/turns, no browser-side API key, functional streaming/error states, usable desktop/mobile layouts, repeatable tests, and documented deployment limits. A clean build alone does not satisfy the live integration criterion.
