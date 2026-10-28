# Test and validate changes

Use the [developer setup](getting-started.md) first. Run commands from the repository root. Vite+ owns frontend linting, formatting, and the unit test runner; the npm scripts remain the project validation entry points.

## Local checks

```sh
vp fmt --check
vp lint
npm test
uv sync --locked
uv run ruff format --check .
uv run ruff check .
uv run ty check
PYTHONPATH=.hermes-source:plugin uv run pytest
PYTHONPATH=.hermes-source:plugin npm run test:api
npm run build
git diff --check
```

Use `vp fmt` to apply formatting. Build output under `plugin/chathermes/dashboard/dist/` is ignored and excluded from formatting/linting; never stage or commit it.

`npm run test:api` runs `uv run pytest tests/plugin_api.test.py`; `npm run test:docker` runs the Docker helper unittest suite through uv. For focused Python contracts, use the same environment, for example:

```sh
PYTHONPATH=.hermes-source:plugin uv run pytest tests/cron_delivery.test.py tests/execution_viewer.test.py tests/artifacts.test.py
```

For Python edits, use `uv run ruff format .` and `uv run ruff check --fix .`, then resolve remaining lint and `uv run ty check` diagnostics. Ruff checks all first-party Python; only generated/ignored files and the external `.hermes-source` checkout are excluded. ty retains its default correctness rules, promotes possible unresolved references/imports/attributes to errors, and checks override and suppression hygiene. Warnings fail the check too.

The default pytest suite collects both `test_*.py` and `*.test.py`, including Docker helper tests. `tests/integration/` probes require the isolated image and copied `/opt/plugins-src` path, so run them through the [Docker workflow](../../tests/docker/README.md), not the local default suite. Docker Compose validation skips when the Docker CLI is unavailable; the Android browser helper tests need Node.js. No provider credentials are needed. The `Python quality` GitHub Actions job runs the locked environment, non-modifying Ruff checks, ty, and the default suite against the exact source pin on PRs and main pushes. Repository administrators can require that job in branch protection.

Prefer observable user contracts. Retain focused protocol, security, deduplication, and pure-logic tests until replacements pass. See the [coverage migration audit](../../tests/test-audit.md).

## Real Hermes and browser workflows

The authoritative setup, rebuild, preparation, remote Docker, Android, failure inspection, and cleanup instructions are in [tests/docker/README.md](../../tests/docker/README.md). It documents the layered environment: Compose owns services, repository fixtures supply stock MockServer inference, and browser preparation and optional Android installation are independent steps.

Build explicitly with `npm run test:env:build`; run `npm run test:integration` for desktop/mobile workflows or `npm run test:integration:android` on a KVM-capable daemon. Tests do not rebuild implicitly. Failures retain containers and state for inspection. Isolate concurrent work with distinct Compose project names and published ports.

For UI changes, inspect screenshots of the actual dashboard plugin at desktop and mobile sizes and check focus, scrolling, attachments, selects, and disclosure transitions before committing. Documentation-only changes do not need visual testing. Legacy visual suites remain available as documented in the environment guide.

Real-provider testing is explicit opt-in through `npm run live:real` with root `.env` settings in a separate Compose project. `npm run live` uses deterministic inference. Never expose fixture ports publicly or share raw authentication traces.

The transcript workflow (`tests/workflows/transcript.spec.ts`) seeds real Hermes
compaction/rotation/rewind history, then checks bounded HTTP/native reads, scroll
and fallback pagination, anchors, reconnect, live backfill and restored tool output
in the authenticated desktop/mobile plugin. Its mid-flight resume scenario uses
a paced `[workflow-resume]` SSE fixture, takes the browser context offline, and
uses a separate authenticated native viewer to witness a missed delta before
reconnecting. It checks the running omitted-history snapshot, subsequent deltas,
exact final text, saved history, draft/focus and scroll anchoring without route
mocks. `tests/transcript.test.py` integrates
with the pinned runtime's SQLite and display projection, including page sizes
1, 7, 119 and 120. Run it with the same uv environment and runtime `PYTHONPATH` as the
other Python contracts.

## Documentation checks

Resolve relative Markdown links from each document's own directory, including fragments and image paths. Check links to moved records and source files as well as the documentation index. Historical local evidence may be absent; label it as an unavailable historical path rather than a working link. Keep commands aligned with `package.json`, installation scripts, plugin configuration, and the reviewed native contract.
