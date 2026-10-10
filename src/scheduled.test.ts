// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import App from "./App.vue";
import * as nativeSession from "./features/chat/runtime/native-session";
import { api } from "./services/hermes-api";
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState({}, "", "/");
});
it("puts Scheduled below Projects, gates sending and drafts a separate chat", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      let value: unknown = { sessions: [], total: 0 };
      if (url.includes("/profiles")) value = { profiles: [{ name: "beta" }] };
      else if (url.includes("/projects")) value = { projects: [], scoped_session_ids: [] };
      else if (url.includes("/scheduled/output"))
        value = { messages: [], output: "Saved security audit" };
      else if (url.includes("/scheduled/runs"))
        value = {
          runs: [{ id: "output:2026-01-01_00-00-00", started_at: 100, source: "cron_output" }],
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
  expect(location.search).toContain("view=scheduled");
  expect(wrapper.get(".composer textarea").attributes("disabled")).toBeUndefined();
  await wrapper.get(".composer textarea").setValue("Do not send here");
  expect(wrapper.get('[aria-label="Send message"]').attributes("disabled")).toBeDefined();
  expect(send).not.toHaveBeenCalled();
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  const create = vi.spyOn(api, "create").mockRejectedValueOnce(new Error("private details"));
  await wrapper
    .findAll("button")
    .find((row) => row.text() === "Open a chat about this run")!
    .trigger("click");
  await flushPromises();
  expect(wrapper.get('.scheduled-page [role="alert"]').text()).toContain("Could not open a chat");
  expect(wrapper.text()).not.toContain("private details");
  create.mockRestore();
  await wrapper
    .findAll("button")
    .find((row) => row.text() === "Open a chat about this run")!
    .trigger("click");
  await flushPromises();
  expect(wrapper.find(".scheduled-page").exists()).toBe(false);
  expect((wrapper.get(".composer textarea").element as HTMLTextAreaElement).value).toContain(
    "Saved security audit",
  );
  expect(location.search).toContain("session=new_chat");
  expect(send).not.toHaveBeenCalled();
  await wrapper.get("#profile-field").setValue("beta");
  await flushPromises();
  expect((wrapper.get(".composer textarea").element as HTMLTextAreaElement).value).toBe("");
  await wrapper.get(".scheduled-nav").trigger("click");
  await flushPromises();
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  let finish!: (value: { id: string }) => void;
  vi.spyOn(api, "create").mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  await wrapper
    .findAll("button")
    .find((row) => row.text() === "Open a chat about this run")!
    .trigger("click");
  await flushPromises();
  await wrapper.get("#profile-field").setValue("");
  await flushPromises();
  expect(wrapper.get(".drawer-chat").attributes("disabled")).toBeUndefined();
  finish({ id: "stale_profile_draft" });
  await flushPromises();
  expect(new URLSearchParams(location.search).get("session")).toBeNull();
  expect((wrapper.get(".composer textarea").element as HTMLTextAreaElement).value).toBe("");
  wrapper.unmount();
});
