# Docker changes integrated with main

Base: `origin/main` at `4ba5edd`. Source branch: `cleanup-chores` at `a6f74c2`.

## Scope

Ported the test-provider dotenv parser and container ownership checks. Real mode
loads repository `.env` settings without executing shell expressions. Exported
`TEST_LLM_API_*` settings override dotenv settings and legacy `LLM_API_*` exports;
the legacy runtime names remain the pinned Hermes environment contract. Provider
URLs containing credentials, queries or fragments fail without printing values.
Fixture mode and stop do not load dotenv settings. Each launcher container is
labeled, and all targets are checked before any removal. Named volumes survive
stop and failed startup. Older unlabeled containers require an explicit instance
change or manual inspection and cleanup.

Retained main's pinned Docker image/source, default fixture mode, isolated
networks, named volumes, profile/Project/cron seeding, model fixture, browser
relay, native test runner, frontend architecture, documentation and committed UI
assets. The source branch's latest-image replacement and fixture/helper deletions
would change the tested runtime contract and break the default browser workflow;
they were not ported. Its general documentation removals, Git normalization and
UI asset changes are outside this Docker integration.

## Validation

- `npm run test:docker`: 35 passed, including dotenv parsing, provider precedence,
  URL credential rejection, foreign-container preservation and owned cleanup.
- `npm test`: 351 passed across 23 files.
- `npm run test:api`: 96 passed with dependencies in a disposable `/tmp` venv.
- `npm run build`: passed; no frontend source changed, so main's committed assets
  were retained instead of introducing a build-path-dependent asset rename.
- `vp lint`: passed.
- `vp fmt`: run; unrelated line-ending churn was reverted. Repository-wide
  `vp fmt --check` flags main's existing CRLF files. Changed Markdown files were
  checked separately.
- Actual pinned Hermes dashboard launched with `npm run live`, instance
  `docker-main-integration`, loopback port 9127, without personal state mounts.
- Playwright dashboard and composer suites: four passed, desktop and mobile.
  Checked focus, 16px input size, eight-row and short-viewport scrolling, model
  and profile selection, authenticated file/camera attachment flow, arriving
  activity, completed disclosure collapse and reopening, and send recovery.
- Inspected desktop/mobile completed-turn screenshots and the mobile focused
  short-viewport screenshot. The UI remains readable with a visible composer.

Real-provider calls were not made; provider configuration and secret handling
were exercised with synthetic values. Browser verification used Chromium with
mobile emulation, not physical iOS hardware. Test containers were stopped with
`npm run live:stop`; the disposable named test volume was preserved.
