# Install ChatHermes

## Install in Hermes

1. Start with a working Hermes dashboard and an authenticated dashboard account. Check the [compatibility requirements](../../README.md#requirements-and-compatibility).
2. Run:

   ```sh
   hermes plugins install abauman97/ChatHermes#plugin/chathermes --enable
   ```

3. Accept Hermes's dependency consent prompt. Hermes installs the dependencies declared in the shipped plugin's `pyproject.toml` into its managed runtime.
4. Enable the [Hermes API server](configuration.md#hermes-api-server) with a strong key. The dashboard runtime also needs `httpx` for authenticated history requests.
5. Restart the dashboard and open **ChatHermes**. Follow [your first chat](getting-started.md).

The installation source must include built dashboard assets. A source-only checkout needs the [developer build and installation procedure](../developer/deployment.md). Generated assets remain ignored locally.

## Install with your agent

Paste this prompt into Hermes Agent to install ChatHermes and configure the
profiles you choose. The agent should read the [installation](installation.md) and
[Cron delivery](notifications.md#enable-cron-delivery) guides for exact setup details:

> Install ChatHermes from `abauman97/ChatHermes#plugin/chathermes` using the
> documented Hermes plugin installation procedure. Then configure ChatHermes as
> a Cron delivery target in these profiles: `<profile names>`.
>
> Read `docs/user/installation.md` and `docs/user/notifications.md` in the ChatHermes repository first.
> For each named profile, ensure runtime plugin discovery can find ChatHermes;
> if appropriate, symlink the default plugin installation into that profile as
> documented. Preserve any existing plugin installation and configuration—do
> not overwrite paths or replace existing `plugins.enabled` entries. Enable the
> plugin and configure that profile's own ChatHermes destination. Ask me for any
> required destination or permission choice you cannot determine safely. Restart
> only the necessary Hermes service, then verify plugin discovery and Cron
> target availability in each requested profile. Do not create a test Cron job
> or send a notification unless I ask. Report what changed and what remains
> unverified.

Replace `<profile names>` with the profiles to configure (for example,
`default, developer`). The agent should ask before making changes if it cannot
identify the installation guide, profile home paths, or safe plugin target.

## Use additional profiles

Select an existing Hermes profile in ChatHermes; create and manage profiles in Hermes. Plugin discovery and enablement must work in every profile that needs ChatHermes, including profiles that own Cron jobs. Preserve existing `plugins.enabled` entries when adding `chathermes`.

If a profile cannot discover a default-profile installation, first check its actual Hermes home and plugin paths. Where needed, create a symlink from that profile's `plugins/chathermes` to the existing default installation, only when the destination does not already exist. Never replace an existing installation. Custom Hermes homes may differ from `~/.hermes`; do not guess paths.

Configure Cron destinations separately for each owning profile using [Cron delivery](notifications.md#enable-cron-delivery). Installation alone does not enable Cron notifications.
