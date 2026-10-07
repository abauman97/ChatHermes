import { describe, expect, it, vi } from 'vitest'
import { sessionMessage, connectPushClient } from './push-client'

describe('mounted plugin session handshake', () => {
  it('carries actual connection and view state without consulting focus or visibility', () => {
    expect(sessionMessage({ profile: '', session: 'one', connected: true, chat: true }, 'https://chat.test/chathermes?session=one')).toMatchObject({ profile: 'default', session: 'one', connected: true })
    expect(sessionMessage({ profile: 'alpha', session: 'one', connected: false, chat: true }, 'https://chat.test/chathermes')).toMatchObject({ connected: false })
    expect(sessionMessage({ profile: 'alpha', session: 'one', connected: true, chat: false }, 'https://chat.test/chathermes')).toMatchObject({ session: '', connected: false })
  })
  it('responds freshly, publishes on readiness/controller change, and stops on unmount', async () => {
    const listeners: Record<string, any> = {}
    const postMessage = vi.fn()
    let resolveReady!: (value: any) => void
    const sw = { controller: null, ready: new Promise<any>(resolve => { resolveReady = resolve }), addEventListener: (type: string, fn: any) => { listeners[type] = fn }, removeEventListener: vi.fn() } as unknown as ServiceWorkerContainer
    let connected = false
    const client = connectPushClient(sw, () => ({ profile: 'alpha', session: 'one', connected, chat: true }), () => 'https://chat.test/chathermes?profile=alpha&session=one')
    connected = true; resolveReady({ active: { postMessage } }); await Promise.resolve()
    expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ connected: true }))
    const reply = vi.fn(); connected = false
    listeners.message({ data: { type: 'chathermes.session.query' }, ports: [{ postMessage: reply }] })
    expect(reply).toHaveBeenCalledWith(expect.objectContaining({ connected: false, session: 'one' }))
    listeners.controllerchange(); expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ connected: false }))
    client.stop(); client.publish(); expect(postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ session: '', connected: false }))
    expect(sw.removeEventListener).toHaveBeenCalledTimes(2)
  })
  it('does not publish a connected session if readiness arrives after unmount', async () => {
    const postMessage = vi.fn(), listeners: Record<string, any> = {}
    let resolveReady!: (value: any) => void
    const sw = { ready: new Promise<any>(resolve => { resolveReady = resolve }), addEventListener: (type: string, fn: any) => { listeners[type] = fn }, removeEventListener: vi.fn() } as unknown as ServiceWorkerContainer
    const client = connectPushClient(sw, () => ({ profile: 'alpha', session: 'one', connected: true, chat: true }), () => 'https://chat.test/chathermes?profile=alpha&session=one')
    client.stop(); resolveReady({ active: { postMessage } }); await Promise.resolve()
    const reply = vi.fn(); listeners.message({ data: { type: 'chathermes.session.query' }, ports: [{ postMessage: reply }] })
    expect(postMessage).not.toHaveBeenCalled(); expect(reply).not.toHaveBeenCalled()
  })

})
