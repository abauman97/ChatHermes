"""Credential scrubbing shared by gateway responses and cron delivery."""

import json
import re

_TEXT_ESCAPE = re.compile(
    r"\\u[dD][89aAbB][0-9a-fA-F]{2}\\u[dD][c-fC-F][0-9a-fA-F]{2}"
    r'|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})|[\s\S]'
)


def redact_gateway_key(text, key):
    """Inspect literal and JSON-escaped text without trusting prose quote pairs.

    Keep source spans while decoding so unrelated Markdown, quotes and escapes
    survive byte for byte. Valid surrogate pairs form one decoded character.
    Callers must fail closed on any unexpected decoding failure.
    """
    if not key:
        return text
    decoded = []
    source = []
    for match in _TEXT_ESCAPE.finditer(text):
        token = match.group()
        value = json.loads('"' + token + '"') if len(token) > 1 else token
        decoded.append(value)
        source.extend([match.span()] * len(value))

    spans = []
    for candidate, escaped in ((text, False), ("".join(decoded), True)):
        offset = 0
        while (start := candidate.find(key, offset)) != -1:
            end = start + len(key)
            spans.append((source[start][0], source[end - 1][1]) if escaped else (start, end))
            offset = start + 1
    # Merge overlaps, including literal matches within an escaped match.
    merged = []
    for start, end in sorted(spans):
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    chunks = []
    offset = 0
    for start, end in merged:
        chunks.extend((text[offset:start], "[redacted]"))
        offset = end
    chunks.append(text[offset:])
    return "".join(chunks)
