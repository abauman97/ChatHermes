// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount as vueMount } from "@vue/test-utils";
import { createChatHermesRouter } from "../../../router";
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
import ScheduledPage from "./ScheduledPage.vue";
import { api } from "../../../services/hermes-api";
beforeEach(() => history.replaceState({}, "", "/chathermes#/scheduled"));
const job = { id: "audit", name: "Security Audit", state: "active" };
const recent = { id: "cron_audit_20260102_000000", started_at: 200, ended_at: 210, source: "cron" };
afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState({}, "", "/");
});
function setup() {
  vi.spyOn(api, "scheduled").mockResolvedValue({
    jobs: [
      job,
      { ...job, id: "paused", name: "Paused audit", state: "paused" },
      { ...job, id: "done", name: "Completed audit", state: "completed" },
    ],
  });
  vi.spyOn(api, "scheduledRuns").mockResolvedValue({
    runs: [recent],
    offset: 0,
    limit: 30,
    has_more: true,
  });
  vi.spyOn(api, "scheduledOutput").mockResolvedValue({
    messages: [{ role: "assistant", content: "# Full audit\nAll clear" }],
  });
}
it("filters jobs, pages history, renders real output without return or discussion buttons", async () => {
  setup();
  const wrapper = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  expect(wrapper.get('[aria-label="Scheduled jobs"]').text()).toBe("Security AuditScheduled job›");
  await wrapper.get("select").setValue("paused");
  expect(wrapper.text()).toContain("Paused audit");
  await wrapper.get("select").setValue("completed");
  expect(wrapper.text()).toContain("Completed audit");
  await wrapper.get("select").setValue("active");
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await flushPromises();
  expect(wrapper.find(".project-back").exists()).toBe(false);
  expect(wrapper.text()).not.toContain("Refresh");
  expect(api.scheduledRuns).toHaveBeenCalledWith("beta", "audit", 0, expect.any(AbortSignal));
  vi.mocked(api.scheduledRuns).mockResolvedValue({
    runs: [{ ...recent, id: "old", started_at: 100 }],
    offset: 1,
    limit: 30,
    has_more: false,
  });
  await wrapper
    .findAll("button")
    .find((row) => row.text() === "Load older runs")!
    .trigger("click");
  await flushPromises();
  await flushPromises();
  expect(api.scheduledRuns).toHaveBeenLastCalledWith("beta", "audit", 1, expect.any(AbortSignal));
  expect(wrapper.findAll(".scheduled-list button")).toHaveLength(2);
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await flushPromises();
  expect(wrapper.get(".markdown-content h1").text()).toBe("Full audit");
  expect(routeUrl().pathname).toContain("/scheduled/audit/cron_audit_");
  expect(wrapper.find(".project-back").exists()).toBe(false);
  expect(wrapper.text()).not.toContain("Open a chat about this run");
  expect(wrapper.text()).not.toContain("Refresh");
  wrapper.unmount();
});
it("ignores late output after going back and aborts on unmount", async () => {
  setup();
  let finish!: (value: { messages: { role: string; content: string }[] }) => void;
  vi.mocked(api.scheduledOutput).mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const wrapper = mount(ScheduledPage, { props: { profile: "" } });
  await flushPromises();
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await flushPromises();
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await flushPromises();
  const signal = vi.mocked(api.scheduledOutput).mock.calls[0]![3]!;
  await wrapper.vm.$router.push({ name: "scheduled-job", params: { jobId: "audit" } });
  await flushPromises();
  finish({ messages: [{ role: "assistant", content: "stale" }] });
  await flushPromises();
  expect(signal.aborted).toBe(true);
  expect(wrapper.text()).not.toContain("stale");
  wrapper.unmount();
});
it("handles unavailable history and retries", async () => {
  setup();
  vi.mocked(api.scheduled).mockRejectedValueOnce(new Error("internal"));
  const wrapper = mount(ScheduledPage, { props: { profile: "" } });
  await flushPromises();
  expect(wrapper.get('[role="alert"]').text()).not.toContain("internal");
  await wrapper.get('[role="alert"] button').trigger("click");
  await flushPromises();
  await flushPromises();
  expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  expect(wrapper.text()).toContain("Security Audit");
  wrapper.unmount();
});
it("restores older output directly from a URL without requiring its history page", async () => {
  setup();
  history.replaceState(
    {},
    "",
    "/chathermes?profile=default#/scheduled/audit/output%3A2025-01-01_00-00-00",
  );
  vi.mocked(api.scheduledOutput).mockResolvedValue({
    messages: [],
    output: "Older saved audit",
    started_at: 1735689600,
  });
  const wrapper = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  expect(api.scheduledOutput).toHaveBeenCalledWith(
    "beta",
    "audit",
    "output:2025-01-01_00-00-00",
    expect.any(AbortSignal),
  );
  expect(wrapper.text()).toContain("Older saved audit");
  expect(wrapper.text()).not.toContain("1970");
  wrapper.unmount();
});

it("shows only the final assistant result from a saved session", async () => {
  setup();
  vi.mocked(api.scheduledOutput).mockResolvedValue({
    session_id: "cron_audit_20260102_000000",
    messages: [
      { role: "user", content: "Original prompt" },
      { role: "assistant", content: "Intermediate response" },
      { role: "assistant", content: "Final result" },
    ],
  });
  history.replaceState({}, "", "/chathermes#/scheduled/audit/cron_audit_20260102_000000");
  const wrapper = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  await flushPromises();
  expect(wrapper.text()).toContain("Final result");
  expect(wrapper.text()).not.toContain("Original prompt");
  expect(wrapper.text()).not.toContain("Intermediate response");
  expect(wrapper.vm.$.exposed?.sessionId?.value).toBe("cron_audit_20260102_000000");
  wrapper.unmount();
});

it("prefers the final assistant message to stale saved output when both exist", async () => {
  setup();
  vi.mocked(api.scheduledOutput).mockResolvedValue({
    output: "Stale cached output",
    session_id: "cron_audit_20260102_000000",
    messages: [
      { role: "assistant", content: "Intermediate response" },
      { role: "assistant", content: "Final transcript result" },
    ],
  });
  history.replaceState({}, "", "/chathermes#/scheduled/audit/cron_audit_20260102_000000");
  const wrapper = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  await flushPromises();
  expect(wrapper.text()).toContain("Final transcript result");
  expect(wrapper.text()).not.toContain("Stale cached output");
  expect(wrapper.text()).not.toContain("Intermediate response");
  wrapper.unmount();
});

it("keeps scheduled job rows compact without expanding prompts", async () => {
  setup();
  vi.mocked(api.scheduled).mockResolvedValue({
    jobs: [
      {
        ...job,
        prompt: "A very long private task prompt that should not be duplicated in the job list",
      },
    ],
  });
  const wrapper = mount(ScheduledPage, { props: { profile: "" } });
  await flushPromises();
  const row = wrapper.get(".scheduled-job-row");
  expect(row.text()).toContain("Security Audit");
  expect(row.text()).not.toContain("very long private task prompt");
  expect(row.classes()).toContain("scheduled-job-row");
  wrapper.unmount();
});
