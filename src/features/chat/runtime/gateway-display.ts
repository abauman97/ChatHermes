import type { Message } from "../../../types/hermes";

export type DisplayMetadata = Pick<Message, "display_kind" | "display_metadata">;
const labels: Record<string, string> = {
  auto_continue: "Resuming interrupted turn…",
  process_complete: "Background process completed",
  async_delegation_complete: "Delegated work completed",
  model_switch: "Model changed",
  personality_switch: "Personality changed",
  failed_turn: "Response did not complete · verify any actions before resending",
};

/** Presentation only. Retain the original row for runtime context and receipts.
 * Origin comes from the gateway's display contract, never from prompt prose.
 * Untyped legacy rows remain visible; upstream owns legacy migrations. */
export function gatewayDisplay(row: Message): "hidden" | "status" | "message" | "compaction" {
  if (row.display_kind === "compaction") return "compaction";
  if (row.display_kind === "hidden") return "hidden";
  if (row.display_kind && Object.hasOwn(labels, row.display_kind)) return "status";
  return row.role === "system" ? "hidden" : "message";
}
export function gatewayDisplayText(row: DisplayMetadata): string {
  const metadata = row.display_metadata;
  if (row.display_kind === "model_switch" && metadata && typeof metadata === "object") {
    const model = "model" in metadata && typeof metadata.model === "string" ? metadata.model : "";
    if (model) return `Model changed to ${model}`;
  }
  if (
    metadata &&
    typeof metadata === "object" &&
    "display_text" in metadata &&
    typeof metadata.display_text === "string"
  )
    return metadata.display_text;
  return labels[row.display_kind || ""] || "";
}

/** Native terminal outcomes are distinct from transport availability. */
export function gatewayOutcome(status: unknown): string {
  if (status === "interrupted") return "Response interrupted";
  if (status === "cancelled") return "Response cancelled";
  if (status === "error" || status === "failed") return "Response failed";
  return "Response completed";
}
