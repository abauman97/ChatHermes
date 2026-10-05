// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NativeViewer, type NativeHooks } from './native-chat'
import { nativeOutcome, settleNativeOutcome, uncertainNativeOutcome } from './native-admission'

const hooks = (): NativeHooks => ({ snapshot: vi.fn(), event: vi.fn(), input: vi.fn(), requests: vi.fn(), connection: vi.fn(), recovered: vi.fn() })
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

describe('retained native recovery', () => {
  it('a detached viewer cannot mint another ticket', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch')
    const viewer = new NativeViewer('a', 'stored', hooks()); viewer.close()
    await expect(viewer.ensure()).rejects.toThrow('Viewer detached')
    expect(fetcher).not.toHaveBeenCalled(); fetcher.mockRestore()
  })
  it('rejects a submit before a socket can dispatch it', async () => {
    const viewer = new NativeViewer('a', 'stored', hooks())
    await expect(viewer.rpc('chat.submit', { input: 'hello' })).rejects.toMatchObject({ outcome: 'rejected' })
    viewer.close()
  })
  it.each([true, false])('replays covered frames or skips a degraded spool, without completion polling (complete=%s)', async complete => {
    vi.stubGlobal('location', new URL('https://dashboard.test/chathermes'))
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ticket: 'ephemeral' }))))
    const sent: string[] = []
    const event = (offset: number, type: string) => ({ jsonrpc: '2.0', method: 'event', chat_offset: offset, params: { session_id: 'runtime', seq: offset, type, payload: { text: String(offset) } } })
    class Socket {
      static OPEN = 1
      readyState = 1
      onopen?: () => void; onmessage?: (event: { data: string }) => void; onclose?: () => void; onerror?: () => void
      constructor() { queueMicrotask(() => this.onopen?.()) }
      close() { this.readyState = 3 }
      send(text: string) {
        const frame = JSON.parse(text); sent.push(frame.method)
        queueMicrotask(() => {
          let result: unknown
          if (frame.method === 'chat.attach') {
            this.onmessage?.({ data: JSON.stringify(event(3, 'message.delta')) })
            result = { session_id: 'runtime', messages: [], recovery: { epoch: 'epoch', through: 2, complete, base_row_ids: [] } }
          } else if (frame.method === 'chat.replay') result = { epoch: 'epoch', offset: 2, frames: [event(1, 'reasoning.delta'), event(2, 'tool.start')] }
          else result = { ok: true }
          this.onmessage?.({ data: JSON.stringify({ jsonrpc: '2.0', id: frame.id, result }) })
        })
      }
    }
    vi.stubGlobal('WebSocket', Socket)
    const h = hooks(), viewer = new NativeViewer('a', 'stored', h)
    await viewer.ensure()
    expect(vi.mocked(h.event).mock.calls.map(([e]) => e.type)).toEqual(complete ? ['reasoning.delta', 'tool.start', 'message.delta'] : ['message.delta'])
    expect(sent).toEqual(complete ? ['chat.attach', 'chat.replay'] : ['chat.attach'])
    expect(viewer.boundary).toBe(3)
    // Corrections have no prompt-admission token; they still reach the reducer.
    ;(viewer as any).apply({ method: 'chat.correction', params: { text: 'Use the second approach' }, chat_offset: 4 })
    expect(h.input).toHaveBeenCalledWith('Use the second approach', true, undefined)
    viewer.close()
  })
  it('one tab acknowledgement cannot clear another uncertain attempt', () => {
    const a = uncertainNativeOutcome('same', 'session'), b = uncertainNativeOutcome('same', 'session')
    settleNativeOutcome('same', 'session', a); expect(nativeOutcome('same', 'session')).toBe(true)
    settleNativeOutcome('same', 'session', b); expect(nativeOutcome('same', 'session')).toBe(false)
  })
})
