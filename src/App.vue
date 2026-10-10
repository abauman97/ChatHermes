<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { api, ApiError } from "./services/hermes-api";
import { useNativeSession } from "./features/chat/runtime/native-session";
import type {
  Capabilities,
  Message,
  ModelOption,
  ProviderOption,
  Session,
  Project,
  ProjectAction,
} from "./types/hermes";
import { projectRoot, projectSessions } from "./features/projects/utils/projects";
import ArtifactBrowser from "./features/artifacts/ArtifactBrowser.vue";
const artifactsPage = ref(false),
  projectArtifacts = ref(false);
import ScheduledPage from "./features/scheduled/components/ScheduledPage.vue";
import ProjectsPage from "./features/projects/components/ProjectsPage.vue";
import SettingsPage from "./features/settings/components/SettingsPage.vue";
import ProjectSettings from "./features/projects/components/ProjectSettings.vue";
import ProjectInstructions from "./features/projects/components/ProjectInstructions.vue";
import * as push from "./features/notifications/services/push";
import { connectPushClient } from "./features/notifications/services/push-client";
import SessionSidebar from "./features/sessions/components/SessionSidebar.vue";
import ChatInterface from "./features/chat/components/ChatInterface.vue";
import { useChatController } from "./features/chat/composables/useChatController";
import { provideChat } from "./features/chat/context";
const chatInterfaceComponent = ref<InstanceType<typeof ChatInterface>>();
const scheduledPage = ref(false),
  scheduledPageKey = ref(0),
  scheduledDiscussionError = ref("");
const projectPage = ref<"" | "edit" | "instructions">(""),
  projectConfirmation = ref<"delete" | "archive">(),
  projectConfirmCancel = ref<HTMLButtonElement>();
const projectView = ref(false),
  projectsPage = ref(false),
  archivedProjects = ref(false),
  projectBusy = ref(false),
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
  closeProjectEvents = api.projectEvents(profile.value, refreshProjects);
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
const settingsPage = ref(false),
  settingsButton = ref<HTMLButtonElement | null>(null);
function contentView() {
  return artifactsPage.value
    ? "artifacts"
    : projectArtifacts.value
      ? "project-artifacts"
      : scheduledPage.value
        ? "scheduled"
        : projectsPage.value
          ? "projects"
          : projectPage.value
            ? "project-" + projectPage.value
            : projectView.value
              ? "project"
              : "";
}
const native = useNativeSession(() => {
  refreshProjects();
  void loadSessions();
});
const chat = useChatController(native, {
  profile,
  session,
  messages,
  chatLoading,
  chatError,
  canStream,
  scheduledPage,
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
  createSession,
  suggest,
  retryHistory: loadMessages,
});
provideChat(chat);
const nativeMode = canStream;
function urlState() {
  const params = new URLSearchParams(location.search);
  return {
    profile: params.get("profile") || "",
    session: params.get("session") || "",
    project: params.get("project") || "",
    view: params.get("view") || "",
    returnView: params.get("return_view") || "",
    archived: params.get("archived") === "1",
  };
}
function setUrl(replace = false) {
  const url = new URL(location.href);
  url.searchParams.delete("profile");
  url.searchParams.delete("session");
  url.searchParams.delete("project");
  url.searchParams.delete("view");
  url.searchParams.delete("return_view");
  url.searchParams.delete("archived");
  url.searchParams.delete("job");
  url.searchParams.delete("scheduled_run");
  if (settingsPage.value) {
    url.searchParams.set("view", "settings");
    if (contentView()) url.searchParams.set("return_view", contentView());
  } else if (artifactsPage.value) url.searchParams.set("view", "artifacts");
  else if (projectArtifacts.value && projectView.value)
    url.searchParams.set("view", "project-artifacts");
  else if (scheduledPage.value) url.searchParams.set("view", "scheduled");
  else if (projectsPage.value) {
    url.searchParams.set("view", "projects");
  } else if (projectPage.value) url.searchParams.set("view", "project-" + projectPage.value);
  else if (projectView.value) url.searchParams.set("view", "project");
  if (projectsPage.value && archivedProjects.value) url.searchParams.set("archived", "1");
  if (!scheduledPage.value && projectId.value) url.searchParams.set("project", projectId.value);
  if (profile.value) url.searchParams.set("profile", profile.value);
  if (!scheduledPage.value && session.value) url.searchParams.set("session", session.value);
  history[replace ? "replaceState" : "pushState"]({}, "", url.pathname + url.search + url.hash);
}
function showArtifacts(fromHistory = false) {
  settingsPage.value = false;
  scheduledPage.value = false;
  projectsPage.value = false;
  projectPage.value = "";
  projectView.value = false;
  projectArtifacts.value = false;
  artifactsPage.value = true;
  drawer.value = false;
  if (!fromHistory) setUrl();
}
async function artifactConversation(id: string, project?: string) {
  if (project) await chooseProject(project);
  else {
    projectId.value = "";
    selectedProject.value = undefined;
  }
  await chooseSession(id);
}
function showScheduled(fromHistory = false) {
  artifactsPage.value = false;
  projectArtifacts.value = false;
  settingsPage.value = false;
  projectPage.value = "";
  projectConfirmation.value = undefined;
  scheduledDiscussionError.value = "";
  scheduledPage.value = true;
  scheduledPageKey.value++;
  projectsPage.value = false;
  projectView.value = false;
  drawer.value = false;
  if (!fromHistory) setUrl();
}
async function discussScheduled(text: string) {
  if (offline.value || creating.value) return;
  const p = profile.value,
    owner = profileGeneration;
  creating.value = true;
  scheduledDiscussionError.value = "";
  try {
    const made = await api.create(p);
    if (owner !== profileGeneration || p !== profile.value || !scheduledPage.value) return;
    projectAbort?.abort();
    projectId.value = "";
    selectedProject.value = undefined;
    sessions.value = [made, ...sessions.value.filter((row) => row.id !== made.id)];
    await chooseSession(made.id);
    if (owner === profileGeneration && p === profile.value && session.value === made.id)
      suggestedPrompt.value = text;
  } catch {
    if (owner === profileGeneration && p === profile.value)
      scheduledDiscussionError.value = "Could not open a chat. Please try again.";
  } finally {
    if (owner === profileGeneration) creating.value = false;
  }
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
async function loadProjects() {
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
async function chooseProject(id: string, fromHistory = false) {
  artifactsPage.value = false;
  projectArtifacts.value = false;
  settingsPage.value = false;
  projectPage.value = "";
  projectConfirmation.value = undefined;
  scheduledPage.value = false;
  // Scope changes never touch the live/stored session or its working directory.
  projectAbort?.abort();
  projectsPage.value = false;
  manageError.value = "";
  projectId.value = id;
  projectView.value = !!id;
  selectedProject.value = undefined;
  projectError.value = "";
  drawer.value = false;
  if (!fromHistory) setUrl();
  await loadProject();
}
function showProjects(archived = false, fromHistory = false) {
  artifactsPage.value = false;
  projectArtifacts.value = false;
  settingsPage.value = false;
  projectPage.value = "";
  projectConfirmation.value = undefined;
  scheduledPage.value = false;
  projectAbort?.abort();
  projectLoading.value = false;
  projectsPage.value = true;
  projectView.value = false;
  archivedProjects.value = archived;
  drawer.value = false;
  manageError.value = "";
  if (!fromHistory) setUrl();
  void loadProjects();
}
async function recentSession(id: string) {
  if (!projectsLoaded.value) {
    cancelChat();
    const current = generation,
      p = profile.value;
    await loadProjects();
    if (current !== generation || p !== profile.value) return;
  }
  // Use gateway membership, including summary IDs beyond the preview page.
  const owner = projects.value.find(
    (project) =>
      project.sessionIds?.includes(id) || projectSessions(project).some((row) => row.id === id),
  );
  projectAbort?.abort();
  projectId.value = owner?.id || "";
  selectedProject.value = owner;
  projectsPage.value = false;
  projectError.value = "";
  await Promise.all([chooseSession(id), owner ? loadProject() : Promise.resolve()]);
}
async function newChat() {
  artifactsPage.value = false;
  projectArtifacts.value = false;
  settingsPage.value = false;
  projectPage.value = "";
  projectConfirmation.value = undefined;
  scheduledPage.value = false;
  projectAbort?.abort();
  projectId.value = "";
  selectedProject.value = undefined;
  projectView.value = false;
  projectsPage.value = false;
  return await createSession();
}
function openProjectPage(page: "edit" | "instructions", fromHistory = false) {
  settingsPage.value = false;
  if (!selectedProject.value || selectedProject.value.isNoProject) return;
  projectPage.value = page;
  projectView.value = true;
  manageError.value = "";
  closeScreenMenu(false);
  if (!fromHistory) setUrl();
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
    scope = projectId.value;
  projectBusy.value = true;
  manageError.value = "";
  try {
    const result = await api.projectManage(p, action, fields);
    if (owner !== profileGeneration || p !== profile.value) return;
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
async function loadSessions(more = false) {
  listAbort?.abort();
  const controller = new AbortController();
  listAbort = controller;
  const id = profile.value;
  loading.value = true;
  error.value = "";
  try {
    const result = await api.sessions(id, more ? offset.value : 0, controller.signal);
    if (controller !== listAbort || id !== profile.value) return;
    const page = result.sessions;
    sessions.value = more
      ? [
          ...sessions.value,
          ...page.filter((item) => !sessions.value.some((existing) => existing.id === item.id)),
        ]
      : page;
    offset.value =
      typeof result.offset === "number" && typeof result.limit === "number"
        ? result.offset + result.limit
        : more
          ? offset.value + page.length
          : page.length;
    hasMore.value =
      result.has_more ??
      (typeof result.total === "number" ? offset.value < result.total : page.length === 30);
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
async function chooseProfile(id: string, fromHistory = false) {
  artifactsPage.value = false;
  projectArtifacts.value = false;
  if (fromHistory) settingsPage.value = false;
  if (id && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) {
    error.value = "Invalid profile name";
    return;
  }
  scheduledPage.value = false;
  suggestedPrompt.value = "";
  creating.value = false;
  projectPage.value = "";
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
  projectView.value = false;
  projectsPage.value = false;
  archivedProjects.value = false;
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
  drawer.value = false;
  if (!fromHistory) setUrl();
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
async function chooseSession(id: string, fromHistory = false) {
  artifactsPage.value = false;
  projectArtifacts.value = false;
  settingsPage.value = false;
  scheduledPage.value = false;
  if (api.isNative(profile.value) || projectId.value) api.workspace(profile.value, id);
  else if (
    sessions.value.find((row) => row.id === id)?.cwd ||
    sessions.value.find((row) => row.id === id)?.source === "desktop"
  )
    api.workspace(profile.value, id);
  projectPage.value = "";
  projectConfirmation.value = undefined;
  projectView.value = false;
  projectsPage.value = false;
  suggestedPrompt.value = "";
  cancelChat();
  session.value = id;
  messages.value = [];
  chatError.value = "";
  drawer.value = false;
  if (!fromHistory) setUrl();
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
  subscribeProjectEvents();
  if (nativeMode.value) await native.attach(p, id);
  else await loadMessages();
}
async function createSession() {
  if (offline.value || creating.value || (projectId.value && selectedProject.value?.archived))
    return;
  const id = profile.value,
    scope = projectId.value,
    selected = session.value,
    current = generation;
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
      projectId.value !== scope
    )
      return;
    sessions.value = [made, ...sessions.value.filter((item) => item.id !== made.id)];
    // RPC drafts have no DB row until the first prompt; their normal resume path
    // can still hydrate them by stored ID. Keep the same chat components.
    const pending = chooseSession(made.id),
      selectionGeneration = generation;
    refreshProjects();
    await pending;
    if (selectionGeneration !== generation || profile.value !== id || session.value !== made.id)
      return;
    return made.id;
  } catch (cause) {
    if (current === generation && profile.value === id && projectId.value === scope) {
      const message = cause instanceof Error ? cause.message : "Could not create session";
      if (scope) projectError.value = message;
      else error.value = message;
    }
  } finally {
    creating.value = false;
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
async function visibilityChange() {
  await native.availability(document.visibilityState === "visible", navigator.onLine);
  if (document.visibilityState === "visible") refreshProjects();
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
async function restoreView(state: ReturnType<typeof urlState>) {
  const view = state.view === "settings" ? state.returnView : state.view;
  const pending = chooseProfile(state.profile, true);
  let current = generation;
  await pending;
  if (current !== generation || profile.value !== state.profile) return;
  if (view === "artifacts") showArtifacts(true);
  else if (view === "scheduled") showScheduled(true);
  else if (view === "projects") showProjects(state.archived, true);
  else if (state.project) {
    await chooseProject(state.project, true);
    if (current !== generation) return;
    if (view === "project-artifacts") projectArtifacts.value = true;
    else if (view === "project-edit" || view === "project-instructions")
      openProjectPage(view === "project-edit" ? "edit" : "instructions", true);
    else if (state.session && view !== "project") {
      const selected = chooseSession(state.session, true);
      current = generation;
      await selected;
    }
  } else if (state.session) {
    const selected = chooseSession(state.session, true);
    current = generation;
    await selected;
  }
  if (current === generation && state.view === "settings") await showSettings(true);
}
function pop() {
  const state = urlState();
  // Settings history never tears down an unchanged conversation or live stream.
  if (
    state.profile === profile.value &&
    state.session === (scheduledPage.value ? "" : session.value) &&
    state.project === (scheduledPage.value ? "" : projectId.value) &&
    (!projectsPage.value || state.archived === archivedProjects.value) &&
    ((state.view === "settings" && state.returnView === contentView()) ||
      (settingsPage.value && state.view === contentView()))
  ) {
    if (state.view === "settings") void showSettings(true);
    else void closeSettings(true);
    return;
  }
  void restoreView(state);
}
function closeDrawer() {
  drawer.value = false;
  menuButton.value?.focus();
}
async function openDrawer() {
  drawer.value = true;
  await nextTick();
  closeButton.value?.focus();
}
async function closeSettings(fromHistory = false) {
  settingsPage.value = false;
  if (!fromHistory) setUrl();
  await nextTick();
  // The drawer is hidden on mobile; restore focus to its visible opener.
  if (window.matchMedia?.("(min-width: 701px)").matches ?? true) settingsButton.value?.focus();
  else menuButton.value?.focus();
}
async function showSettings(fromHistory = false) {
  if (settingsPage.value) return;
  settingsPage.value = true;
  drawer.value = false;
  closeScreenMenu(false);
  if (!fromHistory) setUrl();
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
    !artifactsPage.value &&
    !scheduledPage.value &&
    !projectsPage.value &&
    !projectView.value &&
    !projectPage.value,
  connected: nativeMode.value && native.connection.value === "ready" && !offline.value,
}));
watch(notificationSession, () => pushClient?.publish(), { flush: "post" });
function serviceWorkerMessage(event: MessageEvent) {
  if (event.data?.type !== "chathermes.navigate" || typeof event.data.url !== "string") return;
  const url = new URL(event.data.url, location.origin);
  if (url.origin !== location.origin || url.pathname !== "/chathermes") return;
  history.pushState({}, "", url.pathname + url.search);
  pop();
}
onMounted(async () => {
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
  addEventListener("popstate", pop);
  addEventListener("keydown", drawerKey);
  document.addEventListener("click", screenMenuOutside);
  await restoreView(urlState());
});
onUnmounted(() => {
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
  removeEventListener("popstate", pop);
  removeEventListener("keydown", drawerKey);
  document.removeEventListener("click", screenMenuOutside);
});
</script>
<template>
  <div
    class="app-shell flex min-h-dvh bg-black font-sans text-white dark:bg-black dark:text-white"
    @dragenter="chatInterfaceComponent?.drag($event)"
    @dragover="chatInterfaceComponent?.dragOver($event)"
    @dragleave="chatInterfaceComponent?.leave()"
    @drop="chatInterfaceComponent?.drop($event)"
  >
    <aside
      class="sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-1 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white"
      :class="drawer ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Navigation"
    >
      <div class="brand mb-3 shrink-0 flex items-center gap-2.5 px-2 text-2xl font-semibold">
        <img
          class="brand-mark size-9 shrink-0 object-contain"
          alt=""
          :src="'/api/plugins/chathermes/assets/dist/icons/icon-192.png'"
        /><span>ChatHermes</span
        ><button
          ref="closeButton"
          class="mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          aria-label="Close navigation"
          @click="closeDrawer"
        >
          ×
        </button>
      </div>
      <button
        class="drawer-chat flex min-h-[44px] shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030] disabled:opacity-55"
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
          <path d="M14 4H4v16h16V10M12 12l9-9M16 3h5v5" /></svg
        >New chat
      </button>
      <button
        class="projects-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="projectsPage || projectView ? 'page' : undefined"
        @click="showProjects()"
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
      </button>

      <button
        class="scheduled-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="scheduledPage ? 'page' : undefined"
        @click="showScheduled()"
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
      </button>
      <button
        v-if="embedded"
        class="drawer-dashboard min-h-[44px] rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        @click="exitPlugin"
      >
        ← Hermes Desktop
      </button>
      <button
        class="artifacts-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]"
        :aria-current="artifactsPage ? 'page' : undefined"
        @click="showArtifacts()"
      >
        <span class="text-2xl" aria-hidden="true">▧</span>Artifacts
      </button>
      <SessionSidebar
        heading="Recents"
        :sessions="sessions"
        :selected="session"
        :loading="loading"
        :error="error"
        :has-more="hasMore"
        :busy="offline || creating"
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
      v-if="drawer"
      class="scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden"
      @click="closeDrawer"
    />
    <main class="main-panel flex h-dvh min-w-0 flex-1 flex-col">
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
        <div class="col-start-2 min-w-0 flex-1">
          <h1 class="header-title truncate text-base font-medium">
            {{
              artifactsPage
                ? "Artifacts"
                : settingsPage
                  ? "Settings"
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
            <template v-if="projectsPage">
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
            <template v-else-if="!scheduledPage && selectedProject && !selectedProject.isNoProject">
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
        ref="chatInterfaceComponent"
        :hide-composer="artifactsPage || projectArtifacts"
        :show-page="
          settingsPage ||
          artifactsPage ||
          scheduledPage ||
          projectsPage ||
          !!projectPage ||
          projectView
        "
      >
        <template #page>
          <SettingsPage
            v-if="settingsPage"
            :profile="profile"
            :profiles="profiles"
            :push-state="pushState"
            :push-busy="pushBusy"
            :push-loading="pushLoading"
            :push-message="pushMessage"
            @profile="chooseProfile"
            @toggle-push="togglePush"
            @test-push="testPush"
            @close="closeSettings()"
          />
          <ArtifactBrowser
            v-else-if="artifactsPage"
            :key="profile"
            :profile="profile"
            @conversation="artifactConversation"
          />
          <ScheduledPage
            v-else-if="scheduledPage"
            :key="`${profile}:${scheduledPageKey}`"
            :profile="profile"
            :chat-busy="creating"
            :offline="offline"
            :discussion-error="scheduledDiscussionError"
            @discuss="discussScheduled"
          />
          <ProjectsPage
            v-else-if="projectsPage"
            :key="profile"
            :projects="projects"
            :archived="archivedProjects"
            :loading="projectsLoading"
            :error="projectsError || manageError"
            :busy="projectBusy"
            :offline="offline"
            @select="chooseProject"
            @retry="loadProjects"
            @manage="manageProject"
          />
          <section
            v-else-if="projectPage && selectedProject"
            class="page-content project-editor"
            :aria-label="projectPage === 'edit' ? 'Edit project' : 'Edit Instructions'"
          >
            <button class="project-back" @click="chooseProject(projectId)">
              ← {{ selectedProject.label }}
            </button>
            <h2 class="text-2xl font-semibold">
              {{ projectPage === "edit" ? "Edit project" : "Edit Instructions" }}
            </h2>
            <ProjectSettings
              v-if="projectPage === 'edit'"
              :key="`${profile}:${selectedProject.id}`"
              :project="selectedProject"
              :busy="projectBusy"
              :offline="offline"
              :error="manageError"
              @manage="manageProject"
            />
            <ProjectInstructions
              v-else
              :key="`${profile}:${selectedProject.id}`"
              :profile="profile"
              :project-id="selectedProject.id"
              :offline="offline"
            />
          </section>
          <section
            v-else-if="projectView"
            class="project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10"
            aria-label="Selected Project"
          >
            <div class="project-home-content">
              <button class="project-back" @click="showProjects(!!selectedProject?.archived)">
                ← Projects
              </button>
              <p v-if="projectLoading" role="status">Loading Project…</p>
              <p v-if="projectError" class="mb-4 text-[#fecaca]" role="alert">
                {{ projectError }}
                <button class="underline" @click="loadProject">Retry Project</button>
              </p>
              <template v-if="selectedProject">
                <p v-if="selectedProject.archived" class="project-muted">Archived project</p>
                <p class="mb-4 break-all text-sm text-[#a3a3a3]">
                  {{
                    projectRoot(selectedProject)
                      ? "Workspace: " + projectRoot(selectedProject)
                      : selectedProject.isNoProject
                        ? "No project workspace"
                        : "No workspace configured"
                  }}
                </p>
                <div class="mb-5 flex gap-3" aria-label="Project view">
                  <button
                    class="rounded-xl bg-[#303030] px-4 py-3"
                    :aria-pressed="!projectArtifacts"
                    @click="
                      projectArtifacts = false;
                      setUrl();
                    "
                  >
                    Sessions / Chat</button
                  ><button
                    class="rounded-xl bg-[#303030] px-4 py-3"
                    :aria-pressed="projectArtifacts"
                    @click="
                      projectArtifacts = true;
                      setUrl();
                    "
                  >
                    Artifacts
                  </button>
                </div>
                <ArtifactBrowser
                  v-if="projectArtifacts"
                  :profile="profile"
                  :project-id="projectId"
                  @conversation="artifactConversation"
                />
                <template v-else>
                  <p v-if="!visibleSessions.length" class="text-sm text-[#b4b4b4]">
                    No conversations yet.
                  </p>
                  <nav class="project-chat-list" aria-label="Project chats">
                    <button
                      v-for="row in visibleSessions"
                      :key="row.id"
                      class="project-chat-row"
                      :aria-label="row.title || 'Untitled session'"
                      @click="chooseSession(row.id)"
                    >
                      <span class="project-chat-title">{{ row.title || "Untitled session" }}</span>
                      <span v-if="row.preview?.trim()" class="project-chat-preview">{{
                        row.preview
                      }}</span>
                    </button>
                  </nav>
                </template>
                <button class="project-back mt-5" @click="chooseProject('')">Other chats</button>
              </template>
            </div>
          </section>
        </template>
      </ChatInterface>
    </main>
  </div>
</template>
