import { createRouter, type RouterHistory } from "vue-router";
import { defineComponent } from "vue";
import { createPluginHistory } from "./history";
import {
  identifier,
  profileName,
  queryString,
  resolvePluginUrl,
  safeReturn,
  validProjectId,
} from "./links";
import ArtifactsPage from "../features/artifacts/components/ArtifactsPage.vue";
import ProjectsPage from "../features/projects/components/ProjectsPage.vue";
import ProjectRoute from "../features/projects/components/ProjectRoute.vue";
import SettingsPage from "../features/settings/components/SettingsPage.vue";
import ScheduledPage from "../features/scheduled/components/ScheduledPage.vue";
const ChatRoute = defineComponent({ render: () => null });
export function createChatHermesRouter(
  history: RouterHistory = createPluginHistory(),
  initialUrl?: string,
) {
  const router = createRouter({
    history,
    routes: [
      { path: "/", name: "home", component: ChatRoute },
      { path: "/chat/:sessionId", name: "chat", component: ChatRoute },
      { path: "/artifacts", name: "artifacts", component: ArtifactsPage },
      { path: "/projects", name: "projects", component: ProjectsPage },
      { path: "/projects/:projectId", name: "project", component: ProjectRoute },
      {
        path: "/projects/:projectId/artifacts",
        name: "project-artifacts",
        component: ProjectRoute,
      },
      { path: "/projects/:projectId/settings", name: "project-settings", component: ProjectRoute },
      {
        path: "/projects/:projectId/instructions",
        name: "project-instructions",
        component: ProjectRoute,
      },
      { path: "/scheduled", name: "scheduled", component: ScheduledPage },
      { path: "/scheduled/:jobId", name: "scheduled-job", component: ScheduledPage },
      { path: "/scheduled/:jobId/:runId", name: "scheduled-run", component: ScheduledPage },
      { path: "/settings", name: "settings", component: SettingsPage },
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
