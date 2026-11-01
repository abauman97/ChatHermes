<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../../services/hermes-api";
import type { ScheduledJob, ScheduledRun } from "../../../types/hermes";
import ScheduledHeading from "../components/ScheduledHeading.vue";
import { useScheduledHistory, runDate, readJob } from "../composables/useScheduledHistory";
const route = useRoute(),
  router = useRouter();

const job = ref<ScheduledJob>(),
  runs = ref<ScheduledRun[]>([]),
  more = ref(false),
  offset = ref(0);
let append = false;
const { loading, error, retry } = useScheduledHistory(async (signal, profile, id) => {
  const adding = append;
  append = false;
  if (!adding) {
    job.value = undefined;
    runs.value = [];
    offset.value = 0;
    more.value = false;
    const selected = await readJob(profile, id, signal);
    if (signal.aborted) return;
    job.value = selected;
  }
  const result = await api.scheduledRuns(profile, id, adding ? offset.value : 0, signal);
  if (signal.aborted) return;
  runs.value = adding
    ? [...runs.value, ...result.runs.filter((row) => !runs.value.some((old) => old.id === row.id))]
    : result.runs;
  offset.value = result.offset + result.runs.length;
  more.value = result.has_more;
});
function older() {
  append = true;
  void retry();
}
</script>
<template>
  <section class="scheduled-page min-h-0 flex flex-1 flex-col" aria-label="Scheduled">
    <ScheduledHeading
      :title="job?.name || job?.id"
      subtitle="Run history · newest first"
      :loading="loading"
      :error="error"
      @retry="retry"
    />
    <div class="scheduled-content">
      <p v-if="!loading && !error && !runs.length" class="project-muted">No runs yet.</p>
      <nav class="scheduled-list" aria-label="Job runs">
        <button
          v-for="row in runs"
          :key="row.id"
          @click="
            router.push({
              name: 'scheduled-run',
              params: { jobId: route.params.jobId, runId: row.id },
              query: route.query,
            })
          "
        >
          <span
            ><strong>{{ runDate(row.started_at) }}</strong
            ><small>{{ row.title || "Job run" }}</small
            ><small>{{
              row.end_reason ||
              (row.source === "cron_output"
                ? "Saved output"
                : row.ended_at
                  ? "Finished"
                  : "In progress")
            }}</small></span
          ><span aria-hidden="true">›</span>
        </button>
      </nav>
      <button v-if="more" class="project-button" :disabled="loading" @click="older">
        Load older runs
      </button>
    </div>
  </section>
</template>
