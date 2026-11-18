import MarkdownIt from "markdown-it";
import { trackBlockSources, blockSources, blockRanges } from "./markdown-source";

// HTML remains escaped; markdown-it also rejects executable link schemes.
const markdown = new MarkdownIt({ html: false, breaks: true, linkify: true });
trackBlockSources(markdown);
markdown.renderer.rules.link_open = (tokens, index, options, _env, renderer) => {
  tokens[index]!.attrSet("target", "_blank");
  tokens[index]!.attrSet("rel", "noopener noreferrer");
  return renderer.renderToken(tokens, index, options);
};

// Source coordinates are a side channel. Never put boundary spelling in the
// Markdown source: even a private inline rule changes delimiter flanking,
// escapes, entities, code spans, links and other grammar that scans ahead.
interface SourceRange {
  start: number;
  end: number;
  // Source end for each UTF-16 output unit. Decoded constructs are atomic.
  ends: number[];
}
type Token = ReturnType<InstanceType<typeof markdown.inline.State>["push"]>;
const sources = new WeakMap<Token, SourceRange>();
// Sorted, merged source intervals; reuse binary lookup for every token/unit.
function hiddenIndex(ranges: [number, number][]) {
  const merged: [number, number][] = [];
  for (const [a, b] of ranges.slice().sort(([a], [b]) => a - b)) {
    const last = merged.at(-1);
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else if (a < b) merged.push([a, b]);
  }
  const first = (a: number) => {
    let lo = 0,
      hi = merged.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (merged[mid]![1] <= a) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  return {
    ranges: merged,
    first,
    overlaps: (a: number, b: number) => a < b && (merged[first(a)]?.[0] ?? Infinity) < b,
  };
}
function locate(token: Token, start: number, end: number, source: string) {
  if (token.type === "code_inline") {
    const delimiter = source.slice(start, end).match(/^`+/)![0].length;
    const raw = source.slice(start + delimiter, end - delimiter).replace(/\n/g, " ");
    const padding = raw.startsWith(" ") && raw.endsWith(" ") && /[^ ]/.test(raw) ? 1 : 0;
    const contentStart = start + delimiter + padding;
    sources.set(token, {
      start,
      end,
      ends: Array.from(
        { length: token.content.length },
        (_, index) => contentStart + index + (isSurrogatePair(token.content, index) ? 2 : 1),
      ),
    });
    return;
  }
  const literal = token.content === source.slice(start, end);
  sources.set(token, {
    start,
    end,
    ends: Array.from({ length: token.content.length }, (_, index) =>
      literal ? start + index + (isSurrogatePair(token.content, index) ? 2 : 1) : end,
    ),
  });
}
function isSurrogatePair(text: string, index: number) {
  return /[\uD800-\uDBFF]/.test(text[index]!) && /[\uDC00-\uDFFF]/.test(text[index + 1] || "");
}
const pendingStarts = new WeakMap<InstanceType<typeof markdown.inline.State>, number>();
const InlineState = markdown.inline.State;
markdown.inline.State = class extends InlineState {
  override pushPending() {
    if (!this.env.sourceTracking) return super.pushPending();
    // Pending text is literal source. Keep its start even when newline/linkify
    // trims its suffix or a link rule advances into its label before flushing.
    const start = pendingStarts.get(this) ?? this.pos - this.pending.length;
    const token = super.pushPending();
    pendingStarts.delete(this);
    locate(token, start, start + token.content.length, this.src);
    return token;
  }
};
const inlineRuleNames = [
  "text",
  "linkify",
  "newline",
  "escape",
  "backticks",
  "strikethrough",
  "emphasis",
  "link",
  "image",
  "autolink",
  "html_inline",
  "entity",
];
const inlineRules = markdown.inline.ruler.getRules("");
for (const [ruleIndex, name] of inlineRuleNames.entries()) {
  const rule = inlineRules[ruleIndex]!;
  markdown.inline.ruler.at(name, (state, silent) => {
    if (silent || !state.env.sourceTracking) return rule(state, silent);
    if (state.pending && !pendingStarts.has(state))
      pendingStarts.set(state, state.pos - state.pending.length);
    const start = state.pos;
    const count = state.tokens.length;
    const accepted = rule(state, silent);
    if (!accepted) return false;
    if (!state.pending) pendingStarts.delete(state);
    else if (!pendingStarts.has(state)) pendingStarts.set(state, state.pos - state.pending.length);
    const spanStart =
      name === "linkify"
        ? start - (state.src.slice(0, start).match(/[a-z\d+.-]+$/i)?.[0].length ?? 0)
        : name === "newline"
          ? start - (state.src.slice(0, start).match(/ *$/)?.[0].length ?? 0)
          : start;
    let cursor = start;
    for (const token of state.tokens.slice(count)) {
      if (sources.has(token)) continue; // pending text or a recursively parsed label
      if (name === "emphasis" || name === "strikethrough") {
        locate(token, cursor, cursor + token.content.length, state.src);
        cursor += token.content.length;
      } else {
        locate(token, spanStart, state.pos, state.src);
      }
    }
    return true;
  });
}

// markdown-it joins adjacent text in two passes. Carry coordinates through the
// same joins without changing token contents, indices or delimiter processing.
function joined(tokens: Token[], special: boolean) {
  const groups: { token: Token; range: SourceRange }[] = [];
  let group: SourceRange | undefined;
  for (const token of tokens) {
    const range = sources.get(token);
    if ((token.type === "text" || (special && token.type === "text_special")) && range) {
      group ??= { start: range.start, end: range.end, ends: [] };
      if (!group.ends.length) group.start = range.start;
      if (token.content.length) group.end = range.end;
      for (const end of range.ends.slice(0, token.content.length)) group.ends.push(end);
      groups.push({ token, range: group });
    } else group = undefined;
  }
  return groups;
}
const fragmentsJoin = markdown.inline.ruler2.getRules("").at(-1)!;
markdown.inline.ruler2.at("fragments_join", (state) => {
  if (!state.env.sourceTracking) return fragmentsJoin(state);
  const groups = joined(state.tokens, false);
  fragmentsJoin(state);
  for (const { token, range } of groups) sources.set(token, range);
});
const textJoin = markdown.core.ruler.getRules("").at(-1)!;
markdown.core.ruler.at("text_join", (state) => {
  if (!state.env.sourceTracking) return textJoin(state);
  const groups = state.tokens.flatMap((token) => joined(token.children || [], true));
  textJoin(state);
  for (const { token, range } of groups) sources.set(token, range);
});

// Core linkify replaces text tokens. Project its new text and atomic links back
// onto the old text's coordinates, including normalized Unicode URLs.
const coreLinkify = markdown.core.ruler.getRules("")[4]!;
markdown.core.ruler.at("linkify", (state) => {
  if (!state.env.sourceTracking) return coreLinkify(state);
  const before = new Map(state.tokens.map((token) => [token, token.children?.slice()]));
  coreLinkify(state);
  for (const inline of state.tokens) {
    const previous = before.get(inline);
    if (!previous || !inline.children) continue;
    const retained = new Set(inline.children);
    let oldIndex = 0;
    let newIndex = 0;
    while (oldIndex < previous.length) {
      const old = previous[oldIndex]!;
      if (retained.has(old)) {
        newIndex = inline.children.indexOf(old, newIndex) + 1;
        oldIndex++;
        continue;
      }
      const removed: Token[] = [];
      while (oldIndex < previous.length && !retained.has(previous[oldIndex]!))
        removed.push(previous[oldIndex++]!);
      const stop =
        oldIndex < previous.length
          ? inline.children.indexOf(previous[oldIndex]!, newIndex)
          : inline.children.length;
      const content = removed.map((token) => token.content).join("");
      const ends = removed.flatMap((token) => sources.get(token)?.ends || []);
      const start = sources.get(removed[0]!)?.start ?? 0;
      const links = markdown.linkify.match(content) || [];
      let position = 0;
      for (let index = newIndex; index < stop; index++) {
        const token = inline.children[index]!;
        if (token.type === "link_open") {
          const link = links.find((candidate) => candidate.index >= position);
          if (link) {
            const end = ends[link.lastIndex - 1]!;
            const begin = link.index ? ends[link.index - 1]! : start;
            for (const part of inline.children.slice(index, index + 3))
              sources.set(part, { start: begin, end, ends: Array(part.content.length).fill(end) });
            position = link.lastIndex;
            index += 2;
          }
        } else {
          const end = position + token.content.length;
          sources.set(token, {
            start: position ? ends[position - 1]! : start,
            end: ends[end - 1] ?? start,
            ends: ends.slice(position, end),
          });
          position = end;
        }
      }
      newIndex = stop;
    }
  }
});
// Hidden source is removed only after the original Markdown grammar finishes.
// Never parse the concatenation of the visible fragments: it can grant a new
// image, link, reference definition, escape or delimiter authority.
const referenceEntry = markdown.block.ruler.__rules__.find((rule) => rule.name === "reference")!;
const referenceRule = referenceEntry.fn;
markdown.block.ruler.at(
  "reference",
  (state, start, end, silent) => {
    const hidden = state.env.hiddenRanges as [number, number][] | undefined;
    if (!hidden?.length || silent) return referenceRule(state, start, end, silent);
    // Each parse writes at most one definition. Keep the accumulated map out
    // of the rule, then merge only an eligible first definition in constant work.
    const references = (state.env.references ??= Object.create(null));
    state.env.references = Object.create(null);
    let matched: boolean;
    let definition: typeof references;
    try {
      matched = referenceRule(state, start, end, silent);
      definition = state.env.references;
    } finally {
      state.env.references = references;
    }
    if (
      matched &&
      !(state.env.hiddenIndex as ReturnType<typeof hiddenIndex>).overlaps(
        state.bMarks[start]!,
        state.bMarks[state.line] ?? state.src.length,
      )
    )
      for (const [label, value] of Object.entries(definition))
        if (!Object.hasOwn(references, label)) references[label] = value;
    return matched;
  },
  { alt: referenceEntry.alt },
);
markdown.core.ruler.push("suppress_source", (state) => {
  const hidden = state.env.hiddenRanges as [number, number][] | undefined;
  if (!hidden?.length) return;
  const index = state.env.hiddenIndex as ReturnType<typeof hiddenIndex>;
  const { overlaps } = index;
  const covered = (a: number, b: number) => {
    let cursor = a;
    for (let i = index.first(a); i < index.ranges.length; i++) {
      const [x, y] = index.ranges[i]!;
      if (x >= b) break;
      // Block maps include terminal newlines outside the hidden payload. Those
      // separators cannot keep an otherwise hidden table/paragraph alive.
      if (x > cursor && state.src.slice(cursor, Math.min(x, b)).trim()) return false;
      cursor = Math.max(cursor, y);
      if (cursor >= b) return true;
    }
    return !state.src.slice(cursor, b).trim();
  };
  // Remove fully hidden structures as balanced subtrees, including tables,
  // quotes, lists and headings. Partial containers keep their original grammar.
  let skip = 0;
  state.tokens = state.tokens.filter((token) => {
    if (skip) {
      skip += token.nesting;
      return false;
    }
    const range = blockRanges.get(token);
    if (range && covered(...range)) {
      skip = token.nesting;
      return false;
    }
    if (["fence", "code_block"].includes(token.type)) {
      const spans = blockSources.get(token)!;
      const originalContent = token.content;
      token.content = token.content
        .split("")
        .filter((_, i) => !overlaps(...spans[i]!))
        .join("");
      // Fence language is an attribute too; hidden opener bytes cannot leak it.
      if (range && overlaps(range[0], spans[0]?.[0] ?? range[1])) token.info = "";
      return !!token.content || !originalContent;
    }
    if (token.type === "hr" && range && overlaps(...range)) return false;
    return true;
  });
  for (const inline of state.tokens) {
    if (inline.type !== "inline" || !inline.children) continue;
    const spans = blockSources.get(inline)!;
    const at = (a: number, b: number) => {
      const selected = spans.slice(a, b);
      return selected.some(([x, y]) => overlaps(x, y));
    };
    const links: boolean[] = [];
    inline.children = inline.children.filter((token) => {
      const range = sources.get(token);
      const affected = range && at(range.start, range.end);
      if (token.type === "link_close") return !links.pop();
      if (token.type === "link_open") {
        const remove = !!affected;
        links.push(remove);
        return !remove;
      }
      if (!range || !affected) return true;
      if (!["text", "text_special", "code_inline"].includes(token.type)) return false;
      let content = "";
      const ends: number[] = [];
      for (let i = 0; i < token.content.length;) {
        const start = i
          ? range.ends[i - 1]!
          : token.type === "code_inline"
            ? range.ends[0]! - (isSurrogatePair(token.content, 0) ? 2 : 1)
            : range.start;
        const end = range.ends[i]!;
        let next = i + 1;
        while (next < token.content.length && range.ends[next] === end) next++;
        if (!at(start, end)) {
          content += token.content.slice(i, next);
          for (let j = i; j < next; j++) ends.push(end);
        }
        i = next;
      }
      token.content = content;
      sources.set(token, { ...range, ends });
      return !!content;
    });
  }
});
markdown.renderer.rules.artifact_boundary = (tokens, index) =>
  markdown.utils.escapeHtml(tokens[index]!.content);
// Parse the unchanged response completely, then project source boundaries onto
// the finished token stream. Splitting text can no longer affect Markdown rules.
markdown.core.ruler.push("artifact_boundaries", (state) => {
  const prefix = state.env.artifactBoundaryPrefix as string | undefined;
  const boundaries = state.env.artifactBoundaries as { offset: number; block: boolean }[];
  if (!prefix || !boundaries?.length) return;
  const lines = state.src.split("\n");
  const starts: number[] = [];
  let offset = 0;
  for (const line of lines) {
    starts.push(offset);
    offset += line.length + 1;
  }
  const originalTokens = state.tokens.slice();
  for (let index = boundaries.length - 1; index >= 0; index--) {
    const boundary = boundaries[index]!;
    let line = 0;
    while (line + 1 < starts.length && starts[line + 1]! <= boundary.offset) line++;
    const column = boundary.offset - starts[line]!;
    const inline = originalTokens.find(
      (token) =>
        token.type === "inline" &&
        token.map &&
        token.map[0] <= line &&
        line < token.map[1] &&
        !(boundary.block && line === token.map[0] && column === 0),
    );
    const marker = new state.Token("artifact_boundary", "", 0);
    marker.content = `${prefix}${index}END`;
    if (inline) {
      const contentLines = inline.content.split("\n");
      const relativeLine = line - inline.map![0];
      const contentLine = contentLines[relativeLine] || "";
      const indentation = lines[line]!.indexOf(contentLine);
      let position =
        contentLines.slice(0, relativeLine).reduce((sum, value) => sum + value.length + 1, 0) +
        Math.max(
          boundary.block ? contentLine.length - contentLine.trimStart().length : 0,
          column - indentation,
        );
      const children = inline.children!;
      for (const child of children) {
        if (!child.type.endsWith("break")) continue;
        const range = sources.get(child);
        if (range && position >= range.start && position < range.end) position = range.end;
      }
      let target = children.length;
      for (let childIndex = 0; childIndex < children.length; childIndex++) {
        const child = children[childIndex]!;
        const range = sources.get(child);
        if (!range || child.nesting || (!child.content && !child.type.endsWith("break"))) continue;
        // Newline syntax (including consumed indentation) belongs before a
        // standalone card even when its source offset is at the newline start.
        if (position < range.start || (position === range.start && !child.type.endsWith("break"))) {
          target = childIndex;
          break;
        }
        if (position > range.end) continue;
        const automaticLink =
          children[childIndex - 1]?.type === "link_open" &&
          children[childIndex - 1]?.info === "auto";
        if (child.type === "text" && !automaticLink) {
          let split = range.ends.findIndex((end) => end >= position) + 1;
          // A source entity/escape maps to one indivisible decoded unit, which
          // may contain multiple UTF-16 units (or multiple Unicode code points).
          while (split < range.ends.length && range.ends[split] === range.ends[split - 1]) split++;
          const trailing = new state.Token("text", "", 0);
          trailing.content = child.content.slice(split);
          sources.set(trailing, {
            start: range.ends[split - 1] ?? range.start,
            end: range.end,
            ends: range.ends.slice(split),
          });
          child.content = child.content.slice(0, split);
          sources.set(child, {
            start: range.start,
            end: range.ends[split - 1] ?? range.start,
            ends: range.ends.slice(0, split),
          });
          children.splice(childIndex + 1, 0, trailing);
        }
        target = childIndex + 1;
        // Keep normalized automatic links atomic rather than splitting their
        // visible label from the original href.
        if (children[target]?.type === "link_close" && children[target]?.info === "auto") target++;
        break;
      }
      children.splice(target, 0, marker);
    } else {
      const next = state.tokens.findIndex(
        (candidate) => candidate.level === 0 && candidate.map && candidate.map[0] >= line,
      );
      state.tokens.splice(next < 0 ? state.tokens.length : next, 0, marker);
    }
  }
});
export function renderMarkdown(
  text: string,
  artifactBoundaryPrefix?: string,
  artifactBoundaries?: { offset: number; block: boolean }[],
  hiddenRanges?: [number, number][],
): string {
  // Normalize coordinates in one pass, rather than rescanning each prefix for
  // every hidden interval. Preserve UTF-16 source units and CRLF interiors.
  const offsets = new Uint32Array(text.length + 1);
  let normalized = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== "\n" || text[i - 1] !== "\r") normalized++;
    offsets[i + 1] = normalized;
  }
  const hidden = hiddenRanges?.map(([a, b]): [number, number] => [offsets[a]!, offsets[b]!]);
  return markdown.render(text, {
    artifactBoundaryPrefix,
    sourceTracking: !!artifactBoundaryPrefix || !!hiddenRanges?.length,
    hiddenRanges: hidden,
    hiddenIndex: hiddenIndex(hidden ?? []),
    // markdown-it normalizes line endings before block parsing.
    artifactBoundaries: artifactBoundaries?.map((boundary) => ({
      ...boundary,
      offset: offsets[boundary.offset]!,
    })),
  });
}
