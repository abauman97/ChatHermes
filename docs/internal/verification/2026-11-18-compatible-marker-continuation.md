# Compatible marker continuation review — 2026-11-18

## Change and scope

Addressed independent review P1 in `src/utils/memory-context.ts` and
`plugin/chathermes/dashboard/artifact_extraction.py`. A possible trailing prefix
alone no longer removes a native paragraph boundary: the next text must continue
the same recognized producer/trust marker. Complete producer openers can continue
through their required LF/CRLF into either exact note. Completed notes do not join
unrelated blocks. Native Markdown boundaries and message ownership remain intact.

Matching examines at most the longest recognized marker's suffix and only the
missing marker bytes from the incoming block. It does not scan incoming bodies
or reparse the turn per candidate prefix. The Library checkpoint advances from
`reference-provenance-v5` to `reference-provenance-v6` to reconcile stale metadata.
Existing worktree changes were preserved. Only the existing deterministic test
fixture was rebuilt/recreated; no deployment, staging, commits, PRs, upstream
source edits, other worktree edits, credentials or user-session inspection.

## Regression coverage

Frontend projections cover every split of both producer notes and the complete
opener/newline/note sequence, LF and CRLF, matching and mismatched continuations,
zero/one/two trailing newline padding, character-by-character marker events,
rendered text, cards and copy output. Genuine split markers continue to join.

The Python test uses the actual indexer service worker, reconciliation queue,
SQLite storage and paginated Library results, for both synthetic profiles. It
covers all producer-prefix splits and mismatches, intervening tools, user/system
turn resets, public delivery ownership and replacement of stale v5 private-image
records. The mounted regression uses the pinned producer across real tool rows,
with `Answer [`, `Answer <`, longer unrelated prefixes, and genuine tag/note
splits. It checks resume/reload, focus, no recalled text/cards/external image
requests, and the real background index retaining only the public positive control.

A temporary diagnostic recreated the old unconditional join for the two exact
repros using the pinned producer: each promoted one synthetic private image;
the final separator promoted zero. This diagnostic emulates that branch, rather
than claiming a checkout of the entire earlier implementation.

## Local verification

- `uv sync --locked`: passed, no dependency changes.
- `npm test`: **1,869 passed**, 58 files, 68.06 seconds. A separate full
  `npm test -- --maxWorkers=2` run also passed all 1,869.
- `PYTHONPATH=.hermes-source:plugin uv run pytest`: **712 passed** after the final
  turn-reset assertion, in 95.45 seconds.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**.
- Focused final Python artifact contracts: **273 passed**.
- `vp fmt`, `vp fmt --check`, `vp lint`: passed.
- `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`: passed.
- `npm run test:env:build`, including `npm run build`: passed.

The first full frontend run reported 1,864 passes and five failures: a producer
probe exceeded its existing five-second timeout during concurrent checks/build,
and four newly added component cases accidentally seeded an empty transcript,
which displayed Home. Adding their user message corrected that fixture; all 28
focused frontend cases passed. The full final run with two workers then passed.
An initial positive-control fixture also needed a blank paragraph after an HTML
memory block to make its ordinary public MEDIA line eligible under Markdown.
No production behavior was changed to satisfy these fixture corrections.

The retained 200/400-block performance contracts pass, including parsed-input
bounds and exact Python parse counts (400/800 block parses). An additional
focused run measured frontend **60.7/80.4 ms** and Python **84.1/103.1 ms**.
These are timings under concurrent validation load, not a controlled benchmark
or a new speedup claim.

## Mounted build identity

Built explicitly, then applied through Compose `up -d --wait --no-build`, using
only project `chathermes-attachment-context-20261118`, ports 24719/24780, its
existing private network override and task-local loopback relay. Containers and
state remain retained. Integration verifies Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and image
`sha256:7159d3457e9afb94dfd6937b93f64b20fcd727edd264bcbf771edd79185f91c9`.

The final local and container Python extractor/indexer hashes match. Before restoring tracked generated files, the entire built
local dist tree matched the container tree by path and SHA-256.
Hash manifests are retained in ignored `tmp/p1-*-hashes.log`. Final frontend
source hash for `src/utils/memory-context.ts` is
`5dd7b69dd7896671c042f54b7940183db86e3e47c8ff9c06a3e362cb1718f080`.

The initial broader mounted run recorded nine passing desktop cases, then ended
with signal 143 without an assertion-failure summary. Its cause is not established.
An attempted background launch did not persist or execute tests; it contributes
no coverage. Verification continues in bounded integration batches against the
same final image, with no fixture reset or cleanup after interruption.

All **38 distinct desktop/mobile cases** in the selected four workflow files
have passing final-image runs. This is coverage across batches, **not one
uninterrupted 38/38 run**:

| Run                                                   | Passing cases | Result                      |
| ----------------------------------------------------- | ------------: | --------------------------- |
| Initial broader desktop run                           |             9 | Interrupted with signal 143 |
| New incompatible-prefix regression, both sizes        |             2 | Completed                   |
| Native-block/forward-reference regression, both sizes |             2 | Completed                   |
| Remaining memory cases, mobile                        |             3 | Completed                   |
| Attachment context and Library, mobile                |             6 | Completed                   |
| Messaging, desktop                                    |             8 | Completed                   |
| Messaging, mobile                                     |             8 | Completed                   |

These cover the full selected `memory-context`, `attachment-context`, `artifacts`
and `messaging` workflow files at both sizes. Assertions include authenticated
uploads/downloads and profile isolation, no external image requests, background
index results, native streaming/resume, focus while working, scrolling, model
and reasoning selection reaching inference, cancellation, ordering, and active
versus completed disclosure transitions.

Visually inspected final desktop/mobile prefix reload captures, desktop memory
reload and PDF attachment captures, mobile PDF resume, mobile native-block reload
and Library, and desktop active/expanded versus completed/collapsed activity and
mobile completed/collapsed activity. The exact prefix repro preserves public prose
and tool order without displaying recalled text or creating an image card. The
Library shows public deliveries; synthetic private-image entries are absent.

This is mounted Chromium desktop/mobile viewport coverage, not native-device,
Electron or real-provider coverage. The upstream scrubber removes split XML
blocks before live deltas; component/native-session contracts exercise raw split
XML client projection. Exact producer text still has no cryptographic provenance.
Raw history and model context remain intact.

Logs are under ignored `tmp/p1-*.log`; the passing-case union is recorded in
`tmp/p1-mounted-summary.json`. Captures are under
`tests/visual-output/p1-compatible-final/`, `p1-prefix-final/`, `p1-block-final/`,
`p1-memory-mobile-final/`, `p1-attachment-mobile-final/`,
`p1-messaging-desktop-final/` and `p1-messaging-mobile-final/`.

Tracked generated dist files were restored to their initially clean state after
build/hash verification. No generated assets are staged. The upstream source
checkout and staging area remain clean. Containers and failed/interrupted state
were retained; no cleanup/reset was performed. Final formatting, lint and
`git diff --check` passed.
