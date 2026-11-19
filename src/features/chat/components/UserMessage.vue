<script setup lang="ts">
import { computed } from "vue";
import ArtifactCard from "../../artifacts/components/ArtifactCard.vue";
import { messageArtifacts, uploadedArtifacts } from "../../artifacts/artifacts";
import { messageText } from "../../../services/hermes-api";
import type { Message } from "../../../types/hermes";
import { renderMarkdown } from "../../../utils/markdown";

const props = defineProps<{ message: Message; profile?: string; sessionId?: string }>();
const delivery = computed(() => uploadedArtifacts(messageText(props.message.content), true));
const html = computed(() => {
  const projection = delivery.value.markdown;
  return renderMarkdown(
    projection?.source ?? delivery.value.text,
    undefined,
    undefined,
    projection?.hidden,
  ).replace(/\[screenshot\]/g, "📷 Attached image");
});
const emit = defineEmits<{ imageLoad: [] }>();
</script>
<template>
  <article
    class="message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]"
  >
    <div class="message-content markdown-content break-words text-base leading-7">
      <p
        v-if="delivery.markdown?.refs.length"
        class="whitespace-pre-wrap"
        v-text="delivery.markdown.refs.join('\n')"
      />
      <div class="markdown-content" v-html="html" />
    </div>
    <ArtifactCard
      v-for="file in messageArtifacts(message)"
      :key="file.path"
      :file="{ ...file, sessionId }"
      :profile="profile"
      @image-load="emit('imageLoad')"
    />
  </article>
</template>
