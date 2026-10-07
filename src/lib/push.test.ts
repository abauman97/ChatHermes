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
