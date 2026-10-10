import type { Attachment } from "../../types/hermes";
export interface Artifact {
  id: string;
  session_id: string;
  name: string;
  mime: string;
  size: number | null;
  direction: "uploaded" | "generated";
  created_at: number;
  message_id?: string;
  tool_call_id?: string;
  project_id?: string;
  project_name?: string;
  session_title?: string;
  reference: string;
  ref_text: string;
  can_delete?: boolean;
}
const root = "/api/plugins/chathermes";
function url(profile: string, path: string, params: Record<string, string> = {}) {
  if (profile && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(profile)) throw new Error("Invalid profile");
  const query = new URLSearchParams({ ...params, ...(profile ? { profile } : {}) });
  return root + path + (query.size ? "?" + query : "");
}
async function request<T>(
  profile: string,
  path: string,
  params: Record<string, string> = {},
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url(profile, path, params), {
    credentials: "same-origin",
    cache: "no-store",
    redirect: "error",
    ...options,
  });
  if (!response.ok)
    throw new Error(
      response.status === 501
        ? "This Hermes backend does not support file deletion."
        : "Hermes could not complete the file operation. Your draft is kept.",
    );
  return response.json();
}
export const artifacts = {
  list: (profile: string, params: Record<string, string> = {}, signal?: AbortSignal) =>
    request<{ artifacts: Artifact[]; has_more: boolean; next_offset: number }>(
      profile,
      "/artifacts",
      params,
      { signal },
    ),
  stage: (profile: string, session: string, file: Attachment) =>
    request<Artifact>(
      profile,
      `/chat/sessions/${encodeURIComponent(session)}/attachments`,
      {},
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
          data: file.data,
        }),
      },
    ),
  remove: (profile: string, id: string) =>
    request(profile, "/artifacts/" + encodeURIComponent(id), {}, { method: "DELETE" }),
  content: (profile: string, id: string, preview = false) =>
    url(
      profile,
      "/artifacts/" + encodeURIComponent(id) + "/content",
      preview ? { preview: "1" } : {},
    ),
};
export function previewable(mime: string) {
  return /^(image\/(png|jpeg|gif|webp|bmp)|application\/pdf|text\/plain|audio\/[^;]+|video\/[^;]+)$/.test(
    mime,
  );
}
export function imagePreviewable(mime: string) {
  return /^image\/(png|jpeg|gif|webp|bmp)$/.test(mime.split(";")[0]!.trim().toLowerCase());
}
export function fileSize(size: number | null | undefined) {
  if (size == null) return "";
  return size < 1024
    ? `${size} B`
    : size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
export async function readAttachment(
  file: File,
  progress: (state: string) => void,
): Promise<Attachment> {
  if (!file.size || file.size > 20 * 1024 * 1024)
    throw new Error("Each file must contain 1 byte to 20 MB.");
  progress("Reading…");
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable)
        progress(`Reading ${Math.round((event.loaded / event.total) * 100)}%`);
    };
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Could not read this file. Try again."));
    reader.onabort = () => reject(new Error("File reading was cancelled. Try again."));
    reader.readAsDataURL(file);
  });
  return { name: file.name, type: file.type || "application/octet-stream", size: file.size, data };
}
// Match transfer syntax, never a plain mention of an already indexed path.
export function hasReference(content: unknown, artifact: Artifact): boolean {
  const uploaded = artifact.direction === "uploaded";
  const matches = (value: string) => {
    const pattern = uploaded
      ? /^Attached (?:image|file) [^\r\n]+: ([^\r\n]+)$/gm
      : /(?<![\w])MEDIA:[ \t]*(?:`([^`\r\n]+)`|"([^"\r\n]+)"|'([^'\r\n]+)'|([^\s`"']+))/g;
    return [...value.matchAll(pattern)].some((match) => {
      const reference = match
        .slice(1)
        .find((part) => part !== undefined)
        ?.trim();
      return (
        reference === artifact.reference || (!!artifact.ref_text && reference === artifact.ref_text)
      );
    });
  };
  if (typeof content === "string") {
    if (matches(content)) return true;
    try {
      const parsed: unknown = JSON.parse(content);
      return typeof parsed === "object" && parsed !== null && hasReference(parsed, artifact);
    } catch {
      return false;
    }
  }
  if (Array.isArray(content)) return content.some((part) => hasReference(part, artifact));
  if (!content || typeof content !== "object") return false;
  const part = content as Record<string, unknown>;
  if (uploaded && part.type === "attachment") return part.id === artifact.id;
  if (uploaded && part.type === "image_url") {
    const image = part.image_url;
    return (
      (typeof image === "object" && image !== null
        ? (image as Record<string, unknown>).url
        : image) === artifact.reference
    );
  }
  return Object.entries(part).some(
    ([key, value]) => key !== "image_url" && hasReference(value, artifact),
  );
}
export function cleanFileText(text: string, files: Artifact[] = []) {
  return text
    .replace(/^Attached (?:image|file) [^\r\n]+: [^\r\n]+\n?/gm, (marker) =>
      files.some((file) => file.direction === "uploaded" && hasReference(marker.trim(), file))
        ? ""
        : marker,
    )
    .replace(/@file:(?:`[^`]+`|"[^"]+"|'[^']+'|\S+)/g, (marker) =>
      files.some((file) => file.direction === "uploaded" && file.ref_text === marker) ? "" : marker,
    )
    .replace(/(?<![\w])MEDIA:[ \t]*(?:`[^`\r\n]+`|"[^"\r\n]+"|'[^'\r\n]+'|[^\s`"']+)/g, (marker) =>
      files.some((file) => file.direction === "generated" && hasReference(marker, file))
        ? ""
        : marker,
    )
    .trim();
}
export async function sessionArtifacts(profile: string, session: string, signal?: AbortSignal) {
  return (await artifacts.list(profile, { session_id: session }, signal)).artifacts;
}
