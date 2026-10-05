import type { SSEEvent } from './sse'
type ObjectValue = Record<string, any>
export class NativeError extends Error {
  outcome: string
  constructor(message: string, outcome = 'unknown') { super(message); this.outcome = outcome }
}
export function appliedCursor(events: ObjectValue[], cursor: number): number {
  return events.reduce((last, event) => Number.isSafeInteger(event.seq) ? Math.max(last, event.seq) : last, cursor)
}
export function nativeFrame(event: ObjectValue, stored: string): SSEEvent | undefined {
  const p = event.payload || {}, name = event.type
  const data: ObjectValue = { ...p, run_id: 'workspace-' + stored, ...(typeof event.seq === 'number' ? { seq: event.seq } : {}) }
  let mapped = name
  if (name === 'message.delta') { mapped = 'assistant.delta'; data.delta = p.text || '' }
  if (name === 'message.complete') {
    mapped = p.status === 'complete' ? 'run.completed' : p.status === 'interrupted' ? 'run.cancelled' : 'run.failed'
    data.output = p.text
  }
  if (name === 'tool.start' || name === 'tool.generating' || name === 'tool.complete' || name === 'tool.progress') {
    mapped = name === 'tool.complete' ? p.is_error ? 'tool.failed' : 'tool.completed' : name === 'tool.progress' ? name : 'tool.started'
    data.tool_name = p.name; data.tool_call_id = p.tool_id; data.preview = p.context || ''
    data.output = p.result_text || (p.result !== undefined ? JSON.stringify(p.result) : '')
  }
  if (name === 'reasoning.delta' || name === 'thinking.delta' || name === 'tool.progress') data.delta = p.delta || p.text || ''
  if (name === 'request.cancel') mapped = 'approval.responded'
  if (name === 'error') mapped = 'run.failed'
  if (name === 'approval.request') return // Answerable SRQ frames carry the authoritative identity.
  if (!mapped) return
  return { event: mapped, data: JSON.stringify(data) }
}
function requestFrame(request: ObjectValue, stored: string): SSEEvent {
  return { event: 'approval.request', data: JSON.stringify({ ...request.params,
    run_id: 'workspace-' + stored, request_id: request.id, kind: request.method }) }
}
export class NativeViewer {
  private ws?: WebSocket
  private pending = new Map<string, { resolve: (value: any) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }>()
  private queue: SSEEvent[] = []
  private wake?: () => void
  private failed?: Error
  private sequence = 0
  private holding = true
  private live: ObjectValue[] = []
  private snapshot: ObjectValue = {}
  private heartbeat?: ReturnType<typeof setInterval>
  private cursor = 0
  private reorder = new Map<number, ObjectValue>()
  private epoch?: string
  private runtime?: string
  private first = true
  private opening?: Promise<void>
  private detached = false
  profile: string
  stored: string
  constructor(profile: string, stored: string) { this.profile = profile; this.stored = stored }
  async open() {
    const response = await fetch('/api/auth/ws-ticket', { method: 'POST', credentials: 'same-origin', cache: 'no-store', redirect: 'manual' })
    if (!response.ok) throw new NativeError('Dashboard sign-in required', 'rejected')
    const { ticket } = await response.json()
    if (typeof ticket !== 'string' || !ticket || ticket.length > 1024) throw new NativeError('Invalid dashboard ticket', 'rejected')
    if (this.detached) throw new NativeError('Viewer detached')
    const url = new URL('/api/plugins/chathermes/chat/ws', location.href)
    url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    if (this.profile) url.searchParams.set('profile', this.profile)
    this.failed = undefined; this.holding = true
    const ws = this.ws = new WebSocket(url, ['hermes-gateway-v1', 'hermes-gateway-ticket.' + ticket])
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { ws.close(); reject(new NativeError('Native viewer connection timed out')) }, 10000)
      ws.onopen = () => { clearTimeout(timer); resolve() }
      ws.onerror = ws.onclose = () => { clearTimeout(timer); reject(new NativeError('Native viewer disconnected')) }
    })
    ws.onclose = ws.onerror = () => { if (this.ws === ws) this.fail(new NativeError('Native viewer disconnected. Reconnect without resending.')) }
    ws.onmessage = event => {
      if (this.ws !== ws || this.detached) return
      try {
        if (typeof event.data !== 'string' || event.data.length > 8 * 1024 * 1024) throw new Error()
        const frame = JSON.parse(event.data)
        if (frame.jsonrpc !== '2.0' || Array.isArray(frame)) throw new Error()
        if ('id' in frame && !frame.method) {
          const call = this.pending.get(String(frame.id)); if (!call) return
          clearTimeout(call.timer); this.pending.delete(String(frame.id))
          if (frame.error) call.reject(new NativeError(frame.error.message || 'Native operation failed', frame.error.outcome || 'unknown'))
          else call.resolve(frame.result)
        } else if (frame.method === 'chat.event') {
          if (this.holding) { if (this.live.length >= 512) throw new Error(); this.live.push(frame.params) }
          else this.apply(frame.params)
        } else if (frame.method === 'chat.request') this.push(requestFrame(frame.params, this.stored))
        else if (frame.method === 'chat.unsupported') this.push({ event: 'native.notice', data: JSON.stringify({ text: 'This Hermes request requires Desktop: ' + frame.params.method }) })
      } catch { this.fail(new NativeError('Native viewer data unavailable. Inspect saved history.')) }
    }
    this.snapshot = await this.rpc('chat.attach', { session_id: this.stored })
    const replay = await this.rpc('chat.replay', { last_seen: this.cursor })
    const changed = this.runtime && (this.runtime !== this.snapshot.session_id || this.epoch !== replay.epoch)
    this.runtime = this.snapshot.session_id; this.epoch = replay.epoch
    if (this.first || changed || replay.truncated) {
      // No atomic watermark in this pin. A new document uses the native snapshot
      // and explicitly warns; it never pretends replacement + replay is lossless.
      this.cursor = appliedCursor(replay.events, 0)
      this.reorder.clear()
      if (this.snapshot.running || this.snapshot.pending_approval)
        this.push({ event: 'native.notice', data: JSON.stringify({ text: 'Reconnected. Some live progress may be missing; saved messages are authoritative.' }) })
      if (this.snapshot.inflight?.assistant)
        this.push({ event: 'assistant.snapshot', data: JSON.stringify({ text: this.snapshot.inflight.assistant }) })
      this.first = false
    } else for (const event of replay.events) this.apply(event)
    for (const request of replay.open_requests || []) if (['approval', 'clarify'].includes(request.method)) this.push(requestFrame(request, this.stored))
    this.holding = false
    for (const event of this.live) this.apply(event)
    this.live = []
    this.heartbeat = setInterval(() => {
      void this.rpc('gateway.ping').then(() => this.rpc('chat.replay', { last_seen: this.cursor })).then(replay => {
        if (replay.epoch !== this.epoch || replay.truncated) {
          this.push({ event: 'native.notice', data: JSON.stringify({ text: 'Native replay expired or restarted. Partial activity is unavailable; inspect saved history.' }) })
          this.fail(new NativeError('Native replay boundary changed')); this.ws?.close(); return
        }
        for (const event of replay.events) this.apply(event)
      }).catch(error => this.fail(error))
    }, 15000)
  }
  private apply(event: ObjectValue) {
    if (event.session_id !== this.runtime || typeof event.seq !== 'number' || event.seq <= this.cursor) return
    this.reorder.set(event.seq, event)
    if (this.reorder.size > 512) { this.fail(new NativeError('Native event gap exceeded recovery bounds. Inspect saved history.')); return }
    while (this.reorder.has(this.cursor + 1)) {
      const next = this.reorder.get(++this.cursor)!
      this.reorder.delete(this.cursor)
      const frame = nativeFrame(next, this.stored); if (frame) this.push(frame)
    }
  }
  private push(frame: SSEEvent) {
    if (this.queue.length >= 512) { this.fail(new NativeError('Native viewer overflow. Inspect saved history.')); return }
    this.queue.push(frame); this.wake?.(); this.wake = undefined
  }
  private fail(error: Error) {
    this.failed = error; clearInterval(this.heartbeat)
    for (const call of this.pending.values()) { clearTimeout(call.timer); call.reject(error) }
    this.pending.clear(); this.wake?.(); this.wake = undefined
  }
  close() { this.detached = true; this.fail(new NativeError('Viewer detached')); this.ws?.close() }
  async ensure() {
    if (this.detached) throw new NativeError('Viewer detached')
    if (this.opening) return this.opening
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.failed) {
      clearInterval(this.heartbeat); this.ws?.close()
      this.opening = this.open()
      try { await this.opening } catch (error) { this.ws?.close(); throw error }
      finally { this.opening = undefined }
    }
  }
  rpc(method: string, params: ObjectValue = {}): Promise<any> {
    const id = 'c-' + ++this.sequence
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) { reject(new NativeError('Message not submitted. Native viewer disconnected; reconnect and try again.', 'rejected')); return }
      const timer = setTimeout(() => { this.pending.delete(id); reject(new NativeError('Native operation outcome unknown. Inspect history before sending again.')) }, 95000)
      this.pending.set(id, { resolve, reject, timer })
      try { this.ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params })) }
      catch {
        clearTimeout(timer); this.pending.delete(id)
        reject(new NativeError('Message not submitted. Native viewer disconnected; reconnect and try again.', 'rejected'))
      }
    })
  }
  async status() {
    await this.ensure()
    this.snapshot = await this.rpc('chat.attach', { session_id: this.stored })
    if (this.snapshot.auto_continue) this.push({ event: 'native.notice', data: JSON.stringify({ text: 'Hermes scheduled crash continuation. External effects may repeat; this is a new continuation, not unchanged-turn replay.' }) })
    const requests = this.snapshot.open_requests || []
    const request = requests.find((r: ObjectValue) => ['approval', 'clarify'].includes(r.method))
    return { status: request ? 'waiting_for_approval' : this.snapshot.running || this.snapshot.queued?.user ? 'running' : 'completed',
      approval: request ? { ...request.params, request_id: request.id, kind: request.method } : undefined }
  }
  async *events(signal?: AbortSignal): AsyncGenerator<SSEEvent> {
    await this.ensure()
    const abort = () => { this.wake?.(); this.wake = undefined }
    signal?.addEventListener('abort', abort, { once: true })
    try {
      while (!signal?.aborted) {
        if (this.queue.length) {
          const frame = this.queue.shift()!
          if (['run.completed', 'run.cancelled', 'run.failed'].includes(frame.event)) {
            const state = await this.status()
            if (state.status !== 'completed') {
              yield { event: 'native.notice', data: JSON.stringify({ text: 'Hermes has more native work or a pending request in this session.' }) }
              continue
            }
          }
          yield frame; continue
        }
        if (this.failed) throw this.failed
        await new Promise<void>(resolve => {
          const timer = setTimeout(() => { this.wake = undefined; resolve() }, 1000)
          this.wake = () => { clearTimeout(timer); resolve() }
        })
        if (!this.queue.length && !this.failed && !signal?.aborted) {
          const state = await this.status()
          if (state.status === 'completed') { yield { event: 'run.completed', data: '{}' }; return }
        }
      }
    } finally { signal?.removeEventListener('abort', abort) }
  }
}
let viewer: NativeViewer | undefined
export async function nativeViewer(profile: string, stored: string) {
  if (!viewer || viewer.profile !== profile || viewer.stored !== stored) { viewer?.close(); viewer = new NativeViewer(profile, stored) }
  const current = viewer
  await current.ensure()
  if (viewer !== current) throw new NativeError('Viewer detached')
  return current
}
export function closeNativeViewer() { viewer?.close(); viewer = undefined }
