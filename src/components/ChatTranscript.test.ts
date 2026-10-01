// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
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
