<script setup lang="ts">
import { useScheduled } from "../composables/useScheduledHistory";
const { current, offline, creating, recentSession } = useScheduled();
</script>
<template>
  <button
    role="menuitem"
    data-test="refresh-scheduled"
    :disabled="!current || current.loading.value"
    @click="current?.retry()"
  >
    Refresh</button
  ><button
    v-if="current?.sessionId.value"
    role="menuitem"
    data-test="resume-scheduled-session"
    :disabled="offline || creating || current.loading.value"
    @click="recentSession(current.sessionId.value)"
  >
    Resume Session
  </button>
</template>
