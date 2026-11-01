import { useRoute } from "vue-router";
import { inject, provide, ref, watch, type Ref, type InjectionKey } from "vue";
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
  createSession: () => Promise<string | undefined>;
};
type ProjectContext = Context & { projectConfirmation: Ref<"delete" | "archive" | undefined> };
const key: InjectionKey<ProjectContext> = Symbol("projects");
export function provideProjects(context: Context) {
  const route = useRoute();
  const projectConfirmation = ref<"delete" | "archive">();
  watch(
    () => route.fullPath,
    () => {
      projectConfirmation.value = undefined;
    },
  );
  provide(key, { ...context, projectConfirmation });
}
export function useProjects() {
  const context = inject(key);
  if (!context) throw new Error("projects context is missing");
  return context;
}
