import { describe, expect, it } from "vite-plus/test";
import type { Activity, TurnBlock } from "../../../types/hermes";
import { activityRuns, standaloneTool } from "./activity-runs";
const tool = (id: string, toolName = "terminal"): Activity => ({
  id,
  kind: "tool",
  toolName,
  title: "Tool",
  content: "",
  complete: false,
});
describe("chronological tool runs", () => {
  it("groups only adjacent ordinary tools", () => {
    const blocks: TurnBlock[] = [
      { id: "intro", kind: "text", content: "Intro" },
      tool("a"),
      tool("b"),
      { id: "r", kind: "thinking", title: "Thinking", content: "Plan", complete: false },
      tool("c"),
      { id: "final", kind: "text", content: "Answer" },
    ];
    const parts = activityRuns(blocks);
    expect(parts.map((part) => part.kind)).toEqual(["block", "tools", "block", "tools", "block"]);
    expect(
      parts.flatMap((part) => (part.kind === "tools" ? part.activities : [part.block])),
    ).toEqual(blocks);
  });
  it.each([
    "edit_file",
    "write_file",
    "clarify",
    "setup_choose",
    "delegate_task",
    "image_generate",
    "manage_catalog",
    "manage_connections",
    "start_chat",
  ])("keeps %s outside a run with a stable grouping after completion", (name) => {
    const blocks = [tool("a"), tool("card", name), tool("b")];
    const shape = (blocks: TurnBlock[]) => activityRuns(blocks).map((part) => [part.id, part.kind]);
    expect(shape(blocks)).toEqual([
      ["a", "tools"],
      ["card", "block"],
      ["b", "tools"],
    ]);
    expect(shape(blocks.map((block) => ({ ...block, complete: true, state: "failed" })))).toEqual(
      shape(blocks),
    );
  });
  it.each(["running", "completed", "failed"] as const)(
    "groups patch with adjacent ordinary tools while %s",
    (state) => {
      const patch: Activity = {
        ...tool("patch", "patch"),
        state,
        complete: state !== "running",
      };
      const blocks = [tool("before"), patch, tool("after")];
      expect(standaloneTool(patch)).toBe(false);
      expect(activityRuns(blocks)).toEqual([{ id: "before", kind: "tools", activities: blocks }]);
    },
  );
  it("keeps subagents outside generic runs", () => {
    expect(
      activityRuns([tool("a"), { ...tool("child"), delegated: true }, tool("b")]).map(
        (part) => part.kind,
      ),
    ).toEqual(["tools", "block", "tools"]);
  });
});

it("groups consecutive calls across empty continuation and reasoning placeholders", () => {
  const parts = activityRuns([
    tool("a"),
    { id: "empty", kind: "text", content: " " },
    { id: "empty-reasoning", kind: "thinking", title: "Thinking", content: "", complete: true },
    tool("b"),
  ]);
  expect(parts).toEqual([{ id: "a", kind: "tools", activities: [tool("a"), tool("b")] }]);
});
