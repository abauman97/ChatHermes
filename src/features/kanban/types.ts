// UI slice reviewed against Hermes bf0203a and Desktop's Kanban types.ts.
export interface Task {
  id: string;
  title: string;
  body?: string | null;
  status: string;
  assignee?: string | null;
  priority?: number;
  latest_summary?: string | null;
  result?: string | null;
  comment_count?: number;
  progress?: { done: number; total: number } | null;
  warnings?: { count: number } | null;
  block_kind?: string | null;
  worker_pid?: number | null;
  last_heartbeat_at?: number | null;
  model_override?: string | null;
  provider_override?: string | null;
  reasoning_effort?: string | null;
}
export interface BoardMeta {
  slug: string;
  name?: string | null;
  description?: string | null;
  default_workdir?: string | null;
  project_id?: string | null;
}
export interface Boards {
  boards: BoardMeta[];
  current: string;
}
export interface Board {
  columns: { name: string; tasks: Task[] }[];
  assignees: string[];
  latest_event_id: number;
}
export interface Workflow {
  columns: { key: string; label: string; drag_target: boolean }[];
  manual: Record<string, string[]>;
  archived: string;
}
export interface Detail {
  task: Task;
  comments: { id: number | string; author: string; body: string; created_at: number }[];
  events: { id: number; kind: string; created_at: number }[];
  runs: {
    id: number | string;
    status: string;
    outcome?: string | null;
    summary?: string | null;
    error?: string | null;
    profile?: string | null;
  }[];
  links: { parents: string[]; children: string[] };
  link_tasks?: { id: string; title: string; status: string }[] | null;
  attachments?: { id: number | string; filename: string; size?: number | null }[] | null;
}
export interface WorkerLog {
  exists: boolean;
  content: string;
  truncated: boolean;
}
