# Test and validate changes

Use the [developer setup](getting-started.md) first. Run commands from the repository root. Vite+ owns linting, formatting, and the unit test runner; the npm scripts remain the project validation entry points.

## Local checks

```sh
vp fmt --check
vp lint
npm test
# With the project virtualenv active and reviewed Hermes source available:
PYTHONPATH=/path/to/hermes-source:plugin npm run test:api
npm run build
git diff --check
```

Use `vp fmt` to apply formatting. Build output under `plugin/chathermes/dashboard/dist/` is ignored and excluded from formatting/linting; never stage or commit it.

`npm run test:api` runs `tests/plugin_api.test.py`. For focused Python contracts, use the same environment, for example:

```sh
PYTHONPATH=/path/to/hermes-source:plugin python -m pytest tests/cron_delivery.test.py
```

Prefer observable user contracts. Retain focused protocol, security, deduplication, and pure-logic tests until replacements pass. See the [coverage migration audit](../../tests/test-audit.md).

## Real Hermes and browser workflows

The authoritative setup, rebuild, preparation, remote Docker, Android, failure inspection, and cleanup instructions are in [tests/docker/README.md](../../tests/docker/README.md). It documents the layered environment: Compose owns services, repository fixtures supply stock MockServer inference, and browser preparation and optional Android installation are independent steps.

Build explicitly with `npm run test:env:build`; run `npm run test:integration` for desktop/mobile workflows or `npm run test:integration:android` on a KVM-capable daemon. Tests do not rebuild implicitly. Failures retain containers and state for inspection. Isolate concurrent work with distinct Compose project names and published ports.

For UI changes, inspect screenshots of the actual dashboard plugin at desktop and mobile sizes and check focus, scrolling, attachments, selects, and disclosure transitions before committing. Documentation-only changes do not need visual testing. Legacy visual suites remain available as documented in the environment guide.

Real-provider testing is explicit opt-in through `npm run live:real` with root `.env` settings in a separate Compose project. `npm run live` uses deterministic inference. Never expose fixture ports publicly or share raw authentication traces.

## Documentation checks

Resolve relative Markdown links from each document's own directory, including fragments and image paths. Check links to moved records and source files as well as the documentation index. Historical local evidence may be absent; label it as an unavailable historical path rather than a working link. Keep commands aligned with `package.json`, installation scripts, plugin configuration, and the reviewed native contract.
