import type { Message, TurnBlock } from "../../../types/hermes";
export type TextBlock = Extract<TurnBlock, { kind: "text" }>;
export type TranscriptEntry =
  | { kind: "user"; message: Message; key: string }
  | {
      kind: "turn";
      blocks: TurnBlock[];
      working?: boolean;
      approvalPending?: boolean;
      key: string;
    };
