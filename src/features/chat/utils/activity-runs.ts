import type { Activity, TurnBlock } from "../../../types/hermes";

// Cards and delegated tasks stay outside ordinary runs. Classification depends
// on identity, never completion state, so streaming updates keep rows mounted.
export function standaloneTool(block: Activity): boolean {
  return (
    !!block.delegated ||
    [
      "edit_file",
      "write_file",
      "clarify",
      "setup_choose",
      "delegate_task",
      "image_generate",
      "manage_catalog",
      "manage_connections",
      "start_chat",
    ].includes(block.toolName || "")
  );
}
export type TimelinePart =
  | { id: string; kind: "tools"; activities: Activity[] }
  | { id: string; kind: "block"; block: TurnBlock };
export function activityRuns(blocks: TurnBlock[]): TimelinePart[] {
  const parts: TimelinePart[] = [];
  for (const block of blocks) {
    // Empty continuation/reasoning blocks render nothing and must not split
    // consecutive visible calls into one-call groups.
    if ((block.kind === "text" || block.kind === "thinking") && !block.content.trim()) continue;
    const previous = parts.at(-1);
    if (block.kind === "tool" && !standaloneTool(block)) {
      if (previous?.kind === "tools") previous.activities.push(block);
      else parts.push({ id: block.id, kind: "tools", activities: [block] });
    } else parts.push({ id: block.id, kind: "block", block });
  }
  return parts;
}
