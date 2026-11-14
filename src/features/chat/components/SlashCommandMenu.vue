<script setup lang="ts">
import type { CompletionItem } from "../../../vendor/hermes/gateway-contract.generated";
defineProps<{
  id: string;
  items: (CompletionItem & { group: string; limitation: string })[];
  selected: number;
  loading: boolean;
  error: string;
}>();
defineEmits<{ select: [index: number] }>();
</script>
<template>
  <div
    class="absolute bottom-full left-0 z-20 mb-2 max-h-[min(40dvh,320px)] w-full overflow-y-auto overscroll-contain rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl"
  >
    <p v-if="loading" role="status" class="p-2 text-[#b4b4b4]">Loading commands…</p>
    <p v-if="error" role="status" class="p-2 text-sm text-[#b4b4b4]">{{ error }}</p>
    <p v-if="!loading && !error && !items.length" role="status" class="p-2 text-[#b4b4b4]">
      No command suggestions. Escape closes this menu.
    </p>
    <div :id="id" role="listbox" aria-label="Slash commands">
      <template v-for="(item, index) in items" :key="index">
        <p
          v-if="item.group !== 'Session' && (index === 0 || items[index - 1]?.group !== item.group)"
          class="px-3 pt-2 text-xs text-[#a3a3a3]"
        >
          {{ item.group }}
        </p>
        <button
          type="button"
          role="option"
          :id="`${id}-${index}`"
          :aria-selected="selected === index"
          tabindex="-1"
          class="block w-full rounded-xl px-3 py-2 text-left"
          :class="selected === index ? 'bg-[#424242]' : 'hover:bg-[#303030]'"
          @pointerdown.prevent
          @click="$emit('select', index)"
        >
          <span class="block break-words">{{ item.display || item.text }}</span>
          <span class="block text-sm text-[#b4b4b4]">{{ item.meta }}</span>
        </button>
      </template>
    </div>
  </div>
</template>
