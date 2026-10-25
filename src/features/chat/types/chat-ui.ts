import type { Message, TurnBlock } from "../../../types/hermes";
export type TextBlock = Extract<TurnBlock, { kind: "text" }>;
export type TranscriptEntry =
  | { kind: "status"; text: string; content: string; key: string }
  | { kind: "user"; message: Message; key: string }
  | {
      kind: "turn";
      blocks: TurnBlock[];
      responseId?: string;
      working?: boolean;
      approvalPending?: boolean;
      key: string;
    };
