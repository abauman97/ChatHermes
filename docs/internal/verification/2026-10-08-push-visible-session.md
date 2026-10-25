# Visible-session push suppression verification — 2026-10-08

Suppression and notification cleanup now require an explicitly visible window and
fresh mounted-plugin state identifying the exact originating profile/session,
connected native viewer, visible document, and matching current SPA route. Hidden,
disconnected, mismatched, unknown, invalid, timed-out, and stale states allow
notifications. The plugin reads document visibility on each query, publishes
visibility changes, and clears visibility when unmounting. The worker retains
its confirmation rounds and immediate final confirmation to avoid using positives
aged by other clients. Client enumeration and notification lookup failures allow
delivery when no reliable visible matching viewer can be established.

Existing per-profile settings, content changes, and untracked files were preserved.
The build empties dashboard/dist; the original untracked app-D6aKTBUl.js was
recovered from the previous isolated fixture image and retained alongside the
new app-CaMy9VWx.js. The entry references the new bundle. No commit or deployment.

## Checks

- `npx vitest run src/lib/push-worker.test.ts src/lib/push-client.test.ts src/App.test.ts`: **104 passed**, 3 files.
- `npm test`: **231 passed**, 19 files.
- `PATH="$PWD/.venv/bin:$PATH" npm run test:api`: **103 passed**.
- `.venv/bin/python -m pytest tests/push_store.test.py`: **49 passed**.
- `npm run build` (run by `npm run live`): passed TypeScript checking and both plugin bundles.
- `git diff --check`: passed.
- `CHATHERMES_TEST_URL=http://172.25.0.2:9131 CHATHERMES_CHROMIUM=/opt/data/profiles/developer/cache/playwright/chromium-1243/chrome-linux64/chrome npm run test:visual -- tests/visual/push-routing.spec.ts tests/visual/push-settings.spec.ts tests/visual/composer.spec.ts`: **6 passed**, desktop and mobile, 42.4 seconds.

The actual plugin ran through the pinned Docker fixture with
`CHATHERMES_INSTANCE=push-visible-session CHATHERMES_DASHBOARD_PORT=9131 CHATHERMES_BIND_ADDRESS=172.25.0.2 npm run live`.
Inspected desktop chat, desktop profile settings, mobile focused composer, and
mobile disconnected chat screenshots. Checks exercised home/in-flight composer
focus, scrolling, native selects, expanded/collapsed activity, current route
attestation, disconnected notification retention, reconnect cleanup, and profile
settings isolation. Screenshots are in ignored `tests/visual-output/`.
Stopped the task's fixture and the failed initial default launcher attempt using
`npm run live:stop` with their matching instance settings; disposable named
volumes were preserved. Other existing fixture containers were left alone.

## Limitations and initial failures

System Python lacks pytest; the existing ignored `.venv` provided it. The initial
launcher attempt hit an occupied port 9119; the dedicated fixture used 9131.
The initial full JavaScript run required updating an exact App handshake
expectation for the new visible field; the final full run passed.
An experimental browser background-tab check failed on desktop/mobile because
switching to another page left document.visibilityState as visible in both
headless Chromium and headed Chromium under Xvfb without a window manager.
Removed that environment-dependent assertion; hidden/unknown visibility and
visibility changes during pending queries remain covered by worker/client/App
regression tests. Real background/foreground OS transitions, real provider Web
Push transport, iOS behavior, file/camera attachments, and the complete visual
suite were not exercised in this run. The passing browser routing tests use
synthetic notifications in the actual worker, not real provider delivery.
