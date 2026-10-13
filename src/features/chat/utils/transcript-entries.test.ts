import { describe, expect, it } from "vite-plus/test";
import { transcriptEntries } from "./transcript-entries";
import { gatewayDisplayText } from "../runtime/gateway-display";
import type { Message, TurnBlock } from "../../../types/hermes";
const text = (content: string): TurnBlock => ({ id: "block-1", kind: "text", content });
describe("transcript entries", () => {
  it("filters system messages and preserves orphan saved output", () => {
    const entries = transcriptEntries({
      messages: [
        { role: "system", content: "hidden" },
        { role: "assistant", content: "Saved output" },
      ],
      progress: [],
    });
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      kind: "turn",
      key: "history-0",
      blocks: [{ kind: "text", content: "Saved output" }],
    });
  });
  it("keeps identical block IDs scoped to their user turns and never mutates input", () => {
    const messages: Message[] = [
      { id: "one", role: "user", content: "first", blocks: [text("First")] },
      { id: "two", role: "user", content: "second", blocks: [text("Second")] },
    ];
    const entries = transcriptEntries({ messages, progress: [], working: true });
    expect(entries.map((entry) => entry.key)).toEqual(["one", "turn-one", "two", "turn-two"]);
    expect(entries[1]).toMatchObject({ working: false, blocks: messages[0]!.blocks });
    expect(entries[3]).toMatchObject({ working: true, blocks: messages[1]!.blocks });
    expect(entries[1]?.kind === "turn" && entries[1].blocks).toBe(messages[0]!.blocks);
  });
  it("admits empty working turns and applies live override only to the matching last user", () => {
    const messages: Message[] = [
      { role: "user", content: "first" },
      { role: "assistant", content: "history" },
      { role: "user", content: "second" },
    ];
    expect(transcriptEntries({ messages, progress: [], working: true }).at(-1)).toMatchObject({
      kind: "turn",
      blocks: [],
      working: true,
    });
    const input = { messages, progress: [], blocks: [text("Live")], turnUserCount: 1 };
    expect(transcriptEntries(input)).toHaveLength(3);
    expect(transcriptEntries({ ...input, turnUserCount: 2 }).at(-1)).toMatchObject({
      blocks: [text("Live")],
    });
  });
});

it("does not infer a running session from a saved call with no result", () => {
  const entries = transcriptEntries({
    messages: [
      { role: "user", content: "Question" },
      { role: "assistant", content: "", tool_calls: [{ id: "a", function: { name: "terminal" } }] },
    ],
    progress: [],
  });
  expect(entries.at(-1)).toMatchObject({
    kind: "turn",
    working: false,
    blocks: [expect.objectContaining({ id: "a", complete: false })],
  });
});

it("uses display metadata without interpreting legitimate user text", () => {
  const quote = "[System note: Your previous turn was interrupted mid-run — quoted by a user]";
  const messages: Message[] = [
    { id: "1", role: "user", content: quote },
    { id: "2", role: "user", content: quote, display_kind: "auto_continue" },
    { id: "3", role: "assistant", content: "Recovered answer" },
    {
      id: "4",
      role: "user",
      content: "Internal process instructions",
      display_kind: "process_complete",
      display_metadata: { display_text: "Build finished" },
    },
    { id: "5", role: "user", content: "secret scaffolding", display_kind: "hidden" },
    { id: "6", role: "assistant", content: "Visible output" },
    { id: "7", role: "assistant", content: "hidden answer", display_kind: "hidden" },
    { id: "8", role: "user", content: "Future kind", display_kind: "unknown" },
  ];
  const entries = transcriptEntries({ messages, progress: [] });
  expect(
    entries.filter((entry) => entry.kind === "user").map((entry) => entry.message.content),
  ).toEqual([quote, "Future kind"]);
  expect(entries.filter((entry) => entry.kind === "status").map((entry) => entry.text)).toEqual([
    "Resuming interrupted turn…",
    "Build finished",
  ]);
  expect(JSON.stringify(entries)).not.toMatch(
    /Internal process instructions|secret scaffolding|hidden answer/,
  );
  expect(JSON.stringify(entries)).toContain("Recovered answer");
  expect(JSON.stringify(entries)).toContain("Visible output");
  expect(messages[1]!.content).toBe(quote);
});

it("hides an in-flight internal input and its work unless a distinct visible turn exists", () => {
  const entries = transcriptEntries({
    messages: [
      { role: "user", content: "internal", display_kind: "hidden" },
      { role: "assistant", content: "Visible final" },
    ],
    progress: [],
  });
  expect(entries).toEqual([
    expect.objectContaining({ kind: "turn", blocks: [text("Visible final")] }),
  ]);
});

it("includes target model in model-switch status metadata", () => {
  expect(
    gatewayDisplayText({
      display_kind: "model_switch",
      display_metadata: { model: "openai/gpt-test" },
    }),
  ).toBe("Model changed to openai/gpt-test");
  expect(gatewayDisplayText({ display_kind: "model_switch" })).toBe("Model changed");
});

it("keeps live assistant blocks attached to hidden or status-only internal input", () => {
  const blocks = [text("Arriving answer")];
  for (const display_kind of ["hidden", "auto_continue", "process_complete"]) {
    const entries = transcriptEntries({
      messages: [{ role: "user", content: "internal prompt", display_kind, blocks }],
      progress: [],
      working: true,
    });
    expect(entries.filter((entry) => entry.kind === "user")).toHaveLength(0);
    expect(entries.filter((entry) => entry.kind === "status")).toHaveLength(
      display_kind === "hidden" ? 0 : 1,
    );
    expect(entries.find((entry) => entry.kind === "turn")).toMatchObject({ blocks });
  }
});
