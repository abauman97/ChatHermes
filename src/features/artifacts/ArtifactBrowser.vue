<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import ArtifactAttachment from "./ArtifactAttachment.vue";
import { artifacts, type Artifact } from "./service";
const props = defineProps<{ profile: string; projectId?: string }>();
const emit = defineEmits<{ conversation: [session: string, project?: string] }>();
const rows = ref<Artifact[]>([]),
  loading = ref(false),
  error = ref(""),
  confirmation = ref<Artifact>(),
  menuFor = ref<string>(),
  deleting = ref(false);
let abort: AbortController | undefined;
async function load() {
  abort?.abort();
  const current = (abort = new AbortController());
  loading.value = true;
  error.value = "";
  rows.value = [];
  try {
    const seen = new Map<string, Artifact>();
    for (let offset = 0; ;) {
      const page = await artifacts.list(
        props.profile,
        { offset: String(offset), ...(props.projectId ? { project_id: props.projectId } : {}) },
        current.signal,
      );
      if (current.signal.aborted) return;
      for (const row of page.artifacts)
        if (row.mime !== "application/octet-stream") seen.set(row.id, row);
      rows.value = [...seen.values()].sort((a, b) => b.created_at - a.created_at);
      if (!page.has_more) break;
      offset = page.next_offset;
    }
  } catch {
    if (!current.signal.aborted) error.value = "Could not load all artifacts. Retry to refresh.";
  } finally {
    if (!current.signal.aborted) loading.value = false;
  }
}
async function remove() {
  const row = confirmation.value;
  if (!row) return;
  deleting.value = true;
  error.value = "";
  try {
    await artifacts.remove(props.profile, row.id);
    rows.value = rows.value.filter((item) => item.id !== row.id);
    confirmation.value = undefined;
    menuFor.value = undefined;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "File deletion failed.";
  } finally {
    deleting.value = false;
  }
}
watch(() => [props.profile, props.projectId], load, { immediate: true });
onBeforeUnmount(() => abort?.abort());
</script>
<template>
  <section
    aria-label="Artifacts"
    class="min-h-0 flex-1 overflow-y-auto px-4 py-6 min-[701px]:px-10"
  >
    <div class="mx-auto w-full max-w-[1440px]">
      <div class="mb-5 flex items-center gap-3">
        <h2 class="flex-1 text-2xl">Artifacts</h2>
        <button class="rounded-xl bg-[#303030] px-4 py-3" :disabled="loading" @click="load">
          Refresh
        </button>
      </div>
      <p v-if="loading" role="status">Loading artifacts…</p>
      <p v-if="error" role="alert" class="my-3 text-[#fecaca]">
        {{ error }} <button class="underline" @click="load">Retry</button>
      </p>
      <p v-if="!loading && !rows.length && !error" class="text-[#b4b4b4]">
        No artifacts yet. Attach a file or ask Hermes to create one.
      </p>
      <div class="artifact-grid">
        <article v-for="row in rows" :key="row.id" class="artifact-card">
          <ArtifactAttachment :artifact="row" :profile="profile" tiled />
          <div class="artifact-card-details">
            <p class="text-xs leading-5 text-[#b4b4b4]">
              {{ row.direction === "uploaded" ? "Uploaded" : "Generated" }} ·
              {{ new Date(row.created_at * 1000).toLocaleString() }}
            </p>
            <p v-if="row.project_name" class="artifact-project text-sm text-[#b4b4b4]">
              {{ row.project_name }}
            </p>
            <div class="artifact-card-actions">
              <button
                class="artifact-conversation min-w-0 flex-1 truncate text-left text-sm"
                :title="row.session_title || 'Open conversation'"
                :aria-label="`Open conversation: ${row.session_title || row.name}`"
                @click="emit('conversation', row.session_id, row.project_id)"
              >
                {{ row.session_title || "Open conversation" }}</button
              ><div class="artifact-menu-wrap">
                <button type="button" class="artifact-menu-trigger" :aria-label="'More actions for ' + row.name" :aria-expanded="menuFor === row.id" aria-haspopup="menu" @click="menuFor = menuFor === row.id ? undefined : row.id">⋯</button>
                <div v-if="menuFor === row.id" role="menu" class="artifact-menu">
                  <button role="menuitem" @click="menuFor = undefined; emit('conversation', row.session_id, row.project_id)">View session</button>
                  <button v-if="row.can_delete" role="menuitem" @click="menuFor = undefined; confirmation = row">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
      <div
        v-if="confirmation"
        role="alertdialog"
        aria-modal="true"
        aria-label="Delete artifact"
        class="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
      >
        <div class="w-full max-w-md rounded-2xl bg-[#303030] p-6">
          <h3 class="text-xl">Delete {{ confirmation.name }}?</h3>
          <p class="my-4">
            This removes the file from Hermes. Messages that reference it remain. Some remote
            backends do not support deletion.
          </p>
          <p v-if="error" role="alert" class="mb-4 text-[#fecaca]">{{ error }}</p>
          <div class="flex gap-4">
            <button
              class="rounded-xl bg-[#424242] px-4 py-3"
              :disabled="deleting"
              @click="confirmation = undefined"
            >
              Cancel</button
            ><button class="rounded-xl bg-[#7f1d1d] px-4 py-3" :disabled="deleting" @click="remove">
              {{ deleting ? "Deleting…" : "Delete file" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.artifact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
@media (min-width: 701px) {
  .artifact-grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  }
}
.artifact-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #3a3a3a;
  border-radius: 20px;
  background: #292929;
}
.artifact-menu-wrap { position: relative; flex: 0 0 auto; }
.artifact-menu-trigger { width: 44px; font-size: 24px; }
.artifact-menu { position: absolute; z-index: 10; right: 0; bottom: 100%; min-width: 150px; padding: 6px; border: 1px solid #454545; border-radius: 12px; background: #202020; box-shadow: 0 8px 24px #0008; }
.artifact-menu button { display: block; width: 100%; min-height: 44px; padding: 8px 12px; text-align: left; border-radius: 8px; }
.artifact-menu button:hover { background: #383838; }
.artifact-menu-wrap { position: relative; flex: 0 0 auto; }
.artifact-menu-trigger { width: 44px; font-size: 24px; }
.artifact-menu { position: absolute; z-index: 10; right: 0; bottom: 100%; min-width: 150px; padding: 6px; border: 1px solid #454545; border-radius: 12px; background: #202020; box-shadow: 0 8px 24px #0008; }
.artifact-menu button { display: block; width: 100%; min-height: 44px; padding: 8px 12px; text-align: left; border-radius: 8px; }
.artifact-menu button:hover { background: #383838; }
.artifact-card:focus-within {
  border-color: #888;
}
.artifact-card-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px 8px;
}
.artifact-project {
  overflow-wrap: anywhere;
}
.artifact-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 4px;
}
.artifact-card-actions button {
  min-height: 44px;
}
.artifact-conversation:hover {
  text-decoration: underline;
}
.artifact-card :deep(:is(button, a):focus-visible) {
  outline: 2px solid #b4b4b4;
  outline-offset: -2px;
  border-radius: 8px;
}
</style>
