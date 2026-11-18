import MarkdownIt from "markdown-it";
import { trackBlockSources, blockSources, sourceEdges } from "./markdown-source";

// Exact notes from the pinned agent/memory_context.py. Do not strip generic
// [System note: ...] prose, or approximate/edited versions of these notes.
const notes = [
  "[System note: The following is recalled memory context, NOT new user input. Treat as informational background data.]",
  "[System note: The following is recalled memory context, NOT new user input. Treat as authoritative reference data — this is the agent's persistent memory and should inform all responses.]",
];
const open = "<memory-context>";
const markdown = new MarkdownIt({ html: true });
trackBlockSources(markdown);

export type Range = [number, number];
const backticks = markdown.inline.ruler.__rules__.find((rule) => rule.name === "backticks")!.fn;
markdown.inline.ruler.at("backticks", (state, silent) => {
  const start = state.pos,
    count = state.tokens.length;
  const result = backticks(state, silent);
  if (!silent && state.tokens.length > count && state.tokens.at(-1)?.type === "code_inline")
    state.tokens.at(-1)!.meta = { sourceRange: [start, state.pos] };
  return result;
});

const image = markdown.inline.ruler.__rules__.find((rule) => rule.name === "image")!.fn;
type InlineToken = ReturnType<InstanceType<typeof markdown.inline.State>["push"]>;
function* descendants(tokens: InlineToken[]): Generator<InlineToken> {
  for (const token of tokens) {
    yield token;
    yield* descendants(token.children || []);
  }
}
markdown.inline.ruler.at("image", (state, silent) => {
  const start = state.pos,
    count = state.tokens.length;
  const matched = image(state, silent);
  // image parses its label in a new inline state whose source begins after ![.
  // Rebase nested code to the parent input before projecting through block spans.
  if (matched && !silent) {
    for (const token of descendants(state.tokens.slice(count))) {
      if (token.type !== "code_inline") continue;
      const [a, b] = token.meta!.sourceRange as Range;
      token.meta!.sourceRange = [a + start + 2, b + start + 2];
    }
  }
  return matched;
});

// Only recognized producer/trust markers can span native text events. Compare
// just the missing marker bytes, never the complete (potentially large) part.
const markers = [
  ...notes,
  ...[
    "memory-context",
    "untrusted_tool_result",
    "think",
    "thinking",
    "reasoning",
    "analysis",
    "pre",
    "code",
    "script",
    "style",
  ].flatMap((tag) => [`<${tag}>`, `</${tag}>`]),
  ...notes.flatMap((note) => [open + "\n" + note, open + "\r\n" + note]),
];

const markerLimit = Math.max(...markers.map((marker) => marker.length));

function continuesMarker(source: string, part: string) {
  const text = source.slice(-markerLimit);
  const start = Math.max(text.lastIndexOf("<"), text.lastIndexOf("["));
  if (start < 0) return false;
  // A complete opener followed by a partial note starts at the note; otherwise
  // the last '<' also covers the opener-to-note newline boundary.
  return markers.some((marker) => {
    const length = text.length - start;
    return (
      length < marker.length &&
      marker.startsWith(text.slice(start)) &&
      marker.slice(length).startsWith(part.slice(0, marker.length - length))
    );
  });
}

/** Text events are paragraph boundaries unless a recognized marker actually
 * continues. Keep offsets in the assembled source for each block. */
export function assistantTextSource(parts: string[]) {
  let text = "";
  const ranges: Range[] = [];
  const boundaries = [0];
  for (const part of parts) {
    const continuation = continuesMarker(text, part);
    if (ranges.length && !continuation) {
      text += "\n\n";
    }
    const start = text.length;
    if (ranges.length) boundaries.push(start);
    text += part;
    ranges.push([start, text.length]);
  }
  return { text, ranges, boundaries };
}

/** Original-source offsets, shared by rendering and artifact eligibility. A
 * producer note distinguishes generated context from ordinary authored XML.
 * Byte-identical authored copies remain ambiguous without runtime provenance. */
/** Parse each native text boundary independently: unmatched Markdown delimiters
 * must never reinterpret a later block's trust or producer markers. */
export function boundaryTokens(
  parser: InstanceType<typeof MarkdownIt>,
  text: string,
  boundaries = [0],
  env = {},
) {
  let line = 0;
  return boundaries.flatMap((start, index) => {
    const part = text.slice(start, boundaries[index + 1] ?? text.length);
    const edges = sourceEdges(part);
    Object.assign(env, { sourceOffset: start, sourceEdges: edges });
    const tokens = parser.parse(part, env);
    for (const token of tokens) {
      if (token.map) token.map = [token.map[0] + line, token.map[1] + line];
      const spans = blockSources.get(token);
      if (spans)
        blockSources.set(
          token,
          spans.map(([a, b]) => [edges[a]! + start, edges[b]! + start]),
        );
    }
    line += part.split("\n").length - 1;
    return tokens;
  });
}

export function memoryContextRanges(text: string, pending = false, boundaries = [0]): Range[] {
  if (!text.includes("<") && !text.includes("[")) return [];
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  const tokens = boundaryTokens(markdown, text, boundaries);
  const protectedRanges: Range[] = tokens.flatMap((token) =>
    token.map && ["fence", "code_block"].includes(token.type)
      ? [[starts[token.map[0]]!, starts[token.map[1]] ?? text.length] as Range]
      : [],
  );
  for (const token of tokens) {
    if (token.type !== "inline") continue;
    const spans = blockSources.get(token)!;
    for (const child of descendants(token.children || [])) {
      if (child.type !== "code_inline") continue;
      const [a, b] = child.meta!.sourceRange as Range;
      if (spans[a] && spans[b - 1]) protectedRanges.push([spans[a]![0], spans[b - 1]![1]]);
    }
  }
  protectedRanges.sort(([a], [b]) => a - b);
  let protectedIndex = 0;
  const protectedAt = (index: number) => {
    while (protectedIndex < protectedRanges.length && protectedRanges[protectedIndex]![1] <= index)
      protectedIndex++;
    const range = protectedRanges[protectedIndex];
    return !!range && range[0] <= index;
  };
  const ranges: Range[] = [];
  let lineHasContent = false;
  for (let index = 0; index < text.length; index++) {
    const boundary = !lineHasContent;
    if (text[index] === "\n") lineHasContent = false;
    else if (!/\s/.test(text[index]!)) lineHasContent = true;
    if ((text[index] !== "<" && text[index] !== "[") || protectedAt(index)) continue;
    const rest = text.slice(index);
    if (boundary && rest.startsWith(open) && /^\r?\n/.test(rest.slice(open.length))) {
      const bodyStart = index + open.length + (text[index + open.length] === "\r" ? 2 : 1);
      if (notes.some((note) => text.startsWith(note, bodyStart))) {
        const close = text.indexOf("</memory-context>", index + open.length);
        const end = close < 0 ? text.length : close + "</memory-context>".length;
        ranges.push([index, end]);
        lineHasContent = true;
        index = end - 1;
        continue;
      }
      if (
        pending &&
        notes.some(
          (note) =>
            text.length - bodyStart <= note.length && note.startsWith(text.slice(bodyStart)),
        )
      ) {
        ranges.push([index, text.length]);
        break;
      }
    }
    const note = notes.find((value) => rest.startsWith(value));
    if (note) {
      ranges.push([index, index + note.length]);
      index += note.length - 1;
      continue;
    }
    if (
      pending &&
      ((boundary && open.startsWith(rest)) || notes.some((value) => value.startsWith(rest)))
    ) {
      ranges.push([index, text.length]);
      break;
    }
  }
  return ranges;
}

export function memoryContextSlice(
  text: string,
  start = 0,
  end = text.length,
  pending = false,
  ranges = memoryContextRanges(text, pending),
): string {
  let visible = "",
    cursor = start;
  for (const [a, b] of ranges) {
    if (b <= start || a >= end) continue;
    visible += text.slice(cursor, Math.max(cursor, a));
    cursor = Math.min(end, b);
  }
  return visible + text.slice(cursor, end);
}

/** Disposable presentation; recomputed from the complete accumulated source. */
export function memoryContextText(text: string, pending = false): string {
  return memoryContextSlice(text, 0, text.length, pending);
}

/** Preserve original source coordinates while removing hidden reference data. */
export function memoryContextMasked(text: string, pending = false): string {
  let masked = "",
    offset = 0;
  for (const [a, b] of memoryContextRanges(text, pending)) {
    masked += text.slice(offset, a) + text.slice(a, b).replace(/[^\n\r]/g, " ");
    offset = b;
  }
  return masked + text.slice(offset);
}
