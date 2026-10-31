<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { api } from "../../../services/hermes-api";
import type { InboxItem } from "../inbox";
const props = defineProps<{
  profile: string;
  revision: number;
  openItem: (item: InboxItem) => Promise<void>;
}>();
const scope = ref<"all" | "profile">("all");
const items = ref<InboxItem[]>([]),
  cursor = ref<string | null>(null);
const loading = ref(false),
  opening = ref<number>(),
  error = ref("");
let controller: AbortController | undefined;
async function load(more = false) {
  controller?.abort();
  const current = (controller = new AbortController());
  loading.value = true;
  error.value = "";
  try {
    const result = await api.inbox(
      props.profile,
      {
        scope: scope.value,
        unread: true,
        cursor: more ? cursor.value || undefined : undefined,
      },
      current.signal,
    );
    if (current.signal.aborted) return;
    const combined = more ? [...items.value, ...result.items] : result.items;
    items.value = combined.filter(
      (item, index) => combined.findIndex((other) => other.id === item.id) === index,
    );
    cursor.value = result.nextCursor;
  } catch {
    if (!current.signal.aborted) error.value = "Could not load inbox. Try refreshing.";
  } finally {
    if (controller === current) loading.value = false;
  }
}
async function open(item: InboxItem) {
  if (opening.value) return;
  opening.value = item.id;
  error.value = "";
  try {
    await props.openItem(item);
  } catch {
    error.value = "Could not open this chat. The notification remains unread.";
  } finally {
    opening.value = undefined;
  }
}
watch(
  () => [props.profile, props.revision, scope.value],
  () => void load(),
  { immediate: true },
);
onBeforeUnmount(() => controller?.abort());
</script>
<template>
  <section aria-label="Inbox" class="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5">
    <div class="mx-auto max-w-3xl">
      <div
        class="mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-sm"
      >
        <label class="flex items-center gap-2"
          >View
          <select
            v-model="scope"
            aria-label="Inbox view"
            class="rounded-lg bg-[#303030] px-2 py-1 text-sm"
          >
            <option value="all">All profiles</option>
            <option value="profile">Profile: {{ profile || "default" }}</option>
          </select>
        </label>
      </div>
      <p v-if="error" role="alert" class="mb-4 text-red-200">{{ error }}</p>
      <p v-if="loading && !items.length" role="status" class="text-[#b4b4b4]">Loading inbox…</p>
      <p v-else-if="!items.length" class="text-[#b4b4b4]">No unread notifications.</p>
      <ol class="divide-y divide-[#363636]">
        <li v-for="item in items" :key="item.id" :data-session="item.session">
          <button
            class="grid w-full gap-1 rounded-lg px-2 py-2 text-left hover:bg-[#292929]"
            :disabled="!!opening"
            @click="open(item)"
          >
            <p class="min-w-0 truncate font-medium">{{ item.title || "Untitled chat" }}</p>
            <p class="line-clamp-1 break-words text-sm text-[#b4b4b4]">{{ item.preview }}</p>
            <div class="flex items-center gap-2 text-xs text-[#777]">
              <span>{{ item.profile }}</span>
              <time :datetime="new Date(item.occurred * 1000).toISOString()">{{
                new Date(item.occurred * 1000).toLocaleString()
              }}</time>
            </div>
          </button>
        </li>
      </ol>
      <button
        v-if="cursor"
        class="my-5 min-h-11 rounded-full border border-[#555] px-5"
        :disabled="loading"
        @click="load(true)"
      >
        Load More
      </button>
    </div>
  </section>
</template>
