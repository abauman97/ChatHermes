> Superseded by the ChatHermes-only implementation. This historical record
> describes an abandoned dependency on a patched separate Hermes runtime. Its
> commands and results are not current setup instructions or verification of the
> plugin-only implementation. See [current verification](2026-11-04-plugin-only-transcript.md).

# Shared display-history integration — 2026-11-04

This supersedes the plugin-local ordering proposal in the earlier
[transcript investigation](2026-11-04-transcript-fidelity.md), which remains intact
as historical evidence. This is a local integration, not a release or deployment.
The first implementation failed the existing indexed-page scaling regression.
The continuation below fixes that reproduced regression and records the new
index/cache contract and its cold-rebuild limits. This remains a local integration,
with no production release or recovery claim for events never persisted.

## Worktrees and preservation

- ChatHermes: `/opt/data/profiles/developer/cache/scratch/chathermes-transcript-order`.
  Its intentional starting edits were preserved; the initial tracked diff is in
  ignored `tmp/shared-history/initial.patch`. Existing empty-block, snapshot text,
  correction-offset and correction-adoption fixes remain. The earlier verification
  document is unchanged. No reset, commit, staging, push, deployment or user-data
  write was performed.
- Reviewed source: `.hermes-source`, detached at
  `bf0203a794a07aac3ff764972ab9087baa4e4f4e`, remains clean and unmodified.
- Upstream implementation: separate detached worktree
  `/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history`,
  created from that exact pin with `git worktree add --detach`. All Hermes edits
  live there, including Desktop changes and upstream tests.
- Isolated PM-managed upstream test environment:
  `/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history-testenv`.
  The root uv environment prepared ChatHermes with `uv sync --locked`.

`git fetch origin main` fetched and compared
`3a1e9ef50a570b1544795ddad197ad2dcde430ab` without checking it out over the pin.
The comparison includes carried-tail coverage and archived-tool-copy fixes absent
from the pin. The integration is based on the reviewed pin, not rebased onto that
newer main. Neither stock revision supplies the new shared-history API. Applying
this work to a newer release needs a deliberate rebase and regression review;
do not replace a current runtime with individual pinned modules.

A portable diff including new upstream files is retained in ignored
`tmp/shared-history/hermes-integration.patch` alongside command logs. It is a
review artifact, not an automatically installed runtime patch.

## Contract and consumers

`hermes_state_display_history.py` owns metadata selection, retired occurrence
anchors, representative choice, rewind suppression, legacy migration inference,
pruned-output selection and revision fences. `SessionDB.get_display_history_snapshot`
returns contract version 1, metadata, selected rows, stable occurrence positions
and a revision. Payload reads are page-bounded; metadata work is linear in lineage
size. Legacy unindexed stores must read bodies to calculate missing identities.

The shared selection is used by:

- Desktop REST `include_compacted=true`, including ancestor pagination;
- `get_messages_as_conversation` display reads and `get_resume_conversations`;
- warm TUI display reads and ancestor display prefixes;
- compression-worker display reads on their existing receipt connection;
- canonical native `session.resume(display_projection=true)`, which no longer
  paints display history in active model-context order;
- ChatHermes's authenticated profile-local reader, which now handles presentation,
  safe image addresses and compression markers without an occurrence selector.

Model context and raw native control/rewind rows retain their own active order.
Resume reuses payloads between model and display projections. Canonical native
replies keep the existing archive byte budget; REST remains the full paged reader.
Native replies are not claimed to contain arbitrarily large full transcripts.

Desktop REST returns `pagination.revision` and `display_position`. Backfills and
complete reads send the revision; stale reads receive HTTP 409. Desktop hydration,
refresh grafts and preserved-row placement use display coordinates while actions
still use physical row IDs. Revisions are scoped to the owning connection,
profile and stored session, including routes that omit an explicit profile.

Compaction clones retain their original coordinate. Insert/visibility/reconcile
rules distinguish occurrence UIDs, so equal bodies at equal timestamps remain
separate sends. Compaction handoffs carry existing identity before retiring their
donors. In-place changes to rich message parts and display metadata also advance
the revision. Snapshot validation reuses indexed identity fingerprints instead of
reloading legacy payloads while a selected page is held.

The plugin returns an explicit HTTP 501 integration requirement if shared history
v1 is unavailable. It does not fall back to its independent ordering or patch
Hermes at runtime. The existing ordinary non-transcript proxy stays available.
Authenticated profile ownership checks precede lineage reads and image lookup.

## Regression interpretation and limits

A standalone real-persistence reproduction fails on the untouched pin and passes
on the integrated source (`base-red.log`, `integrated-green.log`). The tests use
real `SessionDB`, compaction, rotation, pruning, rewind, read-only connections,
REST handler invocation and canonical `AuthorityConnection.session.resume`.

Existing synthetic clone/carrier tests were updated to persist the occurrence UID
and summary marker that identify a copy. Fresh UIDs represent distinct sends;
same text alone no longer licenses removal. Tests still cover legacy nullable
identities, bounded payload memory, SQLite snapshot errors, rewrite fences,
rewind tombstones, repeated sends, and composite/multimodal carriers. WAL mutation
now tests explicit snapshot rejection rather than returning a page whose state
changed during the read. Tests counting writes account for the revision update
and for independent occurrence slots.

Legacy UID backfill did not persist provenance. The fallback remains structural
inference, with the ambiguity described in the earlier investigation. A carrier
without a surviving copy UID, marker or matching full legacy identity cannot be
universally distinguished from a new input. No content-only global deduplication
has been reintroduced. Likewise, absent correction boundaries, intermediate tool
states, progress, durations and publication order cannot be recovered from final
message rows. The existing incomplete-running-replay warning remains warranted.
The correction-offset/frontend restore regressions use mocked transport hooks;
they do not prove a durable native correction-event log.

## Commands and results

All logs below are under `tmp/shared-history/`. `PYTHONPATH` for integrated Python
checks was `/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history:plugin`.
The pinned checkout was not patched to make tests pass.

| Check                                                                              | Result                              |
| ---------------------------------------------------------------------------------- | ----------------------------------- |
| `npm test`                                                                         | 42 files, 1,289 passed              |
| Integrated `uv run pytest`                                                         | 511 passed                          |
| Integrated `npm run test:api`                                                      | 137 passed                          |
| Final focused `uv run pytest tests/transcript.test.py tests/plugin_api.test.py -q` | 174 passed                          |
| `npm run test:env:build`                                                           | Passed, including `npm run build`   |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`             | Passed                              |
| `vp fmt`, `vp lint`                                                                | Passed using repository-local Vite+ |
| Desktop six-file Vitest selection                                                  | 243 passed                          |
| Desktop `npx tsc -p . --noEmit`                                                    | Passed                              |
| Upstream 12-file persistence/native selection                                      | 88 passed                           |
| Upstream `test_get_messages_include_compacted.py`                                  | 46 passed, 1 failed: scaling        |

The upstream tests run through `scripts/run_tests.sh` with `HERMES_PYTHON` pointing
to the isolated test environment. It was built using the repository's PM entry
point, `python -m pm.build_env --source . --out <testenv> --group dev --group test`.
An initial run using the smaller ChatHermes interpreter could not run asyncio
cases; the correctly provisioned PM environment ran the actual native tests.

The 12-file upstream selection was:

```text
tests/hermes_state/test_shared_display_history.py
tests/hermes_state/test_display_projection_parity.py
tests/hermes_state/test_display_read_removed_rows.py
tests/hermes_state/test_display_dedupe_pruned_tool_payload.py
tests/hermes_state/test_compression_watermark_commit.py
tests/hermes_state/test_tail_rewind_semantics.py
tests/hermes_state/test_compression_lineage_guard.py
tests/hermes_state/test_runtime_worker_compaction.py
tests/hermes_state/test_runtime_worker_compression.py
tests/hermes_state/test_composite_carrier_rewind.py
tests/gateway/test_shared_history_resume.py
tests/gateway/test_canonical_resume_display_projection.py
```

The Desktop selection covered `session-transcript-paging`, `sessions`,
`transcript-tail`, `transcript-backfill`, `chat-messages/reconciliation`, and
`use-session-actions/utils`. New regressions cover nonmonotonic physical clone
IDs and revision forwarding through an ambient profile route. No Electron visual
run was performed.

The retained failure is
`test_display_paging_and_append_work_is_bounded`: the observed SQLite progress
counts were 17,458 for 20,000 rows and 1,797 for 2,000 rows, exceeding the old
three-times threshold. An indexed/materialized shared plan is still needed before
this integration can preserve the previous page-work guarantee. The test is not
skipped, weakened or described as green. Full upstream test coverage and current
main integration have not been established.

## Actual plugin fixture

Existing containers and profiles were not touched. The failed first project,
`chathermes-shared-history-1104`, uses ports 9249/1210 and network
`10.253.86.0/24`; it retains its failed Hermes container and state. Exporting the
pinned source over the release image reset executable permission on
`docker/entrypoint-dispatch.sh`. The fixture image explicitly restores executable
permission on its shell launchers; no readiness sleep or state reset was added.

The verified project is `chathermes-shared-history-verified`, dashboard
`172.25.0.2:9259`, MockServer `172.25.0.2:1220`, network `10.253.87.0/24`.
Both networks were checked against existing Docker subnet allocations before
creation and carry their own Compose ownership labels. No network was pruned.

The standard explicit build was:

```sh
COMPOSE_PROJECT_NAME=chathermes-shared-history-1104 \
CHATHERMES_DASHBOARD_PORT=9249 CHATHERMES_MOCKSERVER_PORT=1210 \
npm run test:env:build
```

For this dependency work only, a temporary build context under
`tmp/shared-history/runtime/` was exported using `git archive` from the exact
Hermes pin and overlaid with the upstream worktree's modified Python files. It
also includes the current plugin and built assets. `Dockerfile.history` builds
that complete source into the isolated fixture image. It does not install a
monkeypatch or copy old modules into any existing user service. The official base
digest was `sha256:e6d81ae52ebf6a43efa529701405509f20054ba818f179ddd748bed4f8af584c`.
Only the owned verified fixture was explicitly recreated from subsequent reviewed
images; its anonymous state volume was retained. The first failed fixture was
left intact.

The broad browser command used the following environment:

```sh
COMPOSE_PROJECT_NAME=chathermes-shared-history-verified \
CHATHERMES_BIND_ADDRESS=172.25.0.2 CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9259 CHATHERMES_MOCKSERVER_PORT=1220 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:integration -- tests/workflows/transcript.spec.ts \
  tests/workflows/messaging.spec.ts tests/workflows/execution.spec.ts \
  tests/workflows/reasoning.spec.ts
```

It returned **42 passed in 6.7 minutes**: 21 desktop and 21 mobile. Screenshots
were inspected at both sizes for chronology, readable replies, focusable draft
composers, disclosures, native model/reasoning selects, scrolling and archived
attachments. Broad artifacts are preserved in `tmp/shared-history/browser-broad/`.
A final image was then rebuilt after the code-health refactors and shared
ancestor-prefix change; the transcript-only command was rerun against that image.
Final command results and runtime fingerprints are recorded below.

These are real authenticated plugin workflows using Hermes persistence, native
WebSockets and deterministic MockServer inference. They are not real-provider,
Android-device, process-crash, real-user-session or Electron visual verification.
No exact replay guarantee is made beyond durable message identity and the native
runtime's persisted state. Containers and synthetic sessions remain available.

Final transcript-only browser result: **14 passed in 2.3 minutes**, seven per
viewport. Final screenshots were inspected for the interleaved repeated turns,
compaction boundaries, draft composer, retained tool content and authenticated
archived images. They remain in `tests/visual-output/`; the broad 42-case run is
preserved separately as described above.

The final fixture image is `2dfb5e9717df` (local image ID, not a published digest).
All nine modified Hermes runtime Python files were byte-matched to the upstream
worktree, and the installed `transcript.py`, `plugin_api.py` and built `dist/index.js`
were matched to the tested ChatHermes source/build. The full comparison is in
`tmp/shared-history/final-fingerprints.json`. Selected fingerprints:

- shared history: `2e1c9a08fc4d66510328cbb84038811102c5af20117fab61192cedc8ab1eb4d6`
- plugin reader: `0db2dc2fc7f0d7498312cdfaaff857e03e28a07313c288d9de114a087c3bad14`
- built plugin: `ac1e7ffbb3089936b01cbcd48104d1a77c01d44c2030abc7d0ab5c8dd5b7fec0`

Final upstream `python scripts/check` completed **12 checks, all passing**,
including code health (25 measured files, zero blocking/advisory findings).
`npm run test:docker` also passed all **16 tests**. The final Desktop six-file
selection passed **243 tests**. Intermediate argument-shape test failures, the
missing asyncio environment, code-health diagnostics and the earlier carrier
fixture failures remain in the logs rather than being represented as green runs.

The tracked generated distribution files were clean at entry. The validation
build was preserved under `tmp/shared-history/generated-build/`, then only those
generated tracked files were restored to their original `HEAD` bytes. Generated
untracked assets remain ignored. Neither worktree has staged changes, and the
pinned source remains clean. No generated distribution assets were committed.

Remaining work at the end of that first pass: index/materialize the shared plan to
restore bounded page work, rebase onto the intended Hermes release, run that
release's broader upstream checks, and update the dependency/CI source. Desktop
Electron visual behavior and a durable log of every live event were not verified
or implemented by this retained-history integration.

## Continuation: indexed selection and revision validation

Work continued in the same two dirty worktrees, preserving the starting edits and
the earlier verification evidence. The exact reported command reproduced the
failure, **17,458 versus 1,797** SQLite progress callbacks. Its log is
`tmp/shared-history/bounded-before.log`. No assertion or scaling threshold was
weakened. The existing legacy-schema fixture now drops the new indexing triggers
before dropping their referenced columns; its migration assertions remain intact.

The root cause was two full metadata scans per snapshot/page: selection in the
constructor, then metadata hashing again during validation (and again in callers).
The new revision uses the verified session lineage and write-side counters.
Insert/delete, rich-payload/visibility/summary/UID changes, physical ID changes and
coordinate invalidation advance that fence. Legacy rows with missing index data
retain metadata validation, including a fence across concurrent index backfill.

A trigger-maintained invariant identifies sessions consisting solely of fresh,
indexed occurrences. Those page through `idx_messages_session_id` directly;
occurrence lookup uses an index covering retired as well as active UIDs. Other
histories keep the original shared occurrence selector and can materialize its
result in `display_history_entries`, keyed by owning session, lineage scope and
occurrence position. `display_history_boundaries` supplies indexed marker ranges.
Publishing the derived index uses the already-held writer connection, including
when WAL is unavailable. It does not reenter the nonreentrant SessionDB lock.

Read-only routes do not write a derived index. They reuse resolved, payload-free
plans across handles through an eight-scope process cache keyed by canonical DB
path, file device/inode, session, lineage scope and revision. Stale revisions are
never reused; cache eviction is permitted. ChatHermes now asks the shared snapshot
for marker coordinates instead of scanning metadata itself. Profile ownership
checks still precede reading a plan or its markers.

The unchanged bounded-work regression passes. A separate synthetic diagnostic
matching its workloads reported:

| Work                                | 2,000 rows | 20,000 rows |  Progress interval |
| ----------------------------------- | ---------: | ----------: | -----------------: |
| Fresh indexed latest page, 120 rows |         65 |          70 | 100 SQLite opcodes |
| Append to legacy-identity seed      |         90 |          93 |  10 SQLite opcodes |
| Compacted read-only cached page     |         54 |          54 | 100 SQLite opcodes |
| Compacted materialized page         |         68 |          68 | 100 SQLite opcodes |

The diagnostic and its output are retained in ignored
`tmp/shared-history/count-bounded.py` and `bounded-counts-final.log`. These counts are
engine-work diagnostics, not wall-clock latency claims. New behavioral tests cover
cold readers of durable plans, repeated read-only connections without DB writes,
stale selection after mutations, and legacy backfill. The existing same-timestamp,
retired-anchor, pruned-output, lineage, native-resume and payload-memory cases
remain in the affected suites.

### Exact continuation commands

From the upstream worktree, the independently reported command was run both red
and green:

```sh
HERMES_PYTHON=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history-testenv/bin/python scripts/run_tests.sh tests/hermes_state/test_get_messages_include_compacted.py -k test_display_paging_and_append_work_is_bounded
```

The final affected selection uses the same interpreter and runner:

```sh
HERMES_PYTHON=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history-testenv/bin/python scripts/run_tests.sh \
  tests/hermes_state/test_shared_display_history.py \
  tests/hermes_state/test_get_messages_include_compacted.py \
  tests/hermes_state/test_display_projection_parity.py \
  tests/hermes_state/test_display_read_removed_rows.py \
  tests/hermes_state/test_display_dedupe_pruned_tool_payload.py \
  tests/hermes_state/test_compression_watermark_commit.py \
  tests/hermes_state/test_tail_rewind_semantics.py \
  tests/hermes_state/test_compression_lineage_guard.py \
  tests/hermes_state/test_runtime_worker_compaction.py \
  tests/hermes_state/test_runtime_worker_compression.py \
  tests/hermes_state/test_composite_carrier_rewind.py \
  tests/hermes_state/test_read_path_transient_ioerr.py \
  tests/gateway/test_shared_history_resume.py \
  tests/gateway/test_canonical_resume_display_projection.py
HERMES_PYTHON=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history-testenv/bin/python scripts/run_tests.sh tests/hermes_state/
/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history-testenv/bin/python scripts/check
HERMES_PYTHON=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history-testenv/bin/python scripts/run_tests.sh -j 1 \
  tests/hermes_state/test_hermes_state.py \
  tests/hermes_state/test_hermes_state_compression_busy_retry.py \
  tests/hermes_state/test_read_path_transient_ioerr.py \
  tests/hermes_state/test_state_db_repair_non_destructive.py -vv
```

From ChatHermes:

```sh
uv sync --locked
npm test
PYTHONPATH=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history:plugin uv run pytest
PYTHONPATH=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history:plugin npm run test:api
PYTHONPATH=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history:plugin uv run pytest tests/transcript.test.py tests/plugin_api.test.py -q
npm run build
uv run ruff format .
uv run ruff check --fix .
uv run ty check
node_modules/.bin/vp fmt
node_modules/.bin/vp lint
PYTHONPATH=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history uv run python tmp/shared-history/count-bounded.py
git diff --check
```

The exact bounded regression passed on final source: **1 passed, 46 deselected**
(`bounded-exact-cte-final.log`). The final 14-file affected upstream selection
passed **147 tests** (`upstream-affected-final.log`), including the complete
47-case pagination file and four transient-I/O cases. ChatHermes results are **1,289 frontend tests**
(`npm-test-continuation.log`), **511 Python tests** (`pytest-cache-final.log`),
**137 API tests** (`api-continuation.log`), and a final **174 transcript/API tests**
after the CTE compatibility correction (`plugin-cte-final.log`). Build, Ruff,
ty, Vite+ formatting/lint, both worktrees' whitespace checks and upstream
`scripts/check` passed; the latter reports **12 checks**, **26 measured files**,
zero blocking/advisory findings (`upstream-check-final-continuation.log`).

The broader state run was **not green**: **1,511 passed, 3 failed, 16 skipped**,
plus a 300-second timeout of `test_hermes_state.py`
(`upstream-state-continuation.log`). That run overlapped other checks and began
before the final changes. It exposed the old retry-injection test's requirement
that display paging retain the `WITH page AS` entry point. The final query keeps
that CTE, through the retrying reader, while selecting through the index.
No assertion or timeout was changed. The serial four-file follow-up completed
with **327 passed, 1 failed** (`upstream-isolated-followup.log`): the lease timing
test, four transient-I/O cases and all 24 cross-process repair cases passed;
the timed-out CRUD file completed in 39.4 seconds with 295 passed and one
ordering assertion failure.

That remaining assertion is
`TestHandoffTimestampCarry::test_archive_and_compact_carried_rows_keep_identity`.
It expects `u0, a0, S1, S2, keep me, tail-a, u2, a2`; the shared occurrence plan
returns `u0, a0, keep me, tail-a, S1, u2, a2, S2`. Moving carried rows after
summaries conflicts with retaining their original occurrence coordinates. The
assertion was left intact. The same failure was independently reproduced against
the **retained pre-continuation integration** under
`tmp/shared-history/runtime/`, whose shared-history module SHA-256 is the earlier
recorded `2e1c9a08fc4d66510328cbb84038811102c5af20117fab61192cedc8ab1eb4d6`.
From that exported source directory, the command was:

```sh
HERMES_PYTHON=/opt/data/profiles/developer/cache/scratch/hermes-shared-display-history-testenv/bin/python scripts/run_tests.sh tests/hermes_state/test_hermes_state.py -k test_archive_and_compact_carried_rows_keep_identity
```

It returned **1 failed, 295 deselected** (`prior-integration-ordering.log`). This
establishes that the assertion mismatch predates this pagination fix; it does not
establish compatibility of all old display-order expectations with the new
contract. The broad suite has not subsequently been rerun to a wholly green result.
Upstream release integration remains blocked on resolving that contract/test
expectation explicitly, without weakening regression coverage.

Intermediate failed write-count/migration checks and the two interrupted initial
ChatHermes Python runs remain in their logs. Those interrupted runs exposed the
writer-lock reentry fixed by using the receipt connection. They are not counted
as passing checks. Source fingerprints and a complete portable upstream diff,
including new files, are in `continuation-source-fingerprints.json` and
`hermes-integration-continuation.patch`; earlier artifacts were preserved.

### Continuation limits and preservation

Bounded indexed paging applies to fresh indexed histories, valid materializations,
and reused read-only plans. A cold or invalidated complex plan still takes linear
metadata work; cache eviction can repeat that cost. A first read-only request after
a mutation does not secretly acquire a writer or publish an index. Unindexed
legacy stores still need body reads to derive missing identities. Offset work
grows with the requested offset. These limits are not an unconditional O(page)
claim for every cold history or every mutation.

No new browser, Android or Electron visual run was performed during this
continuation; the earlier screenshots/image fingerprints describe the earlier
fixture, not these new runtime files. No existing fixture was recreated or
deployed. No real-provider or real-user data was accessed. The validation build
is preserved in `tmp/shared-history/generated-build-continuation/`; only generated
tracked distribution files, clean at entry, were returned to their original HEAD
bytes after that copy. No reset, staging, commit, push, deployment or cleanup was
performed. The reviewed `.hermes-source` pin remains unmodified.
