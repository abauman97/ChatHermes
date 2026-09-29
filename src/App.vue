<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { api, eventPayload } from './lib/hermes-api'
import type { Capabilities, Message, Profile, Session } from './types/hermes'
import ProfileSwitcher from './components/ProfileSwitcher.vue'
import SessionSidebar from './components/SessionSidebar.vue'
import ChatTranscript from './components/ChatTranscript.vue'
import ChatComposer from './components/ChatComposer.vue'
import UpdatePrompt from './components/UpdatePrompt.vue'
const profiles = ref<Profile[]>([]), profile = ref(''), session = ref(''), sessions = ref<Session[]>([]), messages = ref<Message[]>([])
const capabilities = ref<Capabilities>({}), offset = ref(0), hasMore = ref(false), loading = ref(false), chatLoading = ref(false), sending = ref(false), approvalPending = ref(false), offline = ref(!navigator.onLine)
const error = ref(''), chatError = ref(''), draft = ref(''), progress = ref<string[]>([]), drawer = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null), closeButton = ref<HTMLButtonElement | null>(null)
const canStream = computed(() => capabilities.value.features?.session_chat_streaming === true && capabilities.value.endpoints?.session_chat_stream?.method === 'POST' && capabilities.value.endpoints.session_chat_stream.path === '/api/sessions/{session_id}/chat/stream')
let listAbort: AbortController | undefined, chatAbort: AbortController | undefined, streamAbort: AbortController | undefined, generation = 0, profileGeneration = 0
function urlState() { const parts = location.pathname.match(/^\/p\/([a-zA-Z0-9_-]+)(?:\/s\/([a-zA-Z0-9_-]+))?\/?$/); return { profile: parts?.[1] || '', session: parts?.[2] || '' } }
function setUrl() { history.pushState({}, '', profile.value ? `/p/${encodeURIComponent(profile.value)}${session.value ? `/s/${encodeURIComponent(session.value)}` : ''}` : '/') }
function cancelChat() { generation++; chatAbort?.abort(); streamAbort?.abort(); chatLoading.value = false; sending.value = false; approvalPending.value = false }
function cancel() { cancelChat(); listAbort?.abort(); loading.value = false }
async function loadSessions(more = false) {
  if (!profile.value) return
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
  if (!profile.value || !session.value) return false
  chatAbort?.abort(); const controller = new AbortController(); chatAbort = controller; const current = generation, p = profile.value, s = session.value
  chatLoading.value = true; chatError.value = ''
  try { const result = await api.messages(p, s, controller.signal); if (current === generation && controller === chatAbort) { messages.value = result; return true } }
  catch (cause) { if (current === generation && controller === chatAbort && !controller.signal.aborted) chatError.value = cause instanceof Error ? cause.message : 'Could not load messages' }
  finally { if (controller === chatAbort) { chatLoading.value = false; chatAbort = undefined } }
  return false
}
async function chooseProfile(id: string, fromHistory = false) {
  if (!profiles.value.some(p => p.id === id)) return
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
  if (!profile.value || offline.value) return
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
  if (!profile.value || !session.value || sending.value || approvalPending.value || offline.value || !canStream.value) return
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
function pop() { const state = urlState(); if (state.profile && profiles.value.some(p => p.id === state.profile)) { const pending = chooseProfile(state.profile, true), current = generation; void pending.then(() => { const url = urlState(); if (current === generation && profile.value === state.profile && !session.value && state.session && url.profile === state.profile && url.session === state.session) chooseSession(state.session, true) }) } }
function closeDrawer() { drawer.value = false; menuButton.value?.focus() }
async function openDrawer() { drawer.value = true; await nextTick(); closeButton.value?.focus() }
function drawerKey(event: KeyboardEvent) { if (event.key === 'Escape' && drawer.value) closeDrawer() }
onMounted(async () => { addEventListener('online', onlineChange); addEventListener('offline', onlineChange); addEventListener('popstate', pop); addEventListener('keydown', drawerKey); try { profiles.value = await api.profiles(); const state = urlState(); const first = profiles.value.find(p => p.id === state.profile)?.id || profiles.value[0]?.id; if (first) { const pending = chooseProfile(first, true), current = generation; await pending; if (current !== generation || profile.value !== first) return; if (state.session && state.profile === first) chooseSession(state.session, true); else setUrl() } } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Could not load profiles' } })
onUnmounted(() => { cancel(); removeEventListener('online', onlineChange); removeEventListener('offline', onlineChange); removeEventListener('popstate', pop); removeEventListener('keydown', drawerKey) })
</script>
<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ open: drawer }" aria-label="Navigation">
      <div class="brand"><span class="brand-mark">✳</span><span>ChatHermes</span><button ref="closeButton" class="mobile-close" aria-label="Close navigation" @click="closeDrawer">×</button></div>
      <ProfileSwitcher :profiles="profiles" :selected="profile" @change="chooseProfile" />
      <SessionSidebar :sessions="sessions" :selected="session" :loading="loading" :error="error" :has-more="hasMore" :busy="offline || !profile" @select="chooseSession" @create="createSession" @more="loadSessions(true)" @retry="loadSessions()" @rename="rename" />
      <div class="sidebar-foot"><span class="status-dot" :class="{ disconnected: offline }" />{{ offline ? 'Offline · read only' : 'Local connection' }}</div>
    </aside>
    <div v-if="drawer" class="scrim" @click="closeDrawer" />
    <main class="main-panel">
      <header class="topbar"><button ref="menuButton" class="mobile-menu" aria-label="Open navigation" :aria-expanded="drawer" @click="openDrawer">☰</button><div><small>HERMES AGENT</small><h1>{{ sessions.find(s => s.id === session)?.title || (session ? 'Conversation' : 'New conversation') }}</h1></div><span class="topbar-profile">{{ profiles.find(p => p.id === profile)?.label || 'No profile' }}</span></header>
      <div v-if="offline" class="notice" role="status">You are offline. Saved app pages may open, but messages cannot be loaded or sent.</div>
      <div v-if="approvalPending" class="notice" role="status">Approval is pending. Resolve the request in Hermes, then reload this conversation here to inspect history. Sending stays locked until you leave this conversation or reload the page; confirm the previous turn finished before sending again. <button :disabled="chatLoading" @click="reloadAfterApproval">Reload conversation</button></div>
      <div v-if="chatError" class="notice error" role="alert">{{ chatError }} <button v-if="session" @click="loadMessages">Refresh history</button></div>
      <ChatTranscript :messages="messages" :draft="draft" :loading="chatLoading" :progress="progress" />
      <ChatComposer :key="JSON.stringify([profile, session])" :disabled="!profile || !session || offline || chatLoading || approvalPending || !canStream" :sending="sending" :reason="!profile ? 'Configure a profile to begin.' : !session ? 'Select or create a conversation to begin.' : offline ? 'Offline · sending is unavailable.' : approvalPending ? 'Approval is pending in Hermes.' : !canStream ? 'Streaming turns are unavailable for this profile.' : undefined" @send="send" />
    </main>
    <UpdatePrompt />
  </div>
</template>
