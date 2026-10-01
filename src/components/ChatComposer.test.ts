// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatComposer from './ChatComposer.vue'
describe('composer', () => {
  it('sends on Enter and keeps Shift+Enter for a newline', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: false } })
    const area = wrapper.get('textarea'); await area.setValue('hello')
    await area.trigger('keydown', { key: 'Enter', shiftKey: true }); expect(wrapper.emitted('send')).toBeUndefined()
    await area.trigger('keydown', { key: 'Enter' }); expect(wrapper.emitted('send')?.[0]).toEqual(['hello', []])
  })
})

describe('composer availability', () => {
  it('keeps text editable while sending is gated and blocks keyboard submissions', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: true, sending: false } })
    const area = wrapper.get('textarea')
    expect(area.attributes('disabled')).toBeUndefined()
    await area.setValue('draft while loading')
    await area.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('send')).toBeUndefined()
    expect((area.element as HTMLTextAreaElement).value).toBe('draft while loading')
  })
})

describe('provider and model picker', () => {
  it('shows the current provider models and switches models with the provider', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: false, provider: 'first', defaultModel: 'saved', providers: [
      { slug: 'first', name: 'First', is_current: true, models: ['one', 'two'] },
      { slug: 'custom:second', name: 'Second', models: ['other'] }
    ], models: [{ id: 'gateway', parent: null }, { id: 'Instant', parent: 'gateway' }] } })
    expect(wrapper.findAll('.model-select option').map(item => item.text())).toEqual(['saved', 'one', 'two'])
    await wrapper.get('.provider-select').setValue('custom:second')
    expect(wrapper.emitted('update:provider')?.[0]).toEqual(['custom:second'])
    expect(wrapper.emitted('update:model')?.[0]).toEqual(['other'])
    await wrapper.setProps({ provider: 'custom:second', model: 'other' })
    expect(wrapper.findAll('.model-select option').map(item => item.text())).toEqual(['other'])
    await wrapper.get('.provider-select').setValue('')
    await wrapper.setProps({ provider: '', model: 'Instant' })
    expect(wrapper.findAll('.model-select option').map(item => item.text())).toEqual(['Instant'])
    await wrapper.setProps({ sending: true })
    expect(wrapper.get('.provider-select').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.model-select').attributes('disabled')).toBeDefined()
    expect(wrapper.get('textarea').attributes('disabled')).toBeUndefined()
  })
})
