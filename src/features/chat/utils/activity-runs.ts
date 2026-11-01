import type { Activity, TurnBlock } from "../../../types/hermes";

export type TimelinePart =
  | { id: string; kind: "tools"; activities: Activity[] }
  | { id: string; kind: "block"; block: Extract<TurnBlock, { kind: "text" }> };

// One stable disclosure per turn, anchored at its first activity. Response
// blocks retain their order; reasoning and delegated work share the tool history.
export function activityRuns(blocks: TurnBlock[]): TimelinePart[] {
  const parts: TimelinePart[] = [];
  let work: Extract<TimelinePart, { kind: "tools" }> | undefined;
  for (const block of blocks) {
    if ((block.kind === "text" || block.kind === "thinking") && !block.content.trim()) continue;
    if (block.kind === "text") parts.push({ id: block.id, kind: "block", block });
    else {
      if (!work) {
        work = { id: block.id, kind: "tools", activities: [] };
        parts.push(work);
      }
      work.activities.push(block);
    }
  }
  return parts;
}
