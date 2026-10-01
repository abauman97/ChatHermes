<script setup lang="ts">
import type { Activity } from '../types/hermes'
defineProps<{ activity: Activity }>()
</script>
<template>
  <details class="activity" :open="!activity.complete">
    <summary><span aria-hidden="true">{{ activity.kind === 'thinking' ? '◌' : '⌘' }}</span>{{ activity.title }}</summary>
    <pre v-if="activity.content || activity.output">{{ [activity.content, activity.output].filter(Boolean).join('\n\n') }}</pre>
    <p v-else-if="!activity.complete" class="ml-6 py-1 text-sm" role="status">{{ activity.kind === 'thinking' ? 'Working…' : 'Running…' }}</p>
  </details>
</template>
