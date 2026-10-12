<script setup lang="ts">
import type { Project, Session, ProjectAction } from "../../../types/hermes";
import { projectRoot } from "../utils/projects";
import ArtifactsPage from "../../artifacts/components/ArtifactsPage.vue";
import ProjectSettings from "./ProjectSettings.vue";
import ProjectInstructions from "./ProjectInstructions.vue";
defineProps<{
  profile: string;
  projectId: string;
  selectedProject?: Project;
  projectPage: string;
  projectArtifacts: boolean;
  projectLoading: boolean;
  projectError: string;
  manageError: string;
  projectBusy: boolean;
  offline: boolean;
  visibleSessions: Session[];
  chooseProject: (id: string) => unknown;
  showProjects: (archived: boolean) => unknown;
  showProjectArtifacts: (artifacts: boolean) => unknown;
  loadProject: () => unknown;
  recentSession: (id: string) => unknown;
  chooseSession: (id: string) => unknown;
  manageProject: (action: ProjectAction, fields: Record<string, string | boolean>) => unknown;
}>();
</script>
<template>
  <section
    v-if="projectPage && selectedProject"
    class="page-content project-editor"
    :aria-label="projectPage === 'edit' ? 'Edit project' : 'Edit Instructions'"
  >
    <button class="project-back" @click="chooseProject(projectId)">
      ← {{ selectedProject.label }}
    </button>
    <h2 class="text-2xl font-semibold">
      {{ projectPage === "edit" ? "Edit project" : "Edit Instructions" }}
    </h2>
    <ProjectSettings
      v-if="projectPage === 'edit'"
      :key="`${profile}:${selectedProject.id}`"
      :project="selectedProject"
      :busy="projectBusy"
      :offline="offline"
      :error="manageError"
      @manage="manageProject"
    />
    <ProjectInstructions
      v-else
      :key="`${profile}:${selectedProject.id}`"
      :profile="profile"
      :project-id="selectedProject.id"
      :offline="offline"
    />
  </section>
  <section
    v-else
    class="project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10"
    aria-label="Selected Project"
  >
    <div class="project-home-content">
      <button class="project-back" @click="showProjects(!!selectedProject?.archived)">
        ← Projects
      </button>
      <p v-if="projectLoading" role="status">Loading Project…</p>
      <p v-if="projectError" class="mb-4 text-[#fecaca]" role="alert">
        {{ projectError }}
        <button class="underline" @click="loadProject">Retry Project</button>
      </p>
      <template v-if="selectedProject">
        <nav class="mb-5 flex gap-5 text-sm" aria-label="Project view">
          <button :aria-pressed="!projectArtifacts" @click="showProjectArtifacts(false)">
            Sessions / Chat</button
          ><button :aria-pressed="projectArtifacts" @click="showProjectArtifacts(true)">
            Artifacts
          </button>
        </nav>
        <ArtifactsPage
          v-if="projectArtifacts"
          :project="selectedProject"
          :profile="profile"
          :sessions="visibleSessions"
          @open-session="recentSession"
        />
        <template v-else>
          <p v-if="selectedProject.archived" class="project-muted">Archived project</p>
          <p class="mb-4 break-all text-sm text-[#a3a3a3]">
            {{
              projectRoot(selectedProject)
                ? "Workspace: " + projectRoot(selectedProject)
                : selectedProject.isNoProject
                  ? "No project workspace"
                  : "No workspace configured"
            }}
          </p>
          <p v-if="!visibleSessions.length" class="text-sm text-[#b4b4b4]">No conversations yet.</p>
          <nav class="project-chat-list" aria-label="Project chats">
            <button
              v-for="row in visibleSessions"
              :key="row.id"
              class="project-chat-row"
              :aria-label="row.title || 'Untitled session'"
              @click="chooseSession(row.id)"
            >
              <span class="project-chat-title">{{ row.title || "Untitled session" }}</span>
              <span v-if="row.preview?.trim()" class="project-chat-preview">{{ row.preview }}</span>
            </button>
          </nav>
          <button class="project-back mt-5" @click="chooseProject('')">Other chats</button>
        </template>
      </template>
    </div>
  </section>
</template>
