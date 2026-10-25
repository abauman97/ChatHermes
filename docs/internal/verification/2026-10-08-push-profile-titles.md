# Push profile titles

Started with a clean worktree at `9eb3838e2853183fbbc45f4d5efff9be33347ef1`.
No commit or deployment was performed.

The actual `push_sender.notification_payload` now uses the canonical Hermes
profile name as the title, preserving spelling and case. The default profile is
`default`; empty/invalid display values fall back to `ChatHermes` without changing
payload profile, session or tag. Delivery validation and subscription selection
remain unchanged. The installed worker validates the profile and matching title,
accepts queued legacy `ChatHermes` titles, and displays the validated profile name.
It rejects mismatched/malformed titles. Completion, approval, clarification,
attention and sessionless test notifications share this rule. Suppression,
cleanup, clicks, native ownership, authentication and session routing are unchanged.

Checks run from this checkout:

- `npx vitest run src/lib/push-worker.test.ts`: 83 passed, exit 0.
- `.venv/bin/python -m pytest tests/push_store.test.py -q`: 79 passed, exit 0.
- `npm test`: 19 files, 249 tests passed, exit 0.
- `PATH="$PWD/.venv/bin:$PATH" npm run test:api`: 103 passed, exit 0.
- `npm run build` (via `npm run live`): passed, exit 0. The generated worker
  matches `public/push-service-worker.js`; the build also removed the obsolete
  tracked `assets/app-D6aKTBUl.js`, retaining the current `app-CaMy9VWx.js`.
- `git diff --check`: passed, exit 0.

The fixture used the pinned `tests/docker/Dockerfile` and `npm run live`, with
revision-scoped containers and disposable named Hermes data, without a personal
home mount. The initial launch exited 125 because port 9119 was occupied. Retried
with `CHATHERMES_DASHBOARD_PORT=9147 CHATHERMES_DAEMON_ADDRESS=172.25.0.2 npm run live`;
the dashboard became ready at `http://172.25.0.2:9147/chathermes`, exit 0.

Browser checks use the real authenticated dashboard plugin and installed worker.
Title checks inject synthetic `PushEvent` payloads into that worker and inspect
browser notifications; they do not claim delivery through an external push
provider. Sender tests intercept the actual `pywebpush.webpush` call and verify
profile subscription isolation and payload identity. Physical iOS notification
and camera hardware were not tested.

Browser environment: `CHATHERMES_TEST_URL=http://172.25.0.2:9147` and
`CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`.

- `npm run test:visual -- tests/visual/push-routing.spec.ts tests/visual/settings.spec.ts tests/visual/streaming.spec.ts --grep 'worker|drawer settings and notifications|composer attachments|ordered streamed turn'`:
  7 passed, 3 failed, exit 1. Both desktop/mobile worker title and routing tests,
  both streaming tests, and desktop attachments passed. The settings test had
  an existing undefined `mobile` variable on both sizes. Mobile attachments
  timed out trying to click the model pill while editing deliberately hid it.
- Corrected those two existing test setup issues (declare the project size;
  leave the composer before opening the model picker), without UI changes.
- `npm run test:visual -- tests/visual/settings.spec.ts --grep 'drawer settings and notifications' --output tests/visual-output-settings`:
  2 passed, exit 0. Moved its artifacts into ignored
  `tests/visual-output/settings-rerun/` after inspection.
- `npm run test:visual -- tests/visual/settings.spec.ts --grep 'composer attachments' --output tests/visual-output/attachments-rerun`:
  2 passed, exit 0.

All ten selected desktop/mobile scenarios passed across the initial run and
focused reruns. Inspected actual plugin screenshots at both sizes for home,
connected and disconnected chats, Settings/profile selection, active/completed
activity and attachments. Assertions checked composer focus at home/in flight,
scroll position, disclosure transitions, authenticated uploads, camera image
preview/removal and model picker interactions. Native turns/uploads and installed
worker checks run against the fixture; the detailed streaming scenario uses its
existing deterministic route mocks. Browser worker tests opt the fixture origin
into secure-origin behavior; ordinary HTTP Settings screenshots correctly show
notifications unavailable. No real provider or external push service was used.

Final standalone `npm run build`: passed, exit 0. Final worker source/dist
comparison and `git diff --check`: passed, exit 0. `npm run live:stop`: passed,
exit 0; only launcher containers removed, named test data volume preserved.
HEAD remains `9eb3838e2853183fbbc45f4d5efff9be33347ef1`.
