<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { workerRegistration } from "../services/push";
import { watchWorkerUpdates, type WorkerUpdateState } from "../services/workerUpdates";

const state = ref<WorkerUpdateState>({ available: false, busy: false, error: "" });
const open = ref(false);
let mounted = true;
let updates: ReturnType<typeof watchWorkerUpdates> | undefined;
onMounted(async () => {
  const originalController = navigator.serviceWorker?.controller;
  try {
    const registration = await workerRegistration();
    if (!mounted) return;
    updates = watchWorkerUpdates(
      registration,
      navigator.serviceWorker,
      (value, fresh) => {
        state.value = value;
        if (fresh) open.value = true;
        if (!value.available) open.value = false;
      },
      () => location.reload(),
      originalController,
    );
  } catch {
    // Unavailable workers must not prevent chat or request notification permission.
  }
});
onBeforeUnmount(() => {
  mounted = false;
  updates?.dispose();
});
</script>

<template>
  <div
    v-if="state.available"
    class="fixed top-20 right-4 z-40 max-h-[calc(100dvh-6rem)] max-w-[calc(100%-2rem)] overflow-y-auto"
  >
    <section
      v-if="open"
      role="dialog"
      aria-modal="false"
      aria-labelledby="worker-update-title"
      aria-describedby="worker-update-warning"
      class="w-80 max-w-full rounded-2xl border border-[#424242] bg-[#212121] p-4 text-base text-white shadow-xl"
      @keydown.esc.stop="open = false"
    >
      <h2 id="worker-update-title" class="font-medium">ChatHermes update available</h2>
      <p id="worker-update-warning" class="mt-2 text-[#b4b4b4]">
        Update reloads this tab and may interrupt drafts, uploads, or work in progress. Other tabs
        will not reload automatically.
      </p>
      <p v-if="state.error" role="alert" class="mt-2">{{ state.error }}</p>
      <div class="mt-4 flex justify-end gap-2">
        <button
          class="rounded-xl px-3 py-2 hover:bg-[#424242] disabled:opacity-55"
          :disabled="state.busy"
          @click="open = false"
        >
          Not now
        </button>
        <button
          class="rounded-xl bg-white px-3 py-2 text-black disabled:opacity-55"
          :disabled="state.busy"
          @click="updates?.update()"
        >
          {{ state.busy ? "Updating…" : "Update" }}
        </button>
      </div>
    </section>
    <button
      v-else
      class="rounded-xl border border-[#424242] bg-[#212121] px-4 py-2 text-base text-white shadow-xl"
      @click="open = true"
    >
      Update available
    </button>
  </div>
</template>
