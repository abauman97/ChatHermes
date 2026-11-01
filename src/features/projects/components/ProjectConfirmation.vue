<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { useProjects } from "../context";
const {
  projectConfirmation,
  selectedProject,
  projectBusy,
  offline,
  manageError,
  manageProject,
  projectId,
} = useProjects();
const projectConfirmCancel = ref<HTMLButtonElement>();
watch(projectConfirmation, async () => {
  await nextTick();
  projectConfirmCancel.value?.focus();
});
function dismissProjectConfirmation() {
  projectConfirmation.value = undefined;
  document.querySelector<HTMLButtonElement>('[aria-label="Screen options"]')?.focus();
}
async function submitProjectConfirmation() {
  const action = projectConfirmation.value;
  if (!action) return;
  await manageProject(action, { id: projectId.value });
  if (!manageError.value) projectConfirmation.value = undefined;
}
</script>
<template>
  <div
    v-if="projectConfirmation && selectedProject"
    class="project-confirmation mx-6"
    role="alertdialog"
    aria-labelledby="project-confirmation-text"
    @keydown.esc.stop.prevent="!projectBusy && dismissProjectConfirmation()"
  >
    <p id="project-confirmation-text">
      {{
        projectConfirmation === "delete"
          ? `Delete ${selectedProject.label}? This permanently removes the project and its folder associations. Files and chats will be kept.`
          : `Archive ${selectedProject.label}? You can restore it from Archived projects.`
      }}
    </p>
    <p v-if="manageError" role="alert" class="project-error">{{ manageError }}</p>
    <div class="project-actions">
      <button
        ref="projectConfirmCancel"
        class="project-button"
        :disabled="projectBusy"
        @click="dismissProjectConfirmation"
      >
        Cancel</button
      ><button
        class="project-button project-danger"
        :disabled="projectBusy || offline"
        @click="submitProjectConfirmation"
      >
        {{ projectConfirmation === "delete" ? "Delete project permanently" : "Confirm archive" }}
      </button>
    </div>
  </div>
</template>
