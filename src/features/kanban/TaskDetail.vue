<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import TaskForm from "./TaskForm.vue";
import { kanbanUrl } from "./api";
import type { Detail, WorkerLog, Workflow } from "./types";
const props = defineProps<{
  board: string;
  detail: Detail;
  log?: WorkerLog;
  workflow?: Workflow;
  assignees: string[];
  busy: boolean;
}>();
const emit = defineEmits<{
  close: [];
  select: [id: string];
  operation: [path: string, method: string, body: unknown, nudge?: boolean, after?: () => void];
  upload: [file: File];
}>();
const heading = ref<HTMLElement>();
onMounted(() => heading.value?.focus());
const editing = ref(false),
  comment = ref(""),
  assignee = ref(props.detail.task.assignee || ""),
  confirmDelete = ref(false);
watch(
  () => props.detail.task.assignee,
  (value) => {
    assignee.value = value || "";
  },
);
const path = () => "/tasks/" + encodeURIComponent(props.detail.task.id);
function operation(
  suffix: string,
  method: string,
  body: unknown,
  nudge = true,
  after?: () => void,
) {
  emit("operation", path() + suffix, method, body, nudge, after);
}
function save(patch: Record<string, unknown>) {
  operation("", "PATCH", patch, true, () => {
    editing.value = false;
  });
}
function addComment() {
  const sent = comment.value;
  if (sent.trim())
    operation("/comments", "POST", { body: sent.trim(), author: "dashboard" }, false, () => {
      if (comment.value === sent) comment.value = "";
    });
}
function upload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) emit("upload", file);
  input.value = "";
}
function time(value: number) {
  return new Date(value * 1000).toLocaleString();
}
</script>
<template>
  <section class="kanban-detail" aria-label="Task details">
    <div class="kanban-toolbar">
      <h2 ref="heading" tabindex="-1" class="min-w-0 flex-1 break-words text-xl">
        {{ detail.task.title }}
      </h2>
      <button aria-label="Close task details" @click="emit('close')">Close</button>
    </div>
    <p class="kanban-muted">
      {{ detail.task.id }} · {{ detail.task.status }} · Priority {{ detail.task.priority ?? 0 }}
    </p>
    <p v-if="detail.task.progress">
      {{ detail.task.progress.done }}/{{ detail.task.progress.total }} subtasks complete
    </p>
    <p v-if="detail.task.block_kind">Block reason: {{ detail.task.block_kind }}</p>
    <p v-if="detail.task.worker_pid" class="kanban-muted">
      Worker {{ detail.task.worker_pid
      }}<span v-if="detail.task.last_heartbeat_at">
        · Heartbeat {{ time(detail.task.last_heartbeat_at) }}</span
      >
    </p>
    <TaskForm
      v-if="editing"
      :task="detail.task"
      :assignees="assignees"
      :busy="busy"
      @save="save"
      @cancel="editing = false"
    />
    <template v-else>
      <p class="kanban-prose">{{ detail.task.body || "No description." }}</p>
      <button :disabled="busy" @click="editing = true">Edit task</button>
    </template>
    <div class="kanban-toolbar">
      <label
        >Move task<select
          aria-label="Move task"
          :value="detail.task.status"
          :disabled="busy || !workflow"
          @change="operation('', 'PATCH', { status: ($event.target as HTMLSelectElement).value })"
        >
          <option :value="detail.task.status">{{ detail.task.status }}</option>
          <option
            v-for="column in workflow?.columns.filter(
              (c) => c.drag_target && workflow?.manual[detail.task.status]?.includes(c.key),
            )"
            :key="column.key"
            :value="column.key"
          >
            {{ column.label }}
          </option>
        </select></label
      >
      <button
        v-if="detail.task.status !== 'archived'"
        :disabled="busy"
        @click="operation('', 'PATCH', { status: 'archived' })"
      >
        Archive task
      </button>
      <button
        v-if="detail.task.status === 'running'"
        :disabled="busy"
        @click="operation('/reclaim', 'POST', {})"
      >
        Reclaim worker
      </button>
    </div>
    <form
      class="kanban-toolbar"
      @submit.prevent="operation('/reassign', 'POST', { profile: assignee, reclaim_first: true })"
    >
      <label
        >Assignee<select v-model="assignee" aria-label="Reassign task">
          <option value="">Unassigned</option>
          <option
            v-for="name in Array.from(
              new Set([...assignees, detail.task.assignee || ''].filter(Boolean)),
            )"
            :key="name"
            :value="name"
          >
            {{ name }}
          </option>
        </select></label
      >
      <button :disabled="busy">Reassign task</button>
      <p class="kanban-muted">Reassigning releases any active worker claim.</p>
    </form>
    <details v-if="detail.task.latest_summary || detail.task.result">
      <summary>Result and latest summary</summary>
      <p class="kanban-prose">{{ detail.task.latest_summary }}</p>
      <p class="kanban-prose">{{ detail.task.result }}</p>
    </details>
    <details open>
      <summary>Dependencies and linked tasks</summary>
      <div v-for="kind in ['parents', 'children'] as const" :key="kind">
        <h3>{{ kind === "parents" ? "Depends on" : "Children" }}</h3>
        <p v-if="!detail.links[kind].length" class="kanban-muted">None</p>
        <button
          v-for="id in detail.links[kind]"
          :key="id"
          class="kanban-link"
          @click="emit('select', id)"
        >
          {{ detail.link_tasks?.find((t) => t.id === id)?.title || id }} ·
          {{ detail.link_tasks?.find((t) => t.id === id)?.status }}
        </button>
      </div>
    </details>
    <details open>
      <summary>Comments ({{ detail.comments.length }})</summary>
      <article v-for="item in detail.comments" :key="item.id" class="kanban-comment">
        <p class="kanban-muted">{{ item.author }} · {{ time(item.created_at) }}</p>
        <p class="kanban-prose">{{ item.body }}</p>
      </article>
      <form class="kanban-form" @submit.prevent="addComment">
        <label
          >Comment<textarea
            v-model="comment"
            aria-label="New task comment"
            required
            rows="3"
          /></label
        ><button :disabled="busy || !comment.trim()">Add comment</button>
      </form>
    </details>
    <details v-if="detail.attachments != null" open>
      <summary>Attachments ({{ detail.attachments.length }})</summary>
      <div v-for="file in detail.attachments" :key="file.id" class="kanban-toolbar">
        <a
          class="kanban-link"
          :href="kanbanUrl('/attachments/' + encodeURIComponent(file.id), board)"
          target="_blank"
          rel="noopener"
          >{{ file.filename }}</a
        ><span class="kanban-muted">{{ file.size ?? 0 }} bytes</span
        ><button
          :disabled="busy"
          :aria-label="'Remove attachment ' + file.filename"
          @click="
            emit(
              'operation',
              '/attachments/' + encodeURIComponent(file.id),
              'DELETE',
              undefined,
              false,
            )
          "
        >
          Remove
        </button>
      </div>
      <label class="kanban-upload"
        >Attach file<input
          type="file"
          aria-label="Task attachment"
          :disabled="busy"
          @change="upload"
      /></label>
    </details>
    <details>
      <summary>Run history ({{ detail.runs.length }})</summary>
      <p v-if="!detail.runs.length" class="kanban-muted">No runs yet.</p>
      <article v-for="run in detail.runs" :key="run.id" class="kanban-comment">
        <h3>Run {{ run.id }} · {{ run.profile }} · {{ run.outcome || run.status }}</h3>
        <p class="kanban-prose">{{ run.summary }}</p>
        <p v-if="run.error" class="kanban-prose">{{ run.error }}</p>
      </article>
    </details>
    <details>
      <summary>Worker log</summary>
      <p v-if="!log?.exists" class="kanban-muted">No worker log yet.</p>
      <template v-else
        ><p v-if="log.truncated" class="kanban-muted">Showing the last 16 KiB.</p>
        <pre>{{ log.content }}</pre>
      </template>
    </details>
    <details>
      <summary>Activity ({{ detail.events.length }})</summary>
      <p v-for="event in detail.events" :key="event.id" class="kanban-muted">
        {{ event.kind }} · {{ time(event.created_at) }}
      </p>
    </details>
    <details>
      <summary>Delete task</summary>
      <p>Delete this task permanently?</p>
      <button v-if="!confirmDelete" @click="confirmDelete = true">Delete task…</button
      ><button v-else :disabled="busy" @click="operation('', 'DELETE', undefined)">
        Confirm delete task
      </button>
    </details>
  </section>
</template>
