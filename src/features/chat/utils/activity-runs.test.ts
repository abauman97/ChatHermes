import { describe, expect, it } from "vite-plus/test";
import type { Activity, TurnBlock } from "../../../types/hermes";
import { activityRuns } from "./activity-runs";
const tool = (id: string, toolName = "terminal"): Activity => ({
  id,
  kind: "tool",
  toolName,
  title: "Tool",
  content: "",
  complete: false,
});
describe("unified activity history", () => {
  it("groups thinking, tools and delegated tasks across response blocks at the first activity", () => {
    const intro: TurnBlock = { id: "intro", kind: "text", content: "Intro" };
    const middle: TurnBlock = { id: "middle", kind: "text", content: "Update" };
    const answer: TurnBlock = { id: "answer", kind: "text", content: "Answer" };
    const thought: Activity = {
      id: "r",
      kind: "thinking",
      title: "Thinking",
      content: "Plan",
      complete: false,
    };
    const activities = [thought, tool("a"), { ...tool("child"), delegated: true }, tool("b")];
    expect(
      activityRuns([intro, thought, activities[1]!, middle, ...activities.slice(2), answer]),
    ).toEqual([
      { id: "intro", kind: "block", block: intro },
      { id: "r", kind: "tools", activities },
      { id: "middle", kind: "block", block: middle },
      { id: "answer", kind: "block", block: answer },
    ]);
  });
  it.each([
    "clarify",
    "setup_choose",
    "image_generate",
    "manage_catalog",
    "manage_connections",
    "start_chat",
    "delegate_task",
    "patch",
  ])("includes %s and preserves group identity after completion", (name) => {
    const blocks = [tool("a"), tool("special", name), tool("b")];
    expect(activityRuns(blocks)).toEqual([{ id: "a", kind: "tools", activities: blocks }]);
    const settled = blocks.map((block) => ({ ...block, complete: true, state: "failed" as const }));
    expect(activityRuns(settled)).toEqual([{ id: "a", kind: "tools", activities: settled }]);
  });
  it("ignores empty continuation and reasoning placeholders", () => {
    expect(
      activityRuns([
        tool("a"),
        { id: "empty", kind: "text", content: " " },
        { id: "empty-reasoning", kind: "thinking", title: "Thinking", content: "", complete: true },
        tool("b"),
      ]),
    ).toEqual([{ id: "a", kind: "tools", activities: [tool("a"), tool("b")] }]);
  });
});
