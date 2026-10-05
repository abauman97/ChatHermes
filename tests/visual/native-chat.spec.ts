import { signIn } from './login'
import { expect, test, type Page } from '@playwright/test'
// Real authenticated plugin socket and runtime; never record ticket frames in traces.
test.use({ trace: 'off' })
async function login(page: Page) {
  await signIn(page, '/chathermes')
  await expect(page.locator('.chathermes-embedded')).toBeVisible()
}
test('first home send attaches natively, completes and persists without a Runs fallback', async ({ page }, info) => {
  let submits = 0, runs = 0
  const attachErrors: unknown[] = []
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().includes('/v1/runs')) runs++
  })
  page.on('websocket', socket => {
    if (!socket.url().includes('/chathermes/chat/ws')) return
    const attaches = new Set<string>()
    socket.on('framesent', frame => {
      const value = JSON.parse(String(frame.payload))
      if (value.method === 'chat.attach') attaches.add(value.id)
      if (value.method === 'chat.submit') submits++
    })
    socket.on('framereceived', frame => {
      const value = JSON.parse(String(frame.payload))
      if (attaches.has(value.id) && value.error) attachErrors.push(value.error)
    })
  })
  await login(page)
  const plugin = page.locator('.chathermes-embedded')
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.click(); await expect(composer).toBeFocused()
  await composer.fill('First native home send regression [tool] [activity-hold]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('.activity[open]').first()).toBeVisible({ timeout: 30000 })
  await expect(plugin.locator('.message.assistant').last()).toContainText('Isolated Hermes reply', { timeout: 30000 })
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  expect(attachErrors).toEqual([]); expect(submits).toBe(1); expect(runs).toBe(0)
  await expect(plugin.getByRole('alert')).toHaveCount(0)
  await expect(plugin.locator('.message.user')).toHaveCount(1)
  await expect(plugin.locator('.activity[open]')).toHaveCount(0)
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: info.outputPath('first-send-native-completed.png') })
  await page.reload()
  await expect(plugin.locator('.message.user')).toHaveCount(1)
  await expect(plugin.locator('.message.assistant').last()).toContainText('Isolated Hermes reply')
  expect(submits).toBe(1)
  await page.screenshot({ path: info.outputPath('first-send-native-saved.png') })
})

test('browser absence recovers more than 512 native events while a tool is still running', async ({ page }, info) => {
  let boundary = 0, runs = 0
  page.on('request', request => { if (request.url().includes('/v1/runs')) runs++ })
  page.on('websocket', socket => {
    if (!socket.url().includes('/chathermes/chat/ws')) return
    socket.on('framereceived', frame => {
      const value = JSON.parse(String(frame.payload))
      if (value.result?.recovery) boundary = value.result.recovery.through
    })
  })
  await login(page)
  const plugin = page.locator('.chathermes-embedded')
  await plugin.getByRole('textbox', { name: 'Message Hermes' }).fill('Retained browser absence probe [recovery-burst]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('.activity pre').first()).toContainText('Checking the isolated test request', { timeout: 15000 })
  const url = page.url()
  await page.goto('about:blank')
  // Deliberately exceed the native orphan grace with no browser subscriber.
  await page.waitForTimeout(26000)
  await page.goto(url)
  await expect(plugin.getByRole('button', { name: 'Stop response' })).toBeVisible()
  await expect.poll(() => boundary).toBeGreaterThan(512)
  const thinking = plugin.locator('.activity').filter({ hasText: 'checkpoint-599' })
  await expect(thinking).toHaveCount(1)
  await thinking.locator('summary').click()
  await expect(thinking.locator('pre')).toContainText('checkpoint-000')
  await expect(thinking.locator('pre')).toContainText('checkpoint-599')
  expect((await thinking.locator('pre').textContent())!.match(/checkpoint-000/g)).toHaveLength(1)
  await expect(plugin.locator('.message.user')).toHaveCount(1)
  await expect(plugin.locator('.activity[open]').filter({ hasText: 'Running command' })).toHaveCount(1)
  await page.screenshot({ path: info.outputPath('native-burst-recovered.png') })
  await thinking.locator('summary').click()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Tool completed successfully', { timeout: 45000 })
  await expect(plugin.locator('.activity[open]')).toHaveCount(0)
  expect(runs).toBe(0)
  await page.reload()
  await expect(plugin.locator('.message.user')).toHaveCount(1)
  await expect(plugin.locator('.message.assistant').last()).toContainText('Tool completed successfully')
})
test('native Other turn reload, second viewer, guidance, stop and persisted history', async ({ page, context }, info) => {
  const plugin = page.locator('.chathermes-embedded')
  let submits = 0, runs = 0
  page.on('websocket', socket => {
    if (!socket.url().includes('/chathermes/chat/ws')) return
    socket.on('framesent', frame => {
      const value = JSON.parse(String(frame.payload))
      if (value.method === 'chat.submit') submits++
    })
  })
  page.on('request', req => { if (req.method() === 'POST' && req.url().includes('/v1/runs')) runs++ })
  await login(page)
  const caps = await (await page.request.get('/api/plugins/chathermes/chat/capabilities')).json()
  expect(caps).toMatchObject({ mode: 'native-retained', admission: true, features: { busy_send: 'explicit', images: true } })
  if (info.project.name === 'mobile') await plugin.getByRole('button', { name: 'Open navigation' }).click()
  await plugin.getByRole('button', { name: 'New chat', exact: true }).click()
  await expect.poll(() => new URL(page.url()).searchParams.get('session')).toBeTruthy()
  await expect(plugin.getByText('Loading conversation…', { exact: true })).toHaveCount(0)
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.fill('Native recovery probe [hold-run] [long-run]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.getByRole('button', { name: 'Stop response' })).toBeVisible()
  await expect.poll(() => submits).toBe(1)
  await expect(plugin.locator('.activity pre').first()).toContainText('Checking the isolated test request', { timeout: 15000 })
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('chathermes.native-outcome:')).length)).toBe(0)
  await composer.fill('editable draft'); await expect(composer).toHaveValue('editable draft')
  const url = page.url()
  expect(new URL(url).searchParams.get('session')).toBeTruthy()
  await page.reload()
  await expect(plugin.getByRole('button', { name: 'Stop response' })).toBeVisible()
  await expect(plugin.locator('.message.user')).toHaveCount(1)
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: info.outputPath('native-recovered.png') })
  const other = await context.newPage(); await other.goto(url)
  await expect(other.locator('.chathermes-embedded').getByRole('button', { name: 'Stop response' })).toBeVisible()
  await composer.fill('Keep the reply brief')
  await plugin.getByRole('button', { name: 'Guide this run', exact: true }).click()
  await expect(composer).toHaveValue('')
  await expect(plugin.locator('.message.user').last()).toContainText('Keep the reply brief')
  await plugin.getByRole('button', { name: 'Stop response' }).click()
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible({ timeout: 60000 })
  await other.close()
  expect(submits).toBe(1); expect(runs).toBe(0)
  await page.reload()
  await expect(plugin.locator('.message.user').first()).toContainText('Native recovery probe')
  await composer.fill('Native saved tool probe [tool] [activity-hold]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect.poll(() => submits).toBe(2)
  // Foregrounding must not replace an outstanding admission coroutine.
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
  await expect(plugin.locator('.activity[open]').first()).toBeVisible()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Isolated Hermes reply', { timeout: 60000 })
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await expect(plugin.locator('.activity[open]')).toHaveCount(0)
  await page.screenshot({ path: info.outputPath('native-completed.png') })
  await page.reload()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Isolated Hermes reply')
  expect(submits).toBe(2); expect(runs).toBe(0)
})

test('native clarification survives reload and answers through the attached socket', async ({ page }, info) => {
  await login(page)
  const plugin = page.locator('.chathermes-embedded')
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.fill('Please ask two fixture questions [clarify]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('label').filter({ hasText: 'Choose a fixture colour' })).toBeVisible({ timeout: 30000 })
  await page.reload()
  await expect(plugin.locator('label').filter({ hasText: 'Choose a fixture colour' })).toBeVisible()
  await plugin.locator('label').filter({ hasText: 'Choose a fixture colour' }).locator('select').selectOption({ label: 'Blue (Recommended)' })
  await plugin.locator('label').filter({ hasText: 'Name this fixture' }).locator('input').fill('Synthetic fixture')
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: info.outputPath('native-clarification.png') })
  await plugin.getByRole('button', { name: 'Submit answers' }).click()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Isolated Hermes reply', { timeout: 30000 })
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
})
test('native dangerous command approval survives reload and denial settles once', async ({ page }, info) => {
  await login(page)
  const plugin = page.locator('.chathermes-embedded')
  await plugin.getByRole('textbox', { name: 'Message Hermes' }).fill('Ask before removing the synthetic fixture [approval]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.getByRole('button', { name: 'Deny', exact: true })).toBeVisible({ timeout: 30000 })
  await page.reload()
  await expect(plugin.getByRole('button', { name: 'Deny', exact: true })).toBeVisible()
  await page.screenshot({ path: info.outputPath('native-approval.png') })
  await plugin.getByRole('button', { name: 'Deny', exact: true }).click()
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible({ timeout: 30000 })
})

test('native model selection, image admission and authenticated durable image reopen', async ({ page, browser }, info) => {
  await login(page)
  const plugin = page.locator('.chathermes-embedded')
  await plugin.getByRole('button', { name: 'Choose model' }).click()
  await plugin.locator('[data-provider=litellm]').click()
  await plugin.getByRole('button', { name: 'fixture-model-2', exact: true }).click()
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=', 'base64')
  await plugin.locator('input[capture]').setInputFiles({ name: 'camera.png', mimeType: 'image/png', buffer: image })
  await plugin.getByRole('textbox', { name: 'Message Hermes' }).fill('Native selected model and camera probe [model-probe] [image-probe]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Runtime model: fixture-model-2', { timeout: 30000 })
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await page.reload()
  const saved = plugin.locator('.message.user img').last()
  await expect(saved).toBeVisible()
  await expect.poll(() => saved.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBe(1)
  const path = await saved.getAttribute('src')
  expect(path).toMatch(/^\/api\/plugins\/chathermes\/images\/[a-f0-9]{32}\.png/)
  const fetched = await page.request.get(path!)
  expect(fetched.status()).toBe(200)
  expect(await fetched.body()).toEqual(image)
  expect((await page.request.get(path! + '?profile=test-profile')).status()).toBe(404)
  const anonymous = await browser.newContext({ baseURL: info.project.use.baseURL })
  expect((await anonymous.request.get(path!)).status()).toBe(401)
  await anonymous.close()
  await page.screenshot({ path: info.outputPath('native-image-saved.png') })
})

test('lost native submit acknowledgement remains outcome unknown and never resubmits', async ({ page }, info) => {
  let submits = 0
  page.on('websocket', socket => socket.on('framesent', frame => {
    const value = JSON.parse(String(frame.payload))
    if (value.method === 'chat.submit') submits++
  }))
  await page.addInitScript(() => {
    const Socket = window.WebSocket
    class LostAckSocket extends Socket {
      submitId?: string
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols)
        if (!new URL(String(url)).pathname.endsWith('/chathermes/chat/ws')) return
        this.addEventListener('message', event => {
          const value = JSON.parse(event.data)
          if (this.submitId && value.id === this.submitId && !value.method) {
            event.stopImmediatePropagation()
            this.close()
          }
        })
      }
      override send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (typeof data === 'string') {
          const value = JSON.parse(data)
          if (value.method === 'chat.submit') this.submitId = value.id
        }
        super.send(data)
      }
    }
    window.WebSocket = LostAckSocket
  })
  await login(page)
  const plugin = page.locator('.chathermes-embedded')
  await plugin.getByRole('textbox', { name: 'Message Hermes' }).fill('Lost native acknowledgement fixture [hold-run]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.getByRole('alert')).toContainText('Submission outcome unknown', { timeout: 30000 })
  await page.reload()
  await expect(plugin.getByRole('alert')).toContainText('Submission outcome unknown')
  await expect(plugin.locator('.message.user')).toHaveCount(1)
  await plugin.getByRole('textbox', { name: 'Message Hermes' }).click()
  await expect(plugin.getByRole('textbox', { name: 'Message Hermes' })).toBeFocused()
  expect(submits).toBe(1)
  await page.screenshot({ path: info.outputPath('native-outcome-unknown.png') })
})


test('first send with unavailable native attach is not submitted and stays editable', async ({ page }, info) => {
  let submits = 0
  page.on('websocket', socket => socket.on('framesent', frame => {
    if (JSON.parse(String(frame.payload)).method === 'chat.submit') submits++
  }))
  await page.addInitScript(() => {
    const Socket = window.WebSocket
    ;(window as any).chathermesFailAttach = true
    class UnavailableAttach extends Socket {
      override send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if ((window as any).chathermesFailAttach && typeof data === 'string' && JSON.parse(data).method === 'chat.attach') {
          this.close()
          return
        }
        super.send(data)
      }
    }
    window.WebSocket = UnavailableAttach
  })
  await login(page)
  const plugin = page.locator('.chathermes-embedded')
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.fill('First-send attach failure regression')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.getByRole('alert')).toContainText('Message not submitted')
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('chathermes.native-outcome:')).length)).toBe(0)
  expect(submits).toBe(0)
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: info.outputPath('first-send-attach-unavailable.png') })
  await page.evaluate(() => { (window as any).chathermesFailAttach = false })
  await composer.fill('Retry after restored native attachment')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Isolated Hermes reply', { timeout: 30000 })
  expect(submits).toBe(1)
  await expect(plugin.locator('.message.user')).toHaveCount(1)
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await expect(plugin.locator('.activity[open]')).toHaveCount(0)
  await page.screenshot({ path: info.outputPath('first-send-attach-recovered.png') })
})
