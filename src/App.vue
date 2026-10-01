<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { api, ApiError, eventPayload, messageText } from './lib/hermes-api'
import type { SSEEvent } from './lib/sse'
import type { Activity, Attachment, Capabilities, Message, ModelOption, Session } from './types/hermes'
import SessionSidebar from './components/SessionSidebar.vue'
import ChatTranscript from './components/ChatTranscript.vue'
import ChatComposer from './components/ChatComposer.vue'
const profile = ref(''), session = ref(''), sessions = ref<Session[]>([]), messages = ref<Message[]>([])
const capabilities = ref<Capabilities>({}), offset = ref(0), hasMore = ref(false), loading = ref(false), chatLoading = ref(false), sending = ref(false), approvalPending = ref(false), offline = ref(!navigator.onLine)
const error = ref(''), chatError = ref(''), draft = ref(''), progress = ref<Activity[]>([]), drawer = ref(false)
const sentContent = new Map<string, unknown>()
const optimisticMessage = ref<Message>(), priorUserCount = ref(0)
const profiles = ref<{ name: string }[]>([]), models = ref<ModelOption[]>([]), model = ref(''), defaultModel = ref(''), creating = ref(false)
const thinking = ref(false), activeRun = ref(''), embedded = ref(false), suggestedPrompt = ref('')
const menuButton = ref<HTMLButtonElement | null>(null), closeButton = ref<HTMLButtonElement | null>(null)
const canStream = computed(() => capabilities.value.features?.session_chat_streaming === true && capabilities.value.endpoints?.session_chat_stream?.method === 'POST' && capabilities.value.endpoints.session_chat_stream.path === '/api/sessions/{session_id}/chat/stream')
let listAbort: AbortController | undefined, chatAbort: AbortController | undefined, streamAbort: AbortController | undefined, generation = 0, profileGeneration = 0, streamGeneration = 0, historyGeneration = 0
let visibilityAbort: AbortController | undefined, retiredStreamAbort: AbortController | undefined, reconnecting = false
function urlState() { const params = new URLSearchParams(location.search); return { profile: params.get('profile') || '', session: params.get('session') || '' } }
function setUrl(replace = false) { const url = new URL(location.href); url.searchParams.delete('profile'); url.searchParams.delete('session'); if (profile.value) url.searchParams.set('profile', profile.value); if (session.value) url.searchParams.set('session', session.value); history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash) }
function cancelChat() { sentContent.clear(); optimisticMessage.value = undefined; generation++; streamGeneration++; visibilityAbort?.abort(); retiredStreamAbort?.abort(); activeRun.value = ''; thinking.value = false; chatAbort?.abort(); streamAbort?.abort(); chatLoading.value = false; sending.value = false; approvalPending.value = false }
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
function reconcileHistory(result: Message[]) {
  if (optimisticMessage.value && result.filter(item => item.role === 'user').length <= priorUserCount.value) return [...result.map(item => item.id && sentContent.has(item.id) ? { ...item, content: sentContent.get(item.id) } : item), optimisticMessage.value]
  if (optimisticMessage.value) {
    const user = [...result].reverse().find(item => item.role === 'user')
    if (user?.id) sentContent.set(user.id, optimisticMessage.value.content)
  }
  optimisticMessage.value = undefined
  return result.map(item => item.id && sentContent.has(item.id) ? { ...item, content: sentContent.get(item.id) } : item)
}
async function loadMessages() {
  if (!session.value) return false
  historyGeneration++; visibilityAbort?.abort(); chatAbort?.abort(); const controller = new AbortController(); chatAbort = controller; const current = generation, p = profile.value, s = session.value
  chatLoading.value = true; chatError.value = ''
  try { const result = await api.messages(p, s, controller.signal); if (current === generation && controller === chatAbort) { updateActivityOutputs(result); messages.value = reconcileHistory(result); return true } }
  catch (cause) { if (current === generation && controller === chatAbort && !controller.signal.aborted) chatError.value = cause instanceof Error ? cause.message : 'Could not load messages' }
  finally { if (controller === chatAbort) { chatLoading.value = false; chatAbort = undefined } }
  return false
}
async function chooseProfile(id: string, fromHistory = false) {
  if (id && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) { error.value = 'Invalid profile name'; return }
  cancel(); profile.value = id; session.value = ''; sessions.value = []; messages.value = []; capabilities.value = {}; models.value = []; model.value = ''; defaultModel.value = ''; draft.value = ''; progress.value = []; error.value = ''; chatError.value = ''; offset.value = 0; hasMore.value = false; drawer.value = false
  if (!fromHistory) setUrl()
  const current = ++profileGeneration
  void loadSessions()
  void api.models(id).then(result => { if (current === profileGeneration) { models.value = (result.data || []).filter(item => item.parent !== null); defaultModel.value = result.default_model || '' } }).catch(() => {})
  try { const result = await api.capabilities(id); if (current === profileGeneration && profile.value === id) capabilities.value = result } catch { if (current === profileGeneration && profile.value === id) capabilities.value = {} }
}
async function chooseSession(id: string, fromHistory = false) {
  suggestedPrompt.value = ''; cancelChat(); session.value = id; messages.value = []; draft.value = ''; progress.value = []; chatError.value = ''; drawer.value = false
  if (!fromHistory) setUrl()
  await loadMessages()
}
async function createSession() {
  if (offline.value || creating.value) return
  const id = profile.value, selected = session.value, current = generation
  creating.value = true
  try {
    const made = await api.create(id)
    if (current !== generation || profile.value !== id || session.value !== selected) return
    sessions.value = [made, ...sessions.value.filter(item => item.id !== made.id)]
    const pending = chooseSession(made.id), selectionGeneration = generation
    await pending
    if (selectionGeneration !== generation || profile.value !== id || session.value !== made.id) return
    return made.id
  } catch (cause) { if (current === generation && profile.value === id) error.value = cause instanceof Error ? cause.message : 'Could not create session' }
  finally { creating.value = false }
}
async function suggest(text: string) {
  const current = generation, p = profile.value, id = await createSession()
  if (id && current + 1 === generation && p === profile.value && session.value === id) suggestedPrompt.value = text
}
async function rename(id: string, title: string) {
  const p = profile.value, current = generation
  try { await api.rename(p, id, title); if (current !== generation || p !== profile.value) return; const found = sessions.value.find(s => s.id === id); if (found) found.title = title }
  catch (cause) { if (current === generation && p === profile.value) error.value = cause instanceof Error ? cause.message : 'Could not rename session' }
}
function updateActivityOutputs(history: Message[]) {
  if (!progress.value.length || history.filter(item => item.role === 'user').length <= priorUserCount.value) return
  const last = history.reduce((index, item, current) => item.role === 'user' ? current : index, -1)
  const tools = progress.value.filter(item => item.kind === 'tool')
  history.slice(last + 1).filter(item => item.role === 'tool').forEach((message, index) => {
    if (tools[index]) tools[index]!.output = messageText(message.content)
  })
}
function finishActivities() { progress.value.forEach(item => { item.complete = true }); thinking.value = false }
function activity(kind: 'thinking' | 'tool', title: string, id?: string) {
  const found = [...progress.value].reverse().find(item => !item.complete && item.kind === kind && item.title === title && (!id || item.id === id))
  if (found) return found
  const item: Activity = { id: id || crypto.randomUUID(), kind, title, content: '', complete: false }
  progress.value.push(item)
  return progress.value[progress.value.length - 1]!
}
function reduceFrame(frame: SSEEvent): 'completed' | 'approval' | undefined {
  const data = eventPayload(frame)
  if (!activeRun.value && typeof data.run_id === 'string') activeRun.value = data.run_id
  const delta = typeof data.delta === 'string' ? data.delta : typeof data.text === 'string' ? data.text : ''
  const name = typeof data.tool_name === 'string' ? data.tool_name : typeof data.tool === 'string' ? data.tool : 'Tool call'
  const callId = typeof data.tool_call_id === 'string' ? data.tool_call_id : undefined
  if (frame.event === 'assistant.delta' || frame.event === 'message.delta') { finishActivities(); draft.value += delta }
  else if (frame.event === 'assistant.completed' && typeof data.content === 'string') { finishActivities(); draft.value = data.content }
  else if (frame.event === 'assistant.commentary' && !data.already_streamed && typeof data.text === 'string') draft.value += data.text + '\n\n'
  else if (frame.event === 'tool.started') {
    progress.value.filter(item => item.kind === 'thinking').forEach(item => { item.complete = true }); thinking.value = false
    const item = activity('tool', name, callId || crypto.randomUUID())
    item.content = data.args ? JSON.stringify(data.args, null, 2) : typeof data.preview === 'string' ? data.preview : ''
  } else if (['thinking.delta', 'reasoning.delta', 'reasoning.available', 'tool.progress', 'tool.delta'].includes(frame.event)) {
    const isThinking = frame.event.startsWith('thinking') || frame.event.startsWith('reasoning') || name === '_thinking'
    const emptyThinking = isThinking ? progress.value.find(item => item.kind === 'thinking' && !item.content) : undefined
    const item = emptyThinking || activity(isThinking ? 'thinking' : 'tool', isThinking ? 'Thinking…' : name, callId)
    item.content += delta || (typeof data.preview === 'string' ? data.preview : '')
    thinking.value = isThinking
  } else if (frame.event === 'tool.completed' || frame.event === 'tool.failed') {
    const item = [...progress.value].reverse().find(item => item.kind === 'tool' && !item.complete && (callId ? item.id === callId : item.title === name))
    if (item) { item.complete = true; if (typeof data.output === 'string') item.output = data.output; if (frame.event === 'tool.failed') item.title += ' (failed)' }
  } else if (frame.event === 'approval.request') { finishActivities(); approvalPending.value = true; streamAbort?.abort(); return 'approval' }
  else if (frame.event === 'run.completed') { finishActivities(); activeRun.value = ''; return 'completed' }
  else if (['run.failed', 'run.cancelled', 'error'].includes(frame.event)) { finishActivities(); activeRun.value = ''; throw new Error('Turn failed. Check session history before retrying.') }
}
async function send(text: string, attachments: Attachment[] = []) {
  if (sending.value || creating.value || approvalPending.value || offline.value || !canStream.value) return
  if (!session.value && !await createSession()) return
  if (sending.value || approvalPending.value) return
  sending.value = true; thinking.value = true; activeRun.value = ''; chatError.value = ''; draft.value = ''; progress.value = []
  activity('thinking', 'Thinking…')
  priorUserCount.value = messages.value.filter(item => item.role === 'user').length
  optimisticMessage.value = { id: 'pending-' + crypto.randomUUID(), role: 'user', content: [
    { type: 'text', text }, ...attachments.map(file => file.type.startsWith('image/') ? { type: 'image_url', image_url: { url: file.data } } : { type: 'text', text: '📎 ' + file.name })
  ] }
  messages.value.push(optimisticMessage.value)
  streamAbort = new AbortController(); const current = generation, streamCurrent = ++streamGeneration, p = profile.value, s = session.value
  let completed = false
  try {
    const parts: unknown[] = [{ type: 'text', text: text || 'Please examine the attached files.' }]
    for (const file of attachments) {
      if (file.type.startsWith('image/')) parts.push({ type: 'image_url', image_url: { url: file.data } })
      else { const uploaded = await api.upload(p, file); if (current !== generation) return; parts.push({ type: 'text', text: `Attached file ${file.name}: ${uploaded.path}` }) }
    }
    for await (const frame of api.stream(p, s, attachments.length ? parts : text, streamAbort.signal, model.value || defaultModel.value)) {
      if (current !== generation) return
      if (streamCurrent !== streamGeneration) continue
      const outcome = reduceFrame(frame)
      if (outcome === 'completed') completed = true
      if (outcome === 'approval') break
    }
    if (current !== generation || streamCurrent !== streamGeneration || approvalPending.value) return
    if (!completed) throw new Error('Stream ended without confirmation. Check session history before retrying.')
    if (!await loadMessages()) throw new Error('Turn completed, but history could not be loaded. Refresh history before sending again.')
    draft.value = ''; await loadSessions()
  } catch (cause) { if (current === generation && streamCurrent === streamGeneration && !approvalPending.value) chatError.value = cause instanceof Error ? cause.message : 'Send failed. Check session history before retrying.' }
  finally { if (current === generation && streamCurrent === streamGeneration) { sending.value = false; finishActivities() } }
}
async function refreshVisibleHistory(current: number, p: string, s: string, controller: AbortController) {
  if (current !== generation || controller.signal.aborted) return false
  const historyCurrent = ++historyGeneration, pendingHistory = chatAbort
  try { const result = await api.messages(p, s, controller.signal); if (current === generation && historyCurrent === historyGeneration && !controller.signal.aborted && !pendingHistory) { updateActivityOutputs(result); messages.value = reconcileHistory(result); return true } } catch { /* Visibility refresh is best-effort; preserve the existing history. */ }
  return false
}
async function visibilityChange() {
  if (document.visibilityState !== 'visible' || !session.value || reconnecting) return
  visibilityAbort?.abort(); const controller = new AbortController(); visibilityAbort = controller
  const current = generation, p = profile.value, s = session.value, run = activeRun.value
  reconnecting = true
  let streamCurrent: number | undefined
  try {
    await refreshVisibleHistory(current, p, s, controller)
    if (current !== generation || controller.signal.aborted || !run || activeRun.value !== run || approvalPending.value) return
    const result = await api.runStatus(p, run, controller.signal)
    if (current !== generation || controller.signal.aborted || activeRun.value !== run) return
    const status = typeof result.status === 'string' ? result.status : typeof result.run?.status === 'string' ? result.run.status : ''
    streamCurrent = ++streamGeneration
    if (['completed', 'failed', 'cancelled', 'interrupted', 'stopped'].includes(status)) { streamAbort?.abort(); activeRun.value = ''; return }
    retiredStreamAbort = streamAbort; streamAbort = controller; sending.value = true; thinking.value = true; draft.value = ''; progress.value = []; activity('thinking', 'Thinking…'); chatError.value = ''
    for await (const frame of api.runEvents(p, run, controller.signal)) {
      if (current !== generation || streamCurrent !== streamGeneration) return
      const outcome = reduceFrame(frame)
      if (outcome === 'completed' || outcome === 'approval') break
    }
  } catch (cause) {
    if (current === generation && cause instanceof ApiError && cause.status === 404) { streamCurrent = ++streamGeneration; streamAbort?.abort(); activeRun.value = '' }
  } finally {
    if (current === generation && streamCurrent === streamGeneration) {
      if (!activeRun.value) { retiredStreamAbort?.abort(); retiredStreamAbort = undefined }
      activeRun.value = ''; sending.value = false; thinking.value = false
      const refreshed = await refreshVisibleHistory(current, p, s, controller)
      if (refreshed && current === generation && !controller.signal.aborted) { draft.value = ''; finishActivities(); chatError.value = '' }
    }
    reconnecting = false
    if (visibilityAbort === controller) visibilityAbort = undefined
  }
}
function exitPlugin() { location.href = '/' }
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
onMounted(async () => { void api.profiles().then(result => { profiles.value = result.profiles || [] }).catch(() => { error.value = 'Could not load profiles' }); embedded.value = !!menuButton.value?.closest('.chathermes-embedded'); document.addEventListener('visibilitychange', visibilityChange); addEventListener('online', onlineChange); addEventListener('offline', onlineChange); addEventListener('popstate', pop); addEventListener('keydown', drawerKey); const state = urlState(); const pending = chooseProfile(state.profile, true), current = generation; await pending; if (current === generation && profile.value === state.profile && state.session) chooseSession(state.session, true) })
onUnmounted(() => { document.removeEventListener('visibilitychange', visibilityChange); cancel(); removeEventListener('online', onlineChange); removeEventListener('offline', onlineChange); removeEventListener('popstate', pop); removeEventListener('keydown', drawerKey) })
</script>
<template>
  <div class="app-shell flex min-h-dvh bg-[#212121] font-sans text-[#f4f4f4] dark:bg-[#212121] dark:text-[#f4f4f4]">
    <aside class="sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-5 bg-[#171717] px-[18px] py-6 text-[#f4f4f4] shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-[#171717] dark:text-[#f4f4f4]" :class="drawer ? 'translate-x-0' : '-translate-x-full'" aria-label="Navigation">
      <div class="brand flex items-center gap-2.5 px-2 text-2xl font-semibold"><span class="brand-mark grid size-9 shrink-0 place-items-center text-white">✳</span><span>ChatHermes</span><button ref="closeButton" class="mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]" aria-label="Close navigation" @click="closeDrawer">×</button></div>
      <SessionSidebar :sessions="sessions" :selected="session" :loading="loading" :error="error" :has-more="hasMore" :busy="offline" @select="chooseSession" @create="createSession" @more="loadSessions(true)" @retry="loadSessions()" @rename="rename" />
      <div class="sidebar-foot mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]">
        <label for="profile-field">Profile</label>
        <select id="profile-field" class="profile-field w-full rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white" :value="profile" @change="chooseProfile(($event.target as HTMLSelectElement).value)">
          <option value="">Current profile</option><option v-if="profile && !profiles.some(item => item.name === profile)" :value="profile">{{ profile }}</option><option v-for="item in profiles" :key="item.name" :value="item.name">{{ item.name }}</option>
        </select>
        <span><span class="status-dot mr-2 inline-block size-2 rounded-full" :class="offline ? 'disconnected bg-[#dcae6e]' : 'bg-[#94c9a5]'" />{{ offline ? 'Offline · read only' : 'Connected through dashboard' }}</span>
      </div>
    </aside>
    <div v-if="drawer" class="scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden" @click="closeDrawer" />
    <main class="main-panel flex h-dvh min-w-0 flex-1 flex-col">
      <header class="topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8">
        <button ref="menuButton" class="mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]" aria-label="Open navigation" :aria-expanded="drawer" @click="openDrawer"><svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 6h18M3 13h12" /></svg></button>
        <h1 class="min-w-0 flex-1 truncate text-base font-medium">{{ sessions.find(s => s.id === session)?.title || (session ? 'Conversation' : 'ChatHermes') }}</h1>
        <span class="topbar-profile max-w-[30%] truncate rounded-full bg-[#303030] px-3 py-1.5 text-xs text-[#b4b4b4]">{{ profile || 'Current profile' }}</span>
        <span class="grid size-8 shrink-0 place-items-center text-2xl" aria-label="ChatHermes logo">✳</span>
        <button v-if="embedded" class="shrink-0 rounded-lg px-2 py-2 text-sm hover:bg-[#303030]" aria-label="Back to dashboard" @click="exitPlugin">←<span class="hidden min-[701px]:inline"> Back to dashboard</span></button>
      </header>
      <div v-if="offline" class="notice bg-[#303030] px-5 py-3 text-sm text-[#e5e5e5] dark:bg-[#303030] dark:text-[#e5e5e5]" role="status">You are offline. Messages cannot be loaded or sent.</div>
      <div v-if="approvalPending" class="notice bg-[#303030] px-5 py-3 text-sm text-[#e5e5e5] dark:bg-[#303030] dark:text-[#e5e5e5]" role="status">Approval is pending. Resolve the request in Hermes, then reload this conversation here to inspect history. Sending stays locked until you leave this conversation or reload the page; confirm the previous turn finished before sending again. <button class="underline disabled:opacity-55" :disabled="chatLoading" @click="reloadAfterApproval">Reload conversation</button></div>
      <div v-if="chatError" class="notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]" role="alert">{{ chatError }} <button v-if="session" class="underline" @click="loadMessages">Refresh history</button></div>
      <ChatTranscript :messages="messages" :draft="draft" :loading="chatLoading" :progress="progress" :thinking="thinking" :home="!session" @suggest="suggest" />
      <ChatComposer :key="JSON.stringify([profile, session])" :disabled="offline || creating || chatLoading || approvalPending || !canStream" :models="models" :default-model="defaultModel" v-model:model="model" :sending="sending" :suggested-prompt="suggestedPrompt" :reason="offline ? 'Offline · sending is unavailable.' : approvalPending ? 'Approval is pending in Hermes.' : !canStream ? 'Streaming turns are unavailable for this profile.' : undefined" @send="send" />
    </main>
  </div>
</template>
