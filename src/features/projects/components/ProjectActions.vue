<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProjects } from "../context";
import { projectRoot } from "../utils/projects";
const {
  selectedProject,
  profile,
  projectId,
  projectBusy,
  offline,
  manageProject,
  openProjectDraft,
  creating,
  projectConfirmation,
} = useProjects();
const router = useRouter();
function openProjectPage(page: "edit" | "instructions") {
  return router.push({
    name: page === "edit" ? "project-settings" : "project-instructions",
    params: { projectId: projectId.value },
    query: profile.value ? { profile: profile.value } : {},
  });
}
function confirmProject(action: "delete" | "archive") {
  projectConfirmation.value = action;
}
</script>
<template>
  <template v-if="selectedProject && !selectedProject.isNoProject">
    <button
      v-if="selectedProject && !selectedProject.isNoProject"
      class="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]"
      role="menuitem"
      :disabled="
        offline ||
        creating ||
        !selectedProject ||
        selectedProject.archived ||
        !projectRoot(selectedProject)
      "
      @click="openProjectDraft()"
    >
      New Project Chat
    </button>

    <button role="menuitem" @click="openProjectPage('edit')">Edit project</button>
    <button
      role="menuitem"
      :disabled="offline || !projectRoot(selectedProject)"
      @click="openProjectPage('instructions')"
    >
      Edit Instructions
    </button>
    <template v-if="!selectedProject.isAuto">
      <button
        v-if="selectedProject.archived"
        role="menuitem"
        :disabled="projectBusy || offline"
        @click="manageProject('archive', { id: projectId, restore: true })"
      >
        Restore project
      </button>
      <button
        v-else
        role="menuitem"
        :disabled="projectBusy || offline"
        @click="confirmProject('archive')"
      >
        Archive project
      </button>
      <button
        class="project-danger"
        role="menuitem"
        :disabled="projectBusy || offline"
        @click="confirmProject('delete')"
      >
        Delete project
      </button>
    </template>
  </template>
</template>
