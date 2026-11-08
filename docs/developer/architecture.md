# Architecture

ChatHermes mounts Vue through the Hermes React dashboard plugin SDK. `main.ts`
creates an app per mount; `plugin-entry.ts` owns host integration and viewport
restoration. Each app installs a fresh Vue Router 4 instance. Every registered destination has a dedicated component in its feature’s `pages/` directory. There is no standalone application or global store.

## Runtime and server boundary

The Vue app mounts inside Hermes's React dashboard plugin SDK. Python routes in `plugin/chathermes/dashboard/plugin_api.py` inherit dashboard authentication, select the owning Hermes profile, and keep gateway credentials server-side. `plugin/chathermes/__init__.py` registers the plugin platform and Cron delivery; `cron_delivery.py` adapts persisted scheduled results. The browser uses the host's authenticated same-origin native TUI gateway, not REST run execution or a separate ChatHermes WebSocket server.

The composer starts a native Hermes session on first send. New Other and Project chats use the dashboard’s authenticated, same-origin native gateway WebSocket for creation, snapshots, approvals, clarification, guidance and Stop. Default and secondary profiles carry an explicit profile on each native operation. Legacy REST run pointers are ignored; saved session history remains available. Unknown submission outcomes are never automatically retried. Images retain authenticated originals and use native multimodal content; other files upload into the selected profile. Provider and model selects affect the session runtime without changing profile defaults. See [API contract](api-contract.md) for recovery bounds, attachment limits and unavailable stronger guarantees.

## Mobile shell and keyboard behavior

The persistent shell is a bounded `100dvh` flex frame. The header and empty
safe-area footer sit outside scrolling page content; the composer has zero bottom
margin. The footer reserves 12px on mobile or 24px on desktop plus the bottom
safe-area inset.

While the plugin is mounted, its viewport meta tag uses
`interactive-widget=resizes-content` and suppresses focus zoom. Unmount restores
the host’s original settings. The plugin does not opt into VirtualKeyboard
overlays, measure keyboard geometry, or maintain Vue keyboard state. Native
viewport resizing and the bounded content layout handle the available space.

On small screens and short touch layouts, textarea focus uses the compact grid:
the input and Send share a row, model/context/attachment controls hide, and footer
padding becomes 4px. Blur restores those controls and the normal footer spacing.
Desktop editing retains its controls; the context popover remains inactive while
typing. Textarea growth is capped at eight rows and at the available short-screen
height, with native overflow for longer drafts.

Desktop/mobile browser tests check focus, bounded scrolling, footer spacing, short
viewports and host-setting restoration. These are Chromium viewport tests, not
proof of native Android or iOS keyboard behavior; device verification is separate.

Mobile drawer opening uses local touch handlers on explicitly opted-in scroll
surfaces, including Home and Inbox message buttons. Vertical scrolling wins the
direction lock; other controls remain excluded. Completed horizontal drags use
the shared drawer thresholds and suppress the following click to avoid opening
a message accidentally. Ordinary message taps still open their destination.

## Where code belongs

| Location                              | Ownership                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/App.vue`                         | Persistent layout, sidebar, global chat actions and named router outlets                                        |
| `src/composables/useApplication.ts`   | Per-mount profile/session runtime, shared shell lifecycle and guarded asynchronous scope application            |
| `src/features/*/pages/`               | Route components: compose feature UI and own resource-specific requests and query state                         |
| `src/features/projects/composables/`  | Shared gateway-owned Project catalog/workspace state, mutations and event subscription                          |
| `src/features/scheduled/composables/` | Abortable page-owned reads and feature-local loading/action context                                             |
| `src/features/chat/components/`       | Persistent composer frame, route-rendered conversation, interactive request forms, user and assistant rendering |
| `src/features/chat/composables/`      | Live chat projections, submission/upload orchestration, runtime actions, composer gates                         |
| `src/features/chat/runtime/`          | Single native session owner, viewer, admission/recovery, assistant-turn reducer and reconciliation              |
| `src/features/chat/types/`, `utils/`  | Render entry union, pure transcript grouping, validated request adapter and user attachment display             |
| `src/features/sessions/`              | Session navigation presentation; scope transitions remain with the persistent application runtime               |
| `src/features/projects/`              | Project pages, editors, instructions and project helpers                                                        |
| `src/features/scheduled/`             | Scheduled list, job history and saved output; page-owned abortable reads                                        |
| `src/features/inbox/`                 | Global inbox presentation and notification types; collection and persistence stay server-side                   |
| `src/features/notifications/`         | Existing authenticated push subscription and mounted-session publication                                        |
| `src/features/settings/`              | Settings presentation                                                                                           |
| `src/components/`                     | Explicit-prop transcript and disclosure components, also used for saved output                                  |
| `src/services/`                       | Cross-feature authenticated API client and native capability gate                                               |
| `src/types/`                          | Shared Hermes domain types                                                                                      |
| `src/utils/`                          | Framework-independent Markdown rendering                                                                        |
| `src/assets/styles/`                  | Shared stylesheet and existing DOM/CSS contracts                                                                |
| `src/vendor/hermes/`                  | Pinned gateway contract and transport primitives; do not edit generated contracts                               |

`src/features/kanban/` owns the optional global availability/preference gate,
direct Kanban REST client, board/task Vue UI and board-owned event/poll lifecycle.
It uses the host SDK for event authentication; Kanban data stays in Hermes.

Do not create empty stores, views, artifacts, or shared composables
folders. Attachments currently belong to chat; scheduled output is a real feature.
Keep tests beside the code they exercise. App integration tests stay beside App.

## Dependencies and state

Use direct relative imports. Features may import shared services, types and
utilities. Scheduled output may use the explicit-prop transcript. Pure rendering
never injects live chat state or calls the runtime. Avoid shared modules importing
feature coordinators and avoid barrels that obscure ownership.

`useApplication` constructs `useNativeSession` exactly once and passes it to
`useChatController` with reactive scope inputs and guarded shell callbacks. The persistent application runtime retains creation, selection, cancellation and generation checks together.
`context.ts` provides one typed live context per app instance, with readonly view
refs and model setter commands. It exposes no viewer or mutable runtime error.
`ChatInterface`, `ChatConversation` and `LiveRequest` consume it. Arrays retain their reactive
identity; do not copy streamed data into snapshots or use module-global UI state.

`App.vue` keeps the shared header layout and controls. Fixed titles come from route
metadata; active Chat and Project pages supply their title and Project subtitle
from the existing guarded runtime state through `usePageHeader`. Project views
keep the title **Projects** and show the selected Project's name as the subtitle;
the Project list has no subtitle. Chat titles remain the conversation title.
The per-mount context accepts reactive getters, scopes each owner to its matched route record,
and only clears that owner on disposal. Reused parameter routes stay reactive;
late data or disposal from a departed page cannot replace the active header.
Header context does not select composer scope.

`ChatInterface` keeps its composer mounted below the default router outlet. Home shows a five-item global unread Inbox preview; chat pages compose `ChatConversation`. Other pages replace that route content. The composer key is `[profile, session, draftProject]`, never busy/loading state.
Drafts, attachment reads, editing, sizing and focus remain composer-local; gate
sending independently of editing. Keep standalone composer tests provider-free.

`ChatTranscript` owns scrolling, native toggle capture and image load updates.
`transcriptEntries` preserves history/live fallback rules without modifying or
reconciling runtime blocks. Assistant turn keys scope local block IDs; historical
turns receive their own working state. Empty runtime `blocks` fall back to saved
prose, images and tool output; nonempty structured blocks remain authoritative.
Saved pages use Hermes's Desktop REST selection and display projector. The plugin
adds profile checks, authenticated image addresses and a mutation fence, without
an independent order or compaction-marker reconstruction. Native snapshots supply
live state separately; partial saved tool commentary follows Desktop's correction
interval and prefix heuristics. Clone ordering, ambiguous equal identities and
multi-ancestor payload cost retain the pinned upstream limitations described in
the [API contract](api-contract.md#persisted-transcript-pages).
Work remains before text; `TurnWork` and
`ActivityRow` retain their disclosure state and `v-show` row instances. Thinking and tool bodies stay collapsed by default, including while active. Users can expand them to inspect arriving data; explicit manual toggles persist through streaming, completion and group toggles.

Request forms are keyed by `[profile, session, envelope ID]`. The adapter accepts
only known payload shapes and never displays unknown params. Forms own drafts
and pending state; clarification failures retain drafts, blank custom answers
fall back to selected options, and nonblank custom text takes precedence.
Callbacks capture scope generation and envelope identity before dispatch. Late
failures cannot overwrite a replacement request's state. Keep the first-open
request policy and the existing runtime answer transport.

## Guidelines for changes and AI agents

Start with the owning feature and its tests. Preserve public prop contracts and
DOM classes during extraction. Change runtime protocol/recovery separately from
presentation. Keep async guards with the state they protect; do not add another
viewer, Pinia, event bus, or dependency just to forward props. Keep route-specific state in pages and shared workspace data in the owning feature. Inject small typed feature contexts; do not pass a shared page-props bag or expose page component instances to the shell.

Follow [contributing](contributing.md) and [testing](testing.md) for validation and fixture rules.

## Navigation

Vue Router owns page selection through named hash routes under the host's exact
/chathermes pathname. src/router/history.ts implements the public RouterHistory
contract: metadata lives under history.state.chathermes; host usr and unrelated
fields survive replacements and pushes, while host idx/key follow traversal.
The adapter ignores navigation outside the plugin and destroys its listeners on
unmount. Only canonical hash routes select plugin screens and runtime scope. Outer query
fields belong to the host and are ignored by plugin routing. The host-owned outer
profile query remains: Hermes profile hydration otherwise drops hashes on traversal.
On the first document mount, plugin-entry recovers a canonical hash from Navigation
Timing if host hydration rewrote it before the app import; later host mounts do not
restore that original document destination.

The persistent application coordinator applies profile and session scope only when they change.
Screen-only navigation keeps the native viewer, ChatInterface and composer alive.
Project browsing is separate from session workspace membership; route parameters
never rewrite membership. Captured Vue Router route identities reject obsolete asynchronous results, including navigation away and back to the same URL; pending creation also retires immediately on a navigation command. Project home, artifacts, settings and instructions each render a dedicated page. Scheduled list, job history and saved output each own an abortable request through `useScheduledHistory`, including saved runs outside page one. Route resource/profile changes and unmount abort obsolete reads. Filters such as scheduled status, archived Projects and Inbox scope live in route queries.

The default `RouterView` renders page content. Named `actions` and `dialogs` outlets render feature-owned toolbar items and confirmations. Route metadata specifies shared titles, navigation sections, composer visibility and chat creation policy. The shell does not inspect a scheduled page instance or construct page-specific props. Scheduled actions and notification readiness share the feature’s current request state, which is cleared when its page unmounts.

Notification clicks prefer an existing ChatHermes window, focus it when allowed,
and send the canonical URL as `chathermes.navigate` over a MessageChannel. The
mounted app replies with `chathermes.navigated` and the requested URL only after
router scope application and session history or page-owned scheduled output loading, followed
by Vue rendering. Failed, superseded, or unmounted destinations cannot acknowledge
success and send no reply. Without a success acknowledgement, a ten-second timeout
falls back to `WindowClient.navigate(target.href)` in that same window. A missing,
rejected, or null navigation result falls through to `clients.openWindow(target.href)`.
Browser navigation fallback does not attest that content loaded.

The plugin registration keeps a notification bridge alive on host pages such as
`/sessions`, where Vue is unmounted and the scoped worker cannot navigate the
client. The worker offers the same message-channel handoff to every selected
same-origin client. On a host page, the bridge enters `/chathermes` through the
host's history/popstate contract and queues the original message and port. The
host profile query is constructed from the destination hash profile; the outer
profile in the notification URL is not authoritative. The Vue app receives the
queued destination on mount and uses `router.push`, the same scope and loading
checks, and the original acknowledgement port. No host history update acknowledges
success. Queued requests expire at the worker's ten-second fallback deadline;
newer requests replace pending ones. The bridge is reused across host profile
registration reloads, while each Vue mount connects and disconnects its own
handler. Inside the mounted plugin, all destination navigation stays with Vue
Router and preserves host-owned outer query/history metadata.
Settings stores a validated plugin-relative return_to destination. Notifications
use the same link resolver, and the worker produces and recognizes canonical
chat hashes with the existing visible-connected-viewer handshake.

The registered pages are:

| Route                               | Feature page                                 |
| ----------------------------------- | -------------------------------------------- |
| `/`                                 | `chat/pages/HomePage.vue`                    |
| `/chat/:sessionId`                  | `chat/pages/ChatPage.vue`                    |
| `/inbox`                            | `inbox/pages/InboxPage.vue`                  |
| `/artifacts`                        | `artifacts/pages/ArtifactsPage.vue`          |
| `/projects`                         | `projects/pages/ProjectsPage.vue`            |
| `/projects/:projectId`              | `projects/pages/ProjectHomePage.vue`         |
| `/projects/:projectId/artifacts`    | `projects/pages/ProjectArtifactsPage.vue`    |
| `/projects/:projectId/settings`     | `projects/pages/ProjectSettingsPage.vue`     |
| `/projects/:projectId/instructions` | `projects/pages/ProjectInstructionsPage.vue` |
| `/scheduled`                        | `scheduled/pages/ScheduledListPage.vue`      |
| `/scheduled/:jobId`                 | `scheduled/pages/ScheduledJobPage.vue`       |
| `/scheduled/:jobId/:runId`          | `scheduled/pages/ScheduledRunPage.vue`       |
| `/settings`                         | `settings/pages/SettingsPage.vue`            |

## Projects and native workspace ownership

Projects use Hermes's `projects.tree` gateway RPC, including automatic repository
Projects and Home. Selecting a Project loads its fully hydrated
`projects.project_sessions` hierarchy and displays its recent chats. The URL alone selects composer scope: `/chat/:sessionId` resumes an existing
session, `/projects/:projectId` starts a fresh project draft, and `/` starts a fresh
unscoped draft. Other routes hide the composer and select no session. Session and
project query parameters have no scope meaning and are never propagated. Existing
session membership comes from the backend Project catalog, including after refresh
and browser history navigation. Detaching the browser viewer leaves backend work
running.
Other chats remain available. Hermes owns all membership and Git/worktree grouping.

The Projects list hides entries marked `isAuto` by default. Its **···** menu
switches between active and archived lists. The sidebar **Projects** link returns
to the archived list while browsing an archived Project (including its artifacts
and editors), using the backend archive state after reload; active Projects return
to the active list. While details are pending, the link uses the current profile's
catalog entry matching the route's Project ID. Loaded matching details take
precedence over the catalog. On the list itself, the link preserves its current archive filter.
The menu also
persists the browser-wide `chathermes.hide-automatic-projects` preference across
profiles; only the stored value `false` disables the filter. Filtering is confined
to list presentation, leaving the authoritative catalog, session membership,
selected hierarchy and direct navigation intact. If storage is unavailable, the
preference remains usable for the current mount.

**New Project Chat** appears on Project home and in an open chat with a selected
Project. It creates a distinct chat in that selected Project. **New chat** in an
open chat still starts an unscoped chat; on Project home it retains scoped creation.
Scoped creation uses the Project path, then its first repository path, resolves the
workspace with `config.get` under the owning profile, and creates a native
`session.create` draft with `source: 'desktop'` and the resolved workspace `cwd`. No
`project_id` is sent to session creation. A pathless Project cannot start a chat;
Home starts a chat without a Project workspace. Native draft IDs are persisted through the authenticated profile API before attachment. An unavailable workspace fails before creation.

Opening another Project changes UI scope while retaining the current chat and
its workspace. Existing sessions always resume with their own saved cwd. Native
`prompt.submit` turns use one Vue session controller with direct native events,
shared Hermes request correlation/heartbeat, and native snapshot recovery. A healthy
connection stays attached while the page is hidden. Offline recovery reconstructs
the selected profile/session without resubmitting a prompt; a server-side native viewer retains execution when the browser leaves. Completion push uses durable per-device receipts for committed transcript rows. Models apply to the native runtime; uploads stay authenticated and profile
scoped.
Hermes discovers context files normally; the plugin injects no Project prompt.

Project/session change events, reconnect, foregrounding, completion and profile
changes refresh the tree and selected hierarchy. No separate Project database,
frontend path classifier, or active Project mutation exists. Project management
and session moves remain in Desktop/CLI for this initial workflow.

The shared wire types target Hermes 0.22.5 at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. Workspace
creation sends `cwd_explicit: true` under the pinned native contract. Unsupported
native creation fails closed; it is never retried after an ambiguous outcome. See the
[source audit](../internal/plans/2026-10-01-projects.md),
[verification report](../internal/verification/2026-10-01-projects.md), and
[test environment instructions](../../tests/docker/README.md).

## Scheduled history adapter

The drawer's Scheduled screen groups persisted cron history by job in the
selected Hermes profile. Active, Paused and Completed filters lead to dated
runs (newest first), with older pages available and saved results on selection.
Saved results show only the final nonblank assistant response without thinking or
tool disclosures; runs without an assistant response fall back to saved Markdown.
Reloadable job/run links stay within dashboard authentication. **Resume Session**
in screen options opens the persisted session when one exists.

The adapter follows the pinned Hermes dashboard contracts:
`web_server_cron._cron_profile_home`, `_call_cron_for_profile` and
`_cron_store_scope`; `SessionDB.list_cron_job_runs` and `get_messages_as_conversation` with resume
lineage and compacted display history; and the
native cron output filename/timezone and session reconciliation helpers. The
profile-scoped execution ledger supplies failed runs without saved output. It
reads retained history rather than the transient gateway Runs buffer, pages
beyond the native dashboard's 100-run cap, checks exact job/run ownership, and
returns a compatibility message when these helpers are unavailable. Deleted
jobs or pruned output cannot be recovered. Scheduling and job mutation remain
in Hermes's native dashboard.

## Shared SQLite state and artifact library

`dashboard/database.py` owns `state/chathermes.sqlite3` under Hermes's persistent
state root. Short-lived, thread-local connections use WAL, a 10-second busy
timeout, foreign keys, private permissions, and ordered `user_version` upgrades.
Transactions commit on success and roll back on failure. Completion addresses
and per-device delivery receipts share this database with artifact metadata;
there is no migration from the former development outbox database.

`session_tracking.py` owns the profile/session Open and Settled metadata table.
A missing row is untracked. Confirmed ChatHermes creation inserts Open once;
manual status updates are idempotent and preserve activation time unless status
changes. Native continuation resolution migrates metadata transactionally and
keeps the newest explicit status when IDs converge. Archive only hides the
summary; confirmed deletion removes metadata. Tracking never owns execution.
App loads tracking with each history page and merges older Open picker summaries
without advancing the history offset. The sidebar splits Active (activation
order) from Recents (Hermes order), deduplicates IDs, and supports optimistic
manual transitions with profile guards and rollback. Pending writes protect their
local projection from metadata refreshes. No sidebar operation loads transcripts.

`useSessionActivity` owns sidebar working state for the selected profile, separate
from manual tracking and Inbox unread state. The existing native viewer publishes
guarded snapshots and turn lifecycle events; detaching a viewer
does not finish background work. A minimal authenticated launch-host registry
projection restores other sessions on navigation, return, reconnect and visible
polls. Profile changes clear synchronously; generation and per-session event
revisions fence late snapshots across native compression lineage IDs. Legacy
idle snapshots defer to the profile-owned durable ledger check; forwarded owner
work and failed ledger reads remain unknown rather than authoritative idle.
Confirmed native working/waiting stays busy despite ledger uncertainty.
Lineage completeness is tracked separately from activity status. Incomplete
snapshots retain previously verified runtime aliases only while the current
lookup key still belongs to that profile's prior group; profile changes, runtime
absence, unrelated identities and complete replacement groups clear those aliases.
Root completion therefore clears its continuation even after a failed lineage
read reports confirmed working/waiting. Canonical
owner lookup validates receipt lineage on the same read snapshot as compression
aliases and pending work; inherited chat IDs cannot join unrelated children.
See the [activity contract](api-contract.md#sidebar-session-activity)
for ownership and transport limits.

`artifact_store.py` keeps feature SQL separate from infrastructure. Each indexed
session is replaced transactionally, alongside its successful checkpoint. The
unique `(profile, session, path)` identity preserves first-reference deduplication.
Only metadata and addresses are stored, never file contents. Legacy inline images
use authenticated addresses back into Hermes history. Confirmed ChatHermes file
deletions persist suppression markers because history retains the old references.

`artifact_indexer.py` starts in the background and uses three history workers.
Startup and approximately 60-second reconciliation discover sessions through the
profile's pinned REST API and obtain Project membership through native RPC.
`last_active`, message count, title and membership identify changed sessions;
an hourly per-session audit catches missed changes. Uploads and committed native
turn completions wake reconciliation. Pending session work is deduplicated;
failures retain existing metadata and retry. Missing list entries are removed
only after an exact session lookup confirms 404. No SQLite transaction spans a
Hermes request or message parsing. Shutdown cancels and joins the service tasks.

Artifact queries never fetch histories. The shared global/Project Vue component
requests 50 indexed records initially, appends pages through Load More, resets on
profile/Project changes, and aborts obsolete requests. SQL filters scope and uses
newest-first keyset pagination with session/path tie breakers. Refresh reads the
current index while background indexing continues. A responsive CSS Grid fills
available width; the bounded page scrolls vertically.

## Managed Inbox

`dashboard/inbox.py` owns notification records and reconciliation in the shared
SQLite database. The dashboard router starts and stops one worker independently
of browser mounts and push subscriptions. It discovers the same accessible profile
set as artifact indexing (one profile in a hosted plugin process), reads native
profile histories through short-lived read-only connections, and inspects native
open request snapshots without attaching or activating sessions. No session
execution or request resolution is owned by Inbox.

The shell's Inbox refresh reads every unread page into a profile/session map for
sidebar indicators, alongside the global count and revision. It replaces the map
only after a complete, non-aborted refresh and retains the last snapshot on
disconnect. Sidebar titles and dots use only the selected profile's session IDs;
they do not affect session grouping, selection, tracking or execution. Existing
Inbox receipt, mutation, foreground and polling refreshes keep both views in sync,
and a fresh mount rebuilds the indicators from persisted Inbox state.

Retained native viewers call the inbox recorder separately from push enqueueing.
Committed responses use Hermes message UIDs (row identity on older histories),
including deduplication across compaction copies; requests use their original
request/operation identity within the owning profile/session. Read and deletion
state survive duplicate frames, reconciliation and restart. Deletion retains an
identity tombstone. Push receipts and visible-chat suppression remain independent.
Only the latest event by occurrence time (then inbox ID) remains visible per
profile/session, across completion and attention kinds. Superseded events retain
tombstones, including during upgrades, so delayed history and replay cannot
replace newer notifications or resurrect deleted ones. Delegated sessions are
excluded using Hermes's `subagent` source and `_delegate_from` model configuration
marker; reconciliation also removes their previously collected items. Ordinary
continuation sessions remain eligible.

Each profile has a durable first-discovery time. Older responses are skipped;
existing unresolved requests may still appear. The worker checks profiles every
30 seconds, skips running native sessions, scans changed history after durable row
checkpoints, and audits unchanged sessions every five minutes to recover late
persistence. History includes archived conversations and continuation segments.
Only final persisted assistant prose per turn becomes a completion item; tool
calls, tool output and compression summaries are excluded. Request previews use
fixed labels for secret/sudo/connection requests and retained terminal failures;
request prompts, commands and raw errors are not stored. Response/title previews redact configured provider and gateway
credentials before storage. Previews are bounded to 400 characters.

Dashboard entry opens Home with the latest five unread messages across accessible profiles.
Removing a notification uses its owning profile, leaves the chat unopened, and
refills the Home preview. The full Inbox retains its All/Profile route filter and
pagination, with the same removal control.

The Vue Inbox is a shell page showing unread notifications. The shell polls
every 15 seconds while visible, allowing an active unread scan to finish across
poll ticks. Foreground, mutation and native completion/project refreshes supersede
older scans. The badge uses server counts. Opening an
item verifies the owning session and waits for navigation/attachment. Every
successful chat navigation deletes that profile/session's notifications, paging
through both read and unread items. Final assistant messages, native recovery and
visible count refreshes repeat the check; failures remain retryable. The shell
also republishes its current session to the push worker, which independently
verifies a visible, connected client before closing exact profile/session matches.
Other devices observe shared changes on their next refresh.
Resolved requests are not inferred from notification read state. Requests that
vanish from the runtime before collection have no durable native history to replay.
