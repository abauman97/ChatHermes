/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const worker = readFileSync('public/push-service-worker.js', 'utf8')
const origin = 'https://chat.test'
const route = origin + '/chathermes?profile=alpha&session=one'
function harness() {
  const handlers: Record<string, (event: any) => void> = {}
  let state: any = { type: 'chathermes.session', url: route, profile: 'alpha', session: 'one', connected: true }
  const client = { focus: vi.fn(async () => {}), id: 'tab', url: origin + '/old-spa-url', visibilityState: 'hidden', focused: false,
    postMessage: vi.fn((_message: any, ports: any[]) => { if (state && ports) ports[0].postMessage(state) }) }
  let clients: any[] = [client]
  const notifications: any[] = []
  const show = vi.fn(async (_title: string, options: any) => { notifications.push({ ...options, close: vi.fn() }) })
  class Channel {
    port1 = { onmessage: undefined as any, close() {} }
    port2 = { postMessage: (data: any) => this.port1.onmessage?.({ data }), close() {} }
  }
  const getNotifications = vi.fn(async () => notifications)
  runInNewContext(worker, { URL, MessageChannel: Channel, setTimeout, clearTimeout, self: {
    location: { origin }, addEventListener: (type: string, fn: any) => { handlers[type] = fn },
    clients: { matchAll: async () => clients, openWindow: vi.fn() }, registration: { showNotification: show, getNotifications },
  } })
  async function dispatch(type: string, fields: any) {
    let pending: any
    handlers[type]!({ ...fields, waitUntil: (promise: any) => { pending = promise } })
    await pending
  }
  const push = (extra = {}) => dispatch('push', { data: { json: () => ({ title: 'ChatHermes', type: 'turn.complete', profile: 'alpha', session_id: 'one', body: 'Chat text', ...extra }) } })
  const update = () => dispatch('message', { source: client, data: state })
  return { client, show, getNotifications, notifications, push, update, dispatch, setState: (value: any) => { state = value }, patch: (value: any) => { state = { ...state, ...value } }, setClients: (value: any[]) => { clients = value } }
}
describe('connected session notifications', () => {
  it.each(['turn.complete', 'approval', 'clarify', 'attention'])('suppresses %s in connected hidden/unfocused tabs', async type => {
    const h = harness(); await h.push({ type }); expect(h.show).not.toHaveBeenCalled()
    expect(h.client.postMessage).toHaveBeenCalledWith({ type: 'chathermes.session.query' }, expect.anything())
  })
  it.each([{ connected: false }, { profile: 'beta' }, { session: 'two' }, { session: '' }, { type: 'wrong' },
    { url: origin + '/chathermes' }, { url: route + '&view=projects' }, { url: route + '&view=scheduled' },
    { url: route + '&session=two' }, { url: route + '&profile=beta' }, { url: 'https://other.test/chathermes' },
    { connected: 'true' }])('shows for mismatched or disconnected state %j', async patch => {
    const h = harness(); h.patch(patch); await h.push(); expect(h.show).toHaveBeenCalledOnce()
    expect(h.show.mock.calls[0]).toMatchObject(['ChatHermes', { body: 'Chat text' }])
  })
  it('fails open for missing clients and absent handshakes', async () => {
    const h = harness(); h.setClients([]); await h.push(); expect(h.show).toHaveBeenCalledOnce()
    h.setClients([h.client]); h.setState(null); await h.push(); expect(h.show).toHaveBeenCalledTimes(2)
  })
  it.each([{ visibilityState: 'visible', focused: true }, { visibilityState: 'visible', focused: false }, { visibilityState: 'hidden', focused: true }, { visibilityState: 'hidden', focused: false }])('uses connection regardless of window activity %j', async activity => {
    const h = harness(); Object.assign(h.client, activity); await h.push(); expect(h.show).not.toHaveBeenCalled()
    h.patch({ connected: false }); await h.push(); expect(h.show).toHaveBeenCalledOnce()
  })
  it('suppresses and closes if any tab is connected, independently of another disconnected tab', async () => {
    const h = harness(); h.patch({ connected: false }); await h.push()
    const other = { ...h.client, id: 'other', postMessage: (_message: any, ports: any[]) => ports[0].postMessage({ type: 'chathermes.session', url: route, profile: 'alpha', session: 'one', connected: true }) }
    h.setClients([h.client, other]); await h.update(); expect(h.notifications[0].close).toHaveBeenCalledOnce()
    await h.push(); expect(h.show).toHaveBeenCalledOnce()
    h.setClients([h.client]); await h.push(); expect(h.show).toHaveBeenCalledTimes(2)
  })
  it('keeps a clicked notification while navigating to a disconnected viewer', async () => {
    const h = harness(); h.patch({ connected: false }); await h.push()
    h.client.url = route
    await h.dispatch('notificationclick', { notification: h.notifications[0] })
    expect(h.notifications[0].close).not.toHaveBeenCalled()
    expect(h.client.focus).toHaveBeenCalledOnce()
    expect(h.client.postMessage).toHaveBeenCalledWith({ type: 'chathermes.navigate', url: route })
  })
  it('accepts default profile and ignores stale WindowClient URL and focus', async () => {
    const h = harness(); h.patch({ profile: 'default', url: origin + '/chathermes?session=one' }); await h.push({ profile: 'default' }); expect(h.show).not.toHaveBeenCalled()
  })
  it('retains disconnected notifications then closes every matching tag on connection', async () => {
    const h = harness(); h.patch({ connected: false }); await h.push(); await h.push({ type: 'approval' }); await h.push({ profile: 'beta' }); await h.push({ session_id: 'two' }); await h.push({ type: 'test', session_id: '' })
    await h.update(); expect(h.notifications.every(n => n.close.mock.calls.length === 0)).toBe(true)
    h.patch({ connected: true }); await h.update()
    expect(h.notifications.map(n => n.close.mock.calls.length)).toEqual([1, 1, 0, 0, 0])
  })
  it('rechecks after display to close a notification racing connection', async () => {
    const h = harness(); h.patch({ connected: false }); h.show.mockImplementationOnce(async (_title, options) => {
      h.notifications.push({ ...options, close: vi.fn() }); h.patch({ connected: true }); void h.update()
    }); await h.push(); expect(h.notifications[0].close).toHaveBeenCalled()
  })
  it('does not trust unsolicited stale state when the current handshake disagrees', async () => {
    const h = harness(); h.patch({ connected: false }); await h.push(); h.patch({ connected: true }); h.setClients([]); await h.update(); expect(h.notifications[0].close).not.toHaveBeenCalled()
  })
  it.each([
    ['disconnect', 'delayed'], ['disconnect', 'timeout'],
    ['navigation', 'delayed'], ['navigation', 'timeout'],
    ['unmount', 'delayed'], ['unmount', 'timeout'],
    ['removed client', 'delayed'], ['removed client', 'timeout'],
  ].flatMap(([change, handshake]) => ['push', 'update'].map(operation => [change, handshake, operation])))('retains notifications after a positive reply followed by %s during a second client %s (%s)', async (change, handshake, operation) => {
    vi.useFakeTimers()
    try {
      const h = harness()
      h.patch({ connected: false }); await h.push()
      const existing = h.notifications[0]
      h.patch({ connected: true })
      const slow = { id: 'slow', url: origin + '/other-dashboard-view', postMessage: (_message: any, ports: any[]) => {
        setTimeout(() => {
          if (change === 'disconnect') h.patch({ connected: false })
          if (change === 'navigation') h.patch({ url: origin + '/chathermes?view=scheduled' })
          if (change === 'unmount') h.setState(null)
          if (change === 'removed client') h.setClients([slow])
        }, 50)
        if (handshake === 'delayed') setTimeout(() => ports[0].postMessage({ connected: false }), 200)
      } }
      h.setClients([h.client, slow])
      const pending = operation === 'push' ? h.push() : h.update()
      await vi.advanceTimersByTimeAsync(1500)
      await pending
      expect(h.show).toHaveBeenCalledTimes(operation === 'push' ? 2 : 1)
      expect(existing.close).not.toHaveBeenCalled()
      if (operation === 'push') expect(h.notifications[1].close).not.toHaveBeenCalled()
    } finally { vi.useRealTimers() }
  })
  it.each(['delayed', 'timeout'].flatMap(handshake => ['push', 'update'].map(operation => [handshake, operation])))('rejects an early second-round positive aged by another positive candidate %s (%s)', async (handshake, operation) => {
    vi.useFakeTimers()
    try {
      const h = harness()
      h.patch({ connected: false }); await h.push()
      const existing = h.notifications[0]
      h.patch({ connected: true })
      let queries = 0
      const slow = { id: 'slow', url: origin + '/other-view', postMessage: (_message: any, ports: any[]) => {
        queries++
        if (queries === 1) {
          ports[0].postMessage({ type: 'chathermes.session', url: route, profile: 'alpha', session: 'one', connected: true })
          return
        }
        setTimeout(() => h.patch({ connected: false }), 50)
        if (handshake === 'delayed') setTimeout(() => ports[0].postMessage({ connected: false }), 200)
      } }
      h.setClients([h.client, slow])
      const pending = operation === 'push' ? h.push() : h.update()
      await vi.advanceTimersByTimeAsync(2500)
      await pending
      expect(h.show).toHaveBeenCalledTimes(operation === 'push' ? 2 : 1)
      expect(existing.close).not.toHaveBeenCalled()
      if (operation === 'push') expect(h.notifications[1].close).not.toHaveBeenCalled()
    } finally { vi.useRealTimers() }
  })
  it.each(['push', 'update'])('rechecks connection after getNotifications is pending during %s', async operation => {
    const h = harness()
    h.patch({ connected: false }); await h.push()
    const existing = h.notifications[0]
    h.patch({ connected: true })
    let release!: () => void
    let started!: () => void
    const waiting = new Promise<void>(resolve => { started = resolve })
    h.getNotifications.mockImplementationOnce(() => new Promise(resolve => {
      release = () => resolve(h.notifications)
      started()
    }))
    const pending = operation === 'push' ? h.push() : h.update()
    await waiting
    h.patch({ connected: false })
    release()
    await pending
    expect(h.show).toHaveBeenCalledTimes(operation === 'push' ? 2 : 1)
    expect(existing.close).not.toHaveBeenCalled()
  })
  it('always displays test notifications and preserves bounded chat body', async () => {
    const h = harness(); await h.push({ type: 'test', session_id: '', body: 'x'.repeat(200) }); expect(h.show).toHaveBeenCalledOnce(); expect(h.notifications[0].body).toHaveLength(160)
  })
})
