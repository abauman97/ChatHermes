import { describe, expect, it } from "vite-plus/test";
import { transcriptEntries } from "./transcript-entries";
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
