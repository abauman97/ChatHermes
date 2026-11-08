// @vitest-environment jsdom
import { expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import SessionSidebar from "./SessionSidebar.vue";
import type { Project } from "../../../types/hermes";

it("uses authoritative project membership and updates labels when the profile tree changes", async () => {
  const sessions = [
    { id: "member", title: "In project", source: "gateway" },
    { id: "outside", title: "Outside", source: "gateway", cwd: "/repo" },
  ];
  const project: Project = {
    id: "project",
    label: "Example",
    path: "/repo",
    sessionCount: 1,
    repos: [],
    sessionIds: ["member"],
  };
  const wrapper = mount(SessionSidebar, {
    props: {
      sessions,
      selected: "",
      loading: false,
      error: "",
      hasMore: false,
      busy: false,
      projects: [
        project,
        { ...project, id: "none", label: "No project", isNoProject: true, sessionIds: ["outside"] },
      ],
    },
  });
  const rows = () => wrapper.findAll(".session-select");
  expect(rows()[0]!.text()).toContain("gateway · Example");
  expect(rows()[1]!.text()).not.toContain("·");
  await wrapper.setProps({
    projects: [
      {
        ...project,
        sessionIds: undefined,
        label: "Renamed",
        repos: [
          {
            id: "repo",
            label: "repo",
            groups: [{ id: "main", label: "main", sessions: [sessions[0]!] }],
          },
        ],
      },
    ],
  });
  expect(rows()[0]!.text()).toContain("gateway · Renamed");
  await wrapper.setProps({ projects: [] });
  expect(rows()[0]!.text()).not.toContain("·");
  wrapper.unmount();
});

it("offers status-aware menu actions and a separate touch-sized settlement button", async () => {
  const { vi } = await import("vite-plus/test");
  const originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
  const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
  });
  const wrapper = mount(SessionSidebar, {
    props: {
      sessions: [
        { id: "one", title: "One" },
        { id: "two", title: "Two" },
      ],
      selected: "one",
      loading: false,
      error: "",
      hasMore: false,
      busy: false,
      tracking: [{ session_id: "one", status: "open", updated_at: "2026-10-29" }],
    },
  });
  const control = wrapper.get('button[aria-label="Mark One settled"]');
  expect(control.classes()).toContain("min-h-[44px]");
  expect(control.classes()).toContain("min-w-[44px]");
  expect(control.find("svg").attributes("aria-hidden")).toBe("true");
  await control.trigger("click");
  expect(wrapper.emitted("track")).toEqual([["one", "settled"]]);
  expect(wrapper.emitted("select")).toBeUndefined();
  await wrapper.get('button[aria-label="Options for One"]').trigger("click");
  const action = () =>
    wrapper
      .findAll("dialog button")
      .find((button) => /Mark settled|Make active/.test(button.text()))!;
  expect(action().text()).toBe("Mark settled");
  await action().trigger("click");
  await wrapper.setProps({
    tracking: [{ session_id: "one", status: "settled", updated_at: "2026-10-29" }],
  });
  await wrapper.get('button[aria-label="Options for One"]').trigger("click");
  expect(action().text()).toBe("Make active");
  await action().trigger("click");
  await wrapper.get('button[aria-label="Options for Two"]').trigger("click");
  expect(action().text()).toBe("Make active");
  await action().trigger("click");
  expect(wrapper.emitted("track")?.at(-1)).toEqual(["two", "open"]);
  expect(wrapper.emitted("track")).toEqual([
    ["one", "settled"],
    ["one", "settled"],
    ["one", "open"],
    ["two", "open"],
  ]);
  for (const label of ["Rename", "Add to project", "Archive", "Delete"])
    expect(wrapper.find("dialog").text()).toContain(label);
  wrapper.unmount();
  if (originalShow) Object.defineProperty(HTMLDialogElement.prototype, "showModal", originalShow);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, "close", originalClose);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});

it("keeps selection, ordering and settlement independent of reactive unread presentation", async () => {
  const wrapper = mount(SessionSidebar, {
    props: {
      sessions: [
        { id: "one", title: "One" },
        { id: "two", title: "Two" },
      ],
      tracking: [{ session_id: "two", status: "open", updated_at: "2026-10-29" }],
      unreadSessions: new Set(["one"]),
      selected: "one",
      loading: false,
      error: "",
      hasMore: false,
      busy: false,
    },
  });
  const rows = () => wrapper.findAll(".session-select");
  expect(rows().map((row) => row.text())).toEqual([
    expect.stringContaining("Two"),
    expect.stringContaining("One"),
  ]);
  expect(rows()[1]!.attributes("aria-current")).toBe("page");
  await rows()[1]!.trigger("click");
  expect(wrapper.emitted("select")).toEqual([["one"]]);
  expect(rows()[1]!.find(".session-unread").exists()).toBe(true);
  await wrapper.setProps({ unreadSessions: new Set(["two"]) });
  expect(rows()[0]!.find(".font-semibold").text()).toBe("Two");
  expect(rows()[1]!.find(".font-semibold").exists()).toBe(false);
  expect(rows()[1]!.attributes("aria-current")).toBe("page");
  await wrapper.get(".settle-session").trigger("click");
  expect(wrapper.emitted("track")).toEqual([["two", "settled"]]);
  expect(wrapper.findAll("section").map((section) => section.attributes("aria-label"))).toEqual([
    "Active",
    "Recents",
  ]);
  wrapper.unmount();
});
