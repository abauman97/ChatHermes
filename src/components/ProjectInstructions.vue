<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { api, ApiError } from '../lib/hermes-api'
const props = defineProps<{ profile: string; projectId: string; offline: boolean }>()
const content = ref(''), filename = ref(''), revision = ref<string | null>(null)
const loading = ref(true), saving = ref(false), error = ref(''), saved = ref(false), loaded = ref(false)
const controller = new AbortController()
let mounted = true
async function load() {
  loading.value = true; error.value = ''; saved.value = false
  try {
    const result = await api.projectInstructions(props.profile, props.projectId, controller.signal)
    if (!mounted) return
    content.value = result.content; filename.value = result.filename; revision.value = result.revision; loaded.value = true
  } catch { if (mounted) error.value = 'Could not load the workspace instructions.' }
  finally { if (mounted) loading.value = false }
}
async function save() {
  if (!loaded.value || loading.value || saving.value || props.offline) return
  saving.value = true; error.value = ''; saved.value = false
  try {
    const result = await api.saveProjectInstructions(props.profile, props.projectId, { content: content.value, filename: filename.value, revision: revision.value })
    if (mounted) { revision.value = result.revision; saved.value = true }
  } catch (cause) {
    if (mounted) error.value = cause instanceof ApiError && cause.status === 409
      ? 'Instructions changed or the workspace is unavailable. Your draft is kept. Copy it before reloading.'
      : 'Could not save instructions. Your draft is kept; try again.'
  } finally { if (mounted) saving.value = false }
}
onMounted(load)
onBeforeUnmount(() => { mounted = false; controller.abort() })
</script>
<template>
  <form class="project-form instructions-form" @submit.prevent="save">
    <p class="project-muted">Custom instructions guide Hermes when it works in this project.</p>
    <p v-if="loading" role="status">Loading instructions…</p>
    <p v-if="error" role="alert" class="project-error">{{ error }} <button type="button" class="underline" :disabled="loading || saving || offline" @click="load">Reload instructions</button></p>
    <label v-if="loaded">Instructions <span class="project-muted">{{ filename }}</span><textarea v-model="content" rows="14" :disabled="loading || saving" @input="saved = false" /></label>
    <p v-if="saved" role="status" class="project-muted">Instructions saved.</p>
    <button class="project-button justify-self-start" :disabled="!loaded || loading || saving || offline">{{ saving ? 'Saving…' : 'Save instructions' }}</button>
  </form>
</template>
