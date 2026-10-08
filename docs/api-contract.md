# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/ac28abc96ce83f22f6b831f80d9007e2aba81f21/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes calls same-origin dashboard plugin routes. The Python proxy selects the Hermes profile and adds the gateway bearer key on the server.

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

## Native session transport (2026-10-05)

New Other and Project turns use the authenticated plugin native socket. Existing
REST run pointers drain through Runs; native chat does not use Runs identities,
SSE normalization, status polling or a completion-polling fallback. Vue mounts
through the host plugin SDK and retains no credentials or transcript journal.

`GET /api/plugins/chathermes/chat/capabilities` returns
`protocol: "chathermes.chat.v2"`, `mode: "native-retained"`, `admission: true`,
explicit busy queue choice, images and approval/clarify support. The reviewed
source is a contract reference, not runtime attestation. `offline_turn_lease` is
true for sessions retained in this dashboard process; `crash_safe_idempotency`
and `lossless_snapshot_replay` remain false. External turns can predate ownership
and native snapshots alone do not include the full activity timeline.

The same-origin `/api/plugins/chathermes/chat/ws` requires a host-issued,
single-use `POST /api/auth/ws-ticket` ticket in
`["hermes-gateway-v1", "hermes-gateway-ticket.<ticket>"]` subprotocols. Host,
Origin, identity, plugin enablement and named profile checks fail closed. Query
credentials and cookie-only upgrades are rejected. Browser connections expire
after 600 seconds and obtain fresh tickets. This expires viewer authorization,
not the retained native execution. Frames are limited to 29 MiB.

| JSON-RPC operation | Contract |
| --- | --- |
| `chat.attach` | `{session_id: stored_id}`; verify profile, activate retained runtime or resume stored conversation; full native snapshot plus recovery boundary |
| `chat.replay` | `{offset,through}`; fixed captured spool boundary, pages of raw native frames; offset and epoch checks |
| `chat.reconciled` | `{through}`; retire retained frames only after history hydration, native settlement, delegation settlement and matching boundary |
| `chat.submit` | `{input,model?,provider?,queued?,admission_id?}`; validate input and runtime selection, reject busy unless explicitly queued, invoke native `prompt.submit` once |
| `chat.stop` | Empty params; native `session.interrupt` |
| `chat.steer` | `{text}`; native `session.steer`, separate from sending |
| `chat.answer` | `{request_id,result}`; validate native open approval/clarify request and result ownership |
| `chat.capabilities`, `gateway.ping` | Empty params; capability/heartbeat |

Native `event` envelopes retain runtime IDs, sequence numbers and payloads.
Approval/clarify requests retain their JSON-RPC request IDs. Only local input and
correction display boundaries use `chat.input`/`chat.correction` notifications;
`chat_offset` provides a monotonic plugin spool cursor, independent of native seq.
The optional admission display ID correlates an optimistic bubble with its native
input frame; it is not a durable prompt receipt or execution identity. There is
no native-to-Runs event conversion. Other server requests are declined
as not shown, allowing another supported native viewer to handle them.

The browser uses the vendored, unchanged Hermes `JsonRpcRequestChannel` for
correlation, timeouts, heartbeat and open-request redelivery. One native Vue
controller owns history/live projection, connection, pending requests and busy
state. Recovery holds arriving live events, restores the committed-history
prefix, replays the active chain from its retained start and releases later
frames. It does not append an assistant snapshot on top of replayed deltas.

One in-process owner per profile/stored session retains the native transport.
Browser disconnect removes only a subscriber. Sanitized raw active-chain frames
are retained in private anonymous temporary files, paged in 512 KiB batches.
Successful terminal history reconciliation deletes the retained data. Disconnected
terminal leftovers expire after 24 hours; active execution, queued work or tracked
delegation prevents expiry. Owners close on dashboard shutdown. Storage failure
surfaces degraded recovery while live execution continues. Slow viewer overflow
closes that viewer, preserving the owner and replay. The registry admits at most
64 owners. No second backend, runtime, core patch or global orphan-policy change
is involved.

`message.complete.persisted_turn` supplies row identities and coverage evidence.
The controller requires a complete receipt, all addressed rows and matching final
text before retiring a live turn. Partial/failure output and steering bubbles remain inspectable when persistence
does not cover their live display identities; these uncovered frames use the
terminal retention limit. Reasoning availability replaces streamed reasoning;
provider thinking/tool generation is transient status, and tool/delegation parts
are keyed by native identity. Parent completion does not close delegated work.

Prompt admission still has no durable exactly-once receipt. Before submission,
the browser stores a profile/session/attempt uncertainty marker. Acknowledgement
clears only its attempt; known pre-dispatch rejection unlocks the composer.
Timeout/lost acknowledgement stays locked across reload and never auto-resubmits.
The user must inspect history and native state before explicitly ending verification.

Full recovery applies to plugin-owned turns observed from admission, while this
dashboard process survives and recovery storage succeeds. Already-running external
turns use native history/inflight and bounded replay, with a visible limitation.
Process restart is a separate case; native crash continuation is not unchanged-turn
recovery and can repeat effects. No browser journal or custom Hermes fork is required.

Model selection waits for the cold native agent build through read-only
`approval.pending`, reads current state, applies session-only `config.set` when
needed and verifies model/provider before prompt admission. A gateway alias is
allowed only if its endpoint/key matches an existing native provider. Unequal
routes, deferred switches or unconfirmed choices reject before prompt submission.
An independent Desktop model mutation is not atomically locked to this prompt.

Images upload originals through authenticated profile routes, retain file-path
references in the durable user text and submit multipart parts in one prompt.
Every inline image must byte-match its same-profile original. The pinned runtime
may preprocess the image through vision and persist only a text projection;
`GET /images/{uuid.ext}` safely reopens the original with dashboard authentication,
MIME sniffing, no symlinks and private/no-store headers. No session-global image
attachment queue is used. Non-image files retain authenticated upload paths.
Limits remain 29 MiB encoded turn, 1 MiB text, eight images and 20 MiB decoded
images; the composer applies its smaller attachment limits.

Upstream work still needed for stronger guarantees: transactional durable
idempotency keyed to the admitted user row (including atomic busy policy), and
snapshot epoch/sequence captured atomically with replay/truncation boundaries.
See [integration verification](verification/2026-10-04-persistent-tui-integration.md),
[historical native verification](verification/2026-10-04-native-gate.md) and the
[plan](plans/persistent-tui-gateway.md).

## Legacy Runs contract and pending-turn drain

Before implementation, the pinned source archive was downloaded and inspected:
[`api_server_runs.py`](https://github.com/NousResearch/hermes-agent/blob/ac28abc96ce83f22f6b831f80d9007e2aba81f21/gateway/platforms/api_server_runs.py)
(`_handle_runs`, `_accepted_response`, `_handle_get_run`, `_handle_run_events`,
`_handle_run_approval`, `_handle_steer_run`, `_handle_stop_run`), the capabilities
and route tables in `api_server.py`, and
[`test_api_server_runs.py`](https://github.com/NousResearch/hermes-agent/blob/ac28abc96ce83f22f6b831f80d9007e2aba81f21/tests/gateway/test_api_server_runs.py).
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

`GET /profiles` returns Hermes profile names only. `GET /v1/models` proxies the configured gateway catalog and adds the selected profile’s `default_model`. Named-profile requests use that profile’s `API_SERVER_KEY` from its secret scope. `GET /api/model/options` proxies the selected profile's Hermes provider inventory and returns only `provider`, `model`, and provider rows containing `slug`, `name`, `is_current`, and model IDs. Provider transport and authentication metadata are excluded; unconfigured non-current providers are omitted. The UI defaults to the current provider, resets selection on profile changes, and keeps gateway route aliases in a separate **Model routes** choice. A missing inventory falls back to the configured default and route aliases; the virtual gateway alias (`parent: null`) is not a provider model. New native turns resolve these selections through the native model path above. Legacy Runs retain their original runtime override contract.

`POST /uploads` accepts a filename and base64 data URL (20 MB decoded maximum), validates the profile and body, and stores a generated filename under that profile's `uploads/chathermes/`. It returns the path for agent file tools. Image attachments use `{type: "image_url", image_url: {url: "data:image/..."}}` alongside text in the user message content array.

Workspace/session-stream `tool.started` carries `tool_name`, `args`, and `preview`; `tool.progress` carries `delta` (including `_thinking` reasoning). Tool completion/failure and final assistant text close active disclosures. The UI displays available reasoning exactly as Hermes emits it; it cannot create token-level reasoning when the provider only publishes a completed reasoning segment.

## Test environment

The Docker launcher pins Hermes revision `ac28abc96ce83f22f6b831f80d9007e2aba81f21` on a digest-pinned runtime image. Runtime state is isolated in a named volume. See README for commands and model endpoint configuration.

## Project metadata and legacy workspace RPC adapter

New chat turns use the socket contract above. The HTTP stream routes described
here remain compatibility endpoints; the native UI does not fall back to them.
Selected native sessions are held by their socket, not the metadata SSE watcher.


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

The project instructions editor uses authenticated `GET` and `PUT
/project-instructions?project_id=…` routes. The selected profile's native Project
lookup supplies the workspace; the browser cannot supply a directory. Within that
directory, the first existing file wins in this order: `.hermes.md`, `HERMES.md`,
`AGENTS.override.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`. When none exists,
GET returns an empty draft and PUT creates `.hermes.md`. This editor targets the
project directory; it does not edit inherited instructions in parent directories.

GET returns `{filename, content, revision}`; PUT accepts exactly those fields.
`revision` is a SHA-256 digest of the loaded bytes, or null for a new file. A file
change or a newly discovered higher-priority file returns 409 and retains the
browser draft. Content must be UTF-8 and at most 128 KiB. Symlinks, hard links,
non-regular files and unavailable local workspaces are rejected. Filesystem
errors are generic. Editing instructions does not move or resume any session;
Hermes's existing context loader consumes the saved file on subsequent context
loads. Project details and instructions pages retain profile/project URL scope.
