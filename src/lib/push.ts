export interface PushState {
  supported: boolean
  permission: NotificationPermission | 'unsupported'
  subscribed: boolean
  available: boolean
  error: string
}

const root = '/api/plugins/chathermes'
let registrationPromise: Promise<ServiceWorkerRegistration> | undefined

export function notificationUrl(profile: string, session: string): string {
  const url = new URL('/chathermes', location.origin)
  if (profile) url.searchParams.set('profile', profile)
  url.searchParams.set('session', session)
  return url.pathname + url.search
}

export function supported(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext && typeof navigator !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && typeof Notification !== 'undefined'
}

export async function registration(): Promise<ServiceWorkerRegistration> {
  if (!supported()) throw new Error('Notifications require a secure browser with Push API support.')
  if (!registrationPromise) registrationPromise = navigator.serviceWorker.register('/api/plugins/chathermes/push-service-worker.js', { scope: '/chathermes', updateViaCache: 'none' })
    .catch(error => { registrationPromise = undefined; throw error })
  return registrationPromise
}

function decodeKey(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4))
  return Uint8Array.from(raw, char => char.charCodeAt(0))
}

async function config(): Promise<{ available: boolean; vapid_public_key?: string }> {
  const response = await fetch(root + '/push/config', { credentials: 'same-origin' })
  if (!response.ok) throw new Error('Push configuration unavailable')
  return response.json() as Promise<{ available: boolean; vapid_public_key?: string }>
}

async function current(): Promise<PushSubscription | null> {
  return (await registration()).pushManager.getSubscription()
}

async function profileStatus(profile: string, subscription: PushSubscription): Promise<{ enabled: boolean; id: string | null }> {
  const response = await fetch(root + '/push/status' + (profile ? '?profile=' + encodeURIComponent(profile) : ''), { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: subscription.endpoint }) })
  if (!response.ok) throw new Error('Could not load notification status for this profile.')
  return response.json()
}

export async function state(profile = ''): Promise<PushState> {
  if (!supported()) return { supported: false, permission: 'unsupported', subscribed: false, available: false, error: 'Notifications require HTTPS and a supported browser.' }
  try {
    const [subscription, settings] = await Promise.all([current(), config()])
    const saved = subscription ? await profileStatus(profile, subscription) : null
    return { supported: true, permission: Notification.permission, subscribed: saved?.enabled === true, available: settings.available, error: settings.available ? '' : 'Push notifications are unavailable on this server.' }
  } catch {
    return { supported: true, permission: Notification.permission, subscribed: false, available: false, error: 'Push notifications are unavailable on this server.' }
  }
}

export async function subscribe(profile: string): Promise<void> {
  if (!supported()) throw new Error('Notifications require HTTPS and a supported browser.')
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error(permission === 'denied' ? 'Notification permission is blocked in browser settings.' : 'Notification permission was not granted.')
  const sw = await registration()
  const settings = await config()
  if (!settings.available || !settings.vapid_public_key) throw new Error('Push notifications are unavailable on this server.')
  const subscription = await sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(settings.vapid_public_key) as BufferSource })
  const response = await fetch(root + '/push/subscriptions' + (profile ? '?profile=' + encodeURIComponent(profile) : ''), { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: subscription.endpoint, keys: subscription.toJSON().keys }) })
  if (!response.ok) throw new Error('Could not save this notification subscription.')
}

export async function unsubscribe(profile: string): Promise<void> {
  const subscription = await current()
  if (!subscription) return
  const saved = await profileStatus(profile, subscription)
  if (!saved.enabled || !saved.id) return
  const response = await fetch(root + '/push/subscriptions/' + encodeURIComponent(saved.id) + (profile ? '?profile=' + encodeURIComponent(profile) : ''), { method: 'DELETE', credentials: 'same-origin' })
  if (!response.ok) throw new Error('Could not disable notifications for this profile.')
  // One browser subscription can serve several independent profile registrations.
}

export async function sendTest(profile: string): Promise<void> {
  const response = await fetch(root + '/push/test' + (profile ? '?profile=' + encodeURIComponent(profile) : ''), { method: 'POST', credentials: 'same-origin' })
  if (!response.ok) throw new Error('Could not send a test notification.')
}
