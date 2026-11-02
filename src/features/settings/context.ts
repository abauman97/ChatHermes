import type { provideKanban } from "../kanban/context";
import { inject, provide, type InjectionKey } from "vue";
import type { Ref } from "vue";
import type { PushState } from "../notifications/services/push";
import type { useWakeLock } from "./composables/useWakeLock";
type Context = {
  kanban: ReturnType<typeof provideKanban>;
  profile: Readonly<Ref<string>>;
  profiles: Readonly<Ref<{ name: string }[]>>;
  pushState: Readonly<Ref<PushState>>;
  pushBusy: Readonly<Ref<boolean>>;
  pushLoading: Readonly<Ref<boolean>>;
  pushMessage: Readonly<Ref<string>>;
  wakeLock: ReturnType<typeof useWakeLock>;
  chooseProfile: (id: string) => Promise<void> | undefined;
  togglePush: () => Promise<void>;
  testPush: () => Promise<void>;
  closeSettings: () => Promise<void>;
};
const key: InjectionKey<Context> = Symbol("settings");
export function provideSettings(context: Context) {
  provide(key, context);
}
export function useSettings() {
  const context = inject(key);
  if (!context) throw new Error("settings context is missing");
  return context;
}
