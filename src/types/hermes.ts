export interface Session {
  id: string;
  title?: string | null;
  preview?: string | null;
  source?: string | null;
  created_at?: string;
  updated_at?: string;
  cwd?: string | null;
  workspace_rpc?: boolean;
  profile?: string | null;
  last_active?: number;
}
export interface SessionPage {
  sessions: Session[];
  total?: number;
  limit?: number;
  offset?: number;
  has_more?: boolean;
}
export interface Message {
  display_kind?: string;
  id?: string;
  role: string;
  content: unknown;
  created_at?: string;
  tool_name?: string;
  tool_call_id?: string;
  reasoning?: string;
  reasoning_content?: string;
  tool_calls?: { id?: string; function?: { name?: string; arguments?: string } }[];
  blocks?: TurnBlock[];
}
export interface Capabilities {
  features?: Record<string, unknown>;
  endpoints?: Record<string, { method?: string; path?: string }>;
}

export interface Attachment {
  name: string;
  type: string;
  data: string;
  size: number;
}
export interface Activity {
  id: string;
  title: string;
  content: string;
  output?: string;
  complete: boolean;
  kind: "thinking" | "tool";
  state?: "pending" | "running" | "completed" | "failed";
  toolName?: string;
  startedAt?: number;
  duration?: number;
  delegated?: boolean;
}
export interface ModelOption {
  id: string;
  root?: string;
  parent?: string | null;
}

export interface ProviderOption {
  slug: string;
  name: string;
  is_current?: boolean;
  models: string[];
}
export interface ModelInventory {
  providers: ProviderOption[];
  provider: string;
  model: string;
}

// Subset of the pinned Hermes generated gateway contract. Preserve the hierarchy;
// flatten only at the rendering boundary, never infer membership from cwd.
export interface ProjectLane {
  id: string;
  label: string;
  path?: string | null;
  isMain?: boolean;
  isKanban?: boolean;
  sessions: Session[];
}
export interface ProjectRepo {
  id: string;
  label: string;
  path?: string | null;
  groups: ProjectLane[];
  sessionCount?: number;
}
export interface ProjectFolder {
  path: string;
  label?: string | null;
  is_primary: boolean;
}
export type ProjectAction =
  | "create"
  | "update"
  | "add_folder"
  | "remove_folder"
  | "set_primary"
  | "archive"
  | "delete";
export interface Project {
  archived?: boolean;
  folders?: ProjectFolder[];
  description?: string | null;
  board_slug?: string | null;
  id: string;
  label: string;
  path?: string | null;
  color?: string | null;
  icon?: string | null;
  isAuto?: boolean;
  isNoProject?: boolean;
  sessionCount: number;
  repos: ProjectRepo[];
  previewSessions?: Session[];
  sessionIds?: string[];
}
export interface ProjectTree {
  projects: Project[];
  scoped_session_ids: string[];
  active_id?: string | null;
}

export type TurnBlock = Activity | { id: string; kind: "text"; content: string; images?: string[] };

export interface ScheduledJob {
  id: string;
  name: string;
  prompt?: string;
  schedule_display?: string;
  state?: string;
  enabled?: boolean;
  last_run_at?: string;
  next_run_at?: string;
}
export interface ScheduledRun {
  id: string;
  title?: string;
  started_at: number;
  ended_at?: number;
  source: string;
  preview?: string;
  end_reason?: string;
}
export interface ScheduledRunPage {
  runs: ScheduledRun[];
  offset: number;
  limit: number;
  has_more: boolean;
}
export interface ScheduledOutput {
  started_at?: number;
  output?: string;
  messages: Message[];
  session_id?: string;
}
