import type { Board, Boards, Detail, WorkerLog, Workflow } from "./types";
const ROOT = "/api/plugins/kanban";
export class KanbanError extends Error {
  status: number;
  constructor(status: number) {
    super(
      status === 409
        ? "Hermes refused this operation in the task’s current state. Refresh and check its dependencies or worker."
        : `Kanban request failed (${status}).`,
    );
    this.status = status;
  }
}
export function kanbanUrl(path: string, board?: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams(params);
  if (board !== undefined) {
    if (!board) throw new Error("Select a board first.");
    query.set("board", board);
  }
  return ROOT + path + (query.size ? "?" + query : "");
}
export async function call<T>(
  path: string,
  options: RequestInit = {},
  board?: string,
  params?: Record<string, string>,
): Promise<T> {
  const headers = new Headers({ accept: "application/json" });
  if (options.body && !(options.body instanceof FormData))
    headers.set("content-type", "application/json");
  const response = await fetch(kanbanUrl(path, board, params), {
    ...options,
    headers,
    credentials: "same-origin",
    redirect: "error",
    cache: "no-store",
  });
  // Never display upstream errors: they can contain paths or provider credentials.
  if (!response.ok) throw new KanbanError(response.status);
  return response.json() as Promise<T>;
}
export const api = {
  boards: (signal?: AbortSignal) => call<Boards>("/boards", { signal }),
  workflow: (signal?: AbortSignal) => call<Workflow>("/workflow", { signal }),
  board: (board: string, archived: boolean, signal?: AbortSignal) =>
    call<Board>("/board", { signal }, board, { include_archived: String(archived) }),
  task: (board: string, id: string, signal?: AbortSignal) =>
    call<Detail>("/tasks/" + encodeURIComponent(id), { signal }, board),
  log: (board: string, id: string, signal?: AbortSignal) =>
    call<WorkerLog>(`/tasks/${encodeURIComponent(id)}/log`, { signal }, board, { tail: "16384" }),
  write: <T = { ok?: boolean; reason?: string; warning?: string }>(
    path: string,
    method: string,
    body: unknown,
    board?: string,
  ) =>
    call<T>(path, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }, board),
  upload: (board: string, id: string, file: File) => {
    const body = new FormData();
    body.set("file", file);
    return call(`/tasks/${encodeURIComponent(id)}/attachments`, { method: "POST", body }, board);
  },
};

// The host handles gated one-use tickets and loopback credentials. Never put
// gateway keys in this feature or reuse an authenticated URL across reconnects.
export async function eventsUrl(board: string, since?: number): Promise<string> {
  const build = window.__HERMES_PLUGIN_SDK__?.buildWsUrl;
  if (!build) throw new Error("Dashboard event authentication is unavailable.");
  const value = await build(ROOT + "/events", {
    board,
    ...(since === undefined ? {} : { since: String(since) }),
  });
  const url = new URL(value);
  if (
    url.host !== location.host ||
    url.protocol !== (location.protocol === "https:" ? "wss:" : "ws:")
  )
    throw new Error("Invalid dashboard event URL.");
  return url.href;
}
