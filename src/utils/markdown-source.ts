import type MarkdownIt from "markdown-it";

export type Span = [number, number];
type Token = ReturnType<InstanceType<InstanceType<typeof MarkdownIt>["inline"]["State"]>["push"]>;
// One original span for every UTF-16 unit of a block leaf's parser input.
// Kept outside token.meta so native callers can retain their own metadata.
export const blockSources = new WeakMap<Token, Span[]>();
export const blockRanges = new WeakMap<Token, Span>();

/** Capture provenance while the block parser still has its container-adjusted
 * line positions. Never search the document for repeated cell/paragraph text. */
export function trackBlockSources(
  parser: InstanceType<typeof MarkdownIt>,
  { inlineCodeOnly = false } = {},
) {
  const State = parser.block.State;
  const reads = new WeakMap<InstanceType<typeof State>, { text: string; spans: Span[] }[]>();
  parser.block.State = class extends State {
    override getLines(begin: number, end: number, indent: number, keepLastLF: boolean) {
      const text = super.getLines(begin, end, indent, keepLastLF);
      // Trust/memory classifiers only project inline code spans. Plain prose
      // needs no per-character provenance there; the renderer still tracks all
      // tokens. A Markdown code span always has a literal backtick in its input.
      if (inlineCodeOnly && !text.includes("`")) return text;
      const spans: Span[] = [];
      // Mirror getLines' indentation accounting, including tabs partly consumed
      // by list/quote/code indentation. Grammar and output remain the parser's.
      for (let line = begin; line < end; line++) {
        const start = this.bMarks[line]!;
        const last = this.eMarks[line]! + (line + 1 < end || keepLastLF ? 1 : 0);
        let first = start,
          width = 0;
        while (first < last && width < indent) {
          const ch = this.src[first]!;
          if (ch === "\t") width += 4 - ((width + this.bsCount[line]!) % 4);
          else if (ch === " " || first - start < this.tShift[line]!) width++;
          else break;
          first++;
        }
        for (let i = indent; i < width; i++) spans.push([first - 1, first]);
        for (let i = first; i < Math.min(last, this.src.length); i++) spans.push([i, i + 1]);
      }
      const records = reads.get(this) ?? [];
      records.push({ text, spans });
      reads.set(this, records);
      return text;
    }
  };
  for (const name of [
    "table",
    "code",
    "fence",
    "hr",
    "heading",
    "lheading",
    "paragraph",
    "blockquote",
    "list",
  ]) {
    const entry = parser.block.ruler.__rules__.find((entry) => entry.name === name)!;
    const rule = entry.fn;
    parser.block.ruler.at(
      name,
      (state, start, end, silent) => {
        if (silent) return rule(state, start, end, silent);
        const count = state.tokens.length;
        reads.set(state, []);
        const matched = rule(state, start, end, silent);
        if (!matched) return matched;
        let row = start,
          cell = 0;
        let cells: { text: string; spans: Span[] }[] = [];
        for (const token of state.tokens.slice(count)) {
          if (name === "table" && token.type === "tr_open") {
            row = token.map![0];
            cell = 0;
            // The pinned table rule removes a backslash before a pipe before
            // inline parsing. Preserve the removed byte in that pipe's span.
            const a = state.bMarks[row]! + state.tShift[row]!;
            const raw = state.src.slice(a, state.eMarks[row]);
            cells = [{ text: "", spans: [] }];
            for (let i = 0; i < raw.length; i++) {
              const current = cells.at(-1)!;
              if (raw[i] === "|" && raw[i - 1] !== "\\") cells.push({ text: "", spans: [] });
              else if (raw[i] === "|" && raw[i - 1] === "\\") {
                current.text = current.text.slice(0, -1) + "|";
                current.spans.pop();
                current.spans.push([a + i - 1, a + i + 1]);
              } else {
                current.text += raw[i];
                current.spans.push([a + i, a + i + 1]);
              }
            }
            if (!cells[0]!.text.trim()) cells.shift();
            if (!cells.at(-1)?.text.trim()) cells.pop();
          }
          if (token.map && !blockRanges.has(token))
            blockRanges.set(token, [
              state.bMarks[token.map[0]]!,
              state.bMarks[token.map[1]] ?? state.src.length,
            ]);
          if (blockSources.has(token) || !["inline", "code_block", "fence"].includes(token.type))
            continue;
          if (inlineCodeOnly && (token.type !== "inline" || !token.content.includes("`"))) {
            // Cell indices belong to the original row, including untracked cells.
            if (name === "table" && token.type === "inline") cell++;
            continue;
          }
          let record: { text: string; spans: Span[] } | undefined;
          if (name === "table") {
            record = cells[cell++] ?? { text: "", spans: [] };
            blockRanges.set(token, [state.bMarks[row]!, state.eMarks[row]!]);
          } else if (name === "heading") {
            const begin =
              state.bMarks[start]! + state.tShift[start]! + state.tokens[count]!.markup.length;
            const raw = state.src.slice(begin, state.eMarks[start]);
            const contentStart = begin + (raw.match(/^[ \t\n\r]*/)?.[0].length ?? 0);
            record = {
              text: token.content,
              spans: Array.from({ length: token.content.length }, (_, i) => [
                contentStart + i,
                contentStart + i + 1,
              ]),
            };
          } else record = reads.get(state)?.at(-1);
          if (!record) throw new Error(`Missing Markdown provenance for ${name}`);
          let { text, spans } = record;
          if (token.type === "inline") {
            // Paragraphs/headings use ASCII trim; table cells use JS trim.
            const left = name === "table" ? text.trimStart() : text.replace(/^[ \t\n\r]+/, "");
            const right = name === "table" ? text.trimEnd() : text.replace(/[ \t\n\r]+$/, "");
            const leading = text.length - left.length;
            spans = spans.slice(leading, right.length);
            text = right.slice(leading);
          }
          if (token.type === "code_block" && token.content === text + "\n") {
            spans = [
              ...spans,
              [
                spans.at(-1)?.[1] ?? state.eMarks[start]!,
                spans.at(-1)?.[1] ?? state.eMarks[start]!,
              ],
            ];
            text += "\n";
          }
          if (text !== token.content || spans.length !== token.content.length)
            throw new Error(`Invalid Markdown provenance for ${name}`);
          blockSources.set(token, spans);
        }
        return matched;
      },
      { alt: entry.alt },
    );
  }
}

/** markdown-it normalizes CR/CRLF before parsing; translate its offsets back. */
export function sourceEdges(text: string): number[] {
  const edges = [0];
  for (let i = 0; i < text.length;) {
    i += text[i] === "\r" && text[i + 1] === "\n" ? 2 : 1;
    edges.push(i);
  }
  return edges;
}
