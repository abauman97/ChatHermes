import { expect, test } from '@playwright/test'

const pluginProfile = (page: import('@playwright/test').Page) => page.locator('.chathermes-embedded').getByRole('combobox', { name: 'Profile', exact: true })

// Seed Projects with native projects_db in an isolated Hermes home before running.
// Gateway fixtures exercise existing chat UI; Project routes remain real/authenticated.
test('native Project browsing, refresh, navigation and fail-closed workspace UI', async ({ page }, testInfo) => {
  await page.setViewportSize(testInfo.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 900 })
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message))
  await page.route('**/api/plugins/chathermes/**', async route => {
    const url = new URL(route.request().url())
    if (/\/projects(?:\/|$)/.test(url.pathname) || url.pathname.endsWith('/profiles')) return route.continue()
    let body: unknown
    if (url.pathname.endsWith('/v1/capabilities')) body = { features: { session_chat_streaming: true }, endpoints: { session_chat_stream: { method: 'POST', path: '/api/sessions/{session_id}/chat/stream' } } }
    else if (url.pathname.endsWith('/v1/models')) body = { data: [{ id: 'Instant' }], default_model: 'Instant' }
    else if (url.pathname.endsWith('/api/model/options')) body = { providers: [{ slug: 'fixture', name: 'Test provider', is_current: true, models: ['Instant', 'Thinking'] }], model: 'Instant', provider: 'fixture' }
    else if (url.pathname.includes('/messages')) body = { messages: Array.from({ length: 16 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: `Isolated chat message ${i + 1}` })) }
    else if (url.pathname.endsWith('/api/sessions')) body = { sessions: [{ id: 's1', title: 'Workspace lookalike chat', cwd: '/tmp/chathermes-issue7-runtime/workspace-a' }], total: 1 }
    else return route.continue()
    await route.fulfill({ json: body })
  })
  await page.goto('/login?next=/chathermes')
  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Password', { exact: true }).fill('chathermes-local-test')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.locator('.chathermes-embedded')).toBeVisible()
  const mobile = testInfo.project.name === 'mobile'
  const nav = page.locator('.chathermes-embedded .sidebar')
  const open = async () => { if (mobile) { await page.locator('.chathermes-embedded').getByRole('button', { name: 'Open navigation', exact: true }).click(); await expect.poll(async () => nav.evaluate(el => Math.round(el.getBoundingClientRect().left))).toBe(0) } }
  await open()
  await expect(nav.getByRole('button', { name: 'Hermes Mobile', exact: true })).toBeVisible()
  await expect(nav.getByRole('button', { name: 'AcumaticaMCP', exact: true })).toBeVisible()
  await expect(nav.getByRole('button', { name: 'Workspace lookalike chat Hermes', exact: true })).toBeVisible()
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('projects-list.png') })
  await nav.getByRole('button', { name: 'Hermes Mobile', exact: true }).click()
  const view = page.getByRole('region', { name: 'Selected Project' })
  await expect(view).toContainText('Hermes Mobile')
  await expect(view).toContainText('workspace-a')
  await expect(view.getByRole('button', { name: 'New chat', exact: true })).toBeDisabled()
  const composer = page.getByRole('textbox', { name: 'Message Hermes' })
  await composer.click(); await expect(composer).toBeFocused()
  await composer.fill('Project sending remains gated')
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeDisabled()
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('project-detail.png') })
  const projectUrl = page.url()
  await page.reload(); await expect(view).toContainText('Hermes Mobile')
  expect(page.url()).toBe(projectUrl)
  await open(); await nav.getByRole('button', { name: 'AcumaticaMCP', exact: true }).click()
  await expect(view).toContainText('This Project has no primary path')
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('project-no-path.png') })
  await page.goBack(); await expect(view).toContainText('Hermes Mobile')
  await open(); await nav.getByRole('button', { name: 'Unavailable workspace', exact: true }).click()
  await expect(view).toContainText('Project directory is unavailable')
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('project-unavailable.png') })
  await view.getByRole('button', { name: 'Other chats', exact: true }).click()
  await open(); await nav.getByRole('button', { name: 'Workspace lookalike chat Hermes', exact: true }).click()
  await expect(page.locator('.message.assistant').last()).toContainText('Isolated chat message 16')
  await page.locator('.transcript').evaluate(el => { el.scrollTop = 0 })
  await expect(page.locator('.message.user').first()).toBeVisible()
  await composer.click(); await expect(composer).toBeFocused()
  await page.getByRole('button', { name: 'Choose model', exact: true }).click()
  await page.getByRole('button', { name: /Test provider/ }).click()
  await page.getByRole('button', { name: 'Thinking', exact: true }).click()
  await page.getByRole('button', { name: 'Attachment options', exact: true }).click()
  await page.locator('.composer input[type="file"]').first().setInputFiles({ name: 'project-notes.txt', mimeType: 'text/plain', buffer: Buffer.from('Isolated attachment preview') })
  await expect(page.locator('.composer')).toContainText('project-notes.txt')
  const capture = page.locator('.composer input[capture]')
  expect(await capture.getAttribute('capture')).toBe('environment')
  await capture.setInputFiles({ name: 'camera.png', mimeType: 'image/png', buffer: await page.screenshot() })
  await expect(page.locator('.composer img')).toBeVisible()
  expect(await composer.evaluate(el => getComputedStyle(el).fontSize)).toBe('16px')
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('other-chat.png') })
  const profile = pluginProfile(page)
  expect(await profile.evaluate(el => getComputedStyle(el).fontSize)).toBe('16px')
  await profile.selectOption('default')
  await expect(page.locator('.message')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('Other chats preserve sent/activity/response order and disclosure transitions', async ({ page }, testInfo) => {
  await page.setViewportSize(testInfo.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 900 })
  let sent = false, finish!: () => void
  const ready = new Promise<void>(resolve => { finish = resolve })
  await page.route('**/api/plugins/chathermes/**', async route => {
    const url = new URL(route.request().url())
    if (/\/projects(?:\/|$)/.test(url.pathname) || url.pathname.endsWith('/profiles')) return route.continue()
    if (url.pathname.endsWith('/chat/stream')) {
      sent = true
      await ready
      return route.fulfill({ contentType: 'text/event-stream', body: [
        'event: tool.started\ndata: {"tool_name":"terminal","tool_call_id":"t1","args":{"command":"pwd"}}',
        'event: tool.completed\ndata: {"tool_name":"terminal","tool_call_id":"t1","output":"Isolated tool output"}',
        'event: assistant.delta\ndata: {"delta":"Isolated reply"}',
        'event: run.completed\ndata: {}', ''
      ].join('\n\n') })
    }
    let body: unknown
    if (url.pathname.endsWith('/v1/capabilities')) body = { features: { session_chat_streaming: true }, endpoints: { session_chat_stream: { method: 'POST', path: '/api/sessions/{session_id}/chat/stream' } } }
    else if (url.pathname.endsWith('/v1/models')) body = { data: [{ id: 'Instant' }], default_model: 'Instant' }
    else if (url.pathname.endsWith('/api/model/options')) body = { providers: [], model: 'Instant' }
    else if (url.pathname.includes('/messages')) body = { messages: sent ? [{ role: 'user', content: 'Check activity order' }, { role: 'tool', tool_name: 'terminal', content: 'Isolated tool output' }, { role: 'assistant', content: 'Isolated reply' }] : [] }
    else body = { sessions: [{ id: 's1', title: 'Activity check' }], total: 1 }
    await route.fulfill({ json: body })
  })
  await page.goto('/login?next=/chathermes')
  await page.getByLabel('Username').fill('tester'); await page.getByLabel('Password', { exact: true }).fill('chathermes-local-test')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  const plugin = page.locator('.chathermes-embedded')
  await expect(plugin).toBeVisible()
  if (testInfo.project.name === 'mobile') await plugin.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await plugin.getByRole('button', { name: 'Activity check Hermes', exact: true }).click()
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.fill('Check activity order')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('.message.user')).toContainText('Check activity order')
  await expect(plugin.locator('.activity[open]')).toBeVisible()
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('active-disclosure.png') })
  finish()
  await expect(plugin.locator('.message.assistant')).toContainText('Isolated reply')
  await expect(plugin.locator('.activity[open]')).toHaveCount(0)
  const order = await plugin.locator('.transcript .message, .transcript .activity').evaluateAll(elements => elements.map(el => el.className))
  expect(order[0]).toContain('user'); expect(order.at(-1)).toContain('assistant')
  const tool = plugin.locator('.activity').filter({ hasText: 'terminal' })
  await tool.locator('summary').click()
  await expect(tool.locator('pre')).toContainText('Isolated tool output')
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('completed-disclosure.png') })
})
