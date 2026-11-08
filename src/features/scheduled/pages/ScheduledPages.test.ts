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
import { defineComponent, h, ref, toRef } from "vue";
import { RouterView } from "vue-router";
import { provideScheduled } from "../composables/useScheduledHistory";
const recentSession = vi.fn();
const ScheduledPage = defineComponent({
  props: { profile: { type: String, default: "" } },
  setup(props) {
    provideScheduled({
      profile: toRef(props, "profile"),
      offline: ref(false),
      creating: ref(false),
      recentSession,
    });
    return () => h("div", [h(RouterView), h(RouterView, { name: "actions" })]);
  },
});
import { api } from "../../../services/hermes-api";
beforeEach(() => history.replaceState({}, "", "/chathermes#/scheduled"));
const job = {
  id: "audit",
  name: "Security Audit",
  state: "active",
  last_run_at: "2026-10-17T14:30:00+00:00",
};
const recent = { id: "cron_audit_20260102_000000", started_at: 200, ended_at: 210, source: "cron" };
afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState({}, "", "/");
});
function setup() {
  vi.spyOn(api, "scheduled").mockResolvedValue({
    jobs: [
      job,
      { ...job, id: "paused", name: "Paused audit", state: "paused", last_run_at: undefined },
      { ...job, id: "done", name: "Completed audit", state: "completed", last_run_at: "invalid" },
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
  expect(wrapper.get('[aria-label="Scheduled jobs"]').text()).toBe(
    `Security AuditScheduled jobLast run: ${new Date(job.last_run_at).toLocaleString()}›`,
  );
  await wrapper.get("select").setValue("paused");
  await flushPromises();
  expect(wrapper.text()).toContain("Paused audit");
  expect(wrapper.get(".scheduled-job-row").text()).toContain("Never run");
  await wrapper.get("select").setValue("completed");
  await flushPromises();
  expect(wrapper.text()).toContain("Completed audit");
  expect(wrapper.get(".scheduled-job-row").text()).toContain("Last run date unavailable");
  await wrapper.get("select").setValue("active");
  await flushPromises();
  expect(api.scheduled).toHaveBeenCalledTimes(1);
  await wrapper.get(".scheduled-list button").trigger("click");
  await flushPromises();
  await flushPromises();
  expect(wrapper.find(".project-back").exists()).toBe(false);
  expect(wrapper.find(".scheduled-heading button").exists()).toBe(false);
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
  expect(wrapper.find(".scheduled-heading button").exists()).toBe(false);
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
  await wrapper.get('[data-test="resume-scheduled-session"]').trigger("click");
  expect(recentSession).toHaveBeenCalledWith("cron_audit_20260102_000000");
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

it("aborts superseded resource and profile reads without letting late output replace the page", async () => {
  setup();
  history.replaceState({}, "", "/chathermes#/scheduled/audit/first");
  const pending: Array<{
    signal: AbortSignal;
    finish: (value: { messages: []; output: string }) => void;
  }> = [];
  vi.mocked(api.scheduledOutput).mockImplementation(
    (_profile, _job, _run, signal) =>
      new Promise((finish) => {
        pending.push({ signal: signal!, finish });
      }),
  );
  const wrapper = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  await wrapper.vm.$router.push({
    name: "scheduled-run",
    params: { jobId: "audit", runId: "second" },
  });
  await flushPromises();
  expect(pending[0]!.signal.aborted).toBe(true);
  await wrapper.setProps({ profile: "alpha" });
  await flushPromises();
  expect(pending[1]!.signal.aborted).toBe(true);
  pending[0]!.finish({ messages: [], output: "Obsolete first output" });
  pending[1]!.finish({ messages: [], output: "Obsolete beta output" });
  pending[2]!.finish({ messages: [], output: "Current alpha output" });
  await flushPromises();
  expect(wrapper.text()).toContain("Current alpha output");
  expect(wrapper.text()).not.toContain("Obsolete");
  await wrapper.vm.$router.push({ name: "scheduled" });
  await flushPromises();
  expect(pending[2]!.signal.aborted).toBe(true);
  expect(wrapper.get('[aria-label="Scheduled jobs"]').text()).toContain("Security Audit");
  wrapper.unmount();
});

it("ignores trailing tool-call-only assistant rows and falls back to raw output when all responses are empty", async () => {
  setup();
  const output = vi.mocked(api.scheduledOutput).mockResolvedValue({
    output: "Stale output",
    messages: [
      {
        role: "assistant",
        content: [{ type: "text", text: "Final content-part response" }],
        reasoning: "Hidden reasoning",
      },
      { role: "tool", content: "Hidden tool result", tool_name: "terminal" },
      {
        role: "assistant",
        content: "   ",
        tool_calls: [{ id: "work", function: { name: "terminal", arguments: "{}" } }],
      },
    ],
  });
  history.replaceState({}, "", "/chathermes#/scheduled/audit/cron_audit_20260102_000000");
  const wrapper = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  await flushPromises();
  expect(wrapper.get(".message.assistant").text()).toBe("Final content-part response");
  expect(wrapper.find(".activity").exists()).toBe(false);
  expect(wrapper.text()).not.toContain("Hidden");
  expect(wrapper.text()).not.toContain("Stale output");
  wrapper.unmount();
  output.mockResolvedValue({
    messages: [
      { role: "assistant", content: " \n " },
      { role: "tool", content: "Internal result" },
    ],
    output: "Raw saved result",
  });
  const raw = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  await flushPromises();
  expect(raw.get(".message.assistant").text()).toBe("Raw saved result");
  expect(raw.text()).not.toContain("Internal result");
  raw.unmount();
});

it("opens only each saved run's framed response across run and profile changes", async () => {
  setup();
  // The authenticated API separates archives before credential redaction.
  const result = "# Current result 🦉\n\n## Response\n\nThis heading belongs to the answer.";
  vi.mocked(api.scheduledOutput).mockImplementation(async (profile, _job, run) => ({
    messages: [],
    output: profile === "beta" && run === "first" ? result : `${profile} ${run} result`,
  }));
  history.replaceState({}, "", "/chathermes#/scheduled/audit/first");
  const wrapper = mount(ScheduledPage, { props: { profile: "beta" } });
  await flushPromises();
  expect(wrapper.get(".message.assistant").text()).toContain("This heading belongs to the answer.");
  expect(wrapper.text()).not.toContain("Private prompt");
  expect(wrapper.text()).not.toContain("Quoted old result");
  expect(wrapper.text()).not.toContain("Characters:");
  await wrapper.vm.$router.push({
    name: "scheduled-run",
    params: { jobId: "audit", runId: "second" },
  });
  await flushPromises();
  expect(wrapper.get(".message.assistant").text()).toBe("beta second result");
  await wrapper.setProps({ profile: "alpha" });
  await flushPromises();
  expect(wrapper.get(".message.assistant").text()).toBe("alpha second result");
  expect(wrapper.text()).not.toContain("beta second result");
  wrapper.unmount();
});

it("explains that ambiguous archives, including failed runs, cannot be safely displayed", async () => {
  setup();
  vi.mocked(api.scheduledOutput).mockResolvedValue({ messages: [], output_status: "unverified" });
  history.replaceState({}, "", "/chathermes#/scheduled/audit/output:2026-01-01_00-00-00");
  const wrapper = mount(ScheduledPage);
  await flushPromises();
  expect(wrapper.text()).toContain(
    "Saved output or error diagnostics could not be safely separated",
  );
  expect(wrapper.text()).not.toContain("No output was saved");
  expect(wrapper.find(".message.assistant").exists()).toBe(false);
  wrapper.unmount();
});
