<script setup lang="ts">
import { useProjects } from "../context";
import { useRoute, useRouter } from "vue-router";
const { selectedProject, projectLoading, projectError, loadProject, showProjects } = useProjects();
const route = useRoute(),
  router = useRouter();
</script>
<template>
  <section
    class="project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10"
    aria-label="Selected Project"
  >
    <div class="project-home-content">
      <button class="project-back" @click="showProjects(!!selectedProject?.archived)">
        ← Projects
      </button>
      <p v-if="projectLoading" role="status">Loading Project…</p>
      <p v-if="projectError" class="mb-4 text-[#fecaca]" role="alert">
        {{ projectError }} <button class="underline" @click="loadProject">Retry Project</button>
      </p>
      <template v-if="selectedProject"
        ><nav class="mb-5 flex gap-5 text-sm" aria-label="Project view">
          <button
            :aria-pressed="route.name === 'project'"
            @click="router.push({ name: 'project', params: route.params, query: route.query })"
          >
            Sessions / Chat
          </button>
          <button
            :aria-pressed="route.name === 'project-artifacts'"
            @click="
              router.push({ name: 'project-artifacts', params: route.params, query: route.query })
            "
          >
            Artifacts
          </button>
        </nav>
        <slot
      /></template>
    </div>
  </section>
</template>
