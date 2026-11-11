# Issue #255: independent pending approval lifetime

Implemented in the issue-255 worktree without commits, deployment, dependency
changes, or changes to other worktrees or services. Requirements were read with
`gh issue view 255 -R abauman97/ChatHermes`. The earlier read-only investigation
report was consulted as reference; no unrelated investigation edits were imported.

## Change and self-review

Approval choices render for the lifetime of the normalized pending envelope,
without using parent-turn activity. The first-open request policy, allowed choices,
exact envelope IDs, native response transport, request cancellation, and captured
scope-generation guards remain intact. Busy/Stop/composer activity still reflects
the parent; an open child approval does not make an idle parent artificially busy.

A shared `requestDisabled` projection gates both rendering and controller answers
when offline, reconnecting or native streaming is unavailable. Request-local
pending state still blocks repeat submissions. Clarification and secret forms use
the same availability gate. No Python/runtime protocol or consent-policy changes.
The architecture guide documents the lifetime and submission contract.

Self-review checked the sole approval component caller, normalization and unknown
payload safeguards, controller guards, gateway exact-ID settlement, and disposal.
No unresolved application-code findings. No generated output is staged. The build
artifacts are preserved locally as requested, including changes to baseline-tracked
`dashboard/dist` files; they must remain excluded from any future commit.

## Regression coverage

The independent-review corrections below supersede the original unit-test claims
about reconnect replay and same-ID scope isolation. The original reconnect call
ran while ready and did no reconstruction; the original beta snapshot contained
an alpha envelope and did not establish an actionable replacement.

`src/features/chat/composables/pending-requests.test.ts` adds 13 mounted
component/controller/native-session/gateway/channel tests. These cover parent
completion, REST hydration, idle `open_requests` reconnect replay, Allow/Deny wire
IDs, concurrent requests, cancellation/timeout/settlement/session closure,
foreign profile/session rejection, obsolete callbacks, teardown, disabled states,
clarification submission/draft retention, password masking and clearing, duplicate
submission suppression and isolation of late failures.

Temporarily restoring the original two rendering components made both new
completion/reconnect cases fail because the expected Allow/Deny buttons were
absent: **2 failed, 11 skipped, exit 1**. The fixed files were restored immediately;
the running Docker image was unaffected. The new tests subsequently pass.

`tests/workflows/pending-approval.spec.ts` runs real `delegate_task` and terminal
approval in authenticated Hermes with stock MockServer inference. It observes an
enabled approval, parent completion without cancellation, the same envelope in an
idle reload snapshot, visible disabled controls offline, editable composer focus,
online recovery, and exactly one Allow/Deny response to that ID. MockServer
verification checks that the exact child's tool continuation contains the actual
approved/denied result. The workflow also waits for Hermes's real asynchronous
parent wake to finish with no remaining request card.

## Environment and commands

Preparation: `npm ci` and `uv sync --locked`, both exit 0. Reviewed Hermes source
was checked out at `.hermes-source`, commit
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` (v0.23.0).

Task-owned Compose project: `chathermes-issue-255-fix`, dashboard port **24519**,
MockServer port **24580**, private bind `172.25.0.2`. Ignored local override
`tmp/issue-255/compose.yml` assigns unused subnet `10.246.255.0/24`. The investigation
project at 24319/24380 and all pre-existing containers were left running unchanged.
Only this task's fixture was built and started; state/containers remain for review.

Fixture commands, with the above project, bind and port environment variables:

```sh
npm run test:env:build
# Explicit startup includes the local network override:
docker compose --project-directory . -f tests/docker/compose.yml -f tmp/issue-255/compose.yml up -d --wait --no-build
```

Both exit 0. Integration helpers additionally use
`CHATHERMES_COMPOSE_OVERRIDE=tmp/issue-255/compose.yml` and
`CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`.
Every integration run verified the reviewed Hermes pin and image
`sha256:b89d7fb752bfc6917b3c88f998de75925755e1084e357eb1182d042a087e9515`.
The final generated application bundle and the fixture's copied bundle both have
SHA256 `ca5205a2688a7d3d74737e297b0710734c58f9000e50cd4d67a0b2167d7857a2`.

| Validation                                               | Outcome                              |
| -------------------------------------------------------- | ------------------------------------ |
| `npm test`                                               | Exit 0; 49 files, 1,523 tests passed |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`      | Exit 0; 182 passed, no skips         |
| `npm run build`                                          | Exit 0                               |
| `node_modules/.bin/vp lint`                              | Exit 0                               |
| `node_modules/.bin/vp fmt --check`                       | Exit 0                               |
| `git diff --check`                                       | Exit 0                               |
| New protocol regression file alone                       | Exit 0; 13 passed                    |
| Related desktop/mobile workflows below                   | Exit 0; 12 passed                    |
| Profile navigation + approval offline/recovery workflows | Exit 0; 10 passed                    |

Related browser command:

```sh
npm run test:integration -- tests/workflows/prompt-layout.spec.ts tests/workflows/navigation.spec.ts tests/workflows/messaging.spec.ts --grep 'long content|file and camera|resumed model|reasoning and tools'
```

It checks long approval/clarification/secret layouts, scroll bounds and restoration,
clarification custom answers, secret cancellation through Stop, authenticated file
and camera attachments, focus, model/reasoning selects and runtime choice, and
streaming/completed disclosure transitions on desktop and mobile. Profile isolation
was additionally checked through real navigation/reload for default, alpha and beta
on both targets:

```sh
npm run test:integration -- tests/workflows/pending-approval.spec.ts tests/workflows/navigation.spec.ts --grep 'pending child|session navigation' --output=tests/visual-output/issue-255
```

Final approval verification command (after correcting the fixture matchers):

```sh
npm run test:integration -- tests/workflows/pending-approval.spec.ts --max-failures=1 --output=tests/visual-output/issue-255-verified
```

Both Allow and Deny passed on both targets. The exact request IDs were:

| Target  | Allow once         | Deny               |
| ------- | ------------------ | ------------------ |
| Desktop | `srq-9485ab9af521` | `srq-a4f6b12b8b29` |
| Mobile  | `srq-53949cb7c23d` | `srq-a3e757c79296` |

### Screenshots

Final approval screenshots are retained under
`tests/visual-output/issue-255-verified/`, with these exact subdirectories:

- `pending-approval-pending-c-1f29f--completion-and-reload-once-desktop/`
- `pending-approval-pending-c-f94af--completion-and-reload-deny-desktop/`
- `pending-approval-pending-c-1f29f--completion-and-reload-once-mobile/`
- `pending-approval-pending-c-f94af--completion-and-reload-deny-mobile/`

Each contains `parent-active.png`, `parent-complete-pending.png`,
`reloaded-pending.png`, `offline-pending.png`, and either `resolved-once.png`
or `resolved-deny.png`, plus the fixture's final target screenshot.
Desktop/mobile images were opened and inspected for enabled pending controls,
disabled offline controls, wrapping, composer separation and resolved-card removal.

Related screenshots remain under `tests/visual-output/`, including:

- `navigation-file-and-camera-c6b53-and-preserve-composer-focus-{desktop,mobile}/attachment.png`
- `messaging-resumed-model-an-4b40a--the-real-inference-request-{desktop,mobile}/resumed-model-reasoning.png`
- `messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-{desktop,mobile}/tool-streaming-expanded.png`
- `messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-{desktop,mobile}/activity-collapsed.png`
- `prompt-layout-secret-long--7b21b-in-the-mounted-conversation-{desktop,mobile}/secret-password-input.png`
- `prompt-layout-clarify-long-23353-in-the-mounted-conversation-{desktop,mobile}/clarify-custom-response.png`
- `prompt-layout-approval-lon-6c39f-in-the-mounted-conversation-{desktop,mobile}/approval-long-content.png`

The brace notation above denotes two separate existing paths. Representative
related desktop/mobile images were also visually inspected.

## Evidence and limitations

Logs are retained under ignored `tmp/issue-255/`. One repeated frontend command
printed a passing 1,523-test summary but its tool session returned 143; the first
full run and a subsequent explicit-status run both exited 0. An initial targeted
assertion incorrectly inspected only direct disabled attributes on clarification
buttons; it was corrected to account for inherited HTML fieldset disabling.

Screenshot review caught an overly broad inference matcher in the first browser
fixture: Hermes's post-child parent notification could trigger another synthetic
tool call. Initial exact-child outcome checks passed, but that fixture was narrowed
to the initial prompt marker suffix (allowing Hermes’s model-change notice), an
exact child goal and a scoped parent-wake response. Final browser coverage also
asserts that the parent wake completes without another request. An intermediate
run using exact equality for the parent prompt missed Hermes’s model-change notice
prefix: 4 failed, exit 1, before approval appeared. The final suffix matcher corrects
that test setup failure.

Mobile coverage is Chromium iPhone emulation, including a 320px narrow layout;
no physical Android/iOS or native keyboard verification. This tests terminal
approval's shared rendering lifecycle, not the original `execute_code` classifier
or production incident. Expiration/cancellation races and concurrent exact-ID
behavior are injected native-protocol tests; no new real five-minute timeout test
or simultaneous background-child browser scenario is claimed. Secrets use only
synthetic test data. No real-provider test was run. No production data or
credentials were read or changed. Local screenshot/log paths are retained worktree
evidence and are not distributed with the repository.

## Independent-review follow-up

Only `pending-requests.test.ts` and this verification record were changed for the
follow-up. Existing application changes, browser tests and generated assets were
preserved. No commit, deployment, container changes or build regeneration.

The scope test now switches both profile and selected session to beta/two and
resumes a valid beta approval with the original `same-id`. It asserts native
readiness, the replacement envelope and enabled mounted controls before invoking
the captured alpha callback. That callback sends nothing and leaves the replacement
pending; a current callback sends exactly one Deny response to the same ID and
removes it. A separate pending envelope checks captured-callback teardown gating.

Both Allow/Deny lifecycle cases now go offline through native availability,
assert that the original socket closes and controls disable, then recover through
a second socket. The harness holds the second `session.resume` reply and records
its `running: false` and exact `open_requests` payload. While held, connection is
reconnecting, both controls remain disabled, and a controller answer sends nothing.
Releasing the reply completes reconstruction; the session is ready and idle,
controls enable, and the selected exact-ID response is sent once.

Mutation check: temporarily removing only the controller's scope-generation
comparison caused the strengthened scope test to fail at the no-reply assertion:
the obsolete callback sent `{choice: "once"}` to `same-id`. Result: **1 failed,
12 skipped, exit 1**, as expected. The controller was restored byte-for-byte in a
`finally` block before subsequent checks.

Follow-up validation (separate from the earlier full/browser runs above):

```sh
npm test -- src/features/chat/composables/pending-requests.test.ts src/features/chat/components/LiveRequest.test.ts src/features/chat/runtime/native-reconnect.test.ts src/features/chat/runtime/native-gateway.test.ts
node_modules/.bin/vp lint
node_modules/.bin/vp fmt --check src/features/chat/composables/pending-requests.test.ts
git diff --check
```

The targeted suite passed **4 files, 73 tests, exit 0**. The pending-request file
also passed alone: **13 tests, exit 0**. Lint and targeted formatting check passed,
exit 0; diff whitespace check passed, exit 0. An initial lint run reported TS2322
because the parameterized choice inferred `string`; marking the cases `as const`
resolved it before the final checks.

These are injected native-protocol/mounted-component tests. Full frontend/API
suites, build and browser/visual workflows were not rerun for this test-only
follow-up; the earlier results above remain historical evidence, not new runs.
