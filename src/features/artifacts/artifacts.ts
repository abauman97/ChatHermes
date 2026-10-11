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
// Match the pinned Desktop artifact collector, rather than the broader set
// of formats that the viewer can display. MEDIA delivery bypasses this filter.
const artifactExtension =
  /\.(?:png|jpe?g|gif|webp|svg|bmp|pdf|txt|json|md|csv|xlsx?|docx?|pptx?|html|zip|tar|gz|avi|flac|m4a|mkv|mp3|ogg|opus|wav|webm|mp4|mov)(?:[?#].*)?$/i;
const producerTool =
  /(?:^|_)(?:creat(?:e|ion)|download|export|generat(?:e|ion)|render|save|speech|tts|write)(?:_|$)/i;
const strongToolKey =
  /^(?:artifact_(?:file|image|path|url)|files?_(?:created|modified|written)|generated_(?:file|image|path|url)|media_tag|output_(?:file|path|url)|result_(?:file|path|url)|saved_to|screenshot_path)$/i;
const producerToolKey =
  /^(?:artifact(?:s|_(?:file|image|path|url))?|attachment(?:s|_(?:file|image|path|url))?|download(?:s|_(?:file|path|url))?|(?:audio|image|video)(?:_(?:file|path|url))?|file_path|local_path|media(?:_(?:file|path|url))?|path)$/i;
function artifactCandidate(path: string, explicit = false, name?: string) {
  const file = artifact(path, name);
  if (!file || explicit) return file;
  let normalized = file.path.replace(/\\/g, "/").toLowerCase();
  if (/^(?:https?|file):\/\//i.test(file.path)) {
    try {
      normalized = decodeURIComponent(new URL(file.path).pathname).toLowerCase();
    } catch {
      return;
    }
  }
  // Desktop suppresses package-manager downloads unless explicitly delivered.
  if (
    /\/(?:\.cache\/pip|library\/caches\/pip|appdata\/local\/pip\/cache)\//.test(normalized) ||
    /\.whl(?:\.metadata)?$/.test(normalized) ||
    (/^https?:\/\//i.test(file.path) &&
      /\/packages\/.+\.(?:tar\.gz|tar\.bz2|zip|egg)(?:\.metadata)?$/.test(normalized))
  )
    return;
  if (/^(?:https?:\/\/|data:image\/)/.test(file.path) || artifactExtension.test(file.path))
    return file;
}
export function extension(name: string) {
  return name.split(".").at(-1)?.toLowerCase() || "";
}
export function artifact(path: string, name?: string): Artifact | undefined {
  try {
    if (path.startsWith("#media:")) path = decodeURIComponent(path.slice(7));
    if (path.startsWith("sandbox:")) path = path.slice(8);
    if (path.startsWith("file://")) path = decodeURIComponent(new URL(path).pathname);
  } catch {
    return;
  }
  if (!/^(\/|~\/|\.\.?\/|[A-Za-z]:[\\/]|\\\\|data:image\/|https?:\/\/)/.test(path)) return;
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
// Delivery references mirror Desktop: MEDIA, #media/file/sandbox links and
// generated output paths. Fences remain source code, never filesystem promises.
export function textArtifacts(text: string): { text: string; files: Artifact[] } {
  const files: Artifact[] = [];
  const add = (path: string, name?: string, explicit = false) => {
    const file = artifactCandidate(path, explicit, name);
    if (!file) return false;
    if (!files.some((item) => item.path === file.path)) files.push(file);
    return true;
  };
  const clean = text
    .split(/(```[\s\S]*?(?:```|$))/g)
    .map((part, index) => {
      if (index % 2) return part;
      return part
        .replace(/(?:^|\n)@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)(?=\n|$)/g, (all) =>
          /Attached file [^\n]+: /.test(text) ? "" : all,
        )
        .replace(/Attached (?:image|file) ([^\n]+?): ([^\n]+)(?:\n|$)/g, (all, name, path) =>
          add(path.trim(), name, true) ? "" : all,
        )
        .replace(/(!?)\[([^\]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g, (all, image, name, path) => {
          const serverFile =
            /^(?:#media:|sandbox:|file:\/\/|\/|~\/|\.\.?\/|[A-Za-z]:[\\/]|\\\\)/.test(path);
          const remoteFile = /^https?:\/\//.test(path) && (image || artifactExtension.test(path));
          if (serverFile || remoteFile) {
            const added = add(path, name || undefined);
            if (added && image && files.at(-1)?.type === "application/octet-stream")
              files.at(-1)!.type = "image/png";
            return added ? "" : all;
          }
          return all;
        })
        .replace(
          /(?:MEDIA:|@file:)\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^\s<>]+))/g,
          (all, quoted, single, path) =>
            add(quoted || single || path, undefined, true) ? "" : all,
        )
        .replace(
          /(^|[\s`(])((?:\/|~\/|\.\.?\/|[A-Za-z]:[\\/]|\\\\)[^\s`<>"')]+\.[a-z0-9]{1,12})(?=$|[\s`)!,;])/gi,
          (all, prefix, path) => (add(path) ? prefix : all),
        );
    })
    .join("");
  return { text: clean.trim(), files };
}
export function toolArtifacts(block: TurnBlock): Artifact[] {
  if (block.kind !== "tool" || !block.complete || block.state === "failed") return [];
  const files: Artifact[] = [];
  const name = (block.toolName || "").trim().toLowerCase();
  const producer = producerTool.test(name) || name.startsWith("bfl_flux3_");
  const terminal = name === "terminal";
  const add = (path: string, explicit = false, metadata?: Record<string, unknown>) => {
    const file = artifactCandidate(
      path,
      explicit,
      typeof metadata?.name === "string" ? metadata.name : undefined,
    );
    if (!file) return;
    const type = metadata?.mime_type || metadata?.mime;
    if (typeof type === "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(type)) file.type = type;
    const size = metadata?.size ?? metadata?.bytes;
    if (typeof size === "number" && Number.isSafeInteger(size) && size >= 0) file.size = size;
    files.push(file);
  };
  const scan = (text: string) => files.push(...textArtifacts(text).files);
  const push = (value: unknown, keys: string[] = [], metadata?: Record<string, unknown>) => {
    if (Array.isArray(value)) {
      value.forEach((item) => push(item, keys, metadata));
      return;
    }
    if (value && typeof value === "object") {
      const row = value as Record<string, unknown>;
      Object.entries(row).forEach(([key, child]) => push(child, [...keys, key], row));
      return;
    }
    if (typeof value !== "string") return;
    if (terminal && keys.some((key) => /^(?:output|stdout|path)$/i.test(key))) {
      scan(value);
      return;
    }
    if (!keys.some((key) => strongToolKey.test(key) || (producer && producerToolKey.test(key))))
      return;
    // Recognized output fields still require a deliverable extension, except
    // for explicit MEDIA/@file delivery tags. Ancestor keys cover nested arrays.
    for (const match of value.matchAll(
      /(?:MEDIA:|@file:)\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^\s<>]+))/g,
    ))
      add(match[1] || match[2] || match[3]!, true, metadata);
    add(value.trim().replace(/^['"`]|['"`]$/g, ""), false, metadata);
  };
  // content is the tool's input arguments, not its produced output.
  if (block.output) {
    try {
      push(JSON.parse(block.output));
    } catch {
      if (producer || terminal) scan(block.output);
    }
    if (name === "browser_vision")
      for (const match of block.output.matchAll(/Screenshot path:\s*([^\r\n<>]+)/gi))
        add(match[1]!.trim());
  }

  return files.filter(
    (file, index) => files.findIndex((item) => item.path === file.path) === index,
  );
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
