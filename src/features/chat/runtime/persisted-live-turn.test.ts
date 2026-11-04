import { existsSync, readFileSync } from "node:fs";
import ts from "typescript";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vite-plus/test";
import {
  locatePersistedLiveTurn,
  snapshotIntervals,
  unrepresentedText,
} from "./persisted-live-turn";
import type { Message } from "../../../types/hermes";

const path =
  ".hermes-source/apps/desktop/src/app/session/hooks/use-session-actions/persisted-live-turn.ts";
// Execute the pinned functions themselves. Stubs adapt only the plain-text
// presentation types used by these comparisons, not selection/reconciliation.
describe.skipIf(!existsSync(path))("pinned Desktop partial-turn comparison", () => {
  const source = existsSync(path) ? readFileSync(path, "utf8") : "";
  const compiled = ts.transpileModule(
    source + "\nexport { snapshotIntervals, unrepresentedText, locateTurn };",
    {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    },
  ).outputText;
  const desktop: any = {};
  runInNewContext(compiled, {
    exports: desktop,
    require: () => ({
      textWithoutReferenceLines: (text: string) => text.trim(),
      assistantTextPart: (text: string) => ({ type: "text", text }),
    }),
  });
  it.each([
    { assistant: "A😀B final", corrections: ["Guide"], correction_offsets: [3] },
    { assistant: "A😀B final", corrections: ["Guide"], correction_offsets: [99] },
    { assistant: "A😀B final", corrections: ["Guide"] },
    { assistant: "012345", corrections: ["one", "two"], correction_offsets: [4, 2] },
    { assistant: "012345", corrections: ["one", "two"], correction_offsets: [2, 2] },
  ])("uses Desktop code-point correction intervals: %j", (snapshot) => {
    expect(snapshotIntervals(snapshot)).toEqual(desktop.snapshotIntervals(snapshot));
  });
  it.each([
    [" First\n\nSecond", "First"],
    [" First", "First longer"],
    ["Different", "First"],
    ["😀 next", "😀"],
    ["Same", ""],
  ])("uses Desktop symmetric prefix subtraction: %j %j", (snapshot, saved) => {
    expect(unrepresentedText(snapshot, saved)).toBe(desktop.unrepresentedText(snapshot, saved));
  });
  const prompt: Message = { id: "1", role: "user", content: "Repeat" };
  const commentary: Message = {
    id: "2",
    role: "assistant",
    content: "Starting 😀",
    tool_calls: [{ id: "call", function: { name: "terminal" } }],
  };
  const result: Message = { id: "3", role: "tool", content: "Tool output", tool_call_id: "call" };
  it.each([
    [prompt, commentary, result],
    [
      prompt,
      { id: "previous-final", role: "assistant", content: "Already answered" },
      { ...prompt, id: "new" },
      commentary,
      result,
    ],
    [prompt, { ...commentary, tool_calls: [] }],
    [prompt, { ...commentary, display_kind: "hidden" }],
    [prompt, commentary, result, { id: "4", role: "user", content: "Guide" }],
  ] as Message[][])("locates the same partial turn: %j", (...rows) => {
    const snapshot = {
      user: "Repeat",
      assistant: "Starting 😀\n\nContinuing",
      corrections: ["Guide"],
    };
    const messages = rows.map((row) => ({
      role: row.role,
      rowId: row.id,
      parts:
        row.role === "assistant" ? [{ type: "text", text: row.content, sourceRowId: row.id }] : [],
    }));
    expect(locatePersistedLiveTurn(rows, snapshot)?.start).toBe(
      desktop.locateTurn(rows, messages, snapshot)?.start,
    );
  });
});
