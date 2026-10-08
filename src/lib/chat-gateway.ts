// The reviewed native rollout gate. This channel cannot submit a prompt.
// Tickets are ephemeral and only sent in the host's supported subprotocol.
export interface ChatCapabilities {
  protocol: 'chathermes.chat.v2'
  reviewed_source: string
  mode: 'native-retained'
  admission: true
  operations: string[]
  blockers: string[]
  guarantees: { crash_safe_idempotency: false; lossless_snapshot_replay: false; offline_turn_lease: true }
}
export function chatCapabilities(value: unknown): ChatCapabilities {
  const v = value as Partial<ChatCapabilities> | null
  if (!v || v.protocol !== 'chathermes.chat.v2' || v.mode !== 'native-retained' || v.admission !== true ||
      typeof v.reviewed_source !== 'string' || !Array.isArray(v.operations) || !v.operations.every(x => typeof x === 'string') ||
      !Array.isArray(v.blockers) || !v.blockers.every(x => typeof x === 'string') ||
      !v.guarantees || v.guarantees.crash_safe_idempotency !== false || v.guarantees.lossless_snapshot_replay !== false || v.guarantees.offline_turn_lease !== true ||
      !['crash_safe_idempotency', 'lossless_snapshot_replay', 'offline_turn_lease'].every(k => k in v.guarantees!))
    throw new Error('Unsupported native chat contract')
  return v as ChatCapabilities
}
export async function probeChatGateway(profile: string, signal?: AbortSignal): Promise<ChatCapabilities> {
  if (profile && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(profile)) throw new Error('Invalid profile name')
  signal?.throwIfAborted()
  const response = await fetch('/api/auth/ws-ticket', { method: 'POST', credentials: 'same-origin',
    cache: 'no-store', redirect: 'manual', signal })
  if (!response.ok || response.type === 'opaqueredirect') throw new Error('Sign in to the dashboard to inspect native chat support')
  const value: unknown = await response.json()
  const ticket = value && typeof value === 'object' && 'ticket' in value ? value.ticket : undefined
  if (typeof ticket !== 'string' || !ticket || ticket.length > 1024) throw new Error('Invalid dashboard ticket response')
  signal?.throwIfAborted()
  const url = new URL('/api/plugins/chathermes/chat/ws', location.href)
  url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  if (profile) url.searchParams.set('profile', profile)
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, ['hermes-gateway-v1', `hermes-gateway-ticket.${ticket}`])
    let settled = false
    const finish = (result?: ChatCapabilities, error?: Error) => {
      if (settled) return
      settled = true; clearTimeout(timeout); signal?.removeEventListener('abort', abort)
      ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null
      // CLOSING before upgrade may throw in mocks; cleanup never masks outcome.
      try { ws.close() } catch { /* nothing was admitted */ }
      if (error) reject(error); else resolve(result!)
    }
    const abort = () => finish(undefined, new Error('Native chat probe cancelled'))
    const timeout = setTimeout(() => finish(undefined, new Error('Native chat probe timed out')), 10_000)
    signal?.addEventListener('abort', abort, { once: true })
    ws.onopen = () => ws.send(JSON.stringify({ jsonrpc: '2.0', id: 'capabilities', method: 'chat.capabilities', params: {} }))
    ws.onmessage = event => {
      try {
        if (typeof event.data !== 'string' || event.data.length > 8192) throw new Error('Invalid native chat frame')
        const frame = JSON.parse(event.data)
        if (frame.jsonrpc !== '2.0' || Array.isArray(frame)) throw new Error('Invalid native chat frame')
        if (frame.id !== 'capabilities' || 'method' in frame) return
        if ('error' in frame) throw new Error('Native chat probe rejected')
        finish(chatCapabilities(frame.result))
      } catch { finish(undefined, new Error('Unsupported native chat contract')) }
    }
    ws.onerror = ws.onclose = () => finish(undefined, new Error('Native chat probe disconnected'))
    if (signal?.aborted) abort()
  })
}
