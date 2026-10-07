# PR61 project chat action integrated into PR60

The project screen menu opens a newly created chat from both project detail and
an existing project chat, retaining the profile and project scope. PR60 project
management actions and list filters remain in place; ordinary New chat stays in
the drawer. The menu uses the existing screen-option styling and focus handling.
Composer-driven project creation retains PR60's behavior.

Late creation responses do not select a chat after profile, project, session, or
screen navigation. An old profile request cannot clear a newer profile's busy
state. Scoped creation failures remain visible in project detail and chat.

Final validation:

- `npm test -- src/projects.test.ts src/components/ProjectInstructions.test.ts src/App.test.ts`: 68 passed, 3 files passed.
- `npm test`: 166 passed, 17 files passed.
- `uv run --with pytest --with fastapi --with httpx --with starlette --with pywebpush --with pyyaml -- npm run test:api`: 86 passed. Plain `npm run test:api` initially failed because system Python has no pytest.
- `npm run build`: passed; regenerated `dashboard/dist/` with `app-DcHnUMq5.js` referenced by `index.js`.
- `git diff --check`: passed.
- `CHATHERMES_TEST_URL=http://172.25.0.2:19160 CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:visual -- tests/visual/project-chat-menu.spec.ts tests/visual/dashboard.spec.ts tests/visual/streaming.spec.ts`: 6 passed (51.3s), covering desktop and mobile.

Visual verification used the pinned Docker fixture and `npm run live`, with
`CHATHERMES_INSTANCE=pr60-menu-repair`, port 19160 and daemon address 172.25.0.2.
Docker's default address pools were exhausted; dedicated internal and browser
networks were created with explicit unused subnets before restarting the launcher.
An initial visual attempt ran before dashboard readiness and all six tests failed
with empty HTTP responses. After the launcher reported readiness, all six passed.

The visual tests exercised scoped creation from project detail and chat, menu
styling, project management entries and list filters, Escape/action focus,
composer focus, profile and model selection, authenticated attachments, camera
image content, scrolling, sent-message order, and disclosure transitions.
Desktop and mobile project detail/chat menu screenshots were inspected, along
with desktop home/completed and mobile attachment screenshots. Screenshots and
traces are ignored under `tests/visual-output/`. Physical iOS keyboard and camera
hardware were not tested; no real provider calls were made.

Initial focused failures exposed a mock returning old history for a new workspace
draft; the draft mock now returns empty history. A later test assertion was fixed
to reopen the menu after selection, because selection correctly dismisses it.
A concurrent Codex run added the profile busy guard, error notice and related tests;
these changes were preserved, reviewed and included in the final checks.

The initial dirty patch, App.test.ts, visual test and complete distribution
(including untracked generated hashes) were saved in
`/tmp/chathermes-pr60-before/` before edits or rebuilding. The active distribution
contains the rebuilt bundle; superseded dirty hashes remain available in that
backup. No commits or pushes were made. `npm run live:stop` removes only the
selected fixture containers and preserves its named disposable test volume.
