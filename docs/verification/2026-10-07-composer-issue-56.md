# Issue 56 composer verification

Worktree: `/opt/data/profiles/developer/cache/scratch/chathermes-issue-56`.
Branch: `codex/issue-56-composer-improvements`. Freshly fetched `origin/main`
and HEAD both resolve to `2b66a2e7b0cdf95d163e01331ce73474322a42ee`.
No commit, push, PR, or deployment.

The mobile composer hides the model picker while editing and places the
textarea between attach and send. It grows upward to eight lines, then scrolls,
and resizes on draft changes and width changes. Enter and Shift+Enter retain
native textarea newline behavior, including composition. The send button uses
one click path, preserving the existing form submission contract without a
second browser submit from the button. Stop and guidance remain available.
Bottom spacing adds `env(safe-area-inset-bottom, 0px)` to the normal margin.

Availability is derived from current text, attachments and runtime gates. An
aborted FileReader previously left its promise pending and `reading` true,
blocking sending; abort now rejects and the existing finally releases the gate.
Unit regressions cover abort recovery, clearing temporary loading/run gates,
newlines, single button emission, growth, scrolling and shrink after send.

| Check                                                  | Result                                           |
| ------------------------------------------------------ | ------------------------------------------------ |
| `npm test`                                             | 182 passed in 18 files                           |
| `npm run test:api`                                     | 100 passed                                       |
| `npm run build`                                        | Passed; committed plugin dist assets regenerated |
| Desktop/mobile composer and dashboard Playwright tests | 4 passed                                         |
| `git diff --check`                                     | Passed                                           |

API tests used a worktree-local `.venv` with pytest, FastAPI, httpx,
python-multipart and Web Push dependencies. The initial system Python lacked
pytest; an existing test environment lacked Web Push. Both setup limitations
were resolved before the passing API run.

Actual dashboard visual testing used the repository `npm run live` launcher,
Docker at `tcp://172.25.0.2:2375`, unique instance `issue56-2b66a2e7`, port
19156, synthetic sign-in and fixture provider. Docker's default address pools
were exhausted, so only this instance's two networks were created with explicit
unused subnets `10.156.56.0/24` (internal) and `10.156.57.0/24` (browser).
The final rebuilt dist was copied into this isolated fixture before the final
browser run. Existing containers were not stopped or reconfigured.

Inspected desktop and mobile screenshots include focused input, eight visible
rows with scrolling, shortened mobile viewport, and completed tool disclosure.
Browser assertions also verify upward growth at a fixed bottom edge, picker
restoration, attachment add/remove, profile/model selection, native input focus,
in-flight drafts, button recovery and active/completed disclosure transitions.
An initial browser attempt preceded fixture readiness; the next run found only
a fractional-pixel rounding mismatch in the new height assertion. The final
four-test run passed after accommodating integer clientHeight rounding.

Screenshots are in ignored `tests/visual-output/`; logs are ignored
`tests/*issue56*.log`. The final visual log is `tests/visual-issue56-final.log`.
Testing uses Chromium with emulated iPhone dimensions and a shortened viewport;
it does not validate a physical iOS keyboard, nonzero device safe-area insets,
hardware camera capture, or real-provider responses.

Cleanup uses `npm run live:stop` for this instance only. Its disposable named
`chathermes-issue56-2b66a2e7-hermes-data` volume is preserved.
