// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import ArtifactCard from "./ArtifactCard.vue";

afterEach(() => vi.unstubAllGlobals());

it("keeps thumbnail requests stable across equivalent props and aborts on an origin change", async () => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ dataUrl: "data:image/png;base64,AA==" }),
  });
  vi.stubGlobal("fetch", fetch);
  const file = { path: "/tmp/chart.png", name: "chart.png", type: "image/png", sessionId: "one" };
  const wrapper = mount(ArtifactCard, { props: { file, profile: "work" } });
  await flushPromises();
  const firstSignal = fetch.mock.calls[0]![1].signal as AbortSignal;
  expect(fetch).toHaveBeenCalledTimes(1);

  await wrapper.setProps({ file: { ...file } });
  await flushPromises();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(firstSignal.aborted).toBe(false);

  await wrapper.setProps({ file: { ...file, sessionId: "two" } });
  await flushPromises();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(firstSignal.aborted).toBe(true);
  expect(fetch.mock.calls[1]![0]).toContain("session_id=two");

  const lastSignal = fetch.mock.calls[1]![1].signal as AbortSignal;
  wrapper.unmount();
  expect(lastSignal.aborted).toBe(true);
});
