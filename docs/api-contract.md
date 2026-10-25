# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/ac28abc96ce83f22f6b831f80d9007e2aba81f21/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes calls same-origin dashboard plugin routes. The Python proxy selects the Hermes profile and adds the gateway bearer key on the server.

| Operation    | Hermes route                                                                          | Request            | Expected response                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| List         | `GET /api/sessions?limit=30&offset=N`                                                 | None               | `{ "object":"list", "data":[session…], "limit":30, "offset":N, "has_more":boolean }`                                                   |
| Read         | `GET /api/sessions/{id}`                                                              | None               | `{ "object":"hermes.session", "session":{…} }`                                                                                         |
| Rename       | `PATCH /api/sessions/{id}`                                                            | `{ "title": "…" }` | `{ "object":"hermes.session", "session":{…} }`                                                                                         |
| History      | `GET /api/sessions/{id}/messages?limit=500&offset=N&order=oldest&inline_images=false` | None               | `{ "object":"list", "session_id":…, "data":[message…], "pagination":{ "limit":500, "offset":N, "order":"oldest", "returned":count } }` |
| Capabilities | `GET /v1/capabilities`                                                                | None               | Feature and endpoint flags                                                                                                             |

## Native chat contract

ChatHermes targets Hermes release 0.22.5, source
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. There is one wire contract:
the dashboard's authenticated same-origin `/api/ws`, JSON-RPC 2.0, using
`hermes-gateway-v1` and a single-use `hermes-gateway-ticket.*` subprotocol.
Every session operation includes its profile. Revision/generation authority
snapshots are rejected; there is no translation or alternate transport.
The plugin registers no WebSocket route.

`GET /chat/capabilities` reports `hermes.native.bf0203a7`, `native-gateway`,
and the reviewed source pin. The browser checks this contract before enabling
sending and probes the native gateway without admitting a prompt.

Normal and Project drafts use native `session.create`. Projects first validate
the authoritative workspace through `/projects/session?prepare=1`; callers
cannot supply a Project cwd. The resulting stored ID is persisted through the
existing authenticated profile session API. A creation viewer stays attached
until the chat viewer resumes it, with a five-minute unopened draft limit.
Existing sessions must pass `/chat/sessions/{id}/membership` against the selected
profile's store before resume. Session creation via ordinary HTTP uses the
existing gateway API, including from secondary plugin hosts.

`POST /chat/prepare` verifies profile-local image/file references and resolves
model aliases without admitting a turn. Images remain one native multipart input;
other files use native `file.attach`. Model selection waits for `approval.pending`,
applies session-only `config.set`, and verifies the resulting model/provider.
A rejected or deferred model choice blocks submission. All protocol schema
rejections fail closed without retrying different parameter shapes.

Before `prompt.submit`, the browser obtains a separate single-use dashboard
ticket and delegates it through authenticated `POST /chat/retain` with the
stored session ID. The server attaches a native viewer to the same runtime via
loopback `/api/ws` and verifies profile membership. The browser verifies the
returned runtime ID before dispatch. This service emits no browser protocol and
never receives or resubmits the prompt. Failure to retain blocks submission.
No credentials appear in a URL, response, persisted outbox or diagnostic.

The server viewer survives page navigation and browser closure. Native execution,
queueing, approvals, clarification, steering and Stop remain Hermes operations.
It retains active work, unanswered requests and tracked delegation, then releases
a settled native session. Unused viewers expire after two minutes. At most 128
viewers are admitted per plugin host. No global orphan-policy changes are made.
The execution lease lasts for the hosting process; host/runtime crashes are not
durable execution continuation. Workers must have affinity to the same native
runtime; the loopback target uses `HERMES_DASHBOARD_PORT` (default 9119).

Browser recovery uses native snapshots and persisted history, with a second
activation when completion races a busy resume. It does not claim lossless
progress replay. Healthy hidden viewers stay connected. The composer stays
focusable during recovery and execution; sending is gated separately.
Before dispatch the browser records a profile/session/attempt uncertainty marker.
Lost acknowledgements stay unknown across reload; no prompt is automatically
retried. Explicit verification requires an idle native state and hydrated history.
`crash_safe_idempotency` and `lossless_snapshot_replay` are false;
`offline_turn_lease` describes the process-local server viewer.

## Completion and push delivery

The server viewer observes native `message.complete` and accepts only successful
completion whose exact final text matches a newly committed assistant row,
after a new user row and the pre-submission watermark in the selected profile.
The native optional `persisted_turn` field is not required. The SQLite outbox stores profile, stored session, committed row identity and
a snapshot of subscribed devices, never streamed text or credentials. Repeated
frames and sequence resets cannot create a second completion for that row.
Delivery reads the exact assistant row from the owning profile's persisted
transcript and redacts configured provider and gateway credentials.

Each device has its own delivery receipt and bounded claim lease. Only confirmed
provider success marks delivery complete. Failures retry; successful devices are
not retried because another device failed. Removed subscriptions are terminal.
Startup drains persisted pending deliveries without requiring a browser or a new
turn. A crash after provider acceptance but before recording success may repeat a
notification with the same replacement tag: delivery is at least once, not
exactly once. New devices do not receive historical completions. Missing or
unproven persistence never creates a successful completion notification.
Approval/clarification/secret attention pushes queue native request IDs without
persisting request parameters or answers. Cron retains its separate native
execution/delivery lifecycle.

## Plugin-specific routes

`GET /profiles` returns Hermes profile names only. `GET /v1/models` proxies the configured gateway catalog and adds the selected profile’s `default_model`. Named-profile requests use that profile’s `API_SERVER_KEY` from its secret scope. `GET /api/model/options` proxies the selected profile's Hermes provider inventory and returns only `provider`, `model`, and provider rows containing `slug`, `name`, `is_current`, and model IDs. Provider transport and authentication metadata are excluded; unconfigured non-current providers are omitted. The UI defaults to the current provider, resets selection on profile changes, and keeps gateway route aliases in a separate **Model routes** choice. A missing inventory falls back to the configured default and route aliases; the virtual gateway alias (`parent: null`) is not a provider model. New native turns resolve these selections through the native model path above.

`POST /uploads` accepts a filename and base64 data URL (20 MB decoded maximum), validates the profile and body, and stores a generated filename under that profile's `uploads/chathermes/`. It returns the path for agent file tools. Image attachments use `{type: "image_url", image_url: {url: "data:image/..."}}` alongside text in the user message content array.

TUI tool and reasoning events carry the available runtime activity. Tool completion/failure and final assistant text close active disclosures. The UI displays available reasoning exactly as Hermes emits it; it cannot create token-level reasoning when the provider only publishes a completed reasoning segment.

## Test environment

The Compose environment extends the latest official Hermes release with an anonymous volume and deterministic inference from stock MockServer. Real-provider credentials from the root `.env` are explicit opt-in only. The reviewed native contract is the pin above. See README for launch and cleanup commands.

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

Approval and clarification answers travel directly through the browser native gateway connection. Closing a browser leaves the server execution viewer attached; explicit Stop requests native interruption. Project metadata SSE remains a refresh subscription.

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
filename and retrieval reference in durable history. Every submitted upload also
includes a standalone `MEDIA:"<uploaded path>"` direct reference. User history
uses the same explicit artifact parser as generated delivery, deduplicating the
reference and filename annotation while preserving quotation/untrusted boundaries.
Images retain the existing
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
of tool name. Only a top-level `media_tag` or explicit multimodal `meta.media_tag` envelope
asserts tool delivery. Terminal stdout, nested result strings, untrusted wrappers,
and arbitrary structured output fields remain data. Tool input arguments, failed blocks,
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
