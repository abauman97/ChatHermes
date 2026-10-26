// @vitest-environment jsdom
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, it, vi } from "vite-plus/test";
import { api } from "../../../services/hermes-api";
import type { Project } from "../../../types/hermes";
import type { Artifact } from "../artifacts";
import ArtifactsPage from "./ArtifactsPage.vue";

const file = (name: string): Artifact => ({
  path: `/tmp/${name}.txt`,
  name,
  type: "text/plain",
  sessionId: name,
  sessionTitle: name,
});
const wrappers: ReturnType<typeof mount>[] = [];
const render = (props = {}) => {
  const wrapper = mount(ArtifactsPage, {
    props: { profile: "alpha", ...props },
    global: {
      stubs: {
        ArtifactCard: {
          props: ["file"],
          template: '<article class="artifact-card">{{file.name}}<slot name="footer" /></article>',
        },
      },
    },
  });
  wrappers.push(wrapper);
  return wrapper;
};
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

it("loads one indexed page, appends Load More, and refreshes from the first page", async () => {
  const pages = vi
    .spyOn(api, "artifacts")
    .mockResolvedValueOnce({ files: [file("first")], nextCursor: "next" })
    .mockResolvedValueOnce({ files: [file("second")], nextCursor: null })
    .mockResolvedValueOnce({ files: [file("fresh")], nextCursor: null });
  const histories = vi.spyOn(api, "messages");
  const sessions = vi.spyOn(api, "sessions");
  const wrapper = render();
  await flushPromises();
  expect(pages).toHaveBeenCalledTimes(1);
  expect(wrapper.findAll(".artifact-card")).toHaveLength(1);
  await wrapper
    .findAll("button")
    .find((button) => button.text() === "Load More")!
    .trigger("click");
  await flushPromises();
  expect(pages.mock.calls[1]?.slice(0, 3)).toEqual(["alpha", undefined, "next"]);
  expect(wrapper.findAll(".artifact-card")).toHaveLength(2);
  await wrapper
    .findAll("button")
    .find((button) => button.text() === "Refresh")!
    .trigger("click");
  await flushPromises();
  expect(pages.mock.calls[2]?.[2]).toBeUndefined();
  expect(wrapper.findAll(".artifact-card")).toHaveLength(1);
  expect(wrapper.text()).toContain("fresh");
  expect(histories).not.toHaveBeenCalled();
  expect(sessions).not.toHaveBeenCalled();
});

it("aborts and ignores stale profile/project requests and resets pagination", async () => {
  let finish!: (value: { files: Artifact[]; nextCursor: string | null }) => void;
  const pages = vi
    .spyOn(api, "artifacts")
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    )
    .mockResolvedValue({ files: [file("new")], nextCursor: null });
  const wrapper = render();
  await wrapper.setProps({ profile: "beta", project: { id: "project/path" } as Project });
  await flushPromises();
  expect(pages.mock.calls[0]?.[3]?.aborted).toBe(true);
  expect(pages.mock.calls[1]?.slice(0, 3)).toEqual(["beta", "project/path", undefined]);
  finish({ files: [file("stale")], nextCursor: "old" });
  await flushPromises();
  expect(wrapper.text()).toContain("new");
  expect(wrapper.text()).not.toContain("stale");
  expect(wrapper.text()).not.toContain("Load More");
  await wrapper.find(".artifact-card button").trigger("click");
  expect(wrapper.emitted("openSession")).toEqual([["new"]]);
});

it("keeps a loaded page available after a failed Load More and allows retry", async () => {
  vi.spyOn(api, "artifacts")
    .mockResolvedValueOnce({ files: [file("kept")], nextCursor: "next" })
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ files: [file("last")], nextCursor: null });
  const wrapper = render();
  await flushPromises();
  const more = () => wrapper.findAll("button").find((button) => button.text() === "Load More")!;
  await more().trigger("click");
  await flushPromises();
  expect(wrapper.find('[role="alert"]').text()).toBe("Could not load artifacts.");
  expect(wrapper.findAll(".artifact-card")).toHaveLength(1);
  await more().trigger("click");
  await flushPromises();
  expect(wrapper.findAll(".artifact-card")).toHaveLength(2);
});
