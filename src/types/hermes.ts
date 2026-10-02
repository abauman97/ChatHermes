export interface Session { id: string; title?: string | null; source?: string | null; created_at?: string; updated_at?: string; cwd?: string | null; workspace_rpc?: boolean; profile?: string | null; last_active?: number }
export interface SessionPage { sessions: Session[]; total?: number; limit?: number; offset?: number; has_more?: boolean }
export interface Message { id?: string; role: string; content: unknown; created_at?: string; tool_name?: string }
export interface Capabilities { features?: Record<string, unknown>; endpoints?: Record<string, { method?: string; path?: string }> }

export interface Attachment { name: string; type: string; data: string; size: number }
export interface Activity { id: string; title: string; content: string; output?: string; complete: boolean; kind: 'thinking' | 'tool' }
export interface ModelOption { id: string; root?: string; parent?: string | null }

export interface ProviderOption { slug: string; name: string; is_current?: boolean; models: string[] }
export interface ModelInventory { providers: ProviderOption[]; provider: string; model: string }

// Subset of the pinned Hermes generated gateway contract. Preserve the hierarchy;
// flatten only at the rendering boundary, never infer membership from cwd.
export interface ProjectLane { id: string; label: string; path?: string | null; isMain?: boolean; isKanban?: boolean; sessions: Session[] }
export interface ProjectRepo { id: string; label: string; path?: string | null; groups: ProjectLane[]; sessionCount?: number }
export interface Project { id: string; label: string; path?: string | null; color?: string | null; icon?: string | null; isAuto?: boolean; isNoProject?: boolean; sessionCount: number; repos: ProjectRepo[]; previewSessions?: Session[]; sessionIds?: string[] }
export interface ProjectTree { projects: Project[]; scoped_session_ids: string[]; active_id?: string | null }
