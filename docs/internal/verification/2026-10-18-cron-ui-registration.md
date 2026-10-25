# Issue #133: Cron delivery registration

Worktree: `/opt/data/projects/ChatHermes-issue-133`, based on
`2246a05daf337ba39a44e89eb350f7dea215d289`. No commit, deployment, push or PR.

## Runtime findings

Inspected `/opt/data/profiles/developer/cache/scratch/hermes-runtime-issue133`
at `5fea5a7a4bf6d02b3427fc0bcae95502222cea2e`:

- `hermes_cli/web_routers/cron.py` serves `/api/cron/delivery-targets` in the
  selected profile's config scope and prepends Local.
- `cron/scheduler_delivery.py::cron_delivery_targets` includes registered
  cron-capable platforms only when gateway config reports them connected.
  `cron_deliver_env_var` alone does not populate that list.
- The target resolver reads a profile-scoped home environment variable first,
  then Hermes's persisted `HomeChannel`. A bare `deliver=chathermes` without
  either destination resolves to no target. Installing the plugin must not
  invent a home destination, which would also affect origin fallback.
- `PluginManager` discovers the copied `plugins/chathermes/plugin.yaml` when
  `plugins.enabled` includes `chathermes`. The dependency wheel installs Python
  dependencies only; fixture `start.py` copies the plugin for discovery.
- The official release image additionally rejects `config_connected_fn` with
  `PlatformEntry.__init__() got an unexpected keyword argument 'config_connected_fn'`.
  The pinned source supports that newer field. Removing it and checking the
  merged YAML home or scoped environment in `is_connected` works with both.

The disposable fixture now explicitly enables the platform with a native YAML
home channel of `scheduled`. Its existing custom model provider remains
configured through `providers.chathermes-test`, with credentials referenced by
`key_env` on the server. No inbound adapter or Bot Chat integration was added.

## Validation

- Activated `.venv`; installed `pip install -e 'plugin/chathermes[dev]'`.
- With pinned runtime and `plugin` on `PYTHONPATH`, focused pytest for
  `tests/cron_delivery.test.py tests/docker/test_start.py`: **17 passed**.
  Covers native discovery, env and YAML destinations, explicit disablement,
  missing destination, unchanged origin fallback, standalone delivery, queued
  delivery ownership and profile history isolation.
- `npm test`: **677 passed**, 32 files.
- `npm run test:api` in the project venv: **115 passed**.
- `vp lint`, `vp fmt`, `npm run build`, `git diff --check`: passed.
  Tracked distribution assets restored after build; no generated asset changes
  are included.
- Started an owned instance with `npm run live`, `tests/docker/Dockerfile`,
  instance `issue133-fix-verify`, port 19123. The final registration module was
  copied to that container's fixture source and the container restarted after
  finding the release's unsupported keyword. No bind mounts or personal state.
- Playwright Chromium at the user-supplied path: **6 passed** across desktop
  and iPhone 13 viewports. Authenticated Cron API lists `chathermes`, Local
  remains the form default, the real dropdown selected `Chathermes` before the casing correction below, and both
  POST and persisted GET contain `deliver=chathermes`. Each test deletes its
  own synthetic job. Existing composer focus/scroll and collapsed/expanded
  tool disclosure checks also pass in the mounted dashboard plugin.

Reviewed desktop/mobile dropdown and saved-job screenshots, plus the plugin
screenshots in `tests/visual-output/`. Cron evidence is under
`live-real-native-Cron-form-8fb91-saves-its-delivery-platform-{desktop,mobile}/`:
`cron-chathermes-dropdown.png`, `cron-chathermes-selected.png`, and
`cron-chathermes-saved.png`.

This verifies registration and saved routing; no external push delivery or
scheduled provider execution was triggered. Native delivery tests use mocked
push. Stopped only `chathermes-issue133-fix-verify-hermes` and its anonymous
volume with `CHATHERMES_INSTANCE=issue133-fix-verify npm run live:stop`.

## Display name casing follow-up

Hermes's pinned `cron_delivery_targets()` title-cases platform IDs instead of
using the registered label. Registration now installs an idempotent wrapper
that sets only the `chathermes` target's display name to `ChatHermes`. Target
IDs, destinations, ordering, other fields and other targets are preserved.
README instructions and live browser expectations now use `ChatHermes` exactly.

Focused verification with the pinned runtime: **18 passed** across
`tests/cron_delivery.test.py tests/docker/test_start.py`, including env/YAML
API name assertions and wrapper idempotency/non-mutation coverage.
`npm test`: **677 passed**; `npm run test:api`: **115 passed**.
`vp lint`, `vp fmt --check`, `npm run build`, and `git diff --check` passed.
Build-generated changes were removed; distribution assets remain unchanged.

The earlier screenshots document registration before this casing correction.
Live desktop/mobile browser tests were not rerun for this follow-up; their
expectations were updated. No commit, push or deployment was performed.
