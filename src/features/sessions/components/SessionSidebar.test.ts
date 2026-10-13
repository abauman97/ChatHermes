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
