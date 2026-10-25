# Configure ChatHermes

ChatHermes uses Hermes configuration and existing profile credentials. There are no browser gateway keys or connection settings to enter.

## Hermes API server

In the dashboard host's Hermes `config.yaml`, merge these listener settings with existing configuration:

```yaml
platforms:
  api_server:
    enabled: true
    host: 127.0.0.1
    port: 8642
    key: <strong-random-secret>
```

Replace the placeholder with a strong secret and keep it server-side. The listener address comes from the dashboard host configuration. For named profiles, the proxy reads that profile's `API_SERVER_KEY` secret; ensure it matches the credentials accepted for that profile. The host key is only a fallback when profiles intentionally share it. Ensure the dashboard can reach this API server, then restart the necessary Hermes service. Native chat uses the dashboard gateway; the API server supplies authenticated session history and metadata. See [deployment](../developer/deployment.md) for runtime and hosting requirements.

## Profiles and models

Select a Hermes profile before starting a chat. History, uploads, Projects, scheduled results, and notification registrations follow that profile. Existing chats retain their saved workspace.

Choose the provider and model in the composer. The choice applies to the native session runtime without changing profile defaults. If Hermes rejects or defers the selection, resolve it before sending. A missing provider inventory falls back to the configured default and model route aliases.

Manage provider credentials, profile defaults, and profile creation in Hermes. Never put provider keys into browser settings.

## Optional notifications and scheduled delivery

Follow [notifications](notifications.md) for browser permission, `HERMES_DASHBOARD_PUBLIC_URL`, and per-profile Cron destinations. Server persistence and multi-worker hosting belong in [deployment](../developer/deployment.md).
