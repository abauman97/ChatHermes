"""Shared explicit delivery and assistant-only Deliverable Mode extraction.

Filesystem validation is separate; tool bodies and context references are data.
"""

import json
import re
from bisect import bisect_left, bisect_right
from datetime import UTC, datetime
from typing import override
from urllib.parse import unquote, urlsplit

from markdown_it import MarkdownIt
from markdown_it.parser_block import ParserBlock
from markdown_it.rules_block.reference import reference
from markdown_it.rules_block.state_block import StateBlock
from markdown_it.rules_inline.backticks import backtick
from markdown_it.rules_inline.image import image
from markdown_it.rules_inline.link import link


class _SourceBlock(StateBlock):
    """Capture getLines provenance before container line positions are restored."""

    @override
    def getLines(self, begin, end, indent, keepLastLF):
        text = super().getLines(begin, end, indent, keepLastLF)
        offsets = []
        for line in range(begin, end):
            start = first = self.bMarks[line]
            last = self.eMarks[line] + (line + 1 < end or keepLastLF)
            width = 0
            while first < last and width < indent:
                char = self.src[first]
                if char == "\t":
                    width += 4 - (width + self.bsCount[line]) % 4
                elif char == " " or first - start < self.tShift[line]:
                    width += 1
                else:
                    break
                first += 1
            offsets.extend([first - 1] * max(0, width - indent))
            offsets.extend(range(first, min(last, len(self.src))))
        self._source_read = (text, offsets)
        return text


class _SourceParser(ParserBlock):
    @override
    def parse(self, src, md, env, outTokens):
        if not src:
            return None
        state = _SourceBlock(src, md, env, outTokens)
        self.tokenize(state, state.line, state.lineMax)
        return state.tokens


def _track_inline_sources(parser):
    parser.block = _SourceParser()
    for name in ("paragraph", "lheading", "heading"):
        entry = next(rule for rule in parser.block.ruler.__rules__ if rule.name == name)

        def tracked(state, start, end, silent, rule=entry.fn, name=name):
            count = len(state.tokens)
            matched = rule(state, start, end, silent)
            if not matched or silent:
                return matched
            for token in state.tokens[count:]:
                if token.type != "inline":
                    continue
                if name == "heading":
                    begin = (
                        state.bMarks[start] + state.tShift[start] + len(state.tokens[count].markup)
                    )
                    raw = state.src[begin : state.eMarks[start]]
                    leading = len(raw) - len(raw.lstrip())
                    offsets = list(range(begin + leading, begin + leading + len(token.content)))
                else:
                    raw, offsets = state._source_read
                    leading = len(raw) - len(raw.lstrip())
                    if raw.strip() != token.content:
                        raise ValueError("Invalid Markdown paragraph provenance")
                    offsets = offsets[leading : leading + len(token.content)]
                if len(offsets) != len(token.content):
                    raise ValueError("Invalid Markdown source offsets")
                token.meta["source_offsets"] = offsets
            return matched

        parser.block.ruler.at(name, tracked, {"alt": entry.alt})


def _delivery_code_span(state, silent):
    """Retain source lines with the Markdown parser's own quotation semantics."""
    start, count = state.pos, len(state.tokens)
    matched = backtick(state, silent)
    if not silent and len(state.tokens) > count and state.tokens[-1].type == "code_inline":
        state.tokens[-1].meta["source_range"] = (start, state.pos)
        state.tokens[-1].meta["delivery_lines"] = (
            state.src[:start].count("\n"),
            state.src[: state.pos].count("\n"),
        )
    return matched


_MARKDOWN = MarkdownIt("default", {"html": True})
_track_inline_sources(_MARKDOWN)
_MARKDOWN.inline.ruler.at("backticks", _delivery_code_span)
_IMAGE_MARKDOWN = MarkdownIt("default", {"html": True})


def _descendants(tokens):
    for token in tokens:
        yield token
        yield from _descendants(token.children or [])


def _source_image(state, silent):
    start, count = state.pos, len(state.tokens)
    matched = image(state, silent)
    if matched and not silent:
        for token in _descendants(state.tokens[count:]):
            if token.type == "code_inline":
                a, b = token.meta["source_range"]
                token.meta["source_range"] = (a + start + 2, b + start + 2)
                first, last = token.meta["delivery_lines"]
                line = state.src[: start + 2].count("\n")
                token.meta["delivery_lines"] = (first + line, last + line)
    return matched


_MARKDOWN.inline.ruler.at("image", _source_image)


def _delivery_image(state, silent):
    start, count = state.pos, len(state.tokens)
    matched = image(state, silent)
    if matched and not silent:
        token = next(token for token in state.tokens[count:] if token.type == "image")
        token.meta["delivery_range"] = (start, state.pos)
    return matched


def _delivery_link(state, silent):
    # An escaped image opener must remain a literal example, as before.
    start, count = state.pos, len(state.tokens)
    matched = link(state, silent)
    if not silent:
        for token in state.tokens[count:]:
            if token.type == "link_open":
                token.meta["delivery_link"] = start == 0 or state.src[start - 1] != "!"
                token.meta["delivery_range"] = (start, state.pos)
                break
    return matched


_IMAGE_MARKDOWN.inline.ruler.at("link", _delivery_link)
_IMAGE_MARKDOWN.inline.ruler.at("image", _delivery_image)


def _source_reference(state, start, end, silent):
    allowed = state.env.get("definition_allowed")
    if allowed is None or silent:
        return reference(state, start, end, silent)
    # A scratch map bounds each definition's work; retain first eligible wins.
    references = state.env.setdefault("references", {})
    state.env["references"] = {}
    try:
        matched = reference(state, start, end, silent)
        definition = state.env["references"]
    finally:
        state.env["references"] = references
    offset = state.env.get("source_offset", 0)
    if matched and allowed(
        offset + state.env["source_edges"][state.bMarks[start]],
        offset + state.env["source_edges"][state.bMarks[state.line]],
    ):
        for label, value in definition.items():
            if label not in references:
                references[label] = value
            else:
                state.env.setdefault("duplicate_refs", []).append({**value, "label": label})
    return matched


_MARKDOWN.block.ruler.at(
    "reference",
    _source_reference,
    {"alt": next(rule.alt for rule in _MARKDOWN.block.ruler.__rules__ if rule.name == "reference")},
)


_TABLE_RULE = next(rule.fn for rule in _MARKDOWN.block.ruler.__rules__ if rule.name == "table")


def _source_table(state, start, end, silent):
    """Record each table cell's original offsets before container restoration.

    markdown-it-py supplies row maps; cell contents have already lost escaped
    pipe backslashes, so line-wide substring searching is not provenance.
    """
    count = len(state.tokens)
    matched = _TABLE_RULE(state, start, end, silent)
    if not matched or silent:
        return matched
    cells, cell, row = [], 0, start
    for token in state.tokens[count:]:
        if token.type == "tr_open":
            row = token.map[0]
            a = state.bMarks[row] + state.tShift[row]
            raw = state.src[a : state.eMarks[row]]
            cells, cell = [([], [])], 0
            for i, char in enumerate(raw):
                content, offsets = cells[-1]
                if char == "|" and (i == 0 or raw[i - 1] != "\\"):
                    cells.append(([], []))
                elif char == "|":
                    content[-1] = char
                    offsets[-1] = a + i
                else:
                    content.append(char)
                    offsets.append(a + i)
            if not "".join(cells[0][0]).strip():
                cells.pop(0)
            if cells and not "".join(cells[-1][0]).strip():
                cells.pop()
        elif token.type == "inline":
            characters, offsets = cells[cell] if cell < len(cells) else ([], [])
            content = "".join(characters)
            leading = len(content) - len(content.lstrip())
            token.meta["source_offsets"] = offsets[leading : len(content.rstrip())]
            # The pinned runtime's markdown-it-py 4.0 omits cell maps; newer
            # development versions include them. Row provenance is identical.
            token.map = [row, row + 1]
            cell += 1
    return matched


_MARKDOWN.block.ruler.at(
    "table",
    _source_table,
    {"alt": next(rule.alt for rule in _MARKDOWN.block.ruler.__rules__ if rule.name == "table")},
)


def _media_references(line, automatic=False, env=None):
    files = []
    automatic = automatic and not re.fullmatch(r"\s*[\"'“‘].*[\"'”’]\s*", line)
    tokens = _IMAGE_MARKDOWN.parseInline(line, env)[0].children or []

    def insertion_point(token):
        span = token.meta.get("delivery_range")
        explicit = token.type == "image" or (token.attrGet("href") or "").startswith("MEDIA:")
        return span[0 if explicit else 1] if span else float("inf")

    consumed = 0
    for token in sorted(tokens, key=insertion_point):
        src = token.attrGet("src" if token.type == "image" else "href")
        if (
            token.type not in ("image", "link_open")
            or not isinstance(src, str)
            or not (src.startswith("MEDIA:") or (automatic and token.type == "link_open"))
        ):
            continue
        if token.type == "link_open" and not token.meta.get("delivery_link"):
            continue
        try:
            path = unquote(src[6:] if src.startswith("MEDIA:") else src, errors="strict")
            if not src.startswith("MEDIA:") and not automatic_path(path, linked=True):
                continue
        except UnicodeDecodeError:
            continue
        if not re.match(
            r"^(?:/(?!/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)", path, re.I
        ) or re.search(r"[\x00-\x1f\x7f]", path):
            continue
        file = artifact(path)
        span = token.meta.get("delivery_range")
        if file and span and span[1] > consumed:
            if not src.startswith("MEDIA:"):
                file["automatic"] = True
            files.append(file)
            if src.startswith("MEDIA:"):
                consumed = span[1]
    return files


_EXTENSIONS = "png jpg jpeg gif webp bmp tiff svg mp4 mov avi mkv webm 3gp mp3 m2a wav ogg opus m4a flac pdf docx doc odt rtf txt md epub xlsx xls ods csv tsv json xml yaml yml kmz kml geojson gpx pptx ppt odp key zip tar gz tgz bz2 xz 7z rar apk ipa html htm"
_ANCHORED = (
    r"""(?:~/|/|[A-Za-z]:[/\\])\S+?(?:[^\S\n]+\S+?)*?\.(?:"""
    + "|".join(sorted(_EXTENSIONS.split(), key=len, reverse=True))
    + r""")(?=[\s`"'*_,;:)\]}]|MEDIA:|$)"""
)
_MEDIA = re.compile(r"""MEDIA:\s*(`[^`\n]+`|"[^"\n]+"|'[^'\n]+'|""" + _ANCHORED + r"""|[^\s`"]+)""")
_PATH = re.compile(r"^(?:/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?://|data:image/)", re.I)
_TEXT = set(
    "txt md csv json xml yaml yml py js ts tsx jsx css sh sql toml rs go java c cpp h html htm svg".split()
)
_MIME = dict(
    png="image/png",
    jpg="image/jpeg",
    jpeg="image/jpeg",
    gif="image/gif",
    webp="image/webp",
    bmp="image/bmp",
    svg="image/svg+xml",
    pdf="application/pdf",
    mp4="video/mp4",
    webm="video/webm",
    mp3="audio/mpeg",
    wav="audio/wav",
    ogg="audio/ogg",
    html="text/html",
    htm="text/html",
)


def artifact(path, name=None):
    try:
        if path.startswith("#media:"):
            path = unquote(path[7:])
        if path.startswith("sandbox:"):
            path = path[8:]
        if path.startswith("file:"):
            path = unquote(urlsplit(path).path)
    except ValueError:
        return None
    if not _PATH.match(path):
        return None
    path_name = re.split(r"[\\/]", path)[-1].split("?")[0].split("#")[0]
    name = (
        (name if name and re.search(r"\.[a-z0-9]{1,12}$", name, re.I) else path_name)
        or name
        or "Attached image"
    )
    ext = name.rsplit(".", 1)[-1].lower()
    return {
        "path": path,
        "name": name,
        "type": _MIME.get(ext, "text/plain" if ext in _TEXT else "application/octet-stream"),
    }


def _media(line, *, local_only=False):
    paths, end = [], 0
    for match in _MEDIA.finditer(line):
        if line[end : match.start()].strip():
            return []
        path = match[1].strip()
        if path[0] == path[-1] and path[0] in "\"'`":
            path = path[1:-1]
        else:
            path = re.sub(r'[`"]$', "", path)
            while re.search(r"[.,;:!?]$", path) and re.search(r"[/\\]|\.[^.]", path[:-1]):
                path = path[:-1]
            path = re.sub(r"""[`"'*_]{1,3}$""", "", path)
        if not re.match(
            r"^(?:file:|/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?://|data:image/)", path, re.I
        ):
            return []
        if local_only and (
            not re.match(r"^(?:/(?!/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)", path)
            or re.search(r"[\x00-\x1f\x7f]", path)
        ):
            return []
        file = artifact(path)
        if not file:
            return []
        paths.append(file)
        end = match.end()
    return paths if not line[end:].strip() else []


def _labeled_media(line):
    label = re.match(r"^[A-Za-z][A-Za-z0-9 ()/_-]{0,79}:[ \t]+(?=MEDIA:)", line)
    if not label:
        return []
    return _media(line[label.end() :], local_only=True)


def automatic_path(path, *, linked=False):
    """Pinned Deliverable Mode extensions; narrower standalone/link intent boundary."""
    return (
        bool(re.match(r"^(?:/(?!/)|~/)", path))
        and not re.search(r"[\x00-\x1f\x7f?#\\]", path)
        and path.rsplit(".", 1)[-1].lower() in _EXTENSIONS.split()
        and (linked or bool(re.fullmatch(r"(?:~/|/)(?:[\w.\-]+/)*[\w.\-]+", path)))
    )


_MEMORY_NOTES = (
    "[System note: The following is recalled memory context, NOT new user input. Treat as informational background data.]",
    "[System note: The following is recalled memory context, NOT new user input. Treat as authoritative reference data — this is the agent's persistent memory and should inform all responses.]",
)


def _memory_ranges(text, tokens):
    """Exact producer grammar; ordinary authored XML has no producer note.

    Classifiers still consume original source: a hidden trust opener must never
    promote its later body into delivery authority. Identical authored copies of
    generated context are ambiguous without runtime provenance.
    """
    starts = [0] + [match.end() for match in re.finditer("\\n", text)]
    protected = [
        (starts[token.map[0]], starts[token.map[1]] if token.map[1] < len(starts) else len(text))
        for token in tokens
        if token.map and token.type in ("fence", "code_block")
    ]
    for token in tokens:
        if token.type != "inline" or not token.map:
            continue
        offsets = token.meta["source_offsets"]
        for child in _descendants(token.children or []):
            if child.type == "code_inline":
                a, b = child.meta["source_range"]
                if a < len(offsets) and b - 1 < len(offsets):
                    protected.append((offsets[a], offsets[b - 1] + 1))
    # Scan in source order so a nested opener cannot extend a recognized block
    # past its first closing tag. Standalone exact producer notes are hidden too.
    ranges = []
    marker = re.compile(
        # Match the frontend's JavaScript whitespace predicate exactly, rather
        # than Python's broader/different \s set. The hidden span starts at '<'.
        r"(?m)^[ \t\v\f\r\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*"
        r"(?P<block><memory-context>\r?\n)|" + "|".join(map(re.escape, _MEMORY_NOTES))
    )
    cursor = 0
    for match in marker.finditer(text):
        if match.start() < cursor or any(a <= match.start() < b for a, b in protected):
            continue
        if match.group() in _MEMORY_NOTES:
            end = match.end()
        elif text.startswith(_MEMORY_NOTES, match.end()):
            close = text.find("</memory-context>", match.end())
            end = len(text) if close < 0 else close + len("</memory-context>")
        else:
            continue
        ranges.append((match.start("block") if match.group("block") else match.start(), end))
        cursor = end
    return ranges


def _boundary_tokens(text, boundaries, env):
    tokens, line = [], 0
    for index, start in enumerate(boundaries):
        part = text[start : boundaries[index + 1] if index + 1 < len(boundaries) else len(text)]
        edges, offset = [0], 0
        while offset < len(part):
            offset += 2 if part[offset : offset + 2] == "\r\n" else 1
            edges.append(offset)
        env["source_offset"] = start
        env["source_edges"] = edges
        parsed = _MARKDOWN.parse(part, env)
        for token in parsed:
            if "source_offsets" in token.meta:
                token.meta["source_offsets"] = [
                    edges[index] + start for index in token.meta["source_offsets"]
                ]
            if token.map:
                token.map = [token.map[0] + line, token.map[1] + line]
        tokens.extend(parsed)
        line += part.count("\n")
    return tokens


def text_artifacts(
    text, *, automatic=True, start=0, end=None, context_end=None, boundaries=None, positioned=False
):
    if not re.search(r"MEDIA:|Attached (?:file|image) |/", text):
        return []
    end = len(text) if end is None else end
    lines = text.split("\n")
    env = {}
    tokens = _boundary_tokens(text, boundaries or [0], env)
    memory = _memory_ranges(text, tokens)
    if context_end is not None and context_end < len(text):
        memory.append((context_end, len(text)))
    literal, untrusted = set(), set()
    for token in tokens:
        if token.map and (
            token.type
            in (
                "fence",
                "code_block",
                "table_open",
                "blockquote_open",
                "bullet_list_open",
                "ordered_list_open",
            )
        ):
            literal.update(range(*token.map))
    quoted_tags = []
    for token in tokens:
        offsets = token.meta.get("source_offsets", [])
        for child in _descendants(token.children or []):
            if child.type != "code_inline":
                continue
            a, b = child.meta["source_range"]
            if a < len(offsets) and b - 1 < len(offsets):
                quoted_tags.append((offsets[a], offsets[b - 1] + 1))
    quoted_tags.sort()
    quoted_index, source_offset, depth = 0, 0, 0
    for index, line in enumerate(lines):
        line_start = source_offset
        source_offset += len(line) + 1
        if depth:
            untrusted.add(index)
        if index in literal or not re.search(
            r"</?(?:untrusted_tool_result|think|thinking|reasoning|analysis|pre|code|script|style)\b",
            line,
            re.I,
        ):
            continue
        for tag in re.finditer(
            r"<(/?)(?:untrusted_tool_result|think|thinking|reasoning|analysis|pre|code|script|style)\b[^>]*(?:>|$)",
            line,
            re.I,
        ):
            offset = line_start + tag.start()
            while quoted_index < len(quoted_tags) and quoted_tags[quoted_index][1] <= offset:
                quoted_index += 1
            if quoted_index < len(quoted_tags) and quoted_tags[quoted_index][0] <= offset:
                continue
            untrusted.add(index)
            depth = max(0, depth - 1) if tag[1] else depth + 1
    # Reference destinations require the same authority as delivery lines. Build
    # a fresh environment after original-source classification so definitions in
    # quoted/untrusted content cannot resolve links in another assistant message.
    starts = [0] + [match.end() for match in re.finditer("\n", text)]
    # Original-source exclusions are indexed once, rather than scanning all
    # lines and memory ranges for every reference definition.
    excluded = [(a, b) for a, b in memory if text[a:b].lstrip().startswith("<memory-context>")]
    excluded.extend(
        (starts[index], starts[index] + len(lines[index]) + 1) for index in literal | untrusted
    )
    excluded.sort()
    excluded_starts, max_ends = [], []
    for a, b in excluded:
        excluded_starts.append(a)
        max_ends.append(max(b, max_ends[-1] if max_ends else 0))

    def definition_allowed(a, b):
        # Definition maps include the newline where Desktop's cutoff starts.
        while b > a and text[b - 1] in "\r\n":
            b -= 1
        index = bisect_left(excluded_starts, b)
        return (context_end is None or b <= context_end) and (
            index == 0 or max_ends[index - 1] <= a
        )

    env = {"definition_allowed": definition_allowed}
    _boundary_tokens(text, boundaries or [0], env)
    # Exclude memory offsets only after original-source trust classification.
    offset = 0
    eligible, offsets = [], []
    for line in lines:
        offsets.append(offset)
        eligible.append(
            start <= offset < end
            and not any(
                a < offset + len(line)
                and b > offset
                and (
                    text[a:b].lstrip().startswith("<memory-context>")
                    or (context_end is not None and a == context_end)
                )
                for a, b in memory
            )
        )
        offset += len(line) + 1
    files = {}
    for position, token in enumerate(tokens):
        if token.type != "paragraph_open" or token.level != 0 or not token.map:
            continue
        # Quoted examples protect their source lines, not the whole paragraph.
        quoted = set()
        for child in _descendants(tokens[position + 1].children or []):
            if child.type != "code_inline":
                continue
            if not re.search(r"MEDIA:|Attached (?:image|file) ", child.content) and (
                child.meta["delivery_lines"][0] == child.meta["delivery_lines"][1]
            ):
                continue
            first, last = child.meta["delivery_lines"]
            quoted.update(range(token.map[0] + first, token.map[0] + last + 1))
        for index in range(*token.map):
            if index in untrusted or index in quoted or not eligible[index]:
                continue
            line = lines[index]
            attachment = re.fullmatch(r"Attached (?:image|file) ([^\n]+?): ([^\n]+?)\r?", line)
            found = []
            if attachment:
                file = artifact(attachment[2].strip(), attachment[1])
                if file:
                    found = [file]
            elif line.startswith("MEDIA:"):
                found = _media(line)
            else:
                found = _labeled_media(line) or _media_references(line, automatic, env)
                if automatic and automatic_path(line.strip()):
                    found.append({**artifact(line.strip()), "automatic": True})
            for file in found:
                if file["path"] not in files or (
                    files[file["path"]].get("automatic") and not file.get("automatic")
                ):
                    files[file["path"]] = (
                        {**file, "_offset": offsets[index]} if positioned else file
                    )
    return list(files.values())


def tool_artifacts(output):
    try:
        row = json.loads(output) if isinstance(output, str) else output
    except ValueError, TypeError:
        return []
    if (
        not isinstance(row, dict)
        or row.get("is_error")
        or row.get("error")
        or row.get("success") is False
        or (isinstance(row.get("exit_code"), (int, float)) and row["exit_code"] != 0)
    ):
        return []
    meta = (
        row.get("meta")
        if row.get("_multimodal") is True and isinstance(row.get("meta"), dict)
        else row
    )
    tag = meta.get("media_tag")
    if not isinstance(tag, str):
        return []
    tag = re.sub(r"^\[\[audio_as_voice\]\]\r?\n", "", tag)
    # Tool envelope must consist entirely of delivery lines.
    files = []
    for line in tag.split("\n"):
        if not line:
            continue
        found = _media(line) if line.startswith("MEDIA:") else []
        if not found:
            return []
        files.extend(found)
    for file in files:
        mime = meta.get("mime_type") or meta.get("mime")
        if isinstance(mime, str) and re.fullmatch(r"[a-z0-9.+-]+/[a-z0-9.+-]+", mime, re.I):
            file["type"] = mime
        size = meta.get("size", meta.get("bytes"))
        if type(size) is int and 0 <= size <= 2**53 - 1:
            file["size"] = size
    return files


def timestamp(value):
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value, UTC).isoformat()
    if isinstance(value, str) and value:
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC).isoformat()
        except ValueError:
            pass
    return ""


def _message_text(content):
    return (
        content
        if isinstance(content, str)
        else "\n".join(
            part.get("text", "")
            for part in content or []
            if isinstance(part, dict) and part.get("type") == "text"
        )
        if isinstance(content, list)
        else ""
    )


_HIDDEN_KINDS = {
    "hidden",
    "auto_continue",
    "process_complete",
    "async_delegation_complete",
    "model_switch",
    "personality_switch",
    "failed_turn",
}


def _user_artifact_prefix(text):
    # Match Desktop over the memory-excluded presentation, preserving offsets.
    # A marker inside recalled data cannot truncate a later real upload.
    for a, b in reversed(_memory_ranges(text, _boundary_tokens(text, [0], {}))):
        text = text[:a] + re.sub(r"[^\n\r]", " ", text[a:b]) + text[b:]
    # Same original-source prefix as Desktop presentation, never recovered refs.
    prefix = re.split(r"(?:^|\n)--- Attached Context ---\s*\n", text, maxsplit=1)[0]
    return re.split(r"(?:^|\n)--- Context Warnings ---", prefix, maxsplit=1)[0]


_ASSISTANT_MARKERS = (
    *_MEMORY_NOTES,
    *(
        f"<{slash}{tag}>"
        for tag in (
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
        )
        for slash in ("", "/")
    ),
    *("<memory-context>" + newline + note for note in _MEMORY_NOTES for newline in ("\n", "\r\n")),
)


_ASSISTANT_MARKER_LIMIT = max(map(len, _ASSISTANT_MARKERS))


def _assistant_separator(text, part):
    # Match only the missing marker bytes, not the complete incoming block.
    text = text[-_ASSISTANT_MARKER_LIMIT:]
    start = max(text.rfind("["), text.rfind("<"))
    if start >= 0:
        length = len(text) - start
        for marker in _ASSISTANT_MARKERS:
            if (
                length < len(marker)
                and marker.startswith(text[start:])
                and marker[length:].startswith(part[: len(marker) - length])
            ):
                return ""
    return "\n\n"


def extract(messages, session):
    files = {}
    # One assistant source per user turn, retaining trust and memory boundaries
    # across intervening tool events. Message IDs and authorization stay native.
    groups, current = [], []
    for index, message in enumerate(messages):
        if message.get("role") in ("user", "system"):
            current = []
        if message.get("role") == "assistant" and message.get("display_kind") not in _HIDDEN_KINDS:
            if not current:
                groups.append(current)
            current.append((index, _message_text(message.get("content"))))
    sources = {}
    for group in groups:
        pieces, spans, boundaries, length = [], [], [0], 0
        # Only marker fragments may continue across a native text boundary.
        tail = ""
        for member, text in group:
            separator = _assistant_separator(tail, text) if spans else ""
            pieces.extend((separator, text))
            length += len(separator)
            if spans:
                boundaries.append(length)
            spans.append((member, length, length + len(text)))
            length += len(text)
            tail = text if separator else tail + text
        source = "".join(pieces)
        starts = [start for _, start, _ in spans]
        for member, _, _ in spans:
            sources[member] = []
        for file in text_artifacts(source, boundaries=boundaries, positioned=True):
            offset = file.pop("_offset")
            member = spans[bisect_right(starts, offset) - 1][0]
            sources[member].append(file)
    for index, message in enumerate(messages):
        role, content = message.get("role"), message.get("content")
        if message.get("display_kind") in _HIDDEN_KINDS:
            continue
        text = _message_text(content)
        found = (
            sources[index]
            if role == "assistant"
            else text_artifacts(text, automatic=False, context_end=len(_user_artifact_prefix(text)))
            if role in ("user", "assistant")
            else tool_artifacts(text)
            if role == "tool"
            else []
        )
        images = [
            file
            for file in found
            if file["type"].startswith("image/") and file["type"] != "image/svg+xml"
        ]
        if role in ("user", "assistant") and isinstance(content, list) and not images:
            for index, part in enumerate(content):
                url = (part.get("image_url") or {}).get("url") if isinstance(part, dict) else None
                if isinstance(url, str) and re.match(r"^(data:image/|https?://)", url):
                    # Store an address into authoritative history, never image bytes.
                    file = artifact(url, "Attached image.png")
                    if url.startswith("data:"):
                        file["path"] = (
                            f"/api/plugins/chathermes/artifact-images/{session['id']}/{message['id']}/{index}"
                        )
                    found.append(file)
        for file in found:
            if file["path"].startswith("data:"):
                continue  # No inline file contents in the metadata database.
            if (
                role == "user"
                and file["type"].startswith("image/")
                and file["type"] != "image/svg+xml"
            ):
                match = re.search(
                    r"/uploads/chathermes/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))$",
                    file["path"],
                    re.I,
                )
                if match:
                    file["path"] = "/api/plugins/chathermes/images/" + match[1]
            file.update(
                messageId=str(message["id"]) if message.get("id") is not None else None,
                createdAt=timestamp(
                    message.get("created_at")
                    or message.get("timestamp")
                    or session.get("updated_at")
                    or session.get("last_active")
                    or session.get("started_at")
                ),
                direction="uploaded" if role == "user" else "generated",
            )
            if file["path"] not in files or (
                files[file["path"]].get("automatic") and not file.get("automatic")
            ):
                files[file["path"]] = file
    return list(files.values())
