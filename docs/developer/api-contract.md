# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes calls same-origin dashboard plugin routes. The Python proxy selects the Hermes profile and adds the gateway bearer key on the server.

| Operation    | Hermes route                                                                          | Request            | Expected response                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| List         | `GET /api/sessions?limit=30&offset=N`                                                 | None               | `{ "object":"list", "data":[session…], "limit":30, "offset":N, "has_more":boolean }`                                                   |
| Read         | `GET /api/sessions/{id}`                                                              | None               | `{ "object":"hermes.session", "session":{…} }`                                                                                         |
| Rename       | `PATCH /api/sessions/{id}`                                                            | `{ "title": "…" }` | `{ "object":"hermes.session", "session":{…} }`                                                                                         |
| History      | `GET /api/sessions/{id}/messages?limit=500&offset=N&order=oldest&inline_images=false` | None               | `{ "object":"list", "session_id":…, "data":[message…], "pagination":{ "limit":500, "offset":N, "order":"oldest", "returned":count } }` |
| Capabilities | `GET /v1/capabilities`                                                                | None               | Feature and endpoint flags                                                                                                             |

## Persisted transcript pages

The chat viewer requests `GET /api/sessions/{id}/messages?limit=120&offset=N&order=latest&inline_images=false&include_compacted=true&transcript=1`
through the authenticated plugin proxy. `offset` counts Hermes display rows from
the newest end; each page is chronological. Native resume/activation requests use
`omit_messages=true`; persisted hydration no longer downloads the native display
history as well.

The opt-in plugin extension opens the owning profile's SessionDB read-only,
resolves the resume tip, and delegates ancestor expansion, generation deduplication
and rewind removal to `get_messages(...include_compacted=True, include_ancestors=True)`.
It applies the pinned Desktop REST `_project_for_display` and honors
`display_content`. Hidden rows retain their source ID but have an empty body;
summary text is withheld. Inline image bytes become authenticated `artifact-images`
addresses; reads select one profile-owned lineage row. Source `id` is Hermes's
current representative, without a locally inferred alias or original-row position.
The extension adds no historical compaction separators. Typed display entries
returned by Hermes still render normally.

The response adds `transcript: {revision, next_offset, has_more}`. A one-row
lookahead establishes `has_more`; `next_offset` consumes source rows, including
hidden rows. Hermes's `conversation_revision(...include_ancestors=True)` fences
offsets and detects in-place rewrites. Append, rewind, compaction, rotation or a
mutation during reading returns 409. The client refreshes its loaded window
before advancing; generation and request guards reject obsolete results.
Nonadvancing/repeating pages report an error and remain retryable.

Saved selection and order match the pinned Desktop REST path, including its
limitations: uncovered user clones may appear after retained answers, and exact
content/timestamp identities may collapse separate equal sends. No local
reconstruction repairs these cases. The 120-row HTTP window does **not** bound
backend work: the pin's multi-ancestor `get_messages` reads all retained payloads
before deduplication and paging. No metadata selector or transcript store is added.

Earlier pages load near scroll-top and through a retryable button. A DOM anchor
preserves the reader while pages prepend or live content grows. Older Hermes
versions without the storage helpers retain the gateway proxy. An explicit
`pagination.order="latest"` is required to adopt a tail. A full orderless page
falls back to complete oldest-first pagination; short orderless pages and replies
without pagination are complete, as in Desktop. Source counts advance offsets.
Legacy latest paging without revision support revalidates the loaded tail.

## Native chat contract

### Sidebar session activity

`GET /session-activity/{target_profile}` returns only `{sessions: [{id, session_key,
session_keys, session_keys_complete, status}]}` with `Cache-Control: no-store`. It inherits dashboard authentication.
The explicit target is a path component: `?profile` would forward secondary
requests to separate plugin processes whose registries do not own the browser's
native sessions. The path parameter also avoids the name `profile`, which would
bind Hermes's FastAPI profile dependency. Secondary plugin hosts refuse this
route; native HTTP principals must own the requested profile. Profile names resolve to actual homes without
implicit current-profile aliases.

At the reviewed pin, legacy `session.active_list` is process-wide even when its
params name a profile. The plugin filters the launch registry by each runtime's
resolved `profile_home` (missing ownership follows Hermes's process-home rule),
excludes finalized sessions, and uses the same native lookup-key and live-status
functions as active_list. `session_keys` includes the runtime lookup ID, its
verified compression ancestors and preferred continuation using the same edge
selection as native resume. The original stored ID is included when verified on
that path. Stale closed siblings, branches, resets, tools and delegates are excluded.
Canonical chat owners require receipt lineage membership through the pinned
`local_lineage_owner` helper; inherited `chat_id` alone proves no ownership.
Aliases, validated canonical chat owners and pending ledger work are read in one SQLite
snapshot so a concurrent rotation cannot splice different lineage versions.
`session_keys_complete` reports successful lineage traversal independently of
activity status: a failed traversal returns only the live lookup key and `false`,
even when native activity confirms `working` or `waiting`. Successful traversal
returns `true`, including when subsequent ledger checks leave status unknown.
On incomplete reads, the browser retains previously verified aliases for that
runtime only if its current lookup key belongs to the prior verified group.
Profile changes, absent runtimes, unrelated lookup keys (including resets), and
complete replacement lineages discard the previous group. A failed first read
cannot establish aliases. This keeps a root completion connected to its live tip
through busy and subsequent unknown snapshots without joining unrelated sessions.
The browser applies
viewer events on any of these IDs to the same continuation, including aliases
first learned during an in-flight read. A stored ID existing in a profile DB is never proof of
runtime ownership. Titles, prompts, tool data and provider settings are omitted.

The existing selected-session viewer supplies immediate `message.start` and
`message.complete` edges plus running recovery snapshots. Idle viewer snapshots
defer to the ledger-checked activity feed. Reclaimed/finalized sessions
disappear from subsequent live snapshots. The per-mount activity owner uses
profile/generation guards and lets newer events win
over in-flight snapshots. Navigation does not stop work. `working` and `waiting`
shimmer; `idle`, `starting`, finalized and absent rows do not. A visible five-second
poll and existing session-change refreshes recover missed edges without resuming
background transcripts. Return/focus/online refresh immediately. Failed,
unsupported or malformed reads preserve known state; they are not idle snapshots.
Reads time out after ten seconds and retry through the same refresh lifecycle.

A legacy dashboard can forward `prompt.submit` to an external canonical owner.
The pinned relay publishes start/completion without updating legacy `running`.
The projection checks the profile-owned admissions and worker ledger for each
compression identity and its receipt-validated canonical chat owner. Confirmed
native `working` and `waiting` survive pending work and ledger read failures,
including on a fresh mount. Otherwise pending or outcome-unknown work and
unavailable ledger reads return `status: "unknown"`. An unknown row
preserves known activity without inventing work or asserting idle. This is a
conservative legacy projection, not a query of the external owner's live state.
If its relay disconnects, Hermes emits a synthetic completion even while durable
work may continue; this plugin cannot infer that owner's current work from that
terminal frame. A fresh mount likewise cannot restore external work from an
unknown row alone.

Hermes's canonical session authority has a different actor-scoped active_list and
event lifecycle. The plugin's native chat contract already rejects that protocol;
this route also refuses canonical authority rather than treating the legacy
registry as its snapshot. This is parity with the supported legacy Desktop
lifecycle, not support for canonical or remote authority-owned sessions.

### Supported chat wire

ChatHermes targets Hermes release v0.23.0, source
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`. There is one wire contract:
the dashboard's authenticated same-origin `/api/ws`, JSON-RPC 2.0, using
`hermes-gateway-v1` and a single-use `hermes-gateway-ticket.*` subprotocol.
Every session operation includes its profile. Revision/generation authority
snapshots are rejected; there is no translation or alternate transport.
The plugin registers no WebSocket route.

`GET /chat/capabilities` reports `hermes.native.2bd378ed`, `native-gateway`,
and the reviewed source pin. The browser checks this contract before enabling
sending and probes the native gateway without admitting a prompt.
These fields describe the plugin's reviewed wire contract, not the running
host's version or commit. `admission: true` declares support for the submission
path; it does not attest runtime identity or compatibility with every host.
The read-only gateway probe checks connectivity and supported response shape,
not source provenance. Exact-release verification belongs to the test fixture.

New chat navigates to `/` (optionally `?project=…&profile=…`) without allocating
a session. First Send creates unscoped and Project chats through native
`session.create`. Projects first validate
the authoritative workspace through `/projects/session?prepare=1`; callers
cannot supply a Project cwd. The resulting stored ID is persisted through the
existing authenticated profile session API. A creation viewer stays attached
until the chat viewer resumes it, with a five-minute unopened draft limit.
The stored session route drops the draft Project query; its context comes only
from the authoritative Project catalog. There is no provisional browser membership
map. Between creation and the catalog reflecting the persisted workspace, the
Project subtitle can be absent. A pre-admission failure after creation can leave
an empty canonical session; its saved workspace and membership remain Hermes-owned.
Known failures restore composer text and attachments in the current scope. If newer input or an attachment read is present, the rejected text and files remain in an **Unsent message** disclosure; Restore becomes available after sending or clearing the current draft. Recovery never overwrites newer input and is cleared by navigation or New chat. The creation-owned canonical handoff preserves the mounted composer and its follow-up draft; other navigation invalidates ownership. Uncertain
admissions retain the existing resolution flow and are never automatically retried.
Existing sessions must pass `/chat/sessions/{id}/membership` against the selected
profile's store before resume. Session creation via ordinary HTTP uses the
existing gateway API, including from secondary plugin hosts.

`POST /chat/prepare` verifies profile-local image/file references and resolves
model aliases without admitting a turn. Provider identities accept Hermes’s native
`custom:<name>` slugs as well as ordinary provider IDs; profile names retain their
separate strict validation. Invalid selections fail before native submission.
Images remain one native multipart input;
other files use native `file.attach`. Model selection waits for `approval.pending`,
applies session-only `config.set`, and verifies the resulting model/provider.
An optional `reasoning_effort` on `/chat/prepare` accepts only `none`, `minimal`,
`low`, `medium`, `high`, `xhigh`, `max`, or `ultra`. After the model switch, the
browser sends `config.set {key: 'reasoning', value: effort, scope: 'session',
session_id, profile}` and verifies `config.get {key: 'reasoning', session_id,
profile}` before retaining execution and submitting. An omitted effort adds no
reasoning calls. This follows the pin's `methods_config_set._set_reasoning` and
`methods_config._cfg_get_reasoning`; Hermes owns provider wire clamping. Pending
picker choices are keyed by profile and stored session; a home draft transfers
its choice only to the chat it creates. On resume, the guarded native snapshot’s
`info.model`, `info.provider`, and `info.reasoning_effort` supply the composer
defaults for that session. Profile inventory arriving later cannot replace them;
pending picker choices remain local to their profile and session.
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

Browser recovery uses native snapshots and persisted history, with Desktop's deferred cold
resume (`defer_history=true`, `cols=96`) and a second activation when completion
races a busy resume. A cold `hydrating=true` ack also denotes omitted history. It does not claim lossless
progress replay. Omitted native history is not an empty persisted transcript.
After reconnect, the browser automatically rebuilds the loaded saved-history
window while preserving the active response and arriving events. Incomplete
replay alone does not show a warning or require Refresh history. Failed reads
retain the transcript and retry after 1, 2 and 4 seconds; persistent failure keeps
a generic error and an explicit refresh action. Profile/session changes, viewer
replacement and unmount cancel retries and reject obsolete results. Reconciliation
acknowledgements cover only the native event boundary captured before the read.
Partial saved tool commentary is reconciled using Desktop's backward final-reply
boundary, ordered correction checks and symmetric prefix subtraction. Correction
offsets count Unicode code points; unusable offsets retain the whole first
interval, as Desktop does. These prompt/prefix rules are heuristics, not durable
occurrence provenance. Saved tool IDs, structured phases and images remain
available. Settled incomplete or omitted snapshots use the complete ordered prose
check; optional native persistence receipts retain their stronger coverage path.
Hermes does not persist all transient reasoning/tool events, so cold reload cannot
replay unavailable activity. Healthy hidden viewers stay connected. The composer stays
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

Scheduled saved-output reads validate scheduler character frames on the server before
credential redaction. The `output` field contains the extracted answer or whole
script output. Native `no_agent (script)` envelopes retain the whole document,
including failed and silent script runs, after credential redaction. Metadata
anchors extraction so multiline job names containing `## Prompt` remain valid;
ambiguous metadata is rejected rather than risking prompt disclosure.
Unframed agent Cron archives (including the pinned scheduler's failed-run
`## Error` documents) and invalid frames return `output_status: "unverified"`
without archive text. Headings in prompts and answers make legacy boundaries
unprovable; the upstream context-reuse last-heading heuristic is not a display
contract. Existing job, run, profile and symlink checks apply before extraction.

## Test environment

The Compose environment extends the digest-pinned official Hermes v0.23.0 release with an anonymous volume and deterministic inference from stock MockServer. Real-provider credentials from the root `.env` are explicit opt-in only. The reviewed native contract is the pin above. See the [test environment guide](../../tests/docker/README.md) for launch and cleanup commands.

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

Secondary-profile plugin IPC in the pinned Hermes runtime buffers responses, so
an indefinite `/project-events` SSE can retain a hosted-request worker after the
browser disconnects. The browser instead refreshes Projects and Inbox through
existing authenticated reads immediately and every five seconds for secondary
profiles. Profile changes and plugin disposal clear that timer and abort obsolete
reads. The default profile retains its EventSource subscription.

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

Timeline cards and the backend index share the extraction fixtures in
`tests/fixtures/artifact-deliveries.json` and one preview/download component.
Assistant response text also delivers standalone absolute (`/…`) and runtime
home-relative (`~/…`) paths, or Markdown links to those paths. Automatic detection
uses the pinned Hermes Deliverable Mode extension allowlist; source files such
as `.py` and `.log` are excluded. Paths in ordinary prose, quotes, code, lists,
blockquotes, reasoning and untrusted tool content do not assert automatic delivery.
User/system messages and tool bodies never trigger automatic extraction.

Automatic candidates pass the native Hermes download boundary before cards or
index entries appear. `HEAD /files/download?path=…&profile=…&session_id=…` reuses
that boundary, probes readability without transferring contents, and returns
canonical identity in `Content-Location` with the native MIME type. The index
uses the same validation in process. Canonical aliases and repeated updates are
deduplicated; missing, denied and unsupported targets leave response text intact.
Home expansion, sandbox translation, remote adapters, profile/session checks and
sensitive-path restrictions belong to the runtime. Preview and download recheck
access, so later filesystem changes can still make a delivered file unavailable.
Live, resumed and saved assistant turns use the same parser and validation.

Explicit `MEDIA:` delivery directives and existing `Attached file` /
`Attached image` annotations retain their existing behavior. Markdown images with explicit `MEDIA:` sources
(for example `![Chart](MEDIA:/opt/data/chart.png)`) use the same authenticated
artifact preview flow. Ordinary HTTPS Markdown images remain inline images.
MEDIA parsing retains quoted paths, spaced media
filenames, unknown formats, and extensionless files; no extension eligibility
filter is used for explicit delivery. `file:`, `sandbox:`, and `#media:` links,
ordinary URLs, screenshot labels without delivery markers, and arbitrary producer
output fields do not assert delivery. Standalone `@file:` references remain text unless
an upload annotation supplies a card and hides the redundant context reference.
Fenced source code remains intact.
Completed, successful tool outputs use the same explicit delivery rules regardless
of tool name. Only a top-level `media_tag` or explicit multimodal `meta.media_tag` envelope
asserts tool delivery. Terminal stdout, nested result strings, untrusted wrappers,
and arbitrary structured output fields remain data. Tool input arguments, failed blocks,
and incomplete blocks never produce cards. Explicit deliveries retain available
file metadata. User upload/image-content cards and authenticated session/profile
retrieval remain unchanged.
`GET /artifacts?profile=…&project_id=…&limit=50&cursor=…` returns
`{files: Artifact[], nextCursor: string | null}` from the shared SQLite index.
`project_id` and `cursor` are optional; `limit` accepts 1–100. Cursors are scoped
to the profile and Project and order by creation time, session and path descending.
Invalid page sizes or cursors return 422. Responses are private/no-store.
The route inherits dashboard authentication and hosted-profile boundaries.
An empty index returns immediately while background indexing continues.
Global and Project library views request only the first page and provide Load
More and Refresh. The browser no longer discovers artifacts from histories.
Background reconciliation uses authoritative profile histories and native Project
membership; see [architecture](architecture.md#shared-sqlite-state-and-artifact-library).
`GET /artifact-images/{session}/{message}/{part}?profile=…` resolves legacy
multipart raster image addresses from owning-profile history; `download=true`
returns an attachment. Inline image bytes are never persisted in the index.

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
Missing native handlers return 501. Deleting a file removes its indexed cards
and persists suppression metadata so reconciliation cannot restore them. Historical
conversation references remain; subsequent preview/download reports it unavailable.
The deletion adapter awaits the reviewed pin's async handler and runs synchronous
release handlers in a thread pool with the request/profile context preserved.
Index removal and suppression follow successful native deletion; denied or failed
native operations retain their indexed entries.

Raster images have thumbnails and a larger viewer; PDFs and browser media use
browser viewers. Source/text formats, including HTML and SVG, display as escaped
text. Unsupported formats retain an explicit download link. Preview resources
are revoked and requests aborted on close or unmount. File type icons are
vendored from the MIT-licensed dmhendricks/file-icon-vectors vivid collection,
with its license and attribution in `src/assets/file-icons/`.

## Manual session tracking

`GET /session-tracking?profile=…` returns `{tracking, sessions, aliases?}`. `aliases` maps compression ancestor IDs
to their current tracked continuation, so cached history pages deduplicate after
rotation too. Tracking rows
contain `session_id`, `status` (`open` or `settled`) and UTC `updated_at`;
missing rows mean untracked. `sessions` contains visible Open session summaries,
including sessions beyond history pagination. It reads profile-local picker
metadata, never transcripts or runtime viewers. Responses are private/no-store.

`PUT /session-tracking/{id}?profile=…` accepts exactly `{status}` and returns the
saved tracking row. It validates profile membership and resolves continuation
IDs. Repeating a status preserves its activation timestamp. Only confirmed
ChatHermes session creation automatically inserts Open metadata; prepare calls,
conflicts, resume, messages and turn completion never reopen a chat. Explicit
ChatHermes branches start Open independently of their parent's status.

Archive retains metadata and removes the session from visible summaries.
Confirmed successful deletion removes its metadata, including tracked ancestors
and native deletion targets captured before lineage edges disappear. Compaction reconciliation transfers status and timestamp to
the native resume target, excluding branch/delegate/reset/tool children. If both
IDs already have metadata, the most recent explicit update wins. These routes
never interrupt, close, archive, delete, or move a native session.

## Managed Inbox

All routes inherit dashboard authentication and return private/no-store responses.
All-profile queries are bounded by the server's accessible profile set; a hosted
plugin process only sees its owning profile. No push subscription is required.
The browser routes All-profile Inbox reads and delete-read operations explicitly
through `profile=default`, regardless of the selected UI profile. Profile-filtered
reads and individual item mutations use the owning profile's route. Hermes strips
the routing profile before secondary-host IPC; those hosts still recover their
process identity and cannot read or mutate another profile's notifications.

- `GET /inbox?scope=all&profile=…&limit=50&cursor=…&unread=false` returns
  `{items, unread, byProfile, nextCursor, revision}`. `revision` changes when collection, read state or deletion changes in this scope. `scope=profile` selects the request
  profile; `all` is the default. Counts cover all unread items in that scope,
  independently of pagination. Limits are 1–100; invalid limits/cursors/scopes
  return 422. Items carry `id, profile, session, event_id, kind, occurred, title,
  preview, read`; time is Unix seconds. Pages order by time and ID descending.
- `PUT /inbox/{id}/read?profile=…` idempotently marks one accessible item read,
  returning `{read: true}`; missing, deleted or inaccessible IDs return 404.
- `DELETE /inbox/read?scope=all&profile=…` deletes read notifications in the
  selected scope, returning `{deleted: true}`. Durable identity tombstones
  prevent replay from recreating them. Unread notifications are preserved.
- `DELETE /inbox/{id}?profile=…` deletes one accessible notification, read or
  unread, returning `{deleted: true}`; missing or inaccessible IDs return 404.
  The shell uses this after successful chat opening through any navigation path,
  on final assistant messages, on native recovery and during visible count refreshes.
  It pages through the owning profile and matches the exact session.

Kinds are `turn.complete`, `approval`, `clarify` and `attention`.
Only the latest notification per profile/session is visible, across all kinds;
new events replace older items. Subagent sessions are excluded.
Notification mutations do not answer, cancel or resolve native requests and do
not change Web Push receipts. See [architecture](architecture.md#managed-inbox)
for collection, initialization and recovery bounds.

For Kanban worker sessions, the authenticated session detail response adds
`kanban_task: {board, task}` (or null) to the session inside the
`{object: "hermes.session", session: {…}}` envelope. This resolves a unique persisted
`task_runs.metadata.worker_session_id` across active boards using read-only
storage. It does not use a task's originating `session_id`, which names its creator
chat. Inbox opening verifies the task through the Kanban API, then opens
`/kanban?board=…&task=…` in the owning profile. Missing or ambiguous links stay
unread. Opening a resolved task enables the optional viewer after a successful
availability check.

## Optional Kanban frontend

`src/features/kanban/` calls the existing authenticated, same-origin
`/api/plugins/kanban/` API directly; it does not use the chat gateway, add Python
routes, or persist task data. The contract was reviewed against Hermes
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and the upstream Desktop Kanban
[`api.ts`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/apps/desktop/src/plugins/kanban/api.ts),
[`types.ts`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/apps/desktop/src/plugins/kanban/types.ts),
`board.tsx` and `drawer.tsx`.

The global browser preference `chathermes.kanban-viewer` defaults false. A valid
`GET /boards` response gates enabling and navigation. Probes run on mount,
foreground/online transitions, and every 30 seconds while visible. Recheck is also
explicitly available in Settings and the unavailable viewer. The browser has one
same-origin backend, not Desktop's connection registry. Requests intentionally use
the dashboard's launch backend scope, independently of ChatHermes's chat profile.
A remount probes again; no remote gateway credentials or connection management are
introduced. Plugin/auth failures fail closed without displaying server error bodies.

The selected board is browser-local (`chathermes.kanban-board`). All board reads,
task writes, comments, attachment operations/downloads, logs, dispatch nudges and
event connections carry an explicit board slug. No request calls `/boards/{slug}/switch`.
`/workflow` supplies manual move targets, further restricted by `drag_target`;
without that contract moves are disabled. Hermes validates the transition and owns
all worker/dependency rules. Successful task writes nudge the existing `/dispatch`
endpoint, as Desktop does; they never implement an executor or retry an uncertain
write. Conflict messages are generic and retain the current task for inspection.

Board snapshots (`/board`) provide columns and `latest_event_id`. Detail collections
are siblings of `task` on `/tasks/{id}`. Events connect to
`/events?board=…&since=<snapshot-or-frame-cursor>` through the host SDK’s
`buildWsUrl` (fresh gated ticket or loopback credential on each dial), invalidate
reads, and reconnect
with bounded exponential backoff and the last received cursor. Eight-second
snapshot/detail polling remains active as fallback. Board changes, disabling,
hidden documents and unmount abort reads, close the socket and clear timers;
obsolete callbacks cannot apply another board's data. Foregrounding refetches the
snapshot before reconnecting. Task details remain inspectable with their drafts
across background/foreground changes. Attachments use `FormData` with the native
`file` field; absent attachment support hides its controls. Logs read at most the
last 16 KiB.

The current vertical slice does **not** claim full Desktop parity: see the
[user guide](../user/features.md#kanban-viewer) for controls retained in Hermes.
No unsupported control is shown as a stub. Board transfer uses backend filesystem
paths and Desktop native pickers; a browser implementation needs a reviewed UX and
integration coverage. Orchestration/profile edits and AI-assisted task helpers
need deterministic fixtures for their auxiliary-model and worker side effects
before being exposed. Advanced execution controls and diagnostic actions likewise
need real-worker lifecycle coverage. These remain follow-up work, not changes to
Hermes core.

### Native slash commands

`commands.catalog` and `complete.slash` use the authenticated native socket and
explicit profile. Existing sessions use their membership-checked viewer's runtime
ID, never an ambient/previous session. Draft reads open a short-lived gateway
viewer without `session.create` or `session.resume`. The wire schema rejects `cwd` and `cwd_explicit` on discovery (error 4000),
even though an internal `_completion_cwd` helper reads those fields. Project
drafts therefore show explicitly labeled profile-level suggestions only. On Send,
the existing Project creation path first establishes the authoritative workspace;
the command is resolved again against that session before execution. Project-local
skill discovery before creation is an upstream contract limitation. Unknown/deleted
profiles and untrusted project skills retain upstream refusal/trust behavior.

The Vue completion owner discards stale text/scope responses, preserves native
ranking, uses `replace_from` for argument insertion and keeps native metadata.
Each edited request reloads the catalog rather than retaining a cross-profile
cache; reopening/typing refreshes after external skill/plugin changes. No polling
or frontend extension registry is introduced. Catalog warnings are shown in a
sanitized generic form because upstream exception strings can contain host data.

Composer argument stages follow catalog `argument_mode` with the pinned Desktop
overrides for local compression, title, steering and reasoning. Command selection
advances into finite/mixed arguments; text arguments close the menu. Exact typed
matches win over implicit fuzzy highlights for Space/Enter, deliberate arrow
selection wins, and Tab accepts the highlight. Mixed prose keeps Space/Enter's
ordinary meanings unless Enter follows deliberate navigation. Completed finite
arguments do not trap submission when the gateway omits their exact match.
Directive pills replace the accepted invocation in the visible draft. The native
textarea edits only its suffix; dispatch still uses the complete canonical draft.
Activating a pill or pressing Backspace at the start restores the invocation and
selects it for native editing/deletion. Scope changes invalidate chip metadata.
Submission, IME, attachments and mobile newline behavior retain their existing paths.
Mid-message completion offers native skill references only and preserves suffixes;
it does not turn prose into a command invocation. Scope changes invalidate the
presentation metadata as well as in-flight suggestions.

`commands/slash.ts` classifies execution separately from discovery. The generated
`gateway-parity.ts` is an execution boundary from the reviewed shared-gateway
parity table, not a command catalog. Regenerate with
`node scripts/sync-command-parity.mjs` after reviewing a new source pin; verify
with `--check`. The legacy worker supports more terminal operations than that
boundary, so catalog/Desktop availability and subcommand metadata further narrow
execution. Commands requiring missing client UI remain visible with limitations.
This does not claim complete Desktop parity or canonical runtime support.

A small client mapping owns catalog help, native compression, legacy native retry
resolution, title, stop and live reasoning reads/writes. `/reasoning` uses
`config.get`; effort and display arguments use `config.set` (session effort by
default, explicit `--global` supported). The pinned slash worker has no reasoning
side-effect mirror. Only confirmed effort writes replace a pending composer
effort; queries and display changes preserve it. Unsupported forms are refused.
Other permitted built-ins use `slash.exec`; directive
built-ins and extensions use `command.dispatch`. The pin's retry directive rewinds
and resolves its previous prompt server-side; the canonical Desktop rewind path
is not used on this supported legacy wire. Alias redirects are bounded. An RPC
failure never triggers an execution fallback or retry. `send`/`skill` directives
submit only through the existing upload/admission/retention path, with the gateway
`display` (or invocation) as the optimistic bubble, never expanded skill content.
The `/moa` directive already establishes a live one-turn route and post-turn
restore. Its admission omits composer model/provider/effort writes so that route
survives; the next ordinary turn applies the retained composer selections.
`prefill` returns text to the existing draft suggestion path. Goal/Plan controls
emit the same invocations. Session controls reconstruct authoritative settings and
history through the normal viewer lifecycle and refresh sidebar state.

An in-flight command coalesces Send. Profile, route, draft Project and session guards
prevent a stale directive from submitting into a new scope. Existing sessions own
their workspace in Hermes; late Project membership metadata does not invalidate
their commands or clear temporary results. Busy sessions refuse
slash Send; existing steering/Stop remain available. Attachments are preserved on
refusal and allowed only for known prompt built-ins and catalog skills, since an
exec-only result cannot consume them safely. `/help` and `/commands` also refuse
staged attachments and restore the unsent draft. Command-only results are bounded,
plain text and ephemeral; they create no transcript rows. A timed-out mutation is
reported as potentially unknown and never replayed. Hermes persists only what its
own operation persists, including any partial control effect before a later
prompt admission fails.

The reviewed legacy `command_discovery.slash_completions` exits its explicit
home scope after capturing skills/bundles, before invoking plugin and dynamic
argument providers in `hermes_cli/commands_completion.py`. ChatHermes filters
non-skill root suggestions against the scoped catalog and takes their descriptions
from that catalog, resolving aliases through its canonical keys. Missing or empty
descriptions never fall back to the unscoped completion metadata. It does not request the legacy dynamic argument providers for
`/skin`, `/personality`, `/tools` or `/handoff`; the menu explains the upstream
profile-binding limitation. Static subcommands and scoped stacked-skill completion
remain native. The gateway itself can still return unscoped plugin metadata in
its raw completion response; this frontend filtering does not repair upstream
RPC authorization or claim that the raw legacy API is profile-isolated.
The pinned completer also omits quick commands: matching catalog entries supplement
native results without reordering the native fuzzy matches.

The transcript extension also applies Hermes's native
`agent.skill_commands.describe_skill_invocation` to otherwise untyped user skill
payloads (including text parts with images). This supplies the projection that
native history has but Desktop REST omits. Typed/hidden rows retain their upstream
meaning, model-facing SQLite content is unchanged, and row identity, pagination
and mutation fences remain the same. No frontend skill-body parsing or local
instruction assembly is introduced.

Observed legacy retry limitation: a retried skill prompt can be persisted with an
untyped `[System: …]` wrapper containing the original invocation/body. Both the
pinned Desktop projection and this plugin hide that reserved scaffold row, so the
retried answer can remain without a visible durable user bubble after hydration.
The native retry still rewinds and submits its resolved prompt exactly once.
ChatHermes does not fabricate a persistent replacement user row or strip an
unknown wrapper to reconstruct the request. Native compression likewise owns the
replacement transcript; visible row counts are not a client guarantee.
