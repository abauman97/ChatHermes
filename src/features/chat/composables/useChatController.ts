import { computed, ref, type Ref } from "vue";
import { reasoningEfforts } from "../../../types/hermes";
import { api } from "../../../services/hermes-api";
import { projectRoot } from "../../projects/utils/projects";
import type {
  ReasoningEffort,
  Attachment,
  Message,
  Project,
  ModelOption,
  ProviderOption,
} from "../../../types/hermes";
import type { useNativeSession } from "../runtime/native-session";
import { normalizeRequest, type RequestAnswer } from "../utils/chat-requests";
// Keep the filename annotation for durable metadata and native file staging;
// MEDIA is the direct delivery reference consumed by the artifact parser.
function uploadReference(file: Attachment, path: string) {
  return `Attached ${file.type.startsWith("image/") ? "image" : "file"} ${file.name.replace(/[\r\n]/g, " ")}: ${path}\nMEDIA:"${path}"`;
}
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
    navigation: () => number;
    createSession: () => Promise<string | undefined>;
    suggest: (text: string) => Promise<void>;
    retryHistory: () => Promise<unknown>;
    openBranch: (id: string) => Promise<void>;
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
  // Pending choices belong only to this profile/session. A home draft transfers
  // its choice to the newly created session, never to another profile or chat.
  const efforts = ref(new Map<string, ReasoningEffort | "">());
  const modelChoices = ref(new Map<string, { model: string; provider: string }>());
  const effortKey = () => JSON.stringify([profile.value || "default", session.value]);
  const resumed = computed(() => {
    const saved = native.settings.value;
    return saved?.profile === profile.value &&
      saved.session === session.value &&
      saved.generation === native.generationRef.value
      ? saved.info
      : undefined;
  });
  const reasoningEffort = computed(() => {
    const saved = resumed.value?.reasoning_effort;
    return (
      efforts.value.get(effortKey()) ??
      (reasoningEfforts.includes(saved as ReasoningEffort) ? (saved as ReasoningEffort) : "")
    );
  });
  const selectedModel = computed(
    () =>
      modelChoices.value.get(effortKey())?.model ??
      (session.value ? resumed.value?.model || "" : model.value),
  );
  const selectedProvider = computed(
    () =>
      modelChoices.value.get(effortKey())?.provider ??
      (session.value ? resumed.value?.provider || provider.value : provider.value),
  );
  const branching = ref(false);
  const branchDisabled = computed(
    () =>
      branching.value ||
      !canStream.value ||
      viewApprovalPending.value ||
      viewBusy.value ||
      viewLoading.value ||
      viewReconnect.value ||
      offline.value ||
      !session.value,
  );
  async function branch(responseId: string) {
    if (branchDisabled.value) return;
    const owner = scope.generation(),
      navigation = scope.navigation(),
      p = profile.value,
      id = session.value;
    branching.value = true;
    try {
      const made = await api.branch(p, id, responseId);
      if (
        owner === scope.generation() &&
        navigation === scope.navigation() &&
        p === profile.value &&
        id === session.value
      )
        await scope.openBranch(made.id);
    } catch {
      if (owner === scope.generation() && navigation === scope.navigation())
        native.error.value = "Could not branch this response. Refresh history and try again.";
    } finally {
      branching.value = false;
    }
  }
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
      branching.value ||
      viewBusy.value ||
      creating.value ||
      viewApprovalPending.value ||
      offline.value ||
      !canStream.value ||
      modelsLoading.value
    )
      return;
    const draftKey = effortKey(),
      effort = reasoningEffort.value,
      draftProfile = profile.value,
      draftModel = selectedModel.value,
      draftProvider = selectedProvider.value;
    if (projectView.value || !session.value) {
      const created = await scope.createSession();
      if (!created || profile.value !== draftProfile || session.value !== created) return;
      modelChoices.value.set(effortKey(), { model: draftModel, provider: draftProvider });
      if (draftKey !== effortKey()) modelChoices.value.delete(draftKey);
      if (effort) {
        efforts.value.set(effortKey(), effort);
        if (draftKey !== effortKey()) efforts.value.delete(draftKey);
      }
    }
    const current = scope.generation(),
      p = profile.value;
    const preview = [
      { type: "text", text },
      ...attachments.flatMap((file): unknown[] => [
        {
          type: "text",
          text: file.path ? uploadReference(file, file.path) : "📎 " + file.name,
        },
        ...(file.type.startsWith("image/")
          ? [{ type: "image_url", image_url: { url: file.data } }]
          : []),
      ]),
    ];
    try {
      await native.submit(
        text,
        async () => {
          const parts: unknown[] = [
            { type: "text", text: text || "Please examine the attached files." },
          ];
          for (const file of attachments) {
            const uploaded = file.path ? { path: file.path } : await api.upload(p, file);
            if (current !== scope.generation())
              throw new Error("Session changed before submission");
            parts.push({
              type: "text",
              text: uploadReference(file, uploaded.path),
            });
            if (file.type.startsWith("image/"))
              parts.push({ type: "image_url", image_url: { url: file.data } });
          }
          return attachments.length ? parts : text;
        },
        {
          model: selectedModel.value || defaultModel.value,
          provider: selectedProvider.value || undefined,
          ...(effort ? { reasoning_effort: effort } : {}),
        },
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
    const owner = scope.generation();
    if (nativeMode.value) {
      try {
        await native.stop();
      } catch {
        if (owner === scope.generation()) native.error.value = "Could not stop the response.";
      }
      return;
    }
  }
  async function steerResponse(text: string) {
    const owner = scope.generation();
    if (nativeMode.value) {
      try {
        await native.steer(text);
      } catch {
        if (owner === scope.generation()) native.error.value = "Response did not accept guidance.";
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
      branching.value ||
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
    branch,
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
    setReasoningEffort: (value: ReasoningEffort | "") => {
      efforts.value.set(effortKey(), value);
    },
    setModel: (value: string) => {
      modelChoices.value.set(effortKey(), { model: value, provider: selectedProvider.value });
    },
    setProvider: (value: string) => {
      modelChoices.value.set(effortKey(), { model: selectedModel.value, provider: value });
    },
  };
  return {
    view: {
      messages: viewMessages,
      branchDisabled,
      responseTargets: native.responseTargets,
      busy: viewBusy,
      loading: viewLoading,
      error: viewError,
      approvalPending: viewApprovalPending,
      reconnect: viewReconnect,
      unavailable: viewUnavailable,
      active: viewActive,
      request,
      connection: computed(() => native.connection.value),
      status: computed(() => (nativeMode.value ? native.status.value : "")),
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
      reasoningEffort,
      model: selectedModel,
      provider: selectedProvider,
      defaultModel,
      suggestedPrompt: computed(() => suggestedPrompt.value),
    },
  };
}
export type ChatContext = ReturnType<typeof useChatController>;
