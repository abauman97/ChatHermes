<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../../services/hermes-api";
import type { ScheduledJob } from "../../../types/hermes";
import ScheduledHeading from "../components/ScheduledHeading.vue";
import { useScheduledHistory, jobState, lastRun } from "../composables/useScheduledHistory";
const route = useRoute(),
  router = useRouter();

const jobs = ref<ScheduledJob[]>([]);
const status = computed({
  get: () =>
    ["paused", "completed"].includes(String(route.query.status))
      ? String(route.query.status)
      : "active",
  set: (status: string) => {
    void router.replace({ query: { ...route.query, status } });
  },
});
const rows = computed(() => jobs.value.filter((row) => jobState(row) === status.value));
const { loading, error, retry } = useScheduledHistory(async (signal, profile) => {
  jobs.value = [];
  const result = await api.scheduled(profile, signal);
  if (!Array.isArray(result.jobs)) throw new Error("Invalid jobs");
  if (!signal.aborted) jobs.value = result.jobs;
});
</script>
<template>
  <section class="scheduled-page min-h-0 flex flex-1 flex-col" aria-label="Scheduled">
    <ScheduledHeading :loading="loading" :error="error" @retry="retry"
      ><label class="scheduled-filter"
        >Show
        <select v-model="status" aria-label="Job status">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select></label
      ></ScheduledHeading
    >
    <div class="scheduled-content">
      <p v-if="!loading && !error && !rows.length" class="project-muted">
        No {{ status }} scheduled jobs.
      </p>
      <nav class="scheduled-list" aria-label="Scheduled jobs">
        <button
          v-for="row in rows"
          :key="row.id"
          class="scheduled-job-row"
          @click="
            router.push({ name: 'scheduled-job', params: { jobId: row.id }, query: route.query })
          "
        >
          <span
            ><strong>{{ row.name || row.id }}</strong
            ><small>{{ row.schedule_display || "Scheduled job" }}</small
            ><small>{{ lastRun(row.last_run_at) }}</small></span
          ><span aria-hidden="true">›</span>
        </button>
      </nav>
    </div>
  </section>
</template>
