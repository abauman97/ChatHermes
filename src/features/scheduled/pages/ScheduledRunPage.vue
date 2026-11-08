<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { api } from "../../../services/hermes-api";
import type { ScheduledJob, ScheduledOutput } from "../../../types/hermes";
import ScheduledHeading from "../components/ScheduledHeading.vue";
import {
  useScheduledHistory,
  runDate,
  readJob,
  outputMessages,
} from "../composables/useScheduledHistory";
const route = useRoute();

import ChatTranscript from "../../../components/ChatTranscript.vue";
const job = ref<ScheduledJob>(),
  output = ref<ScheduledOutput>();
// Direct output lookup supports saved runs beyond the first history page.
const state = useScheduledHistory(async (signal, profile, id, runId) => {
  job.value = undefined;
  output.value = undefined;
  const selected = await readJob(profile, id, signal);
  if (signal.aborted) return;
  job.value = selected;
  const result = await api.scheduledOutput(profile, id, runId, signal);
  if (signal.aborted) return;
  output.value = result;
  state.sessionId.value = result.session_id;
});
const { loading, error, retry } = state;
const messages = computed(() => outputMessages(output.value));
</script>
<template>
  <section class="scheduled-page min-h-0 flex flex-1 flex-col" aria-label="Scheduled">
    <ScheduledHeading
      :title="job?.name || job?.id"
      :subtitle="output ? runDate(output.started_at || 0) : undefined"
      :loading="loading"
      :error="error"
      @retry="retry"
    /><ChatTranscript
      v-if="messages.length"
      :key="String(route.params.runId)"
      :follow-initially="false"
      :messages="messages"
      draft=""
      :loading="false"
      :progress="[]"
    />
    <div v-else class="scheduled-content">
      <p v-if="output?.output_status === 'unverified'" class="project-muted">
        Saved output or error diagnostics could not be safely separated from this run's private
        prompt. Inspect the original archive on the Hermes server.
      </p>
      <p v-else-if="output" class="project-muted">No output was saved for this run.</p>
    </div>
  </section>
</template>
