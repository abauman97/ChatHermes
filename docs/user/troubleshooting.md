# Troubleshooting

## ChatHermes is missing or does not load

Check plugin installation and the owning profile's `plugins.enabled`, then restart the dashboard. A source-only install needs built assets. See [installation](installation.md) and [local deployment](../developer/deployment.md).

## Sending is unavailable or history fails

Check dashboard authentication, the [API server configuration](configuration.md#hermes-api-server), and Hermes compatibility. Unsupported native contracts fail closed. The dashboard must supply native WebSocket tickets; browser gateway keys cannot repair this. A rejected or deferred model choice must be resolved before sending.

After a disconnect, reopen the same profile/chat and let history load. Do not repeatedly resend a prompt whose outcome is unknown. Inspect the restored history first. Work survives browser departure only while its host/runtime remains alive.

## A Project chat cannot start

Check that the Project has an available workspace in the selected profile. A pathless Project cannot create a scoped chat. Switching Projects does not move an existing conversation; use **New Project Chat** for a new workspace conversation.

## An attachment or artifact is unavailable

Retry or remove failed staged uploads; each file must fit the 20 MB decoded limit. Confirm the selected profile and chat. The agent needs filesystem access for non-image uploads. Missing/pruned files cannot be recovered from a card. Remote SSH deletion is unsupported; native file policy still applies to preview and download.

## Notifications do not arrive

Check trusted HTTPS, browser permission, the selected profile's Settings status, and iOS Home Screen installation. A visible, connected matching chat suppresses ordinary notifications; **Send test** still displays a test. Scheduling success alone does not prove receipt.

Have the dashboard operator check `HERMES_DASHBOARD_PUBLIC_URL`, persistent push state, and the push dependencies in the same Python runtime that starts the dashboard. Follow [dependency repair](../developer/deployment.md) and [push diagnostics](../developer/notifications.md). Do not publish private state, keys, raw logs, or conversation content.

If **ChatHermes** is absent from Cron's **Deliver to** menu, check discovery, enablement, and destination configuration in the profile that owns the job. Existing jobs are not updated automatically. See [Cron delivery](notifications.md#enable-cron-delivery).

## Report a problem

Include Hermes version, browser/device, selected profile type, steps to reproduce, and a sanitized error or screenshot. Describe whether the problem occurs after reload or profile switching. Remove credentials and private chat content. Contributors can reproduce against the [isolated test environment](../developer/testing.md).
