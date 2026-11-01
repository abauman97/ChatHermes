import { inject, provide, type InjectionKey } from "vue";
import type { Ref } from "vue";
import type { Project } from "../../types/hermes";
type Context = {
  profile: Readonly<Ref<string>>;
  projects: Readonly<Ref<Project[]>>;
  recentSession: (id: string) => Promise<void>;
};
const key: InjectionKey<Context> = Symbol("artifacts");
export function provideArtifacts(context: Context) {
  provide(key, context);
}
export function useArtifacts() {
  const context = inject(key);
  if (!context) throw new Error("artifacts context is missing");
  return context;
}
