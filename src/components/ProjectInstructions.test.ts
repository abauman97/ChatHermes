// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ProjectInstructions from './ProjectInstructions.vue'
import { api, ApiError } from '../lib/hermes-api'
afterEach(() => vi.restoreAllMocks())
it('loads the selected file and saves its revision through the profile scoped API', async () => {
  const load = vi.spyOn(api, 'projectInstructions').mockResolvedValue({ filename: 'AGENTS.md', content: 'Original', revision: 'r1' })
  const save = vi.spyOn(api, 'saveProjectInstructions').mockResolvedValue({ filename: 'AGENTS.md', content: 'Updated', revision: 'r2' })
  const wrapper = mount(ProjectInstructions, { props: { profile: 'alpha', projectId: 'p_a', offline: false } }); await flushPromises()
  expect(load).toHaveBeenCalledWith('alpha', 'p_a', expect.any(AbortSignal))
  await wrapper.get('textarea').setValue('Updated'); await wrapper.get('form').trigger('submit'); await flushPromises()
  expect(save).toHaveBeenCalledWith('alpha', 'p_a', { filename: 'AGENTS.md', content: 'Updated', revision: 'r1' })
  expect(wrapper.text()).toContain('Instructions saved.')
  await wrapper.get('form').trigger('submit'); await flushPromises()
  expect(save.mock.calls.at(-1)?.[2].revision).toBe('r2')
  wrapper.unmount()
})
it('retains unsaved text on conflicts and gates offline saves', async () => {
  vi.spyOn(api, 'projectInstructions').mockResolvedValue({ filename: '.hermes.md', content: '', revision: null })
  const save = vi.spyOn(api, 'saveProjectInstructions').mockRejectedValue(new ApiError(409, 'Conflict'))
  const wrapper = mount(ProjectInstructions, { props: { profile: '', projectId: 'p_a', offline: false } }); await flushPromises()
  await wrapper.get('textarea').setValue('My draft'); await wrapper.get('form').trigger('submit'); await flushPromises()
  expect(wrapper.get('[role="alert"]').text()).toContain('Your draft is kept')
  expect(wrapper.get('textarea').element).toHaveProperty('value', 'My draft')
  await wrapper.setProps({ offline: true }); await wrapper.get('form').trigger('submit')
  expect(save).toHaveBeenCalledTimes(1)
  wrapper.unmount()
})
it('aborts late reads when leaving the project editor', async () => {
  let finish!: (value: { filename: string; content: string; revision: null }) => void
  const load = vi.spyOn(api, 'projectInstructions').mockImplementation(() => new Promise(resolve => { finish = resolve }))
  const wrapper = mount(ProjectInstructions, { props: { profile: 'alpha', projectId: 'p_a', offline: false } })
  wrapper.unmount()
  expect(load.mock.calls[0]?.[2]?.aborted).toBe(true)
  finish({ filename: '.hermes.md', content: 'Late', revision: null }); await flushPromises()
})
