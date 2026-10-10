<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type { Project, ProjectAction } from "../../../types/hermes";
const props = defineProps<{ project: Project; busy: boolean; offline: boolean; error: string }>();
const emit = defineEmits<{
  manage: [action: ProjectAction, fields: Record<string, string | boolean>];
}>();
const name = ref(props.project.label),
  description = ref(props.project.description || "");
const icon = ref(props.project.icon || ""),
  color = ref(props.project.color || ""),
  board = ref(props.project.board_slug || "");
const folder = ref(""),
  folderLabel = ref(""),
  primary = ref(true);
const confirmation = ref<{
  action: ProjectAction;
  fields: Record<string, string | boolean>;
  text: string;
}>();
const cancelButton = ref<HTMLButtonElement>(),
  settings = ref<HTMLElement>();
watch(
  () => props.busy,
  (busy, before) => {
    if (before && !busy && !props.error) dismiss();
  },
);
watch(
  () => props.project.label,
  (value) => {
    name.value = value;
  },
);
function manage(action: ProjectAction, fields: Record<string, string | boolean> = {}) {
  emit("manage", action, { id: props.project.id, ...fields });
}
async function confirm(
  action: ProjectAction,
  fields: Record<string, string | boolean>,
  text: string,
) {
  confirmation.value = { action, fields, text };
  await nextTick();
  cancelButton.value?.focus();
}
function dismiss() {
  confirmation.value = undefined;
  settings.value?.focus();
}
function submitConfirmation() {
  const item = confirmation.value;
  if (item) manage(item.action, item.fields);
}
</script>
<template>
  <div v-if="project.isAuto" class="project-settings">
    <p class="project-muted">
      Save this discovered workspace as a project to manage its name and folders.
    </p>
    <button
      class="project-button"
      :disabled="busy || offline"
      @click="
        emit('manage', 'create', {
          name: project.label,
          primary_path: project.path || project.repos.find((r) => r.path)?.path || '',
        })
      "
    >
      Save project
    </button>
  </div>
  <div v-else-if="!project.isNoProject" ref="settings" tabindex="-1" class="project-settings">
    <p v-if="error" class="project-error" role="alert">{{ error }}</p>
    <p v-if="busy" class="project-muted" role="status">Saving project…</p>
    <form
      class="project-form"
      @submit.prevent="
        manage('update', { name: name.trim(), description, icon, color, board_slug: board })
      "
    >
      <fieldset :disabled="busy || offline">
        <label>Project name<input v-model="name" required maxlength="160" /></label>
        <label>Description<textarea v-model="description" maxlength="4096" rows="2" /></label>
        <div class="project-field-row">
          <label>Icon<input v-model="icon" maxlength="64" /></label
          ><label>Color<input v-model="color" maxlength="64" placeholder="#94c9a5" /></label>
        </div>
        <label>Board slug (optional)<input v-model="board" maxlength="160" /></label>
        <button class="project-button" :disabled="!name.trim()">Save changes</button>
      </fieldset>
    </form>
    <h3>Folders</h3>
    <p class="project-muted">
      The primary folder is used for new chats. Existing chats keep their workspace.
    </p>
    <p v-if="!project.folders?.length" class="project-muted">No folders configured.</p>
    <ul class="project-folders">
      <li v-for="item in project.folders" :key="item.path">
        <span class="folder-path"
          >{{ item.label || item.path }}<small v-if="item.label">{{ item.path }}</small
          ><small v-if="item.is_primary">Primary folder</small></span
        >
        <div class="project-actions">
          <button
            v-if="!item.is_primary"
            class="project-button"
            :disabled="busy || offline"
            @click="manage('set_primary', { path: item.path })"
          >
            Make primary</button
          ><button
            class="project-button"
            :disabled="busy || offline"
            :aria-label="`Remove folder ${item.path}`"
            @click="
              confirm(
                'remove_folder',
                { path: item.path },
                `Remove ${item.path} from this project? The folder and existing chats will be kept.`,
              )
            "
          >
            Remove
          </button>
        </div>
      </li>
    </ul>
    <form
      class="project-form"
      @submit.prevent="
        manage('add_folder', {
          path: folder.trim(),
          label: folderLabel.trim(),
          is_primary: primary,
        })
      "
    >
      <fieldset :disabled="busy || offline">
        <label
          >Folder path<input
            v-model="folder"
            required
            placeholder="/path/on/hermes/server"
            maxlength="4096"
        /></label>
        <label>Folder label (optional)<input v-model="folderLabel" maxlength="160" /></label>
        <label class="project-checkbox"
          ><input v-model="primary" type="checkbox" /> Use as primary folder</label
        >
        <button class="project-button" :disabled="!folder.trim()">Add folder</button>
      </fieldset>
    </form>
    <div
      v-if="confirmation"
      class="project-confirmation"
      role="alertdialog"
      aria-modal="false"
      aria-labelledby="project-confirm-text"
      @keydown.esc.prevent="!busy && dismiss()"
    >
      <p id="project-confirm-text">{{ confirmation.text }}</p>
      <div class="project-actions">
        <button ref="cancelButton" class="project-button" :disabled="busy" @click="dismiss">
          Cancel</button
        ><button
          class="project-button project-danger"
          :disabled="busy || offline"
          @click="submitConfirmation"
        >
          Confirm removal
        </button>
      </div>
    </div>
  </div>
</template>
