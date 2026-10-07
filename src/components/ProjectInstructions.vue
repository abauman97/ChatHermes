<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { api } from '../lib/hermes-api'
const props = defineProps<{ profile: string; projectId: string; offline: boolean }>()
const emit = defineEmits<{ done: [] }>()
const content = ref(''), original = ref(''), filename = ref('.hermes.md'), loading = ref(true), saving = ref(false), error = ref('')
const controller = new AbortController()
async function load() {
  loading.value = true; error.value = ''
  try {
    const result = await api.projectInstructions(props.profile, props.projectId, controller.signal)
    if (!controller.signal.aborted) { content.value = original.value = result.content; filename.value = result.filename }
  } catch { if (!controller.signal.aborted) error.value = 'Could not load project instructions. Check the workspace and retry.' }
  finally { if (!controller.signal.aborted) loading.value = false }
}
async function save() {
  if (saving.value || loading.value || props.offline || error.value) return
  saving.value = true
  try {
    await api.saveProjectInstructions(props.profile, props.projectId, content.value, original.value)
    if (!controller.signal.aborted) emit('done')
  } catch { if (!controller.signal.aborted) error.value = 'Could not save instructions. The file may have changed; reload before trying again.' }
  finally { if (!controller.signal.aborted) saving.value = false }
}
onMounted(load)
onUnmounted(() => controller.abort())
</script>
<template>
  <section aria-label="Project instructions">
    <h2 tabindex="-1" class="text-2xl font-semibold">Project instructions</h2>
    <p class="project-muted">Tell Hermes how to work in this project. Instructions are saved to {{ filename }} in its workspace and loaded by Hermes for new chats.</p>
    <p v-if="loading" role="status" class="project-muted">Loading instructions…</p>
    <p v-if="error" role="alert" class="project-error">{{ error }} <button class="underline" :disabled="saving || offline" @click="load">Reload instructions</button></p>
    <form class="project-form" @submit.prevent="save">
      <label>Instructions<textarea v-model="content" rows="12" maxlength="65536" :readonly="loading || saving || !!error" /></label>
      <div class="project-actions"><button class="project-button" :disabled="loading || saving || offline || !!error">{{ saving ? 'Saving…' : 'Save instructions' }}</button><button type="button" class="project-button" :disabled="saving" @click="emit('done')">Cancel</button></div>
    </form>
  </section>
</template>
