// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { useNativeSession } from "./native-session";
import { api } from "../../../services/hermes-api";
import { nativeOutcome } from "./native-admission";
import type { NativeHooks } from "./native-chat";
import { NativeError } from "./native-chat";

const fake = vi.hoisted(() => ({ hooks: undefined as NativeHooks | undefined, rpc: vi.fn() }));
vi.mock("./native-chat", async (importOriginal) => {
  const original = await importOriginal<typeof import("./native-chat")>();
  return {
    ...original,
    NativeViewer: class {
      profile = "alpha";
      stored = "one";
      boundary = 10;
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
});
describe("native session state", () => {
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

it.each(["hidden", "auto_continue", "process_complete"])(
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
    else
      expect(rendered().find((entry) => entry.kind === "status")).toMatchObject({
        text: "Job finished",
        content: "internal",
      });
    expect(rendered().filter((entry) => entry.kind === "turn")).toHaveLength(1);
    fake.hooks!.snapshot(snapshot as any);
    fake.hooks!.recovered();
    expect(rendered().filter((entry) => entry.kind === "turn")).toHaveLength(1);
    expect(fake.rpc.mock.calls.some(([method]) => method === "chat.submit")).toBe(false);
    session.close();
  },
);

it("restores native display metadata over durable HTTP history by row identity", async () => {
  vi.spyOn(api, "messages").mockResolvedValue([
    { id: "1", role: "user", content: "internal", display_kind: "process_complete" },
  ]);
  fake.rpc.mockImplementation(async (method) =>
    method === "chat.history"
      ? {
          messages: [
            {
              id: "1",
              role: "user",
              content: "internal",
              display_kind: "process_complete",
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
});

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
