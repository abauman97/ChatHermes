# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/3632f9173d218fd24f3fa595d7affa159b0774cd/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes calls same-origin dashboard plugin routes. The Python proxy selects the Hermes profile and adds the gateway bearer key on the server.

| Operation | Hermes route | Request | Expected response |
| --- | --- | --- | --- |
| List | `GET /api/sessions?limit=30&offset=N` | None | `{ "object":"list", "data":[session…], "limit":30, "offset":N, "has_more":boolean }` |
| Create | `POST /api/sessions` | `{}` | `{ "object":"hermes.session", "session":{ "id":… } }` (201) |
| Read | `GET /api/sessions/{id}` | None | `{ "object":"hermes.session", "session":{…} }` |
| Rename | `PATCH /api/sessions/{id}` | `{ "title": "…" }` | `{ "object":"hermes.session", "session":{…} }` |
| History | `GET /api/sessions/{id}/messages?limit=500&offset=N&order=oldest&inline_images=false` | None | `{ "object":"list", "session_id":…, "data":[message…], "pagination":{ "limit":500, "offset":N, "order":"oldest", "returned":count } }` |
| Start turn | `POST /v1/runs` | `{ "session_id": "…", "input": "…", "model": "…", "provider": "…" }` (selection fields optional) | `{ "run_id": "run_…", "status": "started", "replayed": false }` (202) |
| Run state | `GET /v1/runs/{run_id}` | None | Flat `{ "run_id":…, "session_id":…, "status":…, "output":…, "approval":… }` (fields vary by state) |
| Run events | `GET /v1/runs/{run_id}/events?last_seq=N` | None | SSE replay after N, then live events |
| Approval | `POST /v1/runs/{run_id}/approval` | `{ "choice": "once", "request_id": "…" }` | `{ "object":"hermes.run.approval_response", "run_id":…, "choice":…, "request_id":…, "resolved":1 }` |
| Steer | `POST /v1/runs/{run_id}/steer` | `{ "input": "…" }` | `{ "object":"hermes.run.steer", "run_id":…, "accepted":true }`; 409 if not accepting |
| Stop | `POST /v1/runs/{run_id}/stop` | None | `{ "run_id":…, "status":"stopping" }` or existing terminal status |
| Capabilities | `GET /v1/capabilities` | None | Feature and endpoint flags |

## Verified Runs contract and reconnection

Before implementation, the pinned source archive was downloaded and inspected:
[`api_server_runs.py`](https://github.com/NousResearch/hermes-agent/blob/3632f9173d218fd24f3fa595d7affa159b0774cd/gateway/platforms/api_server_runs.py)
(`_handle_runs`, `_accepted_response`, `_handle_get_run`, `_handle_run_events`,
`_handle_run_approval`, `_handle_steer_run`, `_handle_stop_run`), the capabilities
and route tables in `api_server.py`, and
[`test_api_server_runs.py`](https://github.com/NousResearch/hermes-agent/blob/3632f9173d218fd24f3fa595d7affa159b0774cd/tests/gateway/test_api_server_runs.py).
Relevant upstream tests include `test_start_returns_202`,
`test_status_reflects_explicit_session_id`,
`test_start_passes_request_model_provider_options_to_create_agent`,
`test_reconnect_receives_exactly_missed_events_and_terminal`,
`test_tool_completed_event_includes_redacted_bounded_result_preview`,
`test_approval_resolve_all_is_scoped_to_target_run`, `test_steer_running_agent`,
and `test_stop_running_agent`. These were inspected, not executed locally.

Runs input is a string or **message array**, not a bare array of content parts.
Images use `input: [{role: "user", content: [{type: "text", text: "…"},
{type: "image_url", image_url: {url: "data:image/…"}}]}]`. `session_id` loads the
existing conversation and persists the new turn to that session. Explicit
`model`/`provider` fields become requested runtime overrides. The client also
sends `require_model_lock: true` for compatibility, but the pin's Runs handler
does not report the session-stream `model_lock` confirmation; terminal
`runtime: {provider, model}` identifies the runtime actually served, including
configured fallback providers.

REST sending requires the advertised `runs` POST endpoint and `run_events_sse`
feature. Authenticated same-origin plugin routes proxy all Runs actions; bearer
keys remain on the server. Creating a run and attaching a viewer are separate
operations. Navigation/unmount aborts only the viewer. Browser storage contains
only a versioned `(profile, session) → run_id` pointer, never prompt text,
attachments, transcript or credentials. Storage-disabled browsers retain pointers
for this mount only. Opening/reloading retrieves status, rebuilds the active
turn from replay and reconnects without another POST. Finished runs reload
paginated Sessions history before removing the pointer and releasing send.

Events contain `event`, `run_id`, `timestamp`, and a monotonically increasing
`seq`, also sent as SSE `id`. Runs SSE frames are data-only: the event name
is in JSON `event`, not an SSE `event:` line. The client normalizes that name.
`message.delta` carries `delta`;
`message.interim` carries `text` and `already_streamed`;
`reasoning.available` carries `text`; `tool.started` carries `tool` and `preview`;
`tool.completed` carries `tool`, `duration`, `error`, and a redacted result
`preview` limited to 500 characters. Full tool results come from saved history.
The Runs bridge does not emit `_thinking` token progress. Existing workspace
reasoning/progress events remain supported. Active disclosures expand; completed
disclosures collapse and can be reopened.

Reconnects retain the transcript and resume with `last_seq`; sequence IDs at or
below the applied cursor are ignored. New viewers replay from -1 and rebuild
only the active turn, retaining previous turns. SSE comments are ignored.
Disconnects show “Reconnecting and restoring conversation…” and retry status
and event GETs with a delay. `replay.truncated` warns that retained event history
is incomplete; completed saved history remains authoritative. The pin's replay
buffer/status retention is bounded (orphan sweep TTL 300 seconds), so browser
durability does not guarantee recovery after a gateway restart or expired
buffer. A 404 retains the send lock and pointer until the user inspects history
and explicitly confirms “I verified the run ended”; no prompt is resubmitted.

Nonterminal statuses are `queued`, `running`, `waiting_for_approval`, and
`stopping`; terminal statuses include `completed`, `failed`, `cancelled`, and
`interrupted`. Terminal events carry output/usage/runtime where available.
Stopping is a request, not confirmation of cancellation; the UI retains the run
until terminal status/event and history restoration.

`approval.request` or status `approval` supplies `request_id`, redacted command,
and allowed `choices`. The UI sends only offered choices (`once`, `session`,
`always`, `deny`) with that exact request ID and keeps the stream attached.
`approval.responded` clears the pending approval. Steering sends a nonempty
`input` to the running run. Approval/steer/stop errors preserve the active run
and are shown without reflecting gateway errors. The composer remains editable
while sending; its send button becomes a stop button after admission.

## Plugin-specific routes

`GET /profiles` returns Hermes profile names only. `GET /v1/models` proxies the configured gateway catalog and adds the selected profile’s `default_model`. Named-profile requests use that profile’s `API_SERVER_KEY` from its secret scope. `GET /api/model/options` proxies the selected profile's Hermes provider inventory and returns only `provider`, `model`, and provider rows containing `slug`, `name`, `is_current`, and model IDs. Provider transport and authentication metadata are excluded; unconfigured non-current providers are omitted. The UI defaults to the current provider, resets selection on profile changes, and keeps gateway route aliases in a separate **Model routes** choice. A missing inventory falls back to the configured default and route aliases; the virtual gateway alias (`parent: null`) is not a provider model. Explicit model selection adds `model`, `provider` (for inventory models), and `require_model_lock: true` to each turn, so the selection reaches Hermes runtime overrides. See the Runs model-lock distinction above.

`POST /uploads` accepts a filename and base64 data URL (20 MB decoded maximum), validates the profile and body, and stores a generated filename under that profile's `uploads/chathermes/`. It returns the path for agent file tools. Image attachments use `{type: "image_url", image_url: {url: "data:image/..."}}` alongside text in the user message content array.

Workspace/session-stream `tool.started` carries `tool_name`, `args`, and `preview`; `tool.progress` carries `delta` (including `_thinking` reasoning). Tool completion/failure and final assistant text close active disclosures. The UI displays available reasoning exactly as Hermes emits it; it cannot create token-level reasoning when the provider only publishes a completed reasoning segment.

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
retain their text. Workspace approval/clarification requests keep the existing approval
lock and require resolution in Hermes; Runs approval actions apply to REST runs. Detaching the browser stream detaches its
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
