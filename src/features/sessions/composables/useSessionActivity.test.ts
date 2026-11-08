// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vite-plus/test";
import { effectScope, ref } from "vue";
import { api } from "../../../services/hermes-api";
import { useSessionActivity } from "./useSessionActivity";

vi.mock("../../../services/hermes-api", () => ({ api: { sessionActivity: vi.fn() } }));
const scopes: ReturnType<typeof effectScope>[] = [];
afterEach(() => {
  scopes.splice(0).forEach((scope) => scope.stop());
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
function setup() {
  const profile = ref("alpha");
  const scope = effectScope();
  scopes.push(scope);
  const activity = scope.run(() => useSessionActivity(profile))!;
  return { ...activity, profile };
}
const row = (id: string, status = "working", runtime = id) => ({
  id: runtime,
  session_key: id,
  status,
});
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

it("restores simultaneous work and waiting by stored ID, ignores idle/starting, and reaps absent runtimes", async () => {
  vi.mocked(api.sessionActivity).mockResolvedValue({
    sessions: [
      row("one", "working", "runtime-one"),
      row("two", "waiting"),
      row("idle", "idle"),
      row("starting", "starting"),
    ],
  });
  const activity = setup();
  await flush();
  expect([...activity.workingSessions.value]).toEqual(["one", "two"]);
  vi.mocked(api.sessionActivity).mockResolvedValue({ sessions: [row("two", "idle")] });
  window.dispatchEvent(new Event("online"));
  await flush();
  expect([...activity.workingSessions.value]).toEqual([]);
});

it("keeps newer start and terminal events over a stale snapshot and coalesces refreshes", async () => {
  let resolve!: (value: { sessions: ReturnType<typeof row>[] }) => void;
  vi.mocked(api.sessionActivity).mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const activity = setup();
  activity.event("alpha", "finishing", false);
  activity.event("alpha", "starting", true);
  activity.event("beta", "foreign", true);
  await activity.refresh();
  await activity.refresh();
  expect(api.sessionActivity).toHaveBeenCalledTimes(1);
  vi.mocked(api.sessionActivity).mockRejectedValue(new Error("unsupported"));
  resolve({ sessions: [row("finishing"), row("starting", "idle")] });
  await flush();
  expect([...activity.workingSessions.value]).toEqual(["starting"]);
  expect(api.sessionActivity).toHaveBeenCalledTimes(2);
  await flush();
  expect([...activity.workingSessions.value]).toEqual(["starting"]);
});

it("clears synchronously on profile change and rejects late results even after switching back", async () => {
  const responses: ((value: { sessions: ReturnType<typeof row>[] }) => void)[] = [];
  vi.mocked(api.sessionActivity).mockImplementation(
    () => new Promise((done) => responses.push(done)),
  );
  const activity = setup();
  activity.event("alpha", "same-id", true);
  activity.profile.value = "beta";
  expect(activity.workingSessions.value.size).toBe(0);
  activity.profile.value = "alpha";
  responses[0]!({ sessions: [row("old-alpha")] });
  responses[1]!({ sessions: [row("same-id")] });
  await flush();
  expect(activity.workingSessions.value.size).toBe(0);
  responses[2]!({ sessions: [row("new-alpha")] });
  await flush();
  expect([...activity.workingSessions.value]).toEqual(["new-alpha"]);
});

it("preserves event state on errors, reconnects on return, and aborts/disposes on unmount", async () => {
  vi.mocked(api.sessionActivity).mockRejectedValue(new Error("offline"));
  const activity = setup();
  activity.event("alpha", "one", true);
  await flush();
  expect(activity.workingSessions.value.has("one")).toBe(true);
  vi.mocked(api.sessionActivity).mockResolvedValue({ sessions: [] });
  document.dispatchEvent(new Event("visibilitychange"));
  await flush();
  expect(activity.workingSessions.value.size).toBe(0);
  const calls = vi.mocked(api.sessionActivity).mock.calls.length;
  scopes[0]!.stop();
  window.dispatchEvent(new Event("online"));
  expect(api.sessionActivity).toHaveBeenCalledTimes(calls);
});

it("polls only while visible and online, rejects malformed snapshots, and ignores disposed reads", async () => {
  vi.useFakeTimers();
  const visible = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
  vi.mocked(api.sessionActivity).mockResolvedValue({ sessions: [] });
  const activity = setup();
  await vi.advanceTimersByTimeAsync(5000);
  expect(api.sessionActivity).not.toHaveBeenCalled();
  visible.mockReturnValue("visible");
  const online = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
  await vi.advanceTimersByTimeAsync(5000);
  expect(api.sessionActivity).not.toHaveBeenCalled();
  online.mockReturnValue(true);
  activity.event("alpha", "one", true);
  vi.mocked(api.sessionActivity).mockResolvedValue({ sessions: [row("bad", "invalid")] });
  await vi.advanceTimersByTimeAsync(5000);
  expect(activity.workingSessions.value.has("one")).toBe(true);
  let resolve!: (value: { sessions: ReturnType<typeof row>[] }) => void;
  vi.mocked(api.sessionActivity).mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  void activity.refresh();
  void activity.refresh();
  const signal = vi.mocked(api.sessionActivity).mock.calls.at(-1)![1]!;
  const calls = vi.mocked(api.sessionActivity).mock.calls.length;
  scopes[0]!.stop();
  expect(signal.aborted).toBe(true);
  resolve({ sessions: [] });
  await flush();
  expect(api.sessionActivity).toHaveBeenCalledTimes(calls);
  expect(activity.workingSessions.value.has("one")).toBe(true);
});

it("maps a terminal event to a continuation first learned from an in-flight snapshot", async () => {
  let resolve!: (value: Awaited<ReturnType<typeof api.sessionActivity>>) => void;
  vi.mocked(api.sessionActivity).mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const activity = setup();
  activity.event("alpha", "original", true);
  activity.event("alpha", "original", false);
  resolve({ sessions: [{ ...row("tip"), session_keys: ["original", "middle", "tip"] }] });
  await flush();
  expect([...activity.workingSessions.value]).toEqual([]);
});

it("unknown owner status preserves known work across rotation without inventing activity", async () => {
  vi.mocked(api.sessionActivity).mockResolvedValue({ sessions: [] });
  const activity = setup();
  await flush();
  activity.event("alpha", "original", true);
  vi.mocked(api.sessionActivity).mockResolvedValue({
    sessions: [
      { ...row("tip", "unknown"), session_keys: ["original", "tip"] },
      row("unobserved", "unknown"),
    ],
  });
  await activity.refresh();
  expect([...activity.workingSessions.value]).toEqual(["tip", "original"]);
  activity.event("alpha", "original", false);
  await activity.refresh();
  expect([...activity.workingSessions.value]).toEqual([]);
});

it("retains learned aliases when a failed ledger read returns an incomplete unknown lineage", async () => {
  const runtime = "same-runtime";
  vi.mocked(api.sessionActivity).mockResolvedValue({
    sessions: [{ ...row("tip", "working", runtime), session_keys: ["original", "middle", "tip"] }],
  });
  const activity = setup();
  await flush();
  vi.mocked(api.sessionActivity).mockResolvedValue({ sessions: [row("tip", "unknown", runtime)] });
  await activity.refresh();
  activity.event("alpha", "middle", false);
  expect([...activity.workingSessions.value]).toEqual([]);
  await activity.refresh();
  expect([...activity.workingSessions.value]).toEqual([]);
});

it.each([true, false])(
  "applies the latest root viewer event (%s) to a newly verified live tip across a pending read",
  async (working) => {
    let resolve!: (value: Awaited<ReturnType<typeof api.sessionActivity>>) => void;
    vi.mocked(api.sessionActivity).mockReturnValue(new Promise((done) => (resolve = done)));
    const activity = setup();
    activity.event("alpha", "root", !working);
    activity.event("beta", "root", !working);
    activity.event("alpha", "root", working);
    resolve({
      sessions: [{ ...row("tip", "unknown"), session_keys: ["root", "tip"] }],
    });
    await flush();
    expect([...activity.workingSessions.value]).toEqual(working ? ["tip", "root"] : []);
    expect(activity.workingSessions.value.has("stale")).toBe(false);
    activity.profile.value = "beta";
    expect(activity.workingSessions.value.size).toBe(0);
    await flush();
    expect(activity.workingSessions.value.size).toBe(0);
  },
);

it.each(["working", "waiting"])(
  "retains verified aliases through incomplete %s, root completion, and unknown snapshots",
  async (status) => {
    const runtime = "runtime";
    vi.mocked(api.sessionActivity).mockResolvedValue({
      sessions: [
        {
          ...row("tip", "working", runtime),
          session_keys: ["root", "tip"],
          session_keys_complete: true,
        },
      ],
    });
    const activity = setup();
    await flush();
    vi.mocked(api.sessionActivity).mockResolvedValue({
      sessions: [
        { ...row("tip", status, runtime), session_keys: ["tip"], session_keys_complete: false },
      ],
    });
    await activity.refresh();
    expect(activity.workingSessions.value.has("root")).toBe(true);
    expect(activity.workingSessions.value.has("tip")).toBe(true);
    activity.event("alpha", "root", false);
    expect([...activity.workingSessions.value]).toEqual([]);
    vi.mocked(api.sessionActivity).mockResolvedValue({
      sessions: [
        { ...row("tip", "unknown", runtime), session_keys: ["tip"], session_keys_complete: false },
      ],
    });
    await activity.refresh();
    expect([...activity.workingSessions.value]).toEqual([]);
  },
);

it.each(["identity", "profile", "absence", "complete"])(
  "forgets verified aliases after %s reset",
  async (reset) => {
    const runtime = "runtime";
    vi.mocked(api.sessionActivity).mockResolvedValue({
      sessions: [
        {
          ...row("tip", "working", runtime),
          session_keys: ["root", "tip"],
          session_keys_complete: true,
        },
      ],
    });
    const activity = setup();
    await flush();
    const key = reset === "identity" ? "unrelated" : "tip";
    vi.mocked(api.sessionActivity).mockResolvedValue({
      sessions:
        reset === "absence"
          ? []
          : [{ ...row(key, "working", runtime), session_keys_complete: reset === "complete" }],
    });
    if (reset === "profile") {
      activity.profile.value = "beta";
      expect(activity.workingSessions.value.size).toBe(0);
      await flush();
    } else await activity.refresh();
    vi.mocked(api.sessionActivity).mockResolvedValue({
      sessions: [{ ...row(key, "working", runtime), session_keys_complete: false }],
    });
    await activity.refresh();
    expect([...activity.workingSessions.value]).toEqual([key]);
    activity.event("alpha", "root", false);
    activity.event("beta", "root", false);
    expect([...activity.workingSessions.value]).toEqual([key]);
  },
);
