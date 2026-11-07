# Project header follow-up to PR #242

The Project list and selected Project pages use **Projects** as the shell title.
Selected Project home, artifacts, settings and instructions pages show the
backend Project label as the subtitle through their existing `usePageHeader`
getters. The list has no subtitle. The workspace's **← Projects** button is
removed; editor return buttons, tabs, Other chats and sidebar navigation remain.
Chat pages retain their conversation title and membership-derived subtitle.

## Regression coverage

- `src/project-header.test.ts`: active/archived lists, every Project page,
  backend rename, fresh deep-link mount, loading, reused parameters, late replies,
  fixed-page navigation, profile changes and existing Chat title updates.
- `src/projects.test.ts`: selected Project refresh keeps its subtitle until the
  new backend label arrives; existing browser-navigation, composer scope and
  deep-link/refresh expectations now assert the requested header.
- `tests/workflows/project-header.spec.ts`: authenticated list selection, tabs,
  editing and rename, editor return navigation, focus, sidebar Projects link,
  back/forward, archived list and refresh, with viewport/header assertions.
- Existing route-page, artifact and first-message workflows assert the new
  header while exercising deep links, reload, scrolling, external Project updates,
  native chat creation/resume, profile isolation and runtime model selection.

## Environment

Only this checkout and the `chathermes-project-header` Compose project were
modified. Dashboard/MockServer ports are 19442/19443 on the private Docker host
address `172.25.0.2`, reachable from the runner as `docker`.
The ignored root `compose.override.yml` supplies unused subnet
`10.242.242.0/24`; the first startup hit Docker address-pool exhaustion.
All subsequent preparation/integration commands use
`CHATHERMES_COMPOSE_OVERRIDE=/opt/data/projects/ChatHermes-project-header/compose.override.yml`.
The project, ports and bind address were explicitly supplied for the build and
integration commands. Containers and state are retained.

The image was built with `npm run test:env:build`, including `npm run build`.
Hermes image ID: `e10383ebfa5d`; upstream base digest:
`sha256:adb7890916de63245523492be8f68f9d2095fecbec4e2a6dab7960381f0fc002`.
Stock MockServer loaded 47 repository inference expectations.
The workflows mount the production plugin in the authenticated Hermes dashboard;
they do not substitute route mocks or use a standalone Vite app.

The documented Hermes checkout pin
`bf0203a794a07aac3ff764972ab9087baa4e4f4e` is available at `.hermes-source`.
`uv sync --locked` prepared Python 3.14.4. Browsers use installed Chrome for Testing
145.0.7632.6 through
`CHATHERMES_CHROMIUM=/opt/hermes/tools/chromium-1208/chrome-linux64/chrome`.
The attempted Playwright browser download did not complete and was stopped;
the existing executable was used instead. Mobile checks use the configured
iPhone 13 Chromium viewport, not a physical device or native Android installation.

## Check results

| Check                                               | Result                                                                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm test -- src/project-header.test.ts`            | 6 passed initially.                                                                                                                        |
| `npm test`                                          | Final run: 46 files, 1,435 tests passed; no skips.                                                                                         |
| `PYTHONPATH=.hermes-source:plugin npm run test:api` | 144 passed.                                                                                                                                |
| `npm run test:env:build`                            | Passed, including the required `npm run build` type check and production plugin build.                                                     |
| `vp fmt`, `vp fmt --check`, `vp lint`               | Passed.                                                                                                                                    |
| `git diff --check`                                  | Passed.                                                                                                                                    |
| Project artifact workflow                           | Desktop and mobile cases passed: pagination/scrolling, file preview/download/delete and external rename while a local action remains open. |
| Project first-message workflow                      | Both entry paths passed on desktop and mobile (4 cases), including real runtime choices and resume.                                        |
| Route-page workflow                                 | Desktop and mobile cases passed: all direct destinations, nested reload, scrolling, history and streaming chat continuity.                 |
| Final header + interaction workflow                 | Mobile: 4 passed (exit 0). Desktop: 4 passed (exit 0).                                                                                     |

The first three browser suites were invoked with:

```sh
npm run test:integration -- tests/workflows/project-header.spec.ts tests/workflows/route-pages.spec.ts tests/workflows/artifacts.spec.ts tests/workflows/project-first-message.spec.ts
npm run test:integration -- tests/workflows/project-header.spec.ts tests/workflows/route-pages.spec.ts
```

Those batches included the initial header-test assertion errors described below;
their successful existing cases are reported individually, not as green batches.
The corrected header plus interaction cases are run separately per viewport:

```sh
export COMPOSE_PROJECT_NAME=chathermes-project-header
export CHATHERMES_COMPOSE_OVERRIDE=/opt/data/projects/ChatHermes-project-header/compose.override.yml
export CHATHERMES_DASHBOARD_PORT=19442
export CHATHERMES_MOCKSERVER_PORT=19443
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_CHROMIUM=/opt/hermes/tools/chromium-1208/chrome-linux64/chrome
npm run test:integration -- tests/workflows/project-header.spec.ts tests/workflows/navigation.spec.ts tests/workflows/messaging.spec.ts --grep 'Projects header|file and camera|real tool activity|resumed model and reasoning' --project=mobile
npm run test:integration -- tests/workflows/project-header.spec.ts tests/workflows/navigation.spec.ts tests/workflows/messaging.spec.ts --grep 'Projects header|file and camera|real tool activity|resumed model and reasoning' --project=desktop
```

These interaction checks cover real authenticated text/image uploads through file
and camera inputs, composer focus and 16px input text, tool completion/collapse/
reopening, message ordering, reload, model/reasoning selection and actual inference
request verification.

Desktop and mobile screenshots were visually inspected for the selected Project,
artifact view, renamed editor and instructions page. The requested two-line header
fits both sizes, long mobile labels truncate, tabs remain available and the
workspace return button is absent. Final list and archived screenshots are also
visually inspected. Evidence includes:

- `tests/integration-output/project-header/initial/`: artifact/first-message
  screenshots and original failure context.
- `tests/integration-output/project-header/routes/`: direct/reloaded Project,
  instructions and restored Chat screenshots at desktop/mobile sizes.
- `tests/integration-output/project-header/mobile-final/`: passing mobile header,
  model/reasoning, tool disclosure and attachment screenshots.
- `tests/visual-output/`: latest desktop header and interaction screenshots.

## Investigation notes

The first full unit run found two remaining old Project-title expectations;
these were corrected. The first browser batch loaded an initial version of the
new workflow that assumed drafts persisted across artifact/editor navigation.
That exceeds the existing composer remount contract. The test now checks that
the composer can be focused and edited on return, without changing runtime code.
Seven existing browser scenarios passed in that batch before it ended with
exit 143; the second unit run also ended with exit 143 without a diagnostic.
Completed results and screenshots were preserved before rerunning.
The next header run also exposed a test-only visibility assumption about the empty
archived list: its empty navigation element has no visible area. The final test
asserts the visible Projects region and archived state instead. No product code
was changed for either test correction. A combined final interaction batch passed
all four desktop cases before another exit 143; separate viewport commands retain
independent completion results. No source for the SIGTERM was reported.
The separate final runs completed successfully. No remaining blocker was found
for this change; physical-device, native Android and real-provider checks were
not run.

Screenshots are generated, ignored local evidence under
`tests/integration-output/project-header/` and `tests/visual-output/`;
they are not committed reference images. Tracked generated dashboard assets were
restored to HEAD after the Docker build. No commit, push or deployment was made.
