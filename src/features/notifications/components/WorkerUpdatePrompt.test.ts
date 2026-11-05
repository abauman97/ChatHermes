// @vitest-environment jsdom
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, it, vi } from "vite-plus/test";
import WorkerUpdatePrompt from "./WorkerUpdatePrompt.vue";
import type { WorkerUpdateState } from "../services/workerUpdates";

const h = vi.hoisted(() => ({
  publish: undefined as ((state: WorkerUpdateState, fresh: boolean) => void) | undefined,
  update: vi.fn(),
  dispose: vi.fn(),
}));
vi.mock("../services/push", () => ({ workerRegistration: async () => ({}) }));
vi.mock("../services/workerUpdates", () => ({
  watchWorkerUpdates: (_registration: unknown, _container: unknown, publish: typeof h.publish) => {
    h.publish = publish;
    publish!({ available: true, busy: false, error: "" }, true);
    return { update: h.update, dispose: h.dispose };
  },
}));
afterEach(() => vi.clearAllMocks());
it("warns without stealing focus, dismisses without activation, and permits a later explicit update", async () => {
  const input = document.createElement("textarea");
  document.body.append(input);
  input.focus();
  const wrapper = mount(WorkerUpdatePrompt, { attachTo: document.body });
  await flushPromises();
  expect(wrapper.get('[role="dialog"]').text()).toContain(
    "Update reloads this tab and may interrupt drafts",
  );
  expect(document.activeElement).toBe(input);
  await wrapper.findAll("button")[0]!.trigger("click");
  expect(h.update).not.toHaveBeenCalled();
  expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  h.publish!({ available: true, busy: false, error: "" }, false);
  await flushPromises();
  expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  await wrapper.get("button").trigger("click");
  expect(wrapper.get('[role="dialog"]').text()).toContain(
    "Other tabs will not reload automatically",
  );
  await wrapper.findAll("button")[1]!.trigger("click");
  expect(h.update).toHaveBeenCalledTimes(1);
  wrapper.unmount();
  expect(h.dispose).toHaveBeenCalledTimes(1);
  input.remove();
});
