# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/main/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes calls same-origin dashboard plugin routes. The Python proxy selects the Hermes profile and adds the gateway bearer key on the server.

| Operation | Hermes route | Request | Expected response |
| --- | --- | --- | --- |
| List | `GET /api/sessions?limit=30&offset=N` | None | `{ "object":"list", "data":[session…], "limit":30, "offset":N, "has_more":boolean }` |
| Create | `POST /api/sessions` | `{}` | `{ "object":"hermes.session", "session":{ "id":… } }` (201) |
| Read | `GET /api/sessions/{id}` | None | `{ "object":"hermes.session", "session":{…} }` |
| Rename | `PATCH /api/sessions/{id}` | `{ "title": "…" }` | `{ "object":"hermes.session", "session":{…} }` |
| History | `GET /api/sessions/{id}/messages?limit=500&offset=N&order=oldest&inline_images=false` | None | `{ "object":"list", "session_id":…, "data":[message…], "pagination":{ "limit":500, "offset":N, "order":"oldest", "returned":count } }` |
| Turn | `POST /api/sessions/{id}/chat/stream` | `{ "input": "…", "model": "…", "provider": "…", "require_model_lock": true }` (selection fields optional) | SSE stream |
| Capabilities | `GET /v1/capabilities` | None | Feature and endpoint flags |
| Run state/stop | `GET /v1/runs/{id}`, `POST /v1/runs/{id}/stop` | None | Run state |

The stream sends `assistant.delta` with `delta` and `tool.started` with `tool_name`. Events also carry `session_id`, `run_id`, `seq`, and `ts`. A successful turn ends with a `run.completed` event containing `session_id`, `message_id`, `messages`, `usage`, and `runtime`; it does not need a `status` field. `run.failed`, `run.cancelled`, and `error` mean the turn did not complete. SSE keepalive comments and `done` are ignored. ChatHermes loads history again after completion and only clears streamed text once that reload succeeds. Message history is requested oldest first in 500 item pages so earlier messages are not hidden by Hermes' default latest 500 page. A malformed page raises an error and leaves the previously displayed messages intact. The gateway advertises this route with `features.session_chat_streaming: true` and `endpoints.session_chat_stream: { method: "POST", path: "/api/sessions/{session_id}/chat/stream" }`; sending stays disabled until both are confirmed; the text input stays editable. An `approval.request` blocks further sends in that conversation. Refreshing history does not confirm run completion, so the send lock remains until explicit navigation or a page reload with a warning to verify the previous turn. ChatHermes does not surface an approval action or a stop control without a verified run ID flow.

## Plugin-specific routes

`GET /profiles` returns Hermes profile names only. `GET /v1/models` proxies the configured gateway catalog and adds the selected profile’s `default_model`. Named-profile requests use that profile’s `API_SERVER_KEY` from its secret scope. `GET /api/model/options` proxies the selected profile's Hermes provider inventory and returns only `provider`, `model`, and provider rows containing `slug`, `name`, `is_current`, and model IDs. Provider transport and authentication metadata are excluded; unconfigured non-current providers are omitted. The UI defaults to the current provider, resets selection on profile changes, and keeps gateway route aliases in a separate **Model routes** choice. A missing inventory falls back to the configured default and route aliases; the virtual gateway alias (`parent: null`) is not a provider model. Explicit model selection adds `model`, `provider` (for inventory models), and `require_model_lock: true` to each streamed turn, so Hermes confirms the requested runtime rather than silently retaining a session model.

`POST /uploads` accepts a filename and base64 data URL (20 MB decoded maximum), validates the profile and body, and stores a generated filename under that profile's `uploads/chathermes/`. It returns the path for agent file tools. Image attachments use `{type: "image_url", image_url: {url: "data:image/..."}}` alongside text in the session input array.

`tool.started` carries `tool_name`, `args`, and `preview`; `tool.progress` carries `delta` (including `_thinking` reasoning). Tool completion/failure and final assistant text close active disclosures. The UI displays available reasoning exactly as Hermes emits it; it cannot create token-level reasoning when the provider only publishes a completed reasoning segment.

## Test environment

The compose environment pins Hermes revision `3632f9173d218fd24f3fa595d7affa159b0774cd` on a digest-pinned runtime image. Runtime state is isolated in a named volume. See README for commands and model endpoint configuration.

## Project gateway RPC adapter

Cookie-authenticated plugin routes use the dashboard's existing
`tui_gateway.server.dispatch` and `Transport` contract, the same backend as
`/api/ws`. No browser WebSocket connection configuration or gateway credentials
are introduced. Every operation pins the selected profile (`default` when the
current/default profile is selected). Gateway exceptions are returned as generic
errors, and reflected gateway Bearer keys are redacted from RPC frames.

| Plugin route | Native RPC | Behavior |
| --- | --- | --- |
| `GET /projects` | `projects.tree {profile, preview_limit: 3}` | Unmodified authoritative hierarchy, auto/Home nodes and scoped IDs |
| `GET /projects/detail?project_id=…` | `projects.project_sessions {profile, project_id}` | Hydrated repo/lane sessions; null Project becomes 404 |
| `POST /projects/session?project_id=…` | Project read → `config.get {key: 'project', cwd: root, profile}` → `session.create` | Path then first repo path; resolved cwd and `source: 'desktop'`; no Project ID on create |
| `GET /project-events` | Native change-watcher transport | SSE refresh on session/Project changes, initial connect and reconnect |
| `GET /workspace/sessions/{id}/messages` | `session.resume` | Unpersisted draft fallback; stored ID, no cwd override; compact transcript projected to Message shape |
| `POST /workspace/sessions/{id}/chat/stream` | `session.resume` → session-only `config.set` model → optional `image.attach_bytes` → `prompt.submit` | Native runtime/context, events adapted to existing SSE reducer |
| `/workspace/runs/{stored_id}` / `events` / `stop` | Resume snapshot / transport fanout / `session.interrupt` | Existing client run abstraction; `workspace-` prefix distinguishes RPC runs |

RPC drafts return a `stored_session_id` distinct from their runtime `session_id`;
URLs always use the durable ID. Empty drafts are native live sessions, with no DB
row until their first prompt. Project changes never send `session.cwd.set`,
`session.workspace.move`, or `projects.set_active`. Resume uses the stored
session's workspace even in another UI scope. Workspace images use authenticated
RPC bytes; other files reuse the existing authenticated upload path.

Workspace `session.create` sends `cwd_explicit: true` when a resolved cwd exists.
For older Hermes versions, only a schema-validation error identifying
`cwd_explicit` as an extra input triggers one retry without that field, and only
if the resolved cwd is an existing local directory (the older handler infers
explicit cwd from this condition). Timeouts, unknown methods, and all other RPC
errors are returned without retrying.

`config.set {key: 'model', session_id, value: '<model> --session --provider <slug>'}`
uses the pin's actual word parser. IDs cannot contain flags or whitespace, and
`--session` prevents profile-wide model changes. Confirmation/deferred responses
block the turn instead of silently using a different model. Workspace picker
models come from the configured provider inventory; REST aliases are not shown.

Native event mapping: `message.delta` → `assistant.delta`; `message.complete`
→ final assistant text plus completed/failed/cancelled; `tool.start/complete`
→ existing tool disclosures with stable tool IDs and output; reasoning events
retain their text. Approval/clarification requests keep the existing approval
lock and require resolution in Hermes. Detaching the browser stream detaches its
viewer and leaves the native turn running; explicit stop uses the native interrupt.

The Project event subscription optionally resumes the displayed workspace session
as a native viewer. This keeps unpersisted drafts alive while composing and avoids
Hermes's 20-second disconnected-session reap. Profile/session changes replace the
subscription; unmount/disconnect uses Hermes's normal transport teardown and
preserves any other Desktop/browser viewers. No native session cache is added.

Automatic Project IDs are literal repository paths, not database IDs. Detail and
create routes carry them as encoded query values, including spaces and slashes;
there is no client-side ID rewriting. The older path routes remain aliases for
simple persisted IDs. Home's `__no_project__` ID is retained as returned by Hermes.

Persisted workspace chats reuse the existing paginated REST history. The native
RPC display projection omits terminal and most other tool results; using REST for
history preserves completed disclosure output and attachments. Only a 404 for a
known workspace draft falls back to the native resume transcript. No non-404
history error or different profile silently switches transport.
