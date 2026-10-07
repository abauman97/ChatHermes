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
