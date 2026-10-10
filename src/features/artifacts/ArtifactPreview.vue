<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
defineProps<{ src: string; name: string; mime: string; download?: string }>();
const emit = defineEmits<{ close: [] }>();
const panel = ref<HTMLElement>(),
  closeButton = ref<HTMLButtonElement>();
let previous: HTMLElement | null = null;
onMounted(() => {
  previous = document.activeElement as HTMLElement | null;
  closeButton.value?.focus();
});
onBeforeUnmount(() => {
  if (previous?.isConnected) previous.focus();
});
function keydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
  }
  if (event.key !== "Tab") return;
  const controls = Array.from(
    panel.value?.querySelectorAll<HTMLElement>("button,a[href],iframe,video,audio") || [],
  );
  const target = event.shiftKey ? controls.at(-1) : controls[0];
  if (document.activeElement === (event.shiftKey ? controls[0] : controls.at(-1))) {
    event.preventDefault();
    target?.focus();
  }
}
</script>
<template>
  <Teleport to="body">
    <div
      ref="panel"
      class="fixed inset-0 z-[10001] flex flex-col bg-black/90 p-4 text-white"
      role="dialog"
      aria-modal="true"
      :aria-label="`Preview ${name}`"
      @keydown="keydown"
      @click.self="emit('close')"
    >
      <div class="mb-3 flex items-center gap-4">
        <span class="min-w-0 flex-1 truncate">{{ name }}</span
        ><a v-if="download" :href="download" download class="underline">Download</a
        ><button ref="closeButton" class="rounded-xl bg-[#424242] px-4 py-3" @click="emit('close')">
          Close preview
        </button>
      </div>
      <img
        v-if="mime.startsWith('image/')"
        :src="src"
        :alt="name"
        class="min-h-0 flex-1 object-contain"
      />
      <video v-else-if="mime.startsWith('video/')" controls :src="src" class="min-h-0 flex-1" />
      <audio v-else-if="mime.startsWith('audio/')" controls :src="src" />
      <iframe
        v-else
        :title="name"
        :src="src"
        sandbox=""
        class="min-h-0 w-full flex-1 rounded-xl bg-white"
      />
    </div>
  </Teleport>
</template>
