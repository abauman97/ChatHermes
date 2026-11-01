import { computed, ref, onScopeDispose, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api, ApiError } from "../../../services/hermes-api";
import type { Project, ProjectAction, Session } from "../../../types/hermes";
import { projectSessions } from "../utils/projects";
import { destination } from "../../../router/links";
import type { RouteLocationRaw } from "vue-router";
/** Shared gateway-owned workspace data used by the sidebar, chat creation and project pages. */
export function useProjectWorkspace(dependencies: {
  profile: Ref<string>;
  session: Ref<string>;
  sessions: Ref<Session[]>;
  offline: Ref<boolean>;
  navigate: (to: RouteLocationRaw) => Promise<void>;
  loadSessions: () => Promise<void>;
  refreshInbox: () => Promise<void>;
  profileGeneration: () => number;
}) {
  const { profile, session, sessions, offline, navigate } = dependencies;
  const route = useRoute(),
    router = useRouter();
  const archivedProjects = computed(() => route.query.archived === "1");
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
      void dependencies.refreshInbox();
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
      if (controller !== projectsAbort || controller.signal.aborted || p !== profile.value) return;
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
        ? {
            ...(destination("project", profile.value, session.value, id) as object),
            params: { projectId: id },
          }
        : destination("home", profile.value, session.value),
    );
  }
  function showProjects(archived = false) {
    return navigate(
      destination(
        "projects",
        profile.value,
        session.value,
        projectId.value,
        archived ? { archived: "1" } : {},
      ),
    );
  }

  async function manageProject(action: ProjectAction, fields: Record<string, string | boolean>) {
    if (projectBusy.value || offline.value) return;
    const p = profile.value,
      owner = dependencies.profileGeneration(),
      scope = projectId.value,
      revision = router.currentRoute.value;
    projectBusy.value = true;
    manageError.value = "";
    try {
      const result = await api.projectManage(p, action, fields);
      if (
        owner !== dependencies.profileGeneration() ||
        p !== profile.value ||
        revision !== router.currentRoute.value
      )
        return;
      if (action === "create" && result.project?.id) await chooseProject(result.project.id);
      else if (scope === projectId.value && route.name !== "projects") {
        if (action === "delete") {
          projectId.value = "";
          selectedProject.value = undefined;
          void showProjects(archivedProjects.value);
        } else if (action === "archive") {
          projectId.value = "";
          selectedProject.value = undefined;
          void showProjects(fields.restore !== true);
        } else await loadProject();
      }
      if (owner === dependencies.profileGeneration()) {
        await loadProjects();
        await dependencies.loadSessions();
      }
    } catch {
      if (
        owner === dependencies.profileGeneration() &&
        p === profile.value &&
        revision === router.currentRoute.value
      )
        manageError.value = "Could not save the project. Check its fields and try again.";
    } finally {
      if (owner === dependencies.profileGeneration()) projectBusy.value = false;
    }
  }

  function resetProjects() {
    projectsAbort?.abort();
    projectAbort?.abort();
    closeProjectEvents?.();
    closeProjectEvents = undefined;
    clearTimeout(refreshTimer);
    projectsLoaded.value = false;
    scopedSessionIds.value = [];
    projectId.value = "";
    projectBusy.value = false;
    manageError.value = "";
    selectedProject.value = undefined;
    projects.value = [];
    projectError.value = "";
    projectsError.value = "";
    projectLoading.value = false;
  }
  function selectProjectScope(id: string) {
    projectAbort?.abort();
    projectId.value = id;
    selectedProject.value = undefined;
    projectError.value = "";
    projectLoading.value = false;
    if (id) void loadProject();
  }
  onScopeDispose(() => {
    closeProjectEvents?.();
    clearTimeout(refreshTimer);
    projectsAbort?.abort();
    projectAbort?.abort();
  });
  return {
    projectBusy,
    manageError,
    projectId,
    projects,
    selectedProject,
    projectsLoading,
    projectLoading,
    projectsError,
    projectError,
    projectsLoaded,
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
    whenProjectsLoaded: () => projectsWork,
  };
}
