// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { useNativeSession } from "./native-session";
import { api } from "../../../services/hermes-api";
import { nativeOutcome } from "./native-admission";
import type { NativeHooks } from "./native-chat";
import { NativeError } from "./native-chat";

const fake = vi.hoisted(() => ({
  hooks: undefined as NativeHooks | undefined,
  rpc: vi.fn(),
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
      close() {}
    },
  };
});
afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  fake.rpc.mockReset();
  fake.boundary = 10;
});
describe("native session state", () => {
  it.each([false, true])(
    "explicitly resolves an idle native session with an unterminated retained input (reload: %s)",
    async (reload) => {
      vi.spyOn(api, "messages").mockResolvedValue([]);
      fake.rpc.mockImplementation(async (method) => {
        if (method === "chat.submit") throw new NativeError("Lost acknowledgement");
        if (method === "chat.state") return { running: false, queued: false };
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
      expect(fake.rpc.mock.calls.filter(([method]) => method === "chat.submit")).toHaveLength(1);
      session.close();
    },
  );
  it.each(["running", "queued", "delegating", "missing", "unavailable", "history failure"])(
    "keeps uncertainty when the native check reports %s",
    async (state) => {
      const history = vi.spyOn(api, "messages").mockResolvedValue([]);
      fake.rpc.mockImplementation(async (method) => {
        if (method === "chat.submit") throw new NativeError("Lost acknowledgement");
        if (method === "chat.state") {
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
      expect(fake.rpc.mock.calls.filter(([method]) => method === "chat.submit")).toHaveLength(1);
      session.close();
    },
  );
  it("does not resolve an admission that is still awaiting acknowledgement", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    let acknowledge!: () => void;
    fake.rpc.mockImplementation((method) =>
      method === "chat.submit"
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
    expect(fake.rpc.mock.calls.some(([method]) => method === "chat.state")).toBe(false);
    acknowledge();
    await sending;
    session.close();
  });
  it.each(["state", "history"])(
    "does not settle a new selection while the old %s check is pending",
    async (phase) => {
      const history = vi.spyOn(api, "messages").mockResolvedValue([]);
      fake.rpc.mockImplementation(async (method) => {
        if (method === "chat.submit") throw new NativeError("Lost acknowledgement");
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
      if (method === "chat.submit") throw new NativeError("Lost acknowledgement");
      if (method === "chat.state") {
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
      method === "chat.submit"
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
      method === "chat.submit"
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
    expect(fake.rpc.mock.calls.filter(([method]) => method === "chat.submit")).toHaveLength(1);
    expect(fake.rpc.mock.calls.some(([method]) => method === "chat.status")).toBe(false);
    session.close();
  });
  it("a lost acknowledgement remains locked across close and reattachment", async () => {
    vi.spyOn(api, "messages").mockResolvedValue([]);
    fake.rpc.mockImplementation((method: string) =>
      method === "chat.submit"
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
    expect(fake.rpc.mock.calls.some(([method]) => method === "chat.submit")).toBe(false);
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
      method === "chat.history"
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
      fake.rpc.mock.calls.some(([method]) => method === "chat.stop" || method === "chat.submit"),
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
