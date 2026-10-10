import type { Activity, Message, TurnBlock } from "../../../types/hermes";
import type { TranscriptEntry } from "../types/chat-ui";
import { historyBlocks } from "../runtime/assistant-turn";
export function transcriptEntries(input: {
  messages: Message[];
  blocks?: TurnBlock[];
  turnUserCount?: number;
  progress: Activity[];
  working?: boolean;
  approvalPending?: boolean;
}): TranscriptEntry[] {
  const visible = input.messages.filter((message) => message.role !== "system");
  const result: TranscriptEntry[] = [];
  let userCount = 0;
  for (let index = 0; index < visible.length;) {
    const message = visible[index]!;
    if (message.role === "user") {
      userCount++;
      result.push({ kind: "user", message, key: message.id || `user-${index}` });
      let end = index + 1;
      while (end < visible.length && visible[end]!.role !== "user") end++;
      const last = end === visible.length;
      const blocks =
        last && (!input.turnUserCount || input.turnUserCount === userCount) && input.blocks?.length
          ? input.blocks
          : message.blocks || historyBlocks(visible.slice(index + 1, end));
      const turnBlocks = blocks.length ? blocks : last ? input.progress : [];
      const working =
        last &&
        (input.working ?? turnBlocks.some((block) => block.kind !== "text" && !block.complete));
      if (turnBlocks.length || working)
        result.push({
          kind: "turn",
          blocks: turnBlocks,
          working,
          approvalPending: last && input.approvalPending,
          key: `turn-${message.id || index}`,
        });
      index = end;
    } else {
      let end = index + 1;
      while (end < visible.length && visible[end]!.role !== "user") end++;
      result.push({
        kind: "turn",
        blocks: historyBlocks(visible.slice(index, end)),
        key: `history-${index}`,
      });
      index = end;
    }
  }
  return result;
}
