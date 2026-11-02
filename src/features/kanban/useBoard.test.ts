// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import { ref } from "vue";
import { api, KanbanError } from "./api";
import { useBoard } from "./useBoard";
import type { Board } from "./types";
vi.mock("./api", async (original) => ({
  ...(await original<object>()),
  api: { board: vi.fn(), task: vi.fn(), log: vi.fn() },
}));
class Socket {
  static all: Socket[] = [];
  onopen?: () => void;
  onmessage?: (event: { data: string }) => void;
  onclose?: () => void;
  onerror?: () => void;
  close = vi.fn(() => this.onclose?.());
  constructor(publicUrl: string | URL) {
    this.url = String(publicUrl);
    Socket.all.push(this);
  }
  url: string;
}
const wrappers: ReturnType<typeof mount>[] = [];
const boardData = (id = "one", cursor = 4): Board => ({
  columns: [{ name: "todo", tasks: [{ id, title: id, status: "todo" }] }],
  assignees: [],
  latest_event_id: cursor,
});
beforeEach(() => {
  vi.useFakeTimers();
  Socket.all = [];
  vi.stubGlobal("WebSocket", Socket);
  vi.stubGlobal("__HERMES_PLUGIN_SDK__", {
    buildWsUrl: vi.fn(async (path: string, params: Record<string, string>) => {
      const url = new URL(path, location.origin);
      url.protocol = "ws:";
      url.search = String(new URLSearchParams(params));
      return url.href;
    }),
  });
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  vi.mocked(api.board).mockImplementation(async (slug) => boardData(slug));
  vi.mocked(api.task).mockResolvedValue({
    task: { id: "t", title: "task", status: "todo" },
    comments: [],
    events: [],
    runs: [],
    links: { parents: [], children: [] },
  });
  vi.mocked(api.log).mockResolvedValue({ exists: false, content: "", truncated: false });
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
function setup() {
  const selected = ref("one"),
    active = ref(true),
    archived = ref(false);
  let state!: ReturnType<typeof useBoard>;
  const wrapper = mount({
    setup() {
      state = useBoard(selected, active, archived, vi.fn());
      return () => null;
    },
  });
  wrappers.push(wrapper);
  return { state, selected, active, wrapper };
}
describe("Kanban snapshot and event lifecycle", () => {
  it("starts at snapshot tail, invalidates task details, reconnects with cursor and polls without a socket", async () => {
    const { state } = setup();
    await flushPromises();
    expect(Socket.all[0]!.url).toContain("board=one&since=4");
    state.taskId.value = "t";
    await flushPromises();
    vi.mocked(api.task).mockClear();
    Socket.all[0]!.onmessage?.({ data: JSON.stringify({ cursor: 9, events: [{ task_id: "t" }] }) });
    await flushPromises();
    expect(api.task).toHaveBeenCalled();
    Socket.all[0]!.close();
    await vi.advanceTimersByTimeAsync(1000);
    expect(Socket.all[1]!.url).toContain("since=9");
    const calls = vi.mocked(api.board).mock.calls.length;
    await vi.advanceTimersByTimeAsync(8000);
    await flushPromises();
    expect(vi.mocked(api.board).mock.calls.length).toBeGreaterThan(calls);
  });
  it("rejects late board snapshots and event callbacks after switches, and cleans up on disable", async () => {
    let resolve!: (value: Board) => void;
    vi.mocked(api.board).mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const { state, selected, active } = setup();
    selected.value = "two";
    await flushPromises();
    resolve(boardData("obsolete"));
    await flushPromises();
    expect(state.snapshot.value?.columns[0]?.tasks[0]?.id).toBe("two");
    expect(Socket.all).toHaveLength(1);
    expect(Socket.all[0]!.url).toContain("board=two");
    const old = Socket.all[0]!;
    selected.value = "three";
    await flushPromises();
    expect(old.close).toHaveBeenCalled();
    const count = vi.mocked(api.board).mock.calls.length;
    old.onmessage?.({ data: JSON.stringify({ cursor: 100, events: [{}] }) });
    await flushPromises();
    expect(vi.mocked(api.board).mock.calls.length).toBe(count);
    active.value = false;
    await flushPromises();
    expect(state.snapshot.value).toBeUndefined();
    await vi.advanceTimersByTimeAsync(30000);
    expect(vi.mocked(api.board).mock.calls.length).toBe(count);
  });
  it("pauses hidden viewers, preserves selection, and resumes from a fresh snapshot", async () => {
    const { state, wrapper } = setup();
    await flushPromises();
    state.taskId.value = "t";
    await flushPromises();
    const old = Socket.all[0]!;
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    await flushPromises();
    expect(old.close).toHaveBeenCalled();
    expect(state.taskId.value).toBe("t");
    const count = vi.mocked(api.board).mock.calls.length;
    await vi.advanceTimersByTimeAsync(16000);
    expect(vi.mocked(api.board).mock.calls.length).toBe(count);
    vi.mocked(api.board).mockResolvedValue(boardData("one", 31));
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    await flushPromises();
    expect(Socket.all[1]!.url).toContain("since=31");
    expect(state.taskId.value).toBe("t");
    expect(state.detail.value?.task.id).toBe("t");
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("rejects late details for a previously selected task and closes externally deleted tasks", async () => {
    const { state } = setup();
    await flushPromises();
    let resolve!: (value: Awaited<ReturnType<typeof api.task>>) => void;
    vi.mocked(api.task).mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    state.taskId.value = "old";
    await flushPromises();
    vi.mocked(api.task).mockResolvedValue({
      task: { id: "new", title: "New task", status: "todo" },
      comments: [],
      events: [],
      runs: [],
      links: { parents: [], children: [] },
    });
    state.taskId.value = "new";
    await flushPromises();
    resolve({
      task: { id: "old", title: "Old task", status: "todo" },
      comments: [],
      events: [],
      runs: [],
      links: { parents: [], children: [] },
    });
    await flushPromises();
    expect(state.detail.value?.task.id).toBe("new");
    vi.mocked(api.task).mockRejectedValue(new KanbanError(404));
    await state.refresh();
    await flushPromises();
    expect(state.taskId.value).toBe("");
    expect(state.detail.value).toBeUndefined();
  });
  it("keeps polling when event authentication is unavailable and ignores late authenticated URLs after disable", async () => {
    vi.stubGlobal("__HERMES_PLUGIN_SDK__", undefined);
    const { active, state } = setup();
    await flushPromises();
    expect(state.snapshot.value).toBeDefined();
    expect(Socket.all).toHaveLength(0);
    const count = vi.mocked(api.board).mock.calls.length;
    await vi.advanceTimersByTimeAsync(8000);
    await flushPromises();
    expect(vi.mocked(api.board).mock.calls.length).toBeGreaterThan(count);
    active.value = false;
    await flushPromises();
    let resolve!: (url: string) => void;
    vi.stubGlobal("__HERMES_PLUGIN_SDK__", {
      buildWsUrl: () =>
        new Promise<string>((r) => {
          resolve = r;
        }),
    });
    active.value = true;
    await flushPromises();
    active.value = false;
    await flushPromises();
    const url = new URL("/api/plugins/kanban/events", location.origin);
    url.protocol = "ws:";
    resolve(url.href);
    await flushPromises();
    expect(Socket.all).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
