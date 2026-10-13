<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { projectSessions } from "../../projects/utils/projects";
import type { Project, Session } from "../../../types/hermes";
const props = defineProps<{
  sessions: Session[];
  selected: string;
  loading: boolean;
  error: string;
  hasMore: boolean;
  busy: boolean;
  heading?: string;
  projects?: Project[];
}>();
const emit = defineEmits<{
  select: [id: string];
  create: [];
  more: [];
  retry: [];
  rename: [id: string, title: string];
  archive: [id: string];
  delete: [id: string];
  project: [id: string, projectId: string];
}>();
// Membership comes from Hermes's project tree, never a guessed cwd match.
const projectNames = computed(() => {
  const names = new Map<string, string>();
  for (const project of props.projects || []) {
    if (project.isNoProject) continue;
    const ids = [
      ...(project.sessionIds || []),
      ...projectSessions(project).map((session) => session.id),
    ];
    for (const id of ids) names.set(id, project.label);
  }
  return names;
});
function sessionSource(session: Session) {
  const name = projectNames.value.get(session.id);
  return [session.source || "Hermes", name].filter(Boolean).join(" · ");
}
const editing = ref("");
const title = ref("");
function edit(session: Session) {
  editing.value = session.id;
  title.value = session.title || "";
}
function save() {
  if (title.value.trim()) emit("rename", editing.value, title.value.trim());
  editing.value = "";
}
const popup = ref<HTMLDialogElement>();
const chosen = ref<Session>();
const mode = ref<"menu" | "project" | "delete">("menu");
const projectId = ref("");
const position = ref({ left: "0px", top: "0px" });
const availableProjects = computed(() =>
  (props.projects || []).filter(
    (project) =>
      !project.archived &&
      !project.isNoProject &&
      (project.path || project.repos.some((repo) => repo.path)),
  ),
);
async function openMenu(session: Session, event: MouseEvent) {
  chosen.value = session;
  mode.value = "menu";
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
  position.value = {
    left: `${Math.max(12, Math.min(box.right - 208, window.innerWidth - 220))}px`,
    top: `${Math.max(12, Math.min(box.bottom, window.innerHeight - 240))}px`,
  };
  await nextTick();
  popup.value?.showModal();
}
function closeMenu() {
  popup.value?.close();
}
function menuRename() {
  if (chosen.value) edit(chosen.value);
  closeMenu();
}
function menuArchive() {
  if (chosen.value) emit("archive", chosen.value.id);
  closeMenu();
}
function move() {
  if (chosen.value && projectId.value) emit("project", chosen.value.id, projectId.value);
  closeMenu();
}
function remove() {
  if (chosen.value) emit("delete", chosen.value.id);
  closeMenu();
}
</script>
<template>
  <h2 class="session-head mt-4 mb-1 shrink-0 px-2.5 text-xs font-semibold text-[#a3a3a3]">
    {{ heading || "Recents" }}
  </h2>
  <p
    v-if="error"
    class="notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]"
    role="alert"
  >
    {{ error }} <button class="underline" @click="emit('retry')">Retry</button>
  </p>
  <p
    v-if="loading && !sessions.length"
    class="muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
  >
    Loading sessions…
  </p>
  <p
    v-else-if="!sessions.length"
    class="muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
  >
    No conversations yet.
  </p>
  <nav
    v-else
    aria-label="Sessions"
    class="session-list grid min-h-0 flex-1 auto-rows-max gap-0.5 overflow-y-auto"
  >
    <div
      v-for="session in sessions"
      :key="session.id"
      class="session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]"
      :class="selected === session.id ? 'active bg-[#303030] dark:bg-[#303030]' : ''"
    >
      <template v-if="editing === session.id">
        <input
          v-model="title"
          aria-label="Session title"
          maxlength="160"
          class="min-w-0 flex-1 rounded-md border border-[#424242] bg-[#303030] p-2 text-base text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] dark:bg-[#303030] dark:text-white"
          @keydown.enter="save"
          @keydown.esc="editing = ''"
        />
        <button
          aria-label="Save title"
          class="rounded-md px-2 py-2 text-sm text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          @click="save"
        >
          Save
        </button>
      </template>
      <template v-else>
        <button
          class="session-select grid min-h-[44px] min-w-0 flex-1 gap-0 px-2.5 py-1.5 text-left text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          :aria-current="selected === session.id ? 'page' : undefined"
          @click="emit('select', session.id)"
        >
          <span class="truncate">{{ session.title || "Untitled session" }}</span
          ><span
            class="truncate text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]"
            :title="sessionSource(session)"
            >{{ sessionSource(session) }}</span
          >
        </button>
        <button
          class="icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          :aria-label="`Options for ${session.title || 'Untitled session'}`"
          aria-haspopup="dialog"
          :disabled="busy"
          @click="openMenu(session, $event)"
        >
          ⋮
        </button>
      </template>
    </div>
  </nav>
  <button
    v-if="hasMore"
    class="load-more self-start rounded-md px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55"
    :disabled="loading"
    @click="emit('more')"
  >
    {{ loading ? "Loading…" : "Load more" }}
  </button>
  <dialog
    ref="popup"
    class="session-popup fixed m-0 w-52 rounded-xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl backdrop:bg-transparent"
    :style="position"
    :aria-label="
      mode === 'menu'
        ? 'Session options'
        : mode === 'project'
          ? 'Add to project'
          : 'Delete conversation'
    "
    @click="$event.target === $event.currentTarget && closeMenu()"
  >
    <div v-if="mode === 'menu'" class="grid gap-1">
      <button class="rounded-lg px-3 py-2 text-left hover:bg-[#303030]" @click="menuRename">
        Rename
      </button>
      <button
        class="rounded-lg px-3 py-2 text-left hover:bg-[#303030]"
        @click="
          mode = 'project';
          projectId = '';
        "
      >
        Add to project
      </button>
      <button class="rounded-lg px-3 py-2 text-left hover:bg-[#303030]" @click="menuArchive">
        Archive
      </button>
      <button
        class="rounded-lg px-3 py-2 text-left text-[#fecaca] hover:bg-[#303030]"
        @click="mode = 'delete'"
      >
        Delete
      </button>
    </div>
    <form v-else-if="mode === 'project'" class="grid gap-3 p-1" @submit.prevent="move">
      <label for="session-project">Add to project</label>
      <select
        id="session-project"
        v-model="projectId"
        class="min-w-0 rounded-md bg-[#303030] p-2 text-base"
      >
        <option value="" disabled>Choose project</option>
        <option v-for="project in availableProjects" :key="project.id" :value="project.id">
          {{ project.label }}
        </option>
      </select>
      <p v-if="!availableProjects.length" class="text-sm text-[#a3a3a3]">No projects available.</p>
      <button
        class="rounded-lg bg-[#303030] px-3 py-2 disabled:opacity-55"
        :disabled="!projectId || busy"
      >
        Add
      </button>
      <button type="button" class="rounded-lg px-3 py-2 hover:bg-[#303030]" @click="closeMenu">
        Cancel
      </button>
    </form>
    <div v-else class="grid gap-3 p-1">
      <p>Delete this conversation? This cannot be undone.</p>
      <button class="rounded-lg px-3 py-2 hover:bg-[#303030]" autofocus @click="closeMenu">
        Cancel
      </button>
      <button
        class="rounded-lg bg-[#402b2b] px-3 py-2 text-[#fecaca]"
        :disabled="busy"
        @click="remove"
      >
        Delete conversation
      </button>
    </div>
  </dialog>
</template>
