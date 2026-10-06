import { afterEach, describe, expect, it, vi } from 'vitest'
import { notificationUrl, supported } from './push'

describe('push support', () => {
  afterEach(() => vi.unstubAllGlobals())
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
})
