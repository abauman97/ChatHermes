export interface Session { id: string; title?: string | null; source?: string | null; created_at?: string; updated_at?: string }
export interface SessionPage { sessions: Session[]; total?: number; limit?: number; offset?: number; has_more?: boolean }
export interface Message { id?: string; role: string; content: unknown; created_at?: string; tool_name?: string }
export interface Capabilities { features?: Record<string, unknown>; endpoints?: Record<string, { method?: string; path?: string }> }
