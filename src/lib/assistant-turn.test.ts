import { describe, expect, it } from "vite-plus/test";
import {
  createTurn,
  historyBlocks,
  mergeHistoryBlocks,
  normalizeEvent,
  nativeSubagentId,
  reduceTurn,
  reduceNativeTurn,
} from "./assistant-turn";
import type { SSEEvent } from "./sse";
const frame = (event: string, data: unknown, id?: string): SSEEvent => ({
  event,
  data: JSON.stringify(data),
  id,
});
function setup() {
  const turn = createTurn();
  const emit = (name: string, data: unknown = {}, id?: string) => {
    const event = normalizeEvent(frame(name, data, id));
    if (event) reduceTurn(turn, event);
  };
  return { turn, emit };
}
describe("Hermes event normalization and ordered assistant turns", () => {
  it("streams plain text without requiring reasoning or tools", () => {
    const { turn, emit } = setup();
    emit("assistant.delta", { delta: "**Hello" });
    emit("assistant.delta", { delta: "** world" });
    emit("run.completed");
    expect(turn.blocks).toEqual([{ id: "block-1", kind: "text", content: "**Hello** world" }]);
  });
  it("coalesces continuous reasoning and collapses it before text", () => {
    const { turn, emit } = setup();
    emit("tool.progress", { tool_name: "_thinking", delta: "First " });
    emit("reasoning.delta", { delta: "second" });
    expect(turn.blocks).toHaveLength(1);
    expect(turn.blocks[0]).toMatchObject({ content: "First second", complete: false });
    emit("assistant.delta", { delta: "Answer" });
    expect(turn.blocks[0]).toMatchObject({ kind: "thinking", complete: true });
    expect(turn.blocks[1]).toMatchObject({ kind: "text", content: "Answer" });
  });
  it("keeps multiple reasoning phases, tools, and commentary in arrival order", () => {
    const { turn, emit } = setup();
    emit("reasoning.delta", { delta: "Locate files" });
    emit("tool.started", {
      tool_call_id: "a",
      tool_name: "file_search",
      args: { query: "config" },
    });
    emit("tool.completed", { tool_call_id: "a", output: "config.yaml", duration_s: 1.8 });
    emit("reasoning.available", { text: "Read the file" });
    emit("assistant.commentary", { text: "Checking configuration" });
    emit("tool.started", { tool_call_id: "b", tool_name: "read_file" });
    emit("tool.completed", { tool_call_id: "b", output: "contents" });
    emit("reasoning.delta", { delta: "Now explain" });
    emit("assistant.delta", { delta: "Answer" });
    expect(turn.blocks.map((block) => block.kind)).toEqual([
      "thinking",
      "tool",
      "thinking",
      "text",
      "tool",
      "thinking",
      "text",
    ]);
    expect(turn.blocks[1]).toMatchObject({
      id: "a",
      title: "Searched files",
      duration: 1.8,
      output: "config.yaml",
    });
    expect(turn.blocks.every((block) => block.kind !== "thinking" || block.complete)).toBe(true);
  });
  it("updates parallel calls by native ID even while text is arriving", () => {
    const { turn, emit } = setup();
    emit("tool.started", { tool_call_id: "a", tool_name: "terminal" });
    emit("tool.started", { tool_call_id: "b", tool_name: "terminal" });
    emit("tool.progress", { tool_call_id: "a", delta: "A" });
    emit("assistant.delta", { delta: "Writing" });
    emit("tool.completed", { tool_call_id: "b", output: "B" });
    expect(turn.blocks[0]).toMatchObject({ id: "a", state: "running", output: "A" });
    expect(turn.blocks[1]).toMatchObject({ id: "b", complete: true, output: "B" });
    expect(turn.blocks[2]?.kind).toBe("text");
  });
  it("matches sequential REST tools without native call IDs", () => {
    const { turn, emit } = setup();
    for (let i = 0; i < 3; i++) {
      emit("tool.started", { tool_name: "terminal", args: { command: `echo ${i}` } });
      emit("tool.completed", { tool_name: "terminal" });
    }
    expect(turn.blocks).toHaveLength(3);
    expect(new Set(turn.blocks.map((block) => block.id)).size).toBe(3);
  });
  it("preserves failures and long structured output inside activity details", () => {
    const { turn, emit } = setup();
    const output = { error: "Command failed", stderr: "x".repeat(100_000), exit_code: 1 };
    emit("tool.started", { tool_call_id: "a", tool_name: "terminal" });
    emit("tool.failed", { tool_call_id: "a", output });
    expect(turn.blocks[0]).toMatchObject({
      state: "failed",
      complete: true,
      output: JSON.stringify(output, null, 2),
    });
    expect(turn.blocks).toHaveLength(1);
  });
  it("deduplicates sequenced replay during a tool and during assistant text", () => {
    const { turn, emit } = setup();
    const start = { seq: 1, run_id: "run", tool_call_id: "a", tool_name: "terminal" };
    emit("tool.started", start);
    emit("assistant.delta", { seq: 2, run_id: "run", delta: "Hello" });
    emit("tool.started", start, "1");
    emit("assistant.delta", { seq: 2, run_id: "run", delta: "Hello" }, "2");
    emit("tool.completed", { seq: 3, run_id: "run", tool_call_id: "a", output: "done" });
    expect(turn.blocks).toHaveLength(2);
    expect(turn.blocks[1]?.content).toBe("Hello");
    expect(turn.blocks[0]).toMatchObject({ complete: true, output: "done" });
  });
  it("merges native resume snapshots without duplicating text or losing activities", () => {
    const { turn, emit } = setup();
    emit("tool.started", { tool_call_id: "a", tool_name: "terminal" });
    emit("assistant.delta", { delta: "Hello" });
    emit("assistant.snapshot", { text: "Hello world" });
    emit("assistant.snapshot", { text: "Hello world" });
    emit("assistant.delta", { delta: "!" });
    expect(turn.blocks).toHaveLength(2);
    expect(turn.blocks[1]?.content).toBe("Hello world!");
    expect(turn.blocks[0]).toMatchObject({ id: "a", state: "running" });
  });
  it("uses the final text snapshot for its phase and retains earlier commentary", () => {
    const { turn, emit } = setup();
    emit("assistant.delta", { delta: "Checking" });
    emit("assistant.commentary", { text: "Checking", already_streamed: true });
    emit("tool.started", { tool_call_id: "a" });
    emit("tool.completed", { tool_call_id: "a" });
    emit("assistant.delta", { delta: "Answ" });
    emit("assistant.completed", { content: "Answer" });
    emit("run.completed");
    expect(
      turn.blocks.filter((block) => block.kind === "text").map((block) => block.content),
    ).toEqual(["Checking", "Answer"]);
  });
  it.each(["reasoning.delta", "tool.started"])(
    "does not repeat completed text after trailing %s",
    (activity) => {
      const { turn, emit } = setup();
      emit("assistant.delta", { delta: "Final " });
      emit("assistant.delta", { delta: "answer" });
      emit(activity, { delta: "Finishing", tool_call_id: "a" });
      emit("assistant.completed", { content: "Final answer" });
      emit("run.completed");
      expect(turn.blocks).toHaveLength(2);
      expect(turn.blocks[0]).toMatchObject({ kind: "text", content: "Final answer" });
      expect(turn.blocks[1]).toMatchObject({ complete: true, state: "completed" });
    },
  );
  it.each([
    ["Final checks", "Final"],
    ["Final", "Final answer"],
  ])("keeps distinct phases across a tool: %s → %s", (interim, final) => {
    const { turn, emit } = setup();
    emit("assistant.delta", { delta: interim });
    emit("tool.started", { tool_call_id: "a" });
    emit("tool.completed", { tool_call_id: "a" });
    emit("assistant.completed", { content: final });
    expect(turn.blocks.map((block) => block.kind)).toEqual(["text", "tool", "text"]);
    expect(
      turn.blocks.filter((block) => block.kind === "text").map((block) => block.content),
    ).toEqual([interim, final]);
  });
  it("compares a repeated completion only with the latest text phase", () => {
    const { turn, emit } = setup();
    emit("assistant.delta", { delta: "Answer" });
    emit("tool.started", { tool_call_id: "a" });
    emit("assistant.delta", { delta: "Checking" });
    emit("tool.started", { tool_call_id: "b" });
    emit("assistant.completed", { content: "Answer" });
    expect(turn.blocks.map((block) => block.kind)).toEqual([
      "text",
      "tool",
      "text",
      "tool",
      "text",
    ]);
    expect(
      turn.blocks.filter((block) => block.kind === "text").map((block) => block.content),
    ).toEqual(["Answer", "Checking", "Answer"]);
  });
  it("reconstructs a completed conversation from native reasoning, call and result fields", () => {
    const blocks = historyBlocks([
      {
        role: "assistant",
        content: "Checking",
        reasoning_content: "Plan",
        tool_calls: [{ id: "a", function: { name: "terminal", arguments: '{"command":"false"}' } }],
      },
      { role: "tool", tool_call_id: "a", content: '{"error":"failed"}' },
      { role: "assistant", reasoning: "Recover", content: "Final answer" },
    ]);
    expect(blocks.map((block) => block.kind)).toEqual([
      "thinking",
      "text",
      "tool",
      "thinking",
      "text",
    ]);
    expect(blocks[2]).toMatchObject({
      id: "a",
      state: "failed",
      output: '{"error":"failed"}',
      complete: true,
    });
  });
  it("ignores unknown and malformed events", () => {
    expect(normalizeEvent(frame("new.protocol.event", { raw: "hidden" }))).toBeUndefined();
    const { turn, emit } = setup();
    emit("new.protocol.event");
    emit("assistant.delta", { delta: "OK" });
    expect(turn.blocks).toHaveLength(1);
    expect(normalizeEvent({ event: "unknown", data: "{" })).toBeUndefined();
  });
  it("marks unfinished tools failed when the response fails", () => {
    const { turn, emit } = setup();
    emit("tool.started", { tool_call_id: "a" });
    emit("run.failed");
    expect(turn.blocks[0]).toMatchObject({ complete: true, state: "failed" });
  });
});

describe("persisted turn recovery", () => {
  it.each([false, true])(
    "does not match an intermediate text prefix across a tool boundary (active: %s)",
    (active) => {
      const { turn, emit } = setup();
      emit("assistant.delta", { delta: "Checking" });
      emit("tool.started", { tool_call_id: "a" });
      emit("tool.started", { tool_call_id: "b" });
      emit("assistant.delta", { delta: "Final" });
      const restored = historyBlocks([
        { role: "assistant", content: "Checking", tool_calls: [{ id: "a" }] },
        { role: "tool", tool_call_id: "a", content: "first" },
        { role: "assistant", content: "Final checks", tool_calls: [{ id: "b" }] },
        { role: "tool", tool_call_id: "b", content: "second" },
        { role: "assistant", content: "Final answer" },
      ]);
      const expected = [
        { kind: "text", content: "Checking" },
        { kind: "tool", id: "a", output: "first", complete: true },
        { kind: "text", content: "Final checks" },
        { kind: "tool", id: "b", output: "second", complete: true },
        { kind: "text", content: "Final answer" },
      ];
      mergeHistoryBlocks(turn, restored, active);
      expect(turn.blocks).toMatchObject(expected);
      expect(turn.blocks).toHaveLength(expected.length);
      mergeHistoryBlocks(turn, restored, active);
      expect(turn.blocks).toMatchObject(expected);
      expect(turn.blocks).toHaveLength(expected.length);
    },
  );
  it("retains every missing text phase between matched tools without duplication", () => {
    const turn = createTurn();
    reduceTurn(turn, { type: "text", data: { delta: "Checking" } });
    reduceTurn(turn, { type: "tool.started", data: { tool_call_id: "a" } });
    reduceTurn(turn, { type: "tool.started", data: { tool_call_id: "b" } });
    reduceTurn(turn, { type: "text", data: { delta: "Final" } });
    const restored = historyBlocks([
      { role: "assistant", content: "Checking", tool_calls: [{ id: "a" }] },
      { role: "tool", tool_call_id: "a", content: "first" },
      { role: "assistant", content: "Intermediate one" },
      { role: "assistant", content: "Intermediate two", tool_calls: [{ id: "b" }] },
      { role: "tool", tool_call_id: "b", content: "second" },
      { role: "assistant", content: "Final answer" },
    ]);
    mergeHistoryBlocks(turn, restored, false);
    mergeHistoryBlocks(turn, restored, false);
    expect(turn.blocks.map((block) => block.kind)).toEqual([
      "text",
      "tool",
      "text",
      "text",
      "tool",
      "text",
    ]);
    expect(
      turn.blocks.filter((block) => block.kind === "text").map((block) => block.content),
    ).toEqual(["Checking", "Intermediate one", "Intermediate two", "Final answer"]);
  });
  it("keeps matched and newly recovered unfinished calls running during active recovery", () => {
    const turn = createTurn();
    reduceTurn(turn, { type: "tool.started", data: { tool_call_id: "a", tool_name: "terminal" } });
    reduceTurn(turn, { type: "tool.updated", data: { tool_call_id: "a", delta: "live progress" } });
    const restored = historyBlocks([
      {
        role: "assistant",
        content: "",
        tool_calls: [
          { id: "a", function: { name: "terminal" } },
          { id: "b", function: { name: "read_file" } },
        ],
      },
    ]);
    mergeHistoryBlocks(turn, restored, true);
    expect(turn.blocks[0]).toMatchObject({
      id: "a",
      complete: false,
      state: "running",
      output: "live progress",
    });
    expect(turn.blocks[1]).toMatchObject({
      id: "b",
      complete: false,
      state: "running",
      title: "Reading file",
    });
    mergeHistoryBlocks(
      turn,
      historyBlocks([{ role: "tool", tool_call_id: "a", content: "" }]),
      true,
    );
    expect(turn.blocks[0]).toMatchObject({ complete: true, state: "completed", output: "" });
  });
  it("never invents timing for persisted calls or orphaned results", () => {
    const blocks = historyBlocks([
      { role: "assistant", content: "", tool_calls: [{ id: "a" }] },
      { role: "tool", tool_call_id: "a", content: "done" },
      { role: "tool", tool_call_id: "orphan", content: "done" },
    ]);
    for (const block of blocks) {
      expect(block).toMatchObject({ complete: true });
      expect(block).not.toHaveProperty("duration", expect.any(Number));
      expect(block).not.toHaveProperty("startedAt", expect.any(Number));
    }
  });
  it("preserves measured live duration and longer text when history lags", () => {
    const turn = createTurn();
    reduceTurn(turn, { type: "tool.started", data: { tool_call_id: "a", ts: 100 } });
    reduceTurn(turn, {
      type: "tool.completed",
      data: { tool_call_id: "a", ts: 102, output: "done" },
    });
    reduceTurn(turn, { type: "text", data: { delta: "Answer in progress" } });
    mergeHistoryBlocks(
      turn,
      historyBlocks([
        { role: "assistant", content: "", tool_calls: [{ id: "a" }] },
        { role: "tool", tool_call_id: "a", content: "done" },
        { role: "assistant", content: "Answer" },
      ]),
      true,
    );
    expect(turn.blocks[0]).toMatchObject({ duration: 2 });
    expect(turn.blocks[1]?.content).toBe("Answer in progress");
  });
});

describe("native Desktop event semantics", () => {
  it.each([false, true])(
    "collapses a repeated final onto its sealed interim and retains activity (streamed: %s)",
    (streamed) => {
      const turn = createTurn();
      reduceNativeTurn(turn, "message.start", {});
      reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
      const kept = turn.blocks[0];
      reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
      reduceNativeTurn(turn, "tool.complete", { tool_id: "a", result_text: "Done" });
      reduceNativeTurn(turn, "reasoning.delta", { text: "Verify" });
      if (streamed) reduceNativeTurn(turn, "message.delta", { text: "Same reply \n" });
      reduceNativeTurn(turn, "message.complete", { text: " Same reply ", status: "complete" });
      expect(turn.blocks.filter((block) => block.kind === "text")).toEqual([kept]);
      expect(turn.blocks[1]).toMatchObject({ id: "a", complete: true, output: "Done" });
      expect(turn.blocks[2]).toMatchObject({ kind: "thinking", complete: true, content: "Verify" });
    },
  );
  it.each(["different live text", "different interim", "new occurrence", "failure"])(
    "keeps completion separate across %s",
    (boundary) => {
      const turn = createTurn();
      reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
      if (boundary === "different interim")
        reduceNativeTurn(turn, "message.interim", { text: "Checking" });
      if (boundary === "new occurrence") reduceNativeTurn(turn, "message.start", {});
      reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
      if (boundary === "different live text")
        reduceNativeTurn(turn, "message.delta", { text: "Different" });
      reduceNativeTurn(turn, "message.complete", {
        text: "Same reply",
        status: boundary === "failure" ? "error" : "complete",
      });
      expect(
        turn.blocks.filter((block) => block.kind === "text").map((block) => block.content),
      ).toEqual(
        boundary === "different interim"
          ? ["Same reply", "Checking", "Same reply"]
          : ["Same reply", "Same reply"],
      );
    },
  );
  it("keeps a failed completion separate from an adjacent matching interim", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
    reduceNativeTurn(turn, "message.complete", {
      text: "Same reply",
      status: "error",
      error: "Provider failed",
    });
    expect(
      turn.blocks.filter((block) => block.kind === "text").map((block) => block.content),
    ).toEqual(["Same reply", "Same reply"]);
  });
  it.each([false, true])(
    "does not repeat interim text in a completion (already_streamed: %s)",
    (already_streamed) => {
      const turn = createTurn();
      reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
      if (already_streamed) reduceNativeTurn(turn, "message.delta", { text: "Final answer" });
      reduceNativeTurn(turn, "message.interim", { text: "Final answer", already_streamed });
      reduceNativeTurn(turn, "message.complete", { text: "Final answer", status: "complete" });
      expect(turn.blocks).toHaveLength(2);
      expect(turn.blocks[0]).toMatchObject({ kind: "tool", complete: true, state: "completed" });
      expect(turn.blocks[1]).toMatchObject({ kind: "text", content: "Final answer" });
    },
  );
  it("reconciles a final extension of the same sealed interim", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.delta", { text: "Final" });
    reduceNativeTurn(turn, "message.interim", { text: "Final", already_streamed: true });
    reduceNativeTurn(turn, "message.complete", { text: "Final answer", status: "complete" });
    expect(turn.blocks.map((block) => block.content)).toEqual(["Final answer"]);
  });
  it("keeps transient status out of reasoning, replaces reasoning, and upserts completed tools by identity", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "thinking.delta", { text: "Waiting on provider" });
    reduceNativeTurn(turn, "tool.generating", { name: "terminal" });
    expect(turn.blocks).toEqual([]);
    reduceNativeTurn(turn, "reasoning.delta", { text: "Partial" });
    reduceNativeTurn(turn, "reasoning.available", { text: "Full reasoning" });
    reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
    reduceNativeTurn(turn, "message.delta", { text: "Commentary" });
    expect(turn.blocks[1]).toMatchObject({ id: "a", complete: false });
    reduceNativeTurn(turn, "tool.complete", {
      tool_id: "a",
      name: "terminal",
      result_text: "done",
    });
    reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
    expect(turn.blocks).toHaveLength(3);
    expect(turn.blocks[0]?.content).toBe("Full reasoning");
    expect(turn.blocks[1]).toMatchObject({ complete: true, output: "done" });
  });
  it("separates streamed interim text from final text without repeating interim output", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.delta", { text: "Checking" });
    reduceNativeTurn(turn, "message.interim", { text: "Checking", already_streamed: true });
    reduceNativeTurn(turn, "message.delta", { text: "Answer" });
    reduceNativeTurn(turn, "message.complete", { text: "Answer", status: "complete" });
    expect(turn.blocks.map((block) => block.content)).toEqual(["Checking", "Answer"]);
  });
  it("keeps delegated activity alive after parent interruption and records later child failure", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "subagent.start", {
      subagent_id: "child",
      goal: "Check files",
      status: "running",
    });
    reduceNativeTurn(turn, "message.complete", { text: "Interrupted", status: "interrupted" });
    expect(turn.blocks[0]).toMatchObject({
      id: "subagent-child",
      complete: false,
      delegated: true,
    });
    reduceNativeTurn(turn, "subagent.complete", {
      subagent_id: "child",
      status: "failed",
      summary: "Tool failed",
    });
    expect(turn.blocks[0]).toMatchObject({
      complete: true,
      state: "failed",
      output: "Tool failed",
    });
  });
});

describe("native duplicate-final reconciliation", () => {
  const texts = (turn: ReturnType<typeof createTurn>) =>
    turn.blocks.filter((b) => b.kind === "text").map((b) => b.content);
  it.each(["  Final answer\n", "Final answer with a final detail"])(
    "settles trimmed or extended interim in place: %s",
    (final) => {
      const turn = createTurn();
      reduceNativeTurn(turn, "message.delta", { text: "Final answer" });
      reduceNativeTurn(turn, "message.interim", { text: "Final answer", already_streamed: true });
      const id = turn.blocks[0]!.id;
      reduceNativeTurn(turn, "message.complete", { text: final, status: "complete" });
      expect(texts(turn)).toEqual([final.trim()]);
      expect(turn.blocks[0]!.id).toBe(id);
    },
  );
  it("collapses an identical streamed sibling onto its interim, keeping tool order", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.interim", { text: "Same reply", already_streamed: true });
    const id = turn.blocks[0]?.id;
    reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
    reduceNativeTurn(turn, "tool.complete", { tool_id: "a", result_text: "done" });
    reduceNativeTurn(turn, "message.delta", { text: "Same reply" });
    reduceNativeTurn(turn, "message.complete", { text: "Same reply\n", status: "complete" });
    expect(texts(turn)).toEqual(["Same reply"]);
    expect(turn.blocks[0]!.id).toBe(id);
    expect(turn.blocks.map((b) => b.kind)).toEqual(["text", "tool"]);
    expect(turn.blocks[1]).toMatchObject({ id: "a", complete: true, output: "done" });
  });
  it("settles a same-turn tool-only interim duplicate without losing the call", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
    reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
    reduceNativeTurn(turn, "message.complete", { text: " Same reply\n", status: "complete" });
    expect(texts(turn)).toEqual(["Same reply"]);
    expect(turn.blocks.map((b) => b.kind)).toEqual(["text", "tool"]);
    expect(turn.blocks[1]).toMatchObject({ id: "a", complete: true });
  });
  it("repairs a few dropped characters in a long sealed interim", () => {
    const turn = createTurn(),
      final = "A detailed final answer. ".repeat(12);
    reduceNativeTurn(turn, "message.interim", { text: final.slice(0, 100) + final.slice(102) });
    reduceNativeTurn(turn, "message.complete", { text: final, status: "complete" });
    expect(texts(turn)).toEqual([final.trim()]);
  });
  it.each([false, true])(
    "keeps identical text as a new occurrence after message.start (streamed: %s)",
    (streamed) => {
      const turn = createTurn();
      reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
      reduceNativeTurn(turn, "message.start", {});
      if (streamed) reduceNativeTurn(turn, "message.delta", { text: "Same reply" });
      reduceNativeTurn(turn, "message.complete", { text: "Same reply", status: "complete" });
      expect(texts(turn)).toEqual(["Same reply", "Same reply"]);
    },
  );
  it.each(["Different answer", "Same reply with more detail"])(
    "keeps a separate tool phase for a distinct final: %s",
    (final) => {
      const turn = createTurn();
      reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
      reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
      reduceNativeTurn(turn, "message.complete", { text: final, status: "complete" });
      expect(texts(turn)).toEqual(["Same reply", final]);
      expect(turn.blocks.map((b) => b.kind)).toEqual(["text", "tool", "text"]);
    },
  );
  it("does not collapse distinct live text or a failed completion onto an interim", () => {
    for (const failure of [false, true]) {
      const turn = createTurn();
      reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
      reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
      reduceNativeTurn(turn, "message.delta", {
        text: failure ? "Same reply" : "Different live response",
      });
      reduceNativeTurn(turn, "message.complete", {
        text: "Same reply",
        status: failure ? "error" : "complete",
      });
      expect(texts(turn)).toEqual(["Same reply", "Same reply"]);
    }
  });
  it("does not reach past the nearest distinct interim", () => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
    reduceNativeTurn(turn, "message.interim", { text: "Another observation" });
    reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "terminal" });
    reduceNativeTurn(turn, "message.complete", { text: "Same reply", status: "complete" });
    expect(texts(turn)).toEqual(["Same reply", "Another observation", "Same reply"]);
  });
});

it("native final without post-tool deltas preserves the pre-tool commentary", () => {
  const turn = createTurn();
  reduceNativeTurn(turn, "message.delta", { text: "Checking the files" });
  reduceNativeTurn(turn, "tool.start", { tool_id: "a", name: "read_file" });
  reduceNativeTurn(turn, "message.complete", {
    text: "Checking the files is complete",
    status: "complete",
  });
  expect(turn.blocks.map((b) => b.kind)).toEqual(["text", "tool", "text"]);
  expect(turn.blocks.filter((b) => b.kind === "text").map((b) => b.content)).toEqual([
    "Checking the files",
    "Checking the files is complete",
  ]);
});

it.each(["Same reply", "Same reply extended", "A distinct reply"])(
  "native start protects an earlier interim from final continuity: %s",
  (final) => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.interim", { text: "Same reply" });
    reduceNativeTurn(turn, "message.start", {});
    reduceNativeTurn(turn, "message.complete", { text: final, status: "complete" });
    expect(turn.blocks.map((b) => b.content)).toEqual(["Same reply", final]);
  },
);

it.each(["short report with a typo", "Long report. ".repeat(20).replaceAll("report", "answer")])(
  "native continuity leaves different non-prefix interims distinct: %s",
  (final) => {
    const turn = createTurn();
    reduceNativeTurn(turn, "message.interim", {
      text: final.length < 160 ? "short report with a type" : "Long report. ".repeat(20),
    });
    reduceNativeTurn(turn, "message.complete", { text: final, status: "complete" });
    expect(turn.blocks.filter((b) => b.kind === "text")).toHaveLength(2);
  },
);

it("native late identical interim and repeated terminal deliveries keep the settled occurrence once", () => {
  const turn = createTurn();
  reduceNativeTurn(turn, "message.delta", { text: "Same reply" });
  reduceNativeTurn(turn, "message.complete", { text: "Same reply", status: "complete" });
  const id = turn.blocks[0]!.id;
  reduceNativeTurn(turn, "message.interim", { text: " Same reply\n", already_streamed: true });
  reduceNativeTurn(turn, "message.complete", { text: "Same reply", status: "complete" });
  reduceNativeTurn(turn, "message.complete", { text: "Same reply", status: "complete" });
  expect(turn.blocks).toEqual([
    expect.objectContaining({ id, kind: "text", content: "Same reply" }),
  ]);
});

it.each(["response_previewed", "response_transformed"])(
  "native %s rewrite is limited to the pending interim occurrence",
  (flag) => {
    for (const restart of [false, true]) {
      const turn = createTurn();
      reduceNativeTurn(turn, "message.interim", { text: "Draft" });
      if (restart) reduceNativeTurn(turn, "message.start", {});
      reduceNativeTurn(turn, "message.complete", {
        text: "Authoritative rewrite",
        status: "complete",
        [flag]: true,
      });
      expect(turn.blocks.map((b) => b.content)).toEqual(
        restart ? ["Draft", "Authoritative rewrite"] : ["Authoritative rewrite"],
      );
    }
  },
);

describe("event identity validation", () => {
  it("uses only string run IDs when constructing replay keys", () => {
    expect(normalizeEvent(frame("message.delta", { run_id: "run", seq: 2 }))?.key).toBe("run:2");
    expect(normalizeEvent(frame("message.delta", { run_id: {}, seq: 2 }))?.key).toBe(":2");
  });
  it("resolves native child IDs consistently and rejects malformed delegation identities", () => {
    expect(nativeSubagentId({ subagent_id: "child", delegation_id: "batch", task_index: 0 })).toBe(
      "child",
    );
    expect(nativeSubagentId({ subagent_id: {}, child_session_id: "session" })).toBe("session");
    expect(nativeSubagentId({ delegation_id: "batch", task_index: 0 })).toBe("batch:0");
    for (const data of [
      { delegation_id: {}, task_index: 0 },
      { delegation_id: "batch" },
      { delegation_id: "batch", task_index: {} },
    ]) {
      expect(nativeSubagentId(data)).toBe("");
      const turn = createTurn();
      reduceNativeTurn(turn, "subagent.start", data);
      expect(turn.blocks).toEqual([]);
    }
  });
});
