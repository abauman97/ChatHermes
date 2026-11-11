import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test, expect } from "./fixtures";
import { mockserverURL } from "../docker/compose.mjs";

type Expectation = {
  id: string;
  priority: number;
  httpRequest: { body: { jsonPath: string } };
  httpResponse: {
    body: string;
    connectionOptions?: unknown;
    delay?: { timeUnit: string; value: number };
  };
};

// Real delegate_task + terminal approval. Only inference is deterministic; no
// browser routes, session events, request envelopes or UI state are fabricated.
for (const [choice, label, outcome] of [
  ["once", "Allow once", "workflow-approved"],
  ["deny", "Deny", "(?i)(denied|blocked|rejected)"],
] as const) {
  test(`pending child approval stays actionable after parent completion and reload: ${choice}`, async ({
    page,
  }, info) => {
    const marker = `pending-parent-${randomUUID()}`;
    const child = `pending-child-${randomUUID()}`;
    const parentCall = `call_${marker}`;
    const childCall = `call_${child}`;
    const templates: Expectation[] = JSON.parse(
      await readFile(new URL("../docker/fixtures/inference.json", import.meta.url), "utf8"),
    );
    const template = templates.find((f) => f.id === "chathermes-approval")!;
    function sse(delta: object, finish: string) {
      const frame = (delta: object, finish_reason: string | null) =>
        `data: ${JSON.stringify({
          id: marker,
          object: "chat.completion.chunk",
          created: 1,
          model: "chathermes-test",
          choices: [{ index: 0, delta, finish_reason }],
        })}\n\n`;
      return frame(delta, null) + frame({}, finish) + "data: [DONE]\n\n";
    }
    async function install(
      suffix: string,
      matcher: string,
      delta: object,
      finish = "stop",
      delay = 0,
    ) {
      const fixture = structuredClone(template);
      fixture.id = marker + suffix;
      fixture.priority = 100;
      fixture.httpRequest.body.jsonPath = matcher;
      fixture.httpResponse.body = sse(delta, finish);
      delete fixture.httpResponse.connectionOptions;
      // Inference pacing orders the real child request before the parent final.
      // Assertions wait on observable state; this is not a setup/readiness sleep.
      if (delay) fixture.httpResponse.delay = { timeUnit: "MILLISECONDS", value: delay };
      const response = await fetch(`${mockserverURL()}/mockserver/expectation`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fixture),
      });
      expect(response.ok).toBe(true);
    }
    const call = (id: string, name: string, args: object) => ({
      role: "assistant",
      tool_calls: [
        { index: 0, id, type: "function", function: { name, arguments: JSON.stringify(args) } },
      ],
    });
    await install(
      "-parent",
      `$[?(@.messages[-1].role == 'user' && @.messages[-1].content =~ /(?s).*${marker}$/)]`,
      call(parentCall, "delegate_task", { tasks: [{ goal: child }] }),
      "tool_calls",
    );
    await install(
      "-child",
      `$[?(@.messages[-1].role == 'user' && @.messages[-1].content == '${child}')]`,
      call(childCall, "terminal", {
        command:
          'target=$(mktemp -d /tmp/chathermes-approval-XXXXXX); chmod 777 "$target"; printf workflow-approved',
      }),
      "tool_calls",
    );
    const final = "Parent complete while child awaits approval.";
    await install(
      "-parent-final",
      `$[?(@.messages[-1].role == 'tool' && @.messages[-1].tool_call_id == '${parentCall}')]`,
      { content: final },
      "stop",
      12000,
    );
    await install(
      "-child-final",
      `$[?(@.messages[-1].role == 'tool' && @.messages[-1].tool_call_id == '${childCall}')]`,
      { content: "Child finished after its approval decision." },
    );

    await install(
      "-parent-wake",
      `$[?(@.messages[-1].role == 'user' && @.messages[-1].content =~ /(?s).*ASYNC DELEGATION BATCH COMPLETE.*${child}.*/)]`,
      { content: "Delegated child settled." },
    );

    let pendingId = "";
    let completed = false;
    let canceled = false;
    let replayedIdle = false;
    const replies: { id: string; choice: string }[] = [];
    page.on("websocket", (ws) => {
      ws.on("framereceived", ({ payload }) => {
        for (const line of String(payload).split("\n")) {
          try {
            const f = JSON.parse(line);
            if (f.method === "approval") pendingId = f.id;
            if (f.method === "event" && f.params.type === "message.complete") completed = true;
            if (
              f.method === "event" &&
              f.params.type === "request.cancel" &&
              (f.params.payload.id || f.params.payload.request_id) === pendingId
            )
              canceled = true;
            if (
              pendingId &&
              f.result?.running === false &&
              f.result.open_requests?.some((r: { id: string }) => r.id === pendingId)
            )
              replayedIdle = true;
          } catch {
            /* Ignore unrelated frames; never retain raw tickets or params. */
          }
        }
      });
      ws.on("framesent", ({ payload }) => {
        try {
          const f = JSON.parse(String(payload));
          if (f.id === pendingId && f.result?.choice)
            replies.push({ id: f.id, choice: f.result.choice });
        } catch {
          /* Ignore unrelated traffic. */
        }
      });
    });
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill(marker);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    const allow = page.getByRole("button", { name: "Allow once", exact: true });
    await expect(allow).toBeVisible();
    await expect(allow).toBeEnabled();
    expect(pendingId).not.toBe("");
    const exactId = pendingId;
    await page.screenshot({ path: info.outputPath("parent-active.png") });
    await expect(page.locator(".message.assistant").last()).toContainText(final);
    expect(completed).toBe(true);
    expect(canceled).toBe(false);
    await expect(allow).toBeEnabled();
    await composer.fill("Draft while child awaits consent");
    await expect(composer).toBeFocused();
    await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
    await page.screenshot({ path: info.outputPath("parent-complete-pending.png") });
    await page.reload();
    await expect(allow).toBeEnabled();
    expect(replayedIdle).toBe(true);
    expect(pendingId).toBe(exactId);
    expect(canceled).toBe(false);
    await expect(page.locator(".live-request")).toContainText("Approval required");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath("reloaded-pending.png") });
    await page.context().setOffline(true);
    try {
      await expect(allow).toBeVisible();
      await expect(allow).toBeDisabled();
      await expect(page.getByRole("button", { name: "Deny", exact: true })).toBeDisabled();
      await composer.fill("Editable offline draft");
      await expect(composer).toBeFocused();
      expect(replies).toEqual([]);
      await page.screenshot({ path: info.outputPath("offline-pending.png") });
    } finally {
      await page.context().setOffline(false);
    }
    await expect(allow).toBeEnabled();
    expect(pendingId).toBe(exactId);
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(page.locator(".live-request")).toHaveCount(0);
    expect(replies).toEqual([{ id: exactId, choice }]);
    // Verify Hermes resumed this child's exact tool call with the chosen outcome,
    // rather than merely dismissing the card or sending a reply to another ID.
    await expect
      .poll(async () => {
        const response = await fetch(`${mockserverURL()}/mockserver/verify`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            httpRequest: {
              method: "POST",
              path: "/v1/chat/completions",
              body: {
                type: "JSON_PATH",
                jsonPath: `$[?(@.messages[-1].role == 'tool' && @.messages[-1].tool_call_id == '${childCall}' && @.messages[-1].content =~ /(?s).*${outcome}.*/)]`,
              },
            },
            times: { atLeast: 1 },
          }),
        });
        return response.ok;
      })
      .toBe(true);
    await expect(page.locator(".message.assistant").last()).toContainText(
      "Delegated child settled.",
    );
    await expect(page.locator(".live-request")).toHaveCount(0);
    expect(pendingId).toBe(exactId);
    expect(replies).toEqual([{ id: exactId, choice }]);
    await page.screenshot({ path: info.outputPath(`resolved-${choice}.png`) });
    console.log(
      JSON.stringify({
        target: info.project.name,
        pendingId: exactId,
        replayedIdle,
        replies,
        toolOutcomeVerified: true,
      }),
    );
  });
}
