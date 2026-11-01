<script setup lang="ts">
import { computed, ref } from "vue";
import type { Project, ProjectAction } from "../../../types/hermes";
const props = defineProps<{
  projects: Project[];
  archived: boolean;
  loading: boolean;
  error: string;
  busy: boolean;
  offline: boolean;
}>();
const emit = defineEmits<{
  select: [id: string];
  retry: [];
  manage: [action: ProjectAction, fields: Record<string, string | boolean>];
}>();
const rows = computed(() =>
  props.projects.filter((p) => !p.isNoProject && !!p.archived === props.archived),
);
const adding = ref(false),
  name = ref(""),
  path = ref("");
function create() {
  if (name.value.trim())
    emit("manage", "create", {
      name: name.value.trim(),
      ...(path.value.trim() ? { primary_path: path.value.trim() } : {}),
    });
}
</script>
<template>
  <section class="projects-page page-content" aria-label="Projects">
    <div class="page-heading">
      <h2>Projects</h2>
      <button
        v-if="!archived"
        class="project-button"
        :disabled="busy || offline"
        @click="adding = !adding"
      >
        New project
      </button>
    </div>
    <p v-if="archived" class="project-muted">Archived projects</p>
    <form v-if="adding && !archived" class="project-form" @submit.prevent="create">
      <label>Project name<input v-model="name" required maxlength="160" autofocus /></label>
      <label>Folder (optional)<input v-model="path" placeholder="/path/on/hermes/server" /></label>
      <div class="project-actions">
        <button class="project-button" :disabled="busy || offline || !name.trim()">
          Create project</button
        ><button type="button" class="project-button" :disabled="busy" @click="adding = false">
          Cancel
        </button>
      </div>
    </form>
    <p v-if="error" role="alert" class="project-error">
      {{ error }} <button class="underline" @click="emit('retry')">Retry Projects</button>
    </p>
    <p v-if="loading" role="status" class="project-muted">Loading Projects…</p>
    <p v-else-if="!rows.length" class="project-muted">
      {{ archived ? "No archived projects." : "No projects yet." }}
    </p>
    <nav class="project-list" aria-label="Project list">
      <button
        v-for="project in rows"
        :key="project.id"
        :aria-label="project.label"
        @click="emit('select', project.id)"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" />
        </svg>
        <span
          ><strong>{{ project.label }}</strong
          ><small>{{
            project.archived
              ? "Archived"
              : project.isAuto
                ? "Discovered workspace"
                : `${project.sessionCount} ${project.sessionCount === 1 ? "chat" : "chats"}`
          }}</small></span
        ><span aria-hidden="true">›</span>
      </button>
    </nav>
  </section>
</template>
