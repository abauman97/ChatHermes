import { expect, test } from '@playwright/test'

const pluginProfile = (page: import('@playwright/test').Page) => page.locator('.chathermes-embedded').getByRole('combobox', { name: 'Profile', exact: true })

// Native Projects, session creation/resume and prompt runtime: no route mocks.
test('gateway Projects create workspace chats, discover context, refresh and preserve cwd', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile'
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 })
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message))
  await page.goto('/login?next=/chathermes')
  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Password', { exact: true }).fill('chathermes-local-test')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  const plugin = page.locator('.chathermes-embedded')
  await expect(plugin).toBeVisible()
  const nav = plugin.locator('.sidebar')
  const open = async () => { if (mobile) { await plugin.getByRole('button', { name: 'Open navigation', exact: true }).click(); await expect.poll(async () => nav.evaluate(el => Math.round(el.getBoundingClientRect().left))).toBe(0) } }
  await open()
  await expect(nav.getByRole('button', { name: 'Hermes Mobile', exact: true })).toBeVisible()
  await expect(nav.getByRole('button', { name: 'Home', exact: true })).toBeVisible()
  for (const name of ['Hermes Mobile', 'AcumaticaMCP', 'Unavailable workspace']) {
    expect(await nav.getByRole('button', { name, exact: true }).evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(48)
  }
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('projects-list.png') })
  await nav.getByRole('button', { name: 'Hermes Mobile', exact: true }).click()
  const view = plugin.getByRole('region', { name: 'Selected Project' })
  await expect(view).toContainText('/tmp/chathermes-issue7-runtime/workspace-a')
  const composer = plugin.getByRole('textbox', { name: 'Message Hermes' })
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ animations: 'disabled', path: testInfo.outputPath('project-detail.png') })
  const created = page.waitForResponse(r => r.url().includes('/projects/') && r.url().includes('/projects/session?') && r.request().method() === 'POST')
  await view.getByRole('button', { name: 'New chat', exact: true }).click()
  const response = await created; expect(response.status()).toBe(201)
  const session = (await response.json()).session
  expect(session.cwd).toBe('/tmp/chathermes-issue7-runtime/workspace-a')
  // Native unpersisted drafts must survive the gateway's 20s disconnect grace
  // while the user composes. The event subscription holds the selected viewer.
  await page.waitForTimeout(22_000)
  await composer.fill('Check my workspace [tool] [workspace]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('.message.user')).toContainText('Check my workspace')
  await expect(plugin.locator('.activity[open]').first()).toBeVisible()
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: testInfo.outputPath('project-active.png') })
  await expect(plugin.locator('.message.assistant').last()).toContainText('Project context discovered.', { timeout: 60_000 })
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await expect(plugin.getByText('Loading conversation…', { exact: true })).toHaveCount(0)
  await expect(plugin.locator('.activity[open]')).toHaveCount(0)
  const tool = plugin.locator('.activity').filter({ has: page.locator('summary', { hasText: 'terminal' }) })
  await tool.locator('summary').click()
  await expect(tool.locator('pre')).toContainText('/tmp/chathermes-issue7-runtime/workspace-a')
  await page.screenshot({ path: testInfo.outputPath('project-completed.png') })
  await page.reload()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Project context discovered.')
  expect(new URL(page.url()).searchParams.get('session')).toBe(session.id)
  const tree = await page.request.get('/api/plugins/chathermes/projects')
  const project = (await tree.json()).projects.find((p: { label: string }) => p.label === 'Hermes Mobile')
  expect(project.sessionIds).toContain(session.id)
  // Enter B without moving the existing A session; another turn still runs in A.
  await open(); await nav.getByRole('button', { name: 'AcumaticaMCP', exact: true }).click()
  expect(new URL(page.url()).searchParams.get('session')).toBe(session.id)
  await expect(view).toContainText('AcumaticaMCP')
  await page.reload()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Project context discovered.')
  await composer.fill('Check my unchanged workspace [tool] [workspace]')
  await plugin.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(plugin.locator('.message.assistant')).toHaveCount(2, { timeout: 60_000 })
  await expect(plugin.getByRole('button', { name: 'Send message', exact: true })).toBeVisible()
  await expect(plugin.locator('.message.assistant').last()).toContainText('Project context discovered.')
  // A fresh pathless Project cannot create a workspace chat.
  await page.goto('/chathermes?project=' + encodeURIComponent(project.id))
  await expect(view).toContainText('Hermes Mobile')
  expect((await (await page.request.get('/api/plugins/chathermes/projects/' + project.id)).json()).project.repos.flatMap((r: { groups: { sessions: { id: string }[] }[] }) => r.groups.flatMap(g => g.sessions)).some((s: { id: string }) => s.id === session.id)).toBe(true)
  await open(); await nav.getByRole('button', { name: 'AcumaticaMCP', exact: true }).click()
  await expect(view).toContainText('No workspace configured')
  await expect(view.getByRole('button', { name: 'New chat', exact: true })).toBeDisabled()
  await composer.click(); await expect(composer).toBeFocused()
  await page.screenshot({ path: testInfo.outputPath('project-pathless.png') })
  await open(); await nav.getByRole('button', { name: 'Unavailable workspace', exact: true }).click()
  await view.getByRole('button', { name: 'New chat', exact: true }).click()
  await expect(view).toContainText('Request failed (409)')
  await page.screenshot({ path: testInfo.outputPath('project-unavailable.png') })
  await open(); await pluginProfile(page).selectOption('test-profile')
  await expect(nav.getByRole('button', { name: 'Hermes Mobile', exact: true })).toHaveCount(0)
  await expect(plugin.getByRole('region', { name: 'Selected Project' })).toHaveCount(0)
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
