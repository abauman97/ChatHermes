import { computed, type Ref } from "vue";
import { api } from "../../../services/hermes-api";
import { projectRoot } from "../../projects/utils/projects";
import type {
  Attachment,
  Message,
  Project,
  ModelOption,
  ProviderOption,
} from "../../../types/hermes";
import type { useNativeSession } from "../runtime/native-session";
import { normalizeRequest, type RequestAnswer } from "../utils/chat-requests";
export function useChatController(
  native: ReturnType<typeof useNativeSession>,
  scope: {
    profile: Readonly<Ref<string>>;
    session: Readonly<Ref<string>>;
    messages: Readonly<Ref<Message[]>>;
    chatLoading: Readonly<Ref<boolean>>;
    chatError: Readonly<Ref<string>>;
    canStream: Readonly<Ref<boolean>>;
    scheduledPage: Readonly<Ref<boolean>>;
    projectView: Readonly<Ref<boolean>>;
    projectsPage: Readonly<Ref<boolean>>;
    projectPage: Readonly<Ref<string>>;
    settingsPage: Readonly<Ref<boolean>>;
    selectedProject: Readonly<Ref<Project | undefined>>;
    creating: Readonly<Ref<boolean>>;
    offline: Readonly<Ref<boolean>>;
    models: Readonly<Ref<ModelOption[]>>;
    providers: Readonly<Ref<ProviderOption[]>>;
    modelsLoading: Readonly<Ref<boolean>>;
    model: Ref<string>;
    provider: Ref<string>;
    defaultModel: Readonly<Ref<string>>;
    suggestedPrompt: Ref<string>;
    generation: () => number;
    createSession: () => Promise<string | undefined>;
    suggest: (text: string) => Promise<void>;
    retryHistory: () => Promise<unknown>;
  },
) {
  const {
    profile,
    session,
    messages,
    chatLoading,
    chatError,
    canStream,
    scheduledPage,
    projectView,
    projectsPage,
    projectPage,
    settingsPage,
    selectedProject,
    creating,
    offline,
    models,
    providers,
    modelsLoading,
    model,
    provider,
    defaultModel,
    suggestedPrompt,
  } = scope;
  const nativeMode = canStream;
  const viewMessages = computed(() => (nativeMode.value ? native.messages.value : messages.value));
  const viewBusy = computed(() => native.busy.value || native.uncertain.value);
  const viewLoading = computed(() => (nativeMode.value ? native.loading.value : chatLoading.value));
  const viewError = computed(() => (nativeMode.value ? native.error.value : chatError.value));
  const viewApprovalPending = computed(() => !!native.approval.value);
  const viewReconnect = computed(
    () => nativeMode.value && !!session.value && native.connection.value !== "ready",
  );
  const viewUnavailable = computed(() => native.uncertain.value);
  const viewActive = computed(() => native.busy.value);
  async function sendNative(text: string, attachments: Attachment[]) {
    if (
      scheduledPage.value ||
      viewBusy.value ||
      creating.value ||
      viewApprovalPending.value ||
      offline.value ||
      !canStream.value ||
      modelsLoading.value
    )
      return;
    if ((projectView.value || !session.value) && !(await scope.createSession())) return;
    const current = scope.generation(),
      p = profile.value;
    const preview = [
      { type: "text", text },
      ...attachments.map((file) =>
        file.type.startsWith("image/")
          ? { type: "image_url", image_url: { url: file.data } }
          : { type: "text", text: "📎 " + file.name },
      ),
    ];
    try {
      await native.submit(
        text,
        async () => {
          const parts: unknown[] = [
            { type: "text", text: text || "Please examine the attached files." },
          ];
          for (const file of attachments) {
            const uploaded = await api.upload(p, file);
            if (current !== scope.generation())
              throw new Error("Session changed before submission");
            parts.push({
              type: "text",
              text: `Attached ${file.type.startsWith("image/") ? "image" : "file"} ${file.name.replace(/[\r\n]/g, " ")}: ${uploaded.path}`,
            });
            if (file.type.startsWith("image/"))
              parts.push({ type: "image_url", image_url: { url: file.data } });
          }
          return attachments.length ? parts : text;
        },
        { model: model.value || defaultModel.value, provider: provider.value || undefined },
        preview,
      );
    } catch (cause) {
      if (current === scope.generation() && !native.uncertain.value) {
        native.error.value = cause instanceof Error ? cause.message : "Message not submitted";
        suggestedPrompt.value = text;
      }
    }
  }
  async function send(text: string, attachments: Attachment[] = []) {
    if (nativeMode.value) await sendNative(text, attachments);
  }
  async function stopResponse() {
    if (nativeMode.value) {
      try {
        await native.stop();
      } catch {
        native.error.value = "Could not stop the response.";
      }
      return;
    }
  }
  async function steerResponse(text: string) {
    if (nativeMode.value) {
      try {
        await native.steer(text);
      } catch {
        native.error.value = "Response did not accept guidance.";
      }
      return;
    }
  }

  const request = computed(() => {
    const raw = native.approval.value;
    return raw && typeof raw.request_id === "string" && typeof raw.kind === "string"
      ? normalizeRequest({ id: raw.request_id, method: raw.kind, params: raw })
      : undefined;
  });
  function requestCurrent(id: string, owner: number) {
    return owner === scope.generation() && request.value?.id === id;
  }
  async function answer(id: string, result: RequestAnswer, owner: number) {
    if (!nativeMode.value || viewReconnect.value || !requestCurrent(id, owner)) return;
    try {
      await native.answer(id, { ...result });
    } catch {
      if (requestCurrent(id, owner))
        native.error.value =
          request.value?.kind === "clarify"
            ? "Clarification could not be settled."
            : request.value?.kind === "secret"
              ? "Secret request could not be settled."
              : "Approval could not be settled.";
    }
  }
  const composer = computed(() => ({
    projectName:
      !scheduledPage.value && !projectsPage.value && !selectedProject.value?.isNoProject
        ? selectedProject.value?.label
        : undefined,
    disabled: Boolean(
      !!projectPage.value ||
      scheduledPage.value ||
      projectsPage.value ||
      (projectView.value && selectedProject.value?.archived) ||
      (projectView.value &&
        (!selectedProject.value ||
          (!selectedProject.value.isNoProject && !projectRoot(selectedProject.value)))) ||
      offline.value ||
      creating.value ||
      modelsLoading.value ||
      viewLoading.value ||
      viewApprovalPending.value ||
      viewUnavailable.value ||
      viewReconnect.value ||
      !canStream.value,
    ),
    reason: scheduledPage.value
      ? "Open a chat to discuss a run."
      : projectsPage.value
        ? "Select a project or start a new chat."
        : projectView.value && selectedProject.value?.archived
          ? "Restore this project to start a new chat."
          : projectView.value &&
              selectedProject.value &&
              !selectedProject.value.isNoProject &&
              !projectRoot(selectedProject.value)
            ? "This Project has no workspace."
            : offline.value
              ? "Offline · sending is unavailable."
              : viewApprovalPending.value
                ? "Approval is pending in Hermes."
                : !canStream.value
                  ? "Streaming turns are unavailable for this profile."
                  : undefined,
  }));
  const actions = {
    send,
    stop: stopResponse,
    steer: steerResponse,
    answerFor: (id: string) => {
      const owner = scope.generation();
      return (result: RequestAnswer) => answer(id, result, owner);
    },
    suggest: scope.suggest,
    retry: () => (viewReconnect.value ? native.reconnect() : scope.retryHistory()),
    resolve: () => native.resolveUncertainty(),
    setModel: (value: string) => {
      model.value = value;
    },
    setProvider: (value: string) => {
      provider.value = value;
    },
  };
  return {
    view: {
      messages: viewMessages,
      busy: viewBusy,
      loading: viewLoading,
      error: viewError,
      approvalPending: viewApprovalPending,
      reconnect: viewReconnect,
      unavailable: viewUnavailable,
      active: viewActive,
      request,
      connection: computed(() => native.connection.value),
    },
    composer,
    actions,
    scope: {
      profile,
      session,
      settingsPage,
      scheduledPage,
      offline,
      canStream,
      models,
      providers,
      modelsLoading,
      model: computed(() => model.value),
      provider: computed(() => provider.value),
      defaultModel,
      suggestedPrompt: computed(() => suggestedPrompt.value),
    },
  };
}
export type ChatContext = ReturnType<typeof useChatController>;
