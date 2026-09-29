import type { Capabilities, Message, Profile, Session, SessionPage } from '../types/hermes'
import { readSSE, type SSEEvent } from './sse'
export class ApiError extends Error { status: number; constructor(status: number, message: string) { super(message); this.status = status } }
const scope = (profile: string) => `/api/profiles/${encodeURIComponent(profile)}`
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...options, headers: { accept: 'application/json', ...(options.body ? { 'content-type': 'application/json' } : {}) }, credentials: 'same-origin', cache: 'no-store' })
  if (!response.ok) throw new ApiError(response.status, `Request failed (${response.status})`)
  return response.json() as Promise<T>
}
function record(value: unknown): Record<string, unknown> | undefined { return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined }
function session(value: unknown): Session {
  const row = record(value)
  if (typeof row?.id !== 'string' || !row.id) throw new Error('Invalid Hermes session response')
  return row as unknown as Session
}
function unwrapSession(value: unknown): Session { const row = record(value); return session(row?.session ?? value) }
function sessionsPage(value: unknown): SessionPage {
  const row = record(value)
  const entries = Array.isArray(value) ? value : row?.data ?? row?.sessions
  if (!Array.isArray(entries)) throw new Error('Invalid Hermes sessions response')
  return { sessions: entries.map(session), limit: typeof row?.limit === 'number' ? row.limit : undefined,
    offset: typeof row?.offset === 'number' ? row.offset : undefined,
    has_more: typeof row?.has_more === 'boolean' ? row.has_more : undefined,
    total: typeof row?.total === 'number' ? row.total : undefined }
}
function messagePage(value: unknown): { messages: Message[]; pagination?: { returned: number; limit: number } } {
  const row = record(value)
  const entries = Array.isArray(value) ? value : row?.data ?? row?.messages
  if (!Array.isArray(entries) || entries.some(item => !record(item) || typeof item.role !== 'string')) throw new Error('Invalid Hermes messages response')
  const pagination = record(row?.pagination)
  return { messages: entries as Message[], pagination: typeof pagination?.returned === 'number' && typeof pagination.limit === 'number'
    ? { returned: pagination.returned, limit: pagination.limit } : undefined }
}
export const api = {
  profiles: (signal?: AbortSignal) => request<Profile[]>('/api/profiles', { signal }),
  capabilities: (profile: string, signal?: AbortSignal) => request<Capabilities>(`${scope(profile)}/v1/capabilities`, { signal }),
  sessions: async (profile: string, offset = 0, signal?: AbortSignal) => sessionsPage(await request<unknown>(`${scope(profile)}/api/sessions?limit=30&offset=${offset}`, { signal })),
  create: async (profile: string, signal?: AbortSignal) => unwrapSession(await request<unknown>(`${scope(profile)}/api/sessions`, { method: 'POST', body: '{}', signal })),
  session: async (profile: string, id: string, signal?: AbortSignal) => unwrapSession(await request<unknown>(`${scope(profile)}/api/sessions/${encodeURIComponent(id)}`, { signal })),
  rename: async (profile: string, id: string, title: string, signal?: AbortSignal) => unwrapSession(await request<unknown>(`${scope(profile)}/api/sessions/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ title }), signal })),
  async messages(profile: string, id: string, signal?: AbortSignal): Promise<Message[]> {
    const messages: Message[] = []
    for (let offset = 0; ; ) {
      const page = messagePage(await request<unknown>(`${scope(profile)}/api/sessions/${encodeURIComponent(id)}/messages?limit=500&offset=${offset}&order=oldest&inline_images=false`, { signal }))
      messages.push(...page.messages)
      if (!page.pagination || page.pagination.returned < page.pagination.limit || !page.messages.length) return messages
      offset += page.messages.length
    }
  },
  async *stream(profile: string, session: string, input: string, signal?: AbortSignal): AsyncGenerator<SSEEvent> {
    const response = await fetch(`${scope(profile)}/api/sessions/${encodeURIComponent(session)}/chat/stream`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'text/event-stream' }, body: JSON.stringify({ input }), signal, credentials: 'same-origin', cache: 'no-store' })
    if (!response.ok) throw new ApiError(response.status, `Send failed (${response.status})`)
    if (!response.body) throw new Error('Stream unavailable')
    yield* readSSE(response.body, signal)
  },
  stop: (profile: string, run: string) => request<{ status: string }>(`${scope(profile)}/v1/runs/${encodeURIComponent(run)}/stop`, { method: 'POST' }),
}
export function messageText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return content.map(part => typeof part === 'string' ? part : part && typeof part === 'object' && 'text' in part && typeof part.text === 'string' ? part.text : '').filter(Boolean).join('\n')
  return ''
}
export function eventPayload(frame: SSEEvent): Record<string, unknown> { try { const value: unknown = JSON.parse(frame.data); return value && typeof value === 'object' ? value as Record<string, unknown> : {} } catch { return {} } }
