import MarkdownIt from "markdown-it";
import { historyBlocks } from "../chat/runtime/assistant-turn";
import { api, messageText } from "../../services/hermes-api";
import type { Message, Session, TurnBlock } from "../../types/hermes";

export interface Artifact {
  path: string;
  name: string;
  type: string;
  size?: number;
  imageData?: string;
  direction?: "uploaded" | "generated";
  sessionId?: string;
  sessionTitle?: string;
  projectId?: string;
  projectTitle?: string;
  messageId?: string;
  createdAt?: string;
}
const mime: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  html: "text/html",
  htm: "text/html",
};
const textExtensions = new Set(
  "txt md csv json xml yaml yml py js ts tsx jsx css sh sql toml rs go java c cpp h html htm svg".split(
    " ",
  ),
);
// This is the MEDIA grammar from Desktop's chat-messages/parts.ts. Its broader
// extension list only anchors spaced MEDIA paths; it does not select artifacts.
const mediaExtensions =
  "png jpg jpeg gif webp bmp tiff svg mp4 mov avi mkv webm 3gp mp3 m2a wav ogg opus m4a flac pdf docx doc odt rtf txt md epub xlsx xls ods csv tsv json xml yaml yml kmz kml geojson gpx pptx ppt odp key zip tar gz tgz bz2 xz 7z rar apk ipa html htm"
    .split(" ")
    .sort((a, b) => b.length - a.length)
    .join("|");
const mediaAnchored = `(?:~/|/|[A-Za-z]:[/\\\\])\\S+?(?:[^\\S\\n]+\\S+?)*?\\.(?:${mediaExtensions})(?=[\\s\`"'*_,;:)\\]}]|MEDIA:|$)`;
const mediaBare = '[^\\s`"]+';
const mediaTag = new RegExp(
  `MEDIA:\\s*(\`[^\`\n]+\`|"[^"\n]+"|'[^'\n]+'|${mediaAnchored}|${mediaBare})`,
  "g",
);
function mediaValue(value: string) {
  value = value.trim();
  const quote = value[0];
  if (quote && quote === value.at(-1) && ['"', "'", "`"].includes(quote))
    value = value.slice(1, -1);
  else {
    value = value.replace(/[`"]$/, "");
    while (/[.,;:!?]$/.test(value) && /[/\\]|\.[^.]/.test(value.slice(0, -1)))
      value = value.slice(0, -1);
    value = value.replace(/[`"'*_]{1,3}$/, "");
  }
  return /[/\\]|\.[^.]/.test(value) ? value : "";
}
// Delivery directives must occupy a whole line. Validate before collecting so a
// trailing example/explanation cannot partially assert delivery.
function collectMedia(text: string, add: (path: string) => boolean) {
  const paths: string[] = [];
  let end = 0;
  for (const match of text.matchAll(mediaTag)) {
    if (text.slice(end, match.index).trim()) return text;
    const path = mediaValue(match[1]!);
    if (!/^(?:file:|\/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?:\/\/|data:image\/)/i.test(path))
      return text;
    paths.push(path);
    end = match.index + match[0].length;
  }
  if (!paths.length || text.slice(end).trim()) return text;
  return paths.every((path) => !!artifact(path)) && paths.every(add) ? "" : text;
}
export function extension(name: string) {
  return name.split(".").at(-1)?.toLowerCase() || "";
}
export function artifact(path: string, name?: string): Artifact | undefined {
  try {
    if (path.startsWith("#media:")) path = decodeURIComponent(path.slice(7));
    if (path.startsWith("sandbox:")) path = path.slice(8);
    if (path.startsWith("file:")) path = decodeURIComponent(new URL(path).pathname);
  } catch {
    return;
  }
  if (!/^(\/|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\|data:image\/|https?:\/\/)/.test(path)) return;
  const pathName = path.split(/[\\/]/).at(-1)?.split(/[?#]/)[0] || "";
  name = (name && /\.[a-z0-9]{1,12}$/i.test(name) ? name : pathName) || name || "Attached image";
  const ext = extension(name);
  return {
    path,
    name,
    type: mime[ext] || (textExtensions.has(ext) ? "text/plain" : "application/octet-stream"),
  };
}
export function previewKind(
  file: Artifact,
): "image" | "pdf" | "audio" | "video" | "text" | undefined {
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") return "image";
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  if (textExtensions.has(extension(file.name))) return "text";
}
export function fileUrl(file: Artifact, profile = "", download = false): string {
  if (/^(https?:\/\/|data:image\/)/.test(file.path)) return file.path;
  const nativeImage = file.path.match(
    /^\/api\/plugins\/chathermes\/images\/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))$/i,
  );
  if (nativeImage) {
    const query = new URLSearchParams();
    if (profile) query.set("profile", profile);
    return `${file.path}${query.size ? `?${query}` : ""}`;
  }
  const query = new URLSearchParams({ path: file.path, profile: profile || "default" });
  if (file.sessionId) query.set("session_id", file.sessionId);
  if (download) query.set("name", file.name);
  return `/api/plugins/chathermes/files/${download ? "download" : "preview"}?${query}`;
}
// Block tokens keep backtick/tilde fences (including incomplete fences),
// indented code, blockquotes and lists out of the delivery channel.
const deliveryMarkdown = new MarkdownIt({ html: true });
export function textArtifacts(text: string): { text: string; files: Artifact[] } {
  const files: Artifact[] = [];
  const add = (path: string, name?: string) => {
    const file = artifact(path, name);
    if (!file) return false;
    if (!files.some((item) => item.path === file.path)) files.push(file);
    return true;
  };
  const originalLines = text.split("\n");
  const lines = [...originalLines];
  let hasAttachment = false;
  const references: number[] = [];
  const tokens = deliveryMarkdown.parse(text, {});
  const literalLines = new Set<number>();
  for (const token of tokens) {
    if (!token.map) continue;
    if (
      ["fence", "code_block", "blockquote_open", "bullet_list_open", "ordered_list_open"].includes(
        token.type,
      ) ||
      token.children?.some(
        (child) => child.type === "code_inline" && /untrusted_tool_result/i.test(child.content),
      )
    )
      for (let index = token.map[0]; index < token.map[1]; index++) literalLines.add(index);
  }
  const untrustedLines = new Set<number>();
  let untrustedDepth = 0;
  for (const [index, line] of originalLines.entries()) {
    if (untrustedDepth) untrustedLines.add(index);
    if (literalLines.has(index) || !/^\s*<\/?untrusted_tool_result\b/i.test(line)) continue;
    for (const tag of line.matchAll(/<(\/?)untrusted_tool_result\b[^>]*(?:>|$)/gi)) {
      untrustedLines.add(index);
      untrustedDepth = tag[1] ? Math.max(0, untrustedDepth - 1) : untrustedDepth + 1;
    }
  }
  for (const [position, token] of tokens.entries()) {
    if (token.type !== "paragraph_open" || token.level !== 0 || !token.map) continue;
    // Inline code can span lines; its body still belongs to the quotation.
    if (
      tokens[position + 1]?.children?.some(
        (child) =>
          child.type === "code_inline" && /MEDIA:|Attached (?:image|file) /.test(child.content),
      )
    )
      continue;
    for (let index = token.map[0]; index < token.map[1]; index++) {
      if (untrustedLines.has(index)) continue;
      const line = lines[index]!;
      const attachment = line.match(/^Attached (?:image|file) ([^\n]+?): ([^\n]+?)\r?$/);
      if (attachment && add(attachment[2]!.trim(), attachment[1])) {
        hasAttachment = true;
        lines[index] = "";
      } else if (/^@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)\r?$/.test(line)) {
        references.push(index);
      } else if (line.startsWith("MEDIA:")) lines[index] = collectMedia(line, add);
    }
  }
  if (hasAttachment) for (const index of references) lines[index] = "";
  return {
    text: files.length
      ? lines
          .filter((line, index) => line !== "" || originalLines[index] === "")
          .join("\n")
          .trim()
      : text,
    files,
  };
}
export function toolArtifacts(block: TurnBlock): Artifact[] {
  if (block.kind !== "tool" || !block.complete || block.state === "failed") return [];
  // Tool bodies are data: read_file.content, terminal.output/stdout, arguments,
  // MCP result text and untrusted wrappers cannot establish delivery. Hermes TTS
  // uses a top-level media_tag; retain explicit multimodal meta.media_tag too.
  // Never recursively search for those keys or unwrap untrusted result text.
  let result: unknown;
  try {
    result = JSON.parse(block.output || "");
  } catch {
    return [];
  }
  if (!result || typeof result !== "object" || Array.isArray(result)) return [];
  const row = result as Record<string, unknown>;
  if (
    row.is_error ||
    row.error ||
    row.success === false ||
    (typeof row.exit_code === "number" && row.exit_code !== 0)
  )
    return [];
  const metadata =
    row._multimodal === true && row.meta && typeof row.meta === "object" && !Array.isArray(row.meta)
      ? (row.meta as Record<string, unknown>)
      : row;
  if (typeof metadata.media_tag !== "string") return [];
  const directives = metadata.media_tag.replace(/^\[\[audio_as_voice\]\]\r?\n/, "");
  if (directives.split("\n").some((line) => line && !line.startsWith("MEDIA:"))) return [];
  const delivery = textArtifacts(directives);
  if (delivery.text.trim()) return [];
  return delivery.files.map((file) => {
    const type = metadata.mime_type || metadata.mime;
    if (typeof type === "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(type)) file.type = type;
    const size = metadata.size ?? metadata.bytes;
    if (typeof size === "number" && Number.isSafeInteger(size) && size >= 0) file.size = size;
    return file;
  });
}
export function uploadedArtifacts(text: string): { text: string; files: Artifact[] } {
  const files: Artifact[] = [];
  const clean = text
    .replace(/^Attached (?:image|file) ([^\n]+?): ([^\n]+)(?:\n|$)/gm, (all, name, path) => {
      const file = artifact(path.trim(), name);
      if (!file) return all;
      files.push(file);
      return "";
    })
    .replace(/(?:^|\n)@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)(?=\n|$)/g, (all) =>
      files.length ? "" : all,
    );
  return { text: clean.trim(), files };
}
export function messageArtifacts(message: Message): Artifact[] {
  if (message.role !== "user" && message.role !== "assistant") return [];
  const { content } = message;
  const files = (message.role === "user" ? uploadedArtifacts : textArtifacts)(
    messageText(content),
  ).files;
  const uploadedImages = files.filter((file) => previewKind(file) === "image");
  if (Array.isArray(content)) {
    let imageIndex = 0;
    for (const part of content) {
      const url = part?.image_url?.url;
      if (typeof url !== "string" || !/^(data:image\/|https?:\/\/)/.test(url)) continue;
      if (uploadedImages.length) {
        const file = uploadedImages[imageIndex++];
        if (file) file.imageData = url;
      } else {
        const file = artifact(url, "Attached image.png");
        if (file) files.push(file);
      }
    }
  } else if (message.role === "user" && uploadedImages.length) {
    // SessionDB's REST history omits inline image content parts; the durable
    // upload annotation maps each image to its authenticated image URL.
    for (const file of uploadedImages) {
      const match = file.path.match(
        /\/uploads\/chathermes\/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))$/i,
      );
      if (match) file.path = `/api/plugins/chathermes/images/${match[1]}`;
    }
  }
  return files.map((file) => ({
    ...file,
    messageId: message.id,
    createdAt: message.created_at,
    direction: message.role === "user" ? "uploaded" : "generated",
  }));
}
export async function loadArtifacts(
  profile: string,
  sessions: Session[],
  signal: AbortSignal,
): Promise<{ files: Artifact[]; failures: number }> {
  const files: Artifact[] = [];
  let failures = 0;
  for (const session of sessions) {
    if (signal.aborted) break;
    try {
      const messages = await api.messages(profile, session.id, signal);
      for (const message of messages)
        files.push(
          ...messageArtifacts(message).map((file) => ({
            ...file,
            sessionId: session.id,
            sessionTitle: session.title || "Untitled session",
          })),
        );
      for (const block of historyBlocks(messages))
        files.push(
          ...toolArtifacts(block).map((file) => ({
            ...file,
            direction: "generated" as const,
            sessionId: session.id,
            sessionTitle: session.title || "Untitled session",
            messageId: block.id,
            createdAt: session.updated_at || session.created_at,
          })),
        );
    } catch {
      if (!signal.aborted) failures++;
    }
  }
  return {
    files: files
      .filter(
        (file, index) =>
          files.findIndex(
            (item) => item.sessionId === file.sessionId && item.path === file.path,
          ) === index,
      )
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    failures,
  };
}
