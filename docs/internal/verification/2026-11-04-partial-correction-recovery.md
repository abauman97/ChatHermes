# Partial correction snapshot recovery

Reviewer follow-up to [snapshot phase recovery](2026-11-04-snapshot-phase-recovery.md).
The incoming workspace already contained transcript, Python, workflow and documentation
changes; they were retained. This follow-up changes native snapshot prefix matching,
its focused tests and developer documentation. No Hermes source edits, commits or
pushes were made.

## Reproduction and behavior

The previous restore required every correction bubble to have a saved user row.
With saved `Ask` and an in-flight `Again`, it appended a second `Ask` and rebuilt
its output separately from the saved images/tool phases. The new partial-prefix
matrix failed four cases before the fix (77 passed); the red log is retained in
ignored `tmp/partial-corrections/red.log`.

Restore now finds matching prefixes of the in-flight original/correction sequence.
A candidate must end at the latest saved user, have valid Unicode code-point
offsets, agree with saved assistant prose in every adopted segment, and have no
queued input. Any competing prefix at least as long makes it ambiguous. This
allows a longer saved correction sequence to distinguish repeated original
prompts while refusing to guess when only identical original prompts survive.
Adoption preserves durable IDs, user and assistant multipart images, reasoning,
image-only phases and tools. Existing snapshot merging extends only unseen text;
unsaved corrections get new bubbles, and subsequent deltas reach the final bubble.

The focused native-session suite has 91 cases. New coverage includes the exact
one-correction reproduction, only the original saved, a proper correction prefix
saved, repeated correction strings, uniquely distinguishable repeated original
prompts, ambiguous complete/partial prefixes, older matches, invalid offsets,
conflicting prose and queued input. Native-only and HTTP-backed snapshots retain
images and ordered tool phases through repeated restore/hydration and live deltas.
These are mocked protocol contracts; they do not prove that Hermes durably
persists correction boundaries or replays every native event.

## Validation

Logs are retained under ignored `tmp/partial-corrections/`.
An early full frontend run caught an incorrect test expectation for invalid-offset
fallback (the last correction intentionally has no reconstructed text). A build
also caught an inferred literal-union type for a test parameter default. Both test
issues were corrected before the final checks.

| Check                                                                  | Result                 |
| ---------------------------------------------------------------------- | ---------------------- |
| Focused `vp test run src/features/chat/runtime/native-session.test.ts` | 91 passed              |
| `npm test`                                                             | 42 files, 1,313 passed |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                       | 547 passed, no skips   |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                    | 137 passed             |
| `npm run test:docker`                                                  | 16 passed              |
| `vp fmt`, `vp fmt --check`, `vp lint`                                  | Passed                 |
| `uv sync --locked`, Ruff format/check, `uv run ty check`               | Passed                 |
| `npm run test:env:build` (includes `npm run build`)                    | Passed                 |

## Dashboard browser verification

The existing deterministic `chathermes-transcript-order-final` fixture was reused
at dashboard `172.25.0.2:9229` and MockServer `172.25.0.2:1190`. The explicit
build completed, then only rebuilt plugin assets were copied into the installed
plugin directory. The running Hermes image and its state were retained; the new
image was not applied. The plugin transcript reader hash matched the workspace
(`6324217d31712278cda831a79bffc4de14fd7d12c0686780d15c20dfe95e202a`).
The installed `plugin_api.py` differs only in a comment. Installed and built
entry hashes matched before restoring tracked generated assets:
`4401f91e11c05385b5439fbfa837e1f0d4f6b96440d97dabbf46df4c555aa4ad`.

```sh
COMPOSE_PROJECT_NAME=chathermes-transcript-order-final \
CHATHERMES_BIND_ADDRESS=172.25.0.2 CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9229 CHATHERMES_MOCKSERVER_PORT=1190 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:integration -- tests/workflows/transcript.spec.ts \
  tests/workflows/messaging.spec.ts tests/workflows/execution.spec.ts \
  tests/workflows/reasoning.spec.ts tests/workflows/navigation.spec.ts
```

The main run returned **56 passed, 2 failed in 6.4 minutes**. All transcript,
messaging, execution and reasoning cases passed at desktop and mobile sizes.
Navigation isolation, disconnect recovery and authenticated file/camera upload
also passed. The two failures were the additional notification-worker scenario,
which could not grant notification permission on the remote HTTP origin.

A local ignored Chromium launcher then added
`--unsafely-treat-insecure-origin-as-secure=http://172.25.0.2:9229` for only this
synthetic fixture origin. With the same environment and
`CHATHERMES_CHROMIUM="$PWD/tmp/partial-corrections/chromium-secure-fixture.sh"`,
the focused rerun used:

`npm run test:integration -- tests/workflows/navigation.spec.ts --grep 'worker clicks' --output tmp/partial-corrections/notification-browser-output`

It returned **1 passed, 1 failed in 55.9 seconds**. The desktop notification-worker
case passed. The mobile case passed session and saved scheduled-output handoffs,
then timed out at `navigation.spec.ts:241` waiting for the session's user message
after the notification click from Settings. The failure screenshot shows the home
composer with model/profile initialization incomplete. Its cause was not
established; this remaining failure is not counted as passing coverage. No
notification, route or Hermes changes were made to address it. Logs and failure
screenshots remain under the focused output directory above.

Desktop and mobile screenshots were visually inspected for approval, active and
completed disclosures, expanded saved thinking/tool output, focused home and
in-flight composers, file/camera image preview, model/reasoning selects, archived
user/assistant images, and mid-flight recovery with retained draft and scroll
anchor. They show readable controls, chronological transcript phases and no
horizontal overflow. The image fixture is a white PNG; browser assertions verify
that both archived image elements decode. The incomplete-recovery warning remains
visible, as documented in the API contract.
Artifacts are retained under ignored `tests/visual-output/`; prior screenshots
were preserved under `tmp/partial-corrections/previous-browser-output/`.
Android/native devices and real-provider sessions are outside this verification.
The exact partial-correction regression remains mocked protocol coverage.

Final formatting and diff checks passed. All 20 relative documentation link targets
resolve. Tracked generated assets were restored to their initial clean state;
ignored output remains uncommitted. The reviewed `.hermes-source` checkout is
clean. Containers and synthetic test state were retained. Nothing was staged,
committed or pushed.
