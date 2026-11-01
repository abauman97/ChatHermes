import {
  inject,
  onScopeDispose,
  provide,
  ref,
  shallowRef,
  watch,
  type InjectionKey,
  type Ref,
} from "vue";
import { useRoute } from "vue-router";
import { api, ApiError, messageText } from "../../../services/hermes-api";
import type { ScheduledJob, ScheduledOutput } from "../../../types/hermes";
type Selection = ReturnType<typeof useScheduledHistory>;
type Context = {
  profile: Readonly<Ref<string>>;
  offline: Readonly<Ref<boolean>>;
  creating: Readonly<Ref<boolean>>;
  recentSession: (id: string) => unknown;
  current: Ref<Selection | undefined>;
};
const key: InjectionKey<Context> = Symbol("scheduled");
export function provideScheduled(dependencies: Omit<Context, "current">) {
  const context = { ...dependencies, current: shallowRef<Selection>() };
  provide(key, context);
  return context;
}
export function useScheduled() {
  const context = inject(key);
  if (!context) throw new Error("Scheduled context is missing");
  return context;
}
export function jobState(row: ScheduledJob) {
  return row.state === "completed" || row.state === "error"
    ? "completed"
    : row.state === "paused" || row.enabled === false
      ? "paused"
      : "active";
}
export function runDate(seconds: number) {
  return seconds > 0 ? new Date(seconds * 1000).toLocaleString() : "Run date unavailable";
}
export function lastRun(timestamp?: string) {
  if (!timestamp) return "Never run";
  const started = new Date(timestamp);
  return Number.isNaN(started.getTime())
    ? "Last run date unavailable"
    : "Last run: " + started.toLocaleString();
}
/** A request belongs to one mounted route page; identity/profile changes abort it. */
export function useScheduledHistory(
  load: (signal: AbortSignal, profile: string, jobId: string, runId: string) => Promise<void>,
) {
  const context = useScheduled(),
    route = useRoute();
  const loading = ref(false),
    error = ref(""),
    sessionId = ref<string>();
  let controller: AbortController | undefined,
    work: Promise<void> = Promise.resolve(),
    loaded = "",
    disposed = false;
  const destination = () =>
    JSON.stringify([context.profile.value, route.params.jobId, route.params.runId]);
  function retry() {
    controller?.abort();
    const request = (controller = new AbortController()),
      target = destination();
    loading.value = true;
    error.value = "";
    loaded = "";
    sessionId.value = undefined;
    work = (async () => {
      try {
        await load(
          request.signal,
          context.profile.value,
          String(route.params.jobId || ""),
          String(route.params.runId || ""),
        );
        if (!request.signal.aborted) loaded = target;
      } catch (cause) {
        if (!request.signal.aborted)
          error.value =
            cause instanceof ApiError && cause.status === 503
              ? "Scheduled history is unavailable in this Hermes version."
              : "Could not load scheduled history. The job or output may no longer be available.";
      } finally {
        if (controller === request) loading.value = false;
      }
    })();
    return work;
  }
  const state = {
    loading,
    error,
    sessionId,
    retry,
    async whenLoaded() {
      const target = destination();
      let pending;
      do {
        pending = work;
        await pending;
      } while (pending !== work);
      return !disposed && !error.value && loaded === target;
    },
  };
  context.current.value = state;
  watch([() => context.profile.value, () => route.params.jobId, () => route.params.runId], retry, {
    immediate: true,
  });
  onScopeDispose(() => {
    disposed = true;
    controller?.abort();
    if (context.current.value === state) context.current.value = undefined;
  });
  return state;
}
export async function readJob(profile: string, id: string, signal: AbortSignal) {
  const result = await api.scheduled(profile, signal);
  const job = result.jobs.find((row) => row.id === id);
  if (!job) throw new Error("Job unavailable");
  return job;
}
export function outputMessages(output: ScheduledOutput | undefined) {
  const text =
    messageText(
      output?.messages
        .slice()
        .reverse()
        .find((row) => row.role === "assistant" && messageText(row.content))?.content,
    ) || output?.output;
  return text ? [{ role: "assistant", content: text }] : [];
}
