<script setup lang="ts">
import ProjectInstructions from "../components/ProjectInstructions.vue";
import { useProjects } from "../context";
const {
  profile,
  projectId,
  selectedProject,
  offline,
  chooseProject,
  projectLoading,
  projectError,
  loadProject,
} = useProjects();
</script>
<template>
  <section class="page-content project-editor" aria-label="Edit Instructions">
    <button class="project-back" @click="chooseProject(projectId)">
      ← {{ selectedProject?.label || "Project" }}
    </button>
    <h2 class="text-2xl font-semibold">Edit Instructions</h2>
    <p v-if="projectLoading" role="status">Loading Project…</p>
    <p v-if="projectError" role="alert">
      {{ projectError }} <button @click="loadProject">Retry Project</button>
    </p>
    <ProjectInstructions
      v-if="selectedProject"
      :key="JSON.stringify([profile, selectedProject.id])"
      :profile="profile"
      :project-id="selectedProject.id"
      :offline="offline"
    />
  </section>
</template>
