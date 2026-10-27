<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { api } from "../../../services/hermes-api";
import type { Project, Session } from "../../../types/hermes";
import { type Artifact } from "../artifacts";
import ArtifactCard from "./ArtifactCard.vue";
const props = defineProps<{
  profile: string;
  sessions?: Session[];
  projects?: Project[];
  project?: Project;
}>();
const emit = defineEmits<{ openSession: [id: string] }>();
const files = ref<Artifact[]>([]),
  loading = ref(false),
  error = ref("");
const deletion = ref<Artifact>(),
  deleting = ref(false);
const confirmation = ref<HTMLDialogElement>();
watch(deletion, async (file) => {
  await nextTick();
  if (file) confirmation.value?.showModal();
  else confirmation.value?.close();
});
const nextCursor = ref<string | null>(null);
let controller: AbortController | undefined;
async function load(more = false) {
  controller?.abort();
  const current = (controller = new AbortController());
  loading.value = true;
  if (!more) {
    files.value = [];
    nextCursor.value = null;
  }
  error.value = "";
  deletion.value = undefined;
  try {
    const result = await api.artifacts(
      props.profile,
      props.project?.id,
      more ? nextCursor.value || undefined : undefined,
      current.signal,
    );
    if (current.signal.aborted) return;
    // Reconciliation may update ordering between pages. Keep each card once.
    const combined = more ? [...files.value, ...result.files] : result.files;
    files.value = combined.filter(
      (file, index) =>
        combined.findIndex(
          (item) => item.sessionId === file.sessionId && item.path === file.path,
        ) === index,
    );
    nextCursor.value = result.nextCursor;
  } catch {
    if (!current.signal.aborted) error.value = "Could not load artifacts.";
  } finally {
    if (controller === current) loading.value = false;
  }
}
async function remove() {
  const file = deletion.value;
  if (!file?.sessionId || deleting.value) return;
  const owner = controller;
  deleting.value = true;
  try {
    const query = new URLSearchParams({
      path: file.path,
      session_id: file.sessionId,
      profile: props.profile || "default",
    });
    const response = await fetch(`/api/plugins/chathermes/files?${query}`, {
      method: "DELETE",
      credentials: "same-origin",
      redirect: "error",
    });
    if (!response.ok) throw new Error();
    if (owner !== controller) return;
    files.value = files.value.filter((item) => item.path !== file.path);
    deletion.value = undefined;
  } catch {
    if (owner === controller)
      error.value =
        "Hermes could not delete this file. It may be outside the managed files area or deletion may be unsupported.";
  } finally {
    deleting.value = false;
  }
}
watch(
  () => [props.profile, props.project?.id],
  () => load(),
  { immediate: true },
);
onBeforeUnmount(() => controller?.abort());
</script>
<template>
  <section class="min-h-0 flex-1 overflow-y-auto px-5 py-6" aria-label="Artifacts">
    <div class="mx-auto max-w-[1100px]">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-xl font-medium">Artifacts</h2>
        <button class="text-sm underline" :disabled="loading" @click="load()">Refresh</button>
      </div>
      <p v-if="loading" role="status" class="text-sm text-[#b4b4b4]">Loading artifacts…</p>
      <p v-if="error" role="alert" class="mb-4 text-sm text-red-200">{{ error }}</p>
      <p v-if="!loading && !files.length" class="text-sm text-[#b4b4b4]">No artifacts found.</p>
      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-4 [&>.artifact-card]:my-0"
      >
        <ArtifactCard
          v-for="file in files"
          :key="`${file.sessionId}:${file.path}`"
          :file="file"
          :profile="profile"
        >
          <template #footer>
            <div class="border-t border-[#424242] px-3 py-2 text-xs text-[#b4b4b4]">
              <span v-if="file.projectTitle" class="mb-1 block truncate">{{
                file.projectTitle
              }}</span>
              <div class="flex min-w-0 items-center gap-3">
                <span class="shrink-0">{{
                  file.direction === "uploaded" ? "Uploaded" : "Generated"
                }}</span>
                <button
                  type="button"
                  class="min-w-0 flex-1 truncate py-2 text-left underline"
                  :title="file.sessionTitle"
                  @click="emit('openSession', file.sessionId!)"
                >
                  {{ file.sessionTitle }}
                </button>
                <button
                  v-if="
                    !/^(https?:|data:)|^\/api\/plugins\/chathermes\/artifact-images\//.test(
                      file.path,
                    )
                  "
                  type="button"
                  class="shrink-0 py-2 hover:text-white"
                  :aria-label="`Delete ${file.name}`"
                  @click="deletion = file"
                >
                  Delete
                </button>
              </div>
            </div>
          </template>
        </ArtifactCard>
      </div>
      <button
        v-if="nextCursor"
        type="button"
        class="my-6 rounded-full border border-[#555] px-5 py-2 text-sm"
        :disabled="loading"
        @click="load(true)"
      >
        {{ loading ? "Loading…" : "Load More" }}
      </button>
      <dialog
        ref="confirmation"
        class="fixed m-auto w-[min(380px,94vw)] rounded-2xl bg-[#303030] p-5 text-white backdrop:bg-black/80"
        aria-label="Delete artifact"
        @cancel="deleting && $event.preventDefault()"
        @close="deletion = undefined"
      >
        <div v-if="deletion">
          <h3 class="mb-3 break-words">Delete {{ deletion.name }} from Hermes?</h3>
          <p class="mb-5 text-sm text-[#b4b4b4]">
            This removes the server file. References in conversation history remain.
          </p>
          <div class="flex justify-end gap-4">
            <button autofocus :disabled="deleting" @click="deletion = undefined">Cancel</button
            ><button :disabled="deleting" @click="remove">
              {{ deleting ? "Deleting…" : "Delete file" }}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  </section>
</template>
