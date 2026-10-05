// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ScheduledPage from './ScheduledPage.vue'
import { api } from '../lib/hermes-api'
const job = { id: 'audit', name: 'Security Audit', state: 'active' }
const recent = { id: 'cron_audit_20260102_000000', started_at: 200, ended_at: 210, source: 'cron' }
afterEach(() => { vi.restoreAllMocks(); history.replaceState({}, '', '/') })
function setup() {
  vi.spyOn(api, 'scheduled').mockResolvedValue({ jobs: [job, { ...job, id: 'paused', name: 'Paused audit', state: 'paused' }, { ...job, id: 'done', name: 'Completed audit', state: 'completed' }] })
  vi.spyOn(api, 'scheduledRuns').mockResolvedValue({ runs: [recent], offset: 0, limit: 30, has_more: true })
  vi.spyOn(api, 'scheduledOutput').mockResolvedValue({ messages: [{ role: 'assistant', content: '# Full audit\nAll clear' }] })
}
it('filters jobs, pages history, renders real output and drafts a discussion', async () => {
  setup(); const wrapper = mount(ScheduledPage, { props: { profile: 'beta' } }); await flushPromises()
  expect(wrapper.get('[aria-label="Scheduled jobs"]').text()).toBe('Security AuditScheduled job›')
  await wrapper.get('select').setValue('paused'); expect(wrapper.text()).toContain('Paused audit')
  await wrapper.get('select').setValue('completed'); expect(wrapper.text()).toContain('Completed audit')
  await wrapper.get('select').setValue('active'); await wrapper.get('.scheduled-list button').trigger('click'); await flushPromises()
  expect(api.scheduledRuns).toHaveBeenCalledWith('beta', 'audit', 0, expect.any(AbortSignal))
  vi.mocked(api.scheduledRuns).mockResolvedValue({ runs: [{ ...recent, id: 'old', started_at: 100 }], offset: 1, limit: 30, has_more: false })
  await wrapper.findAll('button').find(row => row.text() === 'Load older runs')!.trigger('click'); await flushPromises()
  expect(api.scheduledRuns).toHaveBeenLastCalledWith('beta', 'audit', 1, expect.any(AbortSignal))
  expect(wrapper.findAll('.scheduled-list button')).toHaveLength(2)
  await wrapper.get('.scheduled-list button').trigger('click'); await flushPromises()
  expect(wrapper.get('.markdown-content h1').text()).toBe('Full audit')
  expect(location.search).toContain('scheduled_run=')
  await wrapper.findAll('button').find(row => row.text() === 'Open a chat about this run')!.trigger('click')
  expect(wrapper.emitted('discuss')![0]![0]).toContain('Job: Security Audit')
  expect(wrapper.emitted('discuss')![0]![0]).toContain('All clear')
  wrapper.unmount()
})
it('ignores late output after going back and aborts on unmount', async () => {
  setup(); let finish!: (value: { messages: { role: string; content: string }[] }) => void
  vi.mocked(api.scheduledOutput).mockImplementation(() => new Promise(resolve => { finish = resolve }))
  const wrapper = mount(ScheduledPage, { props: { profile: '' } }); await flushPromises()
  await wrapper.get('.scheduled-list button').trigger('click'); await flushPromises()
  await wrapper.get('.scheduled-list button').trigger('click'); await flushPromises()
  const signal = vi.mocked(api.scheduledOutput).mock.calls[0]![3]!
  await wrapper.get('.project-back').trigger('click')
  finish({ messages: [{ role: 'assistant', content: 'stale' }] }); await flushPromises()
  expect(signal.aborted).toBe(true); expect(wrapper.text()).not.toContain('stale')
  wrapper.unmount()
})
it('handles unavailable history and retries', async () => {
  setup(); vi.mocked(api.scheduled).mockRejectedValueOnce(new Error('internal'))
  const wrapper = mount(ScheduledPage, { props: { profile: '' } }); await flushPromises()
  expect(wrapper.get('[role="alert"]').text()).not.toContain('internal')
  await wrapper.get('[role="alert"] button').trigger('click'); await flushPromises()
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.text()).toContain('Security Audit'); wrapper.unmount()
})
it('restores older output directly from a URL without requiring its history page', async () => {
  setup(); history.replaceState({}, '', '/chathermes?view=scheduled&job=audit&scheduled_run=output%3A2025-01-01_00-00-00')
  vi.mocked(api.scheduledOutput).mockResolvedValue({ messages: [], output: 'Older saved audit', started_at: 1735689600 })
  const wrapper = mount(ScheduledPage, { props: { profile: 'beta' } }); await flushPromises()
  expect(api.scheduledOutput).toHaveBeenCalledWith('beta', 'audit', 'output:2025-01-01_00-00-00', expect.any(AbortSignal))
  expect(wrapper.text()).toContain('Older saved audit')
  expect(wrapper.text()).not.toContain('1970')
  wrapper.unmount()
})
