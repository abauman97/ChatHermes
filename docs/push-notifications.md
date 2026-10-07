# ChatHermes Web Push

Serve the Hermes dashboard over trusted HTTPS (localhost is exempt for local
browser development). iOS/iPadOS requires 16.4 or newer and the ChatHermes web
app added to the Home Screen before Web Push is available. Open ChatHermes,
open the navigation drawer, select the footer **Settings** cog, then
**Enable notifications**; the browser's
permission prompt is requested only from that explicit action. Use the same
control to disable the device subscription.

The first `/push/config` request creates a VAPID keypair, persisted with the
Hermes state under `state/chathermes-push.json` (file mode 0600). Back up this
file with Hermes data: losing it invalidates all browser subscriptions. To
regenerate keys intentionally, stop the dashboard and remove this file; each
device must then enable notifications again. Do not copy its private key into
browser configuration or logs.

Set `HERMES_DASHBOARD_PUBLIC_URL` to the dashboard's HTTPS URL for background
push delivery. The VAPID subject uses its origin with the path removed. When
that setting is absent or invalid, request-backed delivery (such as **Send test**)
can use the validated HTTPS request base origin. Without either valid origin,
delivery fails safely without attempting transport. The pinned py-vapid 1.9.4
requires a DNS HTTPS origin without a path or explicit port; credentials, query
strings, fragments, localhost, and malformed URLs are rejected. The VAPID
audience remains the push service origin, not the dashboard origin.

Notifications are intentionally content-free: completed turns, approval,
clarification, or failed/interrupted attention only. Tapping opens the existing
`/chathermes?profile=…&session=…` route and native viewer recovery. The
session ID is the stored dashboard session, even when Hermes resumes it under a
different runtime alias. Native `message.complete` already maps to completion or
attention; derived completion events do not schedule an additional push. The service
worker is scoped to `/chathermes` and does not cache dashboard/API responses.
Notifications are suppressed only when the exact originating profile and session
is open and its native viewer is connected in a mounted ChatHermes plugin. Focus
and visibility do not affect this: a connected hidden or unfocused tab counts.
Home, other sessions/profiles, other views, and disconnected viewers receive
notifications. The worker asks every same-origin window for fresh plugin state
(profile, session, connection, and current SPA URL), failing open on missing or
invalid replies. It never relies on stale WindowClient URLs or cached state.
When a session connects, all matching ChatHermes tagged notifications close,
including notifications from earlier events. Opening or clicking through to a
disconnected session retains its notification until it connects. Display and
cleanup are serialized and state is rechecked after display to cover connection
races. Sessionless test notifications remain available to inspect.
Each handshake uses a message channel with a 300 ms timeout. After the two
parallel handshake rounds settle, still-present positive clients are confirmed
individually. Matching notifications close at that confirmation, and suppression
stops on a confirmed target; neither action waits for another client's reply. In Settings,
**Send test** uses the same authenticated push transport and always shows an
explicit content-free test notification, even with a connected viewer.
A successful test request means scheduling succeeded, not that the device received it.

Enable INFO logging for the ChatHermes dashboard modules to trace structured
`ChatHermes push` records: `event.detected`, `owner.notify` (including duplicates),
`sender.notify`, `sender.scheduled`, `deliver.config` (matching enabled subscription count and availability),
`pywebpush.attempt`, `pywebpush.result` (success and HTTP status), and
`deliver.expired` (404/410 removal). Failures include only exception classes.
Records contain kind/profile/session/subscription IDs, never endpoints, keys, credentials,
or conversation content. Push failures and unavailable browser support do not
change chat execution.

The shipped plugin-root `pyproject.toml` declares `pywebpush==2.5.0` and
`py-vapid==1.9.4` (Python import name `py_vapid`). Accept the Hermes installer’s
Python dependency prompt, or use its `--yes-deps` option for an authorized
noninteractive install. Copy-only/older installations require the explicit
same-runtime command or `install:plugin -- --python` option in
[deployment](deployment.md), followed by a dashboard
restart. The test image installs this same declaration rather than supplying
a separate test-only Web Push package. Both key generation and delivery imports
must work before the configuration reports available. If the
Notifications control reports the service unavailable, verify HTTPS, browser
permission, Home Screen installation (iOS), and that this library is installed.

See [latest-main verification](verification/2026-10-07-push-notifications.md) for
test results and the Docker/dashboard verification limitation.
