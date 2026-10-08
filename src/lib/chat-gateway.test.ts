import { afterEach, describe, expect, it, vi } from 'vitest'
import { chatCapabilities, probeChatGateway } from './chat-gateway'
const contract = { protocol: 'chathermes.chat.v2', mode: 'native-retained', admission: true, reviewed_source: 'pin', operations: ['gateway.ping'], blockers: ['snapshot_replay_boundary'], guarantees: { crash_safe_idempotency: false, lossless_snapshot_replay: false, offline_turn_lease: true } }
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })
describe('native chat rollout gate', () => {
  it('requires the reviewed version and refuses unimplemented admission guarantees', () => {
    expect(chatCapabilities(contract)).toEqual(contract)
    for (const invalid of [null, {}, { ...contract, admission: false }, { ...contract, protocol: 'other' }, { ...contract, guarantees: {} }, { ...contract, guarantees: { ...contract.guarantees, offline_turn_lease: false } }])
      expect(() => chatCapabilities(invalid)).toThrow('Unsupported native chat contract')
  })
  it('authenticates same-origin, correlates only responses and closes the probe', async () => {
    vi.stubGlobal('location', new URL('https://dashboard.test/chathermes'))
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ticket: 'ephemeral' })))
    vi.stubGlobal('fetch', fetch)
    class Socket {
      static current: Socket
      onopen?: () => void; onmessage?: (event: { data: string }) => void
      onerror?: () => void; onclose?: () => void
      send = vi.fn<(data: string) => void>(); close = vi.fn()
      url: URL; protocols: string[]
      constructor(url: URL, protocols: string[]) { this.url = url; this.protocols = protocols; Socket.current = this }
    }
    vi.stubGlobal('WebSocket', Socket)
    const result = probeChatGateway('alpha')
    await vi.waitFor(() => expect(Socket.current).toBeDefined())
    const ws = Socket.current
    expect(ws.url.origin).toBe(location.origin.replace('http', 'ws'))
    expect(ws.url.search).toBe('?profile=alpha')
    expect(ws.url.href).not.toContain('ephemeral')
    expect(ws.protocols).toEqual(['hermes-gateway-v1', 'hermes-gateway-ticket.ephemeral'])
    expect(fetch).toHaveBeenCalledWith('/api/auth/ws-ticket', expect.objectContaining({ credentials: 'same-origin', redirect: 'manual' }))
    ws.onopen!()
    expect(JSON.parse(ws.send.mock.calls[0]![0])).toEqual({ jsonrpc: '2.0', id: 'capabilities', method: 'chat.capabilities', params: {} })
    ws.onmessage!({ data: JSON.stringify({ jsonrpc: '2.0', id: 'capabilities', method: 'approval', params: {} }) })
    expect(ws.close).not.toHaveBeenCalled()
    ws.onmessage!({ data: JSON.stringify({ jsonrpc: '2.0', id: 'capabilities', result: contract }) })
    expect(await result).toEqual(contract)
    expect(ws.close).toHaveBeenCalledOnce()
    expect(ws.onmessage).toBeNull()
  })
  it('never opens a socket after auth rejection or an aborted ticket fetch', async () => {
    const Socket = vi.fn(); vi.stubGlobal('WebSocket', Socket)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })))
    await expect(probeChatGateway('')).rejects.toThrow('Sign in')
    const controller = new AbortController(); controller.abort()
    await expect(probeChatGateway('', controller.signal)).rejects.toThrow()
    await expect(probeChatGateway('../foreign')).rejects.toThrow('Invalid profile')
    expect(Socket).not.toHaveBeenCalled()
  })
})
