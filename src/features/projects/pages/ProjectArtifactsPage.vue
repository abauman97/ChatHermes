<script setup lang="ts">
import ProjectLayout from "../components/ProjectLayout.vue";
import ArtifactBrowser from "../../artifacts/components/ArtifactBrowser.vue";
import { usePageHeader } from "../../../composables/usePageHeader";
import { useProjects } from "../context";
const { selectedProject, profile, visibleSessions, recentSession } = useProjects();
usePageHeader(() => ({ title: "Projects", subtitle: selectedProject.value?.label }));
</script>
<template>
  <ProjectLayout
    ><ArtifactBrowser
      v-if="selectedProject"
      :project="selectedProject"
      :profile="profile"
      :sessions="visibleSessions"
      @open-session="recentSession"
  /></ProjectLayout>
</template>
