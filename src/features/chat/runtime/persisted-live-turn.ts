import type { Message } from "../../../types/hermes";
import type { InflightTurn } from "../../../vendor/hermes/gateway-contract.generated";

/** Adapted from pinned Desktop persisted-live-turn.ts (bf0203a7, MIT).
 * These are Desktop's prompt/prefix heuristics, not occurrence provenance.
 * Offsets address Python code points, never JavaScript UTF-16 positions.
 */
export function snapshotIntervals(inflight: InflightTurn): string[] {
  const text = inflight.assistant ?? "";
  const corrections = inflight.corrections ?? [];
  const offsets = inflight.correction_offsets;
  if (!corrections.length) return [text];
  const characters = Array.from(text);
  const usable =
    offsets?.length === corrections.length &&
    offsets.every(
      (offset, index) =>
        Number.isInteger(offset) &&
        offset >= 0 &&
        offset <= characters.length &&
        (!index || offset >= offsets[index - 1]!),
    );
  if (!usable) return [text, ...corrections.map(() => "")];
  return [...offsets, characters.length].map((end, index) =>
    characters.slice(index ? offsets[index - 1] : 0, end).join(""),
  );
}

export function unrepresentedText(snapshot: string, stored: string): string {
  const text = snapshot.trimStart();
  const prefix = stored.trim();
  if (!prefix) return snapshot;
  if (text.startsWith(prefix)) return text.slice(prefix.length);
  if (prefix.startsWith(text)) return "";
  return snapshot;
}

const hasTools = (row: Message) => Boolean(row.tool_calls?.length);
const userText = (value: unknown) =>
  // Desktop deliberately stringifies multipart content here; do not infer a
  // stronger attachment occurrence match from its visible text.
  // oxlint-disable-next-line typescript/no-base-to-string
  String(value ?? "")
    .split("\n")
    .filter(
      (line) =>
        !/^@(file|folder|url|image|tool|line|terminal|session):(`[^`\n]+`|"[^"\n]+"|'[^'\n]+'|\S+)$/.test(
          line.trimEnd(),
        ),
    )
    .join("\n")
    .trim();

/** Desktop stops searching at a saved final and accepts only visible,
 * source-addressed tool commentary in a partial turn. Corrections must agree
 * in order. Equal repeated prompts alone do not subtract assistant output.
 */
export function locatePersistedLiveTurn(rows: Message[], inflight: InflightTurn) {
  let candidate: { start: number; intervals: Message[][]; users: Message[] } | undefined;
  for (let start = rows.length - 1; start >= 0; start--) {
    const row = rows[start]!;
    if (
      row.role === "assistant" &&
      !hasTools(row) &&
      typeof row.content === "string" &&
      row.content.trim()
    )
      break;
    if (
      row.role !== "user" ||
      row.display_kind === "steer" ||
      userText(row.content) !== userText(inflight.user) ||
      !row.id
    )
      continue;
    const intervals: Message[][] = [[]];
    const users = [row];
    let valid = true;
    for (const next of rows.slice(start + 1)) {
      if (next.role === "user") {
        if (
          !next.id ||
          userText(next.content) !== userText(inflight.corrections?.[intervals.length - 1])
        ) {
          valid = false;
          break;
        }
        users.push(next);
        intervals.push([]);
      } else if (next.role === "assistant") {
        if (
          !hasTools(next) ||
          typeof next.content !== "string" ||
          next.display_kind === "hidden" ||
          (Boolean(next.content.trim()) && !next.id)
        ) {
          valid = false;
          break;
        }
        intervals.at(-1)!.push(next);
      } else if (next.role === "tool") intervals.at(-1)!.push(next);
      else {
        valid = false;
        break;
      }
    }
    if (valid) candidate = { start, intervals, users };
  }
  return candidate;
}
