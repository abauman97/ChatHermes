import { describe, expect, it } from "vite-plus/test";
import { normalizeRequest } from "./chat-requests";
describe("request UI boundary", () => {
  it("uses the transport envelope ID, never the nested approval ID", () => {
    expect(
      normalizeRequest({
        id: "envelope",
        method: "approval",
        params: { request_id: "nested", command: "redacted", choices: ["once", "deny"] },
      }),
    ).toEqual({
      id: "envelope",
      kind: "approval",
      params: { command: "redacted", choices: ["once", "deny"] },
    });
  });
  it.each([
    { method: "approval", params: { choices: ["unknown"], command: { secret: "hidden" } } },
    { method: "clarify", params: { questions: [{ qid: "q", question: "text", choices: [42] }] } },
    {
      method: "clarify",
      params: { questions: [{ qid: "q", question: "text", multi_select: "yes" }] },
    },
    { method: "secret", params: { prompt: { private: "data" }, env_var: "KEY" } },
    { method: "new-method", params: { private: "data" } },
  ])("handles malformed or unsupported $method without exposing params", ({ method, params }) => {
    expect(normalizeRequest({ id: "one", method, params })).toEqual({
      id: "one",
      kind: "unsupported",
    });
  });
  it("normalizes clarification choices and secret labels using pinned payload shapes", () => {
    const questions = [{ qid: "q", question: "Choose", choices: ["A", "B"], multi_select: true }];
    expect(normalizeRequest({ id: "q", method: "clarify", params: { questions } })).toMatchObject({
      kind: "clarify",
      params: { questions },
    });
    expect(
      normalizeRequest({
        id: "s",
        method: "secret",
        params: { prompt: "Enter key", env_var: "KEY", metadata: { private: "hidden" } },
      }),
    ).toEqual({ id: "s", kind: "secret", params: { prompt: "Enter key", env_var: "KEY" } });
  });
});
