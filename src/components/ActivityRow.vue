<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Activity } from '../types/hermes'
const props = defineProps<{ activity: Activity; turnComplete?: boolean }>()
const expanded = ref(!props.activity.complete)
watch(() => [props.activity.complete, props.turnComplete], ([complete, turnComplete]) => { expanded.value = !complete && !turnComplete })
watch(() => props.turnComplete, complete => { if (complete) expanded.value = false })
function toggle(event: Event) { expanded.value = (event.target as HTMLDetailsElement).open }
</script>
<template>
  <details class="activity" :class="{ 'activity-failed': activity.state === 'failed', 'activity-active': !activity.complete && !turnComplete }" :open="expanded" @toggle="toggle">
    <summary><span v-if="activity.state === 'failed'" aria-hidden="true">!</span><span :class="{ 'working-shimmer': !activity.complete }">{{ activity.title }}</span><span v-if="activity.state === 'failed'"> · Failed</span><span v-if="activity.duration !== undefined"> · {{ activity.duration.toFixed(1) }}s</span></summary>
    <pre v-if="activity.content || activity.output || activity.toolName">{{ [activity.toolName, activity.content, activity.output].filter(Boolean).join('\n\n') }}</pre>
    <p v-else-if="!activity.complete" class="ml-6 py-1 text-sm" role="status">{{ activity.kind === 'thinking' ? 'Working…' : activity.state === 'pending' ? 'Waiting…' : 'Running…' }}</p>
  </details>
</template>
