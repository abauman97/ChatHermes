# Context boundary follow-up — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

Continued only in the existing attachment-context worktree, preserving prior work.
This record supersedes the boundary, Library-exclusion and durable-matching claims
in [the preceding review record](2026-11-18-memory-context-review.md) where they
conflict. No upstream checkout edits, dependency changes, secrets, other worktrees,
deployment, staging, commits or PRs were used.

## Reproductions and changes

The reported-defect regressions were run with the original mechanisms temporarily restored, then
the working fixes restored in a `finally` block. Evidence is retained in
`tmp/context-regression-red-frontend.log` (five failures) and
`tmp/context-regression-red-python.log` (20 failures). These are controlled
mechanism reproductions in this worktree, not claims of a pristine checkout run.
An initial upstream-expansion test omitted its required context-length argument;
that test setup was corrected before the recorded Python reproduction.

- Ordinary prose before a tool previously joined directly to a following memory
  opener, leaking its body and making the external MEDIA image eligible. Assistant
  source assembly now preserves text-event newline boundaries, avoids duplicating
  existing newlines, and rejoins interrupted XML tags and incomplete exact recalled-note
  prefixes. Completed notes retain a boundary before a subsequent memory block;
  a later inspection added explicit component/Python coverage for that case. Per-block offsets preserve delivery and message ownership. Components
  check rendering, copy, cards and fetches, including every opener split and its
  adjacent newline. Python uses the same assembly boundary rules.
- Expanded user context previously became uploaded Library artifacts, including
  remote images from actual pinned URL expansion. Python now excludes the original
  context/warning suffix from delivery eligibility and reference definitions.
  Markdown/trust classification still sees the complete original source, so a
  removed closing code delimiter cannot promote a quoted prefix. Native image
  parts, retained upload annotations and valid deliveries retain their handling.
- Hidden assistant rows previously supplied reference definitions to visible rows.
  They are now excluded before assistant source construction, as well as from final
  extraction. Tool results retain their existing separate explicit-envelope rules.
- Inserting a newline inside a memory opener split across a tool previously defeated
  Python exclusion. Producer-built regressions cover all opener split positions,
  plus the adjacent newline, and retain the public delivery's original message ID.
- The single-line scan repeatedly rescanned its prefix. It now tracks line state,
  inspects candidate opening characters, and advances through sorted protected
  code ranges. The original 80k regression measured 1,521.69 ms. Final standalone
  samples measured 4.58–52.81 ms for 80,010 characters and 19.34–70.40 ms for a
  90,000-character line with thousands of code spans (`tmp/context-performance.log`).
  The regression allows 250 ms on this runner; this is not a universal latency or
  parser-complexity guarantee.
- Display truncation made prompts differing only after a marker share an inferred
  durable answer. Matching now includes raw attachment/warning suffixes. Differing
  suffixes, or expansion present on only one side, yield no inferred targets.
  Identical suffixes can still match. Native expansion can therefore delay inferred
  branch availability until authoritative saved history arrives. Explicit native
  response identities retain their existing behavior.

The Library parser checkpoint advances to `memory-context-v3` so reconciliation
reprocesses existing records. Existing real SQLite worker/store reconciliation
regressions remain in the suite; mounted checks inspect the real Library as well.

## Validation

| Final check                                                            | Result / evidence                                                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `uv sync --locked`                                                     | Passed; environment already synchronized, no dependency changes                           |
| `npm test`                                                             | 57 files, 1,842 passed; `tmp/context-tests-final3.log`                                    |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                       | 686 passed; `tmp/context-python-final3.log`                                               |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                    | 182 passed; `tmp/context-api-final3.log`                                                  |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check` | Passed; `tmp/context-ruff-format.log`, `tmp/context-ruff.log`, `tmp/context-ty-final.log` |
| `vp fmt`, `vp lint`, `vp fmt --check`                                  | Passed; `tmp/context-fmt.log`, `tmp/context-lint-final.log`, `tmp/context-fmt-check.log`  |
| `npm run build`, `npm run test:env:build`                              | Passed; final build runs the production build too; `tmp/context-env-build-final3.log`     |

The first full frontend run found six existing assertions that expected lossy
identity matching. Their expectations now preserve the ambiguity while continuing
to check original cards/quotation. The final run above passed after all source
changes, including the protected-code-range scan improvement.

## Mounted validation

Used only project `chathermes-attachment-context-20261118`, ports 24719/24780,
its existing `tmp/attachment-compose.yml` subnet override, and the existing private
relay script `tmp/attachment-forward.mjs`. The initial image apply accidentally
omitted the override: Compose stopped the project containers and removed its
network, then failed to allocate from exhausted default Docker pools
(`tmp/context-compose-apply.log`). Reapplying with the original explicit subnet
succeeded (`tmp/context-compose-apply-final.log`). Volumes and fixture sessions
were retained. The first integration attempt then stopped before browser setup:
MockServer's old container lacked a network attachment after the network repair
(`tmp/context-mounted.log`). Compose explicitly recreated only that fixture service
with the original subnet (`tmp/context-mockserver-network-repair.log`), restoring
DNS and readiness; repository fixtures are loaded through the normal REST loader.
The final image was then applied with the original override
(`tmp/context-compose-final3.log`).
No volumes were reset and no other projects were changed.

Final tested image:
`sha256:f934054858dce38a9d48793524fc93c4fad9064f3ee3978e12e849bbd65a1899`.
The runner verified this image and Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`.

```sh
COMPOSE_PROJECT_NAME=chathermes-attachment-context-20261118 \
CHATHERMES_DASHBOARD_PORT=24719 CHATHERMES_MOCKSERVER_PORT=24780 \
CHATHERMES_COMPOSE_OVERRIDE=tmp/attachment-compose.yml \
CHATHERMES_TEST_URL=http://127.0.0.1:24719 \
CHATHERMES_MOCKSERVER_URL=http://127.0.0.1:24780 \
CHATHERMES_CHROMIUM=$PWD/tmp/playwright-browsers/chromium-1243/chrome-linux64/chrome \
TMPDIR=tmp npm run test:integration -- \
  tests/workflows/memory-context.spec.ts tests/workflows/attachment-context.spec.ts \
  --output=tests/visual-output/context-boundary-verified
```

The first browser run was 14 passed / 2 failed (2.3 minutes),
`tmp/context-mounted-final.log`. Both new boundary scenarios stopped on an
ambiguous test locator: the response correctly rendered in two assistant text
phases, and `toContainText` requires one element. The assertions now target the
first and last phases. Production code was unchanged. Its captures and failure
contexts remain under `tests/visual-output/context-boundary-follow-up/`.

The next full run was 15 passed / 1 failed (2.6 minutes),
`tmp/context-mounted-final2.log`, under `tests/visual-output/context-boundary-final/`.
The mobile boundary fixture's index poll timed out after 30 seconds. That fixture
writes SessionDB directly, producing no completion/upload event to wake indexing;
the real service scans every 60 seconds. An authenticated follow-up confirmed the
same retained session indexed exactly its legitimate upload
(`tmp/context-eventual-index.log`). The scenario now polls the same observable API
for up to 75 seconds with a 120-second total test budget. No fixed readiness sleep,
service cadence change, reset or artificial index trigger was added. Production
source and tested image did not change for either test-only correction.

The final full run passed **16/16** (eight desktop, eight mobile; 3.7 minutes),
`tmp/context-mounted-verified.log`. The boundary scenarios took 46.3 seconds on
desktop and about one minute on mobile, within the real scan contract. They
verified that each synthetic session's authenticated index contains exactly its
retained upload, the mounted Library exposes that upload, and no request to the
synthetic attacker host was observed. They also checked raw post-tool/split-opener
history resume/reload, absence of memory prose/cards, and composer focus.
The existing workflows checked original download bytes, wrong-profile rejection,
Home/in-flight focus, selects and 16px input sizing, scroll bounds, authored notes,
raw stored/model continuation, completed disclosure opening/closing, and native
stream/resume/terminal behavior. No unrelated full browser suite or real-provider
suite was run.

Inspected all six final boundary screenshots and representative attachment
active/resumed captures, plus memory/Library captures from the preceding runs of
the same production image. Desktop and mobile boundary **resume** captures show
the retained card, visible answer, completed tool group and final prose in order.
Both final Library captures show the retained upload without promoted context
cards. The desktop and mobile boundary **reload** captures are largely blank or
partially unpainted; the final desktop attachment-active capture is shifted out of
frame. These continue the previously recorded capture/layout limitation. Passing
DOM visibility/focus assertions do not establish stable painted geometry at those
instants. Existing compact active disclosure defaults were not repaired by this
follow-up; completed disclosure inspection passed.

Selected final evidence:

- Desktop boundary resume: `tests/visual-output/context-boundary-verified/memory-context-post-tool-a-52d19-tay-out-of-the-real-Library-desktop/boundary-resume.png`
- Desktop boundary Library: `tests/visual-output/context-boundary-verified/memory-context-post-tool-a-52d19-tay-out-of-the-real-Library-desktop/boundary-library.png`
- Mobile boundary resume: `tests/visual-output/context-boundary-verified/memory-context-post-tool-a-52d19-tay-out-of-the-real-Library-mobile/boundary-resume.png`
- Mobile boundary Library: `tests/visual-output/context-boundary-verified/memory-context-post-tool-a-52d19-tay-out-of-the-real-Library-mobile/boundary-library.png`

Final `git diff --check` passed. Initially clean tracked generated dist files were
restored after image construction; ignored generated output remains local. No
dist changes or staged files remain. The upstream source checkout is clean.
Fixture containers, volumes, relay and synthetic failure evidence remain available
for inspection; no cleanup was performed.

## Limits

This is presentation and artifact-eligibility filtering, not a secrecy boundary.
Raw persisted/model-facing context remains available. The producer note identifies
exact grammar, not authenticated provenance; byte-identical authored copies remain
ambiguous. Other provider rewrites and malformed/nested Markdown are not claimed.
The mounted upstream stream still strips XML blocks before deltas reach the plugin;
raw split-tag client coverage comes from component/runtime regressions. The tests
use synthetic data and Chromium desktop/mobile viewports, not real providers,
Electron, physical devices, native keyboards or cameras.
