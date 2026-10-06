<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { api, ApiError, eventPayload, messageText } from './lib/hermes-api'
import { toolTitle } from './lib/assistant-turn'
import { useNativeSession } from './lib/native-session'
import type { SSEEvent } from './lib/sse'
import type { Activity, Attachment, Capabilities, Message, ModelOption, ProviderOption, Session, Project, ProjectAction } from './types/hermes'
import { activeRunFor, idempotencyKeyFor, rememberIdempotencyKey, rememberRun, forgetRun } from './lib/active-runs'
import { projectRoot, projectSessions } from './lib/projects'
import ScheduledPage from './components/ScheduledPage.vue'
import ProjectsPage from './components/ProjectsPage.vue'
import ProjectSettings from './components/ProjectSettings.vue'
import * as push from './lib/push'
import SessionSidebar from './components/SessionSidebar.vue'
import ChatTranscript from './components/ChatTranscript.vue'
import ChatComposer from './components/ChatComposer.vue'
const scheduledPage = ref(false), scheduledPageKey = ref(0), scheduledDiscussionError = ref('')
const projectView = ref(false), projectsPage = ref(false), archivedProjects = ref(false), projectBusy = ref(false), manageError = ref('')
const projectId = ref(''), projects = ref<Project[]>([]), selectedProject = ref<Project>(), projectsLoading = ref(false), projectLoading = ref(false), projectsError = ref(''), projectError = ref('')
const scopedSessionIds = ref<string[]>([])
const projectsLoaded = ref(false)
const visibleSessions = computed(() => projectId.value ? selectedProject.value ? projectSessions(selectedProject.value) : [] : sessions.value.filter(row => !scopedSessionIds.value.includes(row.id)))
let closeProjectEvents: (() => void) | undefined
let refreshTimer: ReturnType<typeof setTimeout> | undefined
function subscribeProjectEvents() {
  closeProjectEvents?.(); closeProjectEvents = undefined
  if (typeof EventSource === 'undefined') return
  closeProjectEvents = !api.isNative(profile.value) && api.isWorkspace(profile.value, session.value)
    ? api.projectEvents(profile.value, refreshProjects, session.value)
    : api.projectEvents(profile.value, refreshProjects)
}
function refreshProjects() { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => { void loadProjects(); if (projectId.value) void loadProject() }, 100) }
let projectsAbort: AbortController | undefined, projectAbort: AbortController | undefined
const profile = ref(''), session = ref(''), sessions = ref<Session[]>([]), messages = ref<Message[]>([])
const capabilities = ref<Capabilities>({}), offset = ref(0), hasMore = ref(false), loading = ref(false), chatLoading = ref(false), sending = ref(false), approvalPending = ref(false), offline = ref(!navigator.onLine)
const error = ref(''), chatError = ref(''), draft = ref(''), progress = ref<Activity[]>([]), drawer = ref(false)
const sentContent = new Map<string, unknown>()
const optimisticMessage = ref<Message>(), priorUserCount = ref(0)
// Render-only IDs need uniqueness within this mount, not secure-context APIs.
let localSequence = 0
function localId() { return `chathermes-ui-${++localSequence}` }
const profiles = ref<{ name: string }[]>([]), models = ref<ModelOption[]>([]), model = ref(''), defaultModel = ref(''), creating = ref(false)
const providers = ref<ProviderOption[]>([]), provider = ref(''), modelsLoading = ref(false)
const thinking = ref(false), activeRun = ref(''), embedded = ref(false), suggestedPrompt = ref('')
const menuButton = ref<HTMLButtonElement | null>(null), closeButton = ref<HTMLButtonElement | null>(null), screenMenuButton = ref<HTMLButtonElement | null>(null), screenMenu = ref(false)
const canStream = computed(() => capabilities.value.features?.native_chat === true || api.isWorkspace(profile.value, session.value) || projectId.value ? capabilities.value.features?.session_chat_streaming === true : capabilities.value.endpoints?.runs?.method === 'POST' && capabilities.value.endpoints.runs.path === '/v1/runs' && capabilities.value.features?.run_events_sse === true)
let listAbort: AbortController | undefined, chatAbort: AbortController | undefined, streamAbort: AbortController | undefined, generation = 0, profileGeneration = 0, streamGeneration = 0, historyGeneration = 0
let visibilityAbort: AbortController | undefined
const unavailableRun = ref(false)
const clarificationAnswers = ref<Record<string, string | string[]>>({}), customClarification = ref<Record<string, string>>({})
const nativeStatus = ref('')
const pushState = ref<push.PushState>({ supported: false, permission: 'unsupported', subscribed: false, available: false, error: '' })
const pushBusy = ref(false), pushMessage = ref('')
const settingsOpen = ref(false), settingsButton = ref<HTMLButtonElement | null>(null), settingsPanel = ref<HTMLElement | null>(null)
watch([drawer, profile, session, projectId, projectsPage, projectView, scheduledPage], () => { settingsOpen.value = false })
const native = useNativeSession(() => { refreshProjects(); void loadSessions() })
const nativeMode = computed(() => capabilities.value.features?.native_chat === true && (!activeRun.value || activeRun.value.startsWith('workspace-')))
const viewMessages = computed(() => nativeMode.value ? native.messages.value : messages.value)
const viewBusy = computed(() => nativeMode.value ? native.busy.value || native.uncertain.value : sending.value)
const viewLoading = computed(() => nativeMode.value ? native.loading.value : chatLoading.value)
const viewError = computed(() => nativeMode.value ? native.error.value : chatError.value)
const viewApproval = computed(() => nativeMode.value ? native.approval.value : approval.value)
const viewApprovalPending = computed(() => nativeMode.value ? !!native.approval.value : approvalPending.value)
const viewReconnect = computed(() => nativeMode.value ? !!session.value && !['open'].includes(native.connection.value) : reconnectNotice.value)
const viewUnavailable = computed(() => nativeMode.value ? native.uncertain.value : unavailableRun.value)
const viewStatus = computed(() => nativeMode.value ? native.status.value : nativeStatus.value)
const viewActive = computed(() => nativeMode.value ? native.busy.value : !!activeRun.value)
const reconnectNotice = ref(false), runStatus = ref(''), approval = ref<Record<string, unknown>>(), actionBusy = ref(false)
const eventStreamExpired = ref(false)
let lastSeq = -1
function urlState() { const params = new URLSearchParams(location.search); return { profile: params.get('profile') || '', session: params.get('session') || '', project: params.get('project') || '', view: params.get('view') || '', archived: params.get('archived') === '1' } }
function setUrl(replace = false) { const url = new URL(location.href); url.searchParams.delete('profile'); url.searchParams.delete('session'); url.searchParams.delete('project'); url.searchParams.delete('view'); url.searchParams.delete('archived'); url.searchParams.delete('job'); url.searchParams.delete('scheduled_run'); if (scheduledPage.value) url.searchParams.set('view', 'scheduled'); else if (projectsPage.value) { url.searchParams.set('view', 'projects'); if (archivedProjects.value) url.searchParams.set('archived', '1') } else if (projectView.value) url.searchParams.set('view', 'project'); if (!scheduledPage.value && projectId.value) url.searchParams.set('project', projectId.value); if (profile.value) url.searchParams.set('profile', profile.value); if (!scheduledPage.value && session.value) url.searchParams.set('session', session.value); history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash) }
function showScheduled(fromHistory = false) {
  scheduledDiscussionError.value = ''; scheduledPage.value = true; scheduledPageKey.value++; projectsPage.value = false; projectView.value = false; drawer.value = false
  if (!fromHistory) setUrl()
}
async function discussScheduled(text: string) {
  if (offline.value || creating.value) return
  const p = profile.value, owner = profileGeneration
  creating.value = true; scheduledDiscussionError.value = ''
  try {
    const made = await api.create(p)
    if (owner !== profileGeneration || p !== profile.value || !scheduledPage.value) return
    projectAbort?.abort(); projectId.value = ''; selectedProject.value = undefined
    sessions.value = [made, ...sessions.value.filter(row => row.id !== made.id)]
    await chooseSession(made.id)
    if (owner === profileGeneration && p === profile.value && session.value === made.id) suggestedPrompt.value = text
  } catch {
    if (owner === profileGeneration && p === profile.value) scheduledDiscussionError.value = 'Could not open a chat. Please try again.'
  } finally { if (owner === profileGeneration) creating.value = false }
}
function cancelChat() { native.close(); sentContent.clear(); optimisticMessage.value = undefined; generation++; streamGeneration++; historyGeneration++; visibilityAbort?.abort(); activeRun.value = ''; reconnectNotice.value = false; eventStreamExpired.value = false; unavailableRun.value = false; runStatus.value = ''; nativeStatus.value = ''; approval.value = undefined; lastSeq = -1; thinking.value = false; chatAbort?.abort(); streamAbort?.abort(); chatLoading.value = false; sending.value = false; approvalPending.value = false }
function cancel() { cancelChat(); listAbort?.abort(); loading.value = false }
async function loadProjects() {
  projectsAbort?.abort(); const controller = new AbortController(); projectsAbort = controller; const p = profile.value
  projectsLoading.value = !projectsLoaded.value; projectsError.value = ''
  try {
    const result = await api.projects(p, controller.signal)
    if (controller !== projectsAbort || p !== profile.value) return
    if (!Array.isArray(result.projects) || result.projects.some(item => !item || typeof item.id !== 'string' || typeof item.label !== 'string')) throw new Error('Invalid Hermes Projects response')
    projects.value = result.projects; scopedSessionIds.value = result.scoped_session_ids || []; projectsLoaded.value = true
  } catch { if (controller === projectsAbort && !controller.signal.aborted) projectsError.value = 'Could not load Projects.' }
  finally { if (controller === projectsAbort) projectsLoading.value = false }
}
async function loadProject() {
  projectAbort?.abort(); const controller = new AbortController(); projectAbort = controller
  const p = profile.value, id = projectId.value
  if (!id) return
  projectLoading.value = !selectedProject.value; projectError.value = ''
  try {
    const result = await api.project(p, id, controller.signal)
    if (controller === projectAbort && !controller.signal.aborted && p === profile.value && id === projectId.value) selectedProject.value = result
  } catch (cause) { if (controller === projectAbort && !controller.signal.aborted) projectError.value = cause instanceof ApiError && cause.status === 404 ? 'Project no longer exists. Return to Other chats.' : 'Could not load this Project. Retry or return to Other chats.' }
  finally { if (controller === projectAbort) projectLoading.value = false }
}
async function chooseProject(id: string, fromHistory = false) {
  scheduledPage.value = false
  // Scope changes never touch the live/stored session or its working directory.
  projectAbort?.abort(); projectsPage.value = false; manageError.value = ''; projectId.value = id; projectView.value = !!id; selectedProject.value = undefined; projectError.value = ''; drawer.value = false
  if (!fromHistory) setUrl()
  await loadProject()
}
function showProjects(archived = archivedProjects.value, fromHistory = false) {
  scheduledPage.value = false
  projectAbort?.abort(); projectLoading.value = false; projectsPage.value = true; projectView.value = false; archivedProjects.value = archived; drawer.value = false; manageError.value = ''
  if (!fromHistory) setUrl()
  void loadProjects()
}
async function recentSession(id: string) {
  projectAbort?.abort(); projectId.value = ''; selectedProject.value = undefined; projectsPage.value = false
  await chooseSession(id)
}
async function newChat() {
  scheduledPage.value = false
  projectAbort?.abort(); projectId.value = ''; selectedProject.value = undefined; projectView.value = false; projectsPage.value = false
  return await createSession()
}
async function manageProject(action: ProjectAction, fields: Record<string, string | boolean>) {
  if (projectBusy.value || offline.value) return
  const p = profile.value, owner = profileGeneration, scope = projectId.value
  projectBusy.value = true; manageError.value = ''
  try {
    const result = await api.projectManage(p, action, fields)
    if (owner !== profileGeneration || p !== profile.value) return
    if (action === 'create' && result.project?.id) await chooseProject(result.project.id)
    else if (scope === projectId.value && !projectsPage.value) {
      if (action === 'delete') { projectId.value = ''; selectedProject.value = undefined; showProjects(archivedProjects.value) }
      else if (action === 'archive') { projectId.value = ''; selectedProject.value = undefined; showProjects(fields.restore !== true) }
      else await loadProject()
    }
    if (owner === profileGeneration) { await loadProjects(); await loadSessions() }
  } catch { if (owner === profileGeneration && p === profile.value) manageError.value = 'Could not save the project. Check its fields and try again.' }
  finally { if (owner === profileGeneration) projectBusy.value = false }
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
  return result.map(item => item.id && sentContent.has(item.id) ? { ...item, content: sentContent.get(item.id) } : item)
}
async function loadMessages() {
  if (!session.value) return false
  if (nativeMode.value) { await native.hydrate(); return true }
  historyGeneration++; visibilityAbort?.abort(); chatAbort?.abort(); const controller = new AbortController(); chatAbort = controller; const current = generation, p = profile.value, s = session.value
  chatLoading.value = true; chatError.value = ''
  try { const result = await api.messages(p, s, controller.signal); if (current === generation && controller === chatAbort) { updateActivityOutputs(result); const restored = reconcileHistory(result); const last = restored.reduce((index, item, i) => item.role === 'user' ? i : index, -1); messages.value = activeRun.value && !terminalStatuses.includes(runStatus.value) && last >= 0 ? restored.slice(0, last + 1) : restored; return true } }
  catch (cause) { if (current === generation && controller === chatAbort && !controller.signal.aborted) chatError.value = cause instanceof Error ? cause.message : 'Could not load messages' }
  finally { if (controller === chatAbort) { chatLoading.value = false; chatAbort = undefined } }
  return false
}
async function chooseProfile(id: string, fromHistory = false) {
  if (id && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) { error.value = 'Invalid profile name'; return }
  scheduledPage.value = false; suggestedPrompt.value = ''; creating.value = false
  projectsLoaded.value = false
  closeProjectEvents?.(); closeProjectEvents = undefined; clearTimeout(refreshTimer); scopedSessionIds.value = []; cancel(); projectsAbort?.abort(); projectAbort?.abort(); projectId.value = ''; projectView.value = false; projectsPage.value = false; archivedProjects.value = false; projectBusy.value = false; manageError.value = ''; selectedProject.value = undefined; projects.value = []; projectError.value = ''; projectsError.value = ''; projectLoading.value = false; profile.value = id; session.value = ''; sessions.value = []; messages.value = []; capabilities.value = {}; models.value = []; providers.value = []; provider.value = ''; model.value = ''; defaultModel.value = ''; modelsLoading.value = true; draft.value = ''; progress.value = []; error.value = ''; chatError.value = ''; offset.value = 0; hasMore.value = false; drawer.value = false
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
  scheduledPage.value = false
  if (api.isNative(profile.value) || projectId.value) api.workspace(profile.value, id)
  else if (sessions.value.find(row => row.id === id)?.cwd || sessions.value.find(row => row.id === id)?.source === 'desktop') api.workspace(profile.value, id)
  projectView.value = false; projectsPage.value = false; suggestedPrompt.value = ''; cancelChat(); session.value = id; messages.value = []; draft.value = ''; progress.value = []; chatError.value = ''; drawer.value = false
  if (!fromHistory) setUrl()
  const current = generation, p = profile.value
  if (!projectId.value && !api.isWorkspace(p, id)) {
    try { await api.session(p, id) } catch { /* History still supplies the route's error. */ }
    if (current !== generation || p !== profile.value) return
  }
  subscribeProjectEvents()
  const run = activeRunFor(p, id)
  if (api.isNative(p) && (!run || run.startsWith('workspace-'))) {
    await native.attach(p, id)
    return
  }
  if (run) activeRun.value = run
  await loadMessages()
  if (current === generation && p === profile.value && run) {
    activeRun.value = run; sending.value = true; void followRun(current, p, id, run, true)
  }
}
async function createSession() {
  if (offline.value || creating.value || (projectId.value && selectedProject.value?.archived)) return
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
  if (!progress.value.length || history.filter(item => item.role === 'user').length <= priorUserCount.value) return
  const last = history.reduce((index, item, current) => item.role === 'user' ? current : index, -1)
  const tools = progress.value.filter(item => item.kind === 'tool')
  history.slice(last + 1).filter(item => item.role === 'tool').forEach((message, index) => {
    const output = messageText(message.content)
    if (tools[index] && output) tools[index]!.output = output
  })
}
function finishActivities() { progress.value.forEach(item => { item.complete = true }); thinking.value = false }
function activity(kind: 'thinking' | 'tool', title: string, id?: string) {
  const found = [...progress.value].reverse().find(item => !item.complete && item.kind === kind && (id ? item.id === id : item.title === title))
  if (found) return found
  const item: Activity = { id: id || localId(), kind, title, content: '', complete: false }
  progress.value.push(item)
  return progress.value[progress.value.length - 1]!
}
function reduceFrame(frame: SSEEvent): 'completed' | undefined {
  const data = eventPayload(frame)
  // A foreign frame must not advance this run's applied cursor.
  if (typeof data.run_id === 'string' && activeRun.value && data.run_id !== activeRun.value) return
  const seq = typeof data.seq === 'number' ? data.seq : frame.id !== undefined ? Number(frame.id) : undefined
  if (seq !== undefined && Number.isSafeInteger(seq) && seq >= 0) {
    if (seq <= lastSeq) return
    lastSeq = seq
  }
  if (!activeRun.value && typeof data.run_id === 'string') { activeRun.value = data.run_id; rememberRun(profile.value, session.value, data.run_id) }
  if (['message.delta', 'message.interim', 'assistant.delta', 'tool.started', 'reasoning.available', 'run.steered'].includes(frame.event) && !approvalPending.value) runStatus.value = 'running'
  const delta = typeof data.delta === 'string' ? data.delta : typeof data.text === 'string' ? data.text : ''
  const callId = typeof data.tool_call_id === 'string' ? data.tool_call_id : undefined
  const name = typeof data.tool_name === 'string' ? data.tool_name : typeof data.tool === 'string' ? data.tool
    : progress.value.find(item => item.kind === 'tool' && callId && item.id === callId)?.toolName || 'Tool call'
  if (frame.event === 'assistant.delta' || frame.event === 'message.delta') { finishActivities(); draft.value += delta }
  else if (frame.event === 'assistant.snapshot') { draft.value = typeof data.text === 'string' ? data.text : '' }
  else if (frame.event === 'status.update') { nativeStatus.value = String(data.text || '') }
  else if (frame.event === 'native.notice') { chatError.value = String(data.text || 'Native recovery is bounded.') }
  else if (frame.event === 'assistant.completed' && typeof data.content === 'string') { finishActivities(); draft.value = data.content }
  else if (['assistant.commentary', 'message.interim'].includes(frame.event) && !data.already_streamed && typeof data.text === 'string') draft.value += data.text + '\n\n'
  else if (frame.event === 'tool.started') {
    progress.value.filter(item => item.kind === 'thinking').forEach(item => { item.complete = true }); thinking.value = false
    const pending = [...progress.value].reverse().find(item => item.kind === 'tool' && !item.complete && item.state === 'running' && item.toolName === name && (!callId || item.id === callId))
    const item = pending || activity('tool', toolTitle(name), callId || localId())
    item.toolName = name; item.state = 'running'
    const startContent = data.args ? JSON.stringify(data.args, null, 2) : typeof data.preview === 'string' ? data.preview : ''
    item.content = pending ? [startContent, item.content].filter(Boolean).join('\n\n') : startContent
  } else if (['thinking.delta', 'reasoning.delta', 'reasoning.available', 'tool.progress', 'tool.delta'].includes(frame.event)) {
    const isThinking = frame.event.startsWith('thinking') || frame.event.startsWith('reasoning') || name === '_thinking'
    const emptyThinking = isThinking ? progress.value.find(item => item.kind === 'thinking' && !item.complete && !item.content) : undefined
    const item = emptyThinking || (!isThinking ? [...progress.value].reverse().find(item => item.kind === 'tool' && !item.complete && item.toolName === name) : undefined) || activity(isThinking ? 'thinking' : 'tool', isThinking ? 'Thinking…' : toolTitle(name), callId)
    if (!isThinking) { item.toolName = name; item.state = 'running' }
    item.content += delta || (typeof data.preview === 'string' ? data.preview : '')
    thinking.value = isThinking
  } else if (frame.event === 'tool.completed' || frame.event === 'tool.failed') {
    const item = [...progress.value].reverse().find(item => item.kind === 'tool' && !item.complete && (callId && item.id === callId || item.toolName === name || item.title === name))
    if (item) {
      const failed = frame.event === 'tool.failed' || data.is_error === true || data.error === true || typeof data.error === 'string' && !!data.error
      item.complete = true; item.state = failed ? 'failed' : 'completed'
      item.title = toolTitle(item.toolName || name, true)
      const output = data.output ?? data.result ?? (typeof data.error === 'string' ? data.error : data.preview)
      if (output !== undefined) item.output = typeof output === 'string' ? output : JSON.stringify(output, null, 2)
      if (typeof data.duration_s === 'number') item.duration = data.duration_s
    }
  } else if (frame.event === 'approval.request') { finishActivities(); approvalPending.value = true; approval.value = data; runStatus.value = 'waiting_for_approval' }
  else if (frame.event === 'approval.responded') { approvalPending.value = false; approval.value = undefined; runStatus.value = 'running' }
  else if (frame.event === 'replay.truncated') { chatError.value = 'Some earlier run events expired. Saved history will be restored when the run finishes.' }
  else if (['run.completed', 'run.failed', 'run.cancelled', 'run.interrupted', 'error'].includes(frame.event)) {
    refreshProjects(); finishActivities(); approvalPending.value = false; approval.value = undefined
    runStatus.value = frame.event.slice(4)
    if (typeof data.output === 'string') draft.value = data.output
    if (frame.event !== 'run.completed') chatError.value = `Run ${runStatus.value}. Check conversation history before retrying.`
    return 'completed'
  }

}
function createIdempotencyKey(): string {
  return 'turn-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)
}
async function sendNative(text: string, attachments: Attachment[]) {
  if (scheduledPage.value || viewBusy.value || creating.value || viewApprovalPending.value || offline.value || !canStream.value || modelsLoading.value) return
  if ((projectView.value || !session.value) && !await createSession()) return
  const current = generation, p = profile.value
  const preview = [{ type: 'text', text }, ...attachments.map(file => file.type.startsWith('image/') ? { type: 'image_url', image_url: { url: file.data } } : { type: 'text', text: '📎 ' + file.name })]
  try {
    await native.submit(text, async () => {
      const parts: unknown[] = [{ type: 'text', text: text || 'Please examine the attached files.' }]
      for (const file of attachments) {
        const uploaded = await api.upload(p, file)
        if (current !== generation) throw new Error('Session changed before submission')
        parts.push({ type: 'text', text: `Attached ${file.type.startsWith('image/') ? 'image' : 'file'} ${file.name.replace(/[\r\n]/g, ' ')}: ${uploaded.path}` })
        if (file.type.startsWith('image/')) parts.push({ type: 'image_url', image_url: { url: file.data } })
      }
      return attachments.length ? parts : text
    }, { model: model.value || defaultModel.value, provider: provider.value || undefined }, preview)
  } catch (cause) {
    if (current === generation && !native.uncertain.value) { native.error.value = cause instanceof Error ? cause.message : 'Message not submitted'; suggestedPrompt.value = text }
  }
}
async function send(text: string, attachments: Attachment[] = []) {
  if (nativeMode.value) { await sendNative(text, attachments); return }
  if (scheduledPage.value || sending.value || creating.value || approvalPending.value || offline.value || !canStream.value || modelsLoading.value) return
  if ((projectView.value || !session.value) && !await createSession()) return
  if (sending.value || approvalPending.value) return
  historyGeneration++; visibilityAbort?.abort()
  sending.value = true; thinking.value = true; activeRun.value = ''; lastSeq = -1; runStatus.value = ''; nativeStatus.value = ''; approval.value = undefined; reconnectNotice.value = false; chatError.value = ''; draft.value = ''; progress.value = []
  activity('thinking', 'Thinking…')
  priorUserCount.value = messages.value.filter(item => item.role === 'user').length
  optimisticMessage.value = { id: 'pending-' + localId(), role: 'user', content: [
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
    if (!api.isWorkspace(p, s)) {
      const requestKey = idempotencyKeyFor(p, s) || createIdempotencyKey()
      rememberIdempotencyKey(p, s, requestKey)
      const makeRequest = () => api.startRun(p, s, attachments.length ? parts : text, model.value || defaultModel.value, provider.value, requestKey)
      let made
      try { made = await makeRequest() }
      catch (cause) { if (cause instanceof ApiError && cause.status < 500) throw cause; made = await makeRequest() }
      rememberRun(p, s, made.run_id)
      if (current !== generation) return
      activeRun.value = made.run_id
      await followRun(current, p, s, made.run_id, false)
      return
    }
    for await (const frame of api.stream(p, s, attachments.length ? parts : text, streamAbort.signal, model.value || defaultModel.value, provider.value)) {
      if (current !== generation || streamCurrent !== streamGeneration) return
      const outcome = reduceFrame(frame)
      if (outcome === 'completed') { completed = true; break }
    }
    if (current !== generation || streamCurrent !== streamGeneration) return
    if (!completed && activeRun.value) { await followRun(current, p, s, activeRun.value, false); return }
    if (!completed) throw new Error('Stream ended without a run ID. Check session history before retrying.')
    await finishRun(current, p, s, activeRun.value)
  } catch (cause) {
    if (current === generation) {
      if (cause instanceof ApiError && cause.status >= 500) {
        try { await loadMessages() } catch { /* Preserve current history on refresh failure. */ }
      }
      chatError.value = cause instanceof Error ? cause.message : 'Send failed. Check session history before retrying.'
    }
  }
  finally { if (current === generation && !activeRun.value) { sending.value = false; finishActivities() } }
}
const terminalStatuses = ['completed', 'failed', 'cancelled', 'interrupted', 'stopped']
async function finishRun(current: number, p: string, s: string, run: string) {
  if (current !== generation) return
  finishActivities(); approvalPending.value = false; approval.value = undefined
  if (!await loadMessages()) { reconnectNotice.value = true; throw new Error('Run ended, but history could not be loaded. Retry loading history before starting another turn.') }
  if (current !== generation) return
  draft.value = ''; lastSeq = -1; forgetRun(p, s, run); activeRun.value = ''; sending.value = false; reconnectNotice.value = false; eventStreamExpired.value = false
  if (api.isNative(p)) await native.attach(p, s)
  void loadSessions()
}
function retryDelay(signal: AbortSignal) {
  return new Promise<void>(resolve => {
    const done = () => { clearTimeout(timer); signal.removeEventListener('abort', done); resolve() }
    const timer = setTimeout(done, 1000)
    signal.addEventListener('abort', done, { once: true })
    if (signal.aborted) done()
  })
}
async function followRun(current: number, p: string, s: string, run: string, restore: boolean) {
  if (current !== generation || eventStreamExpired.value) return
  streamAbort?.abort(); const controller = new AbortController(); streamAbort = controller
  const viewer = ++streamGeneration
  sending.value = true; reconnectNotice.value = restore
  while (current === generation && viewer === streamGeneration && !controller.signal.aborted) {
    try {
      // Recheck authoritative status after both a closed stream and a failed GET.
      const state = await api.runStatus(p, run, controller.signal)
      if (current !== generation || controller.signal.aborted || viewer !== streamGeneration) return
      const status = state.status || state.run?.status || ''
      runStatus.value = status
      if (terminalStatuses.includes(status)) {
        if (typeof state.output === 'string') draft.value = state.output
        if (status !== 'completed') chatError.value = `Run ${status}.`
        await finishRun(current, p, s, run); return
      }
      approvalPending.value = status === 'waiting_for_approval'
      approval.value = state.approval
      if (restore) {
        // A new viewer has no live transcript: rebuild only the active turn.
        const last = messages.value.reduce((index, item, i) => item.role === 'user' ? i : index, -1)
        if (last >= 0) messages.value = messages.value.slice(0, last + 1)
        draft.value = ''; progress.value = []; lastSeq = -1; restore = false
      }
      reconnectNotice.value = false
      let ended = false
      for await (const frame of api.runEvents(p, run, controller.signal, lastSeq)) {
        if (current !== generation || viewer !== streamGeneration || controller.signal.aborted) return
        if (reduceFrame(frame) === 'completed') { ended = true; break }
      }
      if (ended) { await finishRun(current, p, s, run); return }
      reconnectNotice.value = true
    } catch (cause) {
      if (current !== generation || controller.signal.aborted || viewer !== streamGeneration) return
      reconnectNotice.value = true
      if (cause instanceof ApiError && cause.status === 403) {
        chatError.value = 'Hermes denied access to this run. Check the selected profile and permissions.'
        return
      }
      if (cause instanceof ApiError && cause.status === 404) {
        // An expired event buffer is distinct from a missing run. Verify status
        // before declaring the turn unavailable.
        try {
          const state = await api.runStatus(p, run, controller.signal)
          if (current !== generation || controller.signal.aborted || viewer !== streamGeneration) return
          const status = state.status || state.run?.status || ''
          runStatus.value = status
          if (terminalStatuses.includes(status)) { await finishRun(current, p, s, run); return }
          // The run is still executing, but Hermes has discarded this run's
          // live event transport. Poll status instead of retrying an endpoint
          // that can no longer attach; history is authoritative after completion.
          eventStreamExpired.value = true
          reconnectNotice.value = false
          chatError.value = 'The live stream expired, so new progress cannot reconnect. Hermes is still working; you can refresh session history at any time.'
          while (current === generation && viewer === streamGeneration && !controller.signal.aborted) {
            await retryDelay(controller.signal)
            if (current !== generation || viewer !== streamGeneration || controller.signal.aborted) return
            const polled = await api.runStatus(p, run, controller.signal)
            if (current !== generation || viewer !== streamGeneration || controller.signal.aborted) return
            const polledStatus = polled.status || polled.run?.status || ''
            runStatus.value = polledStatus
            approvalPending.value = polledStatus === 'waiting_for_approval'
            approval.value = polled.approval
            if (!terminalStatuses.includes(polledStatus)) continue
            if (typeof polled.output === 'string') draft.value = polled.output
            if (polledStatus !== 'completed') chatError.value = `Run ${polledStatus}.`
            await finishRun(current, p, s, run); return
          }
          return
        } catch (statusError) {
          if (current !== generation || controller.signal.aborted || viewer !== streamGeneration) return
          if (statusError instanceof ApiError && statusError.status === 403) {
            chatError.value = 'Hermes denied access to this run. Check the selected profile and permissions.'
            return
          }
          if (statusError instanceof ApiError && statusError.status === 404) {
            unavailableRun.value = true
            chatError.value = 'Run state is unavailable. Refresh history and verify the turn in Hermes before starting another.'
            return
          }
          chatError.value = 'Could not verify run status. Retrying status checks; the event stream cannot be reattached.'
          eventStreamExpired.value = true
          reconnectNotice.value = false
          while (current === generation && viewer === streamGeneration && !controller.signal.aborted) {
            await retryDelay(controller.signal)
            if (current !== generation || viewer !== streamGeneration || controller.signal.aborted) return
            let polled: Awaited<ReturnType<typeof api.runStatus>>
            try { polled = await api.runStatus(p, run, controller.signal) }
            catch (pollError) {
              if (pollError instanceof ApiError && (pollError.status === 403 || pollError.status === 404)) {
                if (pollError.status === 404) { unavailableRun.value = true; chatError.value = 'Run state is unavailable. Refresh history and verify the turn in Hermes before starting another.' }
                else chatError.value = 'Hermes denied access to this run. Check the selected profile and permissions.'
                return
              }
              continue
            }
            if (current !== generation || viewer !== streamGeneration || controller.signal.aborted) return
            const polledStatus = polled.status || polled.run?.status || ''
            runStatus.value = polledStatus
            approvalPending.value = polledStatus === 'waiting_for_approval'
            approval.value = polled.approval
            if (!terminalStatuses.includes(polledStatus)) continue
            if (typeof polled.output === 'string') draft.value = polled.output
            if (polledStatus !== 'completed') chatError.value = `Run ${polledStatus}.`
            await finishRun(current, p, s, run); return
          }
          return
        }
      }
    }
    await retryDelay(controller.signal)
  }
}
async function stopRun() {
  if (nativeMode.value) { try { await native.stop() } catch { native.error.value = 'Could not stop the response.' }; return }
  const p = profile.value, run = activeRun.value, current = generation
  if (!run || actionBusy.value) return
  actionBusy.value = true
  try { await api.stop(p, run); if (current === generation && run === activeRun.value) runStatus.value = 'stopping' }
  catch { if (current === generation) chatError.value = 'Could not stop the run. Retry.' }
  finally { actionBusy.value = false }
}
async function approveRun(choice: string) {
  if (nativeMode.value) { const id = native.approval.value?.request_id; if (typeof id === 'string') { try { await native.answer(id, { choice }) } catch { native.error.value = 'Approval could not be settled.' } }; return }
  const p = profile.value, run = activeRun.value, current = generation, request = approval.value?.request_id
  if (!run || actionBusy.value) return
  actionBusy.value = true
  try { await api.approve(p, run, choice, typeof request === 'string' ? request : undefined); if (current === generation) { approvalPending.value = false; approval.value = undefined; runStatus.value = 'running' } }
  catch { if (current === generation) chatError.value = 'Could not resolve approval. Refresh run state and retry.' }
  finally { actionBusy.value = false }
}
async function answerClarification() {
  if (nativeMode.value) {
    const id = native.approval.value?.request_id
    const answers = Object.fromEntries(Object.entries(clarificationAnswers.value).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value]))
    Object.assign(answers, customClarification.value)
    if (typeof id === 'string') { try { await native.answer(id, { answers }); clarificationAnswers.value = {}; customClarification.value = {} } catch { native.error.value = 'Clarification could not be settled.' } }
    return
  }

}
async function steerRun(text: string) {
  if (nativeMode.value) { try { await native.steer(text) } catch { native.error.value = 'Response did not accept guidance.' }; return }
  const p = profile.value, run = activeRun.value, current = generation
  if (!text.trim() || actionBusy.value || !run) return
  actionBusy.value = true
  try { await api.steer(p, run, text.trim()) }
  catch { if (current === generation) chatError.value = 'Run did not accept guidance. Refresh run state and retry.' }
  finally { actionBusy.value = false }
}

async function visibilityChange() {
  if (document.visibilityState !== 'visible') return
  // Do not replace the submit coroutine while its admission acknowledgement is
  // pending (or unknown). Background state can be idle before that RPC admits.
  if (nativeMode.value) { if (session.value) void native.reconnect(); return }
  refreshProjects()
  if (activeRun.value && !eventStreamExpired.value) { void followRun(generation, profile.value, session.value, activeRun.value, false); return }
  if (!session.value) return
  if (eventStreamExpired.value && activeRun.value) {
    try {
      if (!await loadMessages()) throw new Error('history')
      chatError.value = 'Session history refreshed. Live progress cannot reconnect; another turn will be available after this run finishes.'
    } catch { chatError.value = 'Could not refresh session history. Retry history; the current run is still locked.' }
    return
  }
  visibilityAbort?.abort(); const controller = new AbortController(); visibilityAbort = controller
  const current = generation, historyCurrent = ++historyGeneration, p = profile.value, s = session.value, pendingHistory = chatAbort
  try {
    const result = await api.messages(p, s, controller.signal)
    if (current === generation && historyCurrent === historyGeneration && !controller.signal.aborted && !pendingHistory) { updateActivityOutputs(result); messages.value = reconcileHistory(result) }
  } catch { /* Preserve existing history when a visibility refresh fails. */ }
  finally { if (visibilityAbort === controller) visibilityAbort = undefined }
}
async function releaseUnavailableRun() {
  if (nativeMode.value) { await native.resolveUncertainty(); return }
  const current = generation, p = profile.value, s = session.value, run = activeRun.value
  if (!unavailableRun.value) return
  const previousStatus = runStatus.value; runStatus.value = 'stopped'
  if (!await loadMessages() || current !== generation) { if (current === generation) runStatus.value = previousStatus; return }
  lastSeq = -1; forgetRun(p, s, run); streamAbort?.abort(); activeRun.value = ''; sending.value = false; unavailableRun.value = false; reconnectNotice.value = false; eventStreamExpired.value = false; approvalPending.value = false; draft.value = ''; progress.value = []
}
function exitPlugin() { location.href = '/' }
function onlineChange() { offline.value = !navigator.onLine; if (!offline.value) { refreshProjects(); void loadSessions(); void visibilityChange() } }
function pop() {
  const state = urlState()
  const pending = chooseProfile(state.profile, true), current = generation
  void pending.then(() => { if (current === generation && profile.value === state.profile) { if (state.view === 'scheduled') showScheduled(true); else if (state.view === 'projects') showProjects(state.archived, true); else if (state.project) { void chooseProject(state.project, true).then(() => { if (current === generation && state.session && state.view !== 'project') void chooseSession(state.session, true) }) } else if (state.session) void chooseSession(state.session, true) } })
}
function closeDrawer() { settingsOpen.value = false; drawer.value = false; menuButton.value?.focus() }
async function openDrawer() { drawer.value = true; await nextTick(); closeButton.value?.focus() }
function closeSettings(restoreFocus = false) { settingsOpen.value = false; if (restoreFocus) settingsButton.value?.focus() }
async function toggleSettings() {
  if (settingsOpen.value) { closeSettings(true); return }
  settingsOpen.value = true
  await nextTick()
  settingsPanel.value?.focus()
}
function settingsOutside(event: PointerEvent) {
  if (settingsOpen.value && event.target instanceof Node && !settingsPanel.value?.contains(event.target) && !settingsButton.value?.contains(event.target)) closeSettings()
}
function closeScreenMenu() { if (screenMenu.value) { screenMenu.value = false; screenMenuButton.value?.focus() } }
function drawerKey(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (settingsOpen.value) { event.preventDefault(); closeSettings(true) }
  else if (drawer.value) closeDrawer()
  else closeScreenMenu()
}
async function reloadPushState() { pushState.value = await push.state() }
async function togglePush() {
  if (pushBusy.value) return
  pushBusy.value = true; pushMessage.value = ''
  try { if (pushState.value.subscribed) await push.unsubscribe(profile.value); else await push.subscribe(profile.value); await reloadPushState() }
  catch (cause) { pushMessage.value = cause instanceof Error ? cause.message : 'Could not update notifications.'; await reloadPushState() }
  finally { pushBusy.value = false }
}
function serviceWorkerMessage(event: MessageEvent) {
  if (event.data?.type !== 'chathermes.navigate' || typeof event.data.url !== 'string') return
  const url = new URL(event.data.url, location.origin)
  if (url.origin !== location.origin || url.pathname !== '/chathermes') return
  history.pushState({}, '', url.pathname + url.search)
  pop()
}
onMounted(async () => { void api.profiles().then(result => { profiles.value = result.profiles || [] }).catch(() => { error.value = 'Could not load profiles' }); void reloadPushState(); if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', serviceWorkerMessage); embedded.value = !!menuButton.value?.closest('.chathermes-embedded'); document.addEventListener('visibilitychange', visibilityChange); addEventListener('online', onlineChange); addEventListener('offline', onlineChange); addEventListener('popstate', pop); addEventListener('keydown', drawerKey); document.addEventListener('pointerdown', settingsOutside); const state = urlState(); const pending = chooseProfile(state.profile, true), current = generation; await pending; if (current === generation && profile.value === state.profile) { if (state.view === 'scheduled') showScheduled(true); else if (state.view === 'projects') showProjects(state.archived, true); else if (state.project) { void chooseProject(state.project, true).then(() => { if (current === generation && state.session && state.view !== 'project') void chooseSession(state.session, true) }) } else if (state.session) void chooseSession(state.session, true) } })
onUnmounted(() => { profileGeneration++; closeProjectEvents?.(); clearTimeout(refreshTimer); document.removeEventListener('visibilitychange', visibilityChange); if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('message', serviceWorkerMessage); cancel(); projectsAbort?.abort(); projectAbort?.abort(); removeEventListener('online', onlineChange); removeEventListener('offline', onlineChange); removeEventListener('popstate', pop); removeEventListener('keydown', drawerKey); document.removeEventListener('pointerdown', settingsOutside) })
</script>
<template>
  <div class="app-shell flex min-h-dvh bg-[#212121] font-sans text-[#f4f4f4] dark:bg-[#212121] dark:text-[#f4f4f4]">
    <aside class="sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-5 bg-[#171717] px-[18px] py-6 text-[#f4f4f4] shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-[#171717] dark:text-[#f4f4f4]" :class="drawer ? 'translate-x-0' : '-translate-x-full'" aria-label="Navigation">
      <div class="brand flex items-center gap-2.5 px-2 text-2xl font-semibold"><span class="brand-mark grid size-9 shrink-0 place-items-center text-white">✳</span><span>ChatHermes</span><button ref="closeButton" class="mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]" aria-label="Close navigation" @click="closeDrawer">×</button></div>
      <button class="drawer-chat flex min-h-[48px] shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-base hover:bg-[#303030] disabled:opacity-55" :disabled="offline || creating" @click="newChat"><svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 4H4v16h16V10M12 12l9-9M16 3h5v5" /></svg>New chat</button>
      <button class="projects-nav flex min-h-[48px] items-center gap-3 rounded-lg px-3 py-3 text-left text-base hover:bg-[#303030]" :aria-current="projectsPage || projectView ? 'page' : undefined" @click="showProjects()"><svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" /></svg>Projects</button>
      <button class="scheduled-nav flex min-h-[48px] items-center gap-3 rounded-lg px-3 py-3 text-left text-base hover:bg-[#303030]" :aria-current="scheduledPage ? 'page' : undefined" @click="showScheduled()"><svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M8 15h3M8 18h6"/></svg>Scheduled</button>
      <SessionSidebar heading="Recents" :sessions="sessions" :selected="session" :loading="loading" :error="error" :has-more="hasMore" :busy="offline || creating" @select="recentSession" @create="newChat" @more="loadSessions(true)" @retry="loadSessions()" @rename="rename" />
      <div class="sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]">
        <label for="profile-field">Profile</label>
        <div class="drawer-account flex min-w-0 items-center gap-2"><select id="profile-field" class="profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white" :value="profile" @change="chooseProfile(($event.target as HTMLSelectElement).value)">
          <option value="">Current profile</option><option v-if="profile && !profiles.some(item => item.name === profile)" :value="profile">{{ profile }}</option><option v-for="item in profiles" :key="item.name" :value="item.name">{{ item.name }}</option>
        </select><button ref="settingsButton" class="drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]" aria-label="Settings" aria-haspopup="dialog" aria-controls="drawer-settings" :aria-expanded="settingsOpen" @click="toggleSettings"><svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 3-.6 2.5-2 .9L4 5.7l-2 3.5 1.8 1.8v2L2 14.8l2 3.5 2.4-.7 2 .9L9 21h6l.6-2.5 2-.9 2.4.7 2-3.5-1.8-1.8v-2L22 9.2l-2-3.5-2.4.7-2-.9L15 3Z"/><circle cx="12" cy="12" r="3"/></svg></button></div>
        <span><span class="status-dot mr-2 inline-block size-2 rounded-full" :class="offline ? 'disconnected bg-[#dcae6e]' : 'bg-[#94c9a5]'" />{{ offline ? 'Offline · read only' : 'Connected through dashboard' }}</span>
        <section v-if="settingsOpen" id="drawer-settings" ref="settingsPanel" class="settings-panel absolute bottom-full left-0 right-0 mb-3 max-h-[60dvh] overflow-y-auto rounded-2xl border border-[#424242] bg-[#212121] p-3 shadow-xl" role="dialog" aria-label="Settings" tabindex="-1">
          <div class="flex items-center justify-between gap-2"><h2 class="text-base font-medium text-white">Settings</h2><button class="size-11 rounded-lg text-xl text-white hover:bg-[#303030]" aria-label="Close settings" @click="closeSettings(true)">×</button></div>
          <div class="push-setting" aria-labelledby="notifications-heading">
          <h3 id="notifications-heading" class="text-sm font-medium text-[#f4f4f4]">Notifications</h3>
          <button class="mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55" :disabled="pushBusy || !pushState.supported || (!pushState.subscribed && !pushState.available)" @click="togglePush">{{ pushBusy ? 'Updating…' : pushState.subscribed ? 'Disable notifications' : 'Enable notifications' }}</button>
          <p v-if="pushState.error || pushMessage" class="mt-1 text-xs text-[#dcae6e]" role="status">{{ pushMessage || pushState.error }}</p>
          <p v-else-if="pushState.subscribed" class="mt-1 text-xs">Notifications enabled on this device.</p>
          <p v-else-if="!pushState.supported" class="mt-1 text-xs">Install ChatHermes on a secure HTTPS origin to enable notifications.</p>
          <p v-else-if="pushState.permission === 'denied'" class="mt-1 text-xs">Allow notifications in browser settings to enable them.</p>
          </div>
        </section>
      </div>
    </aside>
    <div v-if="drawer" class="scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden" @click="closeDrawer" />
    <main class="main-panel flex h-dvh min-w-0 flex-1 flex-col">
      <header class="topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8">
        <button ref="menuButton" class="mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]" aria-label="Open navigation" :aria-expanded="drawer" @click="openDrawer"><svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 6h18M3 13h12" /></svg></button>
        <h1 class="min-w-0 flex-1 truncate text-base font-medium">{{ scheduledPage ? 'Scheduled' : projectsPage ? 'Projects' : (projectView ? selectedProject?.label : sessions.find(s => s.id === session)?.title) || (session ? 'Conversation' : selectedProject?.label || 'ChatHermes') }}</h1>
        <span class="topbar-profile sr-only">{{ profile || 'Current profile' }}</span>
        <div class="screen-menu-wrap relative" @keydown.esc.stop.prevent="closeScreenMenu">
          <button ref="screenMenuButton" class="screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]" aria-label="Screen options" aria-haspopup="menu" :aria-expanded="screenMenu" aria-controls="screen-menu" @click="screenMenu = !screenMenu">···</button>
          <div v-if="screenMenu" id="screen-menu" class="screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl" role="menu" aria-label="Screen options" @click="closeScreenMenu">
            <span class="truncate px-3 py-2 text-xs text-[#a3a3a3]" role="presentation">{{ profile || 'Current profile' }}</span>
            <button class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]" role="menuitem" @click="newChat(); closeScreenMenu()">New chat</button>
            <button v-if="embedded" class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]" role="menuitem" @click="exitPlugin(); closeScreenMenu()">Back to dashboard</button>
          </div>
        </div>
      </header>
      <div v-if="offline" class="notice bg-[#303030] px-5 py-3 text-sm text-[#e5e5e5] dark:bg-[#303030] dark:text-[#e5e5e5]" role="status">You are offline. Messages cannot be loaded or sent.</div>
      <div v-if="!scheduledPage && viewReconnect" class="notice px-5 py-3 text-sm text-[#b4b4b4]" role="status">{{ eventStreamExpired ? 'Live progress is unavailable; checking run status…' : 'Reconnecting to the live response…' }}</div>
      <div v-if="!scheduledPage && !activeRun && terminalStatuses.includes(runStatus)" class="px-5 py-2 text-sm text-[#b4b4b4]" role="status">Run {{ runStatus }}.</div>
      <div v-if="!scheduledPage && viewError" class="notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]" role="alert">{{ viewError }} <button v-if="session" class="underline" @click="eventStreamExpired && activeRun ? visibilityChange() : loadMessages()">{{ eventStreamExpired && activeRun ? 'Refresh session history' : 'Refresh history' }}</button> <button v-if="viewUnavailable" class="ml-3 underline" @click="releaseUnavailableRun">I verified the run ended</button></div>
      <ScheduledPage v-if="scheduledPage" :key="`${profile}:${scheduledPageKey}`" :profile="profile" :chat-busy="creating" :offline="offline" :discussion-error="scheduledDiscussionError" @discuss="discussScheduled" />
      <ProjectsPage v-else-if="projectsPage" :key="profile" :projects="projects" :archived="archivedProjects" :loading="projectsLoading" :error="projectsError || manageError" :busy="projectBusy" :offline="offline" @select="chooseProject" @archive="showProjects" @retry="loadProjects" @manage="manageProject" />
      <section v-else-if="projectView" class="min-h-0 flex-1 overflow-y-auto px-6 py-8 min-[701px]:px-10" aria-label="Selected Project">
        <button class="project-back" @click="showProjects(!!selectedProject?.archived)">← Projects</button>
        <p v-if="projectLoading" role="status">Loading Project…</p>
        <p v-if="projectError" class="mb-4 text-[#fecaca]" role="alert">{{ projectError }} <button class="underline" @click="loadProject">Retry Project</button></p>
        <template v-if="selectedProject">
          <p v-if="selectedProject.archived" class="project-muted">Archived project</p>
          <h2 class="mb-3 text-2xl font-semibold">{{ selectedProject.label }}</h2>
          <p class="mb-4 break-all text-sm text-[#a3a3a3]">{{ projectRoot(selectedProject) ? 'Workspace: ' + projectRoot(selectedProject) : selectedProject.isNoProject ? 'No project workspace' : 'No workspace configured' }}</p>
          <button class="mb-4 rounded-xl bg-[#303030] px-4 py-3 text-base disabled:opacity-55" :disabled="offline || creating || selectedProject.archived || (!selectedProject.isNoProject && !projectRoot(selectedProject))" @click="createSession">New chat</button>
          <ProjectSettings :key="selectedProject.id" :project="selectedProject" :busy="projectBusy" :offline="offline" :error="manageError" @manage="manageProject" />
          <h3 class="mb-3 text-sm text-[#a3a3a3]">Recent chats</h3>
          <p v-if="!visibleSessions.length" class="text-sm text-[#b4b4b4]">No conversations yet.</p>
          <button v-for="row in visibleSessions" :key="row.id" class="block w-full rounded-lg px-3 py-3 text-left text-base hover:bg-[#303030]" @click="chooseSession(row.id)">{{ row.title || 'Untitled session' }}</button>
          <button class="mt-5 rounded-xl bg-[#303030] px-4 py-3 text-base" @click="chooseProject('')">Other chats</button>
        </template>
      </section>
      <ChatTranscript v-else :profile="profile" :messages="viewMessages" :draft="nativeMode ? '' : draft" :loading="viewLoading" :progress="nativeMode ? [] : progress" :thinking="nativeMode ? viewBusy : thinking" :working="viewBusy || viewApprovalPending" :approval-pending="viewApprovalPending" :status-label="viewApprovalPending ? viewApproval?.kind === 'clarify' ? 'Waiting for your answers' : 'Waiting for approval' : runStatus === 'stopping' ? 'Stopping…' : viewStatus !== 'Working…' ? viewStatus : ''" :home="!session" @suggest="suggest">
        <template #request>
      <div v-if="viewApprovalPending" class="notice px-5 py-3 text-sm" role="status">
        <p v-if="viewApproval?.kind !== 'clarify'">Approval required{{ viewApproval?.command ? ': ' + viewApproval.command : '' }}</p>
        <template v-if="viewActive && (api.isNative(profile) || !activeRun.startsWith('workspace-')) && viewApproval?.kind !== 'clarify'">
          <button v-for="choice in (Array.isArray(viewApproval?.choices) ? viewApproval.choices : [])" :key="String(choice)" class="mr-3 rounded-lg bg-[#303030] px-3 py-2 text-base disabled:opacity-55" :disabled="actionBusy" @click="approveRun(String(choice))">{{ choice === 'once' ? 'Allow once' : choice === 'deny' ? 'Deny' : choice === 'session' ? 'Allow for session' : 'Always allow' }}</button>
        </template>
        <form v-if="viewApproval?.kind === 'clarify'" @submit.prevent="answerClarification">
          <label v-for="question in (viewApproval.questions as { qid: string; question: string; choices?: string[]; multi_select?: boolean }[])" :key="question.qid" class="block my-3">
            {{ question.question }}
            <select v-if="question.choices?.length" :multiple="question.multi_select" v-model="clarificationAnswers[question.qid]" class="block rounded-lg bg-[#303030] p-2 text-base"><option value="">Select an answer</option><option v-for="choice in question.choices" :key="choice">{{ choice }}</option></select>
            <input v-if="!question.choices?.length" v-model="clarificationAnswers[question.qid]" class="block w-full rounded-lg bg-[#303030] p-2 text-base" />
            <input v-else v-model="customClarification[question.qid]" placeholder="Or enter your own answer" :aria-label="question.question + ' — custom answer'" class="mt-2 block w-full rounded-lg bg-[#303030] p-2 text-base" />
          </label>
          <button :disabled="actionBusy" class="rounded-lg bg-[#303030] p-2 text-base">Submit answers</button>
        </form>
        <p v-else-if="!api.isNative(profile) && activeRun.startsWith('workspace-')">Resolve this workspace approval in Hermes.</p>
      </div>
        </template>
      </ChatTranscript>
      <div v-if="!scheduledPage && viewActive && !viewReconnect && runStatus === 'stopping'" class="px-5 py-2 text-sm text-[#b4b4b4]" role="status">Stopping…</div>
      <ChatComposer :key="JSON.stringify([profile, session])" :disabled="scheduledPage || projectsPage || (projectView && selectedProject?.archived) || (projectView && (!selectedProject || (!selectedProject.isNoProject && !projectRoot(selectedProject)))) || offline || creating || modelsLoading || viewLoading || viewApprovalPending || viewUnavailable || viewReconnect || !canStream" :models="!api.isNative(profile) && (projectId || api.isWorkspace(profile, session)) ? [] : models" :providers="providers" :models-loading="modelsLoading" v-model:provider="provider" :default-model="defaultModel" v-model:model="model" :sending="viewBusy" :stoppable="viewActive && !actionBusy" :suggested-prompt="suggestedPrompt" :reason="scheduledPage ? 'Open a chat to discuss a run.' : projectsPage ? 'Select a project or start a new chat.' : projectView && selectedProject?.archived ? 'Restore this project to start a new chat.' : projectView && selectedProject && !selectedProject.isNoProject && !projectRoot(selectedProject) ? 'This Project has no workspace.' : offline ? 'Offline · sending is unavailable.' : viewApprovalPending ? 'Approval is pending in Hermes.' : !canStream ? 'Streaming turns are unavailable for this profile.' : undefined" @stop="stopRun" @steer="steerRun" @send="send" />
    </main>
  </div>
</template>
