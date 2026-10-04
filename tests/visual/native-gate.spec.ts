import { signIn } from './login'
import { expect, test, type Page } from '@playwright/test'
// Do not retain host-issued single-use credentials in traces.
test.use({ trace: 'off' })
async function login(page: Page) {
  await signIn(page, '/chathermes')
  await expect(page.locator('.chathermes-embedded')).toBeVisible()
}
async function connect(page: Page, ticket: string, extra = '') {
  return page.evaluate(({ ticket, extra }) => new Promise<{ accepted: boolean; admission?: boolean; error?: number }>(resolve => {
    const url = new URL('/api/plugins/chathermes/chat/ws' + extra, location.href)
    url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(url, ['hermes-gateway-v1', `hermes-gateway-ticket.${ticket}`])
    let accepted = false
    const timer = setTimeout(() => { ws.close(); resolve({ accepted }) }, 5000)
    ws.onopen = () => { accepted = true; ws.send(JSON.stringify({ jsonrpc: '2.0', id: 'probe', method: 'chat.capabilities' })) }
    ws.onmessage = event => {
      const frame = JSON.parse(event.data)
      if (frame.id === 'probe') {
        clearTimeout(timer); ws.close()
        resolve({ accepted, admission: frame.result?.admission, error: frame.error?.code })
      }
    }
    ws.onclose = () => { clearTimeout(timer); resolve({ accepted }) }
    ws.onerror = () => { /* onclose settles without logging credential-bearing errors */ }
  }), { ticket, extra })
}
async function ticket(page: Page) {
  const response = await page.request.post('/api/auth/ws-ticket')
  expect(response.status()).toBe(200)
  return (await response.json()).ticket as string
}
test('native gate uses host tickets, refuses reused credentials and reports bounded native guarantees', async ({ page, browser }, info) => {
  const anonymous = await browser.newContext({ baseURL: test.info().project.use.baseURL })
  expect((await anonymous.request.get('/api/plugins/chathermes/chat/capabilities')).status()).toBe(401)
  await anonymous.close()
  await login(page)
  const result = await page.request.get('/api/plugins/chathermes/chat/capabilities')
  expect(result.status()).toBe(200)
  expect(await result.json()).toMatchObject({ protocol: 'chathermes.chat.v1', mode: 'native-bounded', admission: true })
  const issued = await ticket(page)
  expect(await connect(page, issued)).toEqual({ accepted: true, admission: true })
  expect(await connect(page, issued)).toEqual({ accepted: false })
  const profileTicket = await ticket(page)
  expect(await connect(page, profileTicket, '?profile=does-not-exist')).toEqual({ accepted: false })
  expect(await connect(page, profileTicket, '?profile=test-profile')).toEqual({ accepted: true, admission: true })
  const textarea = page.getByRole('textbox', { name: 'Message Hermes' })
  await textarea.click(); await expect(textarea).toBeFocused()
  await page.screenshot({ path: info.outputPath('native-gate-home.png') })
})
test('cross-site and query-credential upgrades fail before ticket consumption', async ({ page, context }) => {
  await login(page)
  const issued = await ticket(page)
  expect(await connect(page, issued, '?ticket=forbidden-query')).toEqual({ accepted: false })
  const foreign = await context.newPage()
  await foreign.route('https://foreign.test/', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Origin test</title>' }))
  await foreign.goto('https://foreign.test/')
  const endpoint = new URL('/api/plugins/chathermes/chat/ws', page.url())
  endpoint.protocol = endpoint.protocol === 'https:' ? 'wss:' : 'ws:'
  expect(await foreign.evaluate(({ url, ticket }) => new Promise<boolean>(resolve => {
    const socket = new WebSocket(url, ['hermes-gateway-v1', `hermes-gateway-ticket.${ticket}`])
    socket.onopen = () => { socket.close(); resolve(true) }
    socket.onclose = () => resolve(false)
    socket.onerror = () => { /* do not log credential */ }
  }), { url: endpoint.href, ticket: issued })).toBe(false)
  await foreign.close()
  expect(await connect(page, issued)).toEqual({ accepted: true, admission: true })
})

test('native socket refuses another profile stored session before resume adoption', async ({ page }) => {
  await login(page)
  const made = await page.request.post('/api/plugins/chathermes/chat/sessions')
  expect(made.status()).toBe(200)
  const stored = (await made.json()).session.id
  const issued = await ticket(page)
  const code = await page.evaluate(({ ticket, stored }) => new Promise<number>(resolve => {
    const url = new URL('/api/plugins/chathermes/chat/ws?profile=test-profile', location.href)
    url.protocol = 'ws:'
    const socket = new WebSocket(url, ['hermes-gateway-v1', 'hermes-gateway-ticket.' + ticket])
    const timer = setTimeout(() => { socket.close(); resolve(0) }, 10000)
    socket.onopen = () => socket.send(JSON.stringify({ jsonrpc: '2.0', id: 'foreign', method: 'chat.attach', params: { session_id: stored } }))
    socket.onmessage = event => {
      const frame = JSON.parse(event.data)
      if (frame.id === 'foreign') { clearTimeout(timer); socket.close(); resolve(frame.error?.code || 0) }
    }
    socket.onerror = () => { /* no credential logging */ }
  }), { ticket: issued, stored })
  expect(code).toBe(404)
})
