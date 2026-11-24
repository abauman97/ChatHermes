# Collapsed active disclosures verification — 2026-11-24

Changed `ActivityRow`'s default expansion fallback from active state to false.
Manual intent, native details/summary semantics, active status, timing, preview
following and keyed row instances remain in place. Updated component/browser
expectations, user guides, architecture, testing guidance and agent instructions.
No commit, push or deployment was performed.

## Local commands and results

Commands ran from the isolated `ChatHermes-collapse-disclosures` worktree.

| Command                                                                                                                                                                   | Result                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                                                                                                                                                  | Exit 0; locked dependencies installed. npm reported 13 audit findings (10 moderate, 3 high); dependency versions were not changed. |
| `uv sync --locked`                                                                                                                                                        | Exit 0; repository environment prepared with Python 3.14.4.                                                                        |
| `git clone --no-checkout https://github.com/NousResearch/hermes-agent.git .hermes-source`                                                                                 | Exit 0; ignored local source prepared.                                                                                             |
| `git -C .hermes-source checkout --detach caafe5389ae585ef77387a962aee05b1bcf17029`                                                                                        | Exit 0; reviewed source pin.                                                                                                       |
| `vp test run src/components/ActivityRow.test.ts src/components/TurnWork.test.ts`                                                                                          | Exit 0; 37 passed.                                                                                                                 |
| `vp test run src/components/ActivityRow.test.ts src/components/TurnWork.test.ts src/components/ChatTranscript.test.ts src/features/chat/components/AssistantTurn.test.ts` | Exit 0; 192 passed after updating additional stale expectations.                                                                   |
| `npm test`                                                                                                                                                                | Final exit 0; 61 files, 2,122 tests passed, no skips; 133.96 seconds.                                                              |
| `npm run test:api`                                                                                                                                                        | Initial exit 1 without the reviewed source/import path: 51 failed, 123 passed, 8 skipped; missing Hermes modules.                  |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                                                                                                                       | Final exit 0; 182 passed, no skips; 12.99 seconds.                                                                                 |
| `npm run build`                                                                                                                                                           | Exit 0, both standalone final build and as part of environment build.                                                              |
| `vp lint`                                                                                                                                                                 | Exit 0.                                                                                                                            |
| `vp fmt --check`                                                                                                                                                          | Exit 0.                                                                                                                            |
| `git diff --check`                                                                                                                                                        | Exit 0.                                                                                                                            |

The initial full frontend run had three stale disclosure expectations (one in
`ChatTranscript`, two in `AssistantTurn`) and one unrelated memory-context timing
failure at 261.63 ms against a 250 ms limit. Updated the stale expectations;
left the timing test unchanged. The final full run passed all tests with the
reviewed source available.

No Python code or dependencies changed. Generated dist files were used for
validation, then tracked dist paths restored to HEAD; new generated files remain
ignored and unstaged.

## Mounted dashboard commands

Browser installation succeeded:

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/tmp/playwright-browsers" npx playwright install chromium
```

Environment build succeeded, including `npm run build`:

```sh
COMPOSE_PROJECT_NAME=chathermes-collapse-disclosures \
CHATHERMES_DASHBOARD_PORT=24719 CHATHERMES_MOCKSERVER_PORT=24780 \
npm run test:env:build
```

The initial integration attempt failed because Docker's predefined address pools
were exhausted. Added ignored `tmp/collapse-compose.yml` with the unused
`10.253.76.0/24` subnet. The next attempt started healthy containers but browser
navigation failed because remote Docker loopback publications were unreachable.
Explicitly applied private-address publication to this project only:

```sh
COMPOSE_PROJECT_NAME=chathermes-collapse-disclosures \
CHATHERMES_DASHBOARD_PORT=24719 CHATHERMES_MOCKSERVER_PORT=24780 \
CHATHERMES_BIND_ADDRESS=172.25.0.2 \
docker compose --project-directory . -f tests/docker/compose.yml \
-f tmp/collapse-compose.yml up -d --wait --no-build
```

Final integration commands (each exit 0, two tests passed):

```sh
export COMPOSE_PROJECT_NAME=chathermes-collapse-disclosures
export CHATHERMES_DASHBOARD_PORT=24719 CHATHERMES_MOCKSERVER_PORT=24780
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_COMPOSE_OVERRIDE="$PWD/tmp/collapse-compose.yml"
export PLAYWRIGHT_BROWSERS_PATH="$PWD/tmp/playwright-browsers"
npm run test:integration -- tests/workflows/messaging.spec.ts --grep 'reasoning and tools'
npm run test:integration -- tests/workflows/attachment-context.spec.ts --grep 'user bubbles$' --output tests/visual-output/collapse-attachments
```

The first took 25.3 seconds; the second took 21.6 seconds. Both verified Hermes
revision `caafe5389ae585ef77387a962aee05b1bcf17029` and built fixture image
`sha256:75e2a0e6dc4dbb1443e2f6ca0d97a06fd8a56091076776157661396680f2174d`.
The image was explicitly built from the changed source before these runs.
Containers and fixture state remain running for inspection.

## Screenshots and scope

Screenshots are local ignored artifacts. For each of `desktop` and `mobile`,
the disclosure scenario's directory is:

```text
tests/visual-output/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-desktop/
tests/visual-output/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-mobile/
```

Each contains `reasoning-streaming-default.png`,
`reasoning-streaming-collapsed.png`, `reasoning-streaming-expanded.png`,
`tool-streaming-default.png`, `tool-streaming-collapsed.png`,
`tool-streaming-expanded.png`, `activity-streaming.png`,
`activity-collapsed.png`, `activity-expanded.png`, and the final viewport image.
Inspected both default reasoning and default tool screenshots, mobile expanded
reasoning with visible keyboard focus, and desktop completed expanded details.
Active summaries remain visible while their bodies are closed. The workflow
checks Enter/Space activation, streamed bodies, manual expansion after completion,
collapsed history, draft focus and reload defaults.

Attachment screenshots are under:

```text
tests/visual-output/collapse-attachments/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-desktop/
tests/visual-output/collapse-attachments/attachment-context-PDF-att-1b04e-ve-and-resumed-user-bubbles-mobile/
```

Inspected both `attachment-context-live.png` screenshots. The workflow checks
upload, authenticated download bytes, foreign-profile rejection, focus on home
and while active, reasoning-select visibility and minimum font size, horizontal
overflow, scroll-into-view, and disclosure expand/collapse in live and resumed
history. Screenshots also include `attachment-context-active.png`,
`attachment-context-resumed.png`, and expanded/collapsed activity crops.

These are the actual React-mounted Hermes dashboard plugin in Chromium at
1280×720 desktop and 390×664 mobile CSS viewports (mobile screenshots use device
scale factor 3). They are not native iOS/Android, camera, Electron or real-provider
verification. Delegated parent-completion behavior and manual intent are covered
by component/runtime-event tests; no real delegated execution was run in these
browser scenarios. Long-preview following and reader scroll preservation are
covered by the focused component contract, not a long-output browser scenario.
