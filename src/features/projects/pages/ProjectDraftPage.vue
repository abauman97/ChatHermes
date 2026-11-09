<script setup lang="ts">
import ChatConversation from "../../chat/components/ChatConversation.vue";
import { usePageHeader } from "../../../composables/usePageHeader";
import { useProjects } from "../context";
const { selectedProject, projectLoading, projectError, loadProject } = useProjects();
usePageHeader(() => ({ title: "New chat", subtitle: selectedProject.value?.label }));
</script>
<template>
  <p v-if="projectLoading" class="px-6 py-3 text-sm text-[#b4b4b4]" role="status">
    Loading Project…
  </p>
  <p v-if="projectError" class="px-6 py-3 text-sm text-[#fecaca]" role="alert">
    {{ projectError }} <button class="underline" @click="loadProject">Retry Project</button>
  </p>
  <ChatConversation />
</template>
