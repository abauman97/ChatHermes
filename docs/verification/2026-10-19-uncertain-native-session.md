Investigated and changed only `/opt/data/profiles/developer/cache/scratch/chathermes-uncertain-session`,
branch `fix/uncertain-native-session`. Initial worktree was clean; HEAD and
`origin/main` both resolved to `3f9a6bd1b782951acd5199b9ea0144882d12e1e0`.
No deployment, commit, staging, push, personal state access, or original-checkout
access was performed.

The verified defect is a circular recovery gate: retained display input can set
the browser busy after an idle native snapshot, while explicit uncertainty
resolution refuses to check native state whenever that browser flag is set.
This reproduces a session staying locked after history refresh and reconstruction.
It does not prove why the reported live submission became uncertain.

The source path, using final-worktree line numbers:

1. `src/features/chat/runtime/native-session.ts:427` gates sending. Before dispatch,
   `submit()` creates the profile/session/attempt marker and optimistic message.
   `native-admission.ts:16` writes only an `unknown` receipt marker to localStorage;
   prompt content is not journaled there. Acceptance or known rejection clears
   that attempt; ambiguous errors leave it locked (`native-session.ts:446`).
2. `plugin/chathermes/dashboard/native_channel.py:152` calls `Owner.begin()`
   before `prompt.submit`. `native_owners.py:205` records and publishes a
   `chat.input` display boundary. It is not an admission receipt. A dispatch error
   is conservatively classified unknown, with no guaranteed terminal event.
   `tests/plugin_api.test.py:981` verifies idle native state followed by retained
   input and a failed dispatch, for both 409 and 503 errors.
3. `native-chat.ts:272` preserves the server's explicit rejected/unknown outcome;
   transport loss or timeout cannot establish non-admission. Its request timeout
   is 95 seconds. A visible lost connection gets one reconstruction attempt in
   `native-session.ts:370`; recovery does not resubmit the prompt.
4. Attachment uses the stored session ID and profile-bound retained owner.
   `native_owners.py:163` resumes native state and supplies its retained recovery
   boundary. `native-chat.ts:197` delivers snapshot, retained replay, then buffered
   live frames. `native-session.ts:123` initially reads running/queued from the
   snapshot, but `input()` at line 99 sets busy again when the retained display
   input is replayed. An unterminated retained `message.start` can likewise leave
   the projection busy. Neither is current native activity proof.
5. `useChatController.ts:232` routes Refresh history to `App.vue:434`, which calls
   `native.hydrate()`. Its busy-live branch (`native-session.ts:190`) preserves
   the display without recomputing activity or clearing uncertainty. Hard reload
   restores the localStorage marker (`native-session.ts:253`) and reconstructs
   the same retained input. Before this fix, `resolveUncertainty()` immediately
   returned on `busy`, so it could never escape this state even with idle Hermes.
6. `useChatController.ts:68` gates sending on busy OR uncertainty. The composer
   remains independently focusable. History coverage/receipt checks remain in
   `native-session.ts:197`, and `chat.reconciled` still checks native activity,
   delegation and retained boundary before retiring raw frames.

The first change was a focused regression in `native-session.test.ts`, before
any production-code change. It models a failed acknowledgement with no terminal
event and idle native state, both with the original projection and after close /
reattachment plus retained-input delivery. Refresh history does not recover it;
explicit resolution must clear the sending lock while preserving user content.
The final version also asserts attachment-preview preservation. Additional cases
cover pending acknowledgement, native running/queued/delegating work, absent
running state, unavailable state/history, selection changes during either read,
arriving activity, and exactly one original `chat.submit` call.

The fix is in `native-session.ts:474` and `native_channel.py:70`. Explicit
resolution reads `chat.state`, an empty-params operation bound to the already
attached profile/runtime under the retained owner's lock. It uses the existing
native `session.activate` with `omit_messages: true` and returns only running,
queued and delegating flags. It neither resumes a different runtime nor retires
the retained spool. Successful idle verification allows hydration to preserve
uncovered prompt/attachment display; only then does explicit resolution clear
the uncertainty marker and stale error. Pending admission, selection changes,
new retained offsets, native activity and failed checks keep the lock. No
automatic submission retry or transcript deletion was added. The operation is
advertised in `chat_gateway.py:18` and documented in `docs/api-contract.md:40`.
The five-case API regression at `tests/plugin_api.test.py:948` checks profile
binding, invalid params, prior attachment, delegation and response minimization.

Reviewed the official Hermes source archive pinned by the plugin at
`ac28abc96ce83f22f6b831f80d9007e2aba81f21`, downloaded under this worktree's ignored
`tmp/uncertain-native-session/`. Archive SHA-256:
`d8ec25f838431dd1bbe6bd679be3c9023d3c3dc602146605b0b67c8887196ceb`.
`tui_gateway/methods_session.py:1160` and `server.py:3150` confirm the native
activation and running/queued snapshot contract. `methods_session.py:898` also
confirms explicit cold-resume running state. The contract probes confirm no
durable idempotent admission receipt and no atomic snapshot/replay watermark.

Commands and exact result excerpts (all successful commands exited 0):

```text
Before production changes:
vp test run src/features/chat/runtime/native-session.test.ts -t 'explicitly resolves an idle'
AssertionError: expected true to be false // Object.is equality
 Test Files  1 failed (1)
      Tests  2 failed | 21 skipped (23)
Exit code: 1

Final focused run:
vp test run src/features/chat/runtime/native-session.test.ts src/features/chat/runtime/native-reconnect.test.ts src/features/chat/runtime/native-chat.test.ts
 Test Files  3 passed (3)
      Tests  61 passed (61)
   Duration  4.16s

npm test
 Test Files  32 passed (32)
      Tests  698 passed (698)
   Duration  33.54s

npm run test:api
collected 120 items
============================= 120 passed in 2.53s ==============================

python -m pytest tests/integration/native_contract.test.py -k 'pin_has_no_atomic or snapshot_has_no_sequence or replay_objects'
======================= 3 passed, 7 deselected in 1.92s ========================

npm run build
vue-tsc -b && node scripts/build-plugin.mjs
✓ 140 modules transformed.
✓ built in 881ms
✓ 2 modules transformed.
✓ built in 8ms

vp lint
Exit code: 0 (no stdout/stderr)

vp fmt src/features/chat/runtime/native-session.ts src/features/chat/runtime/native-session.test.ts docs/api-contract.md
Finished in 253ms on 3 files using 2 threads.

vp fmt --check src/features/chat/runtime/native-session.ts src/features/chat/runtime/native-session.test.ts docs/api-contract.md
All matched files use the correct format.
Finished in 249ms on 3 files using 2 threads.

git diff --check
Exit code: 0
```

Python commands used the activated worktree `.venv`, installed with
`pip install -e 'plugin/chathermes[dev]'`, and the downloaded pinned Hermes source
plus `plugin` on `PYTHONPATH` for the final API run and contract probes. Full
command logs are in ignored `tmp/uncertain-native-session/`. The base already
tracks generated dist files despite its ignore rule; generated tracked changes
were restored after validation. No generated assets are included in the diff.

Actual mobile/desktop dashboard visual verification could not run. `npm run live`
completed its build and then exited 2 with:

```text
tests/docker/run.sh: 28: TEST_LLM_API_BASE_URL: Set TEST_LLM_API_BASE_URL reachable from inside Docker
```

This clean worktree has no configured real-provider environment. No credentials
were copied from another checkout, and the launcher failed before creating or
removing any container or volume. Focus, scrolling, attachment/select interaction
and disclosure transitions were therefore not visually verified. Nothing was
committed.

No live-session logs, native state, stored history, browser storage, installed
plugin checksums, or runtime version were inspected. The initial error may
represent an accepted turn with a lost acknowledgement, a failed dispatch, or
another transport/runtime failure. The verified local deadlock explains how an
idle session can stay locked; it does not establish that the reported session is
idle, that the original prompt executed, or that any response was persisted.
Explicit resolution is permission to continue after inspecting state/history,
not proof of non-admission or permission to replay the original prompt blindly.
Backend restart and loss of retained unpersisted frames remain existing recovery
limits; this patch adds no durable prompt journal or exactly-once guarantee.
