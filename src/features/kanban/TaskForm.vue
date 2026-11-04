<script setup lang="ts">
import { ref } from "vue";
import type { Task } from "./types";
const props = defineProps<{
  task?: Task;
  assignees: string[];
  busy: boolean;
}>();
const emit = defineEmits<{ save: [patch: Record<string, unknown>]; cancel: [] }>();
const title = ref(props.task?.title || ""),
  body = ref(props.task?.body || "");
const priority = ref(props.task?.priority || 0),
  assignee = ref(props.task?.assignee || "");
const model = ref(props.task?.model_override || ""),
  provider = ref(props.task?.provider_override || ""),
  effort = ref(props.task?.reasoning_effort || "");
const triage = ref(false);
function save() {
  if (!title.value.trim()) return;
  emit("save", {
    title: title.value.trim(),
    body: body.value,
    priority: priority.value,
    // Reassignment of an existing task uses the dedicated reclaim-aware API.
    ...(!props.task ? { assignee: assignee.value || null, triage: triage.value } : {}),
    ...(model.value.trim()
      ? { model_override: model.value.trim(), provider_override: provider.value.trim() || null }
      : props.task
        ? { clear_model_override: true }
        : {}),
    ...(effort.value
      ? { reasoning_effort: effort.value }
      : props.task
        ? { clear_reasoning_effort: true }
        : {}),
  });
}
</script>
<template>
  <form class="kanban-form" @submit.prevent="save">
    <label>Title<input v-model="title" required aria-label="Task title" /></label>
    <label>Description<textarea v-model="body" rows="4" aria-label="Task description" /></label>
    <label
      >Priority<input v-model.number="priority" type="number" step="1" aria-label="Task priority"
    /></label>
    <label v-if="!task"
      >Assignee<select v-model="assignee" aria-label="Task assignee">
        <option value="">Unassigned</option>
        <option v-for="name in assignees" :key="name" :value="name">{{ name }}</option>
      </select></label
    >
    <label v-if="!task" class="kanban-inline"
      ><input v-model="triage" type="checkbox" />Start in triage</label
    >
    <details>
      <summary>Worker overrides</summary>
      <p class="kanban-muted">
        Blank values inherit the assigned profile. Overrides apply to the next worker run.
      </p>
      <label>Model override<input v-model="model" aria-label="Task model override" /></label>
      <label
        >Provider override<input v-model="provider" aria-label="Task provider override"
      /></label>
      <label
        >Reasoning effort<select v-model="effort" aria-label="Task reasoning effort">
          <option value="">Inherit profile</option>
          <option
            v-for="level in ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra']"
            :key="level"
            :value="level"
          >
            {{ level }}
          </option>
        </select></label
      >
    </details>
    <div class="kanban-toolbar">
      <button :disabled="busy || !title.trim()" type="submit">
        {{ task ? "Save task" : "Create task" }}</button
      ><button type="button" :disabled="busy" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
