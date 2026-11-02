<script setup lang="ts">
import { useKanban } from "./context";
const kanban = useKanban();
</script>
<template>
  <template v-if="kanban.visible.value">
    <button
      v-for="action in kanban.screenActions.value"
      :key="action.label"
      :role="action.checked === undefined ? 'menuitem' : 'menuitemcheckbox'"
      :aria-checked="action.checked"
      :disabled="action.disabled"
      @click="action.run()"
    >
      {{ action.label }}
    </button>
  </template>
</template>
