> Historical investigation and results retained as recorded. The current
> ChatHermes-only implementation and its new isolated verification are documented
> in [plugin-only transcript verification](2026-11-04-plugin-only-transcript.md).
> No real user database inspection was repeated for that follow-up.

# Transcript fidelity investigation — 2026-11-04

Scope: this worktree only. No product deployment, commits, service restarts,
external source edits, or user-data writes. Actual-session inspection used
SQLite `mode=ro`/`query_only` and `SessionDB(read_only=True)`. No message bodies,
credentials, full runtime frames, or user screenshots were recorded in this file.

## Findings and reproductions

The six reported retired-user/active-clone pairs retain identical content,
timestamps, UIDs and display identities. Their clone display orders instead point
after the compacted transcript. Historical assistant responses remain retained.
All six original positions can be recovered from the retired rows. This is an
ordering defect, independently of the renderer defect below.

At pinned source `bf0203a794a07aac3ff764972ab9087baa4e4f4e`:

- `hermes_state_messages._archive_named_rows` retires uncovered active originals,
  inserts the compacted transcript, and clones those originals afterward.
- `_clone_message_rows` deliberately omits `display_order`. The insertion trigger
  in `hermes_state_common` looks only at still-retained peers. A retired original
  cannot donate its chronological position. `_reconcile_display_orders` likewise
  scans retained rows only.
- Indexed single-segment `get_messages` pages that reassigned order. The merged
  ancestor path deduplicates after loading all retained payloads, also omitting
  retired originals as chronological anchors.
- Desktop's `apps/desktop/src/api/sessions.ts` uses those REST display reads with
  `include_compacted=true`. Native resume's
  `tui_gateway/session_registry._live_visible_history` uses
  `get_messages_as_conversation(...include_compacted=True, include_ancestors=True)`
  and reconciles a live suffix. Different reconstruction paths do not supply a
  missing durable original-position contract.

The pinned runtime's real `archive_and_compact(covered_ids=...)` reproduces the
reported row shape when old prompts are omitted from coverage. The pre-fix
adapter returns four assistants followed by four users instead of four alternating
pairs. This proves the mechanism, **not why those particular live prompts were
absent from compressor coverage**. No coverage-cause claim is made.

The producer path is `conversation_compression._commit_compaction` →
`conversation_compression_archive.coverage_for_commit` →
`SessionDB.archive_and_compact` → `SessionCoverageMixin._proved_coverage` →
`_archive_named_rows`. Coverage names held `_row_id` and absorbed IDs; unresolved
held dicts are resolved at commit. A durable-marker miss abandons named coverage
for the watermark path, whereas a markerless unmatched dict adds no covered row.
The actual retained database does not preserve that commit's held dicts, marker
provenance or resolved coverage list. Those inputs are necessary to prove which
case caused the observed gaps; final row flags alone cannot establish it.

The independently failing TypeScript regression gives every resumed user and
assistant row `blocks: []`. Before the fix, `transcriptEntries` emits only the four
users: a truthy empty array shadows saved replies. `historyBlocks` has the same
empty-array fallback problem. Both now use nonempty cached blocks only.

Two other native resume regressions failed before their fixes:

- Saved partial assistant text suppressed newer text in the incomplete snapshot.
- `inflight.correction_offsets` was ignored, moving all assistant text before
  repeated correction bubbles. Hermes offsets count Unicode code points; JS
  UTF-16 slicing also needs conversion. Tests include a non-BMP character and
  later live deltas, plus repeated reconstruction without duplication.

## Repository solution

The authenticated reader now builds an ordered metadata plan before slicing
pages. Retired originals anchor retained copies; latest removal state still
suppresses rewound generations across ancestors. Occurrence UID separates genuine
repeated sends even when their bodies and timestamps coincide. Display identity
separates rewritten payloads. Missing legacy identities are computed through the
pinned runtime's own identity helper. No content-only deduplication is introduced.

Only a selected page and its preceding boundary row are decoded. Ordinary payloads
are not scanned to reconstruct a page, including across compression ancestors.
The fence includes each session's durable `transcript_revision`, which the pinned
schema increments on in-place payload/reasoning rewrites. Carrier fingerprints,
identities, flags and lineage metadata detect other changes. Mid-read mutation or
stale cursors produce 409 rather than combining inconsistent pages.

The official Docker base used here is digest
`sha256:e6d81ae52ebf6a43efa529701405509f20054ba818f179ddd748bed4f8af584c`.
Its source differs from the exact local test pin: it adds carried-tail coverage
handling and `hermes_state_compaction_display` tool-copy suppression, among other
changes. It still clones genuinely uncovered rows without their old order.
The adapter follows the newer tool-copy rule too: later compaction stubs do not
replace archived full outputs; in-place prunes sharing one slot choose their live
representative once. Dedicated tests exercise both with real pinned persistence
verbs. These are separate from legitimate repeated tool occurrences.

## Upstream integration and remaining boundary

The metadata plan in `plugin/chathermes/dashboard/transcript.py` is an executable,
read-only reference for an upstream history implementation. Port that selection
before payload reads into the shared SessionDB display projection, then use it
for indexed REST paging, merged compression lineage, conversation conversion and
native resume. The regression fixtures use native storage verbs and can be ported
without plugin dependencies. Keep model-context order separate from immutable
display occurrence order. A write-side fix should preserve original display
coordinates when compaction moves a retained occurrence, while a genuinely new
send gets a new coordinate. Do not globally revive retired identities or sort by
timestamp. Test branch/rewind tombstones and same-timestamp repeated sends too.

Exact reconstruction of **every live event** remains blocked upstream. The pinned
native transport exposes an incomplete inflight summary rather than a complete
durable event sequence; ChatHermes explicitly marks that recovery incomplete.
`session_history._record_inflight_correction` records offsets in memory, while
`session_auto_continue._inflight_snapshot` only publishes them when available.
Stored steering may be represented inside tool context rather than as the same
user bubble. Persisted receipts deliberately refuse full coverage after
compression or multiple user boundaries. Unstored progress, intermediate tool
states, durations and placement cannot be recovered exactly from final messages.
The warning is about that running replay boundary, not evidence of missing saved
responses. Local unmatched live projections remain until durable coverage is
proven; this does not make unpersisted events survive a cold reload or server loss.

A concrete upstream contract to close that boundary is:

1. Allocate a durable `turn_id`, occurrence ID and monotonically increasing
   display-event sequence before publishing an accepted input, correction,
   assistant phase or tool event. Persist event and publication intent in the same
   transaction; publish only after commit. Preserve authenticated profile/session
   ownership on all reads.
2. Persist correction boundaries and tool/result IDs as display events, separately
   from provider/model-context rewrites. Compaction and rotation preserve display
   IDs and coordinates; rewinds/branches record explicit retirement/lineage edges.
3. Return a durable snapshot watermark plus replay events strictly after it.
   Include turn/occurrence IDs in admissions, deltas and persistence receipts so
   clients never infer a new turn from matching prompt text. Page by stable
   coordinates under a revision, with a documented retention boundary.
4. Exercise two viewers, concurrent compaction/appends, lost acknowledgements,
   process restart, corrections during tools, same-text sends, rewinds and page
   boundaries against that shared contract. A plugin-local database or browser
   cache cannot establish this cross-surface authority.

No upstream checkout or live database was patched. The full-event guarantee is
therefore explicitly incomplete despite the retained-history fixes.

## Verification

Dependencies prepared with `uv sync --locked` and `npm ci`. The ignored reviewed
source checkout is detached at the exact pin above and remains unmodified.

Final read-only inspection returned the identical ordered sequence at page sizes
1, 7 and 120: 180 retained rows, each durable representative once, all six clone
anchors restored and all logical positions ascending. Two additional later tool
copies are suppressed by the archived-output rule; standalone summary content is
hidden. This checks retained data reconstruction, not the original live event
sequence or the actual user's authenticated browser session.

| Command                                                                  | Result                                              |
| ------------------------------------------------------------------------ | --------------------------------------------------- |
| `npm test`                                                               | 42 files, 1,281 tests passed                        |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                         | 499 passed, including 26 transcript cases; no skips |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                      | 136 passed                                          |
| `npm run test:docker`                                                    | 16 passed                                           |
| `vp fmt` / `vp lint`                                                     | Passed                                              |
| `uv run ruff format .` / `uv run ruff check --fix .` / `uv run ty check` | Passed                                              |

`npm run build` also passed. Tracked generated files were restored afterward;
there is no distribution diff.

The final isolated image's `dashboard/transcript.py` fingerprint matches this
worktree (`a773248b486fd51dce7dbdf053998f79de637aa84587b587ce9a29efb6016421`).
Build and browser commands use:

```sh
COMPOSE_PROJECT_NAME=chathermes-transcript-order-final \
CHATHERMES_DASHBOARD_PORT=9229 CHATHERMES_MOCKSERVER_PORT=1190 \
npm run test:env:build

COMPOSE_PROJECT_NAME=chathermes-transcript-order-final \
CHATHERMES_BIND_ADDRESS=172.25.0.2 CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9229 CHATHERMES_MOCKSERVER_PORT=1190 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:integration -- tests/workflows/transcript.spec.ts \
  tests/workflows/messaging.spec.ts tests/workflows/execution.spec.ts \
  tests/workflows/reasoning.spec.ts
```

That final broad browser run returned **38 passed, 2 failed** in 7.5 minutes.
All 12 transcript scenarios passed, covering desktop/mobile tool-copy reload,
280-message interleaving across compaction/reconnect/reload, multiple-page
scrolling, rewind exclusion, stale cursors during live tools, actual missed-delta
resume through another authenticated observer, focus/drafts/anchors, and archived
multipart images. The other 26 passes cover streaming/reload, newline handling,
tools, inference failures, runtime model selection, cancellation, clarification,
reasoning groups, approvals, background execution and reasoning settings.

The two failures were the old thinking-inspection test clicking a child inside
its completed, collapsed parent. Its updated user path opens the parent before
the child. The running suite had already loaded the old test body; with the same
environment above, the separate fresh invocation was:

```sh
npm run test:integration -- tests/workflows/execution.spec.ts --grep 'thinking streams'
```

Result: **2 passed** (desktop/mobile) in 12.9 seconds. Thus all 40 selected
scenarios were verified; the broad-run failure is retained rather than described
as an initially green run. Complete broad-run artifacts were preserved under
`tmp/final-browser-suite/` before the focused rerun replaced `tests/visual-output/`.
Inspected desktop/mobile screenshots show alternating prompt/reply history,
compaction placement, full archived tool output, readable disclosures, and a
focusable composer; the mid-flight screenshot shows the explicit running-replay
warning while saved history remains available. The final focused screenshots
also verify expanded retained thinking content.

Infrastructure preparation encountered Docker's exhausted default address pools.
After checking all existing networks for overlap, explicitly allocated only this
project's network with Compose labels:

```sh
docker network create --driver bridge --subnet 10.253.85.0/24 \
  --label com.docker.compose.project=chathermes-transcript-order-final \
  --label com.docker.compose.network=default chathermes-transcript-order-final_default
```

The preliminary test project uses ports 9219/1180 and subnet 10.253.84.0/24.
Both test projects remain running, including failure state. No existing network
was pruned or reused. An initial browser launch found the environment's default
browser path absent; selected the already-installed Chromium explicitly.

The broader browser run then exposed a preparation defect: first login loses the
requested fragment, landing on Inbox with sending gated. The first approval test
timed out before sending; the run was interrupted with its evidence preserved.
`tests/docker/prepare-browser.mjs` now returns to the requested URL after sign-in.
This uses actual authenticated navigation, with no gateway interception or fixed
readiness delay. The retried approval scenarios pass.

Transient command logs and synthetic screenshots stay in ignored `tmp/` and
`tests/visual-output/`. No actual user screenshots were taken. Browser workflows
use real Hermes authentication, persistence, native WebSockets and tools, with
deterministic MockServer inference. They are not real-provider, native-device,
process-crash or upstream Desktop visual verification. Correction-offset and
partial-snapshot regressions use mocked native hooks and are reported separately.

## Independent-review follow-up

The pre-existing edits above were preserved. Three additional red regressions
were established before their fixes; logs are in ignored `tmp/review-followup/`:

- `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py -q`
  initially returned **5 failed, 26 passed**. Real `rewrite_pruned_rows` produced
  both the live pruned assistant and its archived full twin. Real
  `archive_and_compact`, followed by the actual pinned
  `_advance_message_uid_backfill`, produced distinct UIDs for same-identity
  historical copies. Both ordinary paging and rewind failed.
- `npm test -- src/features/chat/runtime/native-session.test.ts` initially
  returned **2 failed, 59 passed**. Tests attach the session, hydrate saved
  history, invoke its actual snapshot/restore hooks, recover and hydrate again.
  Saved `Ask, Again` plus inflight `Ask`, corrections `Again`, offsets `[0]`
  produced `Ask, Again, Ask, Again`. Both native-message and omitted-snapshot
  paths failed. This uses a mocked transport and saved-history API, not a real
  native correction event replay.

Slot selection now covers assistant and tool pruning. It follows the original
slot across ancestor copies, so rotation cannot revive the archived full twin.
Legacy copy aliases use full indexed identity, slot/lineage, generation and
suffix occurrence ordinal. Multiple identical occurrences in one generation
survive, even at the same timestamp; newest removal state also follows aliases.
Additional tests carry only the last of repeated occurrences, migrate UIDs and
then compact/rotate again. Native restore adopts a complete correction sequence
only when exactly one saved occurrence matches at the latest user, offsets are
valid, no input is queued and saved prose agrees with snapshot segments. It
preserves saved row IDs and repeated correction bubbles; ambiguous, older or
conflicting sequences stay unbound with the recovery warning.

Legacy migration assigns random UIDs without persisting per-row provenance.
The fallback is structural inference, not proof of arbitrary historical event
identity. A genuinely new send with the exact same full identity (including
timestamp), slot and generation shape can be indistinguishable from a carried
copy. Immutable upstream occurrence coordinates are needed to resolve that case.
Likewise, incomplete snapshots cannot distinguish two executions with identical
saved user/correction/prose projections when no turn identity survives. No
content-only global deduplication or claim of universal lossless recovery is made.
The upstream durable-event limitations described above still apply: unstored
progress, timing, intermediate tool states and correction placement are not
recoverable from final rows alone.

The existing isolated fixture was reused at project
`chathermes-transcript-order-final`, dashboard `172.25.0.2:9229`, MockServer
`172.25.0.2:1190`. No containers were stopped, restarted, recreated or reseeded.
Builds use `npm run build`. For testing without a restart, the reader and built
assets are copied into this fixture's installed
`/opt/data/plugins/chathermes/dashboard/`; `_load_sibling` reads the Python file
per request and authenticated browser reloads load the new assets. The image is
not rebuilt, so its image digest is not evidence of the final tested code.
Only fixture plugin code and synthetic test sessions are changed, never the live
DB or another worktree. This is a deterministic fixture update, not deployment.

An initial broad browser run mistakenly copied files only to the fixture's
`/opt/chathermes/plugin/` image source directory. The installed plugin remained
old; the new legacy/prune test therefore reproduced both defects in the actual
authenticated dashboard. That run's failures and screenshots are retained. The
corrected run uses the installed path above. Android/native-device, real-provider,
upstream Desktop and real-user-session visual checks are outside this run.

Follow-up validation (the historical table above records the earlier run):

| Command                                                                      | Follow-up result                                           |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `npm test`                                                                   | 42 files, 1,289 tests passed                               |
| `npm test -- src/features/chat/runtime/native-session.test.ts`               | 67 passed after the final restore-state reset              |
| `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py -q` | 37 passed                                                  |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                             | 510 passed, no skips                                       |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                          | 136 passed                                                 |
| `npm run test:docker`                                                        | 16 passed                                                  |
| `vp fmt` / `vp lint`                                                         | Passed (repository-local `node_modules/.bin/vp`)           |
| `uv run ruff format .` / `uv run ruff check --fix .` / `uv run ty check`     | Passed                                                     |
| `npm run build`                                                              | Passed; generated files restored after copying test assets |

The broad browser command is the same four workflow files and environment
shown above, now including 14 transcript scenarios across desktop/mobile (42
scenarios total). The correction restore regressions remain mocked protocol
checks; browser inference fixtures do not prove native correction persistence.

That initial browser invocation returned **39 passed, 3 failed** in 7.7 minutes.
Two failures are the new legacy/prune scenario against the old installed reader.
The third was the mobile live-tool inspection choosing the last activity group
rather than the group containing the requested tool. It waited on a hidden child
summary. The workflow now selects that tool's containing group and opens its
`aria-expanded=false` control before inspecting the child; it does not force a
hidden click or change product disclosure behavior. Initial screenshots and
error contexts are preserved in
`tmp/review-followup/browser-before-installed-update/`.

The corrected fixture fingerprints match the tested worktree/build:

- `transcript.py`: `7e4eb324febdd31b5c28fc72411c1549be0e4e1f5f5ba4133aafa794493ae98f`
- built `dist/index.js`: `ac1e7ffbb3089936b01cbcd48104d1a77c01d44c2030abc7d0ab5c8dd5b7fec0`

Generated tracked distribution files were restored to `HEAD` after the final
fixture copy. The generated hashed assets remain ignored. No distribution files
are staged or included in the final diff. No commit, push, deployment, live-data
mutation or container shutdown was performed.

The corrected final broad browser run returned **42 passed** in **4.6 minutes**,
21 desktop and 21 mobile. This includes every new legacy/prune reload scenario,
rewind/pagination, live-tool backfill, missed-delta resume, native runtime model
selection, cancellation, disclosure transitions and authenticated archived images.
Screenshots were inspected at both sizes for repeated-message interleaving, one
pruned response, retained thinking/tool content, focusable draft composers,
scrolling, model/reasoning controls and image attachments. Final artifacts remain
under `tests/visual-output/`; command logs remain under `tmp/review-followup/`.
The earlier failed run is preserved separately as described above. Containers and
synthetic failure sessions remain available for debugging.
