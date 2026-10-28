"""Explicit delivery grammar shared with the conversation artifact contract.

Do not mine arbitrary tool output, ordinary Markdown links, or context references.
The marker fast path avoids Markdown parsing for ordinary conversation text.
"""

import json
import re
from datetime import UTC, datetime
from urllib.parse import unquote, urlsplit

from markdown_it import MarkdownIt
from markdown_it.rules_inline.backticks import backtick


def _delivery_code_span(state, silent):
    """Retain source lines with the Markdown parser's own quotation semantics."""
    start, count = state.pos, len(state.tokens)
    matched = backtick(state, silent)
    if not silent and len(state.tokens) > count and state.tokens[-1].type == "code_inline":
        state.tokens[-1].meta["delivery_lines"] = (
            state.src[:start].count("\n"),
            state.src[: state.pos].count("\n"),
        )
    return matched


_MARKDOWN = MarkdownIt("default", {"html": True})
_MARKDOWN.inline.ruler.at("backticks", _delivery_code_span)
_IMAGE_MARKDOWN = MarkdownIt("default", {"html": True})


def _media_images(line):
    files = []
    for token in _IMAGE_MARKDOWN.parseInline(line)[0].children or []:
        src = token.attrGet("src")
        if token.type != "image" or not isinstance(src, str) or not src.startswith("MEDIA:"):
            continue
        try:
            path = unquote(src[6:], errors="strict")
        except UnicodeDecodeError:
            continue
        if not re.match(
            r"^(?:/(?!/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)", path, re.I
        ) or re.search(r"[\x00-\x1f\x7f]", path):
            continue
        file = artifact(path)
        if file:
            files.append(file)
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


def _media(line):
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
        file = artifact(path)
        if not file:
            return []
        paths.append(file)
        end = match.end()
    return paths if not line[end:].strip() else []


def text_artifacts(text):
    if "MEDIA:" not in text and not re.search(r"Attached (?:file|image) ", text):
        return []
    lines = text.split("\n")
    tokens = _MARKDOWN.parse(text)
    literal, untrusted = set(), set()
    for token in tokens:
        if token.map and (
            token.type
            in ("fence", "code_block", "blockquote_open", "bullet_list_open", "ordered_list_open")
            or any(
                child.type == "code_inline"
                and re.search("untrusted_tool_result", child.content, re.I)
                for child in token.children or []
            )
        ):
            literal.update(range(*token.map))
    depth = 0
    for index, line in enumerate(lines):
        if depth:
            untrusted.add(index)
        if index in literal or not re.match(r"\s*</?untrusted_tool_result\b", line, re.I):
            continue
        for tag in re.finditer(r"<(/?)untrusted_tool_result\b[^>]*(?:>|$)", line, re.I):
            untrusted.add(index)
            depth = max(0, depth - 1) if tag[1] else depth + 1
    files = {}
    for position, token in enumerate(tokens):
        if token.type != "paragraph_open" or token.level != 0 or not token.map:
            continue
        # Quoted examples protect their source lines, not the whole paragraph.
        quoted = set()
        for child in tokens[position + 1].children or []:
            if child.type != "code_inline" or not re.search(
                r"MEDIA:|Attached (?:image|file) ", child.content
            ):
                continue
            first, last = child.meta["delivery_lines"]
            quoted.update(range(token.map[0] + first, token.map[0] + last + 1))
        for index in range(*token.map):
            if index in untrusted or index in quoted:
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
                found = _media_images(line)
            for file in found:
                files.setdefault(file["path"], file)
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


def extract(messages, session):
    files = {}
    for message in messages:
        role, content = message.get("role"), message.get("content")
        if message.get("display_kind") in (
            "hidden",
            "auto_continue",
            "process_complete",
            "async_delegation_complete",
            "model_switch",
            "personality_switch",
            "failed_turn",
        ):
            continue
        text = (
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
        found = (
            text_artifacts(text)
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
            files.setdefault(file["path"], file)
    return list(files.values())
