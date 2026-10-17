<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api, ApiError, messageText } from "../../../services/hermes-api";
import type { ScheduledJob, ScheduledRun, ScheduledOutput } from "../../../types/hermes";
import ChatTranscript from "../../../components/ChatTranscript.vue";
const props = defineProps<{ profile: string; chatBusy?: boolean; offline?: boolean }>();
const route = useRoute(),
  router = useRouter();
let revision = 0;
const jobs = ref<ScheduledJob[]>([]),
  job = ref<ScheduledJob>(),
  runs = ref<ScheduledRun[]>([]),
  run = ref<ScheduledRun>(),
  output = ref<ScheduledOutput>();
const status = ref("active"),
  loading = ref(false),
  error = ref(""),
  more = ref(false),
  offset = ref(0);
let controller: AbortController | undefined;
const rows = computed(() => jobs.value.filter((row) => state(row) === status.value));
const resultMessages = computed(() => {
  const text =
    messageText(
      output.value?.messages
        .slice()
        .reverse()
        .find((row) => row.role === "assistant" && messageText(row.content))?.content,
    ) || output.value?.output;
  return text ? [{ role: "assistant", content: text }] : [];
});
function state(row: ScheduledJob) {
  return row.state === "completed" || row.state === "error"
    ? "completed"
    : row.state === "paused" || row.enabled === false
      ? "paused"
      : "active";
}
function date(seconds: number) {
  return seconds > 0 ? new Date(seconds * 1000).toLocaleString() : "Run date unavailable";
}
function lastRun(timestamp?: string) {
  if (!timestamp) return "Never run";
  const started = new Date(timestamp);
  return Number.isNaN(started.getTime())
    ? "Last run date unavailable"
    : `Last run: ${started.toLocaleString()}`;
}
function selection(jobId?: string, runId?: string) {
  return router.push({
    name: runId ? "scheduled-run" : jobId ? "scheduled-job" : "scheduled",
    params: { ...(jobId ? { jobId } : {}), ...(runId ? { runId } : {}) },
    query: route.query,
  });
}
async function read(work: (signal: AbortSignal) => Promise<void>) {
  controller?.abort();
  const current = new AbortController();
  controller = current;
  loading.value = true;
  error.value = "";
  try {
    await work(current.signal);
  } catch (cause) {
    if (!current.signal.aborted)
      error.value =
        cause instanceof ApiError && cause.status === 503
          ? "Scheduled history is unavailable in this Hermes version."
          : "Could not load scheduled history. The job or output may no longer be available.";
  } finally {
    if (controller === current) loading.value = false;
  }
}
async function loadJobs() {
  await read(async (signal) => {
    const result = await api.scheduled(props.profile, signal);
    if (!Array.isArray(result.jobs)) throw new Error("Invalid scheduled jobs response");
    if (!signal.aborted) jobs.value = result.jobs;
  });
}
async function selectJob(row: ScheduledJob, fromHistory = false) {
  if (!fromHistory) return selection(row.id);
  job.value = row;
  run.value = undefined;
  output.value = undefined;
  runs.value = [];
  offset.value = 0;
  more.value = false;

  await loadRuns();
}
async function loadRuns(append = false) {
  await read(async (signal) => {
    const result = await api.scheduledRuns(
      props.profile,
      job.value!.id,
      append ? offset.value : 0,
      signal,
    );
    if (signal.aborted) return;
    runs.value = append
      ? [
          ...runs.value,
          ...result.runs.filter((row) => !runs.value.some((old) => old.id === row.id)),
        ]
      : result.runs;
    offset.value = result.offset + result.runs.length;
    more.value = result.has_more;
  });
}
async function selectRun(row: ScheduledRun, fromHistory = false) {
  if (!fromHistory) return selection(job.value!.id, row.id);
  run.value = row;
  output.value = undefined;

  await read(async (signal) => {
    const result = await api.scheduledOutput(props.profile, job.value!.id, row.id, signal);
    if (!signal.aborted) {
      output.value = result;
      if (typeof result.started_at === "number")
        run.value = { ...row, started_at: result.started_at };
    }
  });
}
function retry() {
  if (run.value) void selectRun(run.value, true);
  else if (job.value) void loadRuns();
  else void loadJobs();
}
const sessionId = computed(() => output.value?.session_id);
defineExpose({ retry, loading, sessionId });
let stopSelection: (() => void) | undefined;
onMounted(async () => {
  await router.isReady();
  if (disposed) return;
  stopSelection = watch(
    () => [props.profile, route.params.jobId, route.params.runId],
    async () => {
      const current = ++revision;
      const id = String(route.params.jobId || ""),
        runId = String(route.params.runId || "");
      job.value = undefined;
      run.value = undefined;
      output.value = undefined;
      await loadJobs();
      if (current !== revision || controller?.signal.aborted) return;
      const selected = jobs.value.find((row) => row.id === id);
      if (id && !selected) {
        error.value = "This scheduled job is no longer available.";
        return;
      }
      if (selected) {
        status.value = state(selected);
        await selectJob(selected, true);
        if (current !== revision || controller?.signal.aborted) return;
        // Deep links can address older runs outside the first history page.
        if (runId)
          await selectRun(
            runs.value.find((row) => row.id === runId) || {
              id: runId,
              started_at: 0,
              source: "cron",
            },
            true,
          );
      }
    },
    { immediate: true },
  );
});
let disposed = false;
onUnmounted(() => {
  disposed = true;
  stopSelection?.();
  revision++;
  controller?.abort();
});
</script>
<template>
  <section class="scheduled-page min-h-0 flex flex-1 flex-col" aria-label="Scheduled">
    <div class="scheduled-heading">
      <div class="scheduled-heading-content">
        <div class="page-heading">
          <h2>{{ job?.name || job?.id || "Scheduled" }}</h2>
        </div>
        <label v-if="!job" class="scheduled-filter"
          >Show
          <select v-model="status" aria-label="Job status">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select></label
        >
        <p v-else class="project-muted">
          {{ run ? date(run.started_at) : "Run history · newest first" }}
        </p>
        <p v-if="loading" role="status" class="project-muted">Loading scheduled history…</p>
        <p v-if="error" role="alert" class="project-error">
          {{ error }} <button class="underline" @click="retry">Retry</button>
        </p>
      </div>
    </div>
    <ChatTranscript
      v-if="run && resultMessages.length"
      :key="run.id"
      :follow-initially="false"
      :messages="resultMessages"
      draft=""
      :loading="false"
      :progress="[]"
    />
    <div v-else class="scheduled-content">
      <p v-if="!loading && !error && !job && !rows.length" class="project-muted">
        No {{ status }} scheduled jobs.
      </p>
      <nav v-if="!job" class="scheduled-list" aria-label="Scheduled jobs">
        <button v-for="row in rows" :key="row.id" class="scheduled-job-row" @click="selectJob(row)">
          <span
            ><strong>{{ row.name || row.id }}</strong
            ><small>{{ row.schedule_display || "Scheduled job" }}</small
            ><small>{{ lastRun(row.last_run_at) }}</small></span
          ><span aria-hidden="true">›</span>
        </button>
      </nav>
      <p v-if="!loading && !error && job && !run && !runs.length" class="project-muted">
        No runs yet.
      </p>
      <nav v-if="job && !run" class="scheduled-list" aria-label="Job runs">
        <button v-for="row in runs" :key="row.id" @click="selectRun(row)">
          <span
            ><strong>{{ date(row.started_at) }}</strong
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
      <button
        v-if="job && !run && more"
        class="project-button"
        :disabled="loading"
        @click="loadRuns(true)"
      >
        Load older runs
      </button>
      <p v-if="run && output && !resultMessages.length" class="project-muted">
        No output was saved for this run.
      </p>
    </div>
  </section>
</template>
