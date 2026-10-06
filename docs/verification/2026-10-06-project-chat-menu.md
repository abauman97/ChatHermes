# Project chat screen menu verification

Branch: `codex/new-project-chat`. Starting HEAD and fetched `origin/main` were
both `6be581a925ce3a0652a0806c5af9e52f00692b6a`. Changes remain uncommitted.

All screen actions use the same explicit button style, including text color,
background, padding, typography, focus indicator and 44px minimum height.
`New project chat` appears on a selected project page and its conversations,
and reuses authenticated project session creation without changing the profile
or project. Ordinary `New chat` retains its existing behavior. The project
action is disabled while creating, offline, or when the selected project is
unavailable, archived, or lacks a workspace.

## Automated checks

- `npm test`: 16 files, 149 tests passed. An initial run had one new test fail
  because it toggled an already open menu closed after a programmatic profile
  switch; corrected the test to dismiss the menu before switching profiles.
- System `npm run test:api` could not start because `pytest` was missing.
  `uv run --isolated --with-requirements tests/requirements.txt --with-editable
  ./plugin/chathermes --no-project sh -c 'npm run test:api'`: 84 passed.
- `npm run build`: passed; regenerated the tracked plugin distribution.
- `git diff --check`: passed.

## Authenticated live plugin

Used `npm run live` with `CHATHERMES_INSTANCE=6be581a9-project-chat`,
`CHATHERMES_DAEMON_ADDRESS=172.25.0.2` and
`CHATHERMES_DASHBOARD_PORT=9147`. The pinned Docker image, synthetic dashboard
sign-in, named disposable volume and provider-free fixture runtime were used.
Docker's automatic subnet pool was exhausted, so dedicated networks were
created with unused explicit subnets: `10.243.47.0/24` (internal) and
`10.243.48.0/24` (browser). No existing fixture networks were changed.

Playwright used `CHATHERMES_TEST_URL=http://172.25.0.2:9147` and
`CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`.

- An early 14-case run started before dashboard readiness; all cases failed
  to connect. It was rerun after the launcher reported readiness.
- The ready-fixture run of `project-chat-menu.spec.ts`, `settings.spec.ts` and
  `projects.spec.ts` finished with 10 passed and 4 failed. Both viewport runs
  passed the existing menu dismissal/focus, drawer navigation, attachments,
  camera input and model controls tests, plus the activity/disclosure order
  test. Mobile native project streaming, context and isolation also passed.
- Two failures were the existing settings test expecting
  `/assets/dist/manifest.webmanifest` to return 200; it returns 404. These
  assertions were left unchanged because this request concerns menu actions.
- The desktop native project test expected a Home row before an ordinary
  fixture chat existed. That assertion passed on the targeted rerun, which
  also completed desktop native project streaming/context/isolation checks.
- The new mobile test initially attempted to register an already registered
  workspace. Its setup now reuses the existing project for that fixture path.
- A four-case targeted rerun reported three passes (desktop and mobile menu,
  desktop native Projects), then exited with signal 143 before completing its
  final mobile native Projects case. That mobile native case had passed in the
  earlier completed run; this interrupted run is not reported as four passes.
- The first screenshot-focused `menu-final` run passed both cases. After adding
  the short-viewport scroll check and restarting the fixture, another run had
  one pass and one failure: the test clicked ordinary New chat before the
  previous creation finished. The test now waits for creation to finish and
  for the ordinary creation response. Its first response assertion expected
  201 (two failures); corrected it to the pinned native route's actual 200.
- Final command:
  `npm run test:visual -- tests/visual/project-chat-menu.spec.ts --output
  tests/visual-output/menu-verified-final`: **2 passed**, desktop and mobile. No route
  mocks. It verifies matching computed menu styles, scoped project creation
  from both the project page and an existing conversation, profile retention,
  menu dismissal/focus restoration, a focusable composer, and ordinary new chat
  behavior. Both project creations returned 201 in the selected profile.

Inspected desktop and mobile screenshots of the project/chat menus, including
the final `project-menu-items.png`, `chat-menu-items.png` and full plugin
screenshots under ignored `tests/visual-output/menu-verified-final/`. Text, spacing,
surfaces and menu positioning are consistent. Also inspected attachment,
drawer, active-thinking and completed/reopened-tool screenshots from the
broader run. Native project history reload was exercised by the existing
Projects checks. The new mobile regression also scrolls the project detail
in a 600px-high viewport and restores its position before checking the menu.

Physical iOS keyboard/camera hardware was not tested. The complete visual suite
is not green because of the two manifest assertions above. No live US1,
real-provider calls, deployment, commits, pushes or PRs were performed.
`CHATHERMES_INSTANCE=6be581a9-project-chat npm run live:stop` removed only this
fixture's containers; its named test data volume and networks were preserved.
