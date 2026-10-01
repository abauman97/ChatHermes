import type { Capabilities, Message, Session, SessionPage } from '../types/hermes'
import { readSSE, type SSEEvent } from './sse'
export class ApiError extends Error { status: number; constructor(status: number, message: string) { super(message); this.status = status } }
const ROOT = '/api/plugins/chathermes'
function endpoint(profile: string, path: string): string {
  if (profile && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(profile)) throw new Error('Invalid profile name')
  if (!/^\/(?:api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/chat\/stream)?|v1\/capabilities|v1\/runs\/[A-Za-z0-9_-]+(?:\/(?:stop|events))?)$/.test(path)) throw new Error('Invalid Hermes API path.')
  return ROOT + path + (profile ? `${path.includes('?') ? '&' : '?'}profile=${encodeURIComponent(profile)}` : '')
}
async function directFetch(profile: string, path: string, options: RequestInit = {}, accept = 'application/json'): Promise<Response> {
  const response = await fetch(endpoint(profile, path), { ...options, headers: { accept, ...(options.body ? { 'content-type': 'application/json' } : {}) }, credentials: 'same-origin', redirect: 'manual', cache: 'no-store' })
  if (response.type === 'opaqueredirect' || response.status >= 300 && response.status < 400) throw new Error('Hermes redirected the request. Sign in to the dashboard and retry.')
  return response
}
async function request<T>(profile: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await directFetch(profile, path, options)
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
  capabilities: (profile: string, signal?: AbortSignal) => request<Capabilities>(profile, `/v1/capabilities`, { signal }),
  sessions: async (profile: string, offset = 0, signal?: AbortSignal) => sessionsPage(await request<unknown>(profile, `/api/sessions?limit=30&offset=${offset}`, { signal })),
  create: async (profile: string, signal?: AbortSignal) => unwrapSession(await request<unknown>(profile, `/api/sessions`, { method: 'POST', body: '{}', signal })),
  session: async (profile: string, id: string, signal?: AbortSignal) => unwrapSession(await request<unknown>(profile, `/api/sessions/${encodeURIComponent(id)}`, { signal })),
  rename: async (profile: string, id: string, title: string, signal?: AbortSignal) => unwrapSession(await request<unknown>(profile, `/api/sessions/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ title }), signal })),
  async messages(profile: string, id: string, signal?: AbortSignal): Promise<Message[]> {
    const messages: Message[] = []
    for (let offset = 0; ; ) {
      const page = messagePage(await request<unknown>(profile, `/api/sessions/${encodeURIComponent(id)}/messages?limit=500&offset=${offset}&order=oldest&inline_images=false`, { signal }))
      messages.push(...page.messages)
      if (!page.pagination || page.pagination.returned < page.pagination.limit || !page.messages.length) return messages
      offset += page.messages.length
    }
  },
  async *stream(profile: string, session: string, input: string, signal?: AbortSignal): AsyncGenerator<SSEEvent> {
    const response = await directFetch(profile, `/api/sessions/${encodeURIComponent(session)}/chat/stream`, { method: 'POST', body: JSON.stringify({ input }), signal }, 'text/event-stream')
    if (!response.ok) throw new ApiError(response.status, `Send failed (${response.status})`)
    if (!response.body) throw new Error('Stream unavailable')
    yield* readSSE(response.body, signal)
  },
  runStatus: (profile: string, run: string, signal?: AbortSignal) => request<{ status?: string; run?: { status?: string } }>(profile, `/v1/runs/${encodeURIComponent(run)}`, { signal }),
  async *runEvents(profile: string, run: string, signal?: AbortSignal): AsyncGenerator<SSEEvent> {
    const response = await directFetch(profile, `/v1/runs/${encodeURIComponent(run)}/events`, { signal }, 'text/event-stream')
    if (!response.ok) throw new ApiError(response.status, `Run events failed (${response.status})`)
    if (!response.body) throw new Error('Stream unavailable')
    yield* readSSE(response.body, signal)
  },
  stop: (profile: string, run: string) => request<{ status: string }>(profile, `/v1/runs/${encodeURIComponent(run)}/stop`, { method: 'POST' }),
}
export function messageText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return content.map(part => typeof part === 'string' ? part : part && typeof part === 'object' && 'text' in part && typeof part.text === 'string' ? part.text : '').filter(Boolean).join('\n')
  return ''
}
export function eventPayload(frame: SSEEvent): Record<string, unknown> { try { const value: unknown = JSON.parse(frame.data); return value && typeof value === 'object' ? value as Record<string, unknown> : {} } catch { return {} } }
