// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ProjectInstructions from './ProjectInstructions.vue'
import { api } from '../lib/hermes-api'
afterEach(() => vi.restoreAllMocks())
it('keeps failed loads from overwriting instructions and allows a successful retry', async () => {
  const read = vi.spyOn(api, 'projectInstructions').mockRejectedValueOnce(new Error('Unavailable')).mockResolvedValue({ content: 'Keep me', filename: 'HERMES.md' })
  const save = vi.spyOn(api, 'saveProjectInstructions').mockResolvedValue({ content: 'Updated' })
  const wrapper = mount(ProjectInstructions, { props: { profile: 'alpha', projectId: 'p_a', offline: false } }); await flushPromises()
  await wrapper.get('form').trigger('submit'); await flushPromises()
  expect(save).not.toHaveBeenCalled()
  expect(wrapper.get('[role="alert"]').text()).toContain('Could not load')
  await wrapper.get('[role="alert"] button').trigger('click'); await flushPromises()
  expect(read).toHaveBeenCalledTimes(2)
  expect(wrapper.get('textarea').element).toHaveProperty('value', 'Keep me')
  expect(wrapper.text()).toContain('HERMES.md')
  wrapper.unmount()
})
it('preserves unsaved text on save conflicts and requires reload', async () => {
  vi.spyOn(api, 'projectInstructions').mockResolvedValue({ content: 'Original', filename: '.hermes.md' })
  const save = vi.spyOn(api, 'saveProjectInstructions').mockRejectedValue(new Error('Conflict'))
  const wrapper = mount(ProjectInstructions, { props: { profile: 'alpha', projectId: 'p_a', offline: false } }); await flushPromises()
  await wrapper.get('textarea').setValue('My edits')
  await wrapper.get('form').trigger('submit'); await flushPromises()
  expect(wrapper.get('textarea').element).toHaveProperty('value', 'My edits')
  expect(wrapper.get('[role="alert"]').text()).toContain('file may have changed')
  expect(wrapper.emitted('done')).toBeUndefined()
  await wrapper.get('form').trigger('submit'); await flushPromises()
  expect(save).toHaveBeenCalledTimes(1)
  wrapper.unmount()
})
