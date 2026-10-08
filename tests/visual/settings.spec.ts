import { signIn } from './login'
import { expect, test } from '@playwright/test'

test('drawer has exactly one New chat immediately above Projects', async ({ page }, testInfo) => {
  await signIn(page)
  expect(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content')).toBe('yes')
  expect(await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content')).toBe('ChatHermes')
  const plugin = page.locator('.chathermes-embedded')
  const mobile = testInfo.project.name === 'mobile'
  if (mobile) await plugin.getByRole('button', { name: 'Open navigation' }).click()
  const navigation = plugin.getByRole('complementary', { name: 'Navigation' })
  const newChat = navigation.getByRole('button', { name: 'New chat', exact: true })
  const projects = navigation.getByRole('button', { name: 'Projects', exact: true })
  await expect(newChat).toHaveCount(1)
  await expect(newChat).toBeVisible()
  await expect(navigation.locator('.drawer-chat + .projects-nav')).toHaveCount(1)
  await expect(navigation.locator('.sidebar-foot .drawer-chat')).toHaveCount(0)
  const newChatBox = (await newChat.boundingBox())!
  expect(newChatBox.y + newChatBox.height).toBeLessThanOrEqual((await projects.boundingBox())!.y)
  await page.screenshot({ path: testInfo.outputPath('drawer-navigation.png') })
  await newChat.click()
  if (mobile) await expect(navigation).toHaveClass(/-translate-x-full/)
  const textarea = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await textarea.click()
  await expect(textarea).toBeFocused()
})

test('drawer settings and notifications', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile'
  const unauthorized = await page.request.get('/api/plugins/chathermes/push/config')
  expect(unauthorized.status()).toBe(401)
  expect((await page.request.post('/api/plugins/chathermes/push/test')).status()).toBe(401)
  await signIn(page)
  const config = await page.request.get('/api/plugins/chathermes/push/config')
  expect(config.status()).toBe(200)
  const pushConfig = await config.json()
  expect(pushConfig.available).toBe(true)
  expect(pushConfig.vapid_public_key).toHaveLength(87)
  expect(Object.keys(pushConfig).sort()).toEqual(['available', 'vapid_public_key'])
  expect(await (await page.request.get('/api/plugins/chathermes/push/config')).json()).toEqual(pushConfig)
  const worker = await page.request.get('/api/plugins/chathermes/push-service-worker.js')
  expect(worker.status()).toBe(200)
  expect(worker.headers()['service-worker-allowed']).toBe('/chathermes')
  expect(await worker.text()).toContain("addEventListener('push'")
  const manifest = await page.request.get('/api/plugins/chathermes/assets/dist/manifest.webmanifest')
  expect(manifest.status()).toBe(200)
  expect(manifest.headers()['content-type']).toContain('manifest')
  const pwaManifest = await manifest.json()
  expect(pwaManifest.scope).toBe('/chathermes')
  const icons = pwaManifest.icons.map((icon: { src: string }) => icon.src)
  expect(icons).toEqual([
    '/api/plugins/chathermes/assets/dist/icons/icon-192.png',
    '/api/plugins/chathermes/assets/dist/icons/icon-512.png',
  ])
  for (const asset of ['apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png']) {
    const response = await page.request.get('/api/plugins/chathermes/assets/dist/' + asset)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/png')
    if (asset === 'apple-touch-icon.png') {
      const logo = await page.request.get('/api/plugins/chathermes/assets/dist/icons/icon-192.png')
      expect(await response.body()).toEqual(await logo.body())
    }
  }
  const headLinks = await page.evaluate(() => Object.fromEntries(
    [...document.head.querySelectorAll('link[rel="manifest"], link[rel="apple-touch-icon"]')]
      .map(link => [link.getAttribute('rel'), link.getAttribute('href')]),
  ))
  expect(headLinks).toEqual({
    manifest: '/api/plugins/chathermes/assets/dist/manifest.webmanifest',
    'apple-touch-icon': '/api/plugins/chathermes/assets/dist/apple-touch-icon.png',
  })
  expect(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content')).toBe('yes')
  expect(await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content')).toBe('ChatHermes')
  const plugin = page.locator('.chathermes-embedded')

  if (mobile) await plugin.getByRole('button', { name: 'Open navigation' }).click()
  const navigation = plugin.getByRole('complementary', { name: 'Navigation' })
  const newChat = navigation.getByRole('button', { name: 'New chat', exact: true })
  const projects = navigation.getByRole('button', { name: 'Projects', exact: true })
  await expect(navigation.locator('.push-setting')).toHaveCount(0)
  await expect(navigation.getByRole('combobox', { name: 'Profile', exact: true })).toHaveCSS('font-size', '16px')
  const settings = navigation.getByRole('button', { name: 'Settings', exact: true })
  await settings.click()
  const panel = navigation.getByRole('dialog', { name: 'Settings', exact: true })
  await expect(panel).toBeFocused()
  await expect(settings).toHaveAttribute('aria-expanded', 'true')
  await expect(panel.getByRole('button', { name: 'Enable notifications' })).toBeVisible()
  const box = (await panel.boundingBox())!
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.y).toBeGreaterThanOrEqual(0)
  expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  await page.screenshot({ path: testInfo.outputPath('drawer-settings.png') })
  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(settings).toBeFocused()
  if (mobile) await expect(navigation).toHaveClass(/translate-x-0/)
  await settings.click()
  await panel.getByRole('button', { name: 'Close settings' }).click()
  await expect(settings).toBeFocused()
  await settings.click()
  await projects.click()
  await expect(panel).toHaveCount(0)
  if (mobile) await plugin.getByRole('button', { name: 'Open navigation' }).click()
  await newChat.click()
  if (mobile) await expect(navigation).toHaveClass(/-translate-x-full/)
  const textarea = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await textarea.click()
  await expect(textarea).toBeFocused()
  await page.screenshot({ path: testInfo.outputPath('new-chat.png') })
})

test('ChatHermes PWA branding tags are injected on mount and cleaned up on unmount', async ({ page }) => {
  await signIn(page)
  const pluginAssets = '/api/plugins/chathermes/assets/dist/'
  const manifestLink = page.locator('link[rel="manifest"]')
  const appleIconLink = page.locator('link[rel="apple-touch-icon"]')
  const appleTitle = page.locator('meta[name="apple-mobile-web-app-title"]')
  await expect(manifestLink).toHaveAttribute('href', pluginAssets + 'manifest.webmanifest')
  await expect(appleIconLink).toHaveAttribute('href', pluginAssets + 'apple-touch-icon.png')
  await expect(appleTitle).toHaveAttribute('content', 'ChatHermes')
  const clean = await page.evaluate(() => {
    const ownedTags = [...document.head.querySelectorAll(
      'link[rel="manifest"], link[rel="apple-touch-icon"], meta[name="apple-mobile-web-app-title"]',
    )].filter(tag => tag.getAttribute('data-chathermes-pwa') === 'true')
    for (const tag of ownedTags) tag.removeAttribute('data-chathermes-pwa')
    return ownedTags.length
  })
  await page.evaluate(() => document.querySelector('.chathermes-embedded')?.parentElement?.remove())
  await expect(manifestLink).toHaveCount(0)
  await expect(appleIconLink).toHaveCount(0)
  await expect(appleTitle).toHaveCount(0)
  expect(clean).toBe(0)
})

test('compact black drawer and screen menu dismissal preserve focus and actions', async ({ page }, testInfo) => {
  await signIn(page)
  expect(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content')).toBe('yes')
  expect(await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content')).toBe('ChatHermes')
  const plugin = page.locator('.chathermes-embedded')
  await expect(plugin).toHaveCSS('background-color', 'rgb(0, 0, 0)')
  await expect(plugin.locator('.app-shell')).toHaveCSS('background-color', 'rgb(0, 0, 0)')
  await expect(plugin.locator('.app-shell')).toHaveCSS('color', 'rgb(255, 255, 255)')
  const options = plugin.getByRole('button', { name: 'Screen options' })
  const menu = plugin.getByRole('menu', { name: 'Screen options' })
  const textarea = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await options.click()
  await expect(menu).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('screen-options.png') })
  await textarea.click()
  await expect(menu).toHaveCount(0)
  await expect(textarea).toBeFocused()
  await options.click()
  await options.click()
  await expect(menu).toHaveCount(0)
  await options.click()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await expect(options).toBeFocused()
  await textarea.fill('Draft')
  await options.click()
  await menu.getByRole('menuitem', { name: 'New chat', exact: true }).click()
  await expect(menu).toHaveCount(0)
  await expect(page).toHaveURL(/session=/)
  await expect(options).toBeFocused()
  if (testInfo.project.name === 'mobile') await plugin.getByRole('button', { name: 'Open navigation' }).click()
  const navigation = plugin.getByRole('complementary', { name: 'Navigation' })
  await expect(navigation).toHaveCSS('background-color', 'rgb(0, 0, 0)')
  const chatBox = (await navigation.locator('.drawer-chat').boundingBox())!
  const projectsBox = (await navigation.locator('.projects-nav').boundingBox())!
  expect(chatBox.height).toBeGreaterThanOrEqual(44)
  expect(projectsBox.y - chatBox.y - chatBox.height).toBeLessThanOrEqual(4)
  const scheduledBox = (await navigation.locator('.scheduled-nav').boundingBox())!
  const headingBox = (await navigation.locator('.session-head').boundingBox())!
  expect(headingBox.y - scheduledBox.y - scheduledBox.height).toBeLessThanOrEqual(20)
  const rows = navigation.locator('.session-row')
  await expect(rows.first()).toBeVisible()
  const first = (await rows.first().boundingBox())!
  expect(first.height).toBeGreaterThanOrEqual(44)
  expect(first.height).toBeLessThanOrEqual(52)
  if (await rows.count() > 1) {
    const second = (await rows.nth(1).boundingBox())!
    expect(second.y - first.y - first.height).toBeLessThanOrEqual(2)
  }
  await expect(navigation.getByRole('combobox', { name: 'Profile', exact: true })).toHaveCSS('font-size', '16px')
  await page.screenshot({ path: testInfo.outputPath('compact-black-drawer.png') })
  const settings = navigation.getByRole('button', { name: 'Settings', exact: true })
  await settings.click()
  await expect(navigation.getByRole('dialog', { name: 'Settings', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(settings).toBeFocused()
})

test('composer attachments, camera and model controls stay usable on black surfaces', async ({ page }, testInfo) => {
  await signIn(page)
  expect(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content')).toBe('yes')
  expect(await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content')).toBe('ChatHermes')
  const plugin = page.locator('.chathermes-embedded')
  const composer = plugin.locator('.composer')
  const textarea = composer.getByRole('textbox', { name: 'Message Hermes' })
  await textarea.click()
  await expect(textarea).toBeFocused()
  await expect(textarea).toHaveCSS('color', 'rgb(255, 255, 255)')
  // Mobile editing hides the model pill; leave the composer before opening it.
  await plugin.locator('.header-title').click()
  await plugin.getByRole('button', { name: 'Choose model', exact: true }).click()
  await expect(plugin.getByRole('dialog', { name: 'Choose provider' })).toBeVisible()
  await page.keyboard.press('Escape')
  await plugin.getByRole('button', { name: 'Attachment options' }).click()
  await expect(plugin.getByRole('button', { name: 'Upload files', exact: true })).toBeVisible()
  await expect(plugin.getByRole('button', { name: 'Take a photo', exact: true })).toBeVisible()
  await composer.locator('input[type="file"]').first().setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('Isolated UI regression attachment') })
  await expect(composer).toContainText('notes.txt')
  await textarea.fill('Read the attached notes')
  const upload = page.waitForResponse(response => response.url().includes('/uploads') && response.request().method() === 'POST')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  expect((await upload).status()).toBe(201)
  await expect(plugin.locator('.message.assistant').last()).toContainText('Isolated Hermes reply', { timeout: 60_000 })
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  const camera = composer.locator('input[capture]')
  await expect(camera).toHaveAttribute('capture', 'environment')
  await camera.setInputFiles({ name: 'camera.png', mimeType: 'image/png', buffer: await page.screenshot() })
  await expect(composer.getByRole('img', { name: 'camera.png' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('black-composer-attachments.png') })
  await composer.getByRole('button', { name: 'Remove camera.png' }).click()
  await textarea.click()
  await expect(textarea).toBeFocused()
})


test('subscribed settings sends explicit test using authenticated host route', async ({ page }, testInfo) => {
  // Simulate only browser subscription state; config and test requests hit Hermes.
  // No real browser push endpoint or key material is created for this UI check.
  await page.addInitScript(() => {
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true })
    Object.defineProperty(window, 'PushManager', { value: class {}, configurable: true })
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: {
      register: async () => ({ pushManager: { getSubscription: async () => ({}) } }),
      addEventListener() {}, removeEventListener() {},
    } })
  })
  await signIn(page)
  expect(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content')).toBe('yes')
  expect(await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content')).toBe('ChatHermes')
  const plugin = page.locator('.chathermes-embedded')
  if (testInfo.project.name === 'mobile') await plugin.getByRole('button', { name: 'Open navigation' }).click()
  await plugin.getByRole('button', { name: 'Settings', exact: true }).click()
  const panel = plugin.getByRole('dialog', { name: 'Settings', exact: true })
  const send = panel.getByRole('button', { name: 'Send test', exact: true })
  await expect(send).toBeVisible()
  const response = page.waitForResponse(response => new URL(response.url()).pathname === '/api/plugins/chathermes/push/test')
  await send.click()
  const result = await response
  expect(result.request().method()).toBe('POST')
  expect(result.status()).toBe(200)
  expect(await result.json()).toEqual({ scheduled: true })
  await expect(panel).toContainText('Test notification scheduled.')
  await page.screenshot({ path: testInfo.outputPath('subscribed-send-test.png') })
})
