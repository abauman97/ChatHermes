# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/ac28abc96ce83f22f6b831f80d9007e2aba81f21/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes calls same-origin dashboard plugin routes. The Python proxy selects the Hermes profile and adds the gateway bearer key on the server.

| Operation    | Hermes route                                                                          | Request            | Expected response                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| List         | `GET /api/sessions?limit=30&offset=N`                                                 | None               | `{ "object":"list", "data":[session…], "limit":30, "offset":N, "has_more":boolean }`                                                   |
| Read         | `GET /api/sessions/{id}`                                                              | None               | `{ "object":"hermes.session", "session":{…} }`                                                                                         |
| Rename       | `PATCH /api/sessions/{id}`                                                            | `{ "title": "…" }` | `{ "object":"hermes.session", "session":{…} }`                                                                                         |
| History      | `GET /api/sessions/{id}/messages?limit=500&offset=N&order=oldest&inline_images=false` | None               | `{ "object":"list", "session_id":…, "data":[message…], "pagination":{ "limit":500, "offset":N, "order":"oldest", "returned":count } }` |
| Capabilities | `GET /v1/capabilities`                                                                | None               | Feature and endpoint flags                                                                                                             |

## Current native gateway transport (2026-10-23)

The browser uses the dashboard's same-origin `/api/ws`, with a fresh authenticated
`POST /api/auth/ws-ticket` grant in the `hermes-gateway-ticket.*` subprotocol.
It never receives gateway/provider API keys or connects across origins. A missing,
invalid or already-consumed ticket is refused by Hermes's existing native gate.
Every session RPC carries its selected `profile`, including resume, model changes,
file staging, Stop, guidance, and canonical prompt answers.

`POST /chat/sessions?prepare=1` prepares a normal draft; Project creation uses
`POST /projects/session?project_id=...&prepare=1` to validate the authoritative
workspace without creating an agent in a secondary plugin host. The browser then
calls native `session.create`. Its profile-bound creation connection remains
attached until the viewer resumes the returned stored ID. Unopened draft leases
expire after five minutes; creation refuses once 32 unopened drafts are held. Reopening an existing ID
first checks authenticated `/chat/sessions/{id}/membership` against the selected
profile's database or verified live registry, preventing arbitrary cold adoption.

`POST /chat/prepare` validates upload references and model aliases without prompt
admission. Text/file-only parts become the pinned native string input; image
parts remain multipart. Native `file.attach` stages verified files, and model
selection is read back from the native runtime before `prompt.submit` is issued.
Prompts are dispatched once. Lost acknowledgements remain uncertain and are
never replayed automatically. Empty/default profile aliases share the same lock,
including older stored empty-profile markers. Late control errors cannot change
another profile.

The adapter detects revision-aware snapshots and uses Desktop's standalone
canonical wire adapter from `290080e19e8e143d35f67427e89aed662161faf8` for request
identities, revision/generation fences, model mutations and prompt answers.
Legacy native gateways keep their pinned legacy request shapes. The official
container exercises the legacy mode; canonical mode has transport fixture tests.

Healthy native connections survive page backgrounding. Actual loss reconstructs
a profile-bound snapshot and unanswered requests, while sending stays gated until
recovery commits. A busy recovery uses one native activation confirmation, holding
later frames, so a completion racing the resume reply cannot leave sending stuck.
This is a bounded recovery barrier, not a completion polling loop. The composer
stays focusable. Legacy snapshots lack an atomic
snapshot/replay cursor, so these viewers do **not** claim lossless active progress
or the retained facade's offline-turn lease. Native gateway disconnect/reaping
policy governs unattended execution. The new capability mode is `native-gateway`,
with `offline_turn_lease: false` and `lossless_snapshot_replay: false`.

The compatibility facade below remains implemented and tested, but is no longer
the browser's default transport. Its `native_owners` turn-complete push callback
is not attached by new native viewers; unattended native per-turn ChatHermes web
push is not established by this change. Cron delivery and worker-click navigation
are separate paths.

## Retained compatibility transport (2026-10-05)

`POST /chat/sessions` creates an unscoped native draft; Projects use
`POST /projects/session?project_id=…`. All Other and Project turns use the authenticated plugin TUI socket. Legacy
REST Runs and workspace chat SSE endpoints are removed. Persisted legacy run
pointers and idempotency keys are ignored; saved session history is unchanged. Vue mounts
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

| JSON-RPC operation                  | Contract                                                                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat.attach`                       | `{session_id: stored_id}`; verify profile, resume stored conversation (reuse retained runtime); compact image history plus recovery boundary                     |
| `chat.state`                        | Empty params; read attached native activity through `session.activate` with `omit_messages`; return only running, queued and delegating flags                    |
| `chat.replay`                       | `{offset,through}`; fixed captured spool boundary, pages of raw native frames; offset and epoch checks                                                           |
| `chat.reconciled`                   | `{through}`; retire retained frames only after history hydration, native settlement, delegation settlement and matching boundary                                 |
| `chat.submit`                       | `{input,model?,provider?,queued?,admission_id?}`; validate input and runtime selection, reject busy unless explicitly queued, invoke native `prompt.submit` once |
| `chat.stop`                         | Empty params; native `session.interrupt`                                                                                                                         |
| `chat.steer`                        | `{text}`; native `session.steer`, separate from sending                                                                                                          |
| `chat.answer`                       | `{request_id,result}`; validate native open approval/clarify request and result ownership                                                                        |
| `chat.capabilities`, `gateway.ping` | Empty params; capability/heartbeat                                                                                                                               |

Attach requests `inline_images: false` and retries without that flag only when the native runtime explicitly rejects the parameter.

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
Explicit resolution checks native activity even when a retained input left the
browser busy. It requires an idle native session and successful history hydration,
preserves uncovered displayed content, and never submits a prompt. Pending
admission, queued work, delegation, failed checks, changed selection, and arriving
retained events keep sending locked.

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

## Chat transport cleanup (2026-10-09)

TUI is the only chat execution transport. The plugin no longer exposes REST
Runs start/status/events/approval/steer/stop or session chat SSE routes. Its
capabilities omit the upstream Runs and session-stream features and endpoints.
There is no pending REST turn drain, run-pointer persistence, or REST fallback.
Scheduled-job history and output remain available through `/scheduled`,
`/scheduled/runs`, and `/scheduled/output`; their retained cron data and models
are independent of the retired chat transport.

## Plugin-specific routes

`GET /profiles` returns Hermes profile names only. `GET /v1/models` proxies the configured gateway catalog and adds the selected profile’s `default_model`. Named-profile requests use that profile’s `API_SERVER_KEY` from its secret scope. `GET /api/model/options` proxies the selected profile's Hermes provider inventory and returns only `provider`, `model`, and provider rows containing `slug`, `name`, `is_current`, and model IDs. Provider transport and authentication metadata are excluded; unconfigured non-current providers are omitted. The UI defaults to the current provider, resets selection on profile changes, and keeps gateway route aliases in a separate **Model routes** choice. A missing inventory falls back to the configured default and route aliases; the virtual gateway alias (`parent: null`) is not a provider model. New native turns resolve these selections through the native model path above.

`POST /uploads` accepts a filename and base64 data URL (20 MB decoded maximum), validates the profile and body, and stores a generated filename under that profile's `uploads/chathermes/`. It returns the path for agent file tools. Image attachments use `{type: "image_url", image_url: {url: "data:image/..."}}` alongside text in the user message content array.

TUI tool and reasoning events carry the available runtime activity. Tool completion/failure and final assistant text close active disclosures. The UI displays available reasoning exactly as Hermes emits it; it cannot create token-level reasoning when the provider only publishes a completed reasoning segment.

## Test environment

The Docker launcher pins Hermes revision `ac28abc96ce83f22f6b831f80d9007e2aba81f21` on a digest-pinned runtime image. Runtime state is isolated in a named volume. See README for commands and model endpoint configuration.

## Project metadata and draft history

Chat turns use the TUI socket contract above. HTTP routes serve metadata and
history only.
Selected native sessions are held by their socket, not the metadata SSE watcher.

Cookie-authenticated plugin routes use the dashboard's existing
`tui_gateway.server.dispatch` and `Transport` contract, the same backend as
`/api/ws`. No browser WebSocket connection configuration or gateway credentials
are introduced. Every operation pins the selected profile (`default` when the
current/default profile is selected). Gateway exceptions are returned as generic
errors, and reflected gateway Bearer keys are redacted from RPC frames.

| Plugin route                            | Native RPC                                                                          | Behavior                                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `GET /projects`                         | `projects.tree {profile, preview_limit: 3}`                                         | Unmodified authoritative hierarchy, auto/Home nodes and scoped IDs                                    |
| `GET /projects/detail?project_id=…`     | `projects.project_sessions {profile, project_id}`                                   | Hydrated repo/lane sessions; null Project becomes 404                                                 |
| `POST /projects/session?project_id=…`   | Project read → `config.get {key: 'project', cwd: root, profile}` → `session.create` | Path then first repo path; resolved cwd and `source: 'desktop'`; no Project ID on create              |
| `GET /project-events`                   | Native change-watcher transport                                                     | SSE refresh on session/Project changes, initial connect and reconnect                                 |
| `GET /workspace/sessions/{id}/messages` | `session.resume`                                                                    | Unpersisted draft fallback; stored ID, no cwd override; compact transcript projected to Message shape |

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
block the turn instead of silently using a different model. Picker models come from the configured provider inventory; gateway aliases
are verified through the native model path before admission.

TUI approval and clarification requests are answered through the retained native
socket owner. Closing a browser detaches its viewer; explicit Stop requests the
native interrupt. The Project metadata SSE subscription remains for refreshes;
selected chat sessions are held by their native socket.

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

## Files and artifacts (issue 35)

The composer and file drop target share upload staging. Failed uploads remain
pending and can be retried or removed without discarding the draft or other
files. Staging does not submit a prompt. General files use native `file.attach`
at submission, after checking that every source belongs to the selected
profile's authenticated upload directory. The native `ref_text` is passed to
`prompt.submit` for file context; original upload annotations retain the
filename and retrieval reference in durable history. Images retain the existing
validated multipart prompt mechanism rather than a session-wide attachment queue.

Timeline cards and the global/project Artifacts views share history-based
reference detection and one preview/download component. Generated artifact cards
require explicit `MEDIA:` delivery directives or existing `Attached file` /
`Attached image` annotations. MEDIA parsing retains quoted paths, spaced media
filenames, unknown formats, and extensionless files; no extension eligibility
filter is used. Bare paths, markdown links (including `file:`, `sandbox:`, and
`#media:` links), ordinary URLs, screenshot labels, and arbitrary producer output
fields do not assert delivery. Standalone `@file:` references remain text unless
an upload annotation supplies a card and hides the redundant context reference.
Fenced source code remains intact.
Completed, successful tool outputs use the same explicit delivery rules regardless
of tool name. JSON results and untrusted result wrappers are decoded before
scanning their strings for delivery annotations; neither terminal stdout nor
structured output keys promote bare paths. Tool input arguments, failed blocks,
and incomplete blocks never produce cards. Explicit deliveries retain available
file metadata. User upload/image-content cards and authenticated session/profile
retrieval remain unchanged.
Artifact browsing pages through the authoritative sessions and message APIs,
and project browsing uses native session membership. No client transcript or
artifact metadata journal is introduced.

| Plugin route                                               | Native dashboard handler | Behavior                                                                                           |
| ---------------------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `GET /files/preview?path=…&profile=…&session_id=…`         | `/api/fs/read-data-url`  | Authenticated, bounded file preview; native session-relative resolution and SSH workspace handling |
| `GET /files/download?path=…&profile=…&session_id=…&name=…` | `/api/fs/download`       | Native file/stream response with a sanitized display filename and private/no-store headers         |
| `DELETE /files?path=…&profile=…&session_id=…`              | `/api/files`             | Confirmed, nonrecursive native managed-file deletion; regular-file/read-policy checks first        |

The adapter passes the authenticated dashboard request into the native handlers,
including the release's hosted-files read guard. Native file policy and preview
size limits apply, and native errors are reduced to generic status messages.
Remote SSH preview/download use Hermes's filesystem adapter; remote deletion is
explicitly unsupported because the native managed deletion route is host-local.
Missing native handlers return 501. Deleting a file leaves its historical
references intact; subsequent preview/download reports it unavailable.

Raster images have thumbnails and a larger viewer; PDFs and browser media use
browser viewers. Source/text formats, including HTML and SVG, display as escaped
text. Unsupported formats retain an explicit download link. Preview resources
are revoked and requests aborted on close or unmount. File type icons are
vendored from the MIT-licensed dmhendricks/file-icon-vectors vivid collection,
with its license and attribution in `src/assets/file-icons/`.
