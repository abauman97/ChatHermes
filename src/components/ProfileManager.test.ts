// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ProfileManager from './ProfileManager.vue'
import type { Profile } from '../types/hermes'
const saved: Profile = { id: 'alpha', label: 'Alpha', baseUrl: 'https://example.test/p/alpha/', key: 'old-secret' }
afterEach(() => vi.unstubAllGlobals())
describe('profile editor', () => {
  it('adds a connection with a masked key and validates the URL', async () => {
    const wrapper = mount(ProfileManager, { props: { profiles: [], selected: '', open: true } })
    expect(wrapper.get('.secret-field input').attributes('type')).toBe('password')
    await wrapper.get('input[placeholder="Personal"]').setValue('Personal')
    await wrapper.get('input[type="url"]').setValue('http://remote.test/')
    await wrapper.get('.secret-field input').setValue('new-secret')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('HTTPS')
    expect(wrapper.emitted('save')).toBeUndefined()
    await wrapper.get('input[type="url"]').setValue('https://remote.test/p/personal/')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted<Profile[]>('save')?.[0]?.[0]).toMatchObject({ label: 'Personal', baseUrl: 'https://remote.test/p/personal/', key: 'new-secret' })
    wrapper.unmount()
  })
  it('edits without revealing or replacing a saved key and removes the profile', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    const wrapper = mount(ProfileManager, { props: { profiles: [saved], selected: 'alpha', open: false } })
    await wrapper.setProps({ open: true })
    await flushPromises()
    expect(wrapper.get('.secret-field input').attributes('type')).toBe('password')
    expect((wrapper.get('.secret-field input').element as HTMLInputElement).value).toBe('')
    expect(wrapper.html()).not.toContain('old-secret')
    await wrapper.get('input[placeholder="Personal"]').setValue('Updated')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted<Profile[]>('save')?.[0]?.[0]).toMatchObject({ id: 'alpha', label: 'Updated', key: 'old-secret' })
    await wrapper.get('.remove-profile').trigger('click')
    expect(wrapper.emitted('remove')?.[0]).toEqual(['alpha'])
    wrapper.unmount()
  })
  it('requires a replacement key when changing the endpoint', async () => {
    const wrapper = mount(ProfileManager, { props: { profiles: [saved], selected: 'alpha', open: true } })
    await wrapper.get('input[type="url"]').setValue('https://example.test/p/other/')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('save')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toContain('new API key')
    wrapper.unmount()
  })
})
