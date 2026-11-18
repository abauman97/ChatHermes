// Keep these presentation rules aligned with the pinned Desktop hydration.ts.
// They intentionally truncate authored marker examples, including fenced ones.
const attachedContextMarker = /(?:^|\n)--- Attached Context ---\s*\n/;
const contextWarningsMarker = /(?:^|\n)--- Context Warnings ---[\s\S]*$/;
const contextRef = /@(file|folder|url|image|tool|terminal):(?:"[^"\n]+"|'[^'\n]+'|`[^`\n]+`|\S+)/g;

/** User-message presentation only. Recovered refs are text, never file authority.
 * The prefix is exposed separately so expanded bodies cannot supply upload cards.
 * Submission, model context and persisted messages retain their original content. */
export function attachedContextProjection(text: string): {
  text: string;
  prefix: string;
  refs: string[];
} {
  const marker = text.match(attachedContextMarker);
  const prefix = (marker ? text.slice(0, marker.index) : text).replace(contextWarningsMarker, "");
  const visible = prefix.trim();
  if (!marker) return { text: visible, prefix, refs: [] };
  const attached = text.slice(marker.index! + marker[0].length);
  const refs = [...new Set(Array.from(attached.matchAll(contextRef), (match) => match[0]))];
  const missing = refs.filter((ref) => !visible.includes(ref));
  return {
    text: [missing.join("\n"), visible].filter(Boolean).join("\n\n") || visible,
    prefix,
    refs: missing,
  };
}
