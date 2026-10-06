# ChatHermes PWA and Web Push rollout

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

Notifications are intentionally content-free: completed turns, approval,
clarification, or failed/interrupted attention only. Tapping opens the existing
`/chathermes?profile=…&session=…` route and native viewer recovery. The service
worker is scoped to `/chathermes` and does not cache dashboard/API responses.
When ChatHermes is already a focused visible page, notification banners are
suppressed. Push failures and unavailable browser support do not change chat
execution.

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
