<script setup lang="ts">
import { ref } from "vue";
import type { Session } from "../../../types/hermes";
defineProps<{
  sessions: Session[];
  selected: string;
  loading: boolean;
  error: string;
  hasMore: boolean;
  busy: boolean;
  heading?: string;
}>();
const emit = defineEmits<{
  select: [id: string];
  create: [];
  more: [];
  retry: [];
  rename: [id: string, title: string];
}>();
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
          ><span class="text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]">{{
            session.source || "Hermes"
          }}</span>
        </button>
        <button
          class="icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
          :aria-label="`Rename ${session.title || 'Untitled session'}`"
          @click="edit(session)"
        >
          ✎
        </button>
      </template>
    </div>
  </nav>
  <button
    v-if="hasMore"
    class="load-more rounded-lg border border-[#424242] px-3 py-2 text-sm text-white hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-55 dark:border-[#424242]"
    :disabled="loading"
    @click="emit('more')"
  >
    {{ loading ? "Loading…" : "Load more" }}
  </button>
</template>
