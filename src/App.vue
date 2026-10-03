<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { api, ApiError, eventPayload } from './lib/hermes-api'
import type { SSEEvent } from './lib/sse'
import type { Activity, Attachment, Capabilities, Message, ModelOption, ProviderOption, Session, Project } from './types/hermes'
import { createTurn, finishTurn, normalizeEvent, reduceTurn, historyBlocks, mergeHistoryBlocks } from './lib/assistant-turn'
import { projectRoot, projectSessions } from './lib/projects'
import ProjectSidebar from './components/ProjectSidebar.vue'
import SessionSidebar from './components/SessionSidebar.vue'
import ChatTranscript from './components/ChatTranscript.vue'
import ChatComposer from './components/ChatComposer.vue'
const projectView = ref(false)
const projectId = ref(''), projects = ref<Project[]>([]), selectedProject = ref<Project>(), projectsLoading = ref(false), projectLoading = ref(false), projectsError = ref(''), projectError = ref('')
const scopedSessionIds = ref<string[]>([])
const visibleSessions = computed(() => projectId.value ? selectedProject.value ? projectSessions(selectedProject.value) : [] : sessions.value.filter(row => !scopedSessionIds.value.includes(row.id)))
let closeProjectEvents: (() => void) | undefined
let refreshTimer: ReturnType<typeof setTimeout> | undefined
function subscribeProjectEvents() {
  closeProjectEvents?.(); closeProjectEvents = undefined
  if (typeof EventSource === 'undefined') return
  closeProjectEvents = api.isWorkspace(profile.value, session.value)
    ? api.projectEvents(profile.value, refreshProjects, session.value)
    : api.projectEvents(profile.value, refreshProjects)
}
function refreshProjects() { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => { void loadProjects(); if (projectId.value) void loadProject() }, 100) }
let projectsAbort: AbortController | undefined, projectAbort: AbortController | undefined
const profile = ref(''), session = ref(''), sessions = ref<Session[]>([]), messages = ref<Message[]>([])
const capabilities = ref<Capabilities>({}), offset = ref(0), hasMore = ref(false), loading = ref(false), chatLoading = ref(false), sending = ref(false), approvalPending = ref(false), offline = ref(!navigator.onLine)
const error = ref(''), chatError = ref(''), draft = ref(''), turn = ref(createTurn()), drawer = ref(false)
const progress = computed(() => turn.value.blocks.filter((block): block is Activity => block.kind !== 'text'))
const turnHistory = new Map<number, Message['blocks']>()
const sentContent = new Map<string, unknown>()
const optimisticMessage = ref<Message>(), priorUserCount = ref(0)
// Render-only IDs need uniqueness within this mount, not secure-context APIs.
let localSequence = 0
function localId() { return `chathermes-ui-${++localSequence}` }
const profiles = ref<{ name: string }[]>([]), models = ref<ModelOption[]>([]), model = ref(''), defaultModel = ref(''), creating = ref(false)
const providers = ref<ProviderOption[]>([]), provider = ref(''), modelsLoading = ref(false)
const thinking = ref(false), activeRun = ref(''), embedded = ref(false), suggestedPrompt = ref('')
const menuButton = ref<HTMLButtonElement | null>(null), closeButton = ref<HTMLButtonElement | null>(null)
const canStream = computed(() => capabilities.value.features?.session_chat_streaming === true && capabilities.value.endpoints?.session_chat_stream?.method === 'POST' && capabilities.value.endpoints.session_chat_stream.path === '/api/sessions/{session_id}/chat/stream')
let listAbort: AbortController | undefined, chatAbort: AbortController | undefined, streamAbort: AbortController | undefined, generation = 0, profileGeneration = 0, streamGeneration = 0, historyGeneration = 0
let visibilityAbort: AbortController | undefined, retiredStreamAbort: AbortController | undefined, reconnecting = false
function urlState() { const params = new URLSearchParams(location.search); return { profile: params.get('profile') || '', session: params.get('session') || '', project: params.get('project') || '' } }
function setUrl(replace = false) { const url = new URL(location.href); url.searchParams.delete('profile'); url.searchParams.delete('session'); url.searchParams.delete('project'); if (projectId.value) url.searchParams.set('project', projectId.value); if (profile.value) url.searchParams.set('profile', profile.value); if (session.value) url.searchParams.set('session', session.value); history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash) }
function cancelChat() { turnHistory.clear(); sentContent.clear(); optimisticMessage.value = undefined; generation++; streamGeneration++; visibilityAbort?.abort(); retiredStreamAbort?.abort(); activeRun.value = ''; thinking.value = false; chatAbort?.abort(); streamAbort?.abort(); chatLoading.value = false; sending.value = false; approvalPending.value = false }
function cancel() { cancelChat(); listAbort?.abort(); loading.value = false }
async function loadProjects() {
  projectsAbort?.abort(); const controller = new AbortController(); projectsAbort = controller; const p = profile.value
  projectsLoading.value = true; projectsError.value = ''
  try {
    const result = await api.projects(p, controller.signal)
    if (controller !== projectsAbort || p !== profile.value) return
    if (!Array.isArray(result.projects) || result.projects.some(item => !item || typeof item.id !== 'string' || typeof item.label !== 'string')) throw new Error('Invalid Hermes Projects response')
    projects.value = result.projects; scopedSessionIds.value = result.scoped_session_ids || []
  } catch { if (controller === projectsAbort && !controller.signal.aborted) projectsError.value = 'Could not load Projects.' }
  finally { if (controller === projectsAbort) projectsLoading.value = false }
}
async function loadProject() {
  projectAbort?.abort(); const controller = new AbortController(); projectAbort = controller
  const p = profile.value, id = projectId.value
  if (!id) return
  projectLoading.value = true; projectError.value = ''
  try {
    const result = await api.project(p, id, controller.signal)
    if (controller === projectAbort && !controller.signal.aborted && p === profile.value && id === projectId.value) selectedProject.value = result
  } catch (cause) { if (controller === projectAbort && !controller.signal.aborted) projectError.value = cause instanceof ApiError && cause.status === 404 ? 'Project no longer exists. Return to Other chats.' : 'Could not load this Project. Retry or return to Other chats.' }
  finally { if (controller === projectAbort) projectLoading.value = false }
}
async function chooseProject(id: string, fromHistory = false) {
  // Scope changes never touch the live/stored session or its working directory.
  projectAbort?.abort(); projectId.value = id; projectView.value = !!id; selectedProject.value = undefined; projectError.value = ''; drawer.value = false
  if (!fromHistory) setUrl()
  await loadProject()
}
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
    const user = result.filter(item => item.role === 'user')[priorUserCount.value]
    if (user?.id) sentContent.set(user.id, optimisticMessage.value.content)
  }
  optimisticMessage.value = undefined
  let userCount = 0
  return result.map(item => {
    const message = item.id && sentContent.has(item.id) ? { ...item, content: sentContent.get(item.id) } : item
    if (message.role === 'user') { userCount++; const blocks = turnHistory.get(userCount); if (blocks?.length) return { ...message, blocks } }
    return message
  })
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
  closeProjectEvents?.(); closeProjectEvents = undefined; clearTimeout(refreshTimer); scopedSessionIds.value = []; cancel(); projectsAbort?.abort(); projectAbort?.abort(); projectId.value = ''; projectView.value = false; selectedProject.value = undefined; projects.value = []; projectError.value = ''; projectsError.value = ''; projectLoading.value = false; profile.value = id; session.value = ''; sessions.value = []; messages.value = []; capabilities.value = {}; models.value = []; providers.value = []; provider.value = ''; model.value = ''; defaultModel.value = ''; modelsLoading.value = true; draft.value = ''; turn.value = createTurn(); error.value = ''; chatError.value = ''; offset.value = 0; hasMore.value = false; drawer.value = false
  if (!fromHistory) setUrl()
  const current = ++profileGeneration
  subscribeProjectEvents()
  void loadProjects()
  void loadSessions()
  void Promise.allSettled([api.models(id), api.modelOptions(id)]).then(([catalog, inventory]) => {
    if (current !== profileGeneration) return
    if (catalog.status === 'fulfilled') { models.value = catalog.value.data || []; defaultModel.value = catalog.value.default_model || '' }
    if (inventory.status === 'fulfilled' && Array.isArray(inventory.value.providers)) {
      providers.value = inventory.value.providers.filter(item => item.models.length || item.is_current)
      provider.value = providers.value.find(item => item.is_current)?.slug || inventory.value.provider || ''
      defaultModel.value = inventory.value.model || defaultModel.value
    }
    modelsLoading.value = false
  })
  try { const result = await api.capabilities(id); if (current === profileGeneration && profile.value === id) capabilities.value = result } catch { if (current === profileGeneration && profile.value === id) capabilities.value = {} }
}
async function chooseSession(id: string, fromHistory = false) {
  if (projectId.value) api.workspace(profile.value, id)
  else if (sessions.value.find(row => row.id === id)?.cwd || sessions.value.find(row => row.id === id)?.source === 'desktop') api.workspace(profile.value, id)
  projectView.value = false; suggestedPrompt.value = ''; cancelChat(); session.value = id; messages.value = []; draft.value = ''; turn.value = createTurn(); chatError.value = ''; drawer.value = false
  if (!fromHistory) setUrl()
  const current = generation, p = profile.value
  if (!projectId.value && !api.isWorkspace(p, id)) {
    try { await api.session(p, id) } catch { /* History still supplies the route's error. */ }
    if (current !== generation || p !== profile.value) return
  }
  subscribeProjectEvents()
  await loadMessages()
}
async function createSession() {
  if (offline.value || creating.value) return
  const id = profile.value, scope = projectId.value, selected = session.value, current = generation
  creating.value = true
  try {
    if (scope && !provider.value) { provider.value = providers.value.find(item => item.is_current)?.slug || ''; model.value = '' }
    const made = scope ? await api.projectCreate(id, scope) : await api.create(id)
    if (current !== generation || profile.value !== id || session.value !== selected || projectId.value !== scope) return
    sessions.value = [made, ...sessions.value.filter(item => item.id !== made.id)]
    // RPC drafts have no DB row until the first prompt; their normal resume path
    // can still hydrate them by stored ID. Keep the same chat components.
    const pending = chooseSession(made.id), selectionGeneration = generation
    refreshProjects()
    await pending
    if (selectionGeneration !== generation || profile.value !== id || session.value !== made.id) return
    return made.id
  } catch (cause) { if (current === generation && profile.value === id && projectId.value === scope) { const message = cause instanceof Error ? cause.message : 'Could not create session'; if (scope) projectError.value = message; else error.value = message } }
  finally { creating.value = false }
}
async function suggest(text: string) {
  const current = generation, p = profile.value, id = await createSession()
  if (id && current + 1 === generation && p === profile.value && session.value === id) suggestedPrompt.value = text
}
async function rename(id: string, title: string) {
  const p = profile.value, current = generation
  try { await api.rename(p, id, title); if (current !== generation || p !== profile.value) return; const found = sessions.value.find(s => s.id === id); if (found) found.title = title; refreshProjects() }
  catch (cause) { if (current === generation && p === profile.value) error.value = cause instanceof Error ? cause.message : 'Could not rename session' }
}
function updateActivityOutputs(history: Message[]) {
  if (!turn.value.blocks.length || history.filter(item => item.role === 'user').length <= priorUserCount.value) return
  // Recover this cached turn, even if another client has appended a later turn.
  const users = history.flatMap((item, index) => item.role === 'user' ? [index] : [])
  const start = users[priorUserCount.value]!
  const end = users[priorUserCount.value + 1] ?? history.length
  mergeHistoryBlocks(turn.value, historyBlocks(history.slice(start + 1, end)), !!activeRun.value)
}
function finishActivities() { finishTurn(turn.value); thinking.value = false }
function reduceFrame(frame: SSEEvent): 'completed' | 'approval' | undefined {
  const data = eventPayload(frame)
  if (!activeRun.value && typeof data.run_id === 'string') activeRun.value = data.run_id
  const event = normalizeEvent(frame)
  if (!event) return
  reduceTurn(turn.value, event)
  draft.value = turn.value.blocks.filter(block => block.kind === 'text').map(block => block.content).join('')
  thinking.value = progress.value.some(item => item.kind === 'thinking' && !item.complete)
  if (event.type === 'approval') { approvalPending.value = true; streamAbort?.abort(); return 'approval' }
  if (event.type === 'completed') { refreshProjects(); activeRun.value = ''; return 'completed' }
  if (event.type === 'failed') { activeRun.value = ''; throw new Error('Turn failed. Check session history before retrying.') }
}
async function send(text: string, attachments: Attachment[] = []) {
  if (sending.value || creating.value || approvalPending.value || offline.value || !canStream.value || modelsLoading.value) return
  if ((projectView.value || !session.value) && !await createSession()) return
  if (sending.value || approvalPending.value) return
  historyGeneration++; visibilityAbort?.abort(); chatAbort?.abort(); chatAbort = undefined; chatLoading.value = false
  sending.value = true; thinking.value = true; activeRun.value = ''; chatError.value = ''; draft.value = ''; turn.value = createTurn()
  reduceTurn(turn.value, { type: 'reasoning', data: {} })
  priorUserCount.value = messages.value.filter(item => item.role === 'user').length
  optimisticMessage.value = { id: 'pending-' + localId(), role: 'user', content: [
    { type: 'text', text }, ...attachments.map(file => file.type.startsWith('image/') ? { type: 'image_url', image_url: { url: file.data } } : { type: 'text', text: '📎 ' + file.name })
  ] }
  turnHistory.set(priorUserCount.value + 1, turn.value.blocks)
  messages.value.push(optimisticMessage.value)
  streamAbort = new AbortController(); const current = generation, streamCurrent = ++streamGeneration, p = profile.value, s = session.value
  let completed = false
  try {
    const parts: unknown[] = [{ type: 'text', text: text || 'Please examine the attached files.' }]
    for (const file of attachments) {
      if (file.type.startsWith('image/')) parts.push({ type: 'image_url', image_url: { url: file.data } })
      else { const uploaded = await api.upload(p, file); if (current !== generation) return; parts.push({ type: 'text', text: `Attached file ${file.name}: ${uploaded.path}` }) }
    }
    for await (const frame of api.stream(p, s, attachments.length ? parts : text, streamAbort.signal, model.value || defaultModel.value, provider.value)) {
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
  finally { if (current === generation && streamCurrent === streamGeneration) { sending.value = !!activeRun.value; if (!activeRun.value) finishActivities() } }
}
async function refreshVisibleHistory(current: number, p: string, s: string, controller: AbortController) {
  if (current !== generation || controller.signal.aborted) return false
  const historyCurrent = ++historyGeneration, pendingHistory = chatAbort
  try { const result = await api.messages(p, s, controller.signal); if (current === generation && historyCurrent === historyGeneration && !controller.signal.aborted && !pendingHistory) { updateActivityOutputs(result); messages.value = reconcileHistory(result); return true } } catch { /* Visibility refresh is best-effort; preserve the existing history. */ }
  return false
}
async function visibilityChange() {
  if (document.visibilityState !== 'visible') return
  refreshProjects()
  if (!session.value || reconnecting) return
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
    retiredStreamAbort = streamAbort; streamAbort = controller; sending.value = true; chatError.value = ''
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
function onlineChange() { offline.value = !navigator.onLine; if (!offline.value) { refreshProjects(); void loadSessions(); if (activeRun.value) void visibilityChange() } }
function pop() {
  const state = urlState()
  const pending = chooseProfile(state.profile, true), current = generation
  void pending.then(() => { if (current === generation && profile.value === state.profile) { if (state.project) { void chooseProject(state.project, true).then(() => { if (current === generation && state.session) void chooseSession(state.session, true) }) } else if (state.session) void chooseSession(state.session, true) } })
}
function closeDrawer() { drawer.value = false; menuButton.value?.focus() }
async function openDrawer() { drawer.value = true; await nextTick(); closeButton.value?.focus() }
function drawerKey(event: KeyboardEvent) { if (event.key === 'Escape' && drawer.value) closeDrawer() }
onMounted(async () => { void api.profiles().then(result => { profiles.value = result.profiles || [] }).catch(() => { error.value = 'Could not load profiles' }); embedded.value = !!menuButton.value?.closest('.chathermes-embedded'); document.addEventListener('visibilitychange', visibilityChange); addEventListener('online', onlineChange); addEventListener('offline', onlineChange); addEventListener('popstate', pop); addEventListener('keydown', drawerKey); const state = urlState(); const pending = chooseProfile(state.profile, true), current = generation; await pending; if (current === generation && profile.value === state.profile) { if (state.project) { void chooseProject(state.project, true).then(() => { if (current === generation && state.session) void chooseSession(state.session, true) }) } else if (state.session) void chooseSession(state.session, true) } })
onUnmounted(() => { closeProjectEvents?.(); clearTimeout(refreshTimer); document.removeEventListener('visibilitychange', visibilityChange); cancel(); projectsAbort?.abort(); projectAbort?.abort(); removeEventListener('online', onlineChange); removeEventListener('offline', onlineChange); removeEventListener('popstate', pop); removeEventListener('keydown', drawerKey) })
</script>
<template>
  <div class="app-shell flex min-h-dvh bg-[#212121] font-sans text-[#f4f4f4] dark:bg-[#212121] dark:text-[#f4f4f4]">
    <aside class="sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-5 bg-[#171717] px-[18px] py-6 text-[#f4f4f4] shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-[#171717] dark:text-[#f4f4f4]" :class="drawer ? 'translate-x-0' : '-translate-x-full'" aria-label="Navigation">
      <div class="brand flex items-center gap-2.5 px-2 text-2xl font-semibold"><span class="brand-mark grid size-9 shrink-0 place-items-center text-white">✳</span><span>ChatHermes</span><button ref="closeButton" class="mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]" aria-label="Close navigation" @click="closeDrawer">×</button></div>
      <ProjectSidebar :projects="projects" :selected="projectId" :loading="projectsLoading" :error="projectsError" @select="chooseProject" @retry="loadProjects" />
      <button v-if="projectId" class="rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]" @click="chooseProject('')">← Other chats</button>
      <SessionSidebar :heading="projectId ? selectedProject?.label || 'Project chats' : undefined" :sessions="visibleSessions" :selected="session" :loading="projectId ? projectLoading : loading" :error="projectId ? projectError : error" :has-more="!projectId && hasMore" :busy="offline || creating || (!!projectId && (!selectedProject || (!selectedProject.isNoProject && !projectRoot(selectedProject))))" @select="chooseSession" @create="createSession" @more="loadSessions(true)" @retry="projectId ? loadProject() : loadSessions()" @rename="rename" />
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
        <h1 class="min-w-0 flex-1 truncate text-base font-medium">{{ (projectView ? selectedProject?.label : sessions.find(s => s.id === session)?.title) || (session ? 'Conversation' : selectedProject?.label || 'ChatHermes') }}</h1>
        <span class="topbar-profile max-w-[30%] truncate rounded-full bg-[#303030] px-3 py-1.5 text-xs text-[#b4b4b4]">{{ profile || 'Current profile' }}</span>
        <span class="grid size-8 shrink-0 place-items-center text-2xl" aria-label="ChatHermes logo">✳</span>
        <button v-if="embedded" class="shrink-0 rounded-lg px-2 py-2 text-sm hover:bg-[#303030]" aria-label="Back to dashboard" @click="exitPlugin">←<span class="hidden min-[701px]:inline"> Back to dashboard</span></button>
      </header>
      <div v-if="offline" class="notice bg-[#303030] px-5 py-3 text-sm text-[#e5e5e5] dark:bg-[#303030] dark:text-[#e5e5e5]" role="status">You are offline. Messages cannot be loaded or sent.</div>
      <div v-if="approvalPending" class="notice bg-[#303030] px-5 py-3 text-sm text-[#e5e5e5] dark:bg-[#303030] dark:text-[#e5e5e5]" role="status">Approval is pending. Resolve the request in Hermes, then reload this conversation here to inspect history. Sending stays locked until you leave this conversation or reload the page; confirm the previous turn finished before sending again. <button class="underline disabled:opacity-55" :disabled="chatLoading" @click="reloadAfterApproval">Reload conversation</button></div>
      <div v-if="chatError" class="notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]" role="alert">{{ chatError }} <button v-if="session" class="underline" @click="loadMessages">Refresh history</button></div>
      <section v-if="projectView" class="min-h-0 flex-1 overflow-y-auto px-6 py-8 min-[701px]:px-10" aria-label="Selected Project">
        <p v-if="projectLoading" role="status">Loading Project…</p>
        <p v-if="projectError" class="mb-4 text-[#fecaca]" role="alert">{{ projectError }} <button class="underline" @click="loadProject">Retry Project</button></p>
        <template v-if="selectedProject">
          <h2 class="mb-3 text-2xl font-semibold">{{ selectedProject.label }}</h2>
          <p class="mb-4 break-all text-sm text-[#a3a3a3]">{{ projectRoot(selectedProject) ? 'Workspace: ' + projectRoot(selectedProject) : selectedProject.isNoProject ? 'No project workspace' : 'No workspace configured' }}</p>
          <button class="mb-4 rounded-xl bg-[#303030] px-4 py-3 text-base disabled:opacity-55" :disabled="offline || creating || (!selectedProject.isNoProject && !projectRoot(selectedProject))" @click="createSession">New chat</button>
          <h3 class="mb-3 text-sm text-[#a3a3a3]">Recent chats</h3>
          <p v-if="!visibleSessions.length" class="text-sm text-[#b4b4b4]">No conversations yet.</p>
          <button v-for="row in visibleSessions" :key="row.id" class="block w-full rounded-lg px-3 py-3 text-left text-base hover:bg-[#303030]" @click="chooseSession(row.id)">{{ row.title || 'Untitled session' }}</button>
          <button class="mt-5 rounded-xl bg-[#303030] px-4 py-3 text-base" @click="chooseProject('')">Other chats</button>
        </template>
      </section>
      <ChatTranscript v-else :messages="messages" :draft="draft" :loading="chatLoading" :progress="progress" :blocks="turn.blocks" :turn-user-count="priorUserCount + 1" :thinking="thinking" :home="!session" @suggest="suggest" />
      <ChatComposer :key="JSON.stringify([profile, session])" :disabled="(projectView && (!selectedProject || (!selectedProject.isNoProject && !projectRoot(selectedProject)))) || offline || creating || modelsLoading || chatLoading || approvalPending || !canStream" :models="projectId || api.isWorkspace(profile, session) ? [] : models" :providers="providers" :models-loading="modelsLoading" v-model:provider="provider" :default-model="defaultModel" v-model:model="model" :sending="sending" :suggested-prompt="suggestedPrompt" :reason="projectView && selectedProject && !selectedProject.isNoProject && !projectRoot(selectedProject) ? 'This Project has no workspace.' : offline ? 'Offline · sending is unavailable.' : approvalPending ? 'Approval is pending in Hermes.' : !canStream ? 'Streaming turns are unavailable for this profile.' : undefined" @send="send" />
    </main>
  </div>
</template>
