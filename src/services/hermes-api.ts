import { probeChatGateway } from "./chat-gateway";
import type {
  Capabilities,
  Message,
  Session,
  SessionPage,
  Attachment,
  ModelOption,
  ModelInventory,
  Project,
  ProjectTree,
  ProjectAction,
  ScheduledJob,
  ScheduledRunPage,
  ScheduledOutput,
} from "../types/hermes";
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
const nativeProfiles = new Set<string>();
const workspaceSessions = new Set<string>();
const workspaceKey = (profile: string, id: string) => JSON.stringify([profile, id]);
const ROOT = "/api/plugins/chathermes";
function endpoint(profile: string, path: string): string {
  if (profile && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(profile))
    throw new Error("Invalid profile name");
  if (
    !/^\/(?:project-instructions\?project_id=[^&]*(?:&[^#]*)?|chat\/sessions|scheduled(?:\/(?:runs|output)\?[^#]*)?|projects(?:\/(?:manage|detail\?project_id=[^&]*(?:&[^#]*)?|session\?project_id=[^&]*(?:&[^#]*)?|[A-Za-z0-9_-]+(?:\/sessions)?))?|workspace\/sessions\/[A-Za-z0-9_-]+\/messages|api\/model\/options|api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*)?|v1\/(?:capabilities|models))$/.test(
      path,
    )
  )
    throw new Error("Invalid Hermes API path.");
  return (
    ROOT +
    path +
    (profile ? `${path.includes("?") ? "&" : "?"}profile=${encodeURIComponent(profile)}` : "")
  );
}
async function directFetch(
  profile: string,
  path: string,
  options: RequestInit = {},
  accept = "application/json",
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("accept", accept);
  if (options.body) headers.set("content-type", "application/json");
  const response = await fetch(endpoint(profile, path), {
    ...options,
    headers,
    credentials: "same-origin",
    redirect: "manual",
    cache: "no-store",
  });
  if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400))
    throw new Error("Hermes redirected the request. Sign in to the dashboard and retry.");
  return response;
}
async function request<T>(profile: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await directFetch(profile, path, options);
  if (!response.ok) throw new ApiError(response.status, `Request failed (${response.status})`);
  return response.json() as Promise<T>;
}
function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}
function session(value: unknown): Session {
  const row = record(value);
  if (typeof row?.id !== "string" || !row.id) throw new Error("Invalid Hermes session response");
  return row as unknown as Session;
}
function unwrapSession(value: unknown): Session {
  const row = record(value);
  return session(row?.session ?? value);
}
function sessionsPage(value: unknown): SessionPage {
  const row = record(value);
  const entries = Array.isArray(value) ? value : (row?.data ?? row?.sessions);
  if (!Array.isArray(entries)) throw new Error("Invalid Hermes sessions response");
  return {
    sessions: entries.map(session),
    limit: typeof row?.limit === "number" ? row.limit : undefined,
    offset: typeof row?.offset === "number" ? row.offset : undefined,
    has_more: typeof row?.has_more === "boolean" ? row.has_more : undefined,
    total: typeof row?.total === "number" ? row.total : undefined,
  };
}
function messagePage(value: unknown): {
  messages: Message[];
  pagination?: { returned: number; limit: number };
} {
  const row = record(value);
  const entries = Array.isArray(value) ? value : (row?.data ?? row?.messages);
  if (
    !Array.isArray(entries) ||
    entries.some((item) => !record(item) || typeof item.role !== "string")
  )
    throw new Error("Invalid Hermes messages response");
  const pagination = record(row?.pagination);
  return {
    messages: (entries as Message[]).map((row) =>
      row.role === "user" && ["model_switch", "personality_switch"].includes(row.display_kind || "")
        ? { ...row, role: "system" }
        : row,
    ),
    pagination:
      typeof pagination?.returned === "number" && typeof pagination.limit === "number"
        ? { returned: pagination.returned, limit: pagination.limit }
        : undefined,
  };
}
export const api = {
  // Explicit inspection only. No silent switch or mutation retry after admission.
  nativeChatCapabilities: probeChatGateway,
  isNative: (profile: string) => nativeProfiles.has(profile),
  profiles: async () => {
    const response = await fetch(ROOT + "/profiles", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) throw new ApiError(response.status, "Could not load profiles");
    return response.json() as Promise<{ profiles: { name: string }[] }>;
  },
  scheduled: (profile: string, signal?: AbortSignal) =>
    request<{ jobs: ScheduledJob[] }>(profile, "/scheduled", { signal }),
  scheduledRuns: (profile: string, job: string, offset = 0, signal?: AbortSignal) =>
    request<ScheduledRunPage>(
      profile,
      `/scheduled/runs?job_id=${encodeURIComponent(job)}&offset=${offset}`,
      { signal },
    ),
  scheduledOutput: (profile: string, job: string, run: string, signal?: AbortSignal) =>
    request<ScheduledOutput>(
      profile,
      `/scheduled/output?job_id=${encodeURIComponent(job)}&run_id=${encodeURIComponent(run)}`,
      { signal },
    ),
  projects: (profile: string, signal?: AbortSignal) =>
    request<ProjectTree>(profile, "/projects", { signal }),
  project: async (profile: string, id: string, signal?: AbortSignal) => {
    const result = await request<{ project: Project }>(
      profile,
      `/projects/detail?project_id=${encodeURIComponent(id)}`,
      { signal },
    );
    if (result.project?.id !== id || typeof result.project.label !== "string")
      throw new Error("Invalid Hermes Project response");
    return result.project;
  },
  projectInstructions: (profile: string, id: string, signal?: AbortSignal) =>
    request<{ filename: string; content: string; revision: string | null }>(
      profile,
      `/project-instructions?project_id=${encodeURIComponent(id)}`,
      { signal },
    ),
  saveProjectInstructions: (
    profile: string,
    id: string,
    body: { filename: string; content: string; revision: string | null },
  ) =>
    request<{ filename: string; content: string; revision: string }>(
      profile,
      `/project-instructions?project_id=${encodeURIComponent(id)}`,
      { method: "PUT", body: JSON.stringify(body) },
    ),
  projectManage: (
    profile: string,
    action: ProjectAction,
    fields: Record<string, string | boolean>,
  ) =>
    request<{ project?: { id: string } }>(profile, "/projects/manage", {
      method: "POST",
      body: JSON.stringify({ action, ...fields }),
    }),
  isWorkspace(profile: string, id: string) {
    return workspaceSessions.has(workspaceKey(profile, id));
  },
  workspace(profile: string, id: string) {
    workspaceSessions.add(workspaceKey(profile, id));
  },
  projectCreate: async (profile: string, id: string) => {
    const made = unwrapSession(
      await request<unknown>(profile, `/projects/session?project_id=${encodeURIComponent(id)}`, {
        method: "POST",
        body: "{}",
      }),
    );
    workspaceSessions.add(workspaceKey(profile, made.id));
    return made;
  },
  projectEvents(profile: string, refresh: () => void) {
    const source = new EventSource(
      ROOT + "/project-events?profile=" + encodeURIComponent(profile || "default"),
      { withCredentials: true },
    );
    source.addEventListener("refresh", refresh);
    return () => source.close();
  },
  models: (profile: string) =>
    request<{ data: ModelOption[]; default_model?: string }>(profile, "/v1/models"),
  modelOptions: (profile: string) => request<ModelInventory>(profile, "/api/model/options"),
  async upload(profile: string, attachment: Attachment): Promise<{ path: string }> {
    const response = await fetch(
      ROOT + "/uploads" + (profile ? "?profile=" + encodeURIComponent(profile) : ""),
      {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(attachment),
      },
    );
    if (!response.ok) throw new ApiError(response.status, `Upload failed (${response.status})`);
    return response.json();
  },
  capabilities: async (profile: string, signal?: AbortSignal) => {
    const result = await request<Capabilities>(profile, "/v1/capabilities", { signal });
    if (result.features?.native_chat === true) nativeProfiles.add(profile);
    else nativeProfiles.delete(profile);
    return result;
  },
  sessions: async (profile: string, offset = 0, signal?: AbortSignal) =>
    sessionsPage(
      await request<unknown>(profile, `/api/sessions?limit=30&offset=${offset}`, { signal }),
    ),
  create: async (profile: string, signal?: AbortSignal) => {
    const made = unwrapSession(
      await request<unknown>(profile, "/chat/sessions", { method: "POST", body: "{}", signal }),
    );
    workspaceSessions.add(workspaceKey(profile, made.id));
    return made;
  },
  session: async (profile: string, id: string, signal?: AbortSignal) => {
    const row = unwrapSession(
      await request<unknown>(profile, `/api/sessions/${encodeURIComponent(id)}`, { signal }),
    );
    if (row.cwd || row.source === "desktop") workspaceSessions.add(workspaceKey(profile, id));
    return row;
  },
  rename: async (profile: string, id: string, title: string, signal?: AbortSignal) =>
    unwrapSession(
      await request<unknown>(profile, `/api/sessions/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
        signal,
      }),
    ),
  async messages(profile: string, id: string, signal?: AbortSignal): Promise<Message[]> {
    const messages: Message[] = [];
    for (let offset = 0; ;) {
      let page: ReturnType<typeof messagePage>;
      try {
        page = messagePage(
          await request<unknown>(
            profile,
            `/api/sessions/${encodeURIComponent(id)}/messages?limit=500&offset=${offset}&order=oldest&inline_images=false`,
            { signal },
          ),
        );
      } catch (cause) {
        // Empty gateway drafts have no durable REST row yet. Persisted chats
        // keep the existing paginated history, including full tool outputs.
        if (
          offset === 0 &&
          cause instanceof ApiError &&
          cause.status === 404 &&
          workspaceSessions.has(workspaceKey(profile, id))
        )
          return messagePage(
            await request<unknown>(
              profile,
              `/workspace/sessions/${encodeURIComponent(id)}/messages`,
              { signal },
            ),
          ).messages;
        throw cause;
      }
      messages.push(...page.messages);
      if (
        !page.pagination ||
        page.pagination.returned < page.pagination.limit ||
        !page.messages.length
      )
        return messages;
      offset += page.messages.length;
    }
  },
};
export function messageText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content))
    return content
      .map((part) =>
        typeof part === "string"
          ? part
          : part && typeof part === "object" && "text" in part && typeof part.text === "string"
            ? part.text
            : "",
      )
      .filter(Boolean)
      .join("\n");
  return "";
}
