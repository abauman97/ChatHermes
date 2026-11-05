<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { api } from "../../../services/hermes-api";
import type { InboxItem } from "../inbox";
const props = defineProps<{
  preview?: boolean;
  profile: string;
  revision: number;
  scope: "all" | "profile";
  openItem: (item: InboxItem) => Promise<void>;
}>();
const emit = defineEmits<{ "update:scope": [value: "all" | "profile"]; refresh: [] }>();
const scope = computed({
  get: () => props.scope,
  set: (value: "all" | "profile") => emit("update:scope", value),
});
const items = ref<InboxItem[]>([]),
  cursor = ref<string | null>(null);
const loading = ref(false),
  opening = ref<number>(),
  removing = ref<number>(),
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
        limit: props.preview ? 5 : undefined,
        cursor: more ? cursor.value || undefined : undefined,
      },
      current.signal,
    );
    if (current.signal.aborted) return;
    const combined = more ? [...items.value, ...result.items] : result.items;
    items.value = combined.filter(
      (item, index) => combined.findIndex((other) => other.id === item.id) === index,
    );
    if (props.preview) items.value = items.value.slice(0, 5);
    cursor.value = props.preview ? null : result.nextCursor;
  } catch {
    if (!current.signal.aborted) error.value = "Could not load inbox. Try refreshing.";
  } finally {
    if (controller === current) loading.value = false;
  }
}
async function open(item: InboxItem) {
  if (opening.value || removing.value) return;
  opening.value = item.id;
  error.value = "";
  try {
    await props.openItem(item);
  } catch {
    error.value = "Could not open this notification. It remains unread.";
  } finally {
    opening.value = undefined;
  }
}
async function remove(item: InboxItem) {
  if (opening.value || removing.value) return;
  const current = controller;
  removing.value = item.id;
  error.value = "";
  try {
    await api.deleteInboxItem(item.profile, item.id);
    if (controller === current && !current?.signal.aborted) {
      items.value = items.value.filter((other) => other.id !== item.id);
      if (props.preview) await load();
    }
    emit("refresh");
  } catch {
    if (controller === current && !current?.signal.aborted)
      error.value = "Could not remove this notification. Try again.";
  } finally {
    removing.value = undefined;
  }
}
watch(
  () => [props.profile, props.revision, scope.value, props.preview],
  () => void load(),
  { immediate: true },
);
onBeforeUnmount(() => controller?.abort());
</script>
<template>
  <section
    data-drawer-swipe
    :aria-label="preview ? 'Recent inbox messages' : 'Inbox'"
    class="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5"
  >
    <div class="mx-auto max-w-3xl">
      <h2 v-if="preview" class="mb-3 px-2 text-sm text-[#b4b4b4]">Recent messages</h2>
      <div
        v-else
        class="mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-sm"
      >
        <label class="flex items-center gap-2"
          >View
          <select
            v-model="scope"
            aria-label="Inbox view"
            class="rounded-lg bg-[#303030] px-2 py-1 text-base"
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
        <li
          v-for="item in items"
          :key="item.id"
          :data-session="item.session"
          class="flex items-center gap-1"
        >
          <button
            class="inbox-open grid min-w-0 flex-1 gap-1 rounded-lg px-2 py-2 text-left hover:bg-[#292929]"
            :disabled="!!opening || !!removing"
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
          <button
            class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#a3a3a3] hover:bg-[#424242] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]"
            :aria-label="`Remove ${item.title || 'Untitled chat'} from inbox`"
            title="Remove from inbox"
            :disabled="!!opening || !!removing"
            @click="remove(item)"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
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
