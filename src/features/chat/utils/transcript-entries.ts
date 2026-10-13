import type { Activity, Message, TurnBlock } from "../../../types/hermes";
import type { TranscriptEntry } from "../types/chat-ui";
import { gatewayDisplay, gatewayDisplayText } from "../runtime/gateway-display";
import { messageText } from "../../../services/hermes-api";
import { historyBlocks } from "../runtime/assistant-turn";
export function transcriptEntries(input: {
  messages: Message[];
  blocks?: TurnBlock[];
  turnUserCount?: number;
  progress: Activity[];
  working?: boolean;
  approvalPending?: boolean;
}): TranscriptEntry[] {
  const visible = input.messages.filter(
    (message) => gatewayDisplay(message) !== "hidden" || Boolean(message.blocks?.length),
  );
  const result: TranscriptEntry[] = [];
  let userCount = 0;
  for (let index = 0; index < visible.length;) {
    const message = visible[index]!;
    if (message.role === "user" || gatewayDisplay(message) === "status") {
      const display = gatewayDisplay(message);
      if (message.display_kind === "async_delegation_complete") {
        // Hermes persists delivery receipts as context rows (often role=user).
        // Project only their presentation into completed work; never classify
        // receipt-looking prose or fold the following assistant response away.
        const key = message.id || `delegation-${index}`;
        result.push({
          kind: "turn",
          key: `receipt-${key}`,
          blocks: [
            {
              id: `receipt-${key}`,
              kind: "tool",
              title: gatewayDisplayText(message),
              content: messageText(message.content),
              complete: true,
              state: "completed",
            },
          ],
        });
      } else if (display === "status")
        result.push({
          kind: "status",
          text: gatewayDisplayText(message),
          content: messageText(message.content),
          key: message.id || `status-${index}`,
        });
      else if (display === "message") {
        userCount++;
        result.push({ kind: "user", message, key: message.id || `user-${index}` });
      }
      if (display === "status" && !message.blocks?.length) {
        index++;
        continue;
      }
      let end = index + 1;
      while (
        end < visible.length &&
        visible[end]!.role !== "user" &&
        gatewayDisplay(visible[end]!) !== "status"
      )
        end++;
      const last = end === visible.length;
      const blocks =
        last && (!input.turnUserCount || input.turnUserCount === userCount) && input.blocks?.length
          ? input.blocks
          : message.blocks || historyBlocks(visible.slice(index + 1, end));
      const turnBlocks = blocks.length ? blocks : last ? input.progress : [];
      const working =
        last &&
        (input.working ??
          Boolean(
            (message.blocks || input.blocks?.length || input.progress.length) &&
            turnBlocks.some((block) => block.kind !== "text" && !block.complete),
          ));
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
      while (
        end < visible.length &&
        visible[end]!.role !== "user" &&
        gatewayDisplay(visible[end]!) !== "status"
      )
        end++;
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
