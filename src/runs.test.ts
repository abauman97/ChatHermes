// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from './App.vue'
import SessionSidebar from './components/SessionSidebar.vue'
import { activeRunFor, rememberRun } from './lib/active-runs'
const json = (data: unknown) => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } })
const caps = { features: { run_events_sse: true }, endpoints: { runs: { method: 'POST', path: '/v1/runs' } } }
beforeEach(() => { localStorage.clear(); history.replaceState({}, '', '/chathermes?profile=alpha&session=one') })
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); localStorage.clear() })
function fixture() {
  let state: Record<string, unknown> = { run_id: 'run_test', session_id: 'one', status: 'running' }
  let history: unknown[] = [{ id: 'old', role: 'assistant', content: 'Earlier answer' }, { id: 'u1', role: 'user', content: 'Question' }]
  const viewers: ReadableStreamDefaultController<Uint8Array>[] = []
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/profiles')) return json({ profiles: [] })
    if (url.includes('/projects')) return json({ projects: [] })
    if (url.includes('/v1/models')) return json({ data: [] })
    if (url.includes('/api/model/options')) return json({ providers: [], model: '', provider: '' })
    if (url.includes('/capabilities')) return json(caps)
    if (url.includes('/messages')) return json({ data: history })
    if (url.includes('/v1/runs/run_test/events')) return new Response(new ReadableStream<Uint8Array>({ start(controller) { viewers.push(controller) } }))
    if (url.includes('/v1/runs/run_test/approval')) return json({ resolved: 1 })
    if (url.includes('/v1/runs/run_test/steer')) return json({ accepted: true })
    if (url.includes('/v1/runs/run_test/stop')) return json({ run_id: 'run_test', status: 'stopping' })
    if (url.includes('/v1/runs/run_test')) return json(state)
    if (url.includes('/v1/runs') && init?.method === 'POST') return json({ run_id: 'run_test', status: 'started', replayed: false })
    if (url.includes('/api/sessions?')) return json({ data: [{ id: 'one', title: 'One' }, { id: 'two', title: 'Two' }] })
    return json({ session: { id: 'one' } })
  })
  vi.stubGlobal('fetch', fetch)
  const frame = (event: string, seq: number, data: Record<string, unknown> = {}) => viewers.at(-1)!.enqueue(new TextEncoder().encode(`id: ${seq}\ndata: ${JSON.stringify({ event, run_id: 'run_test', seq, ...data })}\n\n`))
  return { fetch, frame, viewers, state: (value: Record<string, unknown>) => { state = { ...state, ...value } }, history: (value: unknown[]) => { history = value } }
}
async function start(wrapper: ReturnType<typeof mount>) {
  await flushPromises(); await wrapper.get('#prompt').setValue('Question'); await wrapper.get('.composer').trigger('submit'); await flushPromises()
}
describe('durable Runs execution', () => {
  it('admits once with session/model input and reconnects after reload without another POST', async () => {
    const f = fixture(); let wrapper = mount(App); await start(wrapper)
    expect(activeRunFor('alpha', 'one')).toBe('run_test')
    expect(JSON.parse(String(f.fetch.mock.calls.find(([url, init]) => url.includes('/v1/runs?') && init?.method === 'POST')?.[1]?.body))).toEqual({ session_id: 'one', input: 'Question' })
    f.frame('message.delta', 0, { delta: 'Live answer' }); await flushPromises()
    expect(wrapper.text()).toContain('Live answer'); wrapper.unmount()
    wrapper = mount(App); await flushPromises()
    f.frame('message.delta', 0, { delta: 'Live answer' }); await flushPromises()
    expect(wrapper.findAll('.message.assistant').map(x => x.text())).toEqual(['Earlier answer', 'Live answer'])
    expect(f.fetch.mock.calls.filter(([url, init]) => url.includes('/v1/runs?') && init?.method === 'POST')).toHaveLength(1)
    expect(f.fetch.mock.calls.filter(([url]) => url.includes('/run_test/events'))).toHaveLength(2)
    wrapper.unmount()
  })
  it('restores the same run on navigation and keeps pointers isolated by profile/session', async () => {
    const f = fixture(); const wrapper = mount(App); await start(wrapper)
    wrapper.findComponent(SessionSidebar).vm.$emit('select', 'two'); await flushPromises()
    expect(wrapper.find('.send-button').attributes('aria-label')).toBe('Send message')
    expect(activeRunFor('alpha', 'one')).toBe('run_test'); expect(activeRunFor('beta', 'one')).toBe('')
    wrapper.findComponent(SessionSidebar).vm.$emit('select', 'one'); await flushPromises()
    f.frame('message.delta', 0, { delta: 'Resumed' }); await flushPromises()
    expect(wrapper.text()).toContain('Resumed')
    expect(f.fetch.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1)
    wrapper.unmount()
  })
  it('deduplicates replay and reconnects with last_seq after a stream disconnect', async () => {
    vi.useFakeTimers()
    const f = fixture(); const wrapper = mount(App); await start(wrapper)
    f.frame('message.delta', 0, { delta: 'Hello' }); f.frame('message.delta', 0, { delta: 'Hello' }); await flushPromises()
    expect(wrapper.findAll('.message.assistant').at(-1)?.text()).toBe('Hello')
    f.viewers.at(-1)!.close(); await flushPromises()
    expect(wrapper.text()).toContain('Reconnecting and restoring')
    await vi.advanceTimersByTimeAsync(1000); await flushPromises()
    expect(f.fetch.mock.calls.at(-1)?.[0]).toContain('last_seq=0')
    f.frame('message.delta', 0, { delta: 'Hello' }); f.frame('message.delta', 1, { delta: ' again' }); await flushPromises()
    expect(wrapper.findAll('.message.assistant').at(-1)?.text()).toBe('Hello again')
    wrapper.unmount(); vi.useRealTimers()
  })
  it('renders pinned reasoning/tool preview/results then restores authoritative completed history', async () => {
    const f = fixture(); const wrapper = mount(App); await start(wrapper)
    f.frame('reasoning.available', 0, { text: 'Consider the evidence' })
    f.frame('tool.started', 1, { tool: 'terminal', preview: 'echo hello' }); await flushPromises()
    expect(wrapper.text()).toContain('Consider the evidence'); expect(wrapper.get('.activity[open]').text()).toContain('echo hello')
    f.frame('tool.completed', 2, { tool: 'terminal', preview: 'hello', error: false }); await flushPromises()
    expect(wrapper.findAll('.activity[open]')).toHaveLength(0)
    f.history([{ role: 'user', content: 'Question' }, { role: 'tool', content: 'Full output hello' }, { role: 'assistant', content: 'Final answer' }])
    f.frame('run.completed', 3, { output: 'Final answer' }); await flushPromises()
    expect(wrapper.findAll('.message.assistant')).toHaveLength(1); expect(wrapper.text()).toContain('Final answer')
    expect(activeRunFor('alpha', 'one')).toBe(''); expect(wrapper.get('.send-button').attributes('aria-label')).toBe('Send message')
    wrapper.unmount()
  })
  it('restores approval details and permits approval, steering and composer stop after reload', async () => {
    const f = fixture(); rememberRun('alpha', 'one', 'run_test')
    f.state({ status: 'waiting_for_approval', approval: { request_id: 'req_1', command: 'test command', choices: ['once', 'deny'] } })
    const wrapper = mount(App); await flushPromises()
    expect(wrapper.text()).toContain('test command')
    await wrapper.findAll('button').find(x => x.text() === 'Allow once')!.trigger('click'); await flushPromises()
    expect(JSON.parse(String(f.fetch.mock.calls.find(([url]) => url.includes('/approval'))?.[1]?.body))).toEqual({ choice: 'once', request_id: 'req_1' })
    await wrapper.get('[aria-label="Guide this run"]').setValue('Use another approach')
    await wrapper.get('[aria-label="Guide this run"]').element.closest('form')!.dispatchEvent(new Event('submit'))
    await flushPromises()
    expect(JSON.parse(String(f.fetch.mock.calls.find(([url]) => url.includes('/steer'))?.[1]?.body))).toEqual({ input: 'Use another approach' })
    await wrapper.get('#prompt').trigger('focus'); expect(wrapper.get('#prompt').attributes('disabled')).toBeUndefined()
    await wrapper.get('[aria-label="Stop response"]').trigger('click'); await flushPromises()
    expect(f.fetch.mock.calls.some(([url, init]) => url.includes('/stop') && init?.method === 'POST')).toBe(true)
    expect(wrapper.text()).toContain('Stopping…'); expect(activeRunFor('alpha', 'one')).toBe('run_test')
    wrapper.unmount()
  })
  it('reopens a completed run through history without replaying or resubmitting', async () => {
    const f = fixture(); rememberRun('alpha', 'one', 'run_test'); f.state({ status: 'completed', output: 'Final' })
    f.history([{ role: 'user', content: 'Question' }, { role: 'assistant', content: 'Final' }])
    const wrapper = mount(App); await flushPromises()
    expect(wrapper.findAll('.message.assistant')).toHaveLength(1)
    expect(activeRunFor('alpha', 'one')).toBe('')
    expect(f.fetch.mock.calls.some(([url, init]) => url.includes('/events') || init?.method === 'POST')).toBe(false)
    wrapper.unmount()
  })
  it('keeps an approval/send lock through history refresh and clears it only after resolution', async () => {
    const f = fixture(); const wrapper = mount(App); await start(wrapper)
    f.frame('approval.request', 0, { request_id: 'req_1', command: 'review me', choices: ['once', 'deny'] }); await flushPromises()
    f.frame('replay.truncated', 1, { oldest_retained_seq: 1 }); await flushPromises()
    await wrapper.findAll('button').find(x => x.text() === 'Refresh history')!.trigger('click'); await flushPromises()
    await wrapper.get('#prompt').setValue('Another turn'); await wrapper.get('.composer').trigger('submit'); await flushPromises()
    expect(f.fetch.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1)
    expect(wrapper.text()).toContain('review me')
    expect(wrapper.get('[aria-label="Stop response"]').attributes('disabled')).toBeUndefined()
    f.frame('approval.responded', 2, { request_id: 'req_1', choice: 'deny', resolved: 1 }); await flushPromises()
    expect(wrapper.text()).not.toContain('review me')
    wrapper.unmount()
  })

})
