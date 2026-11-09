import {
  notificationNavigationKey,
  type NotificationNavigation,
} from "../router/notification-navigation";
import { provideKanban } from "../features/kanban/context";
import { api as kanbanApi } from "../features/kanban/api";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { useProjectWorkspace } from "../features/projects/composables/useProjectWorkspace";
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { InboxItem } from "../features/inbox/inbox";
import { api } from "../services/hermes-api";
import { useNativeSession } from "../features/chat/runtime/native-session";
import { useSessionActivity } from "../features/sessions/composables/useSessionActivity";
import type {
  Capabilities,
  Message,
  ModelOption,
  ProviderOption,
  Session,
  SessionTracking,
} from "../types/hermes";
import { projectRoot, projectSessions } from "../features/projects/utils/projects";
import * as push from "../features/notifications/services/push";
import { connectPushClient } from "../features/notifications/services/push-client";
import ChatInterface from "../features/chat/components/ChatInterface.vue";
import { useChatController } from "../features/chat/composables/useChatController";
import { provideChat } from "../features/chat/context";
import { useDrawerSwipe } from "../composables/useDrawerSwipe";
import { useWakeLock } from "../features/settings/composables/useWakeLock";
import { useRoute, useRouter } from "vue-router";
import {
  destination,
  queryString,
  resolvePluginUrl,
  safeReturn,
  type RouteName,
} from "../router/links";
import { provideInbox } from "../features/inbox/context";
import { provideArtifacts } from "../features/artifacts/context";
import { provideSettings } from "../features/settings/context";
import { provideProjects } from "../features/projects/context";
import { provideScheduled } from "../features/scheduled/composables/useScheduledHistory";
export function useApplication() {
  const notificationNavigation = inject<NotificationNavigation | undefined>(
    notificationNavigationKey,
    undefined,
  );
  let disconnectNotificationNavigation: (() => void) | undefined;
  const router = useRouter(),
    route = useRoute();
  const isChat = computed(() => route.meta.chat === true);
  const projectView = computed(() => route.meta.composer === "project");
  const composerBlocked = computed(
    () =>
      (!isChat.value && !projectView.value) || queryString(route.query.profile) !== profile.value,
  );
  const draftEpoch = ref(0);
  const composerNavigation = ref(0);
  const composerKey = computed(() =>
    JSON.stringify([profile.value, composerNavigation.value, draftEpoch.value]),
  );
  const composerDraftKey = computed(() =>
    projectView.value ? JSON.stringify([route.fullPath, draftEpoch.value]) : "",
  );
  const settingsPage = computed(() => route.name === "settings");
  const scheduledPage = computed(() => route.meta.section === "scheduled");
  let scopeReady = false,
    profileInitialized = false;
  let profileWork: Promise<void> = Promise.resolve();
  let routeWork: Promise<void> = Promise.resolve();
  let drawerNavigationTarget = "";
  let navigationRevision = 0;
  let creationTransitionPath = "";
  let createRequest: AbortController | undefined;
  async function navigate(
    to: Parameters<typeof router.push>[0],
    replace = false,
    keepDrawer = false,
    creationTransition = false,
  ) {
    createRequest?.abort();
    if (creationTransition) creationTransitionPath = router.resolve(to).fullPath;
    else creating.value = false;
    drawerNavigationTarget = keepDrawer ? router.resolve(to).fullPath : "";
    if (!keepDrawer) drawer.value = false;
    closeScreenMenu(false);
    await router[replace ? "replace" : "push"](to);
    await routeWork;
    drawerNavigationTarget = "";
  }
  function screenLink(name: RouteName, extra: Record<string, string> = {}) {
    return destination(name, profile.value, extra);
  }
  const profile = ref(""),
    session = computed(() => (route.name === "chat" ? String(route.params.sessionId) : "")),
    sessions = ref<Session[]>([]),
    messages = ref<Message[]>([]);
  // Connection bookkeeping never selects the composer session.
  let attachedSession = "";
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
  const activity = useSessionActivity(profile);
  function updateNativeTitle(p: string, id: string, title: string) {
    if (p !== profile.value) return;
    sessions.value = sessions.value.map((row) => (row.id === id ? { ...row, title } : row));
  }
  const {
    projectBusy,
    manageError,
    projectId,
    projects,
    selectedProject,
    projectsLoading,
    projectLoading,
    projectsError,
    projectError,
    visibleSessions,
    subscribeProjectEvents,
    refreshProjects,
    loadProjects,
    loadProject,
    chooseProject,
    showProjects,
    manageProject,
    resetProjects,
    selectProjectScope,
  } = useProjectWorkspace({
    profile,
    sessions,
    offline,
    navigate,
    loadSessions,
    refreshInbox,
    profileGeneration: () => profileGeneration,
    refreshActivity: activity.refresh,
  });
  // Empty draft rows can exist in REST before gateway Project membership appears.
  // Retain only associations created by this tab, keyed by profile and session.
  const draftMemory = new Map<string, string>();
  const draftRevision = ref(0);
  const draftKey = (profile: string, id: string) =>
    `chathermes.project-draft:${encodeURIComponent(profile)}:${encodeURIComponent(id)}`;
  function draftProject(profile: string, id: string) {
    void draftRevision.value;
    const key = draftKey(profile, id);
    if (draftMemory.has(key)) return draftMemory.get(key)!;
    try {
      return sessionStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }
  function setDraftProject(profile: string, id: string, project: string) {
    const key = draftKey(profile, id);
    // Keep empty tombstones too: a failed remove must not revive stale storage.
    draftMemory.set(key, project);
    try {
      if (project) sessionStorage.setItem(key, project);
      else sessionStorage.removeItem(key);
    } catch {
      /* Storage can be unavailable in restricted browser contexts. */
    }
    draftRevision.value++;
  }
  const reconcilingDrafts = new Set<string>();
  async function reconcileStoredDraft(p: string, id: string) {
    const draft = draftProject(p, id),
      key = draftKey(p, id),
      owner = profileGeneration;
    if (!draft || reconcilingDrafts.has(key) || p !== profile.value) return;
    reconcilingDrafts.add(key);
    try {
      // Message persistence can precede the catalog read already in flight.
      // Only a successful read started after that evidence can prove absence.
      const catalog = await loadProjects();
      if (
        catalog &&
        owner === profileGeneration &&
        p === profile.value &&
        draftProject(p, id) === draft
      )
        setDraftProject(p, id, "");
    } finally {
      reconcilingDrafts.delete(key);
    }
  }
  const contextProject = computed(() => {
    if (session.value) {
      const member = projects.value.find(
        (project) =>
          project.sessionIds?.includes(session.value) ||
          projectSessions(project).some((row) => row.id === session.value),
      );
      if (member) return member.id;
      const draft = draftProject(profile.value, session.value);
      return projects.value.some((project) => project.id === draft) ? draft : "";
    }
    return typeof route.params.projectId === "string" ? route.params.projectId : "";
  });
  watch(
    [projects, profile],
    ([catalog, p]) => {
      if (queryString(route.query.profile) !== p) return;
      for (const project of catalog) {
        for (const id of [
          ...(project.sessionIds || []),
          ...projectSessions(project).map((row) => row.id),
        ]) {
          if (draftProject(p, id)) setDraftProject(p, id, "");
        }
      }
    },
    { flush: "sync" },
  );
  watch([projects, profile, session], async (_values, _previous, onCleanup) => {
    const p = profile.value,
      id = session.value;
    if (
      queryString(route.query.profile) !== p ||
      !id ||
      !draftProject(p, id) ||
      reconcilingDrafts.has(draftKey(p, id))
    )
      return;
    const controller = new AbortController();
    onCleanup(() => controller.abort());
    try {
      // Empty rows remain ambiguous. Stored messages require a fresh catalog
      // before retiring provisional scope, even outside the sidebar page.
      const row = await api.session(p, id, controller.signal);
      if (!controller.signal.aborted && row.id === id && (row.message_count ?? 0) > 0)
        await reconcileStoredDraft(p, id);
    } catch {
      // A 404 or unavailable read is not proof: retain the draft for first send.
    }
  });
  const native = useNativeSession(
    () => {
      refreshProjects();
      void loadSessions();
      void refreshInbox();
    },
    refreshNativeSessions,
    updateNativeTitle,
    deleteCurrentSessionInbox,
    activity.event,
  );
  const chat = useChatController(native, {
    profile,
    session,
    messages,
    chatLoading,
    chatError,
    canStream,
    composerBlocked,
    draftScope: composerDraftKey,
    projectView,
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
    navigation: () => router.currentRoute.value,
    createSession: () => materializeSession(false, true),
    suggest,
    retryHistory: loadMessages,
    openBranch: async (id: string) => {
      await chooseSession(id);
      refreshProjects();
      void loadSessions();
    },
  });
  provideChat({ ...chat, sessions: computed(() => sessions.value) });
  const wakeLock = useWakeLock();
  const kanban = provideKanban(offline);
  const scheduled = provideScheduled({ profile, offline, creating, recentSession });

  const nativeMode = canStream;
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
  function recentSession(id: string) {
    return chooseSession(id);
  }
  async function newChat() {
    return await materializeSession(true);
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
      // Tracking summaries and empty REST rows do not prove a first send.
      for (const row of result.sessions) {
        if ((row.message_count ?? 0) > 0 && draftProject(id, row.id))
          void reconcileStoredDraft(id, row.id);
      }
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

    cancel();
    resetProjects();
    profile.value = id;
    attachedSession = "";
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

    suggestedPrompt.value = "";
    attachedSession = id;
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
  async function openProjectDraft() {
    const selected = selectedProject.value;
    if (
      offline.value ||
      creating.value ||
      !projectId.value ||
      !selected ||
      selected.id !== projectId.value ||
      selected.archived ||
      (!selected.isNoProject && !projectRoot(selected)) ||
      queryString(route.query.profile) !== profile.value
    )
      return;
    draftEpoch.value++;
    await navigate({
      name: "project-draft",
      params: { projectId: projectId.value },
      query: profile.value ? { profile: profile.value } : {},
    });
  }
  async function materializeSession(unscoped = false, preserveComposer = false) {
    if (
      offline.value ||
      creating.value ||
      queryString(route.query.profile) !== profile.value ||
      (!unscoped &&
        projectId.value &&
        (!selectedProject.value ||
          selectedProject.value.id !== projectId.value ||
          selectedProject.value.archived ||
          (!selectedProject.value.isNoProject && !projectRoot(selectedProject.value))))
    )
      return;
    const id = profile.value,
      scope = unscoped ? "" : projectId.value,
      selected = session.value,
      revision = router.currentRoute.value,
      current = generation,
      owner = profileGeneration;
    const request = (createRequest = new AbortController());
    creating.value = true;
    try {
      if (scope && !provider.value) {
        provider.value = providers.value.find((item) => item.is_current)?.slug || "";
        model.value = "";
      }
      const made = scope ? await api.projectCreate(id, scope) : await api.create(id);
      if (
        request.signal.aborted ||
        current !== generation ||
        profile.value !== id ||
        session.value !== selected ||
        revision !== router.currentRoute.value
      )
        return;
      // RPC drafts can have empty REST rows before Project membership appears.
      // Their normal resume path hydrates the stored ID using the same components.
      if (scope) setDraftProject(id, made.id, scope);
      const transitionRevision = navigationRevision;
      await navigate(
        {
          name: "chat",
          params: { sessionId: made.id },
          query: id ? { profile: id } : {},
        },
        revision.name === "project-draft",
        false,
        preserveComposer,
      );
      if (navigationRevision !== transitionRevision + 1) return;
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
        !request.signal.aborted &&
        current === generation &&
        revision === router.currentRoute.value &&
        profile.value === id &&
        projectId.value === scope
      ) {
        const message = cause instanceof Error ? cause.message : "Could not create session";
        if (scope) projectError.value = message;
        else error.value = message;
      }
    } finally {
      if (owner === profileGeneration && createRequest === request) creating.value = false;
    }
  }
  async function suggest(text: string) {
    const current = generation,
      p = profile.value,
      id = await materializeSession();
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
      setDraftProject(p, id, action === "project" && draftProject(p, id) ? target : "");
      if (owner !== profileGeneration || p !== profile.value) return;
      invalidateSessionList();
      if (action !== "project") {
        removedSessions.add(id);
        sessions.value = sessions.value.filter((row) => row.id !== id);
      }
      if (current === generation && session.value === id) {
        if (action !== "project") await navigate({ name: "home", query: p ? { profile: p } : {} });
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
        ? destination("settings", id, {
            return_to: router.resolve(destination("home", id)).fullPath,
          })
        : destination("home", id),
      false,
      true,
    );
  }
  function chooseSession(id: string) {
    return navigate({
      name: "chat",
      params: { sessionId: id },
      query: profile.value ? { profile: profile.value } : {},
    });
  }
  async function applyScope(revision: RouteLocationNormalizedLoaded) {
    const p = queryString(route.query.profile);
    if (!profileInitialized || p !== profile.value) {
      profileInitialized = true;
      profileWork = applyProfile(p);
      await profileWork;
      if (revision !== router.currentRoute.value) return;
    }
    await profileWork;
    if (revision !== router.currentRoute.value) return;
    const nextSession = session.value;
    if (contextProject.value !== projectId.value) selectProjectScope(contextProject.value);
    if (nextSession !== attachedSession) {
      if (nextSession) await attachSession(nextSession);
      else {
        cancelChat();
        attachedSession = "";
        messages.value = [];
        suggestedPrompt.value = "";
      }
    }
    if (revision !== router.currentRoute.value || p !== profile.value) return;
    if (nextSession) await deleteCurrentSessionInbox(p, nextSession);
  }
  // Backend membership also updates after moves, project events and delayed catalog reads.
  watch(
    contextProject,
    (id) => {
      if (
        scopeReady &&
        queryString(route.query.profile) === profile.value &&
        id !== projectId.value
      )
        selectProjectScope(id);
    },
    { flush: "sync" },
  );
  watch(
    () => route.fullPath,
    () => {
      if (!route.matched.length) return;
      const revision = router.currentRoute.value;
      navigationRevision++;
      createRequest?.abort();
      // First-send materialization changes the URL, but its cleared composer
      // owns follow-up edits and attachment preparation made during creation.
      if (route.fullPath !== creationTransitionPath) {
        composerNavigation.value++;
        creating.value = false;
      }
      creationTransitionPath = "";
      if (session.value !== attachedSession || queryString(route.query.profile) !== profile.value) {
        cancelChat();
        attachedSession = "";
        messages.value = [];
        suggestedPrompt.value = "";
      }
      drawerSwipe.cancel();
      if (route.fullPath !== drawerNavigationTarget) drawer.value = false;
      closeScreenMenu(false);

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
    () => chatPlane.value?.$el.querySelector("[data-drawer-swipe]") || null,
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
    if (
      event.key !== "Escape" ||
      event.defaultPrevented ||
      (event.target instanceof Element && event.target.closest("dialog[open]"))
    )
      return;
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
    chat: isChat.value,
    scheduled:
      scheduledPage.value && route.params.jobId && route.params.runId
        ? { job: String(route.params.jobId), run: String(route.params.runId) }
        : undefined,
    connected: nativeMode.value && native.connection.value === "ready" && !offline.value,
  }));
  watch(notificationSession, () => pushClient?.publish(), { flush: "post" });
  async function serviceWorkerMessage(event: MessageEvent) {
    if (event.data?.type !== "chathermes.navigate" || typeof event.data.url !== "string") return;
    const url = event.data.url,
      target = resolvePluginUrl(url),
      port = event.ports?.[0];
    let loaded = false;
    try {
      if (!target) return;
      await navigate(target);
      const revision = router.currentRoute.value;
      const destination = router.resolve(target).fullPath;
      const current = () =>
        scopeReady && revision === router.currentRoute.value && route.fullPath === destination;
      if (!port || !current()) return;
      if (route.name === "chat") {
        // Native attachment reconstructs the viewer before saved history finishes.
        // Attest the loaded history, not just the URL or ready connection.
        if (nativeMode.value)
          loaded = native.connection.value === "ready" && (await native.hydrate()) === true;
        else loaded = !chatLoading.value && !chatError.value;
      } else if (scheduledPage.value) {
        await nextTick();
        loaded = (await scheduled.current.value?.whenLoaded()) === true;
      } else loaded = true;
      await nextTick();
      loaded = loaded && current();
    } catch {
      loaded = false;
    } finally {
      if (port) {
        if (loaded) port.postMessage({ type: "chathermes.navigated", url });
        port.close();
      }
    }
  }
  const inboxUnread = ref(0),
    inboxRevision = ref(0);
  const inboxUnreadSessions = ref(new Map<string, Set<string>>());
  const unreadSessions = computed(
    () => inboxUnreadSessions.value.get(profile.value || "default") || new Set<string>(),
  );
  let inboxTimer: ReturnType<typeof setInterval> | undefined;
  let inboxAbort: AbortController | undefined;
  let inboxFingerprint = "";
  async function refreshInbox(checkSession = true, periodic = false) {
    if (document.visibilityState === "hidden") return;
    // Let a complete paginated scan finish even when it spans several poll ticks.
    // Explicit refreshes still supersede reads started before a mutation.
    if (periodic && inboxAbort) return;
    inboxAbort?.abort();
    const current = (inboxAbort = new AbortController());
    try {
      const p = profile.value;
      const result = await api.inbox(p, { limit: 100, unread: true }, current.signal);
      const unread = new Map<string, Set<string>>();
      let page = result;
      do {
        if (current.signal.aborted) return;
        for (const item of page.items) {
          if (item.read) continue;
          const sessions = unread.get(item.profile) || new Set<string>();
          sessions.add(item.session);
          unread.set(item.profile, sessions);
        }
        if (!page.nextCursor) break;
        page = await api.inbox(
          p,
          { limit: 100, unread: true, cursor: page.nextCursor },
          current.signal,
        );
      } while (!current.signal.aborted);
      if (current.signal.aborted) return;
      inboxUnreadSessions.value = unread;
      inboxUnread.value = result.unread;
      if (checkSession) void deleteCurrentSessionInbox(profile.value, session.value);
      const fingerprint = JSON.stringify([result.revision, result.unread, result.items[0]?.id]);
      if (fingerprint !== inboxFingerprint) {
        inboxFingerprint = fingerprint;
        inboxRevision.value++;
      }
    } catch {
      /* Keep the last known count and session indicators during a disconnect. */
    } finally {
      if (inboxAbort === current) inboxAbort = undefined;
    }
  }
  const inboxCleanup = new Map<string, Promise<void>>();
  async function deleteCurrentSessionInbox(p: string, id: string) {
    const current = () =>
      scopeReady &&
      !!id &&
      p === profile.value &&
      id === session.value &&
      route.name === "chat" &&
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
    const revision = router.currentRoute.value;
    const history = await api.session(item.profile, item.session);
    if (revision !== router.currentRoute.value) throw new Error("Navigation changed");
    if (history.source === "kanban") {
      const target = history.kanban_task;
      if (!target) throw new Error("Task unavailable");
      await kanbanApi.task(target.board, target.task);
      if (!kanban.visible.value) {
        await kanban.check();
        if (!kanban.available.value) throw new Error("Kanban unavailable");
      }
      if (revision !== router.currentRoute.value) throw new Error("Navigation changed");
      // Opening a task is an explicit opt-in to its optional viewer.
      kanban.setEnabled(true);
      await navigate({
        name: "kanban",
        query: { profile: item.profile, board: target.board, task: target.task },
      });
      if (kanban.visible.value) {
        await api.deleteInboxItem(item.profile, item.id);
        await refreshInbox(false);
      }
      return;
    }
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
  onMounted(async () => {
    void refreshInbox();
    inboxTimer = setInterval(() => void refreshInbox(true, true), 15000);
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
    if (!notificationNavigation && "serviceWorker" in navigator)
      navigator.serviceWorker.addEventListener("message", serviceWorkerMessage);
    embedded.value = !!menuButton.value?.closest(".chathermes-embedded");
    document.addEventListener("visibilitychange", visibilityChange);
    addEventListener("online", onlineChange);
    addEventListener("offline", onlineChange);
    addEventListener("keydown", drawerKey);
    document.addEventListener("click", screenMenuOutside);
    await router.isReady();
    scopeReady = true;
    routeWork = applyScope(router.currentRoute.value);
    if (notificationNavigation && scopeReady)
      disconnectNotificationNavigation = notificationNavigation.connect(serviceWorkerMessage);
    await routeWork;
  });
  onUnmounted(() => {
    clearInterval(inboxTimer);
    inboxAbort?.abort();
    scopeReady = false;
    disconnectNotificationNavigation?.();
    router.options.history.destroy();
    pushClient?.stop();
    pushClient = undefined;
    profileGeneration++;
    document.removeEventListener("visibilitychange", visibilityChange);
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.removeEventListener("message", serviceWorkerMessage);
    cancel();
    removeEventListener("online", onlineChange);
    removeEventListener("offline", onlineChange);
    removeEventListener("keydown", drawerKey);
    document.removeEventListener("click", screenMenuOutside);
  });
  provideInbox({ profile, inboxRevision, openInboxItem, refreshInbox });
  provideArtifacts({ profile, projects, recentSession });
  provideSettings({
    kanban,
    profile,
    profiles,
    pushState,
    pushBusy,
    pushLoading,
    pushMessage,
    wakeLock,
    chooseProfile,
    togglePush,
    testPush,
    closeSettings,
  });
  provideProjects({
    profile,
    projectId,
    selectedProject,
    projects,
    projectsLoading,
    projectLoading,
    projectsError,
    projectError,
    manageError,
    projectBusy,
    offline,
    visibleSessions,
    chooseProject,
    showProjects,
    loadProject,
    loadProjects,
    recentSession,
    chooseSession,
    manageProject,
    openProjectDraft,
    creating,
  });
  return {
    composerKey,
    composerDraftKey,
    profile,
    session,
    sessions,
    projects,
    selectedProject,
    projectId,
    offline,
    creating,
    profiles,
    loading,
    error,
    hasMore,
    tracking,
    trackingPending,
    sessionBusy,
    drawer,
    embedded,
    menuButton,
    closeButton,
    screenMenuButton,
    screenMenuWrap,
    screenMenu,
    sidebar,
    chatPlane,
    drawerSwipe,
    kanban,
    settingsButton,
    inboxUnread,
    unreadSessions,
    workingSessions: activity.workingSessions,
    settingsPage,
    projectView,
    recentSession,
    chooseProfile,
    openProjectDraft,
    trackSession,
    newChat,
    loadSessions,
    manageSession,
    rename,
    exitPlugin,
    showSettings,
    openDrawer,
    closeDrawer,
    closeScreenMenu,
    screenLink,
  };
}
