// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { api, KanbanError, kanbanUrl } from "./api";
afterEach(() => vi.unstubAllGlobals());
describe("authenticated Kanban REST contract", () => {
  it("pins every board resource and uploads multipart using the existing API", async () => {
    const fetcher = vi.fn(async (_url: string, _options: RequestInit) => new Response("{}"));
    vi.stubGlobal("fetch", fetcher);
    await api.board("a b", true);
    await api.task("second", "task/1");
    await api.write("/tasks/task-1", "PATCH", { status: "ready" }, "second");
    await api.upload("second", "task-1", new File(["hello"], "note.txt"));
    expect(fetcher.mock.calls[0]?.[0]).toBe(
      "/api/plugins/kanban/board?include_archived=true&board=a+b",
    );
    expect(fetcher.mock.calls[1]?.[0]).toBe("/api/plugins/kanban/tasks/task%2F1?board=second");
    for (const [, options] of fetcher.mock.calls as unknown as [string, RequestInit][]) {
      expect(options.credentials).toBe("same-origin");
      expect(options.redirect).toBe("error");
    }
    const upload = (fetcher.mock.calls as unknown as [string, RequestInit][])[3]![1];
    expect(upload.body).toBeInstanceOf(FormData);
    expect(new Headers(upload.headers).has("content-type")).toBe(false);
    expect(() => kanbanUrl("/board", "")).toThrow("Select a board");
  });
  it("never renders upstream error bodies and distinguishes transition conflicts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("sensitive provider diagnostics", { status: 409 })),
    );
    await expect(api.write("/tasks/t", "PATCH", { status: "done" }, "one")).rejects.toBeInstanceOf(
      KanbanError,
    );
    await expect(api.write("/tasks/t", "PATCH", {}, "one")).rejects.toThrow("Hermes refused");
  });
});

it("uses fresh host SDK event authentication for every dial and refuses cross-origin URLs", async () => {
  const { eventsUrl } = await import("./api");
  const buildWsUrl = vi.fn(async (path: string, params: Record<string, string>) => {
    const url = new URL(path, location.origin);
    url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
    url.search = String(new URLSearchParams(params));
    return url.href;
  });
  vi.stubGlobal("__HERMES_PLUGIN_SDK__", { buildWsUrl });
  await eventsUrl("one", 12);
  await eventsUrl("one", 14);
  expect(buildWsUrl).toHaveBeenCalledTimes(2);
  expect(buildWsUrl).toHaveBeenLastCalledWith("/api/plugins/kanban/events", {
    board: "one",
    since: "14",
  });
  buildWsUrl.mockResolvedValue("wss://foreign.invalid/events");
  await expect(eventsUrl("one")).rejects.toThrow("Invalid dashboard event URL");
});
