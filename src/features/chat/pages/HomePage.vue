<script setup lang="ts">
import InboxList from "../../inbox/components/InboxList.vue";
import { useInbox } from "../../inbox/context";
import { useProjects } from "../../projects/context";
import { usePageHeader } from "../../../composables/usePageHeader";
import { useRoute } from "vue-router";
const { profile, inboxRevision, openInboxItem, refreshInbox } = useInbox();
const route = useRoute();
const { selectedProject, projectError, projectLoading, loadProject } = useProjects();
usePageHeader(() => ({
  title: route.query.project ? "New chat" : "ChatHermes",
  subtitle: selectedProject.value?.label,
}));
</script>
<template>
  <div
    v-if="route.query.project"
    class="min-h-0 flex-1 overflow-y-auto break-words px-5 py-4 text-sm text-[#b4b4b4]"
  >
    <p v-if="projectError" role="alert">
      {{ projectError }} <button @click="loadProject()">Retry</button>
    </p>
    <p v-else-if="projectLoading" role="status">Loading project…</p>
    <p v-else-if="selectedProject">New chat in {{ selectedProject.label }}</p>
  </div>
  <InboxList
    v-else
    preview
    scope="all"
    :profile="profile"
    :revision="inboxRevision"
    :open-item="openInboxItem"
    @refresh="refreshInbox"
  />
</template>
