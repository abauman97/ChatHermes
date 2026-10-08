const APP_URL = '/chathermes'

// Never cache WindowClient URLs or connection state: both can outlive SPA routes.
function currentSession(client) {
  return new Promise(resolve => {
    if (client.visibilityState !== 'visible') return resolve(null)
    const channel = new MessageChannel()
    const finish = value => { clearTimeout(timer); channel.port1.close(); channel.port2.close(); resolve(value) }
    const timer = setTimeout(() => finish(null), 300)
    channel.port1.onmessage = event => finish(client.visibilityState === 'visible' ? visibleSession(event.data) : null)
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

function visibleSession(data) {
  if (data?.type !== 'chathermes.session' || data.connected !== true || data.visible !== true || typeof data.url !== 'string') return null
  const route = routeSession(data.url)
  return route && route.profile === data.profile && route.session === data.session ? route : null
}

async function windowClients() {
  try { return await self.clients.matchAll({ type: 'window', includeUncontrolled: true }) } catch { return [] }
}

async function visibleSessions(onVisible = () => false) {
  const clients = await windowClients()
  const sameOrigin = client => {
    try { return new URL(client.url).origin === self.location.origin } catch { return false }
  }
  const candidates = (await Promise.all(clients.filter(sameOrigin).map(async client => ({ id: client.id, session: await currentSession(client) })))).filter(reply => reply.session)
  if (!candidates.length) return []
  // An early positive may have become hidden or disconnected while another client timed out.
  // Re-query only positive candidates that still exist after every handshake.
  const currentClients = await windowClients()
  const confirmed = (await Promise.all(currentClients.filter(sameOrigin).filter(client => candidates.some(reply => reply.id === client.id))
    .map(async client => ({ id: client.id, session: await currentSession(client) })))).filter(reply => reply.session)
  const sessions = []
  // A positive in that round can age too. Confirm and act one client at a time:
  // never wait for another client's reply between confirmation and its action.
  for (const reply of confirmed) {
    const live = await windowClients()
    const client = live.find(client => client.id === reply.id && sameOrigin(client))
    if (!client) continue
    const session = await currentSession(client)
    if (!session || !matches(session, reply.session)) continue
    sessions.push(session)
    if (onVisible(session)) break
  }
  return sessions
}
const matches = (a, b) => a.profile === b.profile && a.session === b.session
async function closeVisibleNotifications(target) {
  // Fetch first: a pending notification lookup must not age a positive reply.
  const notifications = await self.registration.getNotifications().catch(() => [])
  let visible = false
  await visibleSessions(session => {
    for (const notification of notifications) {
      if (!notification.tag?.startsWith('chathermes:')) continue
      const route = routeSession(notification.data?.url)
      if (route && matches(session, route)) notification.close()
    }
    if (target && matches(session, target)) visible = true
    return visible
  })
  return target ? visible : true
}

// Serialize display and close operations; then re-query after display so a
// visible connection arriving during showNotification cannot leave a stale notification.
let notificationWork = Promise.resolve()
function enqueue(work) {
  const result = notificationWork.then(work)
  notificationWork = result.catch(() => {})
  return result
}
self.addEventListener('message', event => {
  if (event.data?.type !== 'chathermes.session' || !event.source?.id) return
  event.waitUntil(enqueue(async () => {
    await closeVisibleNotifications()
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
      if (await closeVisibleNotifications({ profile, session })) return
    }
    await self.registration.showNotification('ChatHermes', {
      body: typeof data.body === 'string' ? Array.from(data.body).slice(0, 3000).join('') : '',
      tag: typeof data.tag === 'string' && /^chathermes:[A-Za-z0-9_-]{1,220}$/.test(data.tag) ? data.tag : `chathermes:${profile}:${session}:${data.type}`,
      data: { url: url.href }, icon: '/api/plugins/chathermes/assets/dist/icons/icon-192.png', badge: '/api/plugins/chathermes/assets/dist/icons/icon-192.png',
    })
    if (data.type !== 'test') await closeVisibleNotifications()
  }))
})
self.addEventListener('notificationclick', event => {
  // Keep the notification until the destination session is visibly connected.
  const target = new URL(event.notification.data?.url || APP_URL, self.location.origin)
  if (target.origin !== self.location.origin || target.pathname !== APP_URL) return
  event.waitUntil((async () => {
    const clients = await windowClients()
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
