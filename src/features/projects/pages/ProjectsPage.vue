<script setup lang="ts">
import ProjectList from "../components/ProjectList.vue";
import { useProjects } from "../context";
import { computed } from "vue";
import { useRoute } from "vue-router";
const {
  projects,
  hideAutomaticProjects,
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
const listedProjects = computed(() =>
  projects.value.filter((project) => !hideAutomaticProjects.value || !project.isAuto),
);
</script>
<template>
  <ProjectList
    :projects="listedProjects"
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
