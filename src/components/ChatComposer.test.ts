// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatComposer from './ChatComposer.vue'
describe('composer', () => {
  it('sends on Enter and keeps Shift+Enter for a newline', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: false } })
    const area = wrapper.get('textarea'); await area.setValue('hello')
    await area.trigger('keydown', { key: 'Enter', shiftKey: true }); expect(wrapper.emitted('send')).toBeUndefined()
    await area.trigger('keydown', { key: 'Enter' }); expect(wrapper.emitted('send')?.[0]).toEqual(['hello'])
  })
})
