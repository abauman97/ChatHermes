# Resumed user attachment context — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

> Historical evidence: the conservative parser and warning-preservation decisions
> below describe the earlier worktree state. The user's subsequent explicit
> Desktop-parity request supersedes those recommendations. Current behavior and
> validation are recorded in [the parity follow-up](2026-11-18-attachment-context-parity.md)
> and the authoritative [API contract](../../developer/api-contract.md).

## Evidence and cause

The report described a prompt followed by `--- Attached Context ---`, a
`📎 @file:.../uploads/chathermes/...` binary-file disk-path instruction and a PDF
card. The user attached a screenshot showing the reported behavior. The shared synthetic fixture
in `tests/fixtures/attached-context.json` reproduces that exact producer grammar,
including the complete instruction, rather than an invented generic footer.

Inspected Hermes v0.23.0 source in this worktree's ignored `.hermes-source`, at
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`:

- ChatHermes `useChatController.ts:34` produces the original filename annotation
  plus `MEDIA:"<upload path>"`. `/chat/prepare` in `plugin_api.py:1051` validates
  profile-local uploads; `native-gateway.ts:440` stages each non-image file via
  native `file.attach` and appends its returned reference before `prompt.submit`.
- Hermes `gateway/session_ancillary.py:136` implements that operation. It returns
  `ref_text` at line 180. `tui_gateway/prompt_attachments.py:209` quotes special
  paths; line 219 chooses workspace-relative or absolute references; line 278
  stages files. Uploads are copied into the profile's `attachments/`, so current
  staged references can differ from the original `uploads/chathermes/` identity.
- `agent/context_references.py:202` expands references, retains the authored
  input and appends warnings/context at lines 242–248. Lines 649–680 produce the
  exact `📎` binary/oversized disk-path instructions; line 389 produces fenced
  `📄` text previews. `gateway/session_context_refs.py:58` explicitly retains the
  expanded context in stored user text for later model turns.
- `gateway/run_inbound.py:1723` invokes expansion. `run_turn_prepare.py:608`
  chooses persisted text, `run_turn_runner.py:1000` passes the persistence
  override to the agent, and `run_turn_persistence.py:477` also preserves the
  expanded user row on transient failure. The new Python test runs the actual
  producer, persists through native `SessionDB`, and reads the real display
  history projection: the footer survives unchanged. Wrong-profile reads fail.
- ChatHermes `dashboard/transcript.py:37` uses pinned REST display projection;
  it does not strip this footer. Native `tui_gateway/session_history.py:300`
  projects user history without this attachment-context filter. ChatHermes
  `native-session.ts:348` maps snapshot `text`/`content` into messages. Both
  native and REST rows ultimately reach `UserMessage.vue:19`, which called
  `uploadedArtifacts` but previously removed only upload/reference annotations.
  Thus a card appeared while expanded model instructions remained in the bubble.
- Live `native-session.ts:293` records input; its pending-input guard keeps the
  optimistic attachment preview instead of replacing it with an echoed input.
  Authoritative history subsequently supplies durable references. One shared
  projection now handles both shapes. The separate broad footer regex previously
  in `saved-response-targets.ts` affected matching only, not rendering, and could
  erase authored notes from identity comparisons.

## Hermes Desktop comparison

Located the actual Desktop source within the same pinned checkout:
`apps/desktop/src/lib/chat-messages/hydration.ts`.
`displayContentForMessage` at line 126 matches the first context marker (regex at
line 30), removes everything after it, removes Context Warnings, scans the suffix
for file/folder/url/image/tool/terminal references and prepends missing refs.
`toChatMessages` at lines 498–524 accepts REST `content` and native `text`, then
lifts image/leading file references into the attachment row. Its resume caller
uses this for persisted history, activation and resume snapshots in
`use-session-actions/index.ts:1727`, `1741`, `2105` and `2883`.
`reference-kinds.ts:167` removes reference-only lines for comparisons; line 187
lifts leading file/folder refs. Desktop's own tests at
`lib/chat-messages.test.ts:234`, `249`, `420` and `439` cover footer hiding,
large pastes, native text and inline references.

The new Desktop comparison test transpiles and executes the pinned hydration
function itself. It proves that Desktop hides the reported producer footer, and
also that it truncates an ordinary authored marker example and hoists an example
reference. ChatHermes intentionally preserves that example. This comparison uses
plain-text/skill adapters, not a rendered Electron Desktop session.

## Change and self-review

`attached-context.ts` recognizes complete pinned binary, oversized-text and
fenced-text file blocks only after a top-level marker and an existing upload.
Each reference must match an original upload or the trailing staged reference
run. Markdown fences, blockquotes and indented/list examples do not establish the
marker. Complete suffix validation preserves unknown/malformed descriptions,
trailing authored prose and unrelated file references. Nested fences in native
Markdown previews are supported. CRLF, all three quote styles, multiple files,
attachment-only turns and the legacy same-upload-path/no-standalone-ref shape
have regression coverage.

`uploadedArtifacts` applies this before normal artifact extraction. Expanded
file bodies cannot establish new cards. Native staging directives disappear,
while the original annotation supplies the original filename and download path.
Rendering and `userProjection` now use the same parser; the matching-only regex
is removed. Authored marker headings before the upload and image content parts
are retained. Assistant/tool extraction, submission, persistence, authorization,
cancellation and profile/session transport are unchanged.

Self-review checked raw-content immutability, original file identities, partial
suffix rejection, Markdown boundaries, nested-fence termination, response-target
matching and scoped artifact props. There is no new file-reading capability.
The pin supplies no trusted footer-origin metadata: an authored, unquoted,
byte-for-byte complete native envelope with a matching upload is inherently
indistinguishable. Unknown future formats and unlinked legacy rewritten refs
are conservatively retained. Context-warning-only and non-file expansions are
outside this fix.

## Validation

- Locked installs: `npm ci`, `uv sync --locked`; no dependency manifests changed.
- `npm test`: 55 files, 1,822 tests passed after the final implementation.
  Additional final saved-target test: 2 passed.
- `npm run test:api` with `PYTHONPATH=.hermes-source:plugin`: 182 passed.
- Full `PYTHONPATH=.hermes-source:plugin uv run pytest`: 656 passed;
  focused transcript suite: 22 passed. Disposable pytest state is under this
  checkout's ignored `tmp/` for these final runs.
- `npm run build`, `vp lint`, `vp fmt`, `vp fmt --check`,
  `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`,
  and `git diff --check`: passed.
- Raw logs are under ignored `tmp/attachment-*.log` in this worktree.

## Mounted plugin verification

Isolated Compose project: `chathermes-attachment-context-20261118`, ports
24719/24780 (reserved Android ports 24760/24723). No production or other project
containers/profiles were changed. Explicit `npm run test:env:build` and Compose
`up -d --wait --no-build` applied the image; final tested image is
`sha256:e0ce5bcdc3dbab7b5a3a99fc4c5c88caefd568077df128938fe8b2948d499dae`.

The first attempt failed because the daemon's default address pools were
exhausted. An ignored Compose override uses the unused `10.251.118.0/24` subnet.
The next attempt reached healthy containers but failed fixture loading because
this remote daemon's loopback publications were unreachable from the runner.
An ignored task-local TCP relay forwards runner loopback through `docker exec`
to this project's Hermes/MockServer services; no public ports were introduced.
The retained configuration is `tmp/attachment-compose.yml`, with relay source
`tmp/attachment-forward.mjs`. Failed setup retained state throughout.

Final workflow and screenshot results are recorded below after inspection.

The final command was `npm run test:integration --
tests/workflows/attachment-context.spec.ts`, with the project/ports above,
`CHATHERMES_COMPOSE_OVERRIDE=$PWD/tmp/attachment-compose.yml`,
`CHATHERMES_TEST_URL=http://127.0.0.1:24719`,
`CHATHERMES_MOCKSERVER_URL=http://127.0.0.1:24780`, the checkout-local downloaded
Chromium executable and `TMPDIR=tmp`. It passed **2/2** in 23.0 seconds.
Final log: `tmp/attachment-integration-result.log`.

An intermediate retry with an absolute checkout-local TMPDIR failed because
Chromium's Unix singleton socket path exceeded the platform length limit.
Relative `TMPDIR=tmp` kept temporary files in this worktree and allowed launch.
The first mobile UI attempt timed out trying to open model controls while
compact editing intentionally hid them. The final test clicks the authored
message to leave editing before opening the picker; no product behavior was
changed for that test correction.

Inspected all six active/live/resumed images below. Desktop used 1280×720 at
DPR 1; mobile used Playwright's iPhone 13 viewport 390×664 at DPR 3. Both show
only the authored prompt (including its intentional inline marker phrase) and
one PDF card. Neither shows native `@file:` instructions or disk paths.
The workflow verifies focused input on Home, during execution and after resume;
visible active work; completed-row open/inspect/close; model picker/native
reasoning select with 16px text; no horizontal document overflow; and scrolling
the message into view. It verifies the exact uploaded bytes through the card's
same-origin authenticated download, checks a 404 in profile beta, and confirms
the raw history still contains the binary context. Reload covers persisted
history/native session reattachment rather than just optimistic local input.

Screenshots (ignored local evidence, relative to repository root):

- Desktop active: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/attachment-context-active.png`
- Desktop live: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/attachment-context-live.png`
- Desktop resumed: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/attachment-context-resumed.png`
- Mobile active: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-active.png`
- Mobile live: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-live.png`
- Mobile resumed: `tests/visual-output/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/attachment-context-resumed.png`

Limitations: this is Chromium mobile emulation, not a real iPhone/Android or
camera/keyboard test. The synthetic binary exercises PDF classification and
byte delivery, not a valid PDF renderer preview. No rendered Electron Desktop
or real provider was used. The short conversation exercises scrolling into view
and disclosure inspection, not long-history scroll anchoring (existing transcript
coverage remains). The baseline `ActivityRow.vue:21` defaults details to closed,
even for active rows; `TurnWork.vue:18` shows active rows but defaults the group
closed. An intermediate auto-expansion assertion failed on both sizes, exposing
this existing difference from AGENTS.md. The final workflow verifies the actual
visible active row and completed disclosure interactions and makes no claim that
automatic active-details expansion passed. This unrelated behavior was preserved.

Final self-review found no transport, profile validation, file-route, cancellation
or persistence changes. All requested local gates passed, and the final full
frontend rerun again passed 55 files / 1,822 tests. Tracked generated dist output
was restored after validation; ignored build assets and isolated test state remain.
No commit, staging, push, PR, deploy, dependency change or destructive environment
cleanup was performed. Only this isolated project's services were created/applied;
containers and the private task relay are retained for debugging.

## Independent review follow-up

The initial report incorrectly said no screenshot was attached. The user did
attach a screenshot; the evidence paragraph above has been corrected.

The pinned producer places its `--- Context Warnings ---` bullet section after
staged references and before attached context. The projection now bridges that
section when finding staged identities, then keeps warnings verbatim while
removing only validated attachment context and staged directives. Warning text
can include arbitrary exception messages, so preserving it also preserves
user-authored warning lookalikes. Unknown/malformed attachment suffixes remain
visible. The shared fixture now includes the actual soft-limit warning template;
the Python contract invokes the pinned producer with a low context budget and
asserts its exact warning placement, then verifies persistence/history retention.

Preview suffix recognition now uses an iterative search over offsets with a
10,000 state/fence-candidate budget. It no longer recurses through attacker-authored
preview examples or memoizes whole suffix strings. Exhausting the budget retains
the original content. A 12,000-preview adversarial regression with an authored
ending proves that parsing returns safely and retains that ending. Existing
nested Markdown fence and complete-suffix tests continue to pass.

Fresh local results (logs `tmp/attachment-review-*.log`):

- `uv sync --locked`: passed; no dependency changes.
- Focused frontend: 3 files / 28 tests passed; transcript: 23 passed.
- Full `npm test`: 55 files / 1,824 tests passed.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 182 passed.
- Full `PYTHONPATH=.hermes-source:plugin uv run pytest`: 657 passed.
- `vp fmt`, `vp fmt --check`, `vp lint`, `uv run ruff format .`,
  `uv run ruff check --fix .`, and `uv run ty check`: passed.
- `npm run test:env:build`, including `npm run build`: passed. Explicit Compose
  `up -d --wait --no-build` applied the rebuilt image to this task's retained
  isolated project. The integration runner verified image
  `sha256:0b810708ab153c506ffa4c8cd9c3747249c921d46eda8f2431ed66ded76cc489`.
  This supersedes the initial image/result above for the reviewed source.

Mounted follow-up: the same project, port assignments, private relay and browser
configuration documented above ran `npm run test:integration --
tests/workflows/attachment-context.spec.ts` against that rebuilt image. The final
run passed **4/4 in 40.9 seconds**, covering desktop/mobile uploads both with and
without a real missing-file warning. Raw history assertions check the exact native
missing-file warning, context retention and binary block. Resumed bubbles keep
the warning and original authored prompt, hide the attachment instructions/staged
refs, and show exactly one original PDF card. Download byte identity, foreign
profile rejection, focus during execution/after resume, native model controls,
disclosure inspection and scrolling checks all passed. Final log:
`tmp/attachment-review-integration-final.log`.

The first expanded run passed the two no-warning cases and failed the two warning
cases because the new assertion expected Markdown's source `-` bullet in rendered
DOM text. The failure output showed the correctly retained warning and hidden
attachment footer. The assertion now compares rendered text without the source
bullet, while separately requiring the exact warning in raw history. Only test
code changed for this correction; the rebuilt product image stayed the same.
Initial failure logs remain in `tmp/attachment-review-integration.log`; screenshots
and error contexts were copied to `tmp/attachment-review-first-output/` before
rerunning. Containers and session state were retained throughout.

Visually inspected all twelve final active/live/resumed screenshots under
`tests/visual-output/`: the existing no-warning directories linked above and
`attachment-context-PDF-att-43036--user-bubbles-with-warnings-{desktop,mobile}/`.
The warning-bearing resumed images visibly retain the warning heading/list and
one PDF card with no expanded disk-path instructions. The live screenshots show
the optimistic authored text before history adds warnings. Mobile remains Chromium
emulation; the existing active-disclosure, real-device, valid-PDF-renderer and
long-history limitations stated above still apply. No camera test was added.

Final `git diff --check`, frontend lint and formatting checks passed. Tracked
`dashboard/dist/` files were restored after image validation; generated ignored
output remains local. All source/test/documentation work remains uncommitted and
unstaged. No commit, push, deploy, production change or destructive cleanup was
performed; the isolated test containers and private relay remain available.

## Fresh independent review — total work and multiline exceptions

The per-preview fence budget above did not bound repeated top-level candidates:
each candidate rebuilt and reparsed its prefix and suffix. The new shared
1,000,000-character scan budget covers the initial Markdown pass, every candidate
(including its upload-prefix parser) and every preview-search state. The existing
10,000-state/fence cap remains. Inputs exceeding the shared budget skip context
hiding, and any exhausted search retains the original text. These conservative
fallbacks can leave native instructions visible on unusually large/ambiguous
messages rather than risk erasing authored text or blocking the UI.

The new 1,000-candidate regression checks a deterministic upper bound on upload
prefix scans, preservation of all candidate blocks and an authored ending, one
original upload identity, and a 1.5-second gate for projection plus full artifact
extraction. Its recorded focused duration was **87.4 ms**, under concurrent local
checks; this is the new regression input, not a reproduction of the reviewer's
exact benchmark environment. Machine-readable timings are retained in
`tmp/attachment-fresh-performance.json`. The 12,000-preview regression also passes
(528.7 ms for its complete extraction assertions).

Hermes `agent/context_references.py:277` interpolates exception strings verbatim;
line 245 prefixes warning entries with `- ` without indenting subsequent lines.
The warning bridge now accepts unindented and blank-line continuations while
preserving the section verbatim. Staged identities still come only from the
contiguous directives immediately before the warning heading, and the entire
file suffix must independently validate. A shared multiline-exception fixture is
generated by the actual pinned producer using an injected URL fetcher that raises
`RuntimeError`; no external URL is requested. The Python contract checks exact
output, persistence and history. Frontend regressions cover LF/CRLF, authored
warning continuations, malformed/unrelated suffixes and references inside warnings
that must not establish staged identities.

Fresh checks (logs `tmp/attachment-fresh-*.log`):

- `uv sync --locked`, Ruff format/check, ty, `vp fmt`, `vp fmt --check` and
  `vp lint`: passed.
- Focused frontend: 3 files / 30 tests; full `npm test`: 55 files / 1,826 tests.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 182 passed.
- `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py`:
  24 passed. The full Python suite was not repeated for this follow-up.
- Explicit `npm run test:env:build`, including `npm run build`: passed.
  Compose applied the rebuilt image only to the retained isolated project above.

Final mounted verification used the same project/ports, override, private relay,
Chromium executable and relative `TMPDIR=tmp` documented above. The integration
runner verified final image
`sha256:21a885368aeaf60a99dce8ed6a102ad13c709c8038157b29f9f92b5a5d093210`.
`npm run test:integration -- tests/workflows/attachment-context.spec.ts` passed
**4/4 in 47.6 seconds**. Log: `tmp/attachment-fresh-integration.log`.

Inspected all twelve newly generated active/live/resumed desktop/mobile images
in the same four `tests/visual-output/attachment-context-PDF-att-*` directories
listed above. Authored inline marker prose and exactly one PDF card remain;
resumed missing-file warnings remain visible while staged refs and binary disk
instructions are hidden. Download bytes, foreign-profile rejection, composer
focus, native model/reasoning controls, disclosure inspection, scrolling and
horizontal-overflow assertions passed against this final image.

The browser scenarios exercise actual missing-file warnings; the new multiline
exception grammar is verified by the pinned-producer Python contract and frontend
regressions, rather than by injecting an exception into the live server. Mobile
is still Chromium emulation. The earlier active-disclosure, real-device,
camera, PDF-renderer and long-history limitations remain unchanged.

Final frontend formatting/lint and `git diff --check` passed. Tracked generated
dist files were restored after validation; ignored build output remains local.
Changes remain unstaged and uncommitted. No commit, push, deploy or destructive
cleanup was performed; this isolated project's containers, state and private
relay remain available for debugging.
