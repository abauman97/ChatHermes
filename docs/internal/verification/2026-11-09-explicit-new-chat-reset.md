# Explicit New chat composer reset — 2026-11-09

## Change

`useApplication` opts into composer preservation only through the chat controller's
first-send creation callback. Explicit New chat and suggestion-driven creation use
the default reset path. The existing project draft/navigation behavior remains in
place. All pre-existing source and documentation edits were preserved.

Five additional mounted application regressions cover New chat from ordinary and
project sessions, New Project Chat, uploads completing after the reset, edits made
during explicit creation, and late explicit creation after leaving and returning
to either session. They verify the actual submitted text/content as well as the
visible draft, attachment and Plan mode state. Existing first-send regressions
continue to cover follow-up text, attachments, mode and focus preservation.

## Local validation

| Command                                             | Result                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `npm test -- src/projects.test.ts`                  | 123 passed                                                         |
| `npm test` (final full run)                         | 48 files, 1,544 tests passed; 131.67s                              |
| `uv sync --locked`                                  | Passed                                                             |
| `PYTHONPATH=.hermes-source:plugin npm run test:api` | 181 passed; 18.19s                                                 |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`    | 642 passed; 196.31s                                                |
| `vp lint`                                           | Passed, no diagnostics                                             |
| `vp fmt --check`                                    | Passed                                                             |
| `uv run ruff format --check .`                      | 136 files already formatted                                        |
| `uv run ruff check .`                               | All checks passed                                                  |
| `uv run ty check`                                   | All checks passed                                                  |
| `npm run test:env:build`                            | Passed, including production build and explicit Hermes image build |
| `npm run build` (final standalone run)              | Passed                                                             |
| `git diff --check`                                  | Passed                                                             |

The final local production entry point and application bundle matched the running
Hermes container byte-for-byte:

- `index.js`: `04febc65a662153b95d78324a3237723a44448cb62f6dad95d00b9ff87af09c2`
- `assets/app-D2Jfp5Yr.js`: `6621cc219ed145c7a3ef4138d3117cbac273978130a18ea5f379d14175caadd5`

## Mounted browser verification

The authenticated Vue dashboard plugin mounted through Hermes's React plugin SDK
in the existing deterministic Compose project. The run used real Hermes handlers
and native sessions, with stock MockServer inference fixtures. Transport holds
in the new workflows delayed real upload/creation responses without replacing
handler results. The workflows verify ordinary/project resets, delayed uploads,
leave-and-return creation races, first-send follow-up preservation, failed
preparation recovery, streaming, cancellation, model/reasoning controls,
disclosures and long-content scrolling.

Exact final command:

```sh
PLAYWRIGHT_BROWSERS_PATH=/opt/data/profiles/developer/home/.cache/ms-playwright \
COMPOSE_PROJECT_NAME=chathermes-draft-current-main \
CHATHERMES_COMPOSE_OVERRIDE=compose.override.yml \
CHATHERMES_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=20651 \
CHATHERMES_MOCKSERVER_PORT=20652 \
CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2 \
npm run test:integration -- \
  tests/workflows/new-chat-reset.spec.ts \
  tests/workflows/project-first-message.spec.ts \
  tests/workflows/messaging.spec.ts \
  tests/workflows/prompt-layout.spec.ts \
  tests/workflows/reasoning.spec.ts \
  --output tests/visual-output/p2-final
```

Browser results: 35 passed and nine failed in 6.5 minutes after both test
containers stopped during the run. Hermes exited with code 0, was not OOM-killed,
and MockServer exited with code 143. The cause of the stop was not established.
The first affected workflow timed out waiting for its response; the next eight
could not connect to the dashboard. All ten new reset/race cases had already
passed on desktop and mobile.

The same retained containers were started with Compose using
`up -d --wait --no-build --no-recreate`, without deletion or state reset. With the
same environment variables as above, the affected cases were rerun:

```sh
npm run test:integration -- \
  tests/workflows/project-first-message.spec.ts \
  tests/workflows/prompt-layout.spec.ts \
  tests/workflows/reasoning.spec.ts \
  --project=mobile --output tests/visual-output/p2-recovery
```

Recovery result: **nine passed in 1.5 minutes**. Across the run and recovery, all
**44 distinct selected workflows passed: 22 desktop and 22 mobile**. This is not
a claim of an uninterrupted 44-pass run. Recovery artifacts remain separate from
the interrupted run's artifacts.

An initial browser attempt was stopped after launch failures because the shell's
inherited browser cache path pointed to `/opt/hermes/tools`. The installed
Chromium cache above fixed that prerequisite. A subsequent attempt passed all 22
desktop workflows and eight mobile messaging workflows before the new mobile
attachment step stalled: phone editing hides attachment controls while focused.
The workflow now blurs the textarea before opening attachments. Application code
was unchanged by that test correction. The 44-case command above reran every case after that test correction.

Inspected screenshots from the corrected run and recovery (local, ignored verification artifacts):

| Behavior                                            | Desktop                                                                                                                                                                  | Mobile                                                                                                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ordinary New chat resets composer                   | [Empty composer](../../../tests/visual-output/p2-final/new-chat-reset-explicit-Ne-171e3-ts-and-ignores-late-uploads-desktop/explicit-new-chat-empty.png)                 | [Empty composer](../../../tests/visual-output/p2-final/new-chat-reset-explicit-Ne-171e3-ts-and-ignores-late-uploads-mobile/explicit-new-chat-empty.png)                    |
| New chat resets an existing project session         | [Empty composer](../../../tests/visual-output/p2-final/new-chat-reset-explicit-Ne-6b172-ts-and-ignores-late-uploads-desktop/explicit-new-chat-empty.png)                 | [Empty composer](../../../tests/visual-output/p2-final/new-chat-reset-explicit-Ne-6b172-ts-and-ignores-late-uploads-mobile/explicit-new-chat-empty.png)                    |
| New Project Chat resets composer                    | [Empty project draft](../../../tests/visual-output/p2-final/new-chat-reset-explicit-Ne-e1ff2-ts-and-ignores-late-uploads-desktop/explicit-new-chat-empty.png)            | [Empty project draft](../../../tests/visual-output/p2-final/new-chat-reset-explicit-Ne-e1ff2-ts-and-ignores-late-uploads-mobile/explicit-new-chat-empty.png)               |
| Late creation cannot replace returned project draft | [Returned session](../../../tests/visual-output/p2-final/new-chat-reset-late-explic-1e9bf-ce-a-returned-project-draft-desktop/late-explicit-creation-ignored.png)        | [Returned session](../../../tests/visual-output/p2-final/new-chat-reset-late-explic-1e9bf-ce-a-returned-project-draft-mobile/late-explicit-creation-ignored.png)           |
| First-send materialization preserves follow-up      | [Text, attachment and Plan mode](../../../tests/visual-output/p2-final/project-first-message-dire-c1cd5-resumes-its-runtime-choices-desktop/slow-creation-follow-up.png) | [Text, attachment and Plan mode](../../../tests/visual-output/p2-recovery/project-first-message-dire-c1cd5-resumes-its-runtime-choices-mobile/slow-creation-follow-up.png) |

Mobile coverage uses Chromium with the iPhone 13 device viewport; it does not
verify physical iOS/Android keyboards or native camera capture. Real-provider
inference was not run. Containers and test state remain available for inspection.
No commit, push or deployment was performed.

Tracked generated dashboard assets were restored after validation. No generated
assets are staged; ignored build artifacts remain uncommitted.
