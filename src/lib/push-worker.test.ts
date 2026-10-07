/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const worker = readFileSync('public/push-service-worker.js', 'utf8')
async function deliver(url: string, options: { visible?: boolean; focused?: boolean; kind?: string; profile?: string; session?: string; clients?: unknown[]; route?: string; noReply?: boolean; invalidReply?: boolean } = {}) {
  const handlers: Record<string, (event: unknown) => void> = {}
  const showNotification = vi.fn(async (_title: string, _options: object) => {})
  function respondingClient(value: { url: string; visibilityState?: string; focused?: boolean }) {
    return { ...value, postMessage: (_message: unknown, ports: { postMessage: (data: unknown) => void }[]) => {
      if (!options.noReply) ports[0]!.postMessage({ type: options.invalidReply ? 'wrong' : 'chathermes.route', url: options.route ?? value.url })
    } }
  }
  const client = respondingClient({ url, visibilityState: options.visible === false ? 'hidden' : 'visible', focused: options.focused !== false })
  class Channel {
    port1 = { onmessage: undefined as undefined | ((event: { data: unknown }) => void), close() {} }
    port2 = { postMessage: (data: unknown) => this.port1.onmessage?.({ data }), close() {} }
  }
  runInNewContext(worker, { URL, MessageChannel: Channel, setTimeout, clearTimeout, self: { location: { origin: 'https://chat.test' },
    addEventListener: (kind: string, fn: (event: unknown) => void) => { handlers[kind] = fn },
    clients: { matchAll: async () => options.clients ? options.clients.map(value => respondingClient(value as typeof client)) : [client] }, registration: { showNotification } } })
  let pending: Promise<unknown> | undefined
  handlers.push!({ data: { json: () => ({ title: 'ChatHermes', type: options.kind || 'turn.complete', profile: options.profile ?? 'alpha', session_id: options.session ?? 'one' }) }, waitUntil: (value: Promise<unknown>) => { pending = value } })
  await pending
  return showNotification
}

describe('worker exact originating session suppression', () => {
  it.each(['turn.complete', 'approval', 'clarify', 'attention'])('suppresses %s only on matching visible focused session', async kind => {
    expect(await deliver('https://chat.test/chathermes?profile=alpha&session=one', { kind })).not.toHaveBeenCalled()
  })
  it.each([
    '/chathermes', '/chathermes?profile=alpha', '/chathermes?profile=alpha&session=two',
    '/chathermes?profile=beta&session=one', '/chathermes?session=one',
    '/chathermes?profile=alpha&session=one&view=projects',
    '/chathermes?profile=alpha&session=one&view=scheduled',
    '/chathermes?profile=alpha&session=one&session=two',
    '/chathermes?profile=alpha&profile=beta&session=one',
    '/chathermes-other?profile=alpha&session=one', '/sessions?profile=alpha&session=one',
    'https://other.test/chathermes?profile=alpha&session=one',
  ])('shows on %s', async path => {
    expect(await deliver(new URL(path, 'https://chat.test').href)).toHaveBeenCalledOnce()
  })
  it.each([{ visible: false }, { focused: false }, { visible: false, focused: false }])('shows with inactive matching window %j', async options => {
    expect(await deliver('https://chat.test/chathermes?profile=alpha&session=one', options)).toHaveBeenCalledOnce()
  })
  it('matches implicit default profile and SPA updated URL', async () => {
    expect(await deliver('https://chat.test/chathermes?session=one', { profile: 'default' })).not.toHaveBeenCalled()
    expect(await deliver('https://chat.test/chathermes?session=two', { profile: 'default' })).toHaveBeenCalledOnce()
  })
  it('shows with no windows and only suppresses when some window matches', async () => {
    expect(await deliver('', { clients: [] })).toHaveBeenCalledOnce()
    expect(await deliver('', { clients: [
      { url: 'https://chat.test/chathermes?profile=alpha&session=two', focused: true, visibilityState: 'visible' },
      { url: 'https://chat.test/chathermes?profile=alpha&session=one', focused: true, visibilityState: 'visible' },
    ] })).not.toHaveBeenCalled()
  })
  it('uses current SPA route instead of a stale WindowClient URL', async () => {
    expect(await deliver('https://chat.test/chathermes', { route: 'https://chat.test/chathermes?profile=alpha&session=one' })).not.toHaveBeenCalled()
    expect(await deliver('https://chat.test/chathermes?profile=alpha&session=one', { route: 'https://chat.test/chathermes?profile=alpha&session=two' })).toHaveBeenCalledOnce()
    expect(await deliver('https://chat.test/projects', { route: 'https://chat.test/chathermes?profile=alpha&session=one' })).not.toHaveBeenCalled()
  })
  it.each([{ noReply: true }, { invalidReply: true }])('shows when mounted client cannot confirm its current route %j', async options => {
    expect(await deliver('https://chat.test/chathermes?profile=alpha&session=one', options)).toHaveBeenCalledOnce()
  })
  it('always shows explicit test, without a session', async () => {
    const show = await deliver('https://chat.test/chathermes?profile=alpha&session=one', { kind: 'test', session: '' })
    expect(show).toHaveBeenCalledOnce()
    expect(show.mock.calls[0]?.[1]).toMatchObject({ data: { url: 'https://chat.test/chathermes?profile=alpha' } })
  })
})
