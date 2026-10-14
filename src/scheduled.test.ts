// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount as vueMount } from "@vue/test-utils";
import { createChatHermesRouter } from "./router";
function routeUrl() {
  return new URL(location.hash.slice(1) || "/", location.origin);
}

const mount: typeof vueMount = (component, options = {}) =>
  vueMount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [...(options.global?.plugins || []), createChatHermesRouter()],
    },
  });
import App from "./App.vue";
import * as nativeSession from "./features/chat/runtime/native-session";
import { api } from "./services/hermes-api";
beforeEach(() => history.replaceState({}, "", "/chathermes"));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState({}, "", "/");
});
function setup() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      let value: unknown = { sessions: [], total: 0 };
      if (url.includes("/profiles")) value = { profiles: [{ name: "beta" }] };
      else if (url.includes("/projects")) value = { projects: [], scoped_session_ids: [] };
      else if (url.includes("/scheduled/output"))
        value = {
          messages: [],
          output: "Saved security audit",
          session_id: "cron_audit_20260101_000000",
        };
      else if (url.includes("/scheduled/runs"))
        value = {
          runs: [{ id: "cron_audit_20260101_000000", started_at: 100, source: "cron" }],
          offset: 0,
          limit: 30,
          has_more: false,
        };
      else if (url.includes("/scheduled"))
        value = { jobs: [{ id: "audit", name: "Security Audit", enabled: true }] };
      else if (url.includes("/capabilities"))
        value = {
          features: { native_chat: true },
        };
      else if (url.includes("/v1/models")) value = { data: [] };
      else if (url.includes("/model/options")) value = { providers: [] };
      else if (url.includes("/messages")) value = { messages: [] };
      else if (init?.method === "POST" || url.endsWith("/api/sessions/new_chat"))
        value = { id: "new_chat" };
      return new Response(JSON.stringify(value));
    }),
  );
}
it("puts Scheduled below Projects and keeps run refresh in screen options", async () => {
  setup();
  const factory = nativeSession.useNativeSession;
  const send = vi.fn(async () => {});
  vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
    const owner = factory(callback);
    owner.attach = vi.fn(async () => {
      owner.connection.value = "ready";
    });
    owner.submit = send;
    return owner;
  });
  const wrapper = mount(App);
  await flushPromises();
  const nav = wrapper.get(".scheduled-nav");
  expect(nav.element.previousElementSibling?.textContent).toContain("Projects");
  await nav.trigger("click");
  await flushPromises();
  await flushPromises();
  expect(routeUrl().pathname).toBe("/scheduled");
  expect(wrapper.get(".composer textarea").attributes("disabled")).toBeUndefined();
  await wrapper.get(".composer textarea").setValue("Do not send here");
  expect(wrapper.get('[aria-label="Send message"]').attributes("disabled")).toBeDefined();
  expect(send).not.toHaveBeenCalled();
  expect(
    wrapper.findAll(".scheduled-page button").some((button) => button.text() === "Refresh"),
  ).toBe(false);
  const refresh = vi.spyOn(api, "scheduled");
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  await wrapper.get('[data-test="refresh-scheduled"]').trigger("click");
  await flushPromises();
  expect(refresh).toHaveBeenCalled();
  expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await flushPromises();
  expect(wrapper.find(".project-back").exists()).toBe(false);
  const refreshRuns = vi.spyOn(api, "scheduledRuns");
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.find('[data-test="resume-scheduled-session"]').exists()).toBe(false);
  await wrapper.get('[data-test="refresh-scheduled"]').trigger("click");
  await flushPromises();
  expect(refreshRuns).toHaveBeenCalledWith("", "audit", 0, expect.any(AbortSignal));
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await flushPromises();
  const refreshOutput = vi.spyOn(api, "scheduledOutput");
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  await wrapper.get('[data-test="refresh-scheduled"]').trigger("click");
  await flushPromises();
  expect(refreshOutput).toHaveBeenCalledWith(
    "",
    "audit",
    "cron_audit_20260101_000000",
    expect.any(AbortSignal),
  );
  expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  const create = vi.spyOn(api, "create");
  expect(wrapper.find(".project-back").exists()).toBe(false);
  expect(wrapper.text()).not.toContain("Open a chat about this run");
  expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.find('[data-test="resume-scheduled-session"]').text()).toBe("Resume Session");
  await wrapper.get('[data-test="resume-scheduled-session"]').trigger("click");
  await flushPromises();
  expect(wrapper.find(".scheduled-page").exists()).toBe(false);
  expect(routeUrl().pathname).toContain("/chat/cron_audit_20260101_000000");
  expect(create).not.toHaveBeenCalled();
  expect(send).not.toHaveBeenCalled();
  await wrapper.get("#profile-field").setValue("beta");
  await flushPromises();
  expect((wrapper.get(".composer textarea").element as HTMLTextAreaElement).value).toBe("");
  await wrapper.get(".scheduled-nav").trigger("click");
  await flushPromises();
  await flushPromises();
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.find('[data-test="resume-scheduled-session"]').exists()).toBe(false);
  expect(routeUrl().searchParams.get("profile")).toBe("beta");
  expect(create).not.toHaveBeenCalled();
  wrapper.unmount();
});

it.each([
  { messages: [], output: "Saved output without a session" },
  { messages: [] },
  { messages: [], session_id: "" },
])("does not offer Resume session without a persisted session: %j", async (output) => {
  setup();
  vi.spyOn(api, "scheduledOutput").mockResolvedValue(output);
  history.replaceState({}, "", "/chathermes#/scheduled/audit/output:2026-01-01_00-00-00");
  const wrapper = mount(App);
  await flushPromises();
  await flushPromises();
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.find('[data-test="resume-scheduled-session"]').exists()).toBe(false);
  expect(wrapper.get('[data-test="refresh-scheduled"]').attributes("disabled")).toBeUndefined();
  await wrapper.get('[aria-label="Screen options"]').trigger("keydown", { key: "Escape" });
  expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  wrapper.unmount();
});
it("offers exactly one action for the output session, preserving its profile without creating a chat", async () => {
  setup();
  // The output's persisted session is authoritative, independently of the run URL.
  vi.spyOn(api, "scheduledOutput").mockResolvedValue({
    messages: [],
    output: "Saved security audit",
    session_id: "persisted_audit_session",
  });
  const create = vi.spyOn(api, "create");
  history.replaceState(
    {},
    "",
    "/chathermes#/scheduled/audit/cron_audit_20260101_000000?profile=beta",
  );
  const wrapper = mount(App);
  await flushPromises();
  await flushPromises();
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  const actions = wrapper
    .findAll('[role="menuitem"]')
    .filter((row) => row.text() === "Resume Session");
  expect(actions).toHaveLength(1);
  expect(actions[0]!.attributes("disabled")).toBeUndefined();
  await wrapper.get('[data-test="resume-scheduled-session"]').trigger("click");
  await flushPromises();
  expect(routeUrl().pathname).toBe("/chat/persisted_audit_session");
  expect(routeUrl().searchParams.get("profile")).toBe("beta");
  expect(create).not.toHaveBeenCalled();
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.find('[data-test="resume-scheduled-session"]').exists()).toBe(false);
  wrapper.unmount();
});

it("hides resume and disables refresh while output loads, then clears a previously persisted session", async () => {
  setup();
  let finish!: (output: { messages: []; session_id?: string }) => void;
  const output = vi.spyOn(api, "scheduledOutput").mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  history.replaceState({}, "", "/chathermes#/scheduled/audit/cron_audit_20260101_000000");
  const wrapper = mount(App);
  await flushPromises();
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.find('[data-test="resume-scheduled-session"]').exists()).toBe(false);
  expect(wrapper.get('[data-test="refresh-scheduled"]').attributes("disabled")).toBeDefined();
  expect(wrapper.get(".composer textarea").attributes("disabled")).toBeUndefined();
  finish({ messages: [], session_id: "persisted_audit_session" });
  await flushPromises();
  expect(wrapper.findAll('[data-test="resume-scheduled-session"]')).toHaveLength(1);
  output.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  await wrapper.get('[data-test="refresh-scheduled"]').trigger("click");
  await flushPromises();
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.find('[data-test="resume-scheduled-session"]').exists()).toBe(false);
  expect(wrapper.get('[data-test="refresh-scheduled"]').attributes("disabled")).toBeDefined();
  finish({ messages: [] });
  await flushPromises();
  expect(wrapper.find('[data-test="resume-scheduled-session"]').exists()).toBe(false);
  expect(wrapper.get('[data-test="refresh-scheduled"]').attributes("disabled")).toBeUndefined();
  wrapper.unmount();
});
