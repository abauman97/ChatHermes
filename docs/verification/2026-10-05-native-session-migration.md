# Native session and streaming migration

ChatHermes now sends native turns through one Vue session controller and an
authenticated, retained in-process gateway viewer. Native chat no longer uses
synthetic Runs identities, native-to-SSE conversion, periodic status/replay
polling, or the Runs completion-polling fallback. Hermes core is unchanged.

The isolated source baseline is
`ac28abc96ce83f22f6b831f80d9007e2aba81f21`, archive SHA-256
`d8ec25f838431dd1bbe6bd679be3c9023d3c3dc602146605b0b67c8887196ceb`.
The Docker base digest remains unchanged. Its older Python runtime lacked the
new source's tool-search dependency, so the fixture installs
`snowballstemmer==3.1.1`. Shell files explicitly use LF for container startup.
The base still emits an optional legacy mixture-of-agents import warning and
uses Hermes's SQLite DELETE-journal fallback. Those optional paths were not
validated by the native chat fixture.

## Implementation

| Responsibility | Files / behavior |
| --- | --- |
| Shared protocol | `src/vendor/hermes/`: unchanged `JsonRpcRequestChannel`, gateway events/generated contracts and reconnect backoff, with upstream MIT license and provenance |
| Browser transport | `src/lib/native-chat.ts`: authenticated same-origin ticket socket, shared correlation/heartbeat, one reconnect owner, fixed recovery boundary and live-frame hold |
| Vue state | `src/lib/native-session.ts`: stored session/runtime snapshot, reactive transcript/live parts, native busy state, pending requests and admission uncertainty |
| Event semantics | `src/lib/assistant-turn.ts`: native reasoning replacement, transient provider/tool-generation status, interim/final phases, native tool IDs and independent delegated completion |
| Native lifecycle | `native_channel.py`: profile-bound create/resume/activate/submit/steer/interrupt/request answers; explicit busy queue; preparation before prompt admission |
| Retained ownership | `native_owners.py`, `gateway_transport.py`, `chat_gateway.py`: browser subscribers share one native owner; raw sanitized frames survive disconnect and bounded native replay eviction |
| Plugin integration | `src/App.vue`, `hermes-api.ts`: native controller selection follows reactive capabilities; native actions bypass Runs; genuine legacy pointers drain before native attachment |
| Contract / assets | `docs/api-contract.md`, `tests/docker/Dockerfile`, committed `dashboard/dist/` assets |

The full `JsonRpcGatewayClient` is deliberately not wrapped around the `chat.*`
facade: its automatic native replay RPCs are not wire compatible with the
authenticated retained-owner facade. The reusable request channel is used
directly, without Electron, React stores, backend discovery or native OS bridges.
Reducer behavior follows Desktop's `gateway-event/message-stream.ts`, `tools.ts`
and `chat-messages` helpers; history rendering remains in the existing reducer.

Recovery establishes attachment before publishing replacement history. It
rebuilds the retained active chain from its start boundary, then releases held
live frames. Monotonic spool offsets deduplicate replay versus live delivery;
native sequence/epoch/runtime identities remain intact. `inflight.assistant`
is not appended over a complete replay. Native `open_requests` and request IDs
remain authoritative for approvals and clarification.

Terminal history reconciliation checks native persisted row identities and
coverage, retaining uncovered partial output and steering display bubbles.
Native steering persists in tool context and does not necessarily have a durable
user-row address for its display bubble. Queued input boundaries follow the prior
terminal frame. Late tool/delegation events update the turn that owns their ID.
Completion updates reactive parts so active disclosures collapse correctly.

The pre-existing uncertainty token also correlates optimistic input across
viewers. It is a display/admission-attempt token, not an execution identity or
durable idempotency receipt. A rejected local submit cannot delete another
viewer's admitted message. Unknown admission never triggers automatic resubmission.

## Recovery storage and limits

Raw frames use private anonymous temporary files; request answers and credentials
are not journaled. Reconciled files are closed/deleted. Uncovered terminal data
expires after 24 hours. Running/queued work and tracked delegations prevent expiry;
browser disconnect removes only its subscriber. Slow subscribers reconnect while
the owner keeps executing. Storage failure warns about degraded recovery and
does not stop or resubmit the agent. Shutdown closes owners and files. The owner
registry is limited to 64 sessions and recovery pages target 512 KiB.

Full recovery requires plugin ownership from admission, successful storage and
the same surviving dashboard process. An external turn predating ownership uses
history/inflight with an explicit limitation; its non-atomic native replay text
is not appended over the snapshot. Process-crash recovery and durable exactly-once
prompt admission are not claimed. Plugin viewers serialize admission through the
owner lock; an independent native viewer can still race a busy/model preflight,
and Hermes has no atomic reject-if-busy prompt parameter. Real provider and delegated-tool integration
remain separate from the deterministic fixture; delegation ordering is covered
by reducer/controller tests.

Legacy Runs and workspace SSE routes remain isolated for existing consumers;
new native chat does not use them. Dashboard authentication, profile validation,
upload/image checks, secret redaction and session-only runtime model validation
remain in the plugin boundary. No second backend or custom Hermes fork is required.

## Verification

- `npm test`: 120 tests passed, including snapshot fallback, degraded spool
  recovery, acknowledgement uncertainty, correction boundaries and late child/tool
  completion.
- `npm run test:api`: 77 tests passed using the isolated Python test environment.
  Coverage includes profile/request ownership, native admission outcomes, explicit
  queue boundaries, more than 800 retained events, storage failure and spool cleanup.
- `npm run test:docker`: 18 launcher tests passed.
- `npm run build`: passed; the generated plugin assets are included in the working
  tree.
- The pinned Hermes replay, WebSocket, orphan-race, auto-continue, profile and model
  contract selection passed 86 tests. The actual native fixture runtime probe also
  verified model application and multipart image input.
- Final `npm run test:native`: passed end to end, including those 86 contract tests,
  the runtime probe and all 22 authenticated native desktop/mobile browser checks
  against the final rebuilt bundle.
- The dashboard suite passed 28 desktop/mobile checks covering native chat,
  authentication/tickets, host unmount and projects. Screenshots were inspected at
  both sizes: the home composer stays focusable, active tool disclosures expand,
  completed disclosures collapse, and clarification controls remain readable.

The deterministic browser recovery test leaves the page for 26 seconds, exceeds
the native 512-event ring with 600 reasoning deltas, reconnects while its tool is
still running, checks each recovered boundary once, then verifies persisted output
after another reload. It also asserts that native execution makes no Runs requests.
Other browser checks cover approvals/clarification across reload, two simultaneous
viewers, steering, interruption, lost acknowledgement, model selection, authenticated
attachments and profile isolation. Real-provider and actual delegated-tool execution
were not exercised; their coverage limits are described above.

The fixture was stopped with `npm run live:stop`; only launcher-owned containers
were removed and the dedicated test volume was preserved. No commit was created.
