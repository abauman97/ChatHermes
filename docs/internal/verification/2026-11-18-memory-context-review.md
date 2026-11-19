# Memory-context independent-review follow-up — 2026-11-18

> Screenshot paths below identify ignored local verification artifacts, not repository links.
> Captures are excluded from version control and may be absent from another checkout.

Later review found additional boundary and Library defects. See the
[context-boundary follow-up](2026-11-18-context-boundary-follow-up.md) for corrections
and newer verification; this record remains historical evidence.

Continued in the existing worktree, preserving prior attachment-context and
memory-context changes. This supersedes the current-behavior and coverage claims
in [the original record](2026-11-18-memory-context.md). No upstream source,
dependencies or lockfiles changed. No other worktree, provider credentials,
deployment, commit, staging, push or PR was used.

## Reproductions and fixes

1. `tmp/memory-review-red.log` reproduces external image promotion from the
   reported memory/untrusted-wrapper ordering, authored multiline XML suppression,
   and a code span shielding an adjacent recalled note. Artifact trust now uses
   the original complete source. Memory offsets are excluded after classification;
   hidden trust openers still protect their later bodies. Memory reference
   definitions and attachment references cannot supply file destinations.
2. The first new tool-separated component test had an invalid empty transcript
   prerequisite. Corrected it to include a user message, then temporarily restored
   per-block projection to isolate the defect: `tmp/memory-review-block-red.log`
   shows `RECALL_PRIVATE` and the external image card. Restored the fix and verified
   rendering, copy and artifact suppression against the complete turn source.
   Projection is recomputed for replacement snapshots; raw blocks remain intact.
3. `tmp/memory-review-python-red.log` reproduces actual extractor indexing of a
   producer-built multipart memory block and the old checkpoint skipping refresh.
   `tmp/memory-review-python-split-red.log` additionally reproduces indexing across
   tool-separated assistant messages. The real extractor now excludes generated
   memory, retaining original trust/code boundaries and non-memory reference
   definitions. A versioned checkpoint forces reconciliation of existing records.
   The regression inserts a private file into the real SQLite Library store under
   the previous checkpoint, runs the actual worker/reconciler, and verifies its
   removal plus retention of the valid public delivery in both fixture profiles.
   Native file authorization/validation, profile/session identity, tombstones and
   actual image-part handling remain unchanged.
4. Inline protection now uses actual Markdown paragraph code-span source offsets.
   A follow-up regression caught a whole-document `parseInline` incorrectly pairing
   unmatched backticks across paragraphs (`tmp/memory-review-code-red.log`). The
   final parser uses the real inline tokens and maps their offsets to source.
5. Multiline XML without the producer's exact recalled note remains authored text.
   Tests cover ordinary notes, authored XML and fenced/indented/inline code. Existing
   synthetic bare-marker tests were updated to use real producer-note grammar.
   Exact authored copies of generated blocks/notes remain indistinguishable without
   provenance; the note is a grammar signal, not authenticated provenance.
6. The browser stream test now observes exact allowlisted synthetic native
   `message.delta`, `message.complete` and resume `inflight.assistant` text.
   Its name and assertions distinguish upstream suppression in deltas, client
   suppression of split notes, and client suppression of the raw generated block
   arriving in terminal `message.complete`. Raw split-block client coverage comes
   from component/native-session tests, not from the upstream-sanitized deltas.

The added delivery-after-tool component check also passed, confirming that a file
at the start of the later text block still produces a card.

## Final local validation

| Command                                                                                           | Outcome / evidence                                                                                                     |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `uv sync --locked`                                                                                | Passed; `tmp/memory-review-sync.log`                                                                                   |
| `npm test`                                                                                        | 57 files, 1,839 passed; `tmp/memory-review-tests-final.log`                                                            |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                                               | 182 passed; `tmp/memory-review-api.log`                                                                                |
| `PYTHONPATH=.hermes-source:plugin uv run pytest tests/artifacts.test.py tests/transcript.test.py` | 246 passed; `tmp/memory-review-python.log`                                                                             |
| `uv run ruff format .`                                                                            | Passed; `tmp/memory-review-ruff-format.log`                                                                            |
| `uv run ruff check --fix .`                                                                       | Passed; `tmp/memory-review-ruff.log`                                                                                   |
| `uv run ty check`                                                                                 | Passed; `tmp/memory-review-ty.log`                                                                                     |
| `vp fmt`, `vp fmt --check`, `vp lint`                                                             | Passed; `tmp/memory-review-fmt-final.log`, `tmp/memory-review-fmt-check-final.log`, `tmp/memory-review-lint-final.log` |
| `npm run build` / `npm run test:env:build`                                                        | Passed; `tmp/memory-review-build.log`, `tmp/memory-review-env-build.log`                                               |

Intermediate failures included two older bare-marker test fixtures (updated to
include producer notes), a missing required direction on the stale-index fixture,
and a missing `@override` decorator in its test source. These were corrected;
the final runs above supersede intermediate logs. The artifact suite also caught
an assistant-message concatenation changing automatic/explicit delivery priority;
separate persisted Python assistant messages now retain newline boundaries.

## Mounted validation

Reused only `chathermes-attachment-context-20261118`, dashboard/MockServer ports
24719/24780, and its ignored `tmp/attachment-compose.yml` override. The private
relay is `node tmp/attachment-forward.mjs`. Built with `npm run test:env:build`,
then explicitly applied with Compose `up -d --wait --no-build`, preserving volumes
and fixture sessions. No cleanup-on-failure or reset was performed.

Tested image:
`sha256:84ad30237693409d9d392296737798aead954696bc9c68f04ce60fad5aeca9db`.
The runner checked that image identity and Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`.

Invocation (same project, ports and override for build and integration):

```sh
COMPOSE_PROJECT_NAME=chathermes-attachment-context-20261118 \
CHATHERMES_DASHBOARD_PORT=24719 CHATHERMES_MOCKSERVER_PORT=24780 \
CHATHERMES_COMPOSE_OVERRIDE=tmp/attachment-compose.yml \
CHATHERMES_TEST_URL=http://127.0.0.1:24719 \
CHATHERMES_MOCKSERVER_URL=http://127.0.0.1:24780 \
CHATHERMES_CHROMIUM=$PWD/tmp/playwright-browsers/chromium-1243/chrome-linux64/chrome \
TMPDIR=tmp npm run test:integration -- \
  tests/workflows/memory-context.spec.ts tests/workflows/attachment-context.spec.ts
```

The first mounted run was **10 passed / 4 failed** (3.2 minutes),
`tmp/memory-review-integration.log`. The Library assertion matched both filename
and download links; the corrected assertion uses the accessible download name.
The streaming fixture had a bare XML wrapper without a producer note. It was
correctly preserved when raw terminal text arrived, violating the obsolete test
expectation. Updated that synthetic fixture to contain a real producer note;
production matching was not widened. Failed state and captures remain in
`tmp/memory-review-first-mounted-artifacts/` and the fixture containers.

The final combined run was **14/14 passed** (seven desktop, seven mobile;
2.0 minutes), `tmp/memory-review-integration-final.log`. It checked authenticated
history/resume/reload, raw stored multipart equality, raw recall in the actual
model continuation, original upload bytes, wrong-profile 404s, focus on Home and
in flight, selects, scrolling/horizontal bounds, attachments and completed tool
disclosure inspection. The real mounted Library and its background API index
exposed only the retained upload for the synthetic memory session, despite a
real existing private file referenced inside the recalled block.

A follow-up **2/2 passed** streaming-only run (16.8 seconds) retained attachment
bodies through the JSON reporter without replacing the combined-run screenshots:
use the invocation above with `--grep 'native deltas'
--output=tmp/memory-review-wire-artifacts --reporter=json` and
`PLAYWRIGHT_JSON_OUTPUT_NAME=$PWD/tmp/memory-review-wire-report.json`.
The report and extracted `tmp/memory-review-wire-desktop.json` /
`tmp/memory-review-wire-mobile.json` contain only allowlisted synthetic wire text.
No raw transport frames, tickets or provider credentials are retained.

Exact observed wire behavior:

| Field                                                | Observed content                                                                                                                                                 | Established coverage                                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `event.params.type=message.delta`, `payload.text`    | `Memory answer.\n`, a newline, split recalled-note fragments beginning `System ` / `note: Th`, and `\nMemory stream complete.`; no XML block or `STREAM_PRIVATE` | Upstream block stripping; client suppression of arriving note prefixes                      |
| Resume result `inflight.assistant`                   | Answer/newlines plus the accumulated incomplete recalled-note prefix; two captured snapshots per viewport                                                        | Reconnect reconstruction and client prefix suppression; no raw XML block in these snapshots |
| `event.params.type=message.complete`, `payload.text` | Full original generated block with its producer note, `STREAM_PRIVATE`, closing tag, standalone note and final answer                                            | Actual browser client suppression of the raw complete block and note                        |

The captured delta arrays have gaps during the deliberate reload; snapshots
restore the accumulated prefix. Concatenating only the recorded deltas across
the disconnect is not a complete text-stream reconstruction. This browser test
does not prove client handling of raw XML tags split across live deltas; those
are supplied directly in component/native-session regressions.

Inspected all ten explicit memory screenshots and four representative attachment
active/resumed screenshots from the final combined run. Usable desktop reload,
Library and completion captures and mobile resume, Library, active and completion
captures show clean prose, retained original cards and readable composer/layout.
The desktop memory resume has partially unpainted content, and desktop memory
active/attachment-active captures are shifted out of frame. The mobile memory
reload clips the top header. These are continuations of the earlier capture/layout
limitation, not evidence of stable painted geometry at those instants; this task
does not claim to fix them. DOM visibility/focus/scroll assertions still passed.
Existing active disclosure detail-default behavior also remains outside this fix.

Selected final captures:

- [Desktop memory reload: `tests/visual-output/memory-context-memory-cont-36bab--and-authored-notes-survive-desktop/memory-reload.png`
- Desktop Library: `tests/visual-output/memory-context-memory-cont-36bab--and-authored-notes-survive-desktop/memory-library.png`
- Desktop terminal response: `tests/visual-output/memory-context-native-delt-4e65e-notes-and-raw-terminal-text-desktop/memory-stream-complete.png`
- Mobile memory resume: `tests/visual-output/memory-context-memory-cont-36bab--and-authored-notes-survive-mobile/memory-resume.png`
- Mobile Library: `tests/visual-output/memory-context-memory-cont-36bab--and-authored-notes-survive-mobile/memory-library.png`
- Mobile active response: `tests/visual-output/memory-context-native-delt-4e65e-notes-and-raw-terminal-text-mobile/memory-stream-active.png`
- Mobile terminal response: `tests/visual-output/memory-context-native-delt-4e65e-notes-and-raw-terminal-text-mobile/memory-stream-complete.png`

Final `git diff --check` passed. Initially clean tracked generated dist files were
restored after the build; ignored output remains local. Upstream checkout status
is clean, dependencies/lockfiles are unchanged, and no files are staged. Containers,
volumes and synthetic fixture state remain available for debugging.

## Remaining limits

This remains presentation filtering, not a secrecy boundary. Raw multipart
REST/native/model data remains available. Upstream string sanitization may
already remove authored XML before the plugin receives it. Byte-identical authored
copies of generated blocks or exact notes cannot be distinguished without
provenance. Other case/whitespace/provider rewrites and malformed/nested fences
are outside the exact grammar. Reasoning/tool bodies are separate data, not prose
in the memory stream. An unconfirmed partial prefix is released at completion.

The browser wire capture concerns this pinned Hermes/fixture combination;
it cannot prove every provider or transport ordering. Component tests inject raw
client blocks. Desktop/mobile are Chromium viewports, not Electron, real mobile
hardware, native keyboards or cameras. No real-provider tests or full unrelated
Python/browser suites were run.
