<script setup lang="ts">
import ProjectLayout from "../components/ProjectLayout.vue";
import { usePageHeader } from "../../../composables/usePageHeader";
import { useProjects } from "../context";
import { projectRoot } from "../utils/projects";
const { selectedProject, visibleSessions, chooseSession, chooseProject } = useProjects();
usePageHeader(() => ({ title: selectedProject.value?.label || "Project" }));
</script>
<template>
  <ProjectLayout
    ><template v-if="selectedProject">
      <p v-if="selectedProject.archived" class="project-muted">Archived project</p>
      <p class="mb-4 break-all text-sm text-[#a3a3a3]">
        {{
          projectRoot(selectedProject)
            ? "Workspace: " + projectRoot(selectedProject)
            : selectedProject.isNoProject
              ? "No project workspace"
              : "No workspace configured"
        }}
      </p>
      <p v-if="!visibleSessions.length" class="text-sm text-[#b4b4b4]">No conversations yet.</p>
      <nav class="project-chat-list" aria-label="Project chats">
        <button
          v-for="row in visibleSessions"
          :key="row.id"
          class="project-chat-row"
          :aria-label="row.title || 'Untitled session'"
          @click="chooseSession(row.id)"
        >
          <span class="project-chat-title">{{ row.title || "Untitled session" }}</span>
          <span v-if="row.preview?.trim()" class="project-chat-preview">{{ row.preview }}</span>
        </button>
      </nav>
      <button class="project-back mt-5" @click="chooseProject('')">Other chats</button>
    </template></ProjectLayout
  >
</template>
