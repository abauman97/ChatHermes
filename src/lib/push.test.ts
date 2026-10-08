import { afterEach, describe, expect, it, vi } from 'vitest'
import { notificationUrl, supported, state, sendTest } from './push'

describe('push support', () => {
  afterEach(() => vi.unstubAllGlobals())
  it('sends explicit tests through the authenticated profile route', async () => {
    const fetch = vi.fn(async () => new Response('{}'))
    vi.stubGlobal('fetch', fetch)
    await sendTest('alpha')
    expect(fetch).toHaveBeenCalledWith('/api/plugins/chathermes/push/test?profile=alpha', { method: 'POST', credentials: 'same-origin' })
    fetch.mockResolvedValue(new Response('{}', { status: 503 }))
    await expect(sendTest('beta')).rejects.toThrow('Could not send a test notification.')
  })
  it('detects secure Push API availability', () => {
    vi.stubGlobal('window', { isSecureContext: true, PushManager: class {} })
    vi.stubGlobal('navigator', { serviceWorker: {} })
    vi.stubGlobal('Notification', { permission: 'default' })
    expect(supported()).toBe(true)
  })
  it('rejects insecure or missing Push API', () => {
    vi.stubGlobal('window', { isSecureContext: false, PushManager: class {} })
    vi.stubGlobal('navigator', { serviceWorker: {} })
    vi.stubGlobal('Notification', { permission: 'default' })
    expect(supported()).toBe(false)
  })
  it('builds deep links using the existing profile/session query contract', () => {
    vi.stubGlobal('location', { origin: 'https://chat.test' })
    expect(notificationUrl('alpha', 'sess_123')).toBe('/chathermes?profile=alpha&session=sess_123')
  })
  it('shows server unavailability even when the config request succeeds', async () => {
    vi.stubGlobal('window', { isSecureContext: true, PushManager: class {} })
    vi.stubGlobal('navigator', { serviceWorker: { register: vi.fn(async () => ({ pushManager: { getSubscription: async () => null } })) } })
    vi.stubGlobal('Notification', { permission: 'default' })
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ available: false, vapid_public_key: null }))))
    expect(await state()).toEqual({ supported: true, permission: 'default', subscribed: false, available: false, error: 'Push notifications are unavailable on this server.' })
  })
})


describe('profile registrations share one browser subscription', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules() })
  it('reads stored status, saves the accepted shape, and disables only the selected profile ID', async () => {
    vi.resetModules()
    const push = await import('./push')
    const subscription = { endpoint: 'https://push.test/device', toJSON: () => ({ endpoint: 'https://push.test/device', expirationTime: null, keys: { p256dh: 'key', auth: 'auth' } }), unsubscribe: vi.fn() }
    const manager = { getSubscription: vi.fn(async () => subscription), subscribe: vi.fn(async () => subscription) }
    vi.stubGlobal('window', { isSecureContext: true, PushManager: class {} })
    vi.stubGlobal('navigator', { serviceWorker: { register: vi.fn(async () => ({ pushManager: manager })) } })
    vi.stubGlobal('Notification', { permission: 'granted', requestPermission: vi.fn(async () => 'granted') })
    const registrations = new Map<string, string>([['alpha', 'alpha_id']])
    const fetch = vi.fn(async (input: string, init?: RequestInit) => {
      const url = new URL(input, 'https://chat.test'), profile = url.searchParams.get('profile') || 'default'
      if (url.pathname.endsWith('/config')) return new Response(JSON.stringify({ available: true, vapid_public_key: 'YWJj' }))
      if (url.pathname.endsWith('/status')) return new Response(JSON.stringify({ enabled: registrations.has(profile), id: registrations.get(profile) || null }))
      if (init?.method === 'DELETE') registrations.delete(profile)
      else registrations.set(profile, profile + '_id')
      return new Response('{}')
    })
    vi.stubGlobal('fetch', fetch)
    expect((await push.state('alpha')).subscribed).toBe(true)
    expect((await push.state('beta')).subscribed).toBe(false)
    await push.subscribe('beta')
    expect(fetch).toHaveBeenCalledWith('/api/plugins/chathermes/push/subscriptions?profile=beta', expect.objectContaining({ credentials: 'same-origin', body: JSON.stringify({ endpoint: subscription.endpoint, keys: subscription.toJSON().keys }) }))
    await push.unsubscribe('alpha')
    expect(fetch).toHaveBeenCalledWith('/api/plugins/chathermes/push/subscriptions/alpha_id?profile=alpha', { method: 'DELETE', credentials: 'same-origin' })
    expect((await push.state('alpha')).subscribed).toBe(false)
    expect((await push.state('beta')).subscribed).toBe(true)
    expect(subscription.unsubscribe).not.toHaveBeenCalled()
    fetch.mockResolvedValue(new Response('{}', { status: 503 }))
    await expect(push.unsubscribe('beta')).rejects.toThrow('Could not load notification status')
    expect(subscription.unsubscribe).not.toHaveBeenCalled()
  })
})
