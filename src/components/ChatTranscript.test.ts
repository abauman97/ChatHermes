// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChatTranscript from './ChatTranscript.vue'

describe('chat markdown', () => {
  it('renders history content parts and arriving markdown with readable structure', async () => {
    const wrapper = mount(ChatTranscript, { props: { loading: false, progress: [], draft: '**Arriving**', messages: [
      { role: 'user', content: 'Use `code`' },
      { role: 'assistant', content: [{ type: 'text', text: '# Heading\n\n**Bold** and *italic*\n\n- First\n- Second\n\n> Quote\n\n```js\nconst value = "<safe>"\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n[Docs](https://example.com)' }] }
    ] } })
    expect(wrapper.get('.user code').text()).toBe('code')
    expect(wrapper.get('h1').text()).toBe('Heading')
    expect(wrapper.get('em').text()).toBe('italic')
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.get('blockquote').text()).toBe('Quote')
    expect(wrapper.get('pre code').text()).toContain('<safe>')
    expect(wrapper.get('table td').text()).toBe('1')
    expect(wrapper.get('a').attributes()).toMatchObject({ href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer' })
    expect(wrapper.findAll('.assistant').at(-1)?.get('strong').text()).toBe('Arriving')
    await wrapper.setProps({ draft: '**Arriving**\n\n```\npartial' })
    expect(wrapper.findAll('.assistant').at(-1)?.get('pre code').text()).toContain('partial')
  })

  it('escapes raw HTML and rejects executable links and images in history and drafts', () => {
    const unsafe = '<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert(1)) ![bad](data:text/html;base64,PHNjcmlwdD4=)'
    const wrapper = mount(ChatTranscript, { props: { loading: false, progress: [], draft: unsafe, messages: [{ role: 'assistant', content: unsafe }] } })
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.text()).toContain('<script>alert(1)</script>')
  })
})

describe('ordered activity presentation', () => {
  it('keeps only the activity animation in Working and renders runtime status outside the transcript', () => {
    const wrapper = mount(ChatTranscript, { props: { messages: [{ role: 'user', content: 'Question' }], working: true, progress: [], draft: '', loading: false, statusLabel: 'Thinking…' } })
    expect(wrapper.findAll('.working-shimmer')).toHaveLength(1)
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('groups all activity before the response and keeps only active work visible', async () => {
    const blocks = [
      { id: 'r1', kind: 'thinking' as const, title: 'Thought', content: 'First plan', complete: true },
      { id: 'commentary', kind: 'text' as const, content: 'Checking files' },
      { id: 't1', kind: 'tool' as const, title: 'Read package.json', content: 'details', complete: true },
      { id: 'active', kind: 'thinking' as const, title: 'Thinking…', content: 'streaming', complete: false },
      { id: 'answer', kind: 'text' as const, content: 'Answer' },
    ]
    const wrapper = mount(ChatTranscript, { props: { messages: [{ role: 'user', content: 'Question' }], blocks, working: true, progress: [], draft: '', loading: false } })
    expect(wrapper.findAll('.assistant-turn > *').map(row => row.classes()[0])).toEqual(['turn-work', 'message', 'message'])
    expect(wrapper.get('.work-summary').text()).toBe('›Working…')
    expect(wrapper.get('.work-summary').attributes('aria-expanded')).toBe('false')
    expect(wrapper.findAll('.activity').map(row => row.get('summary').isVisible())).toEqual([false, false, true])
    expect(wrapper.get('.current-activity .activity').attributes('open')).toBeDefined()
    expect(wrapper.findAll('.working-shimmer')).toHaveLength(2)
    await wrapper.get('.work-summary').trigger('click')
    expect(wrapper.findAll('.work-timeline > div').every(row => row.attributes('style') !== 'display: none;')).toBe(true)
    // Independent native disclosures can be opened without changing siblings.
    const first = wrapper.findAll('.activity').at(0)!
    ;(first.element as HTMLDetailsElement).open = true
    await first.trigger('toggle')
    expect(wrapper.findAll('.activity[open]')).toHaveLength(2)
    expect(wrapper.findAll('.activity').at(1)!.attributes('open')).toBeUndefined()
    await wrapper.setProps({ blocks: blocks.map(block => block.kind !== 'text' ? { ...block, complete: true } : block), working: false })
    expect(wrapper.get('.work-summary').text()).toBe('›Worked')
    expect(wrapper.get('.work-summary').attributes('aria-expanded')).toBe('false')
    expect(wrapper.findAll('.work-timeline > div').every(row => row.attributes('style') === 'display: none;')).toBe(true)
    expect(wrapper.findAll('.working-shimmer')).toHaveLength(0)
    await wrapper.get('.work-summary').trigger('click')
    expect(wrapper.findAll('.work-timeline > div').every(row => row.attributes('style') !== 'display: none;')).toBe(true)
    expect(wrapper.findAll('.activity[open]')).toHaveLength(0)
  })
  it('shows approval waiting independently of completed activity and keeps history inspectable', async () => {
    const blocks = [{ id: 'tool', kind: 'tool' as const, title: 'Ran command', content: 'approval command', complete: true, state: 'failed' as const }]
    const wrapper = mount(ChatTranscript, { props: { messages: [{ role: 'user', content: 'Question' }], blocks, working: true, progress: [], draft: '', loading: false }, slots: { request: '<button>Approve</button>' } })
    expect(wrapper.get('.work-summary').text()).toContain('Working…')
    expect(wrapper.get('.activity').isVisible()).toBe(false)
    await wrapper.setProps({ approvalPending: true })
    expect(wrapper.get('.work-summary').text()).toContain('Waiting for approval')
    expect(wrapper.get('.work-summary [role="status"]').text()).toBe('Waiting for approval')
    expect(wrapper.findAll('.work-summary .working-shimmer')).toHaveLength(0)
    expect(wrapper.find('.current-activity').exists()).toBe(false)
    expect(wrapper.findAll('.current-activity').filter(row => row.isVisible())).toHaveLength(0)
    expect(wrapper.findAll('.work-timeline > div')[0]!.attributes('style')).toContain('display: none')
    expect(wrapper.get('button:last-child').isVisible()).toBe(true)
    await wrapper.get('.work-summary').trigger('click')
    expect(wrapper.findAll('.work-timeline > div')[0]!.attributes('style')).not.toContain('display: none')
    expect(wrapper.get('.activity summary').text()).toContain('Failed')
    expect(wrapper.get('.activity').attributes('open')).toBeUndefined()
    expect(wrapper.get('button:last-child').isVisible()).toBe(true)
    await wrapper.get('.work-summary').trigger('click')
    expect(wrapper.get('.work-summary [role="status"]').isVisible()).toBe(true)
    await wrapper.setProps({ blocks: [...blocks, { id: 'running', kind: 'tool', title: 'Running command', content: 'new command', complete: false }] })
    expect(wrapper.findAll('.current-activity')).toHaveLength(1)
    expect(wrapper.get('.current-activity').text()).toBe('Using tool: tool')
    expect(wrapper.get('.activity').isVisible()).toBe(false)
    await wrapper.setProps({ approvalPending: false, working: false })
    expect(wrapper.get('.work-summary').text()).toContain('Worked')
    expect(wrapper.get('.activity').isVisible()).toBe(false)
  })
  it('shows Working on admission before any activity arrives', () => {
    const wrapper = mount(ChatTranscript, { props: { messages: [{ role: 'user', content: 'Question' }], working: true, progress: [], draft: '', loading: false } })
    expect(wrapper.get('.work-summary').text()).toContain('Working…')
  })
  it('restores reasoning and tool details from completed history and retains assistant images', () => {
    const wrapper = mount(ChatTranscript, { props: { messages: [
      { role: 'user', content: 'Question' },
      { role: 'assistant', content: '', reasoning_content: 'Plan', tool_calls: [{ id: 'call', function: { name: 'terminal' } }] },
      { role: 'tool', tool_call_id: 'call', content: 'result' },
      { role: 'assistant', content: [{ type: 'text', text: 'Answer' }, { type: 'image_url', image_url: { url: 'data:image/png;base64,aGVsbG8=' } }] },
    ], progress: [], draft: '', loading: false } })
    expect(wrapper.findAll('details')).toHaveLength(2)
    expect(wrapper.findAll('details[open]')).toHaveLength(0)
    expect(wrapper.get('.assistant img').attributes('src')).toContain('data:image/png')
    expect(wrapper.get('.assistant').text()).toBe('Answer')
  })
  it('does not force scroll when the reader has scrolled up to inspect history', async () => {
    const wrapper = mount(ChatTranscript, { props: { messages: [{ role: 'user', content: 'Question' }], progress: [], draft: 'First', loading: false } })
    const element = wrapper.get('.transcript').element as HTMLElement
    Object.defineProperties(element, { scrollHeight: { value: 1800, configurable: true }, clientHeight: { value: 600, configurable: true } })
    element.scrollTop = 100
    await wrapper.get('.transcript').trigger('scroll')
    await wrapper.setProps({ draft: 'Arriving text' })
    await flushPromises()
    expect(element.scrollTop).toBe(100)
    element.scrollTop = 1200
    await wrapper.get('.transcript').trigger('scroll')
    Object.defineProperty(element, 'scrollHeight', { value: 1900 })
    await wrapper.setProps({ draft: 'More text' })
    await flushPromises()
    expect(element.scrollTop).toBe(1900)
  })
})

it('restores saved reasoning and tool calls as inspectable completed disclosures', async () => {
  const wrapper = mount(ChatTranscript, { props: { loading: false, progress: [], draft: '', messages: [
    { role: 'user', content: 'Question' },
    { role: 'assistant', content: '', reasoning_content: 'Saved reasoning', tool_calls: [{ id: 't1', function: { name: 'terminal', arguments: '{"command":"pwd"}' } }] },
    { role: 'tool', tool_name: 'terminal', content: 'Full saved result' },
    { role: 'assistant', content: 'Answer' }
  ] } })
  expect(wrapper.findAll('.activity')).toHaveLength(2)
  expect(wrapper.findAll('.activity[open]')).toHaveLength(0)
  expect(wrapper.findAll('.assistant')).toHaveLength(1)
  expect(wrapper.text()).toContain('Saved reasoning')
  expect(wrapper.text()).toContain('pwd')
  expect(wrapper.text()).toContain('Full saved result')
})
