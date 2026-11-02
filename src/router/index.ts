import KanbanPage from "../features/kanban/pages/KanbanPage.vue";
import KanbanActions from "../features/kanban/KanbanActions.vue";
import InboxActions from "../features/inbox/components/InboxActions.vue";
import ProjectConfirmation from "../features/projects/components/ProjectConfirmation.vue";
import HomePage from "../features/chat/pages/HomePage.vue";
import ChatPage from "../features/chat/pages/ChatPage.vue";
import InboxPage from "../features/inbox/pages/InboxPage.vue";
import ArtifactsPage from "../features/artifacts/pages/ArtifactsPage.vue";
import ProjectsPage from "../features/projects/pages/ProjectsPage.vue";
import ProjectHomePage from "../features/projects/pages/ProjectHomePage.vue";
import ProjectArtifactsPage from "../features/projects/pages/ProjectArtifactsPage.vue";
import ProjectSettingsPage from "../features/projects/pages/ProjectSettingsPage.vue";
import ProjectInstructionsPage from "../features/projects/pages/ProjectInstructionsPage.vue";
import ScheduledListPage from "../features/scheduled/pages/ScheduledListPage.vue";
import ScheduledJobPage from "../features/scheduled/pages/ScheduledJobPage.vue";
import ScheduledRunPage from "../features/scheduled/pages/ScheduledRunPage.vue";
import SettingsPage from "../features/settings/pages/SettingsPage.vue";
import { createRouter, type RouterHistory } from "vue-router";
import { createPluginHistory } from "./history";
import {
  identifier,
  profileName,
  queryString,
  resolvePluginUrl,
  safeReturn,
  validProjectId,
} from "./links";
import ProjectActions from "../features/projects/components/ProjectActions.vue";
import ProjectsActions from "../features/projects/components/ProjectsActions.vue";
import ScheduledActions from "../features/scheduled/components/ScheduledActions.vue";
export function createChatHermesRouter(
  history: RouterHistory = createPluginHistory(),
  initialUrl?: string,
) {
  const router = createRouter({
    history,
    routes: [
      { path: "/", name: "home", components: { default: HomePage }, meta: { chat: true } },
      {
        path: "/chat/:sessionId",
        name: "chat",
        components: { default: ChatPage, actions: ProjectActions, dialogs: ProjectConfirmation },
        meta: { chat: true },
      },
      {
        path: "/inbox",
        name: "inbox",
        components: { default: InboxPage, actions: InboxActions },
        meta: { title: "Inbox" },
      },
      {
        path: "/artifacts",
        name: "artifacts",
        components: { default: ArtifactsPage },
        meta: { title: "Artifacts", hideComposer: true },
      },
      {
        path: "/projects",
        name: "projects",
        components: { default: ProjectsPage, actions: ProjectsActions },
        meta: { title: "Projects", section: "projects" },
      },
      {
        path: "/projects/:projectId",
        name: "project",
        components: {
          default: ProjectHomePage,
          actions: ProjectActions,
          dialogs: ProjectConfirmation,
        },
        meta: { section: "projects", composer: "project" },
      },
      {
        path: "/projects/:projectId/artifacts",
        name: "project-artifacts",
        components: {
          default: ProjectArtifactsPage,
          actions: ProjectActions,
          dialogs: ProjectConfirmation,
        },
        meta: { section: "projects", hideComposer: true },
      },
      {
        path: "/projects/:projectId/settings",
        name: "project-settings",
        components: {
          default: ProjectSettingsPage,
          actions: ProjectActions,
          dialogs: ProjectConfirmation,
        },
        meta: { section: "projects" },
      },
      {
        path: "/projects/:projectId/instructions",
        name: "project-instructions",
        components: {
          default: ProjectInstructionsPage,
          actions: ProjectActions,
          dialogs: ProjectConfirmation,
        },
        meta: { section: "projects" },
      },
      {
        path: "/scheduled",
        name: "scheduled",
        components: { default: ScheduledListPage, actions: ScheduledActions },
        meta: { title: "Scheduled", section: "scheduled" },
      },
      {
        path: "/scheduled/:jobId",
        name: "scheduled-job",
        components: { default: ScheduledJobPage, actions: ScheduledActions },
        meta: { title: "Scheduled", section: "scheduled" },
      },
      {
        path: "/scheduled/:jobId/:runId",
        name: "scheduled-run",
        components: { default: ScheduledRunPage, actions: ScheduledActions },
        meta: { title: "Scheduled", section: "scheduled" },
      },
      {
        path: "/settings",
        name: "settings",
        components: { default: SettingsPage },
        meta: { title: "Settings", hideComposer: true },
      },
      {
        path: "/kanban",
        name: "kanban",
        components: { default: KanbanPage, actions: KanbanActions },
        meta: { title: "Kanban", hideComposer: true },
      },
      { path: "/:pathMatch(.*)*", redirect: "/" },
    ],
  });
  router.beforeEach((to) => {
    const profile = queryString(to.query.profile);
    if (
      (to.query.profile && typeof to.query.profile !== "string") ||
      (profile && !profileName.test(profile)) ||
      Object.entries(to.params).some(([key, id]) =>
        key === "projectId" ? !validProjectId(id) : typeof id !== "string" || !identifier.test(id),
      ) ||
      (to.query.project && !validProjectId(to.query.project)) ||
      [to.query.session].some((id) => id && (typeof id !== "string" || !identifier.test(id)))
    )
      return { name: "home" };
    if (
      to.name === "settings" &&
      to.query.return_to &&
      safeReturn(to.query.return_to) !== to.query.return_to
    )
      return { name: "settings", query: { ...to.query, return_to: "/" }, replace: true };
  });
  // Restore a canonical document-entry hash if Hermes profile hydration removed it.
  const initial = initialUrl && resolvePluginUrl(initialUrl);
  if (initial) history.replace(initial);
  return router;
}
