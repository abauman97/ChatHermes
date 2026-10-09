> Recovered implementation plan and historical record from `7cda324`. Integration into `8362593` preserves Scheduled and the instance-scoped, provider-agnostic Docker launcher; no Compose workflow is used. See [current integration verification](../verification/2026-10-04-persistent-tui-integration.md).

Historical plan: REST Runs chat execution, its drain adapter and chat SSE routes
were removed on 2026-10-09. The current [API contract](../api-contract.md)
supersedes transport and recovery guidance below. Scheduled-job history is retained.

# Persistent TUI gateway chat refactor

Status: bounded native migration implemented, 2026-10-04; final verification
recorded separately (104 unit, 62 API, 7 Docker, 84 pinned native checks,
real runtime probe, 16 socket/HTTP integration cases and 34 desktop/mobile
visual cases with clean size-specific exits). Exactly-once admission, atomic snapshot/replay and unlimited
offline ownership remain outside the pinned protocol. The user's continuation
request authorizes this maximal safe mode without an owner/lease feature.

## Implementation record (2026-10-04 continuation)

- Stage 1: source/archive/base-image pins retained, isolated named-volume fixture
  retained. Focused probes demonstrate the replay interleaving and missing
  idempotency receipt, plus the safe public `queued:true` busy-send alternative.
  Actual provider/runtime probes verify cold-build model selection, vision input,
  durable image references and byte-identical original image retention.
- Stage 2: profile-bound authenticated native viewer facade implemented on the
  existing dispatcher and additive native fanout. Host tickets, Origin/identity,
  profile membership, typed allowed operations and open-request ownership are
  checked. No long-lived owner or lease was introduced.
- Stage 3: native controller used for all new Other/Project turns. In-memory
  applied event cursors and replay/live holds recover bounded reconnects;
  snapshot replacement honestly warns about missing partial activity. Metadata
  only outcome-unknown markers persist before admission and gate sending after
  lost acknowledgement; native prompts never silently fall back or retry.
- Stage 4: existing renderer now handles native tool/thinking/status and
  answerable approvals/clarifications, explicit steer/stop and restored images.
  Native model selection is verified before admission. Composer stays focusable.
- Stage 5: `mode: native-bounded`, `admission: true` with all three stronger
  guarantees explicitly false. Existing real REST run pointers drain unchanged;
  history remains Hermes-owned and compatibility endpoints are retained.

The public read-only `approval.pending` query safely waits for a cold native
agent build before session model switching. A switch applied before build could
otherwise be overwritten by captured defaults. Model switches are checked
against native state; an external Desktop mutation is still not atomically tied
to prompt admission. A gateway alias with different endpoint/credentials is
rejected. Multipart images avoid session-global attachment queue mutations;
the actual pinned vision preprocessing and saved text projection are verified.

`queued:true` prevents ordinary busy sends from becoming steering/redirects.
It does not add exactly-once admission. Stronger guarantees require an upstream
transaction linking an idempotency key/receipt to the durable admitted user row,
and a snapshot epoch/sequence watermark captured atomically with replay bounds.
Viewer detach retains Hermes's 20-second grace with activity-based deferral,
not a plugin lease or guaranteed long offline turn lifetime.

[API contract](../api-contract.md) records current behavior;
[verification](../verification/2026-10-04-native-gate.md) records precise results
and limitations. This continuation began with the existing dirty main tree as
intentional prior work. No commit or push was made.

## Original architecture proposal and acceptance targets

The remaining sections preserve the original proposal and source audit. They
are historical design targets; any stronger guarantees or owner/lease stages
below are superseded by the bounded implementation record above.

## Objective and boundaries

Move new ChatHermes turns, including Other chats and Projects, from the Runs API to the persistent Hermes TUI session runtime over JSON-RPC, exposed through an authenticated same-origin dashboard plugin WebSocket. Recover an existing turn after reload, navigation, network loss, or mobile suspension without submitting its prompt again. Bring the browser chat surface into parity with the Desktop chat protocol while preserving the simple mobile interface.

ChatHermes remains a Hermes dashboard plugin: Vue mounts through the React SDK in `src/plugin-entry.ts`. No standalone app, connection settings, browser API keys, cross-origin gateway calls, new agent runtime, or replacement session database. “Persistent” means session/runtime ownership outlives a browser viewer; it does not promise uninterrupted execution across a Python process death or unlimited event retention.

## Evidence and current behavior

### Source provenance

The source pin is `3632f9173d218fd24f3fa595d7affa159b0774cd`, declared in `tests/docker/Dockerfile`. The Dockerfile verifies the archive SHA-256 `e62be810520c1fe592b82661c0dfacfff29c52efae529840f78c78551c07b384` and overlays it on `nousresearch/hermes-agent@sha256:cdcda342ff2b3919eaa7b3dbd7c5178b7b7676db62ddac273af2b921e9be4aa3`.

Investigation used the existing scratch extraction `/tmp/chathermes-issue10-source` and verified its adjacent archive `/tmp/chathermes-issue10-source.tar.gz` against that checksum. Reads were confined to relevant gateway, dashboard, Desktop/shared-client, and test modules; unrelated vendor trees were not scanned. Scratch paths are investigation locations, not dependencies to add to the repository. Upstream paths below refer to that revision and can be located under the [pinned Hermes source tree](https://github.com/NousResearch/hermes-agent/tree/3632f9173d218fd24f3fa595d7affa159b0774cd).

There is a test-environment discrepancy to resolve during implementation: `compose.yml` currently names `nousresearch/hermes-agent:latest` with `pull_policy: always`, whereas `tests/docker/run.sh` explicitly builds the pinned Dockerfile as `chathermes-test:3632f917`. The contract docs describe a pinned compose environment. Future verification must use a compose build/override that actually selects the pinned image, retain the digest/archive pins, and record the effective image/source. Do not infer the runtime from the compose comments alone.

### ChatHermes today

| Surface                | Implementation and implications                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Regular chat           | `src/App.vue` uses `api.startRun`, then `followRun`; `src/lib/hermes-api.ts` posts `/v1/runs` and reads status/SSE through `/api/plugins/chathermes`. The Python proxy adds profile-specific credentials.                                                                                                                                                                                                                  |
| Recovery               | `src/lib/active-runs.ts` stores profile/session run pointers and idempotency keys, never transcript or attachments. `App.vue` deduplicates `seq`, resumes with `last_seq`, restores history on terminal status, and locks uncertain/missing runs. Navigation aborts the viewer, not admitted Runs work.                                                                                                                    |
| Models and attachments | Sanitized provider inventory and gateway model routes feed the picker. Runs wraps image parts in a user message array. `/uploads` stores generated filenames in the chosen profile, with a 20 MB decoded limit.                                                                                                                                                                                                            |
| Project chat           | `plugin/chathermes/dashboard/plugin_api.py` already dispatches `tui_gateway.server.dispatch` in-process using `_RpcTransport`; no upstream WebSocket or bearer transport is necessary for these calls.                                                                                                                                                                                                                     |
| Project creation       | Native tree/detail, workspace resolution with `config.get`, and `session.create`, including `cwd_explicit`; the durable `stored_session_id` is used in browser URLs. Empty drafts have no REST DB row until a prompt.                                                                                                                                                                                                      |
| Project viewer         | `/project-events` registers a live transport and optionally resumes the selected draft to keep it alive. Project navigation does not move a session's workspace.                                                                                                                                                                                                                                                           |
| Project send           | `_workspace_resume` → session-scoped model `config.set` → optional `image.attach_bytes` → `prompt.submit`; events become SSE with a synthetic `workspace-<stored_id>` run ID.                                                                                                                                                                                                                                              |
| Project recovery gaps  | `_workspace_events` projects only the assistant snapshot, ignores native replay sequences, and terminates on approval. `_workspace_run` reduces state to running/completed. `_workspace_frame` discards approval/clarification request identity and choices. The client requires resolving workspace approvals elsewhere and hides guidance for workspace runs. A synthetic ID identifies a session, not successive turns. |
| History                | Persisted chats use paginated REST Sessions history, retaining full tool output and attachments; known native drafts fall back to `session.resume` only on initial history 404. Native display projection is less complete.                                                                                                                                                                                                |

`docs/api-contract.md` describes both contracts and bounded Runs recovery; `docs/verification/2026-10-03-runs.md` and `docs/verification/2026-10-01-projects.md` contain historical validation and limitations. They are evidence of previous work, not results for this refactor.

### Pinned native protocol facts

- `tui_gateway/rpc_dispatch.py::dispatch` binds the supplied transport, returns inline responses or schedules long handlers that write their response later, validates declared params, and accepts server-request response frames without a method. Reuse this dispatch boundary rather than creating another Hermes process per browser/request.
- `tui_gateway/contracts/sessions.py` declares `session.create`, `session.resume`, `session.activate`, `session.events.since`, `session.interrupt`, `session.steer`, and `session.redirect`. Resume takes the **stored** identity; its result supplies the **runtime** identity. Creation explicitly returns both. A resume result can include `running`, status, `inflight`, `queued`, `pending_approval`, `open_requests`, `todo_state`, and `auto_continue`, not just messages.
- `tui_gateway/methods_session.py::_resume_reuse_live_locked` reuses/attaches a live runtime; cold/deferred/eager paths rebuild it. Resume follows stored lineage and restores stored cwd/profile context. Runtime identity must be rebound after every authoritative resume, including compression/restart scenarios.
- `tui_gateway/contracts/prompt_voice.py::PromptSubmitParams` has no admission idempotency key. `prompt.submit` can return `streaming`, `queued`, `steered`, or `redirected`; `user_row_id` is present only when persistence of that accepted input is proven. Busy submission is an action, not an automatic conflict. A stale browser may accidentally steer/queue if it submits without server-side admission control.
- `tui_gateway/server.py::write_json` stamps session event notifications through `tui_gateway/event_replay.py`. Replay is per **runtime session**, process-local, and bounded: 512 events, 4 MiB per session, 64 retained session rings, 64 MiB across rings. `session.events.since {session_id, last_seen}` returns event **params objects**, `latest_seq`, `truncated`, `count`, `epoch`, and `open_requests` (`methods_session.py`). Do not interpret these as Runs envelopes or use `last_seq` as the native parameter.
- `tui_gateway/ws.py::handle_ws` uses the same dispatcher, announces `gateway.ready` with `replay_epoch`, registers live transports, starts backend heartbeat/orphan-sweep support, and supports `gateway.ping`. It is more than a socket read loop; a local plugin bridge must account for the relevant lifecycle setup.
- `tui_gateway/server_requests.py` carries bidirectional requests such as `approval` and `clarify`, identified by `srq-…` IDs. `client.capabilities {server_requests: true}` advertises support. Resume/replay returns unresolved requests; `request.cancel` withdraws them. Answers are JSON-RPC response frames with the original ID, not Runs `/approval` calls. The pinned server is not a substitute for plugin-side ownership checks on forwarded response IDs.
- `tui_gateway/session_transports.py` attaches viewers additively through `FanoutTransport`; detach removes that viewer without replacing another Desktop/browser viewer. Its foreign-login handling warns rather than enforcing login ownership. Shared dashboard access and profile isolation must therefore be treated separately from per-user session ownership.
- `tui_gateway/session_lifecycle.py::_schedule_ws_orphan_reap` is a material constraint: default disconnect grace is 20 seconds (`server.py`); fresh running activity/delegations can defer reaping, but stale detached turns can be interrupted and subsequently reaped. Socket persistence alone does not guarantee long offline recovery, especially at a waiting approval or silent provider/tool operation.
- `tui_gateway/turn_marker.py`, `session_auto_continue.py::_maybe_schedule_auto_continue`, and `session_reaper.py` support durable crash markers and best-effort transcript flush. Cold resume may schedule native continuation for a fresh interrupted turn under `desktop.auto_continue`, with a default maximum of two attempts. Explicit interrupt retires the marker. This is continuation after interruption, not replay of an unchanged process or exactly-once external tool execution.
- `apps/shared/src/json-rpc-gateway.ts` implements generation guards, per-session sequence deduplication, replay holds that park arriving live frames, epoch changes, and a history/replay barrier. `apps/shared/src/json-rpc-channel.ts` handles RPC correlation, capability advertisement, and replayed server requests. These are architectural references; adopting the entire Desktop package or its connection UI is unnecessary.
- The wire source is Python `tui_gateway/contracts/`; generated `apps/shared/src/gateway-contract.generated.ts` and `gateway-contract.openrpc.json` are useful for a reviewed subset of types. `contracts/events.py` declares richer message/tool/status/usage events than the existing SSE projection, including `tool.generating`.

## Architecture decision

Use a plugin-scoped WebSocket, provisionally `/api/plugins/chathermes/chat/ws`, with a small validated chat RPC facade. Internally reuse local `server.dispatch`, native session objects, native replay, native persistence, and fanout. Extract reusable transport/profile/redaction helpers from `plugin_api.py` without changing Projects behavior in the first stage. Keep ordinary authenticated HTTP routes for profiles, inventory, Projects administration, uploads, and complete saved history.

The browser uses a derived same-origin `ws:`/`wss:` URL, dashboard authentication, heartbeat and automatic retry internally. It receives no gateway address/key or user connection settings. Do not connect directly to the API gateway port, spawn `tui_gateway.entry` per tab, or create a reverse proxy to a separately configured TUI server.

Hermes already exposes `/api/ws`: `hermes_cli/web_routers/chat_ws.py::gateway_ws` authenticates and then calls `tui_gateway.ws.handle_ws`. This is the same engine as the Projects adapter, but it exposes the general RPC catalog. Prefer the plugin facade for method/schema/profile filtering, request ownership, safe errors, and plugin enablement. Simply calling `handle_ws` in an unguarded plugin route would expose arbitrary native methods and omit these constraints.

Authentication is a stage-one gate. `_mount_plugin_api_routes` in `hermes_cli/web_server_dashboard.py` mounts an APIRouter under the plugin prefix with `_plugin_route_secret_scope`; the auth and plugin runtime gates in `web_server.py` include **HTTP middleware**. Do not assume they protect a WebSocket upgrade. The host `/api/ws` uses `_ws_auth_ok`/`_ws_request_is_allowed`; gated authentication in `web_server_chat.py::_ws_auth_reason` consumes a single-use short-lived dashboard ticket/internal credential, rather than merely accepting the normal HTTP cookie. Reuse the host's authenticated ticket mechanism, preferably ticket subprotocols, and its identity/Host/Origin rules. Add equivalent plugin-enabled checks before accept and a policy for disabling an already-connected plugin. Tickets must never appear in logs or durable browser storage. Verify proxy/base-path behavior. If the pin cannot safely support the plugin socket, resolve that host integration first; do not ship an unauthenticated fallback.

### Runtime ownership independent of viewers

A browser-independent owner/lease is required if live testing confirms native orphan interruption prevents the desired offline interval. Propose a bounded plugin server transport attached only for admitted active turns and unresolved native requests; browser viewers are separate transports. It drops/delivers frames without maintaining a second transcript or replay ring, and keeps the native session live while the turn is legitimately active. Release it after terminal settlement, bounded history reconciliation, or explicit stop; use a separate bounded draft/viewer lifetime for empty sessions. It must survive viewer navigation/disconnect and must never call `session.close` to detach a browser.

This reuses the native transport contract, but is new ownership behavior, not something the existing request-scoped `_RpcTransport` already provides. Validate fanout and request routing: an owner with no browser must not falsely answer or decline questions, and forwarded answers must use an authorized attached transport. Start only the native lifecycle services needed, idempotently. Bound session counts, stuck operation lifetime and pending-request deadlines; expose sanitized operational counters. Avoid immortal agents/empty drafts. Evaluate a supported Hermes owner-lease API against private functions before finalizing; upstream support is preferable to disabling the global reaper for every consumer.

## Proposed API and client model

Names below are a proposed plugin contract, not claimed upstream methods. The facade translates stored browser identities to attached native runtime IDs and pins profile from the authenticated socket/context. It rejects arbitrary params/methods and JSON-RPC batches initially.

| Plugin operation   | Native operation and response policy                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capabilities/ready | Safe protocol version and supported chat/request features, replay epoch, bounded limits; independent of REST Runs capability flags.                                                          |
| create             | `session.create`, current profile defaults for Other chats; existing Project workspace resolution for scoped create. Return stored ID; hold draft viewer as necessary.                       |
| attach/resume      | `session.resume` with stored ID, `inline_images: false`, no cwd override; bind runtime ID and return typed snapshot/history references.                                                      |
| replay             | `session.events.since` for that attached runtime, with `last_seen`; validate/filter every returned event and open request.                                                                   |
| submit             | Validate body/attachments/model, apply session-only runtime model, then `prompt.submit`; return a correlation receipt and any native `user_row_id`. Serialize mutations per profile/session. |
| interrupt          | `session.interrupt`; acknowledgement means requested/accepted, await authoritative settlement.                                                                                               |
| guidance/redirect  | `session.steer` / `session.redirect`; show queued/redirected/rejected accurately, do not convert guidance rejection into interruption.                                                       |
| answer request     | Validated JSON-RPC result/error for an open request owned by this attachment/profile; dispatch with the corresponding authorized transport.                                                  |
| detach             | Remove only viewer membership. Release draft resources according to policy; never stop an admitted turn.                                                                                     |

Use typed domain states instead of `workspace-` prefixes: profile, storedSessionId, runtimeSessionId, epoch, attachment generation, turn/receipt identity, applied sequence, pending request set, runtime status, and transport status. “Reconnecting” is independent of “working/waiting/stopping”. Keep sequence state in memory with the transcript it describes. Durable browser metadata contains identifiers and uncertain submission receipts only; no prompts, files, transcript, secrets, ticket or provider auth.

Extract RPC transport handling to a client module and orchestration to a composable/state controller. `App.vue` should select profile/session, present state and delegate actions, retaining current URL and Project behavior. The renderer can reuse `assistant-turn.ts`, `ChatTranscript.vue` and `ActivityRow.vue`; adapt native events to a stable display model without pretending they are Runs states.

## Desired flows and recovery semantics

1. **Open existing chat:** resolve profile → authenticate socket → attach stored session → reconcile native snapshot with saved history → show pending requests and partial assistant/activity → release the initial send gate only after authority is known. Always inspect native state even without a local active-turn pointer: Desktop or another tab may have started work.
2. **New chat:** create native draft using profile defaults or the authoritative Project cwd. Record stored ID/URL; keep the draft attached while composing. Optimistic submission immediately renders sent user content, then activity, then arriving assistant content. Preserve focused, editable composer; gate send separately.
3. **Submit:** serialize model/image/submit steps against other mutations; validate all content before attaching any image. Model selection uses the current session-scoped `config.set` word syntax (`<model> --session --provider <slug>`) or a verified structured native alternative. Confirmation/deferred results prevent silent execution with another model. Verify native runtime inventory/state, not picker labels. Remove REST aliases from native choices unless proven to be supported runtime choices.
4. **Normal streaming:** apply native message, reasoning, tool-generating/start/progress/complete, status and usage events with stable tool IDs. Active disclosures expand as data arrives; completed ones collapse and remain inspectable. Separate interim messages and final message boundaries. Use final persisted rows to obtain complete outputs and attachments.
5. **Reconnect with retained display:** back off with jitter, bounded heartbeat timeout, and online/visibility wakeups. Reauthenticate as required; attach to the current runtime and compare epoch/identity. Park racing live frames before replay. Apply replay and queued live events through the same profile/runtime/generation/sequence checks, in order. A foreign event must not advance the cursor.
6. **Reload/fresh display:** reconstruct persisted rows plus the authoritative `inflight.user`, assistant, corrections and request state. Assistant snapshot **replaces** the partial text; it is not an appended delta. Rebuild activity from suitable native retained events/history. Avoid replaying old turns into a fresh active bubble. If the ring cannot reconstruct activity, show an honest partial activity state and retain complete saved results later.
7. **Snapshot/replay consistency:** the pinned snapshot contract does not expose an atomic replay watermark. A separate read of `latest_seq` after snapshot can skip intervening data; replaying all deltas after snapshot can duplicate text. Stage two must prove a consistent snapshot boundary, preferably via a supported upstream atomic snapshot watermark or equivalent synchronization. Do not label an approximate two-call sequence lossless. If the pin cannot provide it, add a narrowly specified Hermes contract enhancement and explicitly review the pin change before switching the default. Test terminal/tool/request transitions at this boundary as well as token deltas.
8. **Truncation/overflow:** on `truncated`, client queue overflow, missing sequence or replay timeout, refetch authoritative state/history behind a reconciliation barrier. Preserve uncertainty/send lock while attachment is unresolved. Never repair by POSTing the prompt. Use limits/flow control; existing `_RpcTransport` closes on its 256-frame queue filling, so slow-reader behavior must be deliberate.
9. **Approval/clarification:** keep socket and owner alive; show offered choices/question fields from typed native requests, answer the exact open ID, and wait for acknowledgement/cancellation/state. Replay pending questions after reload even when no event replay is available. Deduplicate requests by ID; another viewer's answer and `request.cancel` remove them. Implement batch clarify locks where required by the native contract, not a single generic approval boolean.
10. **Stop/guidance:** operate on current attached runtime and turn generation; preserve send gate until native settlement is reconciled. Explicit stop must retire crash recovery and must not be followed by native auto-continuation. Guidance updates the current turn/correction UI, using actual accepted status.
11. **Profile/session switch and unmount:** invalidate pending callbacks, detach browser viewers, keep admitted server work running, and clear client correlation/request caches for that context. Return to any chat by stored identity and authoritative attach. No Project scope change sends `session.cwd.set`, `session.workspace.move`, or `projects.set_active`.
12. **Backend restart:** changed epoch invalidates cursors/runtime/request IDs. Cold resume reloads durable history and may return `auto_continue`. Display this as Hermes continuation after interruption, including attempt/error state, not as exactly preserved streaming. Stale/disabled/exhausted recovery leaves saved partial history and allows an explicit user continuation after state verification. SIGTERM flush is best effort; SIGKILL and external tool side effects cannot be promised exactly once.

### Submission uncertainty and idempotency

RPC correlation IDs are not idempotency keys. Native `prompt.submit` has no replay receipt. Before send, remember a metadata-only client submission ID; the server serializes admission and keeps a bounded receipt map scoped by authenticated context/profile/stored session, including pending/accepted/outcome-unknown and native row ID when available. Reusing the ID within the process returns its receipt, never repeats native dispatch. Inputs stay out of receipt logs and durable browser storage. Define collision/body-mismatch rejection without retaining raw content.

This map alone cannot close the crash window between native acceptance and durable receipt recording. A true restart-safe idempotency guarantee needs a native atomic admission receipt persisted with the user row (preferred upstream dependency), or another verified transaction boundary. A plugin metadata journal must not be advertised as atomic if native DB admission is separate. At the pin, dropped acknowledgement means reconnect/inspect native history and state; when acceptance cannot be established, show outcome unknown and retain send lock until explicit resolution. Do not retry `submit`, image attachment, or model mutation automatically, and do not automatically switch transports. Two simultaneous viewers need an explicit policy: regular send rejects known busy state; guidance/queue are separate intentional operations. The native busy race remains a dependency to validate or guard atomically upstream.

## Desktop parity scope

Define parity as a reviewed feature matrix against pinned Desktop handlers, not importing its entire application. Required first cut: runtime model/provider fidelity, session/workspace context, partial assistant recovery, tool and reasoning disclosures, status/usage, file/image/camera input, approval, clarification, stop, steer/redirect, history and multi-viewer behavior. Inspect `apps/desktop/src/app/session/hooks/use-message-stream/gateway-event/` and `apps/shared/src/json-rpc-channel.ts` for request/result semantics.

Stage later chat features explicitly: native commands/catalog and completion (`commands.catalog`, `complete.slash`, `command.dispatch`/`slash.exec`), queued-input policy, todo/subagent snapshots, context/usage views, and edit/regenerate/branch/undo when exposed by the pin. `prompt.submit` declares row-based truncation with explicit consent; never simulate edit by deleting browser bubbles or by unconstrained resubmission. Scope these features by acceptance tests before calling parity complete.

Desktop OS integrations (clipboard, terminal windows, GUI bridges), credential/vault/sudo prompts, and connector/browser-controller requests require a separate supported browser UX and security review. Do not advertise handlers the browser cannot safely fulfill. Unknown server requests must produce the contract-defined unsupported/not-shown response or explicit blocked state, rather than hang invisibly or fabricate consent. Full Desktop parity including these surfaces is an open product scope decision; the first cut is chat parity.

## Security and isolation requirements

- Authenticate/validate Host and Origin before socket accept; reject cross-site upgrades, expired/reused tickets and invalid identity. Revalidate or bound socket lifetime under logout/auth expiry and plugin disablement. Honor the dashboard's trusted proxy/prefix configuration.
- Pin a validated profile for each attachment; omitted Current profile must use the intended launch/default profile semantics. Never let browser params override profile, source, auth identity, hidden/internal flags, arbitrary cwd, or transport ownership. No silent default-profile fallback when a named profile disappears.
- Maintain an authorization table for stored ID → native runtime IDs belonging to this profile/attachment. Validate replay, mutations, request answers and outbound events against it. In particular, `session.events.since` reads by runtime ID in the pin; the plugin must not let a browser query an arbitrary runtime ID. Native transport membership is not sufficient evidence of tenant ownership.
- Use native profile scopes for runtime/secrets/terminal/persistence. Preserve profile-selected uploads and session-only model changes. Test concurrent profiles, identical identifiers where possible, missing profile stores, deletion and compression lineage. Clarify whether the dashboard is a shared administrative account or requires per-user ownership beyond upstream's warn-only behavior.
- Allowlist operations and schemas, sanitize projected metadata/errors, redact reflected credentials recursively, bound frame/content sizes and rate/concurrency. Do not forward full config/provider credentials or raw gateway exception strings. Existing bearer reflection redaction should remain, but protection must include tickets/provider secrets and async errors, not only one gateway key.
- Responses to server requests must correspond to currently open IDs in the authorized session and allowed result schema. Late/replayed/foreign responses must fail safely. Credential prompts must never enter transcript, local storage, screenshots or logs.
- Validate all image bytes/MIME/decoded sizes and total attachment limits before native mutations; handle attachment failure/uncertain admission without leaving images to bleed into the next turn or another viewer. Reuse authenticated uploads for non-images, with generated names; no client-selected server path access.

## Staged implementation and files

### Stage 1 — lock contract and unblock host integration

Produce protocol/feature fixtures from the pin, audit WS ticket/auth/plugin mounting, and run small native integration probes for resume, fanout, orphan lifetime, pending requests, model persistence and busy submit. Confirm the consistent snapshot boundary and admission guarantees before choosing defaults. Resolve any required upstream improvements as explicit dependencies with their own pin/checksum review. Record a versioned supported-contract matrix; keep current transports operational.

Affected future files: `docs/api-contract.md`, `tests/plugin_api.test.py`, focused new native integration tests, `tests/docker/model_fixture.py`, test compose override/configuration and `tests/docker/README.md`. Preserve pin and volume isolation. Exit: authenticated same-origin route design and tested recovery/admission boundary, with no unsupported promises.

### Stage 2 — reusable server broker and socket facade

Extract `_RpcTransport`, profile handling and safe projection into proposed `plugin/chathermes/dashboard/gateway_transport.py`; add proposed `chat_gateway.py` for attachment/owner/admission orchestration and allowlisted socket routing. Keep `plugin_api.py` as route assembly/compatibility and reuse broker services for Projects. Ensure the plugin's import/loading scheme supports sibling modules and installation copies them. Register watchers/lifecycle initialization idempotently, handle bounded queues/pending RPC shutdown, and preserve response-vs-event distinction and thread-to-loop delivery.

Implement request ownership, snapshot/replay barriers, ephemeral receipts and turn-owner leases according to stage-one results. Reuse existing native history with a complete saved-history API; avoid unrelated Sessions migration. Exit: Python/live tests prove no extra agents on reconnect, no cross-profile frames and no viewer-induced stop within the promised offline period.

### Stage 3 — typed client transport and state controller

Add proposed `src/lib/chat-gateway.ts` for correlation, auth bootstrap, capability negotiation, requests, heartbeat, reconnection, bounded buffering and generation-safe replay. Add proposed `src/lib/chat-session.ts` or a composable for authoritative attachment, turn state, history barriers, uncertain admission and actions. Put reviewed native/domain shapes in `src/types/hermes.ts` or a dedicated gateway types module, tracing each upstream contract rather than copying the Desktop dependency tree.

Refactor `src/lib/hermes-api.ts` to retain HTTP administrative/history/upload APIs and delegate chat. Replace new native turn pointers in `active-runs.ts` with versioned metadata compatible with existing legacy entries. Integrate `App.vue` incrementally behind an explicit capability/version gate. Exit: both regular and Project chats share one native state model and client tests exercise real frame shapes.

### Stage 4 — parity and rendering

Adapt `src/lib/assistant-turn.ts`, `src/components/ChatTranscript.vue`, `ActivityRow.vue`, `ChatComposer.vue` and `src/App.vue` to native identity/state. Add a small request component if approval/clarification forms warrant it. Retain native selects, quiet dark surfaces, readable text, 16px minimum input/select font sizes and the rounded composer. Preserve viewport suppression/restoration in `plugin-entry.ts`, scrolling and explicit scroll-follow behavior. Add the required parity matrix features and mark later/unsupported integrations honestly.

Exit: correct user → activity → assistant ordering on initial send and recovery; focus stays available on Home and during work/approval/reconnect; active/completed disclosure transitions and full results are correct.

### Stage 5 — migration, rollout and removal

Switch new turns only after native capability/auth/recovery gates pass. Maintain a legacy adapter for pending `chathermes.run.v1`/idempotency entries: resume/approve/steer/stop the original Runs turn until terminal history is restored. Never convert a pending Runs pointer into `prompt.submit`. Existing `workspace-` pointers must attach by stored session and reconcile authoritative native state without trusting the prefix as a turn identity.

Persisted Sessions IDs/transcripts require no bulk copy. Native drafts need bounded retention and a clear expired-draft state; an empty reaped draft cannot be reconstructed from a nonexistent REST row. Distinguish unsupported native capability from transport interruption and unknown admission. If a deployment lacks native support, explicitly select legacy mode before admission or disable send; no silent mid-turn fallback. Preserve minimal legacy routes for a documented drain window and prune old storage only after verified terminal reconciliation. Remove Runs-only UI/reducer code and the workspace SSE facade in a later reviewed stage. Keep Projects HTTP event subscriptions until native global-change parity is verified.

Update `README.md`, `docs/api-contract.md`, `docs/deployment.md`, verification notes and build/install scripts as needed in the future implementation. Rebuild and commit `plugin/chathermes/dashboard/dist/` through `npm run build`; do not hand-edit generated assets.

## Validation strategy

### Unit and API tests

Run `npm test`, `npm run test:api`, and `npm run build` for implementation changes. Extend existing suites rather than discarding their regressions: `src/runs.test.ts`, `src/run-idempotency-recovery.test.ts`, `src/projects.test.ts`, `src/App.test.ts`, `src/lib/hermes-api.test.ts`, assistant-turn/transcript/composer tests and `tests/plugin_api.test.py`. Retain legacy Runs tests while draining compatibility. Add focused gateway/state tests for:

- Exact pinned params/result/event shapes; method rejection, numeric/string correlation, asynchronous dispatch responses, RPC timeout cleanup and server-request responses.
- Reload mid-delta/tool/approval/clarify; reconnect before/after replay; live events overtaking replay; duplicate/foreign events; epoch/runtime changes; truncation and slow-reader overflow; fresh snapshot not appended as delta; final history not overwriting a newer turn.
- Lost submit acknowledgement before/after admission, repeated client receipt, backend crash in admission windows, busy/multi-tab races, queued/steered/redirected outcomes, attachment mutation uncertainty and double clicks. Assert native admission counts, not only UI text.
- Profile switch during create/model/upload/submit/attach/replay/history, stale socket generations and orphan callbacks, unknown profiles, cross-profile replay IDs/request IDs, logout, Origin/Host failures, ticket reuse/expiry, plugin disable and secret reflection across async frames.
- Pending request replay/cancel/other-viewer answer/timeouts; unsupported requests; steer/redirect semantics; explicit stop and no auto-continue; failed retained inflight state; authoritative model/provider selection and no profile config mutation.
- Additive Desktop/tab viewers, draft lifetime, turn lease release, resource limits and stuck shutdown. No new persistent session cache or leaked agent transports.

Use upstream tests as integration references: `tests/tui_gateway/test_tui_gateway_event_replay.py`, `test_tui_gateway_ws.py`, `test_ws_orphan_races.py`, `test_auto_continue.py`, `test_resume_profile_scope.py`, `test_config_set_session_profile_scope.py`, plus `apps/shared/src/json-rpc-gateway-replay.test.ts`. Run selected upstream tests in the pinned scratch environment when feasible and record exact scope/dependency limitations; inspected source is not passing-test evidence.

### Docker/live verification

Use `compose.yml` with a dedicated named data volume and pinned build override; no personal Hermes home or host credentials. Retain isolated model fixture/no-egress behavior. `npm run live`/`tests/docker/run.sh` provides a pinned launcher alternative where compose is unavailable; record the discrepancy and effective setup. Run `npm run test:docker` for launcher/config changes and extend `tests/integration/projects.mjs` or a focused chat integration script for real dispatcher/socket cases.

Extend the fixture to hold turns deterministically during text, tool, approval and clarification. Assert one initial admission and the same native turn across reconnect; two logged-in browser viewers and an actual native/Desktop-compatible viewer share context safely. Drop the socket, suspend the browser, wait beyond 20 seconds at silent/waiting operations, restart the dashboard process, test SIGTERM/SIGKILL separately, and exhaust replay limits. Check durable rows, marker/auto-continue policy, final full outputs, resource cleanup and no repeated stopped turns. Use fixture-only harmless tools for approval tests. Optional real-provider verification must use securely supplied server environment credentials and sanitized reports; record it separately from fixture results.

### Visual verification before any implementation commit

Run `npm run test:visual` against the actual Hermes dashboard plugin, using desktop and mobile projects in `playwright.config.ts`, then inspect screenshots against `docs/reference/chatgpt/`. Existing `tests/visual/runs.spec.ts` currently reloads after a completed reply despite its broader title; replace/extend it with a fixture barrier that proves a **mid-flight** reload, counts admission, exercises guidance and stop, and captures actual recovering state. Historical verification claims do not substitute for these assertions in the current tree.

At both sizes inspect Home composer focus, keyboard/draft edits while active, native profile/model selects, 16px inputs, correct runtime selection, scrolling/scroll-follow, attachment and camera file inputs, pending forms, reconnect notices, tool/reasoning disclosures arriving expanded and finishing collapsed, and saved full results after reopen. Check viewport settings restore on plugin unmount and host navigation remains functional. Include cross-profile navigation and reload at active requests. Keep screenshots/traces free of credentials/user data and outside committed generated state. Chromium iPhone emulation does not verify physical iOS keyboard/camera/Safari behavior; document that limitation, and perform device testing when available. No implementation commit without mobile and desktop dashboard visual verification.

## Risks, dependencies and open questions

1. **Consistency gate:** can pinned native APIs provide a snapshot watermark sufficient for lossless replacement plus replay, or is a small upstream atomic snapshot extension necessary? The exposed `LiveSessionSnapshot` alone does not prove it.
2. **Admission gate:** should an upstream atomic persisted receipt/busy guard be required for default rollout? Without it, preserve an explicit unknown-outcome path; never claim crash-safe exactly-once submission.
3. **Offline lifetime:** define the supported detached interval and turn-owner timeout for slow tools/providers and approvals. Verify native lifecycle with a server lease; avoid a global orphan-setting change affecting Desktop.
4. **Auth integration:** verify ticket bootstrap, WebSocket plugin dependency compatibility, reverse proxy upgrades and prefix routing on the exact runtime. Decide close/reauth policy on logout and plugin disable. Browser identity must be server-minted.
5. **Shared-account semantics:** native fanout warns on foreign login rather than authorizing ownership. Is shared dashboard history intended, or must the plugin enforce user-level session ownership? Profile isolation is mandatory in either case.
6. **Crash behavior:** default auto-continue can trigger new model/tool work during cold resume. Document configured policy and surface it. A stopped turn must never be revived; a process crash cannot guarantee exactly-once side effects or complete partial output.
7. **Feature scope:** clarify whether “Desktop parity” includes advanced edits/commands/subagents/voice or OS/credential bridges. Ship a published matrix; unsupported requests cannot silently block the agent.
8. **Private upstream hooks:** existing adapter uses unregister/close/watcher internals; a refactor should minimize and test this dependency or request public hooks. Pin changes require deliberate checksum/image/contract review.
9. **History fidelity/performance:** REST history preserves results but adds a gateway-key dependency; retain it initially and evaluate a native complete-history projection separately. Avoid replaying huge image histories or loading every session runtime.
10. **Operational resources:** server owners, draft viewers, receipts and queued frames all require bounds and teardown. Multiple workers/processes may not share a native runtime; establish routing/process affinity or a supported persistent backend before claiming multi-worker recovery.
11. **Test environment skew:** raw compose uses latest while the Dockerfile launcher pins source; verify actual dashboard bundle/backend compatibility and native sidecar enablement independent of `HERMES_DASHBOARD_TUI=0`.

## Acceptance criteria

- New ordinary and Project turns use the same native Hermes session runtime through an authenticated same-origin plugin protocol; browser traffic contains no gateway key or cross-origin gateway request.
- Reload/navigation/suspension during streaming, tools and questions recovers the correct profile/session and partial turn, with no repeated submission, duplicated bubble or lost pending question within the documented recovery bounds.
- Replay/snapshot ordering, truncation and epoch changes have tested behavior; uncertain admission is explicit and never auto-resubmitted. Any stronger exactly-once claim has a verified native transaction boundary.
- A disconnected viewer does not stop a legitimate turn within the promised offline interval; server-owned resources release on terminal/stop/expiry without disrupting another viewer. Native crash continuation is distinct and visible.
- Model/provider choices change the runtime without profile-wide mutation; workspace context, full saved tool results, images/files and session lineage survive resume. Profile and authorized request/event isolation hold under races.
- Approval, clarification, guidance, cancellation and the published chat parity matrix work through the native contract, with safe unsupported-feature handling.
- Legacy pending Runs finish through their original adapter, saved histories require no rewrite, and capability failures cannot trigger duplicate work or silent transport fallback.
- `npm test`, `npm run test:api`, `npm run build`, applicable Docker/native/live tests, and actual mobile/desktop dashboard visual checks pass; built dist assets are included in implementation commits and limitations are documented honestly.

Historical planning deliverable: the initial investigation wrote only this plan. Current implementation and verification results are recorded above and in the linked verification note; the remaining gates below are not claimed complete.
