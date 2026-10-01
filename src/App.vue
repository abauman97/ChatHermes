<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { api, eventPayload } from './lib/hermes-api'
import type { Capabilities, Message, Session } from './types/hermes'
import SessionSidebar from './components/SessionSidebar.vue'
import ChatTranscript from './components/ChatTranscript.vue'
import ChatComposer from './components/ChatComposer.vue'
const profile = ref(''), session = ref(''), sessions = ref<Session[]>([]), messages = ref<Message[]>([])
const capabilities = ref<Capabilities>({}), offset = ref(0), hasMore = ref(false), loading = ref(false), chatLoading = ref(false), sending = ref(false), approvalPending = ref(false), offline = ref(!navigator.onLine)
const error = ref(''), chatError = ref(''), draft = ref(''), progress = ref<string[]>([]), drawer = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null), closeButton = ref<HTMLButtonElement | null>(null)
const canStream = computed(() => capabilities.value.features?.session_chat_streaming === true && capabilities.value.endpoints?.session_chat_stream?.method === 'POST' && capabilities.value.endpoints.session_chat_stream.path === '/api/sessions/{session_id}/chat/stream')
let listAbort: AbortController | undefined, chatAbort: AbortController | undefined, streamAbort: AbortController | undefined, generation = 0, profileGeneration = 0
function urlState() { const params = new URLSearchParams(location.search); return { profile: params.get('profile') || '', session: params.get('session') || '' } }
function setUrl(replace = false) { const url = new URL(location.href); url.searchParams.delete('profile'); url.searchParams.delete('session'); if (profile.value) url.searchParams.set('profile', profile.value); if (session.value) url.searchParams.set('session', session.value); history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash) }
function cancelChat() { generation++; chatAbort?.abort(); streamAbort?.abort(); chatLoading.value = false; sending.value = false; approvalPending.value = false }
function cancel() { cancelChat(); listAbort?.abort(); loading.value = false }
async function loadSessions(more = false) {
  listAbort?.abort(); const controller = new AbortController(); listAbort = controller; const id = profile.value
  loading.value = true; error.value = ''
  try {
    const result = await api.sessions(id, more ? offset.value : 0, controller.signal)
    if (controller !== listAbort || id !== profile.value) return
    const page = result.sessions
    sessions.value = more ? [...sessions.value, ...page.filter(item => !sessions.value.some(existing => existing.id === item.id))] : page
    offset.value = typeof result.offset === 'number' && typeof result.limit === 'number' ? result.offset + result.limit : (more ? offset.value + page.length : page.length)
    hasMore.value = result.has_more ?? (typeof result.total === 'number' ? offset.value < result.total : page.length === 30)
  } catch (cause) { if (controller === listAbort && !controller.signal.aborted) error.value = cause instanceof Error ? cause.message : 'Could not load sessions' }
  finally { if (controller === listAbort) { loading.value = false; listAbort = undefined } }
}
async function loadMessages() {
  if (!session.value) return false
  chatAbort?.abort(); const controller = new AbortController(); chatAbort = controller; const current = generation, p = profile.value, s = session.value
  chatLoading.value = true; chatError.value = ''
  try { const result = await api.messages(p, s, controller.signal); if (current === generation && controller === chatAbort) { messages.value = result; return true } }
  catch (cause) { if (current === generation && controller === chatAbort && !controller.signal.aborted) chatError.value = cause instanceof Error ? cause.message : 'Could not load messages' }
  finally { if (controller === chatAbort) { chatLoading.value = false; chatAbort = undefined } }
  return false
}
async function chooseProfile(id: string, fromHistory = false) {
  if (id && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) { error.value = 'Invalid profile name'; return }
  cancel(); profile.value = id; session.value = ''; sessions.value = []; messages.value = []; capabilities.value = {}; draft.value = ''; progress.value = []; error.value = ''; chatError.value = ''; offset.value = 0; hasMore.value = false; drawer.value = false
  if (!fromHistory) setUrl()
  const current = ++profileGeneration
  void loadSessions()
  try { const result = await api.capabilities(id); if (current === profileGeneration && profile.value === id) capabilities.value = result } catch { if (current === profileGeneration && profile.value === id) capabilities.value = {} }
}
function chooseSession(id: string, fromHistory = false) {
  cancelChat(); session.value = id; messages.value = []; draft.value = ''; progress.value = []; chatError.value = ''; drawer.value = false
  if (!fromHistory) setUrl()
  void loadMessages(); menuButton.value?.focus()
}
async function createSession() {
  if (offline.value) return
  const id = profile.value, selected = session.value, current = generation
  try {
    const made = await api.create(id)
    if (current !== generation || profile.value !== id || session.value !== selected) return
    await loadSessions()
    if (current !== generation || profile.value !== id || session.value !== selected) return
    chooseSession(made.id)
  } catch (cause) { if (current === generation && profile.value === id && session.value === selected) error.value = cause instanceof Error ? cause.message : 'Could not create session' }
}
async function rename(id: string, title: string) {
  const p = profile.value, current = generation
  try { await api.rename(p, id, title); if (current !== generation || p !== profile.value) return; const found = sessions.value.find(s => s.id === id); if (found) found.title = title }
  catch (cause) { if (current === generation && p === profile.value) error.value = cause instanceof Error ? cause.message : 'Could not rename session' }
}
async function send(text: string) {
  if (!session.value || sending.value || approvalPending.value || offline.value || !canStream.value) return
  sending.value = true; chatError.value = ''; draft.value = ''; progress.value = []
  streamAbort = new AbortController(); const current = generation, p = profile.value, s = session.value
  let completed = false
  try {
    for await (const frame of api.stream(p, s, text, streamAbort.signal)) {
      if (current !== generation) return
      const data = eventPayload(frame)
      if (frame.event === 'assistant.delta') draft.value += typeof data.delta === 'string' ? data.delta : typeof data.text === 'string' ? data.text : ''
      else if (frame.event === 'tool.started') progress.value.push(`Using ${typeof data.tool_name === 'string' ? data.tool_name : typeof data.tool === 'string' ? data.tool : 'tool'}…`)
      else if (frame.event === 'tool.completed') progress.value.push('Tool completed.')
      else if (frame.event === 'tool.failed') progress.value.push('A tool failed.')
      else if (frame.event === 'approval.request') { approvalPending.value = true; streamAbort.abort(); break }
      else if (frame.event === 'run.completed') completed = true
      else if (frame.event === 'run.failed' || frame.event === 'run.cancelled') throw new Error(`Turn ${frame.event.slice(4)}. Check session history before retrying.`)
      else if (frame.event === 'error') throw new Error('Turn failed. Check session history before retrying.')
    }
    if (approvalPending.value) return
    if (!completed) throw new Error('Stream ended without confirmation. Check session history before retrying.')
    if (!await loadMessages()) throw new Error('Turn completed, but history could not be loaded. Refresh history before sending again.')
    draft.value = ''; progress.value = []; await loadSessions()
  } catch (cause) { if (current === generation && !approvalPending.value) chatError.value = cause instanceof Error ? cause.message : 'Send failed. Check session history before retrying.' }
  finally { if (current === generation) sending.value = false }
}
async function reloadAfterApproval() { await loadMessages() }
function onlineChange() { offline.value = !navigator.onLine }
function pop() {
  const state = urlState()
  const pending = chooseProfile(state.profile, true), current = generation
  void pending.then(() => { if (current === generation && profile.value === state.profile && state.session) chooseSession(state.session, true) })
}
function closeDrawer() { drawer.value = false; menuButton.value?.focus() }
async function openDrawer() { drawer.value = true; await nextTick(); closeButton.value?.focus() }
function drawerKey(event: KeyboardEvent) { if (event.key === 'Escape' && drawer.value) closeDrawer() }
onMounted(async () => { addEventListener('online', onlineChange); addEventListener('offline', onlineChange); addEventListener('popstate', pop); addEventListener('keydown', drawerKey); const state = urlState(); const pending = chooseProfile(state.profile, true), current = generation; await pending; if (current === generation && profile.value === state.profile && state.session) chooseSession(state.session, true) })
onUnmounted(() => { cancel(); removeEventListener('online', onlineChange); removeEventListener('offline', onlineChange); removeEventListener('popstate', pop); removeEventListener('keydown', drawerKey) })
</script>
<template>
  <div class="app-shell flex min-h-dvh bg-[#f5f2e9] font-sans text-[#20372f] dark:bg-[#182820] dark:text-[#edf0e8]">
    <aside class="sidebar fixed inset-y-0 left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-6 bg-[#15382f] px-[18px] py-6 text-[#f4f1e7] shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-[#102b23] dark:text-[#f2eee3]" :class="drawer ? 'translate-x-0' : '-translate-x-full'" aria-label="Navigation">
      <div class="brand flex items-center gap-2.5 px-2 font-serif text-2xl font-semibold"><span class="brand-mark grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#dfb476] text-[#15382f] dark:bg-[#d7ae75]">✳</span><span>ChatHermes</span><button ref="closeButton" class="mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#dfb476]" aria-label="Close navigation" @click="closeDrawer">×</button></div>
      <SessionSidebar :sessions="sessions" :selected="session" :loading="loading" :error="error" :has-more="hasMore" :busy="offline" @select="chooseSession" @create="createSession" @more="loadSessions(true)" @retry="loadSessions()" @rename="rename" />
      <div class="sidebar-foot mt-auto grid gap-2 border-t border-[#3d5c4e] px-2 pt-4 text-xs text-[#c5d0c4] dark:border-[#496755] dark:text-[#c8d5c7]">
        <label for="profile-field">Profile (blank uses current)</label>
        <input id="profile-field" class="profile-field w-full rounded-md border border-[#718e7c] bg-[#15382f] px-2 py-2 text-sm text-white focus-visible:outline-3 focus-visible:outline-[#dfb476]" :value="profile" placeholder="Current profile" @change="chooseProfile(($event.target as HTMLInputElement).value.trim())" />
        <span><span class="status-dot mr-2 inline-block size-2 rounded-full" :class="offline ? 'disconnected bg-[#dcae6e]' : 'bg-[#94c9a5]'" />{{ offline ? 'Offline · read only' : 'Connected through dashboard' }}</span>
      </div>
    </aside>
    <div v-if="drawer" class="scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden" @click="closeDrawer" />
    <main class="main-panel flex h-dvh min-w-0 flex-1 flex-col">
      <header class="topbar flex h-[76px] shrink-0 items-center gap-3 border-b border-[#deded2] bg-[#fbf9f3] px-[18px] min-[701px]:h-[91px] min-[701px]:px-[35px] dark:border-[#375044] dark:bg-[#20372e]"><button ref="menuButton" class="mobile-menu px-1 text-2xl min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#c18b53]" aria-label="Open navigation" :aria-expanded="drawer" @click="openDrawer">☰</button><div class="min-w-0 flex-1"><small class="text-[10px] font-bold tracking-[0.17em] text-[#768d7f] dark:text-[#b2c6b7]">HERMES AGENT</small><h1 class="mt-1 truncate font-serif text-lg min-[701px]:text-[22px]">{{ sessions.find(s => s.id === session)?.title || (session ? 'Conversation' : 'New conversation') }}</h1></div><span class="topbar-profile max-w-[30%] truncate rounded-full border border-[#d9dfd5] px-3 py-1.5 text-[11px] text-[#5d7466] min-[701px]:text-xs dark:border-[#5e7867] dark:text-[#c2d4c5]">{{ profile || 'Current profile' }}</span></header>
      <div v-if="offline" class="notice bg-[#ece4ce] px-5 py-3 text-sm text-[#594830] dark:bg-[#4e422d] dark:text-[#f3dfb7]" role="status">You are offline. Messages cannot be loaded or sent.</div>
      <div v-if="approvalPending" class="notice bg-[#ece4ce] px-5 py-3 text-sm text-[#594830] dark:bg-[#4e422d] dark:text-[#f3dfb7]" role="status">Approval is pending. Resolve the request in Hermes, then reload this conversation here to inspect history. Sending stays locked until you leave this conversation or reload the page; confirm the previous turn finished before sending again. <button class="underline disabled:opacity-55" :disabled="chatLoading" @click="reloadAfterApproval">Reload conversation</button></div>
      <div v-if="chatError" class="notice error bg-[#f5dfd7] px-5 py-3 text-sm text-[#70382b] dark:bg-[#59332e] dark:text-[#ffe1d4]" role="alert">{{ chatError }} <button v-if="session" class="underline" @click="loadMessages">Refresh history</button></div>
      <ChatTranscript :messages="messages" :draft="draft" :loading="chatLoading" :progress="progress" />
      <ChatComposer :key="JSON.stringify([profile, session])" :disabled="!session || offline || chatLoading || approvalPending || !canStream" :sending="sending" :reason="!session ? 'Select or create a conversation to begin.' : offline ? 'Offline · sending is unavailable.' : approvalPending ? 'Approval is pending in Hermes.' : !canStream ? 'Streaming turns are unavailable for this profile.' : undefined" @send="send" />
    </main>
  </div>
</template>
