<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { api, ApiError, messageText } from "../../../services/hermes-api";
import type { ScheduledJob, ScheduledRun, ScheduledOutput } from "../../../types/hermes";
import ChatTranscript from "../../../components/ChatTranscript.vue";
const props = defineProps<{
  profile: string;
  chatBusy?: boolean;
  offline?: boolean;
  discussionError?: string;
}>();
const emit = defineEmits<{ discuss: [text: string] }>();
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
function url() {
  const target = new URL(location.href);
  target.searchParams.delete("job");
  target.searchParams.delete("scheduled_run");
  if (job.value) target.searchParams.set("job", job.value.id);
  if (run.value) target.searchParams.set("scheduled_run", run.value.id);
  history.pushState({}, "", target.pathname + target.search + target.hash);
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
    if (!signal.aborted) jobs.value = result.jobs;
  });
}
async function selectJob(row: ScheduledJob, fromHistory = false) {
  job.value = row;
  run.value = undefined;
  output.value = undefined;
  runs.value = [];
  offset.value = 0;
  more.value = false;
  if (!fromHistory) url();
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
  run.value = row;
  output.value = undefined;
  if (!fromHistory) url();
  await read(async (signal) => {
    const result = await api.scheduledOutput(props.profile, job.value!.id, row.id, signal);
    if (!signal.aborted) {
      output.value = result;
      if (typeof result.started_at === "number")
        run.value = { ...row, started_at: result.started_at };
    }
  });
}
function back() {
  controller?.abort();
  loading.value = false;
  error.value = "";
  output.value = undefined;
  if (run.value) run.value = undefined;
  else job.value = undefined;
  url();
}
function retry() {
  if (run.value) void selectRun(run.value, true);
  else if (job.value) void loadRuns();
  else void loadJobs();
}
function discuss() {
  const text =
    output.value?.output ||
    output.value?.messages
      .filter((row) => row.role === "assistant")
      .map((row) => messageText(row.content))
      .filter(Boolean)
      .join("\n\n");
  if (text)
    emit(
      "discuss",
      `Discuss this scheduled job run.\n\nJob: ${job.value?.name || job.value?.id}\nRun: ${date(run.value!.started_at)}\n\n${text}`,
    );
}
onMounted(async () => {
  const params = new URLSearchParams(location.search),
    id = params.get("job"),
    runId = params.get("scheduled_run");
  await loadJobs();
  if (controller?.signal.aborted) return;
  const selected = jobs.value.find((row) => row.id === id);
  if (id && !selected) {
    error.value = "This scheduled job is no longer available.";
    return;
  }
  if (selected) {
    status.value = state(selected);
    await selectJob(selected, true);
    if (controller?.signal.aborted) return;
    // Deep links can address older runs outside the first history page.
    if (runId)
      await selectRun(
        runs.value.find((row) => row.id === runId) || { id: runId, started_at: 0, source: "cron" },
        true,
      );
  }
});
onUnmounted(() => controller?.abort());
</script>
<template>
  <section class="scheduled-page min-h-0 flex flex-1 flex-col" aria-label="Scheduled">
    <div class="scheduled-heading">
      <div class="scheduled-heading-content">
        <button v-if="job" class="project-back" @click="back">
          ← {{ run ? job.name || job.id : "Scheduled" }}
        </button>
        <div class="page-heading">
          <h2>{{ job?.name || job?.id || "Scheduled" }}</h2>
          <button v-if="!run" class="project-button" :disabled="loading" @click="retry">
            Refresh
          </button>
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
        <button
          v-if="
            output &&
            (output.output ||
              output.messages.some((row) => row.role === 'assistant' && messageText(row.content)))
          "
          class="project-button"
          :disabled="chatBusy || offline"
          @click="discuss"
        >
          Open a chat about this run
        </button>
        <p v-if="discussionError" role="alert" class="project-error">{{ discussionError }}</p>
        <p v-if="loading" role="status" class="project-muted">Loading scheduled history…</p>
        <p v-if="error" role="alert" class="project-error">
          {{ error }} <button class="underline" @click="retry">Retry</button>
        </p>
      </div>
    </div>
    <ChatTranscript
      v-if="run && output && (output.output || output.messages.length)"
      :key="run.id"
      :follow-initially="false"
      :messages="output.output ? [{ role: 'assistant', content: output.output }] : output.messages"
      draft=""
      :loading="false"
      :progress="[]"
    />
    <div v-else class="scheduled-content">
      <p v-if="!loading && !error && !job && !rows.length" class="project-muted">
        No {{ status }} scheduled jobs.
      </p>
      <nav v-if="!job" class="scheduled-list" aria-label="Scheduled jobs">
        <button v-for="row in rows" :key="row.id" @click="selectJob(row)">
          <span
            ><strong>{{ row.name || row.id }}</strong
            ><small>{{ row.prompt || "Scheduled job" }}</small
            ><small>{{ row.schedule_display }}</small></span
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
      <p v-if="run && output && !output.output && !output.messages.length" class="project-muted">
        No output was saved for this run.
      </p>
    </div>
  </section>
</template>
