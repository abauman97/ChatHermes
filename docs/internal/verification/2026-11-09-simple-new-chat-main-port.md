# Simple new-chat port onto Hermes 0.23 main — 2026-11-09

Ported the uncommitted feature diff from the read-only recovery worktree
`/opt/data/projects/ChatHermes-simple-new-chat` (based on `0d368604`) onto
`3cf95308ae0548240c347dc3fa19a369739f6bef`. The recovery worktree was not edited.
Main's Hermes v0.23.0 implementation, generated gateway contract, dependencies,
runtime pin, API capability caveats and newer workflow corrections were retained.
The recovery navigation-test hunk was already superseded by main's correction.
No Python implementation or dependency changes were needed.
The recovery worktree's tracked diff SHA-256 remained
`69d992bf8d072a3b65f920e4f0a19a6afe091cdd6d99905f8ee5bdcd5e556513`.

## Port scope

New chat opens Home, optionally with a validated Project query and profile.
First Send allocates the native session. The canonical stored-session route
drops the Project query; membership and header context come from Hermes's catalog
and may appear later. No browser provisional membership was added.

The exact creation-owned Home-to-session transition retains the composer,
follow-up input, attachment work and focus. Navigation, profile changes and repeated
New chat invalidate draft ownership. Definite failures restore the submitted text
and files without overwriting newer input; a bounded Unsent message disclosure
retains rejected input when a newer draft exists. Existing uncertain-admission
recovery and cancellation remain unchanged.

Tests ported with the feature cover stale asynchronous creation/attachment,
navigation away and back, profile isolation, query validation, late membership,
draft restoration, attachments and composer identity. Current route-page and
workspace workflows were adjusted to open scoped Home before first Send.
Maintained behavior documentation was updated in the existing authoritative topics.

## Isolated mounted environment

```sh
export COMPOSE_PROJECT_NAME=chathermes-simple-new-chat-main
export CHATHERMES_COMPOSE_OVERRIDE=compose.override.yml
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=9319
export CHATHERMES_MOCKSERVER_PORT=1280
export CHATHERMES_CHROMIUM=/opt/hermes/tools/chromium-1208/chrome-linux64/chrome
export CHATHERMES_TEST_URL=http://127.0.0.1:19319
```

The ignored Compose override assigns the unused subnet `10.253.239.0/24`.
A retained test-only TCP forward connects runner loopback port 19319 to
`docker:9319`, preserving WebSockets and providing a browser secure context.
It was started with:

```sh
node --input-type=module -e 'import net from "node:net"; net.createServer(client => { const upstream = net.connect(9319, "docker"); client.pipe(upstream); upstream.pipe(client); upstream.on("error", () => client.destroy()); client.on("error", () => upstream.destroy()); client.on("close", () => upstream.destroy()); }).listen(19319, "127.0.0.1");'
```

`npm run test:env:build` and explicit Compose application both exited 0:

```sh
docker compose --project-directory . -f tests/docker/compose.yml -f compose.override.yml up -d --wait --no-build
```

The integration runner verified the Hermes source pin
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and built fixture image
`sha256:48856a1412b86ddab56c0702d5898299e45a292865158c54040de4e969c53d47`.
It loaded the repository's 50 stock MockServer expectations. Local Python tests
use a separate `.hermes-source` checkout at that same reviewed pin and the locked
uv Python 3.14 environment.

## Validation

| Command                                                                                                                        | Result                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `npm ci`                                                                                                                       | Exit 0; reported 13 dependency audit findings (10 moderate, 3 high); no dependency changes made |
| `uv sync --locked`                                                                                                             | Exit 0                                                                                          |
| `npm test -- src/projects.test.ts src/App.test.ts src/router/router.test.ts src/features/chat/components/ChatComposer.test.ts` | Exit 0; 242 passed across four files                                                            |
| `npm test`                                                                                                                     | Exit 0; 1,510 passed across 48 files, no skips                                                  |
| `npm test -- src/projects.test.ts`                                                                                             | Exit 0; 92 passed after updating the Project-home entry-point regression                        |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                                                                            | Exit 0; 182 passed                                                                              |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                                                                               | Exit 0; 650 passed, no skips                                                                    |
| `vp fmt`                                                                                                                       | Exit 0                                                                                          |
| `vp fmt --check`                                                                                                               | Exit 0                                                                                          |
| `vp lint`                                                                                                                      | Exit 0, including type checks                                                                   |
| `npm run test:env:build`                                                                                                       | Exit 0; invokes `npm run build` and the explicit pinned Docker build                            |
| `npm run build`                                                                                                                | Exit 0; standalone Vue type check and both plugin bundles                                       |
| Explicit Compose application above                                                                                             | Exit 0; both services healthy                                                                   |

The broad mounted invocation was:

```sh
npm run test:integration -- tests/workflows/project-first-message.spec.ts tests/workflows/project-header.spec.ts tests/workflows/navigation.spec.ts tests/workflows/messaging.spec.ts tests/workflows/route-pages.spec.ts tests/workflows/workspaces.spec.ts --output=tests/integration-output/simple-new-chat-main
```

It ended with status 143 after 35 passing cases and no reported assertion failure.
The cause of termination was not established. All 24 desktop cases passed; the
completed mobile cases covered all eight messaging workflows and session
navigation in default, alpha and beta. Containers and partial artifacts were
retained. Remaining mobile scenarios were invoked with the same image/settings:

```sh
npm run test:integration -- tests/workflows/navigation.spec.ts tests/workflows/project-first-message.spec.ts tests/workflows/project-header.spec.ts tests/workflows/route-pages.spec.ts tests/workflows/workspaces.spec.ts --project=mobile --grep-invert 'session navigation' --output=tests/integration-output/simple-new-chat-main-mobile-completion
```

The completion invocation exited 0: all 13 remaining mobile cases passed.
All 48 selected scenarios therefore have passing coverage across the 35 completed
cases and this completion run. The broad invocation itself remains status 143;
it is not reported as a successful 48-case invocation.

## Visual review and limits

Inspected actual React-mounted plugin captures at desktop 1280×720 and Chromium's
iPhone 13 viewport, 390×664 at scale factor 3. Screenshots cover scoped Home after
refresh, canonical session results, runtime model/reasoning controls, camera/file
attachments, active and completed disclosures, follow-up drafts after first Send,
bounded rejected-message recovery and restored text/files. The workflows check
focus and full viewport intersection of the restored input and Send control,
16px input text, profile changes, scrolling in the Project editor and history
navigation. The final long-draft probe separately checks native textarea scrolling,
focus, an enabled and fully visible Send control, its center hit target, and no
horizontal overflow at both sizes.

Representative inspected captures (ignored local paths relative to the repository):

- `tests/integration-output/simple-new-chat-main/project-first-message-proj-75057-resumes-its-runtime-choices-desktop/scoped-home-refreshed.png`
- `tests/integration-output/simple-new-chat-main/project-first-message-pend-480b8-ow-up-and-rejected-original-desktop/pending-draft-retained.png`
- `tests/integration-output/simple-new-chat-main/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-desktop/tool-streaming-expanded.png`
- `tests/integration-output/simple-new-chat-main/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-mobile/activity-collapsed.png`
- `tests/integration-output/simple-new-chat-main-mobile-completion/navigation-file-and-camera-c6b53-and-preserve-composer-focus-mobile/attachment.png`
- `tests/integration-output/simple-new-chat-main-mobile-completion/project-first-message-pend-ea0f5-w-up-and-successful-handoff-mobile/pending-draft-retained.png`
- `tests/integration-output/simple-new-chat-main-mobile-completion/project-first-message-pend-480b8-ow-up-and-rejected-original-mobile/rejected-draft-restored.png`
- `tests/integration-output/simple-new-chat-main-layout/mobile.png`

The ignored `tmp/check-long-draft.mjs` probe is run with the environment above
using `node tmp/check-long-draft.mjs`; it uses the shared authenticated browser
preparation and real upload route, without inference or API mocks.
It exited 0 for both viewports: 16px input text, native textarea scrolling,
reachable Send center and no horizontal overflow. Final screenshots were inspected
at both sizes after uploads finished and Send became enabled.

These are desktop/mobile browser viewport checks. Physical iOS/Android keyboards,
native installation, notification-tray delivery and real-provider inference were
not tested. The entire workflow collection was not run; the six relevant workflow
files above were selected. No assertion failure was reported by either invocation.

Generated tracked dist assets were restored to their original main bytes after
build validation; ignored generated output remains ignored. No dist diff or staged
files remain. The recovery worktree, pinned local Hermes source checkout, isolated
containers, profiles, sessions and artifacts remain available. No commit, push,
PR, deployment or destructive environment cleanup was performed.
