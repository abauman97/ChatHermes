const APP_URL = '/chathermes'

// Never cache WindowClient URLs or connection state: both can outlive SPA routes.
function currentSession(client) {
  return new Promise(resolve => {
    const channel = new MessageChannel()
    const finish = value => { clearTimeout(timer); channel.port1.close(); channel.port2.close(); resolve(value) }
    const timer = setTimeout(() => finish(null), 300)
    channel.port1.onmessage = event => finish(connectedSession(event.data))
    try { client.postMessage({ type: 'chathermes.session.query' }, [channel.port2]) } catch { finish(null) }
  })
}

function routeSession(value) {
  try {
    const url = new URL(value)
    if (url.origin !== self.location.origin || url.pathname !== APP_URL || url.searchParams.has('view')
      || url.searchParams.getAll('profile').length > 1 || url.searchParams.getAll('session').length !== 1) return null
    const profile = url.searchParams.get('profile') || 'default', session = url.searchParams.get('session')
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(profile) || !/^[A-Za-z0-9_-]{1,128}$/.test(session)) return null
    return { profile, session }
  } catch { return null }
}

function connectedSession(data) {
  if (data?.type !== 'chathermes.session' || data.connected !== true || typeof data.url !== 'string') return null
  const route = routeSession(data.url)
  return route && route.profile === data.profile && route.session === data.session ? route : null
}

async function connectedSessions() {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  return (await Promise.all(clients.filter(client => {
    try { return new URL(client.url).origin === self.location.origin } catch { return false }
  }).map(currentSession))).filter(Boolean)
}
const matches = (a, b) => a.profile === b.profile && a.session === b.session
async function closeConnectedNotifications(sessions) {
  if (!sessions.length) return
  const notifications = await self.registration.getNotifications()
  for (const notification of notifications) {
    if (!notification.tag?.startsWith('chathermes:')) continue
    const session = routeSession(notification.data?.url)
    if (session && sessions.some(open => matches(open, session))) notification.close()
  }
}

// Serialize display and close operations; then re-query after display so a
// connection arriving during showNotification cannot leave a stale notification.
let notificationWork = Promise.resolve()
function enqueue(work) {
  const result = notificationWork.then(work)
  notificationWork = result.catch(() => {})
  return result
}
self.addEventListener('message', event => {
  if (event.data?.type !== 'chathermes.session' || !event.source?.id) return
  event.waitUntil(enqueue(async () => {
    await closeConnectedNotifications(await connectedSessions())
  }))
})

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('push', event => {
  let data
  try { data = event.data?.json() } catch { return }
  if (!data || data.title !== 'ChatHermes' || !['turn.complete', 'approval', 'clarify', 'attention', 'test'].includes(data.type)) return
  const profile = typeof data.profile === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(data.profile) ? data.profile : ''
  const session = typeof data.session_id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(data.session_id) ? data.session_id : ''
  if (!session && data.type !== 'test') return
  const url = new URL(APP_URL, self.location.origin)
  if (profile) url.searchParams.set('profile', profile)
  if (session) url.searchParams.set('session', session)
  event.waitUntil(enqueue(async () => {
    if (data.type !== 'test' && profile) {
      const sessions = await connectedSessions()
      if (sessions.some(open => matches(open, { profile, session }))) {
        await closeConnectedNotifications(sessions)
        return
      }
    }
    await self.registration.showNotification('ChatHermes', {
      body: typeof data.body === 'string' ? data.body.slice(0, 160) : 'Hermes needs your attention.',
      tag: typeof data.tag === 'string' && /^chathermes:[A-Za-z0-9_-]{1,220}$/.test(data.tag) ? data.tag : `chathermes:${profile}:${session}:${data.type}`,
      data: { url: url.href }, icon: '/api/plugins/chathermes/assets/dist/icons/icon-192.png', badge: '/api/plugins/chathermes/assets/dist/icons/icon-192.png',
    })
    if (data.type !== 'test') await closeConnectedNotifications(await connectedSessions())
  }))
})
self.addEventListener('notificationclick', event => {
  // Keep the notification until the destination session actually connects.
  const target = new URL(event.notification.data?.url || APP_URL, self.location.origin)
  if (target.origin !== self.location.origin || target.pathname !== APP_URL) return
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of clients) {
      if (new URL(client.url).origin === target.origin && new URL(client.url).pathname === APP_URL) {
        await client.focus()
        client.postMessage({ type: 'chathermes.navigate', url: target.href })
        return
      }
    }
    await self.clients.openWindow(target.href)
  })())
})
