// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import App from "./App.vue";

const json = (value: unknown) =>
  new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

beforeEach(() => {
  history.replaceState({}, "", "/chathermes?profile=alpha");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState({}, "", "/chathermes");
  localStorage.clear();
});

describe("project chat header", () => {
  it("shows the session title with its project name below it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string, init?: RequestInit) => {
        if (input.endsWith("/profiles")) return json({ profiles: [{ name: "alpha" }] });
        if (/\/projects(?:\?|$)/.test(input))
          return json({
            projects: [
              {
                id: "p1",
                label: "Hermes Mobile",
                path: "/workspace",
                sessionCount: 1,
                repos: [
                  {
                    id: "r1",
                    label: "Repo",
                    groups: [
                      {
                        id: "g1",
                        label: "Group",
                        sessions: [{ id: "s1", title: "Investigate mobile flow" }],
                      },
                    ],
                  },
                ],
                previewSessions: [{ id: "s1", title: "Investigate mobile flow" }],
                sessionIds: ["s1"],
              },
            ],
            scoped_session_ids: ["s1"],
          });
        if (input.includes("/api/sessions?"))
          return json({ sessions: [{ id: "s1", title: "Investigate mobile flow" }], total: 1 });
        if (input.includes("/capabilities")) return json({ features: {}, endpoints: {} });
        if (input.includes("/models")) return json({ data: [] });
        if (input.includes("/workspace/sessions/s1"))
          return json({ session: { id: "s1", title: "Investigate mobile flow" }, messages: [] });
        if (input.includes("/api/sessions/s1"))
          return json({ session: { id: "s1", title: "Investigate mobile flow" } });
        if (input.includes("/sessions/s1/messages")) return json({ messages: [] });
        if (input.includes("/sessions")) return json({ sessions: [], total: 0 });
        if (input.includes("/projects/detail?"))
          return json({
            project: {
              id: "p1",
              label: "Hermes Mobile",
              path: "/workspace",
              sessionCount: 1,
              repos: [
                {
                  id: "r1",
                  label: "Repo",
                  groups: [
                    {
                      id: "g1",
                      label: "Group",
                      sessions: [{ id: "s1", title: "Investigate mobile flow" }],
                    },
                  ],
                },
              ],
              previewSessions: [{ id: "s1", title: "Investigate mobile flow" }],
              sessionIds: ["s1"],
            },
          });
        if (input.includes("/projects/session?"))
          return json({ session: { id: "s1", title: "Investigate mobile flow" } });
        if (input.includes("/projects/") && init?.method === "POST") return json({});
        if (input.includes("/projects?") || input.endsWith("/projects"))
          return json({
            projects: [
              {
                id: "p1",
                label: "Hermes Mobile",
                path: "/workspace",
                sessionCount: 1,
                repos: [
                  {
                    id: "r1",
                    label: "Repo",
                    groups: [
                      {
                        id: "g1",
                        label: "Group",
                        sessions: [{ id: "s1", title: "Investigate mobile flow" }],
                      },
                    ],
                  },
                ],
                previewSessions: [{ id: "s1", title: "Investigate mobile flow" }],
                sessionIds: ["s1"],
              },
            ],
            scoped_session_ids: ["s1"],
          });
        return json({});
      }),
    );
    history.replaceState({}, "", "/chathermes?profile=alpha&project=p1&session=s1");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".header-title").text()).toBe("Investigate mobile flow");
    await wrapper.findAll(".session-select")[0]!.trigger("click");
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Hermes Mobile");
    wrapper.unmount();
  });
});
