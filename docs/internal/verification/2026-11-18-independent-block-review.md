# Independent native-block review — 2026-11-18

Preserved the pre-existing worktree changes. No upstream source edits, other
worktree edits, secrets, deployment, staging, commits or PRs. Generated dist
files are restored to their initially clean tracked state after image builds.

## Corrections

Native assistant text blocks retain independent Markdown parsing boundaries,
even when XML/producer-note fragments must be adjacent in the assembled source.
An unmatched backtick or fence cannot become a delimiter in another block.
Trust depth and exact recalled-memory ranges still continue across tool events.
Classifiers use original source before masking memory or discarded user context.
Only eligible reference definitions enter the shared reference environment.

Frontend turn projection classifies memory, trust and reference authority once,
then projects deliveries from each local block. Python extracts each complete
assistant source once and attributes deliveries by source offsets to native
message IDs. Legitimate forward and backward references cross tools; the link
message owns the delivery. Discarded user suffixes remain excluded. The Library
checkpoint advances from `reference-provenance-v4` to `reference-provenance-v5`
so stale promoted metadata is reconciled without changing file authorization.

Regression cases include the exact `Examining \`file`→ tool → untrusted
reference, external-image and exact producer-memory examples; no padding, one
newline and two newline variants; partial producer tags; legitimate unpadded`[download][x]`→ tool →`[x]: MEDIA:/tmp/public.pdf`; rendering, copy,
network/card suppression, message ownership and previous-checkpoint replacement.
The original combined-source parser still reproduces `/tmp/private.pdf`
promotion in the diagnostic baseline. Additional backend newline regressions
were run red before the last separator fix: two failures, seven passes.

## Performance

Same synthetic corpus: 200 distinct assistant blocks, each containing ordinary
prose, a reference link and its MEDIA definition, with native block boundaries.
A temporary benchmark emulated the repeated complete-source API calls using the
retained slice API. This is a lower-bound emulation, not a checkout of the exact
pre-fix implementation; some redundant parses have already been removed there.

| Path                 | Repeated full-source baseline |                    Shared classification |
| -------------------- | ----------------------------: | ---------------------------------------: |
| Frontend, 200 blocks |                      1,950 ms | 18 ms, warmed immediately after baseline |
| Python, 200 blocks   |                      5,683 ms |                                    43 ms |

The final isolated frontend budget run measured 38/49 ms for 200/400 blocks;
an earlier run measured 39/87 ms, and
214/202 ms under concurrent build/test load. Python focused runs measured
67/124 ms with 400/800 Markdown block parses. Timing varies with load. Tests
bound total frontend parsed input to less than five times assembled source size,
assert exactly two Python block parses per native block and parsed input below
three times assembled source size, check output cardinality,
and bound each 200/400-block extraction to 1.5 seconds. These structural bounds
verify removal of the repeated full-turn parsing, independently of timing.

## Local validation

- `uv sync --locked`: passed; no dependency changes.
- `npm test`: **1,863 passed**, 58 files.
- `PYTHONPATH=.hermes-source:plugin uv run pytest`: **706 passed**.
- Focused artifact Python contracts: **267 passed**.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**.
- `vp fmt`, `vp fmt --check`, `vp lint`: passed.
- `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`: passed.
- `npm run build` through explicit `npm run test:env:build`: passed.
- Final `git diff --check`: passed.

The first full frontend run exposed two discarded-user-context regressions during
the refactor. Restoring the standalone prefix limit fixed both; focused and full
final runs pass. This restriction is separate from assistant turn references.

## Mounted validation

The initial broader run finished **15 passed / 3 failed** and used image
`sha256:7df718c3b627b3dcf0cfba52545c9d069441b03958f17f947fdc23ee314c6beb`.
Its new desktop scenario passed transcript, download and API-index checks, then
failed a test locator that counted both the Library preview and download links.
Both desktop and mobile encountered that same locator issue. The locator now
selects the accessible download link. Its mobile streaming
scenario also missed the raw completion frame (`completions` was empty); the
assertion was retained unchanged and passed in the final run. All initial failure state
and captures remain under `tests/visual-output/block-review/`.

Only the existing deterministic Compose project
`chathermes-attachment-context-20261118`, ports 24719/24780 and its existing
private network override are used for mounted validation. A task-local loopback
relay makes the remote Docker services reachable. Containers/state are retained.
This is Chromium desktop/mobile viewport coverage, not native-device, Electron
or real-provider coverage. Raw multipart history and model context remain intact;
exact producer text still has no cryptographic provenance.

The final image was explicitly built with `npm run test:env:build` and applied
with Compose `up -d --wait --no-build`. Integration verified Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and image
`sha256:13124782727391ef40b94d8508b7ee0e2fa6d8310c7c0cd5fb56c5cd7a442d11`.
The final broader run recorded **16 passes**, then the runner ended with signal
143 before the last two mobile cases reported results. It produced no assertion
failure summary; the cause of that termination is not established. Containers
remained healthy and all state was retained. A focused integration run of those
two cases against the same final image passed **2/2** in 27.6 seconds. Thus all
**18 distinct desktop/mobile cases have passing final-image runs**; this is not
claimed as one uninterrupted 18/18 run.

Inspected final desktop boundary resume, exact-review reload and Library images,
and final mobile exact-review reload and Library images. The public PDF card is
at the forward link before its tool disclosure; exact memory remains hidden.
The authenticated per-session Library query contains only the public delivery,
with no promoted private/external-image entries. Tests also verify no external
image requests, original download bytes, reload, profile isolation, attachment
handling, focus, selects, scrolling and disclosure transitions. Earlier mobile
PDF attachment resume images were also inspected. The final exact-review reload
captures are painted and readable. Raw split XML deltas still rely on component
and native-session contracts: the pinned upstream scrubber removes those blocks
before live delivery, as documented in the current testing guide.

Logs are retained in ignored `tmp/review-full-frontend-final.log`,
`tmp/review-full-python-final.log`, `tmp/review-api-final.log`,
`tmp/review-env-build-complete.log`, `tmp/review-integration-final.log`,
`tmp/review-integration-mobile-final.log`, `tmp/review-benchmark-isolated.log`
and `tmp/review-byte-budget.log`. The baseline JSON files are
`tmp/review-benchmark.json` and `tmp/review-benchmark-python.json`.
Final screenshots are under `tests/visual-output/block-review-final/` and
`tests/visual-output/block-review-mobile-final/`. The upstream source checkout,
staging area and tracked dist changes are clean. No cleanup/reset was performed.
