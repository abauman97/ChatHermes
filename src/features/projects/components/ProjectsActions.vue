<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useProjects } from "../context";
const route = useRoute();
const archivedProjects = computed(() => route.query.archived === "1");
const { showProjects } = useProjects();
</script>
<template>
  <button role="menuitemradio" :aria-checked="!archivedProjects" @click="showProjects(false)">
    Active projects</button
  ><button role="menuitemradio" :aria-checked="archivedProjects" @click="showProjects(true)">
    Archived projects
  </button>
</template>
