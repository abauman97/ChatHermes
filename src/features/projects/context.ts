import { useRoute } from "vue-router";
import { inject, provide, readonly, ref, watch, type Ref, type InjectionKey } from "vue";
import type { useProjectWorkspace } from "./composables/useProjectWorkspace";
type Context = Pick<
  ReturnType<typeof useProjectWorkspace>,
  | "projectId"
  | "selectedProject"
  | "projects"
  | "projectsLoading"
  | "projectLoading"
  | "projectsError"
  | "projectError"
  | "manageError"
  | "projectBusy"
  | "visibleSessions"
  | "chooseProject"
  | "showProjects"
  | "loadProject"
  | "loadProjects"
  | "manageProject"
> & {
  profile: Readonly<Ref<string>>;
  offline: Readonly<Ref<boolean>>;
  creating: Readonly<Ref<boolean>>;
  recentSession: (id: string) => Promise<void>;
  chooseSession: (id: string) => Promise<void>;
  openProjectDraft: () => Promise<void>;
};
type ProjectContext = Context & {
  projectConfirmation: Ref<"delete" | "archive" | undefined>;
  hideAutomaticProjects: Readonly<Ref<boolean>>;
  toggleAutomaticProjects: () => void;
};
const STORAGE_KEY = "chathermes.hide-automatic-projects";
function hideAutomaticPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}
const key: InjectionKey<ProjectContext> = Symbol("projects");
export function provideProjects(context: Context) {
  const route = useRoute();
  const projectConfirmation = ref<"delete" | "archive">();
  const hideAutomaticProjects = ref(hideAutomaticPreference());
  function toggleAutomaticProjects() {
    hideAutomaticProjects.value = !hideAutomaticProjects.value;
    try {
      localStorage.setItem(STORAGE_KEY, String(hideAutomaticProjects.value));
    } catch {
      // The preference still applies for this mount when browser storage is unavailable.
    }
  }
  watch(
    () => route.fullPath,
    () => {
      projectConfirmation.value = undefined;
    },
  );
  provide(key, {
    ...context,
    projectConfirmation,
    hideAutomaticProjects: readonly(hideAutomaticProjects),
    toggleAutomaticProjects,
  });
}
export function useProjects() {
  const context = inject(key);
  if (!context) throw new Error("projects context is missing");
  return context;
}
