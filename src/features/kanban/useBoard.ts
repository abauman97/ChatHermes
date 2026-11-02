import { onUnmounted, ref, watch, type Ref } from "vue";
import { api, eventsUrl, KanbanError } from "./api";
import type { Board, Detail, WorkerLog } from "./types";

// Snapshot invalidation mirrors Desktop: events accelerate reads, polling is
// always the fallback. Each board/foreground lifetime owns its cursor and socket.
export function useBoard(
  board: Ref<string>,
  active: Readonly<Ref<boolean>>,
  archived: Ref<boolean>,
  unavailable: () => void,
) {
  const snapshot = ref<Board>(),
    detail = ref<Detail>(),
    log = ref<WorkerLog>();
  const taskId = ref(""),
    error = ref(""),
    loading = ref(false);
  const foreground = ref(document.visibilityState === "visible");
  const visibility = () => {
    foreground.value = document.visibilityState === "visible";
  };
  document.addEventListener("visibilitychange", visibility);
  onUnmounted(() => document.removeEventListener("visibilitychange", visibility));
  let refresh = async () => {};
  watch(
    [board, active, archived, foreground],
    ([slug, enabled, , visible], previous, cleanup) => {
      if (!enabled || slug !== previous?.[0]) {
        snapshot.value = undefined;
        detail.value = undefined;
        log.value = undefined;
        taskId.value = "";
      }
      error.value = "";
      loading.value = false;
      if (!enabled || !slug || !visible) {
        refresh = async () => {};
        return;
      }
      const controller = new AbortController();
      let disposed = false,
        running = false,
        dirty = false;
      let cursor: number | undefined;
      let socket: WebSocket | undefined;
      let dialing = false;
      let reconnect: ReturnType<typeof setTimeout> | undefined;
      let retry = 1000;
      async function read() {
        if (disposed) return;
        if (running) {
          dirty = true;
          return;
        }
        running = true;
        loading.value = !snapshot.value;
        try {
          const next = await api.board(slug, archived.value, controller.signal);
          if (disposed) return;
          snapshot.value = next;
          cursor ??= typeof next.latest_event_id === "number" ? next.latest_event_id : undefined;
          if (!socket && !reconnect && !dialing) void connect();
          error.value = "";
        } catch (err) {
          if (!disposed) {
            error.value =
              err instanceof KanbanError
                ? err.message
                : "Could not load Kanban. Retry when the dashboard is connected.";
            if (err instanceof KanbanError && [401, 403, 404, 503].includes(err.status)) {
              // A removed selected board is handled by the page's catalog refresh.
              if (err.status !== 404) unavailable();
            }
          }
        } finally {
          running = false;
          if (!disposed) {
            loading.value = false;
            if (dirty) {
              dirty = false;
              void read();
            }
          }
        }
      }
      async function connect() {
        if (disposed || dialing) return;
        dialing = true;
        try {
          const url = await eventsUrl(slug, cursor);
          if (disposed) return;
          const current = (socket = new WebSocket(url));
          current.onopen = () => {
            retry = 1000;
            void read();
            void readDetail();
          };
          current.onmessage = (event) => {
            if (disposed || socket !== current) return;
            try {
              const frame = JSON.parse(event.data);
              if (typeof frame.cursor === "number" && Number.isSafeInteger(frame.cursor))
                cursor = Math.max(cursor ?? 0, frame.cursor);
              if (Array.isArray(frame.events) && frame.events.length) {
                void read();
                void readDetail();
              }
            } catch {
              /* Ignore malformed frames; polling still reconciles. */
            }
          };
          current.onerror = () => current.close();
          current.onclose = () => {
            if (socket === current) socket = undefined;
            schedule();
          };
        } catch {
          schedule();
        } finally {
          dialing = false;
        }
      }
      function schedule() {
        if (disposed || reconnect) return;
        reconnect = setTimeout(() => {
          reconnect = undefined;
          void connect();
        }, retry);
        retry = Math.min(retry * 2, 30000);
      }
      let detailVersion = 0;
      let detailRequest: AbortController | undefined;
      async function readDetail() {
        const id = taskId.value;
        const version = ++detailVersion;
        detailRequest?.abort();
        if (!id || disposed) return;
        const request = (detailRequest = new AbortController());
        try {
          const [next, workerLog] = await Promise.all([
            api.task(slug, id, request.signal),
            api.log(slug, id, request.signal),
          ]);
          if (!disposed && version === detailVersion && taskId.value === id) {
            detail.value = next;
            log.value = workerLog;
          }
        } catch (err) {
          if (!disposed && version === detailVersion && !request.signal.aborted) {
            error.value = err instanceof KanbanError ? err.message : "Could not load task details.";
            if (err instanceof KanbanError && err.status === 404) {
              detail.value = undefined;
              log.value = undefined;
              taskId.value = "";
            }
          }
        }
      }
      const stopDetail = watch(taskId, () => {
        detail.value = undefined;
        log.value = undefined;
        void readDetail();
      });
      refresh = async () => {
        await Promise.all([read(), readDetail()]);
      };
      const poll = setInterval(() => void refresh(), 8000);
      void read();
      void readDetail();
      cleanup(() => {
        disposed = true;
        controller.abort();
        detailRequest?.abort();
        stopDetail();
        clearInterval(poll);
        clearTimeout(reconnect);
        socket?.close();
      });
    },
    { immediate: true, flush: "sync" },
  );
  return { snapshot, detail, log, taskId, error, loading, refresh: () => refresh() };
}
