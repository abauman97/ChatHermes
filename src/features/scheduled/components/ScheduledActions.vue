<script setup lang="ts">
import { useScheduled } from "../composables/useScheduledHistory";
import { useRoute } from "vue-router";
const { current } = useScheduled();
const route = useRoute();
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
    v-if="route.name === 'scheduled-run'"
    role="menuitem"
    data-test="resume-scheduled-session"
    :disabled="!current?.canResume.value"
    :aria-describedby="!current?.sessionId.value ? 'scheduled-resume-unavailable' : undefined"
    @click="current?.resume()"
  >
    Resume Session
  </button>
  <span
    v-if="route.name === 'scheduled-run' && !current?.sessionId.value"
    id="scheduled-resume-unavailable"
    class="max-w-64 px-3 pb-2 text-xs text-[#a3a3a3]"
    role="presentation"
    >{{
      current?.loading.value
        ? "Checking for an associated session…"
        : current?.error.value
          ? "The associated session could not be checked. Retry loading this result."
          : "No associated session is available for this result."
    }}</span
  >
</template>
