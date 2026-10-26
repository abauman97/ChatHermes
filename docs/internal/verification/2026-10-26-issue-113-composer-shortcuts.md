# Issue #113: composer keyboard shortcuts

Implemented in the isolated `feat/issue-113-composer-keyboard` worktree based on
`e6d64c5bbcbfee94cecc0d5114cb7207871032dd`.

Shift+Enter in the textarea prevents the native newline and invokes the existing
send path. Plain Enter remains a native newline, including at mobile viewport
sizes. Ctrl/Alt/Meta combinations, IME composition events, and the IME 229 key
code are left alone. Repeated keydowns do not send again. Existing send gates,
attachments, slash modes, run guidance, and button submission remain in place;
an empty shortcut during a run does not invoke Stop.

Regression coverage lives beside `ChatComposer.vue` and in the deterministic
messaging workflow. The legacy composer scenario also reflects the new shortcut.
The getting-started guide documents Enter and Shift+Enter.

## Validation

- Focused composer suite: 29 passed.
- `npm test`: 33 files, 811 passed on the final run.
- `npm run test:api`: 105 passed, no skips, with the project virtualenv, the
  plugin development extra, and Hermes source at
  `bf0203a794a07aac3ff764972ab9087baa4e4f4e` on `PYTHONPATH`.
- `npm run build`: passed, including TypeScript checking. The final repeat used
  `CHATHERMES_BUILD_OUT_DIR=tmp/issue-113-dist` to keep output ignored.
- `vp lint`, `vp fmt`, `vp fmt --check`, and `git diff --check`: passed.
- `npm run test:env:build`: passed against the official Hermes image, followed
  by actual dashboard plugin workflows with stock MockServer fixtures.
- Focused integration command below: 8 passed across desktop and mobile.

```sh
COMPOSE_PROJECT_NAME=chathermes-issue-113 \
CHATHERMES_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9313 \
CHATHERMES_MOCKSERVER_PORT=1113 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/cache/playwright/chromium-1243/chrome-linux64/chrome \
npm run test:integration -- \
  tests/workflows/messaging.spec.ts tests/workflows/navigation.spec.ts \
  --grep 'Enter adds|real tool activity|selected model|file and camera'
```

The address is this session's private remote Docker daemon address. The first
attempt with loopback publication could not reach MockServer from the client;
publication was corrected within this isolated project. The browser scenario
waits for send availability before pressing the shortcut. On first-session
creation, the existing scope change replaces the composer instance, so browser
coverage checks the cleared input and ability to focus/edit the next draft;
component coverage verifies focus retention within the same instance.

## Visual inspection and limits

Inspected actual Hermes-mounted plugin screenshots at desktop 1280×720 and mobile
390×664 (Chromium with iPhone 13 emulation). Checked the multiline draft before
sending, one sent message and response, the editable next draft, attachment
previews, model picker and reasoning select, and reopened completed tool output.
The integration checks also verified authenticated file/camera-input uploads,
model selection reaching inference, completed disclosure collapse, and message /
activity / response order.

A separate browser inspection filled twelve draft lines, asserted textarea
scroll overflow and positive scroll position, and opened the model picker at
both sizes. Screenshots were inspected under the ignored paths
`tests/visual-output/issue-113-inspection/` and the corresponding messaging and
navigation output directories. These are local artifacts, not committed evidence.

Real Android/iOS software keyboards, physical camera capture, and real IME input
were not visually verified. IME safeguards have synthetic component coverage;
mobile browser checks use emulation and keyboard events. The full integration
suite and legacy composer scenario were not run.

Containers and synthetic test state remain available in the isolated Compose
project. No original checkout was changed. No commit, push, PR, or deployment was
performed. Tracked baseline dist files were restored after building the test
image; generated assets are absent from the final Git diff.
