<script setup lang="ts">
import ProjectList from "../components/ProjectList.vue";
import { useProjects } from "../context";
import { computed } from "vue";
import { useRoute } from "vue-router";
const {
  projects,
  projectsLoading,
  projectsError,
  manageError,
  projectBusy,
  offline,
  chooseProject,
  loadProjects,
  manageProject,
} = useProjects();
const route = useRoute();
const archived = computed(() => route.query.archived === "1");
</script>
<template>
  <ProjectList
    :projects="projects"
    :archived="archived"
    :loading="projectsLoading"
    :error="projectsError || manageError"
    :busy="projectBusy"
    :offline="offline"
    @select="chooseProject"
    @retry="loadProjects"
    @manage="manageProject"
  />
</template>
