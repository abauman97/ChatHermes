// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import App from "./App.vue";
import SessionSidebar from "./components/SessionSidebar.vue";
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
  let nextRun = 0;
  let statusCalls = 0;
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    const path = new URL(url, location.origin).pathname;
    if (path.endsWith("/profiles")) return json({ profiles: [] });
    if (url.includes("/projects")) return json({ projects: [] });
    if (url.includes("/v1/models")) return json({ data: [] });
    if (url.includes("/api/model/options")) return json({ providers: [], model: "", provider: "" });
    if (url.includes("/capabilities")) return json(caps);
    if (url.includes("/messages")) return json({ data: historyData });
    if (url.includes("/v1/runs") && url.includes("/events"))
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            viewers.push(controller);
          },
        }),
      );
    if (url.includes("/v1/runs/") && path.endsWith("/approval")) return json({ resolved: 1 });
    if (url.includes("/v1/runs/") && path.endsWith("/steer")) return json({ accepted: true });
    if (url.includes("/v1/runs/") && path.endsWith("/stop"))
      return json({ run_id: "run_test", status: "stopping" });
    if (/\/v1\/runs\/[^/]+$/.test(path)) {
      statusCalls++;
      return json({ ...state, run_id: url.match(/runs\/([^/?]+)/)?.[1] });
    }
    if (url.includes("/v1/runs") && init?.method === "POST") {
      const run = nextRun++ === 0 ? "run_test" : `run_test_${nextRun}`;
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
    statusCalls: () => statusCalls,
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
  it("merges tool progress by call identity when progress omits the tool name", async () => {
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    f.frame("tool.started", 0, {
      tool_name: "terminal",
      tool_call_id: "call",
      args: { command: "pwd" },
    });
    await flushPromises();
    f.frame("tool.progress", 1, { tool_call_id: "call", delta: "arriving result" });
    await flushPromises();
    expect(wrapper.findAll(".working-shimmer-tool").map((row) => row.text())).toEqual([
      "Using tool: terminal",
    ]);
    expect(wrapper.text()).not.toContain("arriving result");
    expect(wrapper.findAll(".activity")).toHaveLength(1); // Active tool stays inline with Working.
    f.frame("tool.completed", 2, { tool_call_id: "call", output: "full result" });
    await flushPromises();
    expect(wrapper.findAll(".activity[open]")).toHaveLength(0);
    expect(wrapper.text()).toContain("full result");
    wrapper.unmount();
  });

  it("admits once with session/model input and reconnects after reload without another POST", async () => {
    const f = fixture();
    let wrapper = mount(App);
    await start(wrapper);
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    expect(
      JSON.parse(
        String(
          f.fetch.mock.calls.find(
            ([url, init]) => url.includes("/v1/runs?") && init?.method === "POST",
          )?.[1]?.body,
        ),
      ),
    ).toEqual({ session_id: "one", input: "Question" });
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
  it("restores the same run on navigation and keeps pointers isolated by profile/session", async () => {
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "two");
    await flushPromises();
    expect(wrapper.find(".send-button").attributes("aria-label")).toBe("Send message");
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    expect(activeRunFor("beta", "one")).toBe("");
    wrapper.findComponent(SessionSidebar).vm.$emit("select", "one");
    await flushPromises();
    await f.ready();
    f.frame("message.delta", 0, { delta: "Resumed" });
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").map((x) => x.text())).toEqual([
      "Earlier answer",
      "Resumed",
    ]);
    expect(f.runPost).toHaveBeenCalledOnce();
    wrapper.unmount();
  });
  it("deduplicates replay and reconnects with last_seq after a stream disconnect", async () => {
    vi.useFakeTimers();
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    f.frame("message.delta", 0, { delta: "Hello" });
    await flushPromises();
    f.frame("message.delta", 0, { delta: "Hello" });
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").at(-1)?.text()).toBe("Hello");
    f.viewers.at(-1)!.close();
    await flushPromises();
    expect(wrapper.text()).toContain("Reconnecting to the live response");
    await vi.advanceTimersByTimeAsync(1000);
    await flushPromises();
    expect(
      f.fetch.mock.calls.filter(([url]) => String(url).includes("/events")).at(-1)?.[0],
    ).toContain("last_seq=0");
    await f.ready(2);
    f.frame("message.delta", 0, { delta: "Hello" });
    f.frame("message.delta", 1, { delta: " again" });
    f.frame("message.delta", 1, { delta: " again" });
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").at(-1)?.text()).toBe("Hello again");
    expect(f.runPost).toHaveBeenCalledOnce();
    expect(f.statusCalls()).toBe(2);
    wrapper.unmount();
  });
  it("renders pinned reasoning/tool preview/results then restores authoritative completed history", async () => {
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    f.frame("reasoning.available", 0, { text: "Consider the evidence" });
    f.frame("tool.started", 1, { tool: "terminal", preview: "echo hello" });
    await flushPromises();
    expect(wrapper.text()).toContain("Consider the evidence");
    expect(wrapper.get(".working-shimmer-tool").text()).toBe("Using tool: terminal");
    expect(wrapper.text()).not.toContain("echo hello");
    f.frame("tool.completed", 2, { tool: "terminal", preview: "hello", error: false });
    await flushPromises();
    expect(wrapper.findAll(".activity[open]")).toHaveLength(0);
    expect(wrapper.findAll(".activity").at(-1)!.get("pre").text()).toContain("echo hello");
    f.history([
      { role: "user", content: "Question" },
      { role: "tool", content: "Full output hello" },
      { role: "assistant", content: "Final answer" },
    ]);
    f.frame("run.completed", 3, { output: "Final answer" });
    await flushPromises();
    expect(wrapper.findAll(".message.assistant")).toHaveLength(1);
    expect(wrapper.text()).toContain("Final answer");
    expect(activeRunFor("alpha", "one")).toBe("");
    expect(wrapper.get(".send-button").attributes("aria-label")).toBe("Send message");
    wrapper.unmount();
  });
  it("restores approval details and permits approval, steering and composer stop after reload", async () => {
    const f = fixture();
    rememberRun("alpha", "one", "run_test");
    f.state({
      status: "waiting_for_approval",
      approval: { request_id: "req_1", command: "test command", choices: ["once", "deny"] },
    });
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.text()).toContain("test command");
    await wrapper
      .findAll("button")
      .find((x) => x.text() === "Allow once")!
      .trigger("click");
    await flushPromises();
    expect(
      JSON.parse(String(f.fetch.mock.calls.find(([url]) => url.includes("/approval"))?.[1]?.body)),
    ).toEqual({ choice: "once", request_id: "req_1" });
    await wrapper.get("#prompt").setValue("Use another approach");
    expect(wrapper.get(".send-button").attributes("aria-label")).toBe("Guide this run");
    await wrapper.get('[aria-label="Guide this run"]').trigger("click");
    await flushPromises();
    expect(
      JSON.parse(String(f.fetch.mock.calls.find(([url]) => url.includes("/steer"))?.[1]?.body)),
    ).toEqual({ input: "Use another approach" });
    await wrapper.get("#prompt").setValue("");
    await wrapper.get("#prompt").trigger("focus");
    expect(wrapper.get("#prompt").attributes("disabled")).toBeUndefined();
    expect(wrapper.get(".send-button").attributes("aria-label")).toBe("Stop response");
    await wrapper.get('[aria-label="Stop response"]').trigger("click");
    await flushPromises();
    expect(
      f.fetch.mock.calls.some(([url, init]) => url.includes("/stop") && init?.method === "POST"),
    ).toBe(true);
    expect(wrapper.text()).toContain("Stopping…");
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    wrapper.unmount();
  });
  it("reopens a completed run through history without replaying or resubmitting", async () => {
    const f = fixture();
    rememberRun("alpha", "one", "run_test");
    f.state({ status: "completed", output: "Final" });
    f.history([
      { role: "user", content: "Question" },
      { role: "assistant", content: "Final" },
    ]);
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").map((x) => x.text())).toEqual(["Final"]);
    expect(activeRunFor("alpha", "one")).toBe("");
    expect(
      f.fetch.mock.calls.some(([url, init]) => url.includes("/events") || init?.method === "POST"),
    ).toBe(false);
    wrapper.unmount();
  });
  it("keeps an approval/send lock through history refresh and clears it only after resolution", async () => {
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    f.frame("approval.request", 0, {
      request_id: "req_1",
      command: "review me",
      choices: ["once", "deny"],
    });
    await flushPromises();
    f.frame("replay.truncated", 1, { oldest_retained_seq: 1 });
    await flushPromises();
    await wrapper
      .findAll("button")
      .find((x) => x.text() === "Refresh history")!
      .trigger("click");
    await flushPromises();
    await wrapper.get("#prompt").setValue("Another turn");
    await wrapper.get(".composer").trigger("submit");
    await flushPromises();
    expect(f.runPost).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain("review me");
    expect(wrapper.get('[aria-label="Stop response"]').attributes("disabled")).toBeUndefined();
    f.frame("approval.responded", 2, { request_id: "req_1", choice: "deny", resolved: 1 });
    await flushPromises();
    expect(wrapper.text()).not.toContain("review me");
    wrapper.unmount();
  });
  it("rebuilds a fresh viewer from replay without losing text or duplicating deltas", async () => {
    const f = fixture();
    let wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    const oldViewer = f.viewers.at(-1)!;
    f.frame("message.delta", 0, { delta: "Already shown" }, oldViewer);
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").at(-1)?.text()).toBe("Already shown");
    wrapper.unmount();
    wrapper = mount(App);
    await flushPromises();
    await f.ready(2);
    expect(
      f.fetch.mock.calls.filter(([url]) => String(url).includes("/events")).at(-1)?.[0],
    ).toContain("last_seq=-1");
    const newViewer = f.viewers.at(-1)!;
    f.frame("message.delta", 0, { delta: "Already shown" }, newViewer);
    await flushPromises();
    f.frame("message.delta", 3, { delta: "Once" }, newViewer);
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").at(-1)?.text()).toBe("Already shownOnce");
    expect(f.runPost).toHaveBeenCalledOnce();
    wrapper.unmount();
  });
  it("keeps the active run locked when another turn is submitted", async () => {
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    f.frame("message.delta", 0, { delta: "Old live turn" });
    await flushPromises();
    await wrapper.get("#prompt").setValue("Next turn");
    await wrapper.get(".composer").trigger("submit");
    await flushPromises();
    expect(activeRunFor("alpha", "one")).toBe("run_test");
    expect(f.runPost).toHaveBeenCalledOnce();
    expect(wrapper.findAll(".message.assistant").at(-1)?.text()).toBe("Old live turn");
    wrapper.unmount();
  });
  it("uses the last applied sequence on visibility reconnect, ignoring foreign and duplicate frames", async () => {
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    f.frame("message.delta", 0, { delta: "Hello" });
    await flushPromises();
    f.frame("message.delta", 100, { run_id: "another_run", delta: "Wrong run" });
    await flushPromises();
    document.dispatchEvent(new Event("visibilitychange"));
    await flushPromises();
    await f.ready(2);
    expect(f.fetch.mock.calls.filter(([url]) => url.includes("/events")).at(-1)?.[0]).toContain(
      "last_seq=0",
    );
    f.frame("message.delta", 0, { delta: "Hello" });
    f.frame("message.delta", 3, { delta: " again" });
    f.frame("message.delta", 3, { delta: " again" });
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").map((x) => x.text())).toEqual([
      "Earlier answer",
      "Hello again",
    ]);
    f.history([
      { id: "old", role: "assistant", content: "Earlier answer" },
      { id: "u1", role: "user", content: "Question" },
      { id: "final", role: "assistant", content: "Authoritative answer" },
    ]);
    f.frame("run.completed", 4, { output: "Hello again" });
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").map((x) => x.text())).toEqual([
      "Earlier answer",
      "Authoritative answer",
    ]);
    expect(activeRunFor("alpha", "one")).toBe("");
    expect(f.runPost).toHaveBeenCalledOnce();
    wrapper.unmount();
  });
  it("refreshes authoritative history when status completes while disconnected", async () => {
    vi.useFakeTimers();
    const f = fixture();
    const wrapper = mount(App);
    await start(wrapper);
    await f.ready();
    f.frame("message.delta", 0, { delta: "Partial" });
    await flushPromises();
    f.viewers.at(-1)!.close();
    await flushPromises();
    f.state({ status: "completed", output: "Final" });
    f.history([
      { role: "user", content: "Question" },
      { role: "assistant", content: "Saved final" },
    ]);
    await vi.advanceTimersByTimeAsync(1000);
    await flushPromises();
    expect(wrapper.findAll(".message.assistant").map((x) => x.text())).toEqual(["Saved final"]);
    expect(f.statusCalls()).toBe(2);
    expect(f.viewers).toHaveLength(1);
    expect(f.runPost).toHaveBeenCalledOnce();
    expect(activeRunFor("alpha", "one")).toBe("");
    wrapper.unmount();
  });
});
