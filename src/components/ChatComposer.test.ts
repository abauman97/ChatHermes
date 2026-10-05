// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
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
  it('steers non-empty input during an active stoppable run and stops with empty input', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: true, stoppable: true } })
    const button = wrapper.get('.send-button')
    expect(button.attributes('aria-label')).toBe('Stop response')
    await wrapper.get('textarea').setValue('  follow this direction  ')
    expect(button.attributes('aria-label')).toBe('Guide this run')
    await button.trigger('click')
    expect(wrapper.emitted('steer')).toEqual([['follow this direction']])
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('')
    expect(wrapper.emitted('stop')).toBeUndefined()
    await button.trigger('click')
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })
  it('retains ordinary send behavior outside a run', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: false } })
    await wrapper.get('textarea').setValue('hello')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('send')?.[0]).toEqual(['hello', []])
    expect(wrapper.emitted('steer')).toBeUndefined()
  })
})

describe('provider and model picker', () => {
  const providers = [
    { slug: 'first', name: 'First', is_current: true, models: ['one', 'two'] },
    { slug: 'custom:second', name: 'Second', models: ['other'] }
  ]
  const wrappers: ReturnType<typeof mount>[] = []
  afterEach(() => { wrappers.splice(0).forEach(wrapper => wrapper.unmount()) })
  function composer(extra = {}) {
    const wrapper = mount(ChatComposer, { attachTo: document.body, props: {
      disabled: false, sending: false, provider: 'first', defaultModel: 'saved', providers,
      models: [{ id: 'gateway', parent: null }, { id: 'Instant', parent: 'gateway' }], ...extra
    } })
    wrappers.push(wrapper)
    return wrapper
  }
  it('shows the model, configured default, empty default and loading labels', async () => {
    const wrapper = composer({ model: 'chosen' })
    expect(wrapper.get('.model-pill').text()).toBe('chosen')
    await wrapper.setProps({ model: '' })
    expect(wrapper.get('.model-pill').text()).toBe('saved')
    await wrapper.setProps({ defaultModel: '' })
    expect(wrapper.get('.model-pill').text()).toBe('Default')
    await wrapper.setProps({ modelsLoading: true })
    expect(wrapper.get('.model-pill').text()).toBe('Loading models…')
    expect(wrapper.get('.model-pill').attributes('disabled')).toBeDefined()
  })
  it('navigates providers and models without changing selection until a model is chosen', async () => {
    const wrapper = composer()
    const pill = wrapper.get('.model-pill')
    expect(pill.attributes('aria-haspopup')).toBe('dialog')
    await pill.trigger('click')
    expect(pill.attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('.provider-option').map(item => item.text())).toEqual(['FirstCurrent', 'Second', 'Model routes'])
    await wrapper.get('[data-provider="first"]').trigger('click')
    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('First')
    expect(wrapper.findAll('.model-option').map(item => item.attributes('data-model'))).toEqual(['saved', 'one', 'two'])
    await wrapper.get('.picker-back').trigger('click')
    expect(wrapper.findAll('.provider-option')).toHaveLength(3)
    expect(wrapper.emitted('update:provider')).toBeUndefined()
    await wrapper.get('[data-provider="custom:second"]').trigger('click')
    expect(wrapper.findAll('.model-option').map(item => item.text())).toEqual(['other'])
    await wrapper.get('[data-model="other"]').trigger('click')
    expect(wrapper.emitted('update:provider')).toEqual([['custom:second']])
    expect(wrapper.emitted('update:model')).toEqual([['other']])
    expect(wrapper.find('.model-panel').exists()).toBe(false)
    expect(document.activeElement).toBe(pill.element)
  })
  it('emits an empty model for the current configured default and an explicit model for other choices', async () => {
    const wrapper = composer()
    for (const id of ['saved', 'two']) {
      await wrapper.get('.model-pill').trigger('click')
      await wrapper.get('[data-provider="first"]').trigger('click')
      await wrapper.get(`[data-model="${id}"]`).trigger('click')
    }
    expect(wrapper.emitted('update:provider')).toEqual([['first'], ['first']])
    expect(wrapper.emitted('update:model')).toEqual([[''], ['two']])
  })
  it('selects routes with an empty provider and keeps the default available without inventory', async () => {
    const wrapper = composer()
    await wrapper.get('.model-pill').trigger('click')
    await wrapper.get('[data-provider=""]').trigger('click')
    expect(wrapper.findAll('.model-option').map(item => item.text())).toEqual(['Instant'])
    await wrapper.get('[data-model="Instant"]').trigger('click')
    expect(wrapper.emitted('update:provider')).toEqual([['']])
    expect(wrapper.emitted('update:model')).toEqual([['Instant']])
    await wrapper.setProps({ providers: [], provider: '' })
    await wrapper.get('.model-pill').trigger('click')
    await wrapper.get('[data-provider=""]').trigger('click')
    expect(wrapper.findAll('.model-option').map(item => item.attributes('data-model'))).toEqual(['saved', 'Instant'])
    await wrapper.get('[data-model="saved"]').trigger('click')
    expect(wrapper.emitted('update:model')?.[1]).toEqual(['saved'])
  })
  it('moves focus, traps Tab and closes on toggle, Escape and outside click', async () => {
    const wrapper = composer()
    const pill = wrapper.get('.model-pill')
    await pill.trigger('click')
    const close = wrapper.get('[aria-label="Close model picker"]')
    expect(document.activeElement).toBe(close.element)
    await close.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(wrapper.get('[data-provider=""]').element)
    await wrapper.get('[data-provider=""]').trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(close.element)
    await close.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.model-panel').exists()).toBe(false)
    expect(document.activeElement).toBe(pill.element)
    await pill.trigger('click'); await pill.trigger('click')
    expect(wrapper.find('.model-panel').exists()).toBe(false)
    await pill.trigger('click')
    document.body.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.model-panel').exists()).toBe(false)
    expect(document.activeElement).toBe(pill.element)
  })
  it('gates the picker during sending, closes an open picker, and keeps the composer editable', async () => {
    const wrapper = composer({ disabled: true })
    expect(wrapper.get('.model-pill').attributes('disabled')).toBeUndefined()
    await wrapper.get('.model-pill').trigger('click')
    await wrapper.setProps({ sending: true })
    expect(wrapper.find('.model-panel').exists()).toBe(false)
    expect(wrapper.get('.model-pill').attributes('disabled')).toBeDefined()
    expect(wrapper.get('textarea').attributes('disabled')).toBeUndefined()
    await wrapper.get('.model-pill').trigger('click')
    expect(wrapper.find('.model-panel').exists()).toBe(false)
  })
})
