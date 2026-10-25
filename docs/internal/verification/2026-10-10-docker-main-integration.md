# Disposable Docker workflow with main's plugin

Base: `origin/main` at `4ba5edd`. Docker source: `cleanup-chores` at `a6f74c2`.

## Scope

The Docker configuration restores the pre-merge branch's workflow:

- Extend `nousresearch/hermes-agent:latest` and install the plugin's declared
  Python dependencies into the dashboard interpreter.
- Launch one real-provider container, with the upstream supervisor owning PID 1.
- Load only `TEST_LLM_API_BASE_URL`, `TEST_LLM_API_KEY`, and `TEST_LLM_API_MODEL`
  from repository `.env`, as data. Exported values take precedence.
- Generate the internal gateway credential server-side, enable authenticated
  dashboard access, and check both dashboard and gateway health.
- Publish on loopback by default. Do not mount personal state or create named
  networks/volumes. Owned-container cleanup removes anonymous data on stop,
  restart, and failed readiness. Older fixture named volumes remain untouched.
- Remove the old model fixture, browser relay, seeding and native fixture runner.
  `npm run live` and `npm run live:real` use the same disposable workflow.

Main's `src/`, Python plugin implementation, committed dashboard assets,
frontend architecture and unrelated documentation are unchanged. The Docker
runtime files match the pre-merge source branch. Additional launcher tests cover
resource ownership, single-container launch, secret-free command arguments,
invalid settings and failed-readiness cleanup.

Default Playwright verification now targets this empty real-provider dashboard.
It checks native responses and terminal tools without deterministic reply strings
or seeded profiles. Existing fixture-dependent suites remain explicitly available
through `npm run test:visual:legacy` with a separately supplied seeded dashboard.

## Validation

- `npm run test:docker`: 10 passed.
- `npm test`: 351 passed across 23 files.
- `npm run test:api`: 96 passed using the existing temporary Python environment
  in the clean worktree; its unchanged API test and plugin files match this PR.
- `npm run build`: passed. Unrelated regenerated asset changes were discarded;
  the final image was rebuilt using main's unchanged committed assets.
- `vp lint`: passed. Changed supported files were formatted with `vp fmt`.
- `git diff origin/main -- src`: empty.
- Latest image tested: digest
  `sha256:9774f4f39a9bb8c2f68ce728ed5e99ddbad282163be56764afacf88ed952b784`.
- Actual dashboard launched as `real-main-integration` on loopback port 9128,
  using repository `.env` provider settings without printing credentials.

Desktop and mobile browser checks passed (desktop in the combined run; mobile
after correcting the test for automatic drawer closure on profile selection).
Inspected completed-turn screenshots at both sizes, plus the mobile attachment
and short viewport. Browser verification covers composer focus and
scrolling, short mobile viewport, default profile select, model picker, file
upload, camera preview, a real native terminal call and completed tool disclosure
reopening. Physical iOS and real camera capture are not exercised. The legacy
fixture-dependent browser suites are not run against this empty dashboard.

The owned test container was stopped with `npm run live:stop`; its anonymous data
volume was verified removed.
