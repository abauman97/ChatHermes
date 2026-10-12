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
  `[\`"']?MEDIA:\\s*(\`[^\`\n]+\`|"[^"\n]+"|'[^'\n]+'|${mediaAnchored}|${mediaBare})[\`"']?`,
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
function collectMedia(text: string, add: (path: string) => boolean) {
  return text.replace(mediaTag, (all, value) => {
    const path = mediaValue(value);
    // Preserve the existing MEDIA path grammar; native uploads use artifact() directly.
    if (!/^(?:file:|\/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?:\/\/|data:image\/)/i.test(path))
      return all;
    return add(path) ? "" : all;
  });
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
  const query = new URLSearchParams({ path: file.path, profile: profile || "default" });
  if (file.sessionId) query.set("session_id", file.sessionId);
  if (download) query.set("name", file.name);
  return `/api/plugins/chathermes/files/${download ? "download" : "preview"}?${query}`;
}
// ChatHermes keeps fenced source code intact and native upload annotations.
// Generated references require explicit MEDIA delivery or attachment annotations.
export function textArtifacts(text: string): { text: string; files: Artifact[] } {
  const files: Artifact[] = [];
  const add = (path: string) => {
    const file = artifact(path);
    if (!file) return false;
    if (!files.some((item) => item.path === file.path)) files.push(file);
    return true;
  };
  const clean = text
    .split(/(```[\s\S]*?(?:```|$))/g)
    .map((part, index) => {
      if (index % 2) return part;
      part = part.replace(/(?:^|\n)@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)(?=\n|$)/g, (all) =>
        /Attached file [^\n]+: /.test(text) ? "" : all,
      );
      part = part.replace(
        /Attached (?:image|file) ([^\n]+?): ([^\n]+)(?:\n|$)/g,
        (all, name, path) => {
          const file = artifact(path.trim(), name);
          if (!file) return all;
          if (!files.some((item) => item.path === file.path)) files.push(file);
          return "";
        },
      );
      return collectMedia(part, add);
    })
    .join("");
  return { text: clean.trim(), files };
}
function untrustedToolPayload(text: string) {
  const trimmed = text.trim();
  const open = trimmed.match(/^<untrusted_tool_result\b[^>]*>\s*/);
  if (!open) return;
  const close = trimmed.lastIndexOf("</untrusted_tool_result>");
  if (close <= open[0].length) return;
  const wrapped = trimmed.slice(open[0].length, close).trim();
  const start = wrapped.indexOf("\n\n");
  return (start === -1 ? wrapped : wrapped.slice(start + 2)).trim();
}
export function toolArtifacts(block: TurnBlock): Artifact[] {
  if (block.kind !== "tool" || !block.complete || block.state === "failed") return [];
  const files: Artifact[] = [];
  const collect = (value: unknown, metadata?: Record<string, unknown>) => {
    if (Array.isArray(value)) {
      value.forEach((item) => collect(item));
    } else if (value && typeof value === "object") {
      const row = value as Record<string, unknown>;
      Object.values(row).forEach((child) => collect(child, row));
    } else if (typeof value === "string") {
      for (const file of textArtifacts(value).files) {
        const type = metadata?.mime_type || metadata?.mime;
        if (typeof type === "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(type))
          file.type = type;
        const size = metadata?.size ?? metadata?.bytes;
        if (typeof size === "number" && Number.isSafeInteger(size) && size >= 0) file.size = size;
        if (!files.some((item) => item.path === file.path)) files.push(file);
      }
    }
  };
  // Decode structured output before scanning explicit delivery strings, so JSON
  // escapes cannot become part of a path. Tool inputs never assert delivery.
  const output = block.output && (untrustedToolPayload(block.output) ?? block.output);
  if (output) {
    try {
      collect(JSON.parse(output));
    } catch {
      collect(output);
    }
  }
  return files;
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
  const files = (message.role === "user" ? uploadedArtifacts : textArtifacts)(
    messageText(message.content),
  ).files;
  const hasImageReferences = files.some((file) => previewKind(file) === "image");
  if (Array.isArray(message.content)) {
    let imageIndex = 0;
    for (const part of message.content) {
      const url = part?.image_url?.url;
      if (typeof url !== "string" || !/^(data:image\/|https?:\/\/)/.test(url)) continue;
      if (hasImageReferences) {
        const file = files.filter((file) => previewKind(file) === "image")[imageIndex++];
        if (file) file.imageData = url;
      } else {
        const file = artifact(url, "Attached image.png");
        if (file) files.push(file);
      }
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
