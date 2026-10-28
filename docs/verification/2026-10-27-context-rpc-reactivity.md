# Context RPC results and Vue composer reactivity

> Historical record copied from the original dirty worktree. Results and artifact paths below describe that earlier session, not verification of this branch. The current port and its checks are recorded in `../../tmp/session-followups/verification.md` (local, ignored). PR #187 already includes the context runtime, reactive bindings, and segmented breakdown. The current port retains only distinct follow-up behavior and adapts tests to the current native gateway. Desktop controls remain visible during editing; mobile controls hide.

Validated on branch `fix/global-plugin-profiles-session-connection`, preserving the supplied dirty checkout. No commit, push, or deployment was performed.

The supplied successful `session.usage` (`c-5`) payload contains model `qwen3.8:27b`, `context_used: 14584`, `context_max: 131072`, `context_percent: 11`, and `calls: 1`. The supplied `session.context_breakdown` (`c-6`) response has nonempty categories.

The response path is `JsonRpcRequestChannel.handleFrame` → `call.resolve(frame.result)` → `NativeViewer.rpc` → `usage` / `contextBreakdown` → `useNativeSession.refreshContext` → the controller scope refs → `ChatInterface` → `ChatComposer`. The channel returns the result directly; no extra result envelope is needed. Session assignments already check the active viewer and generation.

The focused regression uses the real viewer and RPC channel over a synthetic WebSocket, mounts the real interface/composer through the controller/provider, and clicks the context meter. Before the fix, both scope refs contain the expected data, but the rendered meter says “Context usage unavailable.” This distinguishes the observed unavailable UI from an actual null session ref. The plain nested `scope` object passes Ref wrappers as composer props; Vue does not unwrap those nested properties. Destructuring the two refs into top-level setup bindings fixes the rendering. No channel or session-state behavior was changed.

The regression passes after the fix and also checks that a late breakdown from an old profile/session cannot fill a new scope. A dedicated live browser regression is included in the default Playwright selection. It uses the real authenticated dashboard, session creation, attach, and recovery, with controlled usage/breakdown responses matching the supplied usage evidence and a synthetic category.

Validation:

- Red reproduction saved in `tmp/context-rpc-validation/red.log`; passing focused test in `focused-final.log` (5 tests).
- `npm test`: 32 files, 686 tests passed (`test.log`).
- `npm run test:api`: 143 tests passed (`api.log`).
- `npm run build`: passed with `CHATHERMES_BUILD_OUT_DIR` set outside the pre-existing tracked dashboard bundles (`build.log`). The live launcher also built successfully into ignored `dist/context-rpc-validation`.
- `vp lint`: passed (`lint-final.log`). `vp fmt` was run on changed source/test files, and formatting checks passed for all files changed by this task. Repository-wide `vp fmt --check` reports existing formatting issues in the untouched dirty `native-chat.ts` and `native-session.ts`; these were preserved (`fmt-all.log`).
- `git diff --check`: passed. All unrelated pre-existing file diffs, including tracked dashboard dist assets, were compared with the initial binary diff and remain unchanged. The existing untracked `tests/visual/fixed-shell.spec.ts` was not modified.
- Disposable live fixture launched with `npm run live`, `tests/docker/Dockerfile`, and a unique instance on port 9131. Chromium ran against the printed Docker-host URL. Targeted desktop and mobile context tests both passed (`visual-final.log`). Both screenshots were visually inspected: correct model, totals, percent, category, retained draft, and panel within the viewport. Composer focus after closing also passed.

Artifacts are local and ignored under `tmp/context-rpc-validation/`. Context screenshots are under `visual-targeted/`, in the desktop and mobile test directories. Initial setup attempts failed because Docker excludes `tmp/` build output and because the remote Docker port is reachable through the printed host rather than localhost; retries used the correct output directory and URL. An initial draft assertion ran before session reconstruction was ready; the live test now waits for the meter and model control before typing. Early simultaneous Playwright runs shared an artifact directory and produced trace-file errors; final runs use separate output directories.

The final broader live run passed four tests: bounded shell/scrolling and composer/attachments/real native response, each on desktop and mobile. These exercise profile/model controls, camera/file attachment handling, focus while in flight, and real provider output. Desktop and mobile attachment/response screenshots, the desktop picker screenshot, and the failed desktop disclosure screenshot were inspected. The two chronological disclosure tests failed on both sizes: the first active tool `<details>` lacked the expected `open` attribute. Disclosure behavior is outside this context-prop fix and remains unresolved. Full results are in `visual-broad-final.log`, with screenshots and traces under `visual-broad-final/`; this is not a fully green visual suite.

`CHATHERMES_INSTANCE=context-rpc-verification npm run live:stop` succeeded, removing only this launcher's owned container and anonymous volume. The unrelated container present before testing was left running. Temporary generated bundles were removed after validation; the initial tracked dashboard asset changes remain exactly as supplied. No credentials or runtime session state were saved in source changes.
