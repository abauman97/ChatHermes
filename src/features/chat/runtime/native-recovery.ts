import type { GatewayEvent } from "../../../vendor/hermes/gateway-events";
import type { SessionEventsSinceResult } from "../../../vendor/hermes/gateway-contract.generated";

/** Locate a snapshot's exact delta boundary in a retained native turn. Snapshot
 * replies have no sequence watermark; latest_seq is not the replay page's end.
 * A replay read BEFORE the snapshot and another AFTER it bracket one live turn.
 * Text only locates a delta boundary inside that independently identified turn. */
export function recoverReplyPrefix(
  prefix: string,
  replay: SessionEventsSinceResult,
  scope: { runtime: string; profile: string; epoch?: string },
  beforeSnapshot?: SessionEventsSinceResult,
):
  | { events: GatewayEvent[]; through: number; unavailable?: false }
  | { events: []; through: 0; unavailable: true }
  | undefined {
  if (!scope.epoch || replay.epoch !== scope.epoch || !Array.isArray(replay.events)) return;
  const valid = (page: SessionEventsSinceResult) =>
    page.epoch === scope.epoch &&
    Array.isArray(page.events) &&
    !(page.events as unknown as GatewayEvent[]).some(
      (event, index) =>
        !event ||
        event.session_id !== scope.runtime ||
        (event.profile && event.profile !== (scope.profile || "default")) ||
        typeof event.type !== "string" ||
        !Number.isSafeInteger(event.seq) ||
        event.seq! <= 0 ||
        (index > 0 && event.seq! <= (page.events[index - 1] as unknown as GatewayEvent).seq!),
    );
  if (!valid(replay) || (beforeSnapshot && !valid(beforeSnapshot))) return;
  const events = replay.events as unknown as GatewayEvent[];
  const unavailable = { events: [] as [], through: 0 as const, unavailable: true as const };
  const anchor = beforeSnapshot?.events.at(-1) as unknown as GatewayEvent | undefined;
  if (!anchor) return unavailable;
  const anchorIndex = events.findIndex((event) => event.seq === anchor.seq);
  if (anchorIndex < 0) return replay.truncated ? unavailable : undefined;
  if (JSON.stringify(events[anchorIndex]) !== JSON.stringify(anchor)) return;
  // A completion or new start anywhere in the bracket invalidates identity,
  // even if the later turn happens to produce exactly the same text.
  if (
    events
      .slice(anchorIndex + 1)
      .some((event) => event.type === "message.start" || event.type === "message.complete")
  )
    return unavailable;
  let start = -1;
  for (const [index, event] of events.entries())
    if (event.type === "message.start" && event.seq! <= anchor.seq!) start = index;
  if (start < 0) return replay.truncated ? unavailable : undefined;
  // Older turns can have been evicted. The selected turn itself must be whole.
  for (let index = start + 1; index < events.length; index++)
    if (events[index]!.seq !== events[index - 1]!.seq! + 1) return;
  if (events.slice(start, anchorIndex + 1).some((event) => event.type === "message.complete"))
    return unavailable;
  let cut = start;
  let consumed = 0;
  while (consumed < prefix.length && ++cut < events.length) {
    const event = events[cut]!;
    if (event.type === "message.start" || event.type === "message.complete") return;
    if (event.type !== "message.delta") continue;
    const text = (event.payload as { text?: unknown } | undefined)?.text;
    if (text === null || text === "") continue;
    if (typeof text !== "string" || prefix.slice(consumed, consumed + text.length) !== text) return;
    consumed += text.length;
  }
  // The pinned runtime appends snapshot text before emitting its delta. Even
  // the later replay read can lag that append. Matching all retained text is
  // not corruption, but it cannot prove a boundary yet: keep controls alive
  // and withhold uncertain prose until authoritative completion/history.
  if (consumed < prefix.length && cut >= events.length) return unavailable;
  if (consumed !== prefix.length || cut >= events.length) return;
  return {
    events: events.slice(cut + 1).map((event) => ({ ...event, replayed: true })),
    through: events.at(-1)!.seq!,
  };
}
