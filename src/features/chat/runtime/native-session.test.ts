// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { useNativeSession } from "./native-session";
import { api } from "../../../services/hermes-api";
import { nativeOutcome } from "./native-admission";
import type { NativeHooks } from "./native-chat";
import { NativeError } from "./native-chat";

const fake = vi.hoisted(() => ({
  hooks: undefined as NativeHooks | undefined,
  rpc: vi.fn(),
  usage: vi.fn(),
  breakdown: vi.fn(),
  boundary: 10,
}));
vi.mock("./native-chat", async (importOriginal) => {
  const original = await importOriginal<typeof import("./native-chat")>();
  return {
    ...original,
    NativeViewer: class {
      profile = "alpha";
      stored = "one";
      get boundary() {
        return fake.boundary;
      }
      constructor(_profile: string, _stored: string, hooks: NativeHooks) {
        this.profile = _profile;
        this.stored = _stored;
        fake.hooks = hooks;
      }
      async ensure() {
        fake.hooks!.snapshot({
          session_id: "runtime",
          messages: [],
          running: false,
          recovery: { epoch: "epoch", through: 0, base_row_ids: [], complete: true },
        } as any);
        fake.hooks!.connection("open");
        fake.hooks!.recovered();
      }
      rpc = fake.rpc;
      usage = fake.usage;
      contextBreakdown = fake.breakdown;
      close() {}
    },
  };
});
beforeEach(() => {
  vi.spyOn(api, "latestMessages").mockImplementation(async (p, s, signal) => ({
    messages: await api.messages(p, s, signal),
    nextOffset: 0,
    hasMore: false,
  }));
});
afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  fake.rpc.mockReset();
  fake.usage.mockReset();
  fake.breakdown.mockReset();
  fake.boundary = 10;
});
describe("native session state", () => {
  it("reports current-session activity on attachment, final messages and reconnect, excluding obsolete viewers", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    const activity = vi.fn();
    const session = useNativeSession(vi.fn(), undefined, undefined, activity);
    await session.attach("alpha", "one");
    expect(activity).toHaveBeenLastCalledWith("alpha", "one");
    activity.mockClear();
    const old = fake.hooks!;
    old.event({ type: "message.complete", payload: { status: "complete", text: "Done" } } as any);
    expect(activity).toHaveBeenCalledExactlyOnceWith("alpha", "one");
    activity.mockClear();
    await session.availability(false, true);
    await session.availability(true, true);
    expect(activity).toHaveBeenCalledExactlyOnceWith("alpha", "one");
    await session.attach("beta", "two");
    activity.mockClear();
    old.event({ type: "message.complete", payload: { status: "complete" } } as any);
    old.recovered();
    expect(activity).not.toHaveBeenCalled();
    session.close();
    fake.hooks!.recovered();
    expect(activity).not.toHaveBeenCalled();
  });
  it.each([
    ["alpha", "two"],
    ["beta", "one"],
  ])(
    "publishes recovered settings and rejects obsolete viewers after selecting %s/%s",
    async (profile, stored) => {
      vi.spyOn(api, "messages").mockResolvedValue([]);
      const session = useNativeSession(vi.fn());
      await session.attach("alpha", "one");
      const old = fake.hooks!;
      const snapshot = (model: string) =>
        ({
          session_id: "runtime",
          messages: [],
          running: false,
          info: { model, provider: "saved-provider", reasoning_effort: "high" },
          recovery: { epoch: "epoch", through: 0, base_row_ids: [], complete: true },
        }) as any;
      old.snapshot(snapshot("saved-model"));
      expect(session.settings.value?.info).toBeUndefined();
      old.recovered();
      expect(session.settings.value).toMatchObject({
        profile: "alpha",
        session: "one",
        info: { model: "saved-model" },
        generation: session.generationRef.value,
      });
      await session.attach(profile, stored);
      const current = fake.hooks!;
      current.snapshot(snapshot("beta-model"));
      current.recovered();
      old.snapshot(snapshot("stale-model"));
      old.recovered();
      expect(session.settings.value).toMatchObject({
        profile,
        session: stored,
        info: { model: "beta-model" },
        generation: session.generationRef.value,
      });
      session.close();
      expect(session.settings.value).toBeUndefined();
      current.snapshot(snapshot("closed-model"));
      current.recovered();
      expect(session.settings.value).toBeUndefined();
    },
  );
  it.each([false, true])(
    "reconciles an untagged matching input with its optimistic upload (ack first: %s)",
    async (ackFirst) => {
      vi.spyOn(api, "messages").mockResolvedValue([]);
      let acknowledge!: () => void;
      fake.rpc.mockImplementation((method) =>
        method === "prompt.submit"
          ? new Promise<void>((resolve) => {
              acknowledge = resolve;
            })
          : Promise.resolve({ settled: false }),
      );
      const session = useNativeSession(vi.fn());
      await session.attach("alpha", "one");
      const preview = [
        { type: "text", text: "Question" },
        { type: "image_url", image_url: { url: "data:image/png;base64,AAAA" } },
      ];
      const sending = session.submit("Question", "prepared upload", {}, preview);
      await Promise.resolve();
      const id = session.messages.value[0]!.id;
      if (ackFirst) {
        acknowledge();
        await sending;
      }
      fake.hooks!.input("Question", false);
      expect(session.messages.value).toHaveLength(1);
      expect(session.messages.value[0]).toMatchObject({ id, content: preview });
      if (!ackFirst) {
        acknowledge();
        await sending;
      }
      session.close();
    },
  );
  it.each(["start", "ack", "lost ack"])(
    "ignores early input and refreshes once after persistence via %s",
    async (first) => {
      vi.spyOn(api, "messages").mockResolvedValue([]);
      let acknowledge!: () => void;
      let reject!: (error: Error) => void;
      fake.rpc.mockImplementation((method) =>
        method === "prompt.submit"
          ? new Promise<void>((resolve, fail) => {
              acknowledge = resolve;
              reject = fail;
            })
          : Promise.resolve({ settled: false }),
      );
      const created = vi.fn();
      const session = useNativeSession(vi.fn(), created);
      await session.attach("alpha", "one");
      const sending = session.submit("Question", "Question", {});
      await Promise.resolve();
      fake.hooks!.input("Question", false);
      expect(created).not.toHaveBeenCalled();
      if (first !== "ack") {
        fake.hooks!.event({ type: "message.start", session_id: "runtime" } as any);
        expect(created).toHaveBeenCalledExactlyOnceWith("alpha", "one");
      }
      if (first === "lost ack") {
        reject(new NativeError("Lost acknowledgement"));
        await expect(sending).rejects.toThrow("Lost acknowledgement");
      } else {
        acknowledge();
        await sending;
      }
      expect(created).toHaveBeenCalledExactlyOnceWith("alpha", "one");
      fake.hooks!.event({ type: "message.start", session_id: "runtime" } as any);
      expect(created).toHaveBeenCalledTimes(1);
      session.close();
    },
  );
  it.each([false, true])(
    "refreshes on acknowledgement without input (reconnect: %s)",
    async (reconnect) => {
      vi.spyOn(api, "messages").mockResolvedValue([]);
      let acknowledge!: () => void;
      fake.rpc.mockImplementation((method) =>
        method === "prompt.submit"
          ? new Promise<void>((resolve) => {
              acknowledge = resolve;
            })
          : Promise.resolve({ settled: false }),
      );
      const created = vi.fn();
      const session = useNativeSession(vi.fn(), created);
      await session.attach("alpha", "one");
      const sending = session.submit("Question", "Question", {});
      await Promise.resolve();
      if (reconnect) {
        await session.availability(false, true);
        await session.availability(true, true);
      }
      expect(created).not.toHaveBeenCalled();
      acknowledge();
      await sending;
      expect(created).toHaveBeenCalledExactlyOnceWith("alpha", "one");
      session.close();
    },
  );
  it("ignores acknowledgements and callbacks from an old selection", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    let acknowledge!: () => void;
    fake.rpc.mockImplementation((method) =>
      method === "prompt.submit"
        ? new Promise<void>((resolve) => {
            acknowledge = resolve;
          })
        : Promise.resolve({ settled: false }),
    );
    const created = vi.fn(),
      title = vi.fn();
    const session = useNativeSession(vi.fn(), created, title);
    await session.attach("alpha", "one");
    const old = fake.hooks!;
    const sending = session.submit("Question", "Question", {});
    await Promise.resolve();
    await session.attach("beta", "two");
    acknowledge();
    await sending;
    old.event({ type: "message.start", session_id: "runtime" } as any);
    old.event({ type: "session.title", payload: { title: "Old" } } as any);
    expect(created).not.toHaveBeenCalled();
    expect(title).not.toHaveBeenCalled();
    fake.hooks!.event({ type: "message.start", session_id: "runtime" } as any);
    expect(created).toHaveBeenCalledExactlyOnceWith("beta", "two");
    session.close();
  });
  it("preserves pending persistence across reconnection after early input", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: false });
    const created = vi.fn();
    const session = useNativeSession(vi.fn(), created);
    await session.attach("alpha", "one");
    fake.hooks!.input("Question", false);
    await session.availability(false, true);
    await session.availability(true, true);
    expect(created).not.toHaveBeenCalled();
    fake.hooks!.event({ type: "message.start", session_id: "runtime" } as any);
    expect(created).toHaveBeenCalledExactlyOnceWith("alpha", "one");
    session.close();
  });
  it.each([false, true])(
    "explicitly resolves an idle native session with an unterminated retained input (reload: %s)",
    async (reload) => {
      vi.spyOn(api, "messages").mockResolvedValue([]);
      fake.rpc.mockImplementation(async (method) => {
        if (method === "prompt.submit") throw new NativeError("Lost acknowledgement");
        if (method === "state") return { running: false, queued: false };
        return { settled: false };
      });
      const session = useNativeSession(vi.fn());
      await session.attach("alpha", "one");
      const preview = [
        { type: "text", text: "Keep this question" },
        { type: "text", text: "📎 note.txt" },
      ];
      await expect(
        session.submit("Keep this question", "Keep this question", {}, preview),
      ).rejects.toThrow("Lost acknowledgement");
      if (reload) {
        session.close();
        await session.attach("alpha", "one");
        // Owner.begin retains this before prompt.submit. No native terminal
        // event is guaranteed when that dispatch fails or times out.
        fake.hooks!.input("Keep this question", false);
      }
      await session.hydrate();
      expect(session.busy.value).toBe(true);
      expect(session.uncertain.value).toBe(true);
      await session.resolveUncertainty();
      expect(session.uncertain.value).toBe(false);
      expect(session.busy.value).toBe(false);
      expect(nativeOutcome("alpha", "one")).toBe(false);
      expect(session.error.value).toBe("");
      expect(session.messages.value.map((row) => row.content)).toEqual([
        reload ? "Keep this question" : preview,
      ]);
      expect(fake.rpc.mock.calls.filter(([method]) => method === "prompt.submit")).toHaveLength(1);
      session.close();
    },
  );
  it.each(["running", "queued", "delegating", "missing", "unavailable", "history failure"])(
    "keeps uncertainty when the native check reports %s",
    async (state) => {
      const history = vi.spyOn(api, "messages").mockResolvedValue([]);
      fake.rpc.mockImplementation(async (method) => {
        if (method === "prompt.submit") throw new NativeError("Lost acknowledgement");
        if (method === "state") {
          if (state === "unavailable") throw new Error("unavailable");
          return {
            running: state === "missing" ? undefined : state === "running",
            queued: state === "queued",
            delegating: state === "delegating",
          };
        }
        return { settled: false };
      });
      const session = useNativeSession(vi.fn());
      await session.attach("alpha", "one");
      await expect(session.submit("Question", "Question", {})).rejects.toThrow();
      if (state === "history failure") history.mockRejectedValue(new Error("unavailable"));
      await session.resolveUncertainty();
      expect(session.uncertain.value).toBe(true);
      expect(nativeOutcome("alpha", "one")).toBe(true);
      expect(session.messages.value.map((row) => row.content)).toEqual(["Question"]);
      expect(fake.rpc.mock.calls.filter(([method]) => method === "prompt.submit")).toHaveLength(1);
      session.close();
    },
  );
  it("does not resolve an admission that is still awaiting acknowledgement", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    let acknowledge!: () => void;
    fake.rpc.mockImplementation((method) =>
      method === "prompt.submit"
        ? new Promise<void>((resolve) => {
            acknowledge = resolve;
          })
        : Promise.resolve({ settled: false }),
    );
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    const sending = session.submit("Question", "Question", {});
    await session.resolveUncertainty();
    expect(session.uncertain.value).toBe(true);
    expect(fake.rpc.mock.calls.some(([method]) => method === "state")).toBe(false);
    acknowledge();
    await sending;
    session.close();
  });
  it.each(["state", "history"])(
    "does not settle a new selection while the old %s check is pending",
    async (phase) => {
      const history = vi.spyOn(api, "messages").mockResolvedValue([]);
      fake.rpc.mockImplementation(async (method) => {
        if (method === "prompt.submit") throw new NativeError("Lost acknowledgement");
        return { settled: false, running: false };
      });
      const session = useNativeSession(vi.fn());
      await session.attach("alpha", "one");
      await expect(session.submit("Question", "Question", {})).rejects.toThrow();
      let finish!: () => void;
      if (phase === "state")
        fake.rpc.mockImplementationOnce(
          () => new Promise((resolve) => (finish = () => resolve({ running: false }))),
        );
      else
        history.mockImplementationOnce(
          () => new Promise((resolve) => (finish = () => resolve([]))),
        );
      const resolution = session.resolveUncertainty();
      // Allow the native check to reach hydration before changing selection.
      await Promise.resolve();
      session.close();
      await session.attach("alpha", "one");
      finish();
      await resolution;
      expect(session.uncertain.value).toBe(true);
      expect(nativeOutcome("alpha", "one")).toBe(true);
      session.close();
    },
  );
  it("does not overwrite activity arriving during the native state check", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockImplementation(async (method) => {
      if (method === "prompt.submit") throw new NativeError("Lost acknowledgement");
      if (method === "state") {
        fake.boundary++;
        fake.hooks!.event({ type: "message.start", session_id: "runtime" } as any);
        return { running: false };
      }
      return { settled: false };
    });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    await expect(session.submit("Question", "Question", {})).rejects.toThrow();
    await session.resolveUncertainty();
    expect(session.busy.value).toBe(true);
    expect(session.uncertain.value).toBe(true);
    expect(nativeOutcome("alpha", "one")).toBe(true);
    session.close();
  });
  it("steering preserves earlier activity and routes its late tool completion once", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: false });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    const event = (type: string, payload: any) =>
      fake.hooks!.event({ session_id: "runtime", type, payload } as any);
    fake.hooks!.input("Question", false);
    event("reasoning.delta", { text: "Before correction" });
    event("tool.start", { tool_id: "call", name: "terminal" });
    fake.hooks!.input("Correction", true);
    event("tool.complete", { tool_id: "call", name: "terminal", result_text: "Done" });
    event("message.complete", { text: "Corrected answer", status: "complete" });
    expect(session.messages.value.map((row) => row.content)).toEqual(["Question", "Correction"]);
    expect(session.messages.value[0]!.blocks![1]).toMatchObject({
      id: "call",
      complete: true,
      output: "Done",
    });
    expect(session.messages.value[1]!.blocks).toEqual([
      expect.objectContaining({ kind: "text", content: "Corrected answer" }),
    ]);
    session.close();
  });
  it("retains a failed inflight fallback without making it busy or doubling saved partial text", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: false });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    fake.hooks!.snapshot({
      messages: [
        { row_id: 1, role: "user", text: "Question" },
        { row_id: 2, role: "assistant", text: "Partial" },
      ],
      running: false,
      inflight: { user: "Question", assistant: "Partial", error: "Provider failed" },
      recovery: { complete: false, base_row_ids: null },
    } as any);
    fake.hooks!.recovered();
    await session.hydrate();
    expect(session.busy.value).toBe(false);
    expect(session.error.value).toBe("Provider failed");
    expect(session.messages.value[0]!.blocks![0]!.content).toBe("Partial");
    session.close();
  });
  it("late delegated completion updates its parent after a subsequent turn starts", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: false });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    const event = (type: string, payload: any) =>
      fake.hooks!.event({ session_id: "runtime", type, payload } as any);
    fake.hooks!.input("First", false);
    event("subagent.start", { subagent_id: "child", status: "running" });
    event("message.complete", { text: "Parent done", status: "complete" });
    fake.hooks!.input("Second", false);
    event("message.start", {});
    event("subagent.complete", {
      subagent_id: "child",
      status: "completed",
      summary: "Child done",
    });
    expect(session.messages.value[0]!.blocks![0]).toMatchObject({
      id: "subagent-child",
      complete: true,
      output: "Child done",
    });
    expect(session.messages.value[1]!.blocks).toEqual([]);
    session.close();
  });
  it("a rejected local prompt does not remove a different viewer’s admitted turn", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    let reject!: (error: Error) => void;
    fake.rpc.mockImplementation((method: string) =>
      method === "prompt.submit"
        ? new Promise((_resolve, fail) => {
            reject = fail;
          })
        : Promise.resolve({ settled: true }),
    );
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    const pending = session.submit("Local question", "Local question", {});
    fake.hooks!.input("Other viewer question", false, "foreign-attempt");
    fake.hooks!.event({ type: "message.start", session_id: "runtime" } as any);
    reject(new NativeError("Session busy", "rejected"));
    await expect(pending).rejects.toThrow("Session busy");
    expect(session.messages.value.map((row) => row.content)).toEqual(["Other viewer question"]);
    expect(session.busy.value).toBe(true);
    expect(session.uncertain.value).toBe(false);
    session.close();
  });
  it("foreground reconnect never polls a pending submission or submits it twice", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    let acknowledge!: (value: unknown) => void;
    fake.rpc.mockImplementation((method: string) =>
      method === "prompt.submit"
        ? new Promise((resolve) => {
            acknowledge = resolve;
          })
        : Promise.resolve({ settled: true }),
    );
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    const pending = session.submit("Question", "Question", {});
    expect(nativeOutcome("alpha", "one")).toBe(true);
    // Healthy reconnect checks the existing connection only; no status RPC.
    fake.hooks!.connection("open");
    acknowledge({ outcome: "accepted" });
    await pending;
    expect(nativeOutcome("alpha", "one")).toBe(false);
    expect(fake.rpc.mock.calls.filter(([method]) => method === "prompt.submit")).toHaveLength(1);
    expect(fake.rpc.mock.calls.some(([method]) => method === "chat.status")).toBe(false);
    session.close();
  });
  it("a lost acknowledgement remains locked across close and reattachment", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockImplementation((method: string) =>
      method === "prompt.submit"
        ? Promise.reject(new Error("connection lost"))
        : Promise.resolve({ settled: true }),
    );
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    await expect(session.submit("Question", "Question", {})).rejects.toThrow("connection lost");
    session.close();
    await session.attach("alpha", "one");
    expect(session.uncertain.value).toBe(true);
    await expect(session.submit("Question", "Question", {})).rejects.toMatchObject({
      outcome: "rejected",
    });
    session.close();
  });
  it("fresh recovery restores activity and output without using inflight text twice", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: true });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    fake.hooks!.snapshot({
      messages: [],
      running: true,
      inflight: { user: "Question", assistant: "Hello" },
      recovery: { complete: true, base_row_ids: [] },
    } as any);
    fake.hooks!.input("Question", false);
    const event = (type: string, payload: any) =>
      fake.hooks!.event({ session_id: "runtime", type, payload } as any);
    event("reasoning.delta", { text: "Think" });
    event("reasoning.available", { text: "Thinking" });
    event("tool.start", { tool_id: "call", name: "terminal", args: { command: "pwd" } });
    event("tool.complete", { tool_id: "call", name: "terminal", result: { output: "/test" } });
    event("message.delta", { text: "Hello" });
    fake.hooks!.recovered();
    expect(session.messages.value).toHaveLength(1);
    expect(session.messages.value[0]!.blocks!.map((block) => block.kind)).toEqual([
      "thinking",
      "tool",
      "text",
    ]);
    expect(session.messages.value[0]!.blocks![0]!.content).toBe("Thinking");
    expect(session.messages.value[0]!.blocks![2]!.content).toBe("Hello");
    expect(session.busy.value).toBe(true);
    session.close();
  });
});

it.each(["Same reply", "Same reply with more detail"])(
  "new user occurrence retains its own final: %s",
  async (final) => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: false });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    const event = (type: string, payload: any) =>
      fake.hooks!.event({ session_id: "runtime", type, payload } as any);
    fake.hooks!.input("First", false);
    event("message.interim", { text: "Same reply" });
    event("message.complete", { text: "Same reply", status: "complete" });
    fake.hooks!.input("Second", false);
    event("message.start", {});
    event("message.complete", { text: final, status: "complete" });
    expect(session.messages.value.map((row) => row.content)).toEqual(["First", "Second"]);
    expect(
      session.messages.value.map((row) =>
        row.blocks!.filter((b) => b.kind === "text").map((b) => b.content),
      ),
    ).toEqual([["Same reply"], [final]]);
    session.close();
  },
);

it("passes prompt-less message.start boundaries to the native reducer", async () => {
  vi.spyOn(api, "messages").mockResolvedValue([]);
  fake.rpc.mockResolvedValue({ settled: false });
  const session = useNativeSession(vi.fn());
  await session.attach("alpha", "one");
  const event = (type: string, payload: any) =>
    fake.hooks!.event({ session_id: "runtime", type, payload } as any);
  fake.hooks!.input("Question", false);
  event("message.interim", { text: "Same reply" });
  event("message.start", {});
  event("message.complete", { text: "Same reply", status: "complete" });
  expect(
    session.messages.value[0]!.blocks!.filter((b) => b.kind === "text").map((b) => b.content),
  ).toEqual(["Same reply", "Same reply"]);
  session.close();
});

it.each(["hidden", "auto_continue", "process_complete", "async_delegation_complete"])(
  "reconstructs %s input with inspectable notices and without replaying assistant output",
  async (display_kind) => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: false });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    const snapshot = {
      messages: [
        {
          row_id: 1,
          role: "user",
          text: "internal",
          display_kind,
          display_metadata: { display_text: "Job finished" },
        },
        { row_id: 2, role: "assistant", text: "Partial" },
      ],
      running: true,
      inflight: {
        user: "internal",
        assistant: "Partial",
        display_kind,
        display_metadata: { display_text: "Job finished" },
      },
      recovery: { complete: false, base_row_ids: null },
    };
    fake.hooks!.snapshot(snapshot as any);
    fake.hooks!.recovered();
    const { transcriptEntries } = await import("../utils/transcript-entries");
    const rendered = () =>
      transcriptEntries({
        messages: session.messages.value,
        progress: [],
        working: session.busy.value,
      });
    expect(rendered().some((entry) => entry.kind === "user")).toBe(false);
    if (display_kind === "hidden") expect(JSON.stringify(rendered())).not.toContain("internal");
    else if (display_kind === "async_delegation_complete")
      expect(rendered().find((entry) => entry.kind === "turn")).toMatchObject({
        blocks: [{ kind: "tool", title: "Job finished", content: "internal", complete: true }],
      });
    else
      expect(rendered().find((entry) => entry.kind === "status")).toMatchObject({
        text: "Job finished",
        content: "internal",
      });
    expect(rendered().filter((entry) => entry.kind === "turn")).toHaveLength(
      display_kind === "async_delegation_complete" ? 2 : 1,
    );
    fake.hooks!.snapshot(snapshot as any);
    fake.hooks!.recovered();
    expect(rendered().filter((entry) => entry.kind === "turn")).toHaveLength(
      display_kind === "async_delegation_complete" ? 2 : 1,
    );
    expect(fake.rpc.mock.calls.some(([method]) => method === "prompt.submit")).toBe(false);
    session.close();
  },
);

it.each(["process_complete", "async_delegation_complete"])(
  "restores native %s metadata over durable HTTP history by row identity",
  async (display_kind) => {
    vi.spyOn(api, "messages").mockResolvedValue([
      { id: "1", role: "user", content: "internal", display_kind },
    ]);
    fake.rpc.mockImplementation(async (method) =>
      method === "history"
        ? {
            messages: [
              {
                id: "1",
                role: "user",
                content: "internal",
                display_kind,
                display_metadata: { display_text: "Job finished" },
              },
            ],
          }
        : { settled: true },
    );
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    await session.hydrate();
    expect(session.messages.value[0]!.display_metadata).toEqual({ display_text: "Job finished" });
    session.close();
  },
);

it("keeps the reconstructed assistant projection when the in-flight snapshot repeats it", async () => {
  vi.spyOn(api, "messages").mockResolvedValue([]);
  fake.rpc.mockResolvedValue({ settled: false });
  const session = useNativeSession(vi.fn());
  await session.attach("alpha", "one");
  fake.hooks!.snapshot({
    messages: [
      { row_id: 1, role: "user", text: "Question" },
      { row_id: 2, role: "assistant", text: "Recovered final" },
    ],
    running: false,
    inflight: { user: "Question", assistant: "Recovered final" },
    recovery: { complete: false, base_row_ids: null },
  } as any);
  fake.hooks!.recovered();
  expect(session.messages.value[0]!.blocks).toEqual([
    expect.objectContaining({ kind: "text", content: "Recovered final" }),
  ]);
  session.close();
});

it.each(["complete", "interrupted", "error"])(
  "keeps %s terminal state separate from disconnect and repeated terminal delivery",
  async (status) => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockResolvedValue({ settled: false });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    fake.hooks!.input("Question", false);
    const event = {
      type: "message.complete",
      session_id: "runtime",
      payload: { text: "Answer", status },
    } as any;
    fake.hooks!.event(event);
    fake.hooks!.event(event);
    expect(session.busy.value).toBe(false);
    expect(session.messages.value[0]!.blocks).toHaveLength(1);
    expect(session.status.value).toBe(
      status === "complete"
        ? "Response completed"
        : status === "error"
          ? "Response failed"
          : "Response interrupted",
    );
    await session.availability(false, true);
    expect(session.status.value).not.toContain("interrupted mid-run");
    expect(
      fake.rpc.mock.calls.some(
        ([method]) => method === "session.interrupt" || method === "prompt.submit",
      ),
    ).toBe(false);
    session.close();
  },
);

it("projects live batch delivery as completed activity without hiding its assistant turn", async () => {
  vi.spyOn(api, "messages").mockResolvedValue([]);
  fake.rpc.mockResolvedValue({ settled: false });
  const session = useNativeSession(vi.fn());
  await session.attach("alpha", "one");
  const receipt = "[ASYNC DELEGATION BATCH COMPLETE — batch-1]\nChild details";
  fake.hooks!.input(receipt, false, undefined, {
    display_kind: "async_delegation_complete",
  });
  const { transcriptEntries } = await import("../utils/transcript-entries");
  const rendered = () =>
    transcriptEntries({
      messages: session.messages.value,
      progress: [],
      working: session.busy.value,
    });
  expect(rendered()[0]).toMatchObject({
    kind: "turn",
    blocks: [{ kind: "tool", complete: true, content: receipt }],
  });
  fake.hooks!.event({
    session_id: "runtime",
    type: "message.delta",
    payload: { text: "Parent answer" },
  } as any);
  expect(rendered()[1]).toMatchObject({ kind: "turn", working: true });
  fake.hooks!.event({
    session_id: "runtime",
    type: "message.complete",
    payload: { text: "Parent answer", status: "complete" },
  } as any);
  expect(rendered()[1]).toMatchObject({
    kind: "turn",
    working: false,
    blocks: [{ kind: "text", content: "Parent answer" }],
  });
  expect(session.messages.value[0]!.content).toBe(receipt);
  session.close();
});

describe("session context accounting", () => {
  const usage = (percent: number, compressions = 0) => ({
    context_percent: percent,
    context_used: percent * 10,
    context_max: 1000,
    model: "model",
    compressions,
  });
  const event = (type: string, payload: unknown) => fake.hooks!.event({ type, payload } as any);
  async function setup() {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.usage.mockResolvedValue(usage(80));
    fake.breakdown.mockResolvedValue({
      categories: [{ id: "conversation", label: "Conversation", tokens: 800 }],
    });
    const session = useNativeSession(vi.fn());
    await session.attach("alpha", "one");
    return session;
  }
  it("loads usage on resume, consumes nested live and final usage, and loads details only while opened", async () => {
    const session = await setup();
    expect(session.contextUsage.value).toEqual(usage(80));
    expect(fake.breakdown).not.toHaveBeenCalled();
    event("session.usage", { usage: usage(85), total_tokens: 999999 });
    expect(session.contextUsage.value).toEqual(usage(85));
    expect(fake.usage).toHaveBeenCalledTimes(1);
    session.setContextOpen(true);
    await vi.waitFor(() => expect(session.contextBreakdown.value?.categories).toHaveLength(1));
    const calls = fake.breakdown.mock.calls.length;
    event("session.usage", { usage: usage(86) });
    event("session.usage", { usage: usage(87) });
    expect(fake.breakdown).toHaveBeenCalledTimes(calls);
    let resolve!: (value: unknown) => void;
    fake.usage.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    event("message.complete", { usage: usage(88), status: "complete" });
    expect(session.contextUsage.value).toEqual(usage(88));
    resolve(usage(89));
    await vi.waitFor(() => expect(session.contextUsage.value).toEqual(usage(89)));
    expect(fake.breakdown.mock.calls.length).toBeGreaterThan(calls);
    session.setContextOpen(false);
    event("message.complete", { usage: usage(90), status: "complete" });
    expect(session.contextBreakdown.value).toBeNull();
    session.close();
  });
  it.each([
    ["alpha", "two"],
    ["beta", "one"],
  ])("rejects delayed responses and events across selection of %s/%s", async (profile, id) => {
    const session = await setup();
    let resolveUsage!: (value: unknown) => void, resolveDetails!: (value: unknown) => void;
    fake.usage.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolveUsage = r;
        }),
    );
    fake.breakdown.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolveDetails = r;
        }),
    );
    const pending = session.refreshContext();
    session.setContextOpen(true);
    const previous = fake.hooks!;
    await session.attach(profile, id);
    resolveUsage(usage(99));
    resolveDetails({ categories: [{ label: "stale" }] });
    await pending;
    previous.event({ type: "session.usage", payload: { usage: usage(99) } } as any);
    expect(session.contextUsage.value).toEqual(usage(80));
    expect(session.contextBreakdown.value).toBeNull();
    session.close();
  });
  it("does not let an earlier RPC overwrite a newer event, completion, or same-session RPC", async () => {
    const session = await setup();
    let resolve!: (value: unknown) => void;
    fake.usage.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const pending = session.refreshContext();
    event("session.usage", { usage: usage(40, 1) });
    resolve(usage(90));
    await pending;
    expect(session.contextUsage.value).toEqual(usage(40, 1));
    fake.usage.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const older = session.refreshContext();
    await session.refreshContext();
    resolve(usage(99));
    await older;
    expect(session.contextUsage.value).toEqual(usage(80));
    session.close();
  });
  it("invalidates old details after compression, reclamation, disconnection and reconnects", async () => {
    const session = await setup();
    session.setContextOpen(true);
    await vi.waitFor(() => expect(session.contextBreakdown.value).not.toBeNull());
    let resolve!: (value: unknown) => void;
    fake.breakdown.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    event("session.usage", { usage: usage(30, 1) });
    expect(session.contextUsage.value?.context_percent).toBe(30);
    expect(session.contextBreakdown.value).toBeNull();
    event("session.reclaimed", {});
    resolve({ categories: [{ label: "before reclamation" }] });
    await vi.waitFor(() =>
      expect(session.contextBreakdown.value?.categories[0]?.label).toBe("Conversation"),
    );
    await session.availability(true, false);
    expect(session.contextUsage.value).toBeNull();
    expect(session.contextBreakdown.value).toBeNull();
    await session.availability(true, true);
    expect(session.contextUsage.value).toEqual(usage(80));
    session.close();
  });
  it("ignores closed detail replies and handles unavailable usage without cumulative-token fallback", async () => {
    const session = await setup();
    let resolve!: (value: unknown) => void;
    fake.breakdown.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    session.setContextOpen(true);
    session.setContextOpen(false);
    resolve({ categories: [{ label: "closed" }] });
    await Promise.resolve();
    expect(session.contextBreakdown.value).toBeNull();
    event("session.usage", { total_tokens: 99999 });
    expect(session.contextUsage.value).toBeNull();
    fake.usage.mockRejectedValueOnce(new Error("unavailable"));
    await session.refreshContext();
    expect(session.contextUsage.value).toBeNull();
    fake.breakdown.mockRejectedValueOnce(new Error("not initialized"));
    session.setContextOpen(true);
    await vi.waitFor(() => expect(session.contextLoading.value).toBe(false));
    expect(session.contextBreakdown.value).toBeNull();
    session.close();
  });
});

it("rejects obsolete backfill after refresh and replaces rewound persisted rows", async () => {
  let finishOlder!: (value: any) => void;
  const tail = {
    messages: [
      { id: "2", role: "user", content: "Retained" },
      { id: "3", role: "assistant", content: "Rewound" },
    ],
    nextOffset: 120,
    hasMore: true,
    revision: "before",
    projected: true,
  };
  const latest = vi.spyOn(api, "latestMessages").mockResolvedValue(tail);
  fake.rpc.mockResolvedValue({ settled: true });
  const session = useNativeSession(vi.fn());
  await session.attach("alpha", "one");
  await session.hydrate();
  latest.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishOlder = resolve;
      }),
  );
  const older = session.loadEarlier();
  latest.mockResolvedValue({
    messages: [{ id: "2", role: "user", content: "Retained" }],
    nextOffset: 1,
    hasMore: false,
    revision: "after",
    projected: true,
  });
  await session.hydrate();
  finishOlder({
    messages: [{ id: "1", role: "user", content: "Obsolete" }],
    nextOffset: 240,
    hasMore: false,
    revision: "before",
    projected: true,
  });
  await older;
  expect(session.messages.value.map((row) => row.content)).toEqual(["Retained"]);
  expect(session.hasEarlier.value).toBe(false);
  session.close();
});

it("refreshes a changed pagination revision without resurrecting removed rows", async () => {
  const latest = vi.spyOn(api, "latestMessages").mockResolvedValue({
    messages: [{ id: "2", role: "user", content: "Old tail" }],
    nextOffset: 120,
    hasMore: true,
    revision: "before",
    projected: true,
  });
  fake.rpc.mockResolvedValue({ settled: true });
  const session = useNativeSession(vi.fn());
  await session.attach("alpha", "one");
  await session.hydrate();
  const { ApiError } = await import("../../../services/hermes-api");
  latest.mockRejectedValueOnce(new ApiError(409, "Changed"));
  latest.mockResolvedValue({
    messages: [{ id: "3", role: "user", content: "New tail" }],
    nextOffset: 1,
    hasMore: false,
    revision: "after",
    projected: true,
  });
  await session.loadEarlier();
  expect(session.messages.value.map((row) => row.content)).toEqual(["New tail"]);
  expect(session.loadingEarlier.value).toBe(false);
  expect(session.earlierError.value).toBe("");
  session.close();
});

it("restores persisted tools after an omitted in-flight snapshot settles", async () => {
  const rows = [
    { id: "1", role: "user", content: "Earlier" },
    { id: "2", role: "assistant", content: "Earlier answer" },
    { id: "3", role: "user", content: "Question", display_kind: null },
    {
      id: "4",
      role: "assistant",
      content: "",
      tool_calls: [{ id: "call", function: { name: "terminal", arguments: "{}" } }],
    },
    {
      id: "5",
      role: "tool",
      content: "saved-tool-output",
      tool_call_id: "call",
      tool_name: "terminal",
    },
    { id: "6", role: "assistant", content: "Final answer" },
  ];
  vi.spyOn(api, "latestMessages").mockResolvedValue({
    messages: rows,
    nextOffset: rows.length,
    hasMore: false,
    revision: "r1",
    projected: true,
  });
  fake.rpc.mockResolvedValue({ settled: true });
  const session = useNativeSession(vi.fn());
  await session.attach("alpha", "one");
  fake.hooks!.snapshot({
    messages: [],
    messages_omitted: true,
    running: true,
    inflight: { user: "Question", assistant: "Final answer", streaming: true },
    recovery: { complete: false, base_row_ids: null },
  } as any);
  fake.hooks!.recovered();
  fake.hooks!.event({ type: "message.complete", payload: { status: "complete" } } as any);
  await session.hydrate();
  expect(session.messages.value.map((row) => row.id)).toEqual(["1", "2", "3", "4", "5", "6"]);
  expect(session.messages.value[2]?.blocks).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ kind: "tool", output: "saved-tool-output", complete: true }),
    ]),
  );
  expect(session.error.value).toBe("");
  session.close();
});

it("hydrates the persisted prefix while an omitted resumed turn is still running", async () => {
  const rows = [
    { id: "1", role: "user", content: "Before compaction" },
    { id: "2", role: "assistant", content: "Saved before compaction" },
    { id: "3", role: "user", content: "Current question", display_kind: null },
    { id: "4", role: "assistant", content: "Partial reply" },
  ];
  vi.spyOn(api, "latestMessages").mockResolvedValue({
    messages: rows,
    nextOffset: 120,
    hasMore: true,
    revision: "r1",
    projected: true,
  });
  const session = useNativeSession(vi.fn());
  await session.attach("alpha", "one");
  fake.hooks!.snapshot({
    messages: [],
    messages_omitted: true,
    running: true,
    inflight: { user: "Current question", assistant: "Partial reply", streaming: true },
    recovery: { complete: false, base_row_ids: null },
  } as any);
  fake.hooks!.recovered();
  // Keep this test's tail complete; production backfills only when requested.
  vi.spyOn(api, "latestMessages").mockResolvedValue({
    messages: rows,
    nextOffset: 120,
    hasMore: true,
    revision: "r1",
    projected: true,
  });
  await session.hydrate();
  expect(session.messages.value.slice(0, 2).map((row) => row.id)).toEqual(["1", "2"]);
  expect(session.messages.value.filter((row) => row.content === "Current question")).toHaveLength(
    1,
  );
  expect(session.messages.value.find((row) => row.content === "Current question")?.blocks).toEqual(
    expect.arrayContaining([expect.objectContaining({ kind: "text", content: "Partial reply" })]),
  );
  expect(session.busy.value).toBe(true);
  session.close();
});
