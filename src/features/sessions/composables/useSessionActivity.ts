import { onScopeDispose, ref, watch, type Ref } from "vue";
import { api } from "../../../services/hermes-api";

/** Per-mount, profile-owned liveness. Navigation never owns or clears this map. */
export function useSessionActivity(profile: Ref<string>) {
  const workingSessions = ref(new Set<string>());
  let controller: AbortController | undefined;
  let generation = 0;
  let pending = false;
  let stopped = false;
  let groups: string[][] = [];
  let runtimeGroups = new Map<string, string[]>();
  let revision = 0;
  const revisions = new Map<string, number>();
  function event(owner: string, id: string, working: boolean) {
    if (stopped || (owner || "default") !== (profile.value || "default")) return;
    const ids = groups.find((keys) => keys.includes(id)) || [id];
    const next = new Set(workingSessions.value);
    revision++;
    for (const key of ids) {
      revisions.set(key, revision);
      if (working) next.add(key);
      else next.delete(key);
    }
    workingSessions.value = next;
  }
  async function refresh() {
    if (stopped || document.visibilityState === "hidden" || !navigator.onLine) return;
    if (controller) {
      pending = true;
      return;
    }
    const request = (controller = new AbortController());
    const timeout = setTimeout(() => request.abort(), 10000);
    const owner = generation;
    const before = new Map(revisions);
    try {
      const result = await api.sessionActivity(profile.value, request.signal);
      if (owner !== generation || request.signal.aborted) return;
      if (
        !Array.isArray(result.sessions) ||
        result.sessions.some(
          (row) =>
            !row ||
            typeof row.id !== "string" ||
            typeof row.session_key !== "string" ||
            (row.session_keys_complete !== undefined &&
              typeof row.session_keys_complete !== "boolean") ||
            (row.session_keys !== undefined &&
              (!Array.isArray(row.session_keys) ||
                row.session_keys.some((key) => typeof key !== "string"))) ||
            !["idle", "starting", "working", "waiting", "unknown"].includes(row.status),
        )
      )
        throw new Error("Invalid activity snapshot");
      // Desktop treats waiting as busy, but starting alone is not working.
      // Absence reaps work that finished while events were disconnected.
      groups = result.sessions.map((row) => {
        const previous = runtimeGroups.get(row.id) || [];
        // Lineage availability is independent of native busy status. Reuse only
        // this profile's verified runtime aliases while its identity still joins
        // that lineage; runtime IDs alone cannot bridge a reset/reused runtime.
        const incomplete =
          row.session_keys_complete === false ||
          (row.session_keys_complete === undefined && row.status === "unknown");
        return [
          ...new Set([
            row.session_key,
            ...(row.session_keys || []),
            ...(incomplete && previous.includes(row.session_key) ? previous : []),
          ]),
        ];
      });
      runtimeGroups = new Map(result.sessions.map((row, index) => [row.id, groups[index]!]));
      const next = new Set<string>();
      for (const [index, row] of result.sessions.entries()) {
        const keys = groups[index]!;
        // A newer event on ANY compression identity supersedes this row. Apply
        // it to the whole lineage, including identities first learned here.
        const changed = keys.filter((key) => revisions.get(key) !== before.get(key));
        const working = changed.length
          ? workingSessions.value.has(
              changed.sort((a, b) => revisions.get(b)! - revisions.get(a)!)[0]!,
            )
          : row.status === "unknown"
            ? keys.some((key) => workingSessions.value.has(key))
            : row.status === "working" || row.status === "waiting";
        if (working) keys.forEach((key) => next.add(key));
      }
      for (const [id, revision] of revisions) {
        if (revision === before.get(id) || groups.some((keys) => keys.includes(id))) continue;
        if (workingSessions.value.has(id)) next.add(id);
        else next.delete(id);
      }
      workingSessions.value = next;
    } catch {
      // Unavailable/unsupported is not idle. Keep known event state.
    } finally {
      clearTimeout(timeout);
      if (controller === request) {
        controller = undefined;
        if (pending) {
          pending = false;
          void refresh();
        }
      }
    }
  }
  watch(
    profile,
    () => {
      generation++;
      controller?.abort();
      controller = undefined;
      pending = false;
      revisions.clear();
      groups = [];
      runtimeGroups.clear();
      workingSessions.value = new Set();
      void refresh();
    },
    { immediate: true, flush: "sync" },
  );
  // Background sessions need no transcript viewer, resume, focus or lease.
  const timer = setInterval(() => void refresh(), 5000);
  const returned = () => void refresh();
  document.addEventListener("visibilitychange", returned);
  window.addEventListener("online", returned);
  window.addEventListener("focus", returned);
  onScopeDispose(() => {
    stopped = true;
    generation++;
    controller?.abort();
    controller = undefined;
    pending = false;
    clearInterval(timer);
    document.removeEventListener("visibilitychange", returned);
    window.removeEventListener("online", returned);
    window.removeEventListener("focus", returned);
  });
  return { workingSessions, event, refresh };
}
