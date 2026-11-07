<script setup lang="ts">
import ProjectSettings from "../components/ProjectSettings.vue";
import { usePageHeader } from "../../../composables/usePageHeader";
import { useProjects } from "../context";
const {
  profile,
  projectId,
  selectedProject,
  projectBusy,
  offline,
  manageError,
  manageProject,
  chooseProject,
  projectLoading,
  projectError,
  loadProject,
} = useProjects();
usePageHeader(() => ({ title: "Projects", subtitle: selectedProject.value?.label }));
</script>
<template>
  <section class="page-content project-editor" aria-label="Edit project">
    <button class="project-back" @click="chooseProject(projectId)">
      ← {{ selectedProject?.label || "Project" }}
    </button>
    <h2 class="text-2xl font-semibold">Edit project</h2>
    <p v-if="projectLoading" role="status">Loading Project…</p>
    <p v-if="projectError" role="alert">
      {{ projectError }} <button @click="loadProject">Retry Project</button>
    </p>
    <ProjectSettings
      v-if="selectedProject"
      :key="JSON.stringify([profile, selectedProject.id])"
      :project="selectedProject"
      :busy="projectBusy"
      :offline="offline"
      :error="manageError"
      @manage="manageProject"
    />
  </section>
</template>
