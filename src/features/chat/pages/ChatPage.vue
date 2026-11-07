<script setup lang="ts">
import ChatConversation from "../components/ChatConversation.vue";
import { useChat } from "../context";
import { useProjects } from "../../projects/context";
import { usePageHeader } from "../../../composables/usePageHeader";
const { sessions, scope } = useChat();
const { projectId, selectedProject } = useProjects();
usePageHeader(() => ({
  title: sessions.value.find((row) => row.id === scope.session.value)?.title || "Conversation",
  subtitle: projectId.value ? selectedProject.value?.label : undefined,
}));
</script>
<template><ChatConversation /></template>
