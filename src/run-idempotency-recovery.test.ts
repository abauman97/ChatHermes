// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import App from "./App.vue";
import { activeRunFor, rememberRun } from "./lib/active-runs";
const json = (data: unknown) =>
  new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
const caps = {
  features: { run_events_sse: true },
  endpoints: { runs: { method: "POST", path: "/v1/runs" } },
};
beforeEach(() => {
  localStorage.clear();
  history.replaceState({}, "", "/chathermes?profile=alpha&session=one");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
  localStorage.clear();
});
function fixture() {
  let state: Record<string, unknown> = { run_id: "run_test", session_id: "one", status: "running" };
  let historyData: unknown[] = [
    { id: "old", role: "assistant", content: "Earlier answer" },
    { id: "u1", role: "user", content: "Question" },
  ];
  const viewers: ReadableStreamDefaultController<Uint8Array>[] = [];
  const runPost = vi.fn();
  const idempotentRuns = new Map<string, string>();
  let nextRun = 0;
  let statusCalls = 0;
  let getExpiredBuffer = false;
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    const path = new URL(url, location.origin).pathname;
    if (path.endsWith("/profiles")) return json({ profiles: [] });
    if (url.includes("/projects")) return json({ projects: [] });
    if (url.includes("/v1/models")) return json({ data: [] });
    if (url.includes("/api/model/options")) return json({ providers: [], model: "", provider: "" });
    if (url.includes("/capabilities")) return json(caps);
    if (url.includes("/messages"))
      return json({
        data:
          state.status === "completed"
            ? [...historyData, { id: "a1", role: "assistant", content: "Answer ready" }]
            : historyData,
      });
    if (url.includes("/events")) {
      if (url.includes("/run_test/events") && getExpiredBuffer)
        return new Response("", { status: 404 });
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            viewers.push(controller);
          },
        }),
      );
    }
    if (url.includes("/v1/runs/") && path.endsWith("/approval")) return json({ resolved: 1 });
    if (url.includes("/v1/runs/") && path.endsWith("/steer")) return json({ accepted: true });
    if (url.includes("/v1/runs/") && path.endsWith("/stop"))
      return json({ run_id: "run_test", status: "stopping" });
    if (/\/v1\/runs\/[^/]+$/.test(path)) {
      statusCalls++;
      return json({ ...state, run_id: url.match(/runs\/([^/?]+)/)?.[1] });
    }
    if (url.includes("/v1/runs") && init?.method === "POST") {
      const requestKey = new Headers(init.headers).get("Idempotency-Key") || "";
      const existing = idempotentRuns.get(requestKey);
      if (existing) return json({ run_id: existing, status: "started", replayed: true });
      const run = nextRun++ === 0 ? "run_test" : `run_test_${nextRun}`;
      idempotentRuns.set(requestKey, run);
      state = { run_id: run, session_id: "one", status: "running" };
      runPost();
      return json({ run_id: run, status: "started", replayed: false });
    }
    if (url.includes("/api/sessions?"))
      return json({
        data: [
          { id: "one", title: "One" },
          { id: "two", title: "Two" },
        ],
      });
    return json({ session: { id: "one" } });
  });
  vi.stubGlobal("fetch", fetch);
  const frame = (
    event: string,
    seq: number,
    data: Record<string, unknown> = {},
    viewer = viewers.at(-1)!,
  ) =>
    viewer.enqueue(
      new TextEncoder().encode(
        `id: ${seq}\ndata: ${JSON.stringify({ event, run_id: "run_test", seq, ...data })}\n\n`,
      ),
    );
  const ready = async (count = 1) => {
    await vi.waitFor(() => {
      if (viewers.length < count) throw new Error("Run event stream has not connected");
    });
    await flushPromises();
  };
  return {
    fetch,
    frame,
    viewers,
    ready,
    runPost,
    idempotentRuns,
    statusCalls: () => statusCalls,
    expireBuffer: () => {
      getExpiredBuffer = true;
    },
    state: (value: Record<string, unknown>) => {
      state = { ...state, ...value };
    },
    history: (value: unknown[]) => {
      historyData = value;
    },
  };
}
async function start(wrapper: ReturnType<typeof mount>) {
  await flushPromises();
  await wrapper.get("#prompt").setValue("Question");
  await wrapper.get(".composer").trigger("submit");
  await flushPromises();
}
describe("durable Runs execution", () => {
  it("admits once with session/model input and reconnects after reload without another POST", async () => {
    const f = fixture();
    let wrapper = mount(App);
    await start(wrapper);
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    const request = f.fetch.mock.calls.find(
      ([url, init]) => url.includes("/v1/runs?") && init?.method === "POST",
    );
    expect(JSON.parse(String(request?.[1]?.body))).toEqual({
      session_id: "one",
      input: "Question",
    });
    expect(new Headers(request?.[1]?.headers).get("Idempotency-Key")).toBeTruthy();
    await f.ready();
    f.frame("message.delta", 0, { delta: "Live answer" });
    await flushPromises();
    expect(wrapper.text()).toContain("Live answer");
    wrapper.unmount();
    wrapper = mount(App);
    await flushPromises();
    await f.ready(2);
    f.frame("message.delta", 0, { delta: "Live answer" });
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").map((x) => x.text())).toEqual([
      "Earlier answer",
      "Live answer",
    ]);
    expect(f.runPost).toHaveBeenCalledOnce();
    expect(f.fetch.mock.calls.filter(([url]) => url.includes("/run_test/events"))).toHaveLength(2);
    wrapper.unmount();
  });
  it("is locked to the real dashboard contract: lost response retry uses the same key/body", async () => {
    const f = fixture();
    const normal = f.fetch;
    let loseResponseOnce = true;
    const intercepted = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/v1/runs") && init?.method === "POST" && loseResponseOnce) {
        loseResponseOnce = false;
        await normal(url, init);
        throw new TypeError("response lost after admission");
      }
      return normal(url, init);
    });
    vi.stubGlobal("fetch", intercepted);
    const wrapper = mount(App);
    await start(wrapper);
    const posts = intercepted.mock.calls.filter(
      ([url, init]) => url.includes("/v1/runs?") && init?.method === "POST",
    );
    expect(posts).toHaveLength(2);
    expect(new Headers(posts[0]?.[1]?.headers).get("Idempotency-Key")).toBe(
      new Headers(posts[1]?.[1]?.headers).get("Idempotency-Key"),
    );
    expect(posts[0]?.[1]?.body).toBe(posts[1]?.[1]?.body);
    expect(f.idempotentRuns.size).toBe(1);
    expect(f.runPost).toHaveBeenCalledOnce();
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    wrapper.unmount();
  });
  it("restores the same run on navigation and keeps pointers isolated by profile/session", async () => {
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    expect(activeRunFor("beta", "one")).toBe("");
    expect(f.runPost).toHaveBeenCalledOnce();
    wrapper.unmount();
  });
  it("polls a run after its event buffer expires and restores session history before unlocking", async () => {
    vi.useFakeTimers();
    const f = fixture();
    rememberRun("alpha", "one", "run_test");
    f.expireBuffer();
    const wrapper = mount(App);
    await flushPromises();
    expect(f.statusCalls()).toBeGreaterThan(0);
    expect(wrapper.text()).toContain("live stream expired");
    expect(wrapper.text()).not.toContain("Retry connection");
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    f.state({ status: "completed", output: "Answer ready" });
    await vi.advanceTimersByTimeAsync(1000);
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").map((x) => x.text())).toContain("Answer ready");
    expect(activeRunFor("alpha", "one")).toBe("");
    expect(wrapper.text()).not.toContain("Stop response");
    wrapper.unmount();
  });
});
