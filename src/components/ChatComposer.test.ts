// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatComposer from './ChatComposer.vue'
describe('composer', () => {
  it('leaves Enter, Shift+Enter and composition to native newline handling; only the button sends', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: false } })
    const area = wrapper.get('textarea'); await area.setValue('hello\nworld')
    for (const extra of [{}, { shiftKey: true }, { isComposing: true }]) {
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...extra })
      area.element.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(false)
    }
    expect(wrapper.emitted('send')).toBeUndefined()
    await wrapper.get('.send-button').trigger('click')
    expect(wrapper.emitted('send')).toEqual([['hello\nworld', []]])
    expect(wrapper.get('.send-button').attributes('type')).toBe('button')
    wrapper.unmount()
  })
  it('resizes for drafts, caps at eight rows and shrinks after sending', async () => {
    const wrapper = mount(ChatComposer, { attachTo: document.body, props: { disabled: false, sending: false } })
    const area = wrapper.get('textarea').element as HTMLTextAreaElement
    area.style.lineHeight = '24px'; area.style.padding = '4px'
    let height = 80
    Object.defineProperty(area, 'scrollHeight', { get: () => height })
    await wrapper.setProps({ suggestedPrompt: 'three rows' })
    expect(area.style.height).toBe('80px')
    height = 300
    await wrapper.get('textarea').setValue('long draft')
    expect(area.style.height).toBe('200px')
    expect(area.style.overflowY).toBe('auto')
    height = 32
    await wrapper.get('.send-button').trigger('click')
    expect(area.style.height).toBe('32px')
    expect(area.style.overflowY).toBe('hidden')
    wrapper.unmount()
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
  it('reactivates the button when loading and run gates clear, including a draft typed during a run', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: true, sending: false } })
    await wrapper.get('textarea').setValue('draft')
    const button = wrapper.get('.send-button')
    expect(button.attributes('disabled')).toBeDefined()
    await wrapper.setProps({ disabled: false, sending: true, stoppable: false })
    expect(button.attributes('disabled')).toBeDefined()
    await wrapper.setProps({ sending: false })
    expect(button.attributes('disabled')).toBeUndefined()
    await button.trigger('click')
    expect(wrapper.emitted('send')).toEqual([['draft', []]])
    wrapper.unmount()
  })
  it('releases the reading gate after an aborted attachment', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: false } })
    let reader: { onabort?: () => void } = {}
    vi.stubGlobal('FileReader', class {
      onabort?: () => void
      constructor() { reader = this }
      readAsDataURL() {}
    })
    try {
      await wrapper.get('textarea').setValue('draft')
      const input = wrapper.get('input[aria-label="Upload files"]')
      Object.defineProperty(input.element, 'files', { value: [new File(['data'], 'test.txt')] })
      await input.trigger('change')
      expect(wrapper.get('.send-button').attributes('disabled')).toBeDefined()
      reader.onabort?.()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(wrapper.get('[role="alert"]').text()).toContain('cancelled')
      expect(wrapper.get('.send-button').attributes('disabled')).toBeUndefined()
      await wrapper.get('.send-button').trigger('click')
      expect(wrapper.emitted('send')).toEqual([['draft', []]])
    } finally { wrapper.unmount(); vi.unstubAllGlobals() }
  })
  it('retains ordinary send behavior outside a run', async () => {
    const wrapper = mount(ChatComposer, { props: { disabled: false, sending: false } })
    await wrapper.get('textarea').setValue('hello')
    await wrapper.get('.send-button').trigger('click')
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
