# Frontend architecture

ChatHermes mounts Vue through the Hermes React dashboard plugin SDK. `main.ts`
creates an app per mount; `plugin-entry.ts` owns host integration and viewport
restoration. Each app installs a fresh Vue Router 4 instance. There is no standalone application or global store.

## Mobile shell and keyboard behavior

The shell follows SWOL's bounded flex layout: a `100dvh` frame with the header
and empty safe-area footer outside the scrolling content. `ChatInterface` bounds
the active page or transcript and keeps the composer in a separate, nonshrinking
dock. The footer owns `env(safe-area-inset-bottom, 0px)` even when the composer is
hidden, plus the normal 12px/mobile or 24px/desktop bottom gap. The composer has
zero bottom margin and meets the top of the footer.
Input focus may compact the composer, but never removes safe-area spacing.

While mounted, the plugin adds `interactive-widget=resizes-content` to its owned
viewport configuration and restores the host's original configuration on unmount.
On supporting browsers, layout viewport resizing lifts the composer using CSS,
without keyboard state or viewport listeners. The footer also follows the resized
viewport: CSS alone cannot guarantee a footer behind the keyboard while the
composer independently rises above it. Browsers ignoring the viewport option may
cover the composer or pan the visual viewport. `dvh` alone does not fix this.
See the [Chrome viewport documentation](https://developer.chrome.com/blog/viewport-resize-behavior)
and [WebKit support tracking](https://bugs.webkit.org/show_bug.cgi?id=259770).

`vh` uses the large viewport size; it does not capture the viewport at load time.
Clamping `dvh` with `vh` does not prevent resizing when the layout viewport itself
changes, including keyboard resizing under `interactive-widget=resizes-content`.

Shortened browser viewports and simulated footer heights verify layout only.
Physical iPhone Safari and Android Chrome testing is required to establish actual
keyboard behavior for a specific browser release, including dismissal while an
input remains focused, reopening, and rotation.

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
