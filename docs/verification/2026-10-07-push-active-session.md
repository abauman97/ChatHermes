# Connected session notification verification

Implemented in the `codex/push-active-session-notifications` worktree only.
No commit, push, deployment, or change to the user checkout was performed.

The mounted plugin reports profile, stored session, native connection state and
current URL through `chathermes.session` messages. The worker requests fresh state
from every same-origin client using `chathermes.session.query`; focus and visibility
are irrelevant. Home, other views and disconnected viewers fail open to notify.
Matching tagged notifications close only when a viewer confirms the same profile
and session is open and connected. Display/cleanup operations are serialized and
state is checked after display to handle concurrent connections. Notification
clicks navigate without prematurely closing a disconnected session's notification.
The ChatHermes title and existing chat body truncation/fallback remain unchanged.
No message content logging was added.

Regression tests were written before implementation. The initial worker run
reproduced eight failures for connected suppression and notification cleanup,
and the new client test suite failed because the handshake helper did not yet
exist. Dependencies were installed with `npm ci` before this red run.

Final results:

- `npm test`: 19 files, 188 tests passed.
- `npm run test:api`, with the isolated uv environment on PATH: 100 passed.
- `uv run --python /tmp/chathermes-active-session-tests/bin/python --no-project python -m pytest tests/push_store.test.py -q`: 16 passed.
- `npm run build`: passed; shipped dashboard dist assets rebuilt.
- `git diff --check`: passed.
- Docker fixture launched with `CHATHERMES_BIND_ADDRESS=172.25.0.2 npm run live`.
- Playwright `dashboard.spec.ts` and `push-routing.spec.ts`: 4 passed, desktop and mobile.
- After extending routing coverage to reopening from Scheduled, Playwright `push-routing.spec.ts`: 2 passed, desktop and mobile.

Inspected desktop and mobile screenshots of completed tool disclosures,
attachments, and connected/disconnected chat states. Browser assertions covered
composer focus at home, during activity and offline; model and profile selection;
file upload and camera image preview; and activity expansion/collapse. Transcript
screenshots showed scrolling through tool output and subsequent attachment turns.
The real plugin/native viewer and service worker were used. Notification checks
used synthetic notifications through the browser registration, not an external
push provider or an operating-system notification interaction.

Stopped the fixture with `npm run live:stop`; disposable named test data was
preserved as required. No personal Hermes home was mounted.

## P2 stale positive handshake correction

Added regressions before changing the worker: 18 new cases failed against the
existing implementation. They cover a positive reply followed by disconnect,
SPA navigation, plugin unmount (no further replies), or client removal while a
second same-origin client delays its reply or never replies. Both push handling
and session-message cleanup are covered. Push cases require a new notification
to be shown and the existing matching notification to remain open. Two cases
also disconnect while `getNotifications()` is pending, covering push and cleanup.

The worker now re-enumerates clients after all initial handshakes and re-queries
only still-present, same-origin positive candidates. Suppression and cleanup use
those new replies, not the initial positive snapshot. Notification enumeration
finishes before checking client state, and no asynchronous work separates the
final state check from closing notifications. Each handshake retains its 300 ms
timeout; candidate validation adds a second bounded round. Profile/session
matching, focus-independent behavior, test notifications, notification click
routing, and serialized display/cleanup are preserved.

Verification for this correction:

- Targeted worker/client/push suites: 3 files, 54 tests passed.
- `npm test`: 19 files, 206 tests passed.
- `npm run build`: passed; the committed dist worker was rebuilt and is identical
  to `public/push-service-worker.js`.
- Python API tests were not rerun: no Python routes, API contracts, or server
  behavior changed. The earlier API results above belong to the original change.
- Playwright `dashboard.spec.ts` and `push-routing.spec.ts`: 4 passed across
  desktop and mobile against the final rebuilt plugin in the Docker fixture.
  Inspected screenshots of tool output, attachment/camera previews, and
  connected/disconnected chat states. Assertions checked home/activity/offline
  composer focus, profile/model selection, file upload, camera preview,
  disclosure expansion/collapse, and notification retention/reconnect cleanup.
  Screenshots showed transcript scrolling through tool and attachment turns.
- `git diff --check`: passed.

The timing races are deterministic worker unit tests with controlled handshakes
and notification lookup delays. Browser checks use the actual dashboard plugin
and worker with synthetic notifications; no external push provider or OS
notification interaction was tested. The fixture was stopped with
`npm run live:stop`, preserving its disposable named data volume. No commit,
push, or deployment was performed for this correction.

## Second handshake race and dynamic VAPID subject

Implemented against branch `codex/push-active-session-notifications`, HEAD
`365aab68acffdbb84a973baacaa5b8fde417b8fc`, with one writer in this checkout.
The diagnostics checkout was inspected read-only for its subject resolver and
request propagation; unrelated key handling and diagnostics were not ported.

Four new worker regressions failed before the fix: both initially-positive
clients enter the second handshake, the first replies immediately then
disconnects while the other delays or times out. Push must display and retain
the existing notification; session-message cleanup must retain it too. After
both parallel rounds settle, the worker re-enumerates and confirms remaining
positive client IDs individually, checking the exact profile/session again.
Cleanup acts immediately on that confirmation; suppression stops immediately
on a confirmed target. No later client handshake ages those actions. Existing
route, identity, focus-independent behavior and composer constraints remain.

The sender resolves its subject from validated HTTPS
`HERMES_DASHBOARD_PUBLIC_URL`, otherwise a validated HTTPS request base origin.
It strips paths, leaves the audience as the push service origin, and fails
without transport if neither origin is valid. Background events without a
request require valid public URL configuration. The authenticated test route
passes its request through the sender's thread to delivery. Tests cover
preference, fallback, invalid/missing HTTPS, pinned VAPID signing, sender claims,
request propagation and safe diagnostics. Actual py-vapid 1.9.4 signing also
revealed that explicit ports are rejected; those origins fail validation or
use a valid fallback rather than generating rejected claims.

Results for this correction:

- Initial worker regression run: 4 failed, 46 passed (expected reproduction).
- Focused worker/client/push run: 3 files, 58 passed.
- Focused Python run:
  `uv run --python /tmp/chathermes-active-session-tests/bin/python --no-project python -m pytest tests/push_store.test.py -q`:
  42 passed in 1.15 seconds.
- `npm test`: 19 files, 210 passed.
- `PATH=/tmp/chathermes-active-session-tests/bin:$PATH npm run test:api`:
  100 passed in 6.64 seconds, using the isolated uv Python environment.
- `npm run build` (also run by `npm run live`): passed. Rebuilt shipped worker
  is byte-identical to the public source; other dist assets did not change.
- Docker fixture launched through `npm run live` with a dedicated
  `365aab68-defects` instance and free dashboard port.
- Playwright `dashboard.spec.ts` and `push-routing.spec.ts`: 4 passed across
  desktop and mobile in 45.8 seconds. Inspected screenshots of active/completed
  disclosures, transcript scrolling, attachments, camera previews, and offline
  chat states. Assertions covered home/activity/offline focus, profile/model
  selection and exact-session notification retention/reconnect cleanup.
- `npm run live:stop`: passed; only this instance's containers removed and its
  disposable named data volume preserved.
- `git diff --check`: passed.

Visual tests were feasible and completed, with no Docker/browser blocker.
Timing regressions use controlled worker handshakes. Browser notification
checks use synthetic notifications in the real dashboard plugin and worker.
External push-provider delivery, OS notification clicks and physical iOS
keyboard/camera behavior were not tested. No commit, push, deployment, `.env`
change, or other-worktree edit was performed.
