<script setup lang="ts">
import { ref } from "vue";
import ArtifactPreview from "./ArtifactPreview.vue";
import { artifacts, fileSize, imagePreviewable, previewable, type Artifact } from "./service";
import { fileIconFor, fileIconName } from "./fileIcons";
defineProps<{ artifact: Artifact; profile: string; tiled?: boolean }>();
const emit = defineEmits<{ imageLoad: [] }>();
const preview = ref(false);
const failed = ref(false);
</script>
<template>
  <div
    class="artifact-attachment min-w-0 max-w-full"
    :class="
      tiled
        ? 'artifact-attachment-tiled'
        : 'my-2 rounded-2xl border border-[#424242] bg-[#292929] p-3'
    "
  >
    <button
      v-if="previewable(artifact.mime)"
      type="button"
      class="block w-full text-left"
      :class="{ 'artifact-tile-preview': tiled }"
      :aria-label="`Preview ${artifact.name}`"
      @click="preview = true"
    >
      <div v-if="tiled" class="artifact-tile-media">
        <img
          v-if="imagePreviewable(artifact.mime) && !failed"
          :src="artifacts.content(profile, artifact.id, true)"
          :alt="artifact.name"
          @load="emit('imageLoad')"
          @error="failed = true"
        />
        <span v-else class="artifact-file-symbol" aria-hidden="true">
          <img
            :src="fileIconFor(artifact.name, artifact.mime)"
            :data-icon="fileIconName(artifact.name, artifact.mime)"
            alt=""
          />
        </span>
      </div>
      <img
        v-if="!tiled && imagePreviewable(artifact.mime) && !failed"
        :src="artifacts.content(profile, artifact.id, true)"
        :alt="artifact.name"
        class="mb-2 max-h-64 max-w-full rounded-xl object-contain"
        @load="emit('imageLoad')"
        @error="failed = true"
      />
      <span
        v-if="!tiled && (!imagePreviewable(artifact.mime) || failed)"
        class="artifact-file-symbol artifact-inline-icon"
        aria-hidden="true"
      >
        <img
          :src="fileIconFor(artifact.name, artifact.mime)"
          :data-icon="fileIconName(artifact.name, artifact.mime)"
          alt=""
        />
      </span>
      <span :class="tiled ? 'artifact-tile-name' : 'block truncate'" :title="artifact.name">{{
        artifact.name
      }}</span>
    </button>
    <div v-else>
      <div v-if="tiled" class="artifact-tile-media" aria-hidden="true">
        <span class="artifact-file-symbol">
          <img
            :src="fileIconFor(artifact.name, artifact.mime)"
            :data-icon="fileIconName(artifact.name, artifact.mime)"
            alt=""
          />
        </span>
      </div>
      <span v-else class="artifact-file-symbol artifact-inline-icon" aria-hidden="true">
        <img
          :src="fileIconFor(artifact.name, artifact.mime)"
          :data-icon="fileIconName(artifact.name, artifact.mime)"
          alt=""
        />
      </span>
      <span :class="tiled ? 'artifact-tile-name' : 'block truncate'" :title="artifact.name">
        ><template v-if="!tiled">📄 </template>{{ artifact.name }}</span
      >
    </div>
    <div
      class="flex flex-wrap items-center gap-3 text-sm text-[#b4b4b4]"
      :class="tiled ? 'artifact-tile-meta' : 'mt-1'"
    >
      <span class="min-w-0 [overflow-wrap:anywhere]"
        >{{ artifact.mime.split("/").at(-1)?.toUpperCase()
        }}<template v-if="artifact.size != null"> · {{ fileSize(artifact.size) }}</template></span
      >
      <a :href="artifacts.content(profile, artifact.id)" download class="underline">Download</a>
    </div>
    <ArtifactPreview
      v-if="preview"
      :src="artifacts.content(profile, artifact.id, true)"
      :download="artifacts.content(profile, artifact.id)"
      :name="artifact.name"
      :mime="artifact.mime"
      @close="preview = false"
    />
  </div>
</template>

<style scoped>
.artifact-attachment-tiled {
  display: flex;
  flex-direction: column;
}
.artifact-tile-media {
  display: grid;
  place-items: center;
  height: 168px;
  overflow: hidden;
  background: #232323;
  border-bottom: 1px solid #3a3a3a;
}
.artifact-tile-media img {
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: contain;
}
.artifact-file-symbol {
  display: grid;
  place-items: center;
  width: 64px;
  height: 80px;
  border: 1px solid #454545;
  border-radius: 12px;
  color: #b4b4b4;
  background: #2d2d2d;
}
.artifact-file-symbol img {
  width: 56px;
  height: 72px;
  object-fit: contain;
}
.artifact-inline-icon {
  display: inline-grid;
  width: 32px;
  height: 40px;
  margin-right: 8px;
  vertical-align: middle;
  border-radius: 6px;
}
.artifact-inline-icon img {
  width: 28px;
  height: 36px;
}
.artifact-tile-name {
  display: -webkit-box;
  overflow: hidden;
  min-height: 48px;
  margin: 8px 12px 0;
  line-height: 24px;
  font-weight: 500;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.artifact-tile-meta {
  justify-content: space-between;
  margin-top: auto;
  padding: 0 12px 4px;
}
.artifact-tile-meta a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.artifact-tile-preview:hover .artifact-tile-media {
  background: #303030;
}
</style>
