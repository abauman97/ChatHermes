<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { extension, fileUrl, previewKind, type Artifact } from "../artifacts";
const props = defineProps<{ file: Artifact; profile?: string }>();
const emit = defineEmits<{ imageLoad: [] }>();
const icons = import.meta.glob<string>("../../../assets/file-icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
const icon = computed(
  () =>
    icons[`../../../assets/file-icons/${extension(props.file.name)}.svg`] ||
    icons["../../../assets/file-icons/blank.svg"],
);
const kind = computed(() => previewKind(props.file));
const dialog = ref<HTMLDialogElement>();
const source = ref("");
const text = ref("");
const error = ref("");
const loading = ref(false);
const imageFailed = ref(false);
let controller: AbortController | undefined;
function clear() {
  controller?.abort();
  if (source.value.startsWith("blob:")) URL.revokeObjectURL(source.value);
  source.value = "";
  text.value = "";
}
onBeforeUnmount(clear);
async function open() {
  clear();
  error.value = "";
  dialog.value?.showModal();
  loading.value = true;
  const current = (controller = new AbortController());
  try {
    let url = fileUrl(props.file, props.profile);
    if (kind.value === "image" && /^https?:\/\//.test(url)) {
      source.value = url;
      return;
    }
    if (url.startsWith("/api/plugins/")) {
      const response = await fetch(url, {
        credentials: "same-origin",
        signal: current.signal,
        redirect: "error",
      });
      if (!response.ok)
        throw new Error(
          `Preview unavailable (${response.status}). You can try downloading the file.`,
        );
      const data = await response.json();
      if (typeof data.dataUrl !== "string" || !data.dataUrl.startsWith("data:"))
        throw new Error("Preview unavailable.");
      url = data.dataUrl;
    }
    const response = await fetch(url, { signal: current.signal });
    if (!response.ok) throw new Error("Preview unavailable.");
    const blob = await response.blob();
    if (current.signal.aborted) return;
    if (kind.value === "text") text.value = await blob.text();
    else if (kind.value === "pdf") {
      // Chromium's PDF viewer cannot run in a sandboxed iframe. Force PDF
      // content and MIME so a misleading filename cannot embed active HTML.
      if (!(await blob.slice(0, 5).text()).startsWith("%PDF-"))
        throw new Error("Preview unavailable. You can download the file instead.");
      source.value = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
    } else source.value = URL.createObjectURL(blob);
  } catch (cause) {
    if (!current.signal.aborted)
      error.value = cause instanceof Error ? cause.message : "Preview unavailable.";
  } finally {
    if (controller === current) loading.value = false;
  }
}
const thumbnail = ref("");
// Native image reads use the same authenticated preview endpoint as the viewer.
import { watch } from "vue";
watch(
  () => [props.file.path, props.file.imageData, props.profile, props.file.sessionId],
  async (_, __, cleanup) => {
    thumbnail.value = "";
    imageFailed.value = false;
    if (kind.value !== "image") return;
    if (props.file.imageData) {
      thumbnail.value = props.file.imageData;
      return;
    }
    const pending = new AbortController();
    cleanup(() => pending.abort());
    const url = fileUrl(props.file, props.profile);
    if (!url.startsWith("/api/plugins/")) {
      thumbnail.value = url;
      return;
    }
    try {
      const response = await fetch(url, {
        credentials: "same-origin",
        signal: pending.signal,
        redirect: "error",
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (
        !pending.signal.aborted &&
        /^data:image\/(?:png|jpeg|gif|webp|bmp);base64,/.test(data.dataUrl)
      )
        thumbnail.value = data.dataUrl;
      else if (!pending.signal.aborted) imageFailed.value = true;
    } catch {
      if (!pending.signal.aborted) imageFailed.value = true;
    }
  },
  { immediate: true },
);
</script>
<template>
  <div
    class="artifact-card my-2 w-full max-w-md overflow-hidden rounded-2xl border border-[#424242] bg-[#292929]"
  >
    <button
      v-if="kind === 'image' && thumbnail && !imageFailed"
      type="button"
      class="block w-full"
      :aria-label="`Preview ${file.name}`"
      @click="open"
    >
      <img
        :src="thumbnail"
        :alt="file.name"
        class="max-h-72 w-full object-contain"
        @load="emit('imageLoad')"
        @error="imageFailed = true"
      />
    </button>
    <div class="flex min-w-0 items-center gap-3 p-3">
      <img v-if="kind !== 'image' || imageFailed" :src="icon" alt="" class="size-10 shrink-0" />
      <div class="min-w-0 flex-1">
        <button
          v-if="kind"
          type="button"
          class="block w-full truncate text-left text-sm font-medium hover:underline"
          :aria-label="`Preview ${file.name}`"
          @click="open"
        >
          {{ file.name }}
        </button>
        <span v-else class="block truncate text-sm font-medium">{{ file.name }}</span>
        <span class="block text-xs text-[#b4b4b4]"
          >{{ extension(file.name).toUpperCase() || "FILE"
          }}<template v-if="file.size !== undefined">
            ·
            {{
              file.size < 1024
                ? `${file.size} B`
                : file.size < 1048576
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : `${(file.size / 1048576).toFixed(1)} MB`
            }}</template
          ></span
        >
      </div>
      <a
        :href="fileUrl(file, profile, true)"
        :download="file.name"
        :aria-label="`Download ${file.name}`"
        class="grid size-10 shrink-0 place-items-center rounded-xl hover:bg-[#424242]"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />
        </svg>
      </a>
    </div>
    <dialog
      ref="dialog"
      class="artifact-preview fixed m-auto max-h-[90dvh] w-[min(900px,94vw)] overflow-auto rounded-2xl border border-[#424242] bg-[#212121] p-4 text-white backdrop:bg-black/80"
      @close="clear"
      @click="$event.target === dialog && dialog?.close()"
    >
      <div class="mb-4 flex items-center gap-3">
        <h2 class="min-w-0 flex-1 break-words">{{ file.name }}</h2>
        <a :href="fileUrl(file, profile, true)" :download="file.name" class="text-sm underline"
          >Download</a
        ><button
          type="button"
          autofocus
          class="size-10 rounded-full hover:bg-[#424242]"
          aria-label="Close preview"
          @click="dialog?.close()"
        >
          ✕
        </button>
      </div>
      <p v-if="loading" role="status">Loading preview…</p>
      <p v-else-if="error" role="alert" class="text-red-200">{{ error }}</p>
      <pre
        v-else-if="kind === 'text'"
        class="max-h-[70dvh] overflow-auto whitespace-pre-wrap break-words text-sm"
        >{{ text }}</pre>
      <img
        v-else-if="kind === 'image' && source"
        :src="source"
        :alt="file.name"
        class="max-h-[70dvh] w-full object-contain"
      />
      <iframe
        v-else-if="kind === 'pdf' && source"
        :src="source"
        :title="file.name"
        class="h-[70dvh] w-full bg-white"
      />
      <video
        v-else-if="kind === 'video' && source"
        :src="source"
        controls
        class="max-h-[70dvh] w-full"
      />
      <audio v-else-if="kind === 'audio' && source" :src="source" controls class="w-full" />
    </dialog>
  </div>
</template>
