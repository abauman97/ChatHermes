# Test and validate changes

Use the [developer setup](getting-started.md) first. Run commands from the repository root. Vite+ owns frontend linting, formatting, and the unit test runner; the npm scripts remain the project validation entry points.

## Local checks

```sh
vp fmt --check
vp lint
npm test
uv sync --locked
uv run ruff format --check .
uv run ruff check .
uv run ty check
PYTHONPATH=.hermes-source:plugin uv run pytest
PYTHONPATH=.hermes-source:plugin npm run test:api
npm run build
git diff --check
```

Use `vp fmt` to apply formatting. Build output under `plugin/chathermes/dashboard/dist/` is ignored and excluded from formatting/linting; never stage or commit it.

`npm run test:api` runs `uv run pytest tests/plugin_api.test.py`; `npm run test:docker` runs the Docker helper unittest suite through uv. For focused Python contracts, use the same environment, for example:

```sh
PYTHONPATH=.hermes-source:plugin uv run pytest tests/cron_delivery.test.py tests/execution_viewer.test.py tests/artifacts.test.py
```

For Python edits, use `uv run ruff format .` and `uv run ruff check --fix .`, then resolve remaining lint and `uv run ty check` diagnostics. Ruff checks all first-party Python; only generated/ignored files and the external `.hermes-source` checkout are excluded. ty retains its default correctness rules, promotes possible unresolved references/imports/attributes to errors, and checks override and suppression hygiene. Warnings fail the check too.

The default pytest suite collects both `test_*.py` and `*.test.py`, including Docker helper tests. `tests/integration/` probes require the isolated image and copied `/opt/plugins-src` path, so run them through the [Docker workflow](../../tests/docker/README.md), not the local default suite. Docker Compose validation skips when the Docker CLI is unavailable; the Android browser helper tests need Node.js. No provider credentials are needed. The `Python quality` GitHub Actions job runs the locked environment, non-modifying Ruff checks, ty, and the default suite against the exact source pin on PRs and main pushes. Repository administrators can require that job in branch protection.

Artifact extraction parity is defined by `tests/fixtures/artifact-deliveries.json`;
both `src/features/artifacts/artifacts.test.ts` and `tests/artifacts.test.py`
consume it without filesystem access. Native file security and reconciliation
contracts in `tests/plugin_api.test.py` separately use the reviewed Hermes file
router with isolated files and profile/session prerequisites. The root development
`python-multipart` dependency allows importing that router; it is not a plugin
runtime dependency. `tests/workflows/automatic-artifacts.spec.ts` exercises live
streaming, native resume, saved history, preview/download and library indexing in
the real plugin at desktop and mobile sizes.

`tests/fixtures/delivery-quotation.json` also covers closing trust tags quoted in
image-alt code, nested labels, LF/CRLF, literal openers and first eligible duplicate
reference definitions. Both extractors check original-source offsets. Reference
scaling tests exercise 2k/4k/8k definitions with wall-clock and growth budgets;
run them without competing benchmarks when investigating timings. The mounted
source-projection workflow checks quoted trust closures and duplicate reference
authority through resume/reload and the authenticated Library. Index revision
changes reconcile previously registered private paths without altering history.
`tests/fixtures/precise-trust-tags.json` adds adjacent real/quoted openers and
closers, nested image labels, LF/CRLF, native parts and explicit/automatic
deliveries. User uploads retain their explicit-only authority. Renderer tests
exercise 8k definitions with hidden ranges and duplicate eligibility. The mounted
`precise-trust-tags` workflow checks both marker directions, authenticated public
downloads, profile isolation, reload, focus, scrolling and Library exclusion.

`tests/fixtures/attached-context.json` captures the native PDF disk-path footer.
`tests/transcript.test.py` generates it with the pinned producer and checks
SQLite/history retention, actual soft-limit and multiline exception warning
placement and profile rejection.
The frontend attachment-context tests cover rendering, saved-response identity,
original upload cards, assistant/tool isolation and reference provenance,
including multiline code whose closing delimiter is removed by attachment or
warning truncation. Mounted workflows check those exact examples alongside
legitimate retained cards and profile-isolated downloads. The
attachment review regressions additionally assert that
`![pixel](https://attacker.invalid/x)` stays inline code when its closing backtick
is discarded, and that `@file:![pixel](https://attacker.invalid/x)` recovered from
a discarded fence stays literal. Component and projection tests reject image/link
elements; the mounted workflow counts attempted attacker-origin requests across
resume/reload while retaining a real image, link, tool reference and download.
The Desktop comparison executes the actual pinned hydration helper across diverse
marker, warning, quoting, reference and newline forms, including authored text
that Desktop intentionally truncates. This requires the reviewed `.hermes-source`
checkout; the comparison is skipped when it is absent.
Run `npm run test:integration -- tests/workflows/attachment-context.spec.ts` for
real PDF upload/staging with and without a native missing-file warning, live and
resumed bubbles, downloads, profile rejection, focus, model controls, disclosure
inspection and desktop/mobile screenshots. Warnings remain in raw history and
are hidden from user bubbles, matching Desktop.

Prefer observable user contracts. Retain focused protocol, security, deduplication, and pure-logic tests until replacements pass. See the [coverage migration audit](../../tests/test-audit.md).

Sidebar activity regressions in `useSessionActivity.test.ts` cover verified
root/tip aliases followed by an incomplete working/waiting snapshot, root
completion, and an incomplete unknown snapshot. They also check alias resets on
profile changes, runtime absence, unrelated identities and complete replacement
lineages. `tests/session_activity.test.py` verifies lineage completeness separately
from native activity and later ledger failures against the reviewed Hermes source.

## Real Hermes and browser workflows

The authoritative setup, rebuild, preparation, remote Docker, Android, failure inspection, and cleanup instructions are in [tests/docker/README.md](../../tests/docker/README.md). It documents the layered environment: Compose owns services, repository fixtures supply stock MockServer inference, and browser preparation and optional Android installation are independent steps.

Build explicitly with `npm run test:env:build`; run `npm run test:integration` for desktop/mobile workflows or `npm run test:integration:android` on a KVM-capable daemon. Tests do not rebuild implicitly. Failures retain containers and state for inspection. Isolate concurrent work with distinct Compose project names and published ports.

The reviewed release is Hermes v0.23.0, commit
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`. The Docker fixture pins the
official image by digest and verifies its install stamp at build and integration
startup; local tests use the same commit in `.hermes-source`. Follow the
[weekly compatibility procedure](../../tests/docker/README.md#first-run-and-explicit-rebuild)
when changing the pin, and record failures and exit statuses separately for each
validation command.
The [initial v0.23.0 verification record](../internal/verification/2026-11-09-hermes-v023-compatibility.md)
preserves the original blocked attempts. The [independent issue #252 review](../internal/verification/2026-11-09-issue252-review.md)
records clean ChatHermes baseline reproductions, workflow corrections, and subsequent
gate results. A pin update alone is not a claim that every workflow passes.

For UI changes, inspect screenshots of the actual dashboard plugin at desktop and mobile sizes and check focus, scrolling, attachments, selects, and disclosure transitions before committing. Documentation-only changes do not need visual testing. Legacy visual suites remain available as documented in the environment guide.

Real-provider testing is explicit opt-in through `npm run live:real` with root `.env` settings in a separate Compose project. `npm run live` uses deterministic inference. Never expose fixture ports publicly or share raw authentication traces.

The route-page workflow (`tests/workflows/route-pages.spec.ts`) opens each destination directly in the authenticated plugin, reloads nested pages, and checks back/forward traversal and composer/session continuity during streaming. Scheduled page tests also cover late responses after resource/profile changes and abort on navigation. Run these within the same isolated deterministic Docker project as the other workflows.

The transcript workflow (`tests/workflows/transcript.spec.ts`) seeds real Hermes
compaction/rotation/rewind history, then checks bounded HTTP responses and omitted native history, scroll
and fallback pagination, anchors, reconnect, live backfill and restored tool output
in the authenticated desktop/mobile plugin. Its mid-flight resume scenario uses
a paced `[workflow-resume]` SSE fixture, takes the browser context offline, and
uses a separate authenticated native viewer to witness a missed delta before
reconnecting. It checks the running omitted-history snapshot, subsequent deltas,
exact final text, saved history, draft/focus and scroll anchoring without route
mocks. `tests/transcript.test.py` integrates
with the pinned runtime's SQLite and display projection, including page sizes
1, 7, 119 and 120. Run it with the same uv environment and runtime `PYTHONPATH` as the
other Python contracts. Comparisons execute the pinned Desktop REST handler on the
same disposable DB, including a synthetic assistant-only coverage fixture that
returns answers before cloned prompts on both paths. This is evidence of a shared
limitation, not a production coverage diagnosis or a rendered Electron test.
`persisted-live-turn.test.ts` also executes pinned Desktop functions with plain-text
presentation adapters for interval, prefix and candidate comparisons; those
comparisons skip explicitly when the source checkout is absent. Full native
recovery assertions remain in `native-session.test.ts` and the mounted workflow.
The multi-rotation cost test counts payload rows/characters independently of HTTP
page length; all-ancestor work remains unbounded at the pin.

## Documentation checks

Resolve relative Markdown links from each document's own directory, including fragments and image paths. Check links to moved records and source files as well as the documentation index. Historical local evidence may be absent; label it as an unavailable historical path rather than a working link. Keep commands aligned with `package.json`, installation scripts, plugin configuration, and the reviewed native contract.

The scheduled result workflow (`tests/workflows/scheduled-result.spec.ts`) seeds
native Cron history and saved output, checks that only the final assistant response
is shown without work disclosures, and verifies script output and reload. Saved
agent documents use the native scheduler header and character frames, including
Unicode and quoted response headings. API regressions call the pinned scheduler's
actual header functions for multiline job names and native script envelopes,
including failed and silent runs. They verify extraction before credential
redaction and reject forged envelopes, ambiguous unframed agent success/error
documents, and truncated frames. The workflow opens distinct runs from the
history and direct URLs, reloads them, and rejects the same URL in another profile.

### Kanban integration

`npm test` includes Kanban availability/preference, authenticated board-scoped REST,
event cursor/reconnection, polling and stale-response contracts. Run the real API
and UI slice with `npm run test:integration -- tests/workflows/kanban.spec.ts`.
It creates uniquely named boards and unassigned tasks using the real plugin,
exercises task editing, moving, comments, attachments, external-client updates,
archive/delete, board isolation and the global opt-in on desktop and mobile.
The workflow also opens a persisted worker notification from Inbox, checks its
board/task destination and reload, and verifies one task creation button beside
the board selector. Screenshots include Settings, board and task details. Fixtures/state are retained
on failure. The suite needs the upstream Kanban plugin API active; a missing API
is a failure rather than silently skipped coverage. Unit transport faults cover
reconnect/polling; real active-worker execution and native device behavior remain
separate verification work.

Slash coverage lives in `ChatComposer.slash.test.ts`, the controller and native
gateway regression suites, and `tests/workflows/slash-commands.spec.ts`. The real
workflow seeds synthetic profile-local skills, bundles, quick commands and aliases
through the existing runtime helper, then exercises the installed plugin's catalog,
keyboard and touch selection, argument insertion, compact scrolling, skill turns,
backend status, compression, unsupported-command draft retention, reload, Project
workspace execution and profile isolation on desktop/mobile. It also reads live
reasoning state through an independent authenticated viewer, checks that a
reasoning query retains an unsent effort choice, and verifies MoA reference and
aggregator inference in MockServer plus post-turn route restoration and the next
ordinary turn. The MoA preset uses only synthetic fixture models and credentials.
Run it with
`npm run test:integration -- tests/workflows/slash-commands.spec.ts`; retain screenshots under
`tests/visual-output/`. `node scripts/sync-command-parity.mjs --check` compares
the execution boundary with the reviewed `.hermes-source` parity table.

Recalled-memory display regressions live in `src/components/memory-context.test.ts`,
`src/utils/memory-context.test.ts` and the native-session reconnect tests. They
exercise client-side raw memory, tool-separated text blocks, rendering/copy/file
suppression, source trust boundaries, exact inline code spans, authored XML,
character-split deltas, pending prefixes and replacement/profile isolation.
The utility contract executes the pinned Hermes producer/load lens through uv;
it skips when `.hermes-source` is unavailable. `tests/artifacts.test.py` exercises
the real Python extractor, SQLite Library store and checkpoint reconciliation,
including previously indexed memory records and multipart/tool-separated content.
The continuation matrix covers every split prefix of both exact producer notes
and the opener/note sequence with LF and CRLF, matching continuations, unrelated
`Answer [`/`Answer <` prefixes, paragraph padding, and user/system turn resets.
The real indexer worker reconciles stale metadata through the SQLite store;
frontend projections and component copy/render contracts check the same boundary.
The mounted prefix regression seeds the pinned producer across real tool rows
and checks resume/reload, external-request suppression and the background index.

Run `npm run test:integration -- tests/workflows/memory-context.spec.ts
 tests/workflows/attachment-context.spec.ts` for authenticated desktop/mobile
resume/reload, the mounted Library, upload authorization, composer focus and
attachment/select/disclosure contracts. The streaming workflow records only
synthetic assistant `message.delta` and `message.complete` text: the pinned upstream scrubber removes
the split XML block **before** native delivery. That browser scenario establishes
upstream block suppression in deltas, client suppression of arriving split notes,
and client suppression of the raw generated block delivered in `message.complete`.
It does not establish client handling of raw split block tags in live deltas.
Component and native-session tests supply raw blocks directly for that path.
These are Chromium viewports, not native-device or Electron tests. Raw multipart
history and stored/model fixture payloads are checked separately from presentation.

The boundary follow-up adds post-tool memory without a preceding newline, every
split position inside the memory opener, hidden assistant reference definitions,
and an 80k-character single-line timing regression. Python contracts execute the
pinned URL context expander with a synthetic MEDIA body and retain original-source
quotation checks around truncated context. Durable matching declines differing
raw attachment/warning suffixes. The memory workflow seeds these boundaries in
real Hermes history and checks authenticated indexing plus the mounted Library.

Reference-definition provenance regressions in `artifacts.test.ts`,
`memory-context.test.ts` and `tests/artifacts.test.py` cover untrusted wrappers,
blockquotes and lists before/after visible links, including tool-separated
assistant messages. The actual Python `Service.worker` reconciles stale SQLite
records and checks link-message ownership for legitimate references in both
orders and profile isolation. The mounted memory boundary workflow seeds
untrusted and blockquoted definitions around tool events and verifies cards and
the authenticated Library after resume/reload.

The independent block review adds unmatched cross-tool backticks around an
untrusted reference definition, an external image delivery and an exact producer
memory block, plus legitimate link → tool → definition delivery. The pure
`turn-parsing.test.ts` contract bounds parsed input bytes and times 200/400-block
turns; Python checks linear block-parse counts and the same timing sizes. The
mounted memory workflow seeds all four cases in real multipart history and
checks resume/reload cards, downloads and authenticated Library parity.

The shared `tests/fixtures/memory-note-deliveries.json` cases assert frontend/Python
parity for note deletion inside directives, destinations, annotations, Markdown
links and automatic paths, with both exact producer notes and legitimate delivery
controls. Actual transcript components cover history, turn blocks, copy and
character-by-character native deltas. The memory workflow checks the exact legacy
note repros on resume/reload in the mounted desktop/mobile plugin, preserves visible
prose and a real downloadable public control, and rejects cards, external image
requests and background Library entries for the manufactured deliveries.

Original-source span regressions are in `src/utils/source-projection.test.ts` and
`tests/fixtures/source-projection.json`, shared with `tests/artifacts.test.py`.
They cover hidden table cells and automatic images, retained code across context
truncation, memory-contained attachment/warning markers, both producer notes,
CRLF offsets, nested blocks, escaped pipes, repeated cells, authored code notes,
headings with closing hashes and table trust boundaries. Rendering is compared
with an independent unmodified Markdown parser for retained block grammar.

`src/utils/independent-review.test.ts` independently checks hidden autolinks,
astral/multi-code-point entities, overlapping spans, nested image-label code,
explicit versus automatic nested delivery consumption, and 1,000/2,000/4,000
disjoint hidden notes. Python checks both nested-delivery order and image-label
code provenance, including reconciliation from the previous parser checkpoint.
The mounted source-projection workflow also exercises these atomic leaks and
nested delivery controls through real history and Library indexing.

Run `npm run test:integration -- tests/workflows/source-projection.spec.ts
 tests/workflows/attachment-context.spec.ts tests/workflows/memory-context.spec.ts
 tests/workflows/markdown-context.spec.ts` against an explicitly rebuilt retained
Compose environment. The new scenario checks authenticated multipart history,
resume/reload, original upload bytes, wrong-profile 404s, Library indexing,
retained code, composer focus, scrolling, screenshots and attempted attacker
requests at desktop/mobile sizes. Existing memory/attachment workflows supply
native streaming/reconnect, selects and disclosure interaction coverage. Do not
run asset-serving API tests concurrently with `npm run build`: build replaces the
generated asset directory, so a concurrent request can observe an absent manifest.

`tests/fixtures/delivery-quotation.json` supplies frontend/Library parity cases for
multiline code in image labels, nested labels, line offsets, LF/CRLF and eligible
adjacent deliveries. Artifact tests include 8k/16k/32k disjoint-note extraction
budgets (4 seconds per size); these local wall-clock checks allow ordinary runner
variation and do not establish a production latency guarantee. The mounted
`source-projection.spec.ts` scenario checks that a real private file named in
nested image-alt code creates neither a transcript card nor a Library entry.
