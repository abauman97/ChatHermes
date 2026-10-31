<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { InboxItem } from "./features/inbox/inbox";
import { api, ApiError } from "./services/hermes-api";
import { useNativeSession } from "./features/chat/runtime/native-session";
import type {
  Capabilities,
  Message,
  ModelOption,
  ProviderOption,
  Session,
  SessionTracking,
  Project,
  ProjectAction,
} from "./types/hermes";
import { projectRoot, projectSessions } from "./features/projects/utils/projects";
import * as push from "./features/notifications/services/push";
import { connectPushClient } from "./features/notifications/services/push-client";
import SessionSidebar from "./features/sessions/components/SessionSidebar.vue";
import ChatInterface from "./features/chat/components/ChatInterface.vue";
import { useChatController } from "./features/chat/composables/useChatController";
import { provideChat } from "./features/chat/context";
import { useDrawerSwipe } from "./composables/useDrawerSwipe";
import { useWakeLock } from "./features/settings/composables/useWakeLock";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import {
  destination,
  queryString,
  resolvePluginUrl,
  safeReturn,
  type RouteName,
} from "./router/links";
const router = useRouter(),
  route = useRoute();
const routeName = computed(() => String(route.name || "home"));
const inboxPage = computed(() => routeName.value === "inbox");
const artifactsPage = computed(() => routeName.value === "artifacts");
const projectArtifacts = computed(() => routeName.value === "project-artifacts");
const scheduledPage = computed(() => routeName.value.startsWith("scheduled"));
const projectsPage = computed(() => routeName.value === "projects");
const projectView = computed(() =>
  ["project", "project-artifacts", "project-settings", "project-instructions"].includes(
    routeName.value,
  ),
);
const projectPage = computed(() =>
  routeName.value === "project-settings"
    ? "edit"
    : routeName.value === "project-instructions"
      ? "instructions"
      : "",
);
const archivedProjects = computed(() => route.query.archived === "1");
const settingsPage = computed(() => routeName.value === "settings");
let navigationRevision = 0,
  scopeReady = false,
  profileInitialized = false;
let profileWork: Promise<void> = Promise.resolve();
let routeWork: Promise<void> = Promise.resolve();
let drawerNavigationTarget = "";
async function navigate(
  to: Parameters<typeof router.push>[0],
  replace = false,
  keepDrawer = false,
) {
  drawerNavigationTarget = keepDrawer ? router.resolve(to).fullPath : "";
  if (!keepDrawer) drawer.value = false;
  closeScreenMenu(false);
  navigationRevision++;
  await router[replace ? "replace" : "push"](to);
  await routeWork;
  drawerNavigationTarget = "";
}
function screenLink(name: RouteName, extra: Record<string, string> = {}) {
  return destination(name, profile.value, session.value, projectId.value, extra);
}
type ScheduledPageActions = {
  retry: () => void;
  loading: boolean;
  sessionId?: string;
};
const scheduledComponent = ref<ScheduledPageActions | null>(null);
const scheduledDiscussionError = ref("");
async function discussScheduled(text: string) {
  if (offline.value || creating.value) return;
  const p = profile.value,
    owner = profileGeneration,
    revision = navigationRevision;
  creating.value = true;
  scheduledDiscussionError.value = "";
  try {
    const made = await api.create(p);
    // RPC creation returns a draft. Only the server list can establish whether
    // it is durable; native admission refreshes again after the first prompt.
    refreshNativeSessions(p);
    if (
      owner !== profileGeneration ||
      p !== profile.value ||
      revision !== navigationRevision ||
      !scheduledPage.value
    )
      return;
    await chooseSession(made.id, "");
    if (owner === profileGeneration && p === profile.value && session.value === made.id)
      suggestedPrompt.value = text;
  } catch {
    if (owner === profileGeneration && p === profile.value)
      scheduledDiscussionError.value = "Could not open a chat. Please try again.";
  } finally {
    if (owner === profileGeneration) creating.value = false;
  }
}
function setScheduledComponent(component: unknown) {
  scheduledComponent.value = component as ScheduledPageActions | null;
}
const projectConfirmation = ref<"delete" | "archive">(),
  projectConfirmCancel = ref<HTMLButtonElement>();
const projectBusy = ref(false),
  manageError = ref("");
const projectId = ref(""),
  projects = ref<Project[]>([]),
  selectedProject = ref<Project>(),
  projectsLoading = ref(false),
  projectLoading = ref(false),
  projectsError = ref(""),
  projectError = ref("");
const scopedSessionIds = ref<string[]>([]);
const projectsLoaded = ref(false);
const activeProjectContext = computed(
  () =>
    (projectView.value || !!session.value) &&
    !projectsPage.value &&
    !scheduledPage.value &&
    !inboxPage.value &&
    !!projectId.value &&
    !!selectedProject.value &&
    !selectedProject.value.isNoProject,
);
const visibleSessions = computed(() =>
  projectId.value
    ? selectedProject.value
      ? projectSessions(selectedProject.value)
      : []
    : sessions.value.filter((row) => !scopedSessionIds.value.includes(row.id)),
);
let closeProjectEvents: (() => void) | undefined;
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
function subscribeProjectEvents() {
  closeProjectEvents?.();
  closeProjectEvents = undefined;
  if (typeof EventSource === "undefined") return;
  closeProjectEvents = api.projectEvents(profile.value, () => {
    refreshProjects();
    void refreshInbox();
  });
}
function refreshProjects() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    void loadProjects();
    if (projectId.value) void loadProject();
  }, 100);
}
let projectsAbort: AbortController | undefined, projectAbort: AbortController | undefined;
const profile = ref(""),
  session = ref(""),
  sessions = ref<Session[]>([]),
  messages = ref<Message[]>([]);
const capabilities = ref<Capabilities>({}),
  offset = ref(0),
  hasMore = ref(false),
  loading = ref(false),
  chatLoading = ref(false),
  offline = ref(!navigator.onLine);
const error = ref(""),
  chatError = ref(""),
  drawer = ref(false);
const profiles = ref<{ name: string }[]>([]),
  models = ref<ModelOption[]>([]),
  model = ref(""),
  defaultModel = ref(""),
  creating = ref(false);
const providers = ref<ProviderOption[]>([]),
  provider = ref(""),
  modelsLoading = ref(false);
const embedded = ref(false),
  suggestedPrompt = ref("");
const menuButton = ref<HTMLButtonElement | null>(null),
  closeButton = ref<HTMLButtonElement | null>(null),
  screenMenuButton = ref<HTMLButtonElement | null>(null),
  screenMenu = ref(false),
  screenMenuWrap = ref<HTMLElement | null>(null);
const canStream = computed(() => capabilities.value.features?.native_chat === true);
let listAbort: AbortController | undefined,
  chatAbort: AbortController | undefined,
  generation = 0,
  profileGeneration = 0;
const pushState = ref<push.PushState>({
  supported: false,
  permission: "unsupported",
  subscribed: false,
  available: false,
  error: "",
});
const pushBusy = ref(false),
  pushLoading = ref(false),
  pushMessage = ref("");
let pushGeneration = 0;
const settingsButton = ref<HTMLButtonElement | null>(null);
const removedSessions = new Set<string>();
const tracking = ref<SessionTracking[]>([]);
const trackingPending = ref(new Set<string>());
let trackingRevision = 0;
async function trackSession(id: string, status: SessionTracking["status"]) {
  if (offline.value || trackingPending.value.has(id) || sessionBusy.value) return;
  const p = profile.value,
    owner = profileGeneration;
  const previous = tracking.value.find((row) => row.session_id === id);
  invalidateSessionList();
  trackingRevision++;
  trackingPending.value.add(id);
  tracking.value = [
    ...tracking.value.filter((row) => row.session_id !== id),
    { session_id: id, status, updated_at: new Date().toISOString() },
  ];
  try {
    const result = await api.track(p, id, status);
    if (owner !== profileGeneration) return;
    if (result.session_id !== id) {
      sessions.value = sessions.value.map((row) =>
        row.id === id ? { ...row, id: result.session_id } : row,
      );
    }
    tracking.value = [
      ...tracking.value.filter(
        (row) => row.session_id !== id && row.session_id !== result.session_id,
      ),
      result,
    ];
  } catch (cause) {
    if (owner !== profileGeneration) return;
    tracking.value = tracking.value.filter((row) => row.session_id !== id);
    if (previous) tracking.value.push(previous);
    error.value = cause instanceof Error ? cause.message : "Could not update tracking";
  } finally {
    if (owner === profileGeneration) {
      invalidateSessionList();
      trackingPending.value.delete(id);
    }
  }
}
function refreshNativeSessions(p: string) {
  if (p === profile.value) void loadSessions();
}
function updateNativeTitle(p: string, id: string, title: string) {
  if (p !== profile.value) return;
  sessions.value = sessions.value.map((row) => (row.id === id ? { ...row, title } : row));
}
const native = useNativeSession(
  () => {
    refreshProjects();
    void loadSessions();
    void refreshInbox();
  },
  refreshNativeSessions,
  updateNativeTitle,
  deleteCurrentSessionInbox,
);
const chat = useChatController(native, {
  profile,
  session,
  messages,
  chatLoading,
  chatError,
  canStream,
  scheduledPage,
  inboxPage,
  projectView,
  projectsPage,
  projectPage,
  settingsPage,
  selectedProject,
  creating,
  offline,
  models,
  providers,
  modelsLoading,
  model,
  provider,
  defaultModel,
  suggestedPrompt,
  generation: () => generation,
  navigation: () => navigationRevision,
  createSession,
  suggest,
  retryHistory: loadMessages,
  openBranch: async (id: string) => {
    await chooseSession(id);
    refreshProjects();
    void loadSessions();
  },
});
provideChat(chat);
const wakeLock = useWakeLock();
const nativeMode = canStream;
function showProjectArtifacts(artifacts: boolean) {
  return navigate({
    ...(screenLink(artifacts ? "project-artifacts" : "project") as object),
    params: { projectId: projectId.value },
  });
}
function cancelChat() {
  native.close();
  generation++;
  chatAbort?.abort();
  chatLoading.value = false;
}
function cancel() {
  cancelChat();
  listAbort?.abort();
  loading.value = false;
}
let projectsWork: Promise<void> = Promise.resolve();
function loadProjects() {
  projectsWork = readProjects();
  return projectsWork;
}
async function readProjects() {
  projectsAbort?.abort();
  const controller = new AbortController();
  projectsAbort = controller;
  const p = profile.value;
  projectsLoading.value = !projectsLoaded.value;
  projectsError.value = "";
  try {
    const result = await api.projects(p, controller.signal);
    if (controller !== projectsAbort || p !== profile.value) return;
    if (
      !Array.isArray(result.projects) ||
      result.projects.some(
        (item) => !item || typeof item.id !== "string" || typeof item.label !== "string",
      )
    )
      throw new Error("Invalid Hermes Projects response");
    projects.value = result.projects;
    scopedSessionIds.value = result.scoped_session_ids || [];
    projectsLoaded.value = true;
  } catch {
    if (controller === projectsAbort && !controller.signal.aborted)
      projectsError.value = "Could not load Projects.";
  } finally {
    if (controller === projectsAbort) projectsLoading.value = false;
  }
}
async function loadProject() {
  projectAbort?.abort();
  const controller = new AbortController();
  projectAbort = controller;
  const p = profile.value,
    id = projectId.value;
  if (!id) return;
  projectLoading.value = !selectedProject.value;
  projectError.value = "";
  try {
    const result = await api.project(p, id, controller.signal);
    if (
      controller === projectAbort &&
      !controller.signal.aborted &&
      p === profile.value &&
      id === projectId.value
    )
      selectedProject.value = result;
  } catch (cause) {
    if (controller === projectAbort && !controller.signal.aborted)
      projectError.value =
        cause instanceof ApiError && cause.status === 404
          ? "Project no longer exists. Return to Other chats."
          : "Could not load this Project. Retry or return to Other chats.";
  } finally {
    if (controller === projectAbort) projectLoading.value = false;
  }
}
async function chooseProject(id: string) {
  return navigate(
    id
      ? { ...(screenLink("project", { project: id }) as object), params: { projectId: id } }
      : destination("home", profile.value, session.value),
  );
}
function showProjects(archived = false) {
  return navigate(screenLink("projects", archived ? { archived: "1" } : {}));
}
async function recentSession(id: string) {
  const revision = ++navigationRevision,
    p = profile.value;
  if (!projectsLoaded.value) await loadProjects();
  if (revision !== navigationRevision || p !== profile.value) return;
  const owner = projects.value.find(
    (project) =>
      project.sessionIds?.includes(id) || projectSessions(project).some((row) => row.id === id),
  );
  return navigate({
    name: "chat",
    params: { sessionId: id },
    query: { ...(p ? { profile: p } : {}), ...(owner ? { project: owner.id } : {}) },
  });
}
async function newChat() {
  return await createSession(true);
}
function openProjectPage(page: "edit" | "instructions") {
  if (!selectedProject.value || selectedProject.value.isNoProject) return;
  return navigate({
    ...(screenLink(page === "edit" ? "project-settings" : "project-instructions") as object),
    params: { projectId: projectId.value },
  });
}
async function confirmProject(action: "delete" | "archive") {
  projectConfirmation.value = action;
  closeScreenMenu(false);
  await nextTick();
  projectConfirmCancel.value?.focus();
}
function dismissProjectConfirmation() {
  projectConfirmation.value = undefined;
  screenMenuButton.value?.focus();
}
async function submitProjectConfirmation() {
  const action = projectConfirmation.value;
  if (!action) return;
  await manageProject(action, { id: projectId.value });
  if (!manageError.value) projectConfirmation.value = undefined;
}
async function manageProject(action: ProjectAction, fields: Record<string, string | boolean>) {
  if (projectBusy.value || offline.value) return;
  const p = profile.value,
    owner = profileGeneration,
    scope = projectId.value,
    revision = navigationRevision;
  projectBusy.value = true;
  manageError.value = "";
  try {
    const result = await api.projectManage(p, action, fields);
    if (owner !== profileGeneration || p !== profile.value || revision !== navigationRevision)
      return;
    if (action === "create" && result.project?.id) await chooseProject(result.project.id);
    else if (scope === projectId.value && !projectsPage.value) {
      if (action === "delete") {
        projectId.value = "";
        selectedProject.value = undefined;
        showProjects(archivedProjects.value);
      } else if (action === "archive") {
        projectId.value = "";
        selectedProject.value = undefined;
        showProjects(fields.restore !== true);
      } else await loadProject();
    }
    if (owner === profileGeneration) {
      await loadProjects();
      await loadSessions();
    }
  } catch {
    if (owner === profileGeneration && p === profile.value)
      manageError.value = "Could not save the project. Check its fields and try again.";
  } finally {
    if (owner === profileGeneration) projectBusy.value = false;
  }
}
function invalidateSessionList() {
  listAbort?.abort();
  listAbort = undefined;
  loading.value = false;
}
async function loadSessions(more = false) {
  trackingRevision++;
  listAbort?.abort();
  const controller = new AbortController();
  listAbort = controller;
  const id = profile.value;
  const listedTitles = new Map(sessions.value.map((row) => [row.id, row.title]));
  loading.value = true;
  error.value = "";
  try {
    const [result, trackingResult] = await Promise.all([
      api.sessions(id, more ? offset.value : 0, controller.signal),
      api.tracking(id, controller.signal).then(
        (value) => ({ value, error: "" }),
        () => ({ value: undefined, error: "Could not load session tracking" }),
      ),
    ]);
    const tracked = trackingResult.value;
    if (controller !== listAbort || controller.signal.aborted || id !== profile.value) return;
    const pending = tracking.value.filter((row) => trackingPending.value.has(row.session_id));
    if (tracked)
      tracking.value = [
        ...tracked.tracking.filter((row) => !trackingPending.value.has(row.session_id)),
        ...pending,
      ];
    if (trackingResult.error) error.value = trackingResult.error;
    const page = result.sessions
      .filter((row) => !removedSessions.has(row.id))
      .map((row) => {
        const current = sessions.value.find((item) => item.id === row.id);
        return current && listedTitles.has(row.id) && current.title !== listedTitles.get(row.id)
          ? { ...row, title: current.title }
          : row;
      });
    sessions.value = more
      ? [
          ...sessions.value.map((row) => page.find((item) => item.id === row.id) || row),
          ...page.filter((item) => !sessions.value.some((existing) => existing.id === item.id)),
        ]
      : page;
    sessions.value = [
      ...new Map(
        sessions.value.map((row) => {
          const canonical = tracked?.aliases?.[row.id] || row.id;
          return [canonical, canonical === row.id ? row : { ...row, id: canonical }];
        }),
      ).values(),
    ];
    const summaries = new Map(sessions.value.map((row) => [row.id, row]));
    for (const row of tracked?.sessions || []) {
      if (!summaries.has(row.id) && !removedSessions.has(row.id)) summaries.set(row.id, row);
    }
    // Keep Hermes's existing order (including pins). Insert extra Open summaries
    // by recency so settling an older row also places it correctly in history.
    const merged = [...sessions.value];
    for (const row of summaries.values()) {
      if (merged.some((item) => item.id === row.id)) continue;
      const at = merged.findIndex(
        (item) =>
          (item.last_active ?? item.started_at ?? 0) < (row.last_active ?? row.started_at ?? 0),
      );
      merged.splice(at < 0 ? merged.length : at, 0, row);
    }
    sessions.value = merged;
    offset.value =
      typeof result.offset === "number" && typeof result.limit === "number"
        ? result.offset + result.limit
        : more
          ? offset.value + result.sessions.length
          : result.sessions.length;
    hasMore.value =
      result.has_more ??
      (typeof result.total === "number"
        ? offset.value < result.total
        : result.sessions.length === 30);
  } catch (cause) {
    if (controller === listAbort && !controller.signal.aborted)
      error.value = cause instanceof Error ? cause.message : "Could not load sessions";
  } finally {
    if (controller === listAbort) {
      loading.value = false;
      listAbort = undefined;
    }
  }
}
async function loadMessages() {
  if (!session.value) return false;
  if (nativeMode.value) {
    await native.hydrate();
    return true;
  }
  chatAbort?.abort();
  const controller = new AbortController();
  chatAbort = controller;
  const current = generation;
  chatLoading.value = true;
  chatError.value = "";
  try {
    const result = await api.messages(profile.value, session.value, controller.signal);
    if (current === generation && controller === chatAbort) {
      messages.value = result;
      return true;
    }
  } catch (cause) {
    if (current === generation && !controller.signal.aborted)
      chatError.value = cause instanceof Error ? cause.message : "Could not load messages";
  } finally {
    if (controller === chatAbort) chatLoading.value = false;
  }
  return false;
}
async function applyProfile(id: string) {
  if (id && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) {
    error.value = "Invalid profile name";
    return;
  }

  suggestedPrompt.value = "";
  creating.value = false;
  sessionBusy.value = false;
  sessionMutation++;

  projectConfirmation.value = undefined;
  projectsLoaded.value = false;
  closeProjectEvents?.();
  closeProjectEvents = undefined;
  clearTimeout(refreshTimer);
  scopedSessionIds.value = [];
  cancel();
  projectsAbort?.abort();
  projectAbort?.abort();
  projectId.value = "";

  projectBusy.value = false;
  manageError.value = "";
  selectedProject.value = undefined;
  projects.value = [];
  projectError.value = "";
  projectsError.value = "";
  projectLoading.value = false;
  profile.value = id;
  session.value = "";
  sessions.value = [];
  tracking.value = [];
  trackingPending.value = new Set();
  removedSessions.clear();
  messages.value = [];
  capabilities.value = {};
  models.value = [];
  providers.value = [];
  provider.value = "";
  model.value = "";
  defaultModel.value = "";
  modelsLoading.value = true;
  error.value = "";
  chatError.value = "";
  offset.value = 0;
  hasMore.value = false;
  const current = ++profileGeneration;
  subscribeProjectEvents();
  void loadProjects();
  void loadSessions();
  void Promise.allSettled([api.models(id), api.modelOptions(id)]).then(([catalog, inventory]) => {
    if (current !== profileGeneration) return;
    if (catalog.status === "fulfilled") {
      models.value = catalog.value.data || [];
      defaultModel.value = catalog.value.default_model || "";
    }
    if (inventory.status === "fulfilled" && Array.isArray(inventory.value.providers)) {
      providers.value = inventory.value.providers.filter(
        (item) => item.models.length || item.is_current,
      );
      provider.value =
        providers.value.find((item) => item.is_current)?.slug || inventory.value.provider || "";
      defaultModel.value = inventory.value.model || defaultModel.value;
    }
    modelsLoading.value = false;
  });
  try {
    const result = await api.capabilities(id);
    if (current === profileGeneration && profile.value === id) capabilities.value = result;
  } catch {
    if (current === profileGeneration && profile.value === id) capabilities.value = {};
  }
}
async function attachSession(id: string) {
  if (api.isNative(profile.value) || projectId.value) api.workspace(profile.value, id);
  else if (
    sessions.value.find((row) => row.id === id)?.cwd ||
    sessions.value.find((row) => row.id === id)?.source === "desktop"
  )
    api.workspace(profile.value, id);

  projectConfirmation.value = undefined;

  suggestedPrompt.value = "";
  cancelChat();
  session.value = id;
  messages.value = [];
  chatError.value = "";
  drawer.value = false;
  const current = generation,
    p = profile.value;
  if (!projectId.value && !api.isWorkspace(p, id)) {
    try {
      await api.session(p, id);
    } catch {
      /* History still supplies the route's error. */
    }
    if (current !== generation || p !== profile.value) return;
  }
  if (nativeMode.value) await native.attach(p, id);
  else await loadMessages();
}
async function createSession(unscoped = false) {
  if (
    offline.value ||
    creating.value ||
    (!unscoped && projectId.value && selectedProject.value?.archived)
  )
    return;
  const id = profile.value,
    scope = unscoped ? "" : projectId.value,
    selected = session.value,
    revision = navigationRevision,
    current = generation,
    owner = profileGeneration;
  creating.value = true;
  try {
    if (scope && !provider.value) {
      provider.value = providers.value.find((item) => item.is_current)?.slug || "";
      model.value = "";
    }
    const made = scope ? await api.projectCreate(id, scope) : await api.create(id);
    if (
      current !== generation ||
      profile.value !== id ||
      session.value !== selected ||
      revision !== navigationRevision
    )
      return;
    // RPC drafts have no DB row until the first prompt; their normal resume path
    // can still hydrate them by stored ID. Keep the same chat components.
    await chooseSession(made.id, scope);
    refreshProjects();
    const trackingRead = ++trackingRevision;
    void api
      .tracking(id)
      .then((result) => {
        if (owner !== profileGeneration || trackingRead !== trackingRevision) return;
        tracking.value = result.tracking;
        const summaries = new Map(sessions.value.map((row) => [row.id, row]));
        for (const row of result.sessions)
          if (!removedSessions.has(row.id)) summaries.set(row.id, row);
        sessions.value = [...summaries.values()];
      })
      .catch(() => {
        if (owner === profileGeneration) error.value = "Could not load session tracking";
      });
    if (profile.value !== id || session.value !== made.id) return;
    return made.id;
  } catch (cause) {
    if (
      current === generation &&
      revision === navigationRevision &&
      profile.value === id &&
      projectId.value === scope
    ) {
      const message = cause instanceof Error ? cause.message : "Could not create session";
      if (scope) projectError.value = message;
      else error.value = message;
    }
  } finally {
    if (owner === profileGeneration) creating.value = false;
  }
}
async function suggest(text: string) {
  const current = generation,
    p = profile.value,
    id = await createSession();
  if (id && current + 1 === generation && p === profile.value && session.value === id)
    suggestedPrompt.value = text;
}
async function rename(id: string, title: string) {
  const p = profile.value,
    current = generation;
  try {
    await api.rename(p, id, title);
    if (current !== generation || p !== profile.value) return;
    const found = sessions.value.find((s) => s.id === id);
    if (found) found.title = title;
    refreshProjects();
  } catch (cause) {
    if (current === generation && p === profile.value)
      error.value = cause instanceof Error ? cause.message : "Could not rename session";
  }
}
const sessionBusy = ref(false);
let sessionMutation = 0;
async function manageSession(action: "archive" | "delete" | "project", id: string, target = "") {
  if (offline.value || sessionBusy.value) return;
  const p = profile.value,
    current = generation,
    mutation = ++sessionMutation,
    owner = profileGeneration;
  sessionBusy.value = true;
  // Retire reads started before the mutation, even if fetch ignores abort.
  invalidateSessionList();
  try {
    if (action === "archive") await api.archive(p, id);
    else if (action === "delete") await api.deleteSession(p, id);
    else await api.moveSession(p, id, target);
    if (owner !== profileGeneration || p !== profile.value) return;
    invalidateSessionList();
    if (action !== "project") {
      removedSessions.add(id);
      sessions.value = sessions.value.filter((row) => row.id !== id);
    }
    if (current === generation && session.value === id) {
      if (action === "project")
        await navigate({
          name: "chat",
          params: { sessionId: id },
          query: { ...(p ? { profile: p } : {}), project: target },
        });
      else await navigate({ name: "home", query: p ? { profile: p } : {} });
    }
    await loadSessions();
    refreshProjects();
  } catch (cause) {
    if (current === generation && p === profile.value)
      error.value = cause instanceof Error ? cause.message : "Could not update session";
  } finally {
    if (mutation === sessionMutation) sessionBusy.value = false;
  }
}
async function visibilityChange() {
  await native.availability(document.visibilityState === "visible", navigator.onLine);
  if (document.visibilityState === "visible") {
    refreshProjects();
    void refreshInbox();
  }
}
function exitPlugin() {
  location.href = "/";
}
function onlineChange() {
  offline.value = !navigator.onLine;
  void native.availability(document.visibilityState === "visible", !offline.value);
  if (!offline.value) {
    refreshProjects();
    void loadSessions();
    void visibilityChange();
  }
}
function chooseProfile(id: string) {
  if (id && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) {
    error.value = "Invalid profile name";
    return;
  }
  return navigate(
    settingsPage.value
      ? destination("settings", id, "", "", {
          return_to: router.resolve(destination("home", id)).fullPath,
        })
      : destination("home", id),
    false,
    true,
  );
}
function chooseSession(id: string, project = projectId.value) {
  return navigate({
    name: "chat",
    params: { sessionId: id },
    query: {
      ...(profile.value ? { profile: profile.value } : {}),
      ...(project ? { project } : {}),
    },
  });
}
async function applyScope(revision: number) {
  const p = queryString(route.query.profile);
  if (!profileInitialized || p !== profile.value) {
    profileInitialized = true;
    profileWork = applyProfile(p);
    await profileWork;
    if (revision !== navigationRevision) return;
  }
  await profileWork;
  if (revision !== navigationRevision) return;
  const nextSession =
    typeof route.params.sessionId === "string"
      ? route.params.sessionId
      : queryString(route.query.session);
  const explicitProject =
    typeof route.params.projectId === "string"
      ? route.params.projectId
      : queryString(route.query.project);
  const membership = () =>
    projects.value.find(
      (project) =>
        project.sessionIds?.includes(nextSession) ||
        projectSessions(project).some((row) => row.id === nextSession),
    );
  const nextProject = explicitProject || (routeName.value === "chat" ? membership()?.id || "" : "");
  if (nextProject !== projectId.value) {
    projectAbort?.abort();
    projectId.value = nextProject;
    selectedProject.value = undefined;
    projectError.value = "";
    projectLoading.value = false;
    if (nextProject) void loadProject();
  }
  if (nextSession !== session.value) {
    if (nextSession) await attachSession(nextSession);
    else {
      cancelChat();
      session.value = "";
      messages.value = [];
      suggestedPrompt.value = "";
    }
  }
  if (revision !== navigationRevision || p !== profile.value) return;
  // Notification cleanup depends on the opened chat, not Project discovery.
  if (nextSession && routeName.value === "chat" && nextSession === session.value) {
    await deleteCurrentSessionInbox(p, nextSession);
  }
  // Session links need no caller-supplied project hint: membership remains gateway-owned.
  if (nextSession && !explicitProject && routeName.value === "chat" && !projectsLoaded.value) {
    await projectsWork;
    if (revision !== navigationRevision || p !== profile.value || nextSession !== session.value)
      return;
    const owner = membership();
    if (owner && owner.id !== projectId.value) {
      projectId.value = owner.id;
      selectedProject.value = owner;
      void loadProject();
    }
  }
}
watch(
  () => route.fullPath,
  () => {
    if (!route.matched.length) return;
    const revision = ++navigationRevision;
    drawerSwipe.cancel();
    if (route.fullPath !== drawerNavigationTarget) drawer.value = false;
    closeScreenMenu(false);
    projectConfirmation.value = undefined;
    manageError.value = "";
    if (scopeReady) routeWork = applyScope(revision);
  },
  { flush: "sync" },
);
function closeDrawer() {
  drawer.value = false;
  menuButton.value?.focus();
}
async function openDrawer() {
  drawer.value = true;
  await nextTick();
  closeButton.value?.focus();
}
const sidebar = ref<HTMLElement | null>(null);
const chatPlane = ref<InstanceType<typeof ChatInterface> | null>(null);
const drawerSwipe = useDrawerSwipe(
  drawer,
  () => sidebar.value?.getBoundingClientRect().width || Math.min(300, window.innerWidth * 0.85),
  () => chatPlane.value?.$el.querySelector(".transcript") || null,
  (open) => {
    if (open === drawer.value) return;
    if (open) void openDrawer();
    else closeDrawer();
  },
);
async function closeSettings() {
  await navigate(safeReturn(queryString(route.query.return_to)));
  await nextTick();
  if (window.matchMedia?.("(min-width: 701px)").matches ?? true) settingsButton.value?.focus();
  else menuButton.value?.focus();
}
function showSettings() {
  if (settingsPage.value) return;
  return navigate(screenLink("settings", { return_to: route.fullPath }));
}
function closeScreenMenu(restoreFocus = true) {
  if (screenMenu.value) {
    screenMenu.value = false;
    if (restoreFocus) screenMenuButton.value?.focus();
  }
}
function screenMenuOutside(event: MouseEvent) {
  if (
    screenMenu.value &&
    screenMenuWrap.value &&
    !event.composedPath().includes(screenMenuWrap.value)
  )
    closeScreenMenu(false);
}
function drawerKey(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  if (drawer.value) closeDrawer();
  else if (settingsPage.value) {
    event.preventDefault();
    void closeSettings();
  } else closeScreenMenu();
}
async function reloadPushState() {
  const p = profile.value,
    owner = ++pushGeneration;
  pushLoading.value = true;
  const result = await push.state(p);
  if (owner === pushGeneration && p === profile.value) {
    pushState.value = result;
    pushLoading.value = false;
  }
}
watch(
  profile,
  () => {
    pushMessage.value = "";
    pushState.value = { ...pushState.value, subscribed: false };
    void reloadPushState();
  },
  { flush: "sync" },
);
async function togglePush() {
  if (pushBusy.value || pushLoading.value) return;
  const p = profile.value;
  pushBusy.value = true;
  pushMessage.value = "";
  try {
    if (pushState.value.subscribed) await push.unsubscribe(p);
    else await push.subscribe(p);
    await reloadPushState();
  } catch (cause) {
    if (p === profile.value)
      pushMessage.value =
        cause instanceof Error ? cause.message : "Could not update notifications.";
    await reloadPushState();
  } finally {
    pushBusy.value = false;
  }
}
async function testPush() {
  if (pushBusy.value || pushLoading.value) return;
  const p = profile.value;
  pushBusy.value = true;
  pushMessage.value = "";
  try {
    await push.sendTest(p);
    if (p === profile.value) pushMessage.value = "Test notification scheduled.";
  } catch {
    if (p === profile.value) pushMessage.value = "Could not send a test notification.";
  } finally {
    pushBusy.value = false;
  }
}
let pushClient: ReturnType<typeof connectPushClient> | undefined;
const notificationSession = computed(() => ({
  profile: profile.value,
  session: session.value,
  chat:
    !settingsPage.value &&
    !scheduledPage.value &&
    !inboxPage.value &&
    !artifactsPage.value &&
    !projectsPage.value &&
    !projectView.value &&
    !projectPage.value,
  scheduled:
    scheduledPage.value && route.params.jobId && route.params.runId
      ? { job: String(route.params.jobId), run: String(route.params.runId) }
      : undefined,
  connected: nativeMode.value && native.connection.value === "ready" && !offline.value,
}));
watch(notificationSession, () => pushClient?.publish(), { flush: "post" });
function serviceWorkerMessage(event: MessageEvent) {
  if (event.data?.type !== "chathermes.navigate" || typeof event.data.url !== "string") return;
  const target = resolvePluginUrl(event.data.url);
  if (target) void navigate(target);
}
const inboxUnread = ref(0),
  inboxRevision = ref(0);
let inboxTimer: ReturnType<typeof setInterval> | undefined;
let inboxAbort: AbortController | undefined;
let inboxFingerprint = "";
async function refreshInbox(checkSession = true) {
  if (document.visibilityState === "hidden") return;
  inboxAbort?.abort();
  const current = (inboxAbort = new AbortController());
  try {
    const result = await api.inbox(profile.value, { limit: 1 }, current.signal);
    if (current.signal.aborted) return;
    inboxUnread.value = result.unread;
    if (checkSession) void deleteCurrentSessionInbox(profile.value, session.value);
    const fingerprint = JSON.stringify([result.revision, result.unread, result.items[0]?.id]);
    if (fingerprint !== inboxFingerprint) {
      inboxFingerprint = fingerprint;
      inboxRevision.value++;
    }
  } catch {
    /* Keep the last known count during a disconnect. */
  }
}
const inboxCleanup = new Map<string, Promise<void>>();
async function deleteCurrentSessionInbox(p: string, id: string) {
  const current = () =>
    scopeReady &&
    !!id &&
    p === profile.value &&
    id === session.value &&
    routeName.value === "chat" &&
    !chatError.value &&
    (!nativeMode.value ||
      native.connection.value === "ready" ||
      !!native.approval.value ||
      native.requests.value.length > 0);
  if (!current()) return;
  // A completion or reconnect must publish even when the route has not changed.
  // The worker independently verifies the current visible client before closing.
  pushClient?.publish();
  const key = JSON.stringify([p, id]);
  const work = (inboxCleanup.get(key) || Promise.resolve()).then(async () => {
    let cursor: string | undefined;
    let deleted = false;
    try {
      do {
        if (!current()) return;
        const result = await api.inbox(p, { scope: "profile", limit: 100, cursor });
        if (!current()) return;
        const matches = result.items.filter(
          (item) => item.profile === (p || "default") && item.session === id,
        );
        await Promise.all(matches.map((item) => api.deleteInboxItem(p, item.id)));
        deleted ||= matches.length > 0;
        cursor = result.nextCursor || undefined;
      } while (cursor);
    } catch {
      // A later open, completion, refresh or reconnect retries failed deletions.
    } finally {
      if (deleted && p === profile.value) void refreshInbox(false);
    }
  });
  inboxCleanup.set(key, work);
  await work;
  if (inboxCleanup.get(key) === work) inboxCleanup.delete(key);
}
async function openInboxItem(item: InboxItem) {
  // Verify the owning history exists before leaving Inbox or changing read state.
  const revision = navigationRevision;
  await api.session(item.profile, item.session);
  if (revision !== navigationRevision) throw new Error("Navigation changed");
  await navigate({
    name: "chat",
    params: { sessionId: item.session },
    query: { profile: item.profile },
  });
  if (
    profile.value !== item.profile ||
    session.value !== item.session ||
    chatError.value ||
    (nativeMode.value && native.connection.value !== "ready")
  )
    throw new Error("Chat unavailable");
  await deleteCurrentSessionInbox(item.profile, item.session);
}
const pageProps = computed(() => {
  if (inboxPage.value)
    return {
      profile: profile.value,
      revision: inboxRevision.value,
      openItem: openInboxItem,
      onRefresh: refreshInbox,
    };
  if (settingsPage.value)
    return {
      profile: profile.value,
      profiles: profiles.value,
      pushState: pushState.value,
      pushBusy: pushBusy.value,
      pushLoading: pushLoading.value,
      pushMessage: pushMessage.value,
      keepScreenAwake: wakeLock.enabled.value,
      wakeLockAvailable: wakeLock.available.value,
      onProfile: chooseProfile,
      onTogglePush: togglePush,
      onTestPush: testPush,
      onToggleWakeLock: wakeLock.setEnabled,
      onClose: closeSettings,
    };
  if (artifactsPage.value)
    return { profile: profile.value, projects: projects.value, onOpenSession: recentSession };
  if (scheduledPage.value)
    return {
      profile: profile.value,
      chatBusy: creating.value,
      offline: offline.value,
      discussionError: scheduledDiscussionError.value,
      onDiscuss: discussScheduled,
      onOpenSession: recentSession,
    };
  if (projectsPage.value)
    return {
      projects: projects.value,
      archived: archivedProjects.value,
      loading: projectsLoading.value,
      error: projectsError.value || manageError.value,
      busy: projectBusy.value,
      offline: offline.value,
      onSelect: chooseProject,
      onRetry: loadProjects,
      onManage: manageProject,
    };
  if (projectView.value)
    return {
      profile: profile.value,
      projectId: projectId.value,
      selectedProject: selectedProject.value,
      projectPage: projectPage.value,
      projectArtifacts: projectArtifacts.value,
      projectLoading: projectLoading.value,
      projectError: projectError.value,
      manageError: manageError.value,
      projectBusy: projectBusy.value,
      offline: offline.value,
      visibleSessions: visibleSessions.value,
      chooseProject,
      showProjects,
      showProjectArtifacts,
      loadProject,
      recentSession,
      chooseSession,
      manageProject,
    };
  return {};
});
onMounted(async () => {
  void refreshInbox();
  inboxTimer = setInterval(() => void refreshInbox(), 15000);
  if ("serviceWorker" in navigator)
    pushClient = connectPushClient(
      navigator.serviceWorker,
      () => notificationSession.value,
      () => location.href,
    );
  void api
    .profiles()
    .then((result) => {
      profiles.value = result.profiles || [];
    })
    .catch(() => {
      error.value = "Could not load profiles";
    });
  void reloadPushState();
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.addEventListener("message", serviceWorkerMessage);
  embedded.value = !!menuButton.value?.closest(".chathermes-embedded");
  document.addEventListener("visibilitychange", visibilityChange);
  addEventListener("online", onlineChange);
  addEventListener("offline", onlineChange);
  addEventListener("keydown", drawerKey);
  document.addEventListener("click", screenMenuOutside);
  await router.isReady();
  scopeReady = true;
  routeWork = applyScope(++navigationRevision);
  await routeWork;
});
onUnmounted(() => {
  clearInterval(inboxTimer);
  inboxAbort?.abort();
  scopeReady = false;
  navigationRevision++;
  router.options.history.destroy();
  pushClient?.stop();
  pushClient = undefined;
  profileGeneration++;
  closeProjectEvents?.();
  clearTimeout(refreshTimer);
  document.removeEventListener("visibilitychange", visibilityChange);
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.removeEventListener("message", serviceWorkerMessage);
  cancel();
  projectsAbort?.abort();
  projectAbort?.abort();
  removeEventListener("online", onlineChange);
  removeEventListener("offline", onlineChange);
  removeEventListener("keydown", drawerKey);
  document.removeEventListener("click", screenMenuOutside);
});
</script>
<template>
  <div
    class="app-shell flex h-dvh min-h-0 overflow-hidden bg-black font-sans text-white dark:bg-black dark:text-white"
  >
    <aside
      ref="sidebar"
      class="sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-1 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white"
      :class="drawer ? 'translate-x-0' : '-translate-x-full'"
      :style="drawerSwipe.sidebarStyle.value"
      @touchstart="drawerSwipe.start"
      @touchmove="drawerSwipe.move"
      @touchend="drawerSwipe.end"
      @touchcancel="drawerSwipe.cancel"
      @click.capture="drawerSwipe.click"
      aria-label="Navigation"
    >
      <div class="brand mb-3 shrink-0 flex items-center gap-2 px-2 text-xl font-semibold">
        <span class="min-w-0 truncate">ChatHermes</span>
        <button
          v-if="embedded"
          class="drawer-dashboard grid size-8 shrink-0 place-items-center rounded-lg text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          aria-label="Return to Hermes Desktop"
          title="Return to Hermes Desktop"
          @click="exitPlugin"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M10 5 3 12l7 7M3 12h12a6 6 0 0 0 6-6V3" />
          </svg></button
        ><button
          ref="closeButton"
          class="mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          aria-label="Close navigation"
          @click="closeDrawer"
        >
          ×
        </button>
      </div>
      <RouterLink
        class="inbox-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="inboxPage ? 'page' : undefined"
        :to="screenLink('inbox')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M4 4h16v16H4zM4 13h4l2 3h4l2-3h4" />
        </svg>
        Inbox
        <span
          v-if="inboxUnread"
          class="ml-auto rounded-full bg-[#424242] px-2 text-sm leading-[1.5]"
          :aria-label="`${inboxUnread} unread notifications`"
          >{{ inboxUnread }}</span
        >
      </RouterLink>
      <RouterLink
        class="projects-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="projectsPage || projectView ? 'page' : undefined"
        :to="screenLink('projects')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" /></svg
        >Projects
      </RouterLink>
      <RouterLink
        class="scheduled-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="scheduledPage ? 'page' : undefined"
        :to="screenLink('scheduled')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4M17 3v4M3 11h18M8 15h3M8 18h6" /></svg
        >Scheduled
      </RouterLink>
      <RouterLink
        class="artifacts-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="artifactsPage ? 'page' : undefined"
        :to="screenLink('artifacts')"
        @click="drawer = false"
      >
        <svg
          class="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" /></svg
        >Artifacts
      </RouterLink>
      <SessionSidebar
        heading="Recents"
        :sessions="sessions"
        :tracking="tracking"
        :tracking-pending="trackingPending"
        @track="trackSession"
        :selected="session"
        :loading="loading"
        :error="error"
        :has-more="hasMore"
        :busy="offline || creating || sessionBusy"
        :projects="projects"
        :key="profile"
        @archive="manageSession('archive', $event)"
        @delete="manageSession('delete', $event)"
        @project="(id, target) => manageSession('project', id, target)"
        @select="recentSession"
        @create="newChat"
        @more="loadSessions(true)"
        @retry="loadSessions()"
        @rename="rename"
      />
      <div
        class="sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]"
      >
        <label for="profile-field">Profile</label>
        <div class="drawer-account flex min-w-0 items-center gap-2">
          <select
            id="profile-field"
            class="profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white"
            :value="profile"
            @change="chooseProfile(($event.target as HTMLSelectElement).value)"
          >
            <option value="">Default profile</option>
            <option
              v-if="profile && !profiles.some((item) => item.name === profile)"
              :value="profile"
            >
              {{ profile }}
            </option>
            <option v-for="item in profiles" :key="item.name" :value="item.name">
              {{ item.name }}
            </option></select
          ><button
            class="drawer-chat grid size-11 shrink-0 place-items-center rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:opacity-55"
            aria-label="New chat"
            title="New chat"
            :disabled="offline || creating"
            @click="newChat"
          >
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path
                d="M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l1-5 7-7 5 5-7 7Z"
              />
            </svg></button
          ><button
            ref="settingsButton"
            class="drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]"
            aria-label="Settings"
            :aria-current="settingsPage ? 'page' : undefined"
            @click="showSettings()"
          >
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path
                d="m9 3-.6 2.5-2 .9L4 5.7l-2 3.5 1.8 1.8v2L2 14.8l2 3.5 2.4-.7 2 .9L9 21h6l.6-2.5 2-.9 2.4.7 2-3.5-1.8-1.8v-2L22 9.2l-2-3.5-2.4.7-2-.9L15 3Z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        <span
          ><span
            class="status-dot mr-2 inline-block size-2 rounded-full"
            :class="offline ? 'disconnected bg-[#dcae6e]' : 'bg-[#94c9a5]'"
          />{{ offline ? "Offline · read only" : "Connected through dashboard" }}</span
        >
      </div>
    </aside>
    <div
      v-if="drawer || drawerSwipe.dragging.value"
      class="scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden"
      :style="drawerSwipe.scrimStyle.value"
      @touchstart="drawerSwipe.start"
      @touchmove="drawerSwipe.move"
      @touchend="drawerSwipe.end"
      @touchcancel="drawerSwipe.cancel"
      @click.capture="drawerSwipe.click"
      @click="closeDrawer"
    />
    <main class="main-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <header class="topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8">
        <button
          ref="menuButton"
          class="mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]"
          aria-label="Open navigation"
          :aria-expanded="drawer"
          @click="openDrawer"
        >
          <svg
            class="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 13h12" />
          </svg>
        </button>
        <div class="min-w-0 flex-1">
          <h1 class="header-title truncate text-base font-medium">
            {{
              inboxPage
                ? "Inbox"
                : settingsPage
                  ? "Settings"
                  : artifactsPage
                    ? "Artifacts"
                    : scheduledPage
                      ? "Scheduled"
                      : projectsPage
                        ? "Projects"
                        : sessions.find((s) => s.id === session)?.title ||
                          (session ? "Conversation" : selectedProject?.label || "ChatHermes")
            }}
          </h1>
          <p
            v-if="!settingsPage && projectId && session && selectedProject"
            class="header-project-subtitle truncate text-xs text-[#a3a3a3]"
          >
            {{ selectedProject.label }}
          </p>
        </div>
        <span class="topbar-profile sr-only">{{ profile || "Current profile" }}</span>
        <div
          v-if="!settingsPage"
          ref="screenMenuWrap"
          class="screen-menu-wrap relative"
          @keydown.esc.stop.prevent="closeScreenMenu()"
        >
          <button
            ref="screenMenuButton"
            class="screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]"
            aria-label="Screen options"
            aria-haspopup="menu"
            :aria-expanded="screenMenu"
            aria-controls="screen-menu"
            @click="screenMenu = !screenMenu"
          >
            ···
          </button>
          <div
            v-if="screenMenu"
            id="screen-menu"
            class="screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl"
            role="menu"
            aria-label="Screen options"
            @click="closeScreenMenu()"
          >
            <span class="truncate px-3 py-2 text-xs text-[#a3a3a3]" role="presentation">{{
              profile || "Current profile"
            }}</span>
            <button
              v-if="inboxPage"
              role="menuitem"
              class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]"
              data-test="refresh-inbox"
              aria-label="Refresh inbox"
              @click="
                refreshInbox();
                inboxRevision++;
              "
            >
              Refresh inbox
            </button>
            <button
              class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]"
              role="menuitem"
              :disabled="
                offline ||
                creating ||
                (projectView &&
                  (!selectedProject ||
                    selectedProject.archived ||
                    (!selectedProject.isNoProject && !projectRoot(selectedProject))))
              "
              @click="
                projectView ? createSession() : newChat();
                closeScreenMenu();
              "
            >
              New chat
            </button>
            <button
              v-if="activeProjectContext"
              class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]"
              role="menuitem"
              :disabled="
                offline ||
                creating ||
                !selectedProject ||
                selectedProject.archived ||
                !projectRoot(selectedProject)
              "
              @click="
                createSession();
                closeScreenMenu();
              "
            >
              New Project Chat
            </button>
            <template v-if="scheduledPage">
              <button
                role="menuitem"
                data-test="refresh-scheduled"
                :disabled="!scheduledComponent || scheduledComponent.loading"
                @click="scheduledComponent?.retry()"
              >
                Refresh
              </button>
              <button
                v-if="scheduledComponent?.sessionId"
                role="menuitem"
                data-test="resume-scheduled-session"
                :disabled="offline || creating || scheduledComponent.loading"
                @click="recentSession(scheduledComponent.sessionId)"
              >
                Resume Session
              </button>
            </template>
            <template v-else-if="projectsPage">
              <button
                role="menuitemradio"
                :aria-checked="!archivedProjects"
                @click="showProjects(false)"
              >
                Active projects
              </button>
              <button
                role="menuitemradio"
                :aria-checked="archivedProjects"
                @click="showProjects(true)"
              >
                Archived projects
              </button>
            </template>
            <template
              v-else-if="
                !inboxPage && !scheduledPage && selectedProject && !selectedProject.isNoProject
              "
            >
              <button role="menuitem" @click="openProjectPage('edit')">Edit project</button>
              <button
                role="menuitem"
                :disabled="offline || !projectRoot(selectedProject)"
                @click="openProjectPage('instructions')"
              >
                Edit Instructions
              </button>
              <template v-if="!selectedProject.isAuto">
                <button
                  v-if="selectedProject.archived"
                  role="menuitem"
                  :disabled="projectBusy || offline"
                  @click="manageProject('archive', { id: projectId, restore: true })"
                >
                  Restore project
                </button>
                <button
                  v-else
                  role="menuitem"
                  :disabled="projectBusy || offline"
                  @click="confirmProject('archive')"
                >
                  Archive project
                </button>
                <button
                  class="project-danger"
                  role="menuitem"
                  :disabled="projectBusy || offline"
                  @click="confirmProject('delete')"
                >
                  Delete project
                </button>
              </template>
            </template>
          </div>
        </div>
      </header>
      <div
        v-if="projectConfirmation && selectedProject"
        class="project-confirmation mx-6"
        role="alertdialog"
        aria-labelledby="project-confirmation-text"
        @keydown.esc.stop.prevent="!projectBusy && dismissProjectConfirmation()"
      >
        <p id="project-confirmation-text">
          {{
            projectConfirmation === "delete"
              ? `Delete ${selectedProject.label}? This permanently removes the project and its folder associations. Files and chats will be kept.`
              : `Archive ${selectedProject.label}? You can restore it from Archived projects.`
          }}
        </p>
        <p v-if="manageError" role="alert" class="project-error">{{ manageError }}</p>
        <div class="project-actions">
          <button
            ref="projectConfirmCancel"
            class="project-button"
            :disabled="projectBusy"
            @click="dismissProjectConfirmation"
          >
            Cancel</button
          ><button
            class="project-button project-danger"
            :disabled="projectBusy || offline"
            @click="submitProjectConfirmation"
          >
            {{
              projectConfirmation === "delete" ? "Delete project permanently" : "Confirm archive"
            }}
          </button>
        </div>
      </div>
      <ChatInterface
        ref="chatPlane"
        @touchstart="drawerSwipe.start"
        @touchmove="drawerSwipe.move"
        @touchend="drawerSwipe.end"
        @touchcancel="drawerSwipe.cancel"
        @click.capture="drawerSwipe.click"
        :show-page="
          inboxPage ||
          settingsPage ||
          scheduledPage ||
          artifactsPage ||
          projectsPage ||
          !!projectPage ||
          projectView
        "
        :hide-composer="artifactsPage || (projectView && projectArtifacts)"
      >
        <template #page>
          <RouterView v-slot="{ Component }">
            <component
              :is="Component"
              :ref="scheduledPage ? setScheduledComponent : undefined"
              :key="profile"
              v-bind="pageProps"
            />
          </RouterView>
        </template>
      </ChatInterface>
      <footer class="app-footer shrink-0 bg-black" aria-hidden="true" />
    </main>
  </div>
</template>
