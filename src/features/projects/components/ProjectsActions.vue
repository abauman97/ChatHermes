<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useProjects } from "../context";
const route = useRoute();
const archivedProjects = computed(() => route.query.archived === "1");
const { showProjects, hideAutomaticProjects, toggleAutomaticProjects } = useProjects();
</script>
<template>
  <button
    class="projects-filter-action"
    role="menuitemradio"
    :aria-checked="!archivedProjects"
    @click="showProjects(false)"
  >
    <span>Active projects</span>
    <span aria-hidden="true">{{ !archivedProjects ? "✓" : "" }}</span>
  </button>
  <button
    class="projects-filter-action"
    role="menuitemradio"
    :aria-checked="archivedProjects"
    @click="showProjects(true)"
  >
    <span>Archived projects</span>
    <span aria-hidden="true">{{ archivedProjects ? "✓" : "" }}</span>
  </button>
  <button
    class="projects-filter-action"
    role="menuitemcheckbox"
    :aria-checked="hideAutomaticProjects"
    @click="toggleAutomaticProjects"
  >
    <span>Hide automatic projects</span>
    <span aria-hidden="true">{{ hideAutomaticProjects ? "✓" : "" }}</span>
  </button>
</template>
