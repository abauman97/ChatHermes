# Push notification verification — 2026-10-07

Base: origin/main `2d3f26197ac1c68db152abeedca5499de2d10eac`. Push-only changes
were ported from a read-only sibling reference; its stale project feature changes
were not merged. Main's project screens and API remain in place.

- `npm test`: 179 tests passed, including worker route-query suppression and
  mounted plugin route replies, authenticated test requests, and Settings UI.
- `npm run test:api` with an isolated uv virtual environment using
  `tests/requirements.txt`: 100 tests passed, including existing project API tests.
- Push store/sender suite: 16 tests passed. Coverage includes profile isolation,
  disabled subscriptions, sanitized diagnostics, scheduling failure, storage
  failure, expired subscriptions, and continuing delivery to the next device
  when delivery or expired-subscription removal fails.
- Docker distribution/launcher suite: 28 tests passed.
- `npm run build`: passed; committed-distribution asset paths rebuilt.
- `git diff --check`: passed.

Native attach regression coverage checks stored session links when the runtime
resumes under an alias. Completion tests check that message.complete schedules
one push and derived completion/attention events do not add another. Approval
and clarification requests are scoped to the current runtime and deduplicated.
The test endpoint rejects failed or absent scheduling results, ignores supplied
content, and returns only a scheduled flag or a static error.

The isolated fixture was attempted once through `npm run live`, using the pinned
Dockerfile and cached source. The image built successfully. Startup then failed
with Docker's `all predefined address pools have been fully subnetted` error.
No infrastructure startup retry was made. `npm run live:stop` completed and
preserved the named disposable data volume. No personal Hermes home was mounted.

Actual dashboard visual verification at mobile and desktop sizes could not run,
including the new route-query and Send test Playwright checks and their host
401 authentication assertions. Real browser push subscriptions/device receipt
remain unverified; sender tests mock the provider transport. A broad local
pytest collection also found that the native integration contract requires
`tui_gateway`, which is only supplied by the pinned Hermes runtime; that contract
was not executed locally. All local API, push, distribution, and launcher tests
listed above passed with isolated dependencies.

No deployment, commit, push, or PR was performed.
