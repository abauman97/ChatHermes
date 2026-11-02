import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  readonly,
  ref,
  shallowRef,
  watch,
  type InjectionKey,
  type Ref,
} from "vue";
import { api } from "./api";
export interface KanbanScreenAction {
  label: string;
  disabled?: boolean;
  checked?: boolean;
  run: () => void;
}
const STORAGE_KEY = "chathermes.kanban-viewer";
const key: InjectionKey<ReturnType<typeof createKanban>> = Symbol("kanban");
function preference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}
function createKanban(offline: Readonly<Ref<boolean>>) {
  const screenActions = shallowRef<KanbanScreenAction[]>([]);
  const enabled = ref(preference()),
    available = ref(false),
    checking = ref(false);
  let request: AbortController | undefined;
  let generation = 0;
  async function check() {
    const token = ++generation;
    request?.abort();
    const controller = (request = new AbortController());
    if (offline.value) {
      available.value = false;
      checking.value = false;
      return;
    }
    checking.value = true;
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const boards = await api.boards(controller.signal);
      // A 200 HTML login page or a different plugin response is not availability.
      if (token === generation)
        available.value =
          Array.isArray(boards.boards) &&
          typeof boards.current === "string" &&
          boards.boards.every((b) => typeof b.slug === "string" && !!b.slug);
    } catch {
      if (token === generation) available.value = false; /* Fail closed. */
    } finally {
      clearTimeout(timeout);
      if (token === generation) checking.value = false;
    }
  }
  function setEnabled(value: boolean) {
    if (value && (!available.value || checking.value)) return;
    enabled.value = value;
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* Mount-local preference still works. */
    }
  }
  // This plugin has one same-origin backend; remount, online and foreground
  // transitions are its connection boundaries, unlike Desktop's remote registry.
  function foreground() {
    if (document.visibilityState === "visible") void check();
  }
  let timer: ReturnType<typeof setInterval> | undefined;
  watch(offline, () => void check());
  onMounted(() => {
    void check();
    document.addEventListener("visibilitychange", foreground);
    window.addEventListener("online", foreground);
    timer = setInterval(() => {
      if (document.visibilityState === "visible" && !checking.value) void check();
    }, 30000);
  });
  onUnmounted(() => {
    generation++;
    request?.abort();
    clearInterval(timer);
    document.removeEventListener("visibilitychange", foreground);
    window.removeEventListener("online", foreground);
  });
  return {
    screenActions,
    enabled: readonly(enabled),
    available: readonly(available),
    checking: readonly(checking),
    visible: computed(() => enabled.value && available.value && !offline.value),
    setEnabled,
    check,
    unavailable: () => {
      available.value = false;
    },
  };
}
export function provideKanban(offline: Readonly<Ref<boolean>>) {
  const value = createKanban(offline);
  provide(key, value);
  return value;
}
export function useKanban() {
  const value = inject(key);
  if (!value) throw new Error("kanban context is missing");
  return value;
}
