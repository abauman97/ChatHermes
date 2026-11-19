# Reference definition provenance follow-up — 2026-11-18

Preserved the existing attachment-context worktree changes. No upstream edits,
other worktree changes, credentials, deployment, staging, commits or pushes.

The final review found that excluding a link's source line was insufficient:
Markdown's global reference table still accepted definitions from untrusted
wrappers, blockquotes and lists. Those definitions could authorize a visible
link in another assistant message, across a tool event, and the actual Library
worker attributed the promoted file to the link message.

## Regression evidence and fix

Before the production fix, the frontend regression run failed three cases
(`tmp/reference-red-frontend.log`), and the actual Python `Service.worker`
regression failed six cases with two legitimate cases passing
(`tmp/reference-red-python.log`). The worker uses real extraction, queue handling,
SQLite replacement and profile-scoped Library reads with a deterministic history
source. It is not a mocked extractor or a browser-only reproduction. Both
reference orders, untrusted/blockquote/list provenance and legitimate link-message
ownership are covered. The red worker run used an older v2 checkpoint to force
history processing; the final regression seeds the exact compact v3 checkpoint
and stale promoted records to verify the version upgrade too.

Both classifiers now build a fresh Markdown reference environment after trust
classification on the complete original source. Excluded source lines are masked
with spaces, retaining newlines and offsets; memory/context exclusions remain in
force. Frontend discarded suffixes cannot supply definitions. Original tokens
still govern trust and quotation, including closing delimiters outside the
retained presentation slice. Eligible authored references preserve Markdown
resolution; excluded earlier definitions cannot shadow a legitimate destination.
The Library checkpoint advances to `reference-provenance-v4` to reconcile stale
metadata without changing native file authorization.

Frontend pure-parser tests cover both orders, block slices, explicit file intent,
placement and legitimate references. Mounted component tests cover tool-separated
blocks in both orders. The actual worker checks stale record replacement in two
profiles, session ownership, generated direction and the exact link message ID
for legitimate references. The existing real-Hermes memory boundary workflow now
also seeds link → tool → untrusted definition and excluded definitions → tool →
links, checking cards and the authenticated Library on desktop and mobile.

## Local validation

| Check                                                                  | Result                                                                                         |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `uv sync --locked`                                                     | Passed; no dependency changes                                                                  |
| `npm test`                                                             | 57 files, 1,848 passed; `tmp/reference-tests.log`                                              |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                       | 694 passed; `tmp/reference-python.log`                                                         |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                    | 182 passed; `tmp/reference-api.log`                                                            |
| `vp fmt`, `vp lint`, `vp fmt --check`                                  | Passed; `tmp/reference-fmt-final.log`, `tmp/reference-lint.log`, `tmp/reference-fmt-check.log` |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check` | Passed; `tmp/reference-ruff-format.log`, `tmp/reference-ruff.log`, `tmp/reference-ty.log`      |
| `npm run build` via `npm run test:env:build`                           | Passed; `tmp/reference-env-build.log`                                                          |

## Mounted validation

Used only the existing deterministic project
`chathermes-attachment-context-20261118`, ports 24719/24780 and its existing
`tmp/attachment-compose.yml` subnet override. Explicitly rebuilt and applied the
fixture image without resetting volumes. Restarted the existing private relay
script when fixture readiness showed its localhost listeners were absent; the
normal observable readiness retry then succeeded. No cleanup or reset occurred.

The integration runner verified Hermes revision
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` and image
`sha256:6ae47563a0b66a7185a5809e7e4999ec6921ab31e16dfbca50862cb5e0d39ec6`.

The memory/attachment run passed **16/16** (eight desktop, eight mobile; 3.5
minutes), `tmp/reference-integration.log`. Captures are under
`tests/visual-output/reference-provenance/`. The exact per-session authenticated
Library query contained only the retained upload, and the mounted Library showed
it. Neither reference order produced extra cards; both resume and reload DOM
checks passed. Existing workflows also verified original download bytes,
wrong-profile rejection, Home/in-flight focus, selects, input sizes, scrolling,
disclosures and the prior memory/context boundary cases.

Inspected desktop and mobile boundary resume, reload and Library captures, plus
PDF resumed captures at both sizes. Resume captures show the retained upload,
visible answer, completed tools and unresolved excluded references; Library
captures show the retained upload without promoted files. Both boundary reload
captures remain largely unpainted, continuing the previously documented capture
limitation. Passing DOM checks do not establish painted geometry at that instant.

This uses Chromium desktop/mobile viewports and deterministic inference, not
native devices, Electron or real providers. Memory filtering remains a
presentation/eligibility rule; raw history/model context is preserved. No claim
of authenticated producer provenance is added.

Tracked dist files were restored from their exact pre-build contents after image
construction. Ignored build output, fixture containers, volumes and synthetic
failure evidence remain available. The upstream source checkout remains clean;
no staged or generated dist changes remain. Final `git diff --check` passed.

The additional automatic/inline delivery run was **3 passed / 1 failed**,
`tmp/reference-legitimate-integration.log`. Both automatic-delivery cases and
mobile inline placement passed. Desktop inline placement missed the transient
single-card state: the assertion observed zero cards, then two through nine,
and timed out waiting for exactly one at line 67. Its failure screenshot and
context are retained under `tests/visual-output/reference-legitimate-delivery/`.
A targeted desktop rerun, with no production or test changes, passed **1/1** in
17.9 seconds (`tmp/reference-inline-recheck.log`). This is consistent with a
sampling race; the initial failure is not claimed as a clean pass. All 20 distinct
browser cases have a passing run. No unrelated workflow assertion was weakened.
Inspected the failed desktop capture and passing desktop/mobile reloaded
Markdown-structure captures; the latter retain reference text and inline file
positions. Capture roots are `tests/visual-output/reference-legitimate-delivery/`
and `tests/visual-output/reference-inline-desktop-recheck/`.
