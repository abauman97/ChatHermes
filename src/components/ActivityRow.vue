<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Activity } from '../types/hermes'
const props = defineProps<{ activity: Activity }>()
const expanded = ref(!props.activity.complete)
watch(() => props.activity.complete, complete => { expanded.value = !complete })
function toggle(event: Event) { expanded.value = (event.target as HTMLDetailsElement).open }
</script>
<template>
  <details class="activity" :class="{ 'activity-failed': activity.state === 'failed' }" :open="expanded" @toggle="toggle">
    <summary><span aria-hidden="true">{{ activity.state === 'failed' ? '!' : activity.complete ? '✓' : activity.kind === 'thinking' ? '◌' : '●' }}</span>{{ activity.title }}<span v-if="activity.state === 'failed'"> · Failed</span><span v-if="activity.duration !== undefined"> · {{ activity.duration.toFixed(1) }}s</span></summary>
    <pre v-if="activity.content || activity.output || activity.toolName">{{ [activity.toolName, activity.content, activity.output].filter(Boolean).join('\n\n') }}</pre>
    <p v-else-if="!activity.complete" class="ml-6 py-1 text-sm" role="status">{{ activity.kind === 'thinking' ? 'Working…' : activity.state === 'pending' ? 'Waiting…' : 'Running…' }}</p>
  </details>
</template>
