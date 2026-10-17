# Frontend architecture

ChatHermes mounts Vue through the Hermes React dashboard plugin SDK. `main.ts`
creates an app per mount; `plugin-entry.ts` owns host integration and viewport
restoration. Each app installs a fresh Vue Router 4 instance. There is no standalone application or global store.

## Mobile shell and keyboard behavior

The shell follows SWOL's bounded flex layout: a `100dvh` frame with the header
and empty safe-area footer outside scrolling content. The footer owns all bottom
spacing (12px/mobile or 24px/desktop plus the safe-area inset); the composer has
zero bottom margin. Its height is shared through `--app-footer-height`.

On browsers supporting the VirtualKeyboard API, the plugin opts into
`navigator.virtualKeyboard.overlaysContent = true` while mounted. The keyboard
covers the shell without shrinking it, so the header and footer retain their
coordinates. CSS reads `env(keyboard-inset-height, 0px)` and reserves the keyboard's
overlap inside `ChatInterface`, subtracting the space already owned by the footer.
Only the content area shrinks and the composer rises to meet the keyboard.
Dismissal restores the dock above the footer, even when input focus remains.
There are no keyboard resize/geometry listeners, measured keyboard heights, or
Vue keyboard state. The only JavaScript is the browser's overlay opt-in and its
restoration on unmount, alongside restoration of the host viewport meta tag.
See [Chrome's VirtualKeyboard documentation](https://developer.chrome.com/docs/web-platform/virtual-keyboard).

The viewport meta tag uses `interactive-widget=resizes-visual`, matching SWOL's
default behavior, instead of explicitly shrinking the entire shell with
`resizes-content`. Browsers without the VirtualKeyboard API and CSS keyboard
insets retain native keyboard overlay/panning behavior; independent composer
lifting is not guaranteed there. Android verification does not establish iOS
Safari support. `vh` is not a snapshot of the loaded viewport; changing viewport
units alone cannot separate shell geometry from keyboard geometry.

Short touch screens use the compact focused composer even in landscape. CSS caps
the textarea at eight rows or the space above the keyboard, whichever is smaller;
native textarea overflow keeps longer drafts scrollable.

Desktop/mobile Playwright checks exercise synthetic inset values. The separate
`tests/docker/android-keyboard.mjs` check opens the actual Android software
keyboard inside the installed dashboard plugin and verifies stationary header and
footer geometry, composer growth, dismissal while focused, reopening, and rotation.

## Where code belongs

| Location                             | Ownership                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/App.vue`                        | Shell coordinator: profiles, sessions, projects, URL/history, asynchronous scope generations, host/push lifecycle, navigation and page selection |
| `src/features/chat/components/`      | Persistent live interface, composer, interactive request forms, user and assistant rendering                                                     |
| `src/features/chat/composables/`     | Live chat projections, submission/upload orchestration, runtime actions, composer gates                                                          |
| `src/features/chat/runtime/`         | Single native session owner, viewer, admission/recovery, assistant-turn reducer and reconciliation                                               |
| `src/features/chat/types/`, `utils/` | Render entry union, pure transcript grouping, validated request adapter and user attachment display                                              |
| `src/features/sessions/`             | Session navigation presentation; scope transitions remain in App                                                                                 |
| `src/features/projects/`             | Project pages, editors, instructions and project helpers                                                                                         |
| `src/features/scheduled/`            | Saved run output and discussion entry; no live viewer ownership                                                                                  |
| `src/features/notifications/`        | Existing authenticated push subscription and mounted-session publication                                                                         |
| `src/features/settings/`             | Settings presentation                                                                                                                            |
| `src/components/`                    | Explicit-prop transcript and disclosure components, also used for saved output                                                                   |
| `src/services/`                      | Cross-feature authenticated API client and native capability gate                                                                                |
| `src/types/`                         | Shared Hermes domain types                                                                                                                       |
| `src/utils/`                         | Framework-independent Markdown rendering                                                                                                         |
| `src/assets/styles/`                 | Shared stylesheet and existing DOM/CSS contracts                                                                                                 |
| `src/vendor/hermes/`                 | Pinned gateway contract and transport primitives; do not edit generated contracts                                                                |

Do not create empty stores, views, artifacts, or shared composables
folders. Attachments currently belong to chat; scheduled output is a real feature.
Keep tests beside the code they exercise. App integration tests stay beside App.

## Dependencies and state

Use direct relative imports. Features may import shared services, types and
utilities. Scheduled output may use the explicit-prop transcript. Pure rendering
never injects live chat state or calls the runtime. Avoid shared modules importing
feature coordinators and avoid barrels that obscure ownership.

App constructs `useNativeSession` exactly once and passes it to
`useChatController` with reactive scope inputs and guarded shell callbacks. App
retains creation, selection, cancellation and generation checks together.
`context.ts` provides one typed live context per app instance, with readonly view
refs and model setter commands. It exposes no viewer or mutable runtime error.
Only `ChatInterface` and `LiveRequest` consume it. Arrays retain their reactive
identity; do not copy streamed data into snapshots or use module-global UI state.

`ChatInterface` renders shell pages through its page slot above the unconditional
composer. The composer key is `[profile, session]`, never busy/loading/page state.
Drafts, attachment reads, editing, sizing and focus remain composer-local; gate
sending independently of editing. Keep standalone composer tests provider-free.

`ChatTranscript` owns scrolling, native toggle capture and image load updates.
`transcriptEntries` preserves history/live fallback rules without modifying or
reconciling runtime blocks. Assistant turn keys scope local block IDs; historical
turns receive their own working state. Work remains before text; `TurnWork` and
`ActivityRow` retain their disclosure state and `v-show` row instances.

Request forms are keyed by `[profile, session, envelope ID]`. The adapter accepts
only known payload shapes and never displays unknown params. Forms own drafts
and pending state; clarification failures retain drafts, blank custom answers
fall back to selected options, and nonblank custom text takes precedence.
Callbacks capture scope generation and envelope identity before dispatch. Late
failures cannot overwrite a replacement request's state. Keep the first-open
request policy and the existing runtime answer transport.

## Guidelines for changes and AI agents

Start with the owning feature and its tests. Preserve public prop contracts and
DOM classes during extraction. Change runtime protocol/recovery separately from
presentation. Keep async guards with the state they protect; do not add another
viewer, Pinia, event bus, or dependency just to forward props. App remains a
substantial shell coordinator; further navigation/project extraction should be
small, behavior-tested changes rather than a state-machine rewrite.

Use `vp lint` and `vp fmt` on owned source; run `npm test`, `npm run test:api`,
and `npm run build`. Keep generated plugin dist assets ignored and out of commits. Verify the
actual React-mounted dashboard at desktop/mobile sizes with `npm run live` and
`npm run test:visual`, inspect screenshots, and stop only your fixture with
`npm run live:stop`. Follow [AGENTS.md](../AGENTS.md) for scope and fixture rules.

## Navigation

Vue Router owns page selection through named hash routes under the host's exact
/chathermes pathname. src/router/history.ts implements the public RouterHistory
contract: metadata lives under history.state.chathermes; host usr and unrelated
fields survive replacements and pushes, while host idx/key follow traversal.
The adapter ignores navigation outside the plugin and destroys its listeners on
unmount. Only canonical hash routes select plugin screens and runtime scope. Outer query
fields belong to the host and are ignored by plugin routing. The host-owned outer
profile query remains: Hermes profile hydration otherwise drops hashes on traversal.
On the first document mount, plugin-entry recovers a canonical hash from Navigation
Timing if host hydration rewrote it before the app import; later host mounts do not
restore that original document destination.

App's guarded coordinator applies profile and session scope only when they change.
Screen-only navigation keeps the native viewer, ChatInterface and composer alive.
Project browsing is separate from session workspace membership; route parameters
never rewrite membership. Navigation revisions reject obsolete project-membership
and creation results. RouterView renders feature pages inside the chat page slot;
thin ProjectRoute owns the project home/editor markup. Scheduled selection watches
route parameters and aborts obsolete reads, including saved runs outside page one.
Settings stores a validated plugin-relative return_to destination. Notifications
use the same link resolver, and the worker produces and recognizes canonical
chat hashes with the existing visible-connected-viewer handshake.
