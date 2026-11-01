<script setup lang="ts">
import ArtifactBrowser from "../components/ArtifactBrowser.vue";
import { useArtifacts } from "../context";
const { profile, projects, recentSession } = useArtifacts();
</script>
<template>
  <ArtifactBrowser :profile="profile" :projects="projects" @open-session="recentSession" />
</template>
