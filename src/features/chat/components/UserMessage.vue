<script setup lang="ts">
import ArtifactCard from "../../artifacts/components/ArtifactCard.vue";
import { messageArtifacts, uploadedArtifacts } from "../../artifacts/artifacts";
import { messageText } from "../../../services/hermes-api";
import type { Message } from "../../../types/hermes";
import { renderMarkdown } from "../../../utils/markdown";

defineProps<{ message: Message; profile?: string; sessionId?: string }>();
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <article
    class="message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]"
  >
    <div
      class="message-content markdown-content break-words text-base leading-7"
      v-html="
        renderMarkdown(
          uploadedArtifacts(messageText(message.content)).text.replace(
            /\[screenshot\]/g,
            '📷 Attached image',
          ),
        )
      "
    />
    <ArtifactCard
      v-for="file in messageArtifacts(message)"
      :key="file.path"
      :file="{ ...file, sessionId }"
      :profile="profile"
      @image-load="emit('imageLoad')"
    />
  </article>
</template>
