# Issue 238: current-main admission work (2026-11-08)

This record applies to `/opt/data/projects/ChatHermes-issue-238-main` starting at
`270b9cea25b858ff0ffed7e34a1be0d5b3111eec`, verified equal to `origin/main` after
fetch. Prior uncommitted work and its evidence at
`/opt/data/projects/ChatHermes-issue-238` were read only. Selected backend changes,
regressions and disclosures were ported with `git apply --check` against current
main; old verification claims were not copied as new evidence. Current Scheduled
result extraction, reconnect/transcript behavior, Kanban and all other upstream
code were retained. No commits, staging, pushes, deployments or workflow changes.

Maintained guidance: [admission assessment](../../developer/catalog-admission.md),
[API contract](../../developer/api-contract.md), [testing](../../developer/testing.md).
Installed disclosures: [plugin README](../../../plugin/chathermes/README.md).

## Changes and review

Removed the native Cron branding rebind, declared Hermes/Python floors, removed
the unused plugin development extra, and ported scoped gateway fallback and
escaped credential redaction. Added real-scope credentials, registration,
metadata, encoded response and transport tests. Config-key precedence and
shared-listener fallback remain covered; no browser keys were introduced.

Beyond the previous checkout, replaced scheduler-private redaction and title
helpers with the documented public forced redactor, preserving fail-closed
behavior without logging third-party exception messages. Push state now uses
unpredictable, exclusive, initially private temporary files and atomic
replacement. Tests inspect permissions before publication, ignore a predictable
symlink, preserve old identity on replacement/serialization failure and reject
leftover temporary key material. Review moved cleanup outside the file context
so the file is closed before unlink on every failure path.

Own review checked the complete production diff, credential scrub paths,
registration identity, temporary-file failures, dependency override consumers,
lock consistency and unchanged upstream feature code. Full unit/API contracts
and mounted workflows provide behavior evidence; they do not prove catalog
policy compliance. Glob/Minimatch overrides are limited to affected test-tool
parents. Manual JS Beautify with EditorConfig and direct pattern lookup passed
using Glob 14.0.4 and Minimatch 11.0.5. No tests or functions were removed to get
validation passing.

## Current upstream evidence and unresolved admission

Read the live official catalog submission/public API/dashboard extension docs,
then inspected Hermes main `e075441241b8d626789b4aae0e376f86eabf824d`: generated
`hermes_cli/data/plugin_api.json`, PluginContext, `plugin_provider_requests.py`,
`plugins/plugin_storage.py` and gateway session documentation/source. A separate
ignored source export at `tmp/hermes-current` allowed the actual current-main
`private_import_findings` and `private_attribute_findings` to run against this
plugin: **64 import sites and four private attribute accesses**. Its allowlist
accepts `agent.redact.redact_sensitive_text`. This was a static analysis run,
not a mounted current-main runtime test or a full current-main install validation.

Private backend context/native dispatch/file/Cron services remain a rule 9
blocker. Hermes has public REST/SDK APIs and a newer `session.transcript` RPC;
that RPC is absent from the reviewed native pin. Do not present public transcript
pagination as universally missing. A verified migration and host/profile-bound
backend delegation are still needed for this plugin's background/hosted tasks.
`credentialed_provider_request` allows signed-in providers and plugin-declared
OAuth origins, not internal gateway bearer delegation. Configuration-key reads
and private host/profile scope selection remain unresolved under rule 11.

VAPID is a generated, durable plugin signing identity, not a vendor OAuth login.
No public VAPID signer was found. Whether rule 11 permits generated identity
storage requires a maintainer decision; alternatively request a durable host
signer that can import the existing key. This work does not rotate keys, discard
subscriptions or disable push. No upstream issue, exception or approval was
obtained. Explicit disclosure and stronger file permissions are not approval.

## Isolated install validation

Official base digest:
`sha256:adb7890916de63245523492be8f68f9d2095fecbec4e2a6dab7960381f0fc002`.
Its `/opt/hermes/install-stamp.json` reports Hermes **0.23.0** at
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`. This differs from both current-main
API analysis and the repository's native contract pin.

Created `chathermes-238-main-validator` with `--init`, no published ports, its
own filesystem and `HERMES_HOME=/tmp/chathermes-catalog-home`; copied the final
plugin including built assets. Ran twice, most recently after the own-review
changes:

```sh
docker exec -e HERMES_HOME=/tmp/chathermes-catalog-home \
  chathermes-238-main-validator \
  hermes plugins validate /opt/chathermes/plugin --install-deps --json
```

Dependency preparation succeeded; exit zero; all **15** reported checks passed:
manifest fields/floor, config/environment/OAuth, loadability, three Python
requirements, isolated registration, declared tools/hooks/middleware, built-in
collisions, safe install scan and no core rebinds. This plugin ships no Desktop
entrypoint. The older image's allowlist warns about **65** private import sites
(including the now documented public redactor) and **four** private attribute
accesses. Isolation reports in-process platform/streaming requirements. Read the
warnings; passing checks do not establish eligibility or sign off credential
policy. Raw report files are local `/tmp/ch238-validator-final.*` and current
static findings are `/tmp/ch238-current-api-findings.json`.

## Repository validation

Python uses the locked uv environment and reviewed source at
`.hermes-source`, detached at `bf0203a794a07aac3ff764972ab9087baa4e4f4e`.
Node 26.12.1 was used locally; tooling supports the Node engine documented in the
admission assessment.

- `uv sync --locked`: passed; runtime metadata and root `uv.lock` synchronized.
- `uv run ruff format .`, `uv run ruff check --fix .`, non-modifying checks and
  `uv run ty check`: passed.
- `npx vp lint`, `npx vp fmt`, `npx vp fmt --check`: passed using local Vite+.
- Final locked reinstall with `npm ci`, then `npm test`: **1,465 tests in 47
  files passed**, no skips.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **263 passed**.
- Full Python suite: **691 passed, 22 subtests passed**.
- `npm run build` and explicit `npm run test:env:build`: passed. Docker's classic
  builder was used because its Buildx CLI plugin is absent. Builds refreshed the
  latest official base explicitly; test runners did not rebuild implicitly.
- `git diff --check`: passed. Tracked generated assets are restored after image
  creation; ignored generated files are not staged or committed.

The Python suite emits 24 upstream `re.split` positional-`maxsplit` deprecation
warnings at `hermes_cli/plugins_manifest.py:456`. No first-party quality
suppression was added for those warnings.

## Dependency advisories

Before changes, `npm audit --json` reported 13 affected entries: three high and
ten moderate. Upgraded runtime Markdown 15.0.2 → 15.0.3, Vite+/Vite alias 1.1.0 →
1.5.0, compatible transitive dependencies including source-map-js 1.2.2 and
undici 8.12.4, and scoped test-tool Glob/Minimatch overrides. Updated
`package-lock.json`. Post-change and post-`npm ci` npm audits report **zero**.

Python `pip-audit` initially found pytest 9.0.2's
[temporary-directory advisory](https://github.com/advisories/GHSA-6w46-j5rx-g56g),
reported twice with the same PYSEC identifier. `uv add --dev 'pytest==9.0.3'`
updated both root metadata and lock. Exported the full locked development set
(excluding the local metadata-only package) and ran:

```sh
uv export --locked --no-hashes --no-emit-project \
  --no-emit-package chathermes-dashboard-dependencies \
  -o /tmp/ch238-python-requirements.txt
uv tool run pip-audit --disable-pip --no-deps \
  -r /tmp/ch238-python-requirements.txt --format json
```

Result: **no known vulnerabilities** in that repository dependency set. All
versions are exact; the auditor warns that hashes are preferable. The audit tool
is uv-isolated and did not add development/runtime requirements. Runtime plugin
Python dependency pins stay unchanged; neither audit certifies Hermes's separate
core constraints or undisclosed vulnerabilities. Installed-image audit is
recorded below separately.

## Mounted desktop/mobile environment

Compose project `chathermes-238-main`, dashboard port **20238**, MockServer
**18239**, private daemon interface `172.25.0.2` reached as `docker`.
An ignored override `tmp/compose.catalog.yml` assigns unused subnet
`10.238.239.0/24`; other environments were untouched. No provider credentials or
personal Hermes state were used. The existing synthetic test login and
REST-loaded stock MockServer fixtures supply inference. Browser override:
`/opt/hermes/tools/chromium-1208/chrome-linux64/chrome`.

Environment used for each build/apply/workflow command:

```sh
export COMPOSE_PROJECT_NAME=chathermes-238-main
export CHATHERMES_COMPOSE_OVERRIDE=tmp/compose.catalog.yml
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=20238
export CHATHERMES_MOCKSERVER_PORT=18239
export CHATHERMES_DASHBOARD_URL_HOST=docker
export CHATHERMES_CHROMIUM=/opt/hermes/tools/chromium-1208/chrome-linux64/chrome
npm run test:env:build
docker compose --project-directory . -f tests/docker/compose.yml \
  -f tmp/compose.catalog.yml up -d --wait --no-build
npm run test:integration -- tests/workflows/catalog-security.spec.ts \
  tests/workflows/messaging.spec.ts tests/workflows/navigation.spec.ts \
  tests/workflows/scheduled-result.spec.ts tests/workflows/media-links.spec.ts \
  tests/workflows/transcript.spec.ts \
  --grep 'catalog security|streaming renders|real tool activity|resumed model|Stop settles|clarification|reasoning and tools|file and camera|scheduled result|saved Cron documents|MEDIA links|mid-flight resume'
```

Results and visual inspection are recorded below after completion. Screenshots
remain ignored local evidence, not distributable UI assets. Mobile is Chromium's
iPhone viewport, not Android/iOS hardware. Camera input uses a fixture; no real
push-service delivery, notification-tray receipt, or vendor provider was tested.
Containers/state are retained, including the isolated validator. No cleanup or
reset of another project's resources occurred.

## Final results

Final `PYTHONPATH=.hermes-source:plugin uv run pytest -q`: **691 passed, 22
subtests passed**, with the 24 upstream deprecation warnings described above.
The API slice remains **263 passed**. The final push cleanup review also passed
its focused push/Cron slice (**121 tests**) before the full final run.

The broad mounted command above passed **24/24** tests across desktop and mobile
in 3.3 minutes on image `5663b703cf43`. It checked progressive response/reload,
actual model/reasoning selection reaching inference, tool ordering,
clarification, cancellation, attachment/camera authenticated uploads, MEDIA
preview/download, disclosure activity and scroll anchoring, current Scheduled
result extraction/profile rejection, and interrupted native resume without
resubmission. The new security workflow used real alpha/beta hosted routing,
rejected unauthenticated requests and foreign-session reads, and retained the
public VAPID key across reload/profile changes.

After the final close-before-unlink refinement, explicitly rebuilt and applied
image `143af91a0bfa` with Compose (same project/state), then reran catalog security
and attachment/focus workflows on desktop/mobile: **4/4 passed in 38.4 seconds**. This reuses the same signing identity across a process/image restart;
it does not simulate push-service receipt.

Inspected desktop/mobile streaming, expanded active tool and attachment
screenshots. Text wraps readably, the composer stays within the viewport, the
attachment chip is visible, and expanded tool content remains readable. Workflow
assertions additionally cover focus, draft retention, native selects, active and
completed disclosures, response ordering and scroll anchoring. Broad screenshots
are retained under ignored `tests/integration-output/issue-238/broad-workflows/`;
the final four-workflow screenshots use `tests/visual-output/`. These are local
paths and may be unavailable in a future checkout.

## Remaining installed-image advisory

Also audited all installed distribution **names and versions** exported with
`importlib.metadata` from the isolated Hermes dashboard interpreter. No credential
or environment dump was used. Excluded local metadata distributions
`hermes-agent` and `chathermes-dashboard-dependencies`, then ran the same
uv-isolated `pip-audit --disable-pip --no-deps -r ... --format json` against that
exact list. The final image has the identical distribution list.

One finding remains: **oauthlib 4.0.0**, **CVE-2026-49272 /
GHSA-3jp2-3mrg-2vxc**, fixed in **4.0.1**. The
[upstream advisory](https://github.com/oauthlib/oauthlib/security/advisories/GHSA-3jp2-3mrg-2vxc)
concerns server-side device-code token validation. Hermes's official image lock
and inspected current-main `uv.lock` both still select 4.0.0. ChatHermes does not
depend on OAuthlib or implement a device-token server. Host exploitability was
not established. Remediation belongs in the upstream Hermes dependency
lock/image refresh; this plugin does not override the host dependency lock.
Repository npm/Python locks have zero reported advisories; the whole installed
image therefore must not be called advisory-free.

Local audit outputs: `/tmp/ch238-npm-audit-locked.json`,
`/tmp/ch238-python-audit-final.json`, `/tmp/ch238-installed-audit.json`.
No OS-package or base-image binary vulnerability audit was performed.

Final checks confirmed an empty staging area, no workflow/source-frontend changes,
and no tracked dist diff. Relative documentation targets passed after excluding
the API guide's literal `MEDIA:` URI example from filesystem-link checks.

One full-suite tool session reported process status 143 after printing the complete
691-test passing summary. Repeated the full command with explicit exit-status
capture: **691 passed, 22 subtests passed, exit status 0**, in 62.73 seconds.
`/tmp/ch238-pytest-exit-verified.log` records the summary and exit status. This is
the final full-suite result used here.

## Independent review follow-up

Reproduced four shared-store races with synchronized competing processes: first
VAPID configuration returned competing identities, concurrent subscription writes
lost a profile's subscription, and both deletion paths could restore another
host's removed subscription. The pre-fix regression run also reproduced five
Cron text failures, including `[Report] All jobs passed` and Markdown links.
Local reproduction output: `/tmp/ch238-review-reproduction.log`.

Added a private, stable `.lock` sidecar using POSIX `flock` around the complete
read/modify/write transaction. The lock survives atomic JSON replacement and is
never unlinked on release. Every public store operation and the sender's private
key read use it; the existing local thread lock remains. This preserves the JSON
schema, existing signing keys, subscription IDs, profile boundaries and unknown
metadata. Tests cover two fresh spawned interpreters, separate module instances
in threads, all mutation paths, lock permissions/stability and exception release.
An importable test worker avoids forking a threaded pytest process.

Cron now treats names/results as text, replaces literal scoped gateway
credentials, then applies the public forced redactor. It retains bracketed text,
Markdown, JSON-looking content and Unicode. The HTTP JSON scrubber and its
escaped/malformed-response security contracts remain unchanged.

Corrected the maintained Node compatibility range to
`^22.22.2 || ^24.15.0 || >=26.0.0`, imposed by locked jsdom 30.1.3 and
@asamuzakjp/css-color 7.2.0. Checked the documented range against all 164 locked
Node engine declarations across 2,015 version probes, including boundary versions.
Node 26.12.1 ran the checks below; other Node versions were not executed.

Final validation for this follow-up:

- `uv sync --locked`, Ruff format/check/fix and `uv run ty check`: passed.
- `npx vp lint`, `npx vp fmt`, `npx vp fmt --check`: passed.
- `npm test`: **1,465 passed in 47 files**.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **263 passed**.
- `PYTHONPATH=.hermes-source:plugin uv run pytest -q`: **706 passed, 22 subtests
  passed**, exit zero, with only the existing 24 upstream manifest warnings.
- `npm run build` via explicit `npm run test:env:build`: passed. Built and applied
  image `ce85be42c402` only in the existing `chathermes-238-main` Compose project,
  retaining its state and the ports/subnet documented above.
- Mounted desktop/mobile security, streaming, runtime model/reasoning, active and
  completed disclosures, authenticated file/camera upload and Scheduled result
  workflows: **14/14 passed**. Inspected current desktop/mobile streaming,
  attachment and expanded-tool screenshots under ignored `tests/visual-output/`.
  Composers remain visible and usable; text wraps, tool content and attachment
  chips remain readable. Assertions cover focus, native selects, scrolling,
  response ordering, profile rejection and durable public-only push identity.

Logs: `/tmp/ch238-review-python-spawn.log`, `/tmp/ch238-review-node.log`,
`/tmp/ch238-review-api.log`, `/tmp/ch238-review-build.log` and
`/tmp/ch238-review-workflows.log`. Mobile coverage uses Chromium's iPhone viewport;
physical devices and real push-provider receipt were not tested. Containers/state
remain available. Restored tracked generated assets after the image build;
no generated dist diff or staged files remain. No commits, pushes, deployment or
changes to other worktrees were made.

## P1 escaped Cron credential follow-up

Reproduced the independent review case through `standalone_send`: with the
synthetic key `opaque-gateway-key`, an unmatched prose quote before
`"\u006fpaque-gateway-key"` evaded the old paired-string scan in notification
titles and bodies. The expanded regression failed before the fix.

The sender now scans JSON escapes independently of surrounding quote pairing,
records their original source spans, and replaces literal/decoded credential
matches in the original text. It decodes Unicode surrogate pairs and merges
overlapping matches. Unrelated Markdown, Unicode prose, quotes, backslashes and
escape spellings remain unchanged. Unexpected scrubber errors stop delivery
with the existing fixed error; forced public Hermes redaction still follows.

The regression matrix covers both script output and final assistant messages,
plain/quoted/backslash/Unicode credentials, alternate Unicode escapes, unmatched
prose quotes and escaped quote/backslash prefixes. It checks both push fields,
preserved non-secret text and no push on scrubber failure. Focused Cron and real
profile-credential tests passed: **77 passed**, with 24 existing upstream manifest
deprecation warnings. API tests: **263 passed**. Frontend: **1,465 passed across
47 files**. Full Python suite: **738 passed, 22 subtests passed**, with the same
24 upstream warnings. `uv sync --locked`, Ruff format/check/fix, ty, `vp lint`, `vp fmt`,
format checks and `npm run build` passed.

Build output was restored explicitly from this worktree's `HEAD` base
(`270b9cea25`), and its extra ignored generated bundle was removed. No tracked
dist diff or extra ignored dist files remain. The original checkout and other
worktrees were untouched. No staging, commit, push or deployment occurred.
This backend-only follow-up did not rerun mounted visual workflows; their
earlier evidence above is unchanged. Logs for this pass use
`/tmp/ch238-cron-p1-{python,node,api,build}.log`.
