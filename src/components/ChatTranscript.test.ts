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
  it('renders interleaved blocks in one turn and constrains details with the activity class', async () => {
    const blocks = [
      { id: 'r1', kind: 'thinking' as const, title: 'Thought', content: 'First plan', complete: true },
      { id: 't1', kind: 'tool' as const, title: 'Ran command', content: 'command', output: 'x'.repeat(100_000), complete: true },
      { id: 'r2', kind: 'thinking' as const, title: 'Thinking…', content: 'Second plan', complete: false },
      { id: 'text', kind: 'text' as const, content: '**Answer**' },
    ]
    const wrapper = mount(ChatTranscript, { props: { messages: [{ role: 'user', content: 'Question' }], blocks, progress: [], draft: 'Answer', loading: false } })
    expect(wrapper.findAll('.assistant-turn > *').map(row => row.classes().includes('activity') ? row.get('summary').text() : row.text())).toEqual(['✓Thought', '✓Ran command', '◌Thinking…', 'Answer'])
    expect(wrapper.findAll('.message.assistant')).toHaveLength(1)
    expect(wrapper.findAll('details[open]')).toHaveLength(1)
    await wrapper.setProps({ blocks: blocks.map(block => block.kind === 'thinking' ? { ...block, complete: true } : block) })
    expect(wrapper.findAll('details[open]')).toHaveLength(0)
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
