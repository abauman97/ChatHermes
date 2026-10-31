import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { authenticate } from "../docker/prepare-browser.mjs";
import { sessionFromUrl } from "../visual/login";
import type { InboxPage } from "../../src/features/inbox/inbox";

test("global inbox collects closed-page responses across profiles without push and persists deletions", async ({
  page,
}, info) => {
  test.setTimeout(240000);
  const origin = new URL(page.url()).origin;
  const sessions: Record<string, string> = {};
  for (const profile of ["alpha", "beta"]) {
    await authenticate(page, `${origin}/chathermes?profile=${profile}#/?profile=${profile}`);
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill(`[workflow-stream] inbox-${profile}-${randomUUID()}`);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.locator(".message.assistant")).toContainText("First visible chunk.");
    sessions[profile] = sessionFromUrl(page.url())!;
    expect(sessions[profile]).toBeTruthy();
    // Leave the plugin before completion: the backend must continue collecting.
    await page.goto(origin + "/");
    await expect
      .poll(
        async () => {
          const response = await page.request.get("/api/plugins/chathermes/inbox?profile=default");
          if (!response.ok()) return false;
          const data = (await response.json()) as InboxPage;
          return data.items.some(
            (item) => item.profile === profile && item.session === sessions[profile],
          );
        },
        { timeout: 60000 },
      )
      .toBe(true);
  }
  await authenticate(page, `${origin}/chathermes?profile=default#/inbox?profile=default`);
  const inbox = page.getByRole("region", { name: "Inbox", exact: true });
  await expect(inbox).toBeVisible();
  await expect(inbox.getByRole("combobox", { name: "Inbox view" })).toHaveValue("all");
  await expect(inbox.getByText("Workflow conversation", { exact: false }).first()).toBeVisible();
  for (const profile of ["alpha", "beta"]) {
    await expect(inbox.locator(`li[data-session="${sessions[profile]}"]`)).toHaveCount(1);
  }
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill("Inbox draft");
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("inbox-all.png") });
  await page.getByRole("button", { name: "Screen options" }).click();
  await expect(page.getByRole("menuitem", { name: "New chat" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menuitem", { name: "New chat" })).toHaveCount(0);
  await inbox.getByRole("combobox", { name: "Inbox view" }).selectOption("profile");
  await expect(inbox.locator(`li[data-session="${sessions.alpha}"]`)).toHaveCount(0);
  await inbox.getByRole("combobox", { name: "Inbox view" }).selectOption("all");
  const alphaItem = inbox.locator(`li[data-session="${sessions.alpha}"] button`);
  await alphaItem.scrollIntoViewIfNeeded();
  await alphaItem.click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.", {
    timeout: 90000,
  });
  await expect(page).toHaveURL(new RegExp(`chat/${sessions.alpha}\\?profile=alpha`));
  await authenticate(page, `${origin}/chathermes?profile=default#/inbox?profile=default`);
  await expect(inbox.locator(`li[data-session="${sessions.alpha}"]`)).toHaveCount(0);
  await page.reload();
  await expect(inbox.locator(`li[data-session="${sessions.alpha}"]`)).toHaveCount(0);
  await expect(inbox.locator(`li[data-session="${sessions.beta}"]`)).toHaveCount(1);
  await page.screenshot({ path: info.outputPath("inbox-read-persistence.png") });
});

test("background reconciliation collects unobserved profile histories while the plugin is closed", async ({
  page,
}, info) => {
  test.setTimeout(180000);
  const origin = new URL(page.url()).origin;
  await page.goto(origin + "/");
  const suffix = randomUUID();
  const { runtime } = await import("./helpers");
  const sessions = runtime(
    `
import json, sys
from hermes_cli.web_server_sessions import _open_session_db_for_profile
result = {}
for profile in ('alpha', 'beta'):
    db = _open_session_db_for_profile(profile, read_only=False)
    sid = 'inbox-recovery-' + profile + '-' + sys.argv[1]
    db.create_session(sid, source='desktop')
    db.set_session_title(sid, 'Recovered ' + profile + ' ' + sys.argv[1])
    db.append_message(sid, 'user', 'Unobserved prompt')
    db.append_message(sid, 'assistant', 'Unobserved completed response in ' + profile)
    db.close()
    result[profile] = sid
print(json.dumps(result))
`,
    suffix,
  ) as Record<string, string>;
  await expect
    .poll(
      async () => {
        const result = await page.request.get(
          "/api/plugins/chathermes/inbox?profile=default&limit=100",
        );
        if (!result.ok()) return false;
        const data = (await result.json()) as InboxPage;
        return ["alpha", "beta"].every(
          (profile) =>
            data.items.filter(
              (item) => item.profile === profile && item.session === sessions[profile],
            ).length === 1,
        );
      },
      { timeout: 90000 },
    )
    .toBe(true);
  await authenticate(page, `${origin}/chathermes?profile=default#/inbox?profile=default`);
  const inbox = page.getByRole("region", { name: "Inbox", exact: true });
  await expect(
    inbox
      .locator(`li[data-session="${sessions.alpha}"]`)
      .getByText("Unobserved completed response in alpha", { exact: true }),
  ).toBeVisible();
  await expect(
    inbox
      .locator(`li[data-session="${sessions.beta}"]`)
      .getByText("Unobserved completed response in beta", { exact: true }),
  ).toBeVisible();
  await page.reload();
  for (const profile of ["alpha", "beta"])
    await expect(inbox.locator(`li[data-session="${sessions[profile]}"]`)).toHaveCount(1);
  await page.screenshot({ path: info.outputPath("inbox-reconciled.png") });
  // Opening a direct history link clears inbox state without an Inbox-item click.
  await authenticate(
    page,
    `${origin}/chathermes?profile=alpha#/chat/${sessions.alpha}?profile=alpha`,
  );
  await expect(page.locator(".message.assistant")).toContainText(
    "Unobserved completed response in alpha",
  );
  await expect
    .poll(async () => {
      const data = (await (
        await page.request.get("/api/plugins/chathermes/inbox?profile=alpha&limit=100")
      ).json()) as InboxPage;
      return data.items.some((item) => item.profile === "alpha" && item.session === sessions.alpha);
    })
    .toBe(false);
  await authenticate(page, `${origin}/chathermes#/inbox?profile=default`);
  await expect(inbox.locator(`li[data-session="${sessions.alpha}"]`)).toHaveCount(0);
  await expect(inbox.locator(`li[data-session="${sessions.beta}"]`)).toHaveCount(1);
});

for (const [kind, marker, requestText, answer] of [
  ["clarify", "workflow-clarify", "Choose a workflow direction", /^Proceed with workflow/],
  ["approval", "workflow-approval", "", "Allow once"],
] as const) {
  for (const opening of ["direct", "inbox"] as const) {
    test(`opening a native ${kind} session via ${opening} deletes its inbox notification and leaves the request pending`, async ({
      page,
    }, info) => {
      test.setTimeout(180000);
      const origin = new URL(page.url()).origin;
      const profile = kind === "approval" ? "alpha" : "beta";
      await authenticate(page, `${origin}/chathermes?profile=${profile}#/?profile=${profile}`);
      await page
        .getByRole("textbox", { name: "Message Hermes" })
        .fill(`[${marker}] ${randomUUID()}`);
      await page.getByRole("button", { name: "Send message", exact: true }).click();
      const request = () =>
        requestText
          ? page.getByText(requestText, { exact: true })
          : page.getByRole("button", { name: answer, exact: true });
      await expect(request()).toBeVisible({ timeout: 90000 });
      const session = sessionFromUrl(page.url())!;
      // Leave the session before the shell's visible refresh deletes its notices.
      await page.goto(origin + "/");
      const query = "/api/plugins/chathermes/inbox?profile=default&limit=100";
      let notificationId = 0;
      await expect
        .poll(async () => {
          const data = (await (await page.request.get(query)).json()) as InboxPage;
          const item = data.items.find(
            (item) => item.profile === profile && item.session === session && item.kind === kind,
          );
          if (item) notificationId = item.id;
          return !!item;
        })
        .toBe(true);
      // Observe the shell's real profile-scoped lookup and DELETE, rather than
      // allowing a hidden row or a different profile's mutation to satisfy this.
      const lookup = page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          url.pathname === "/api/plugins/chathermes/inbox" &&
          url.searchParams.get("profile") === profile &&
          url.searchParams.get("scope") === "profile" &&
          url.searchParams.get("limit") === "100"
        );
      });
      const deletion = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === `/api/plugins/chathermes/inbox/${notificationId}` &&
          new URL(response.url()).searchParams.get("profile") === profile &&
          response.request().method() === "DELETE",
      );
      if (opening === "direct") {
        await authenticate(
          page,
          `${origin}/chathermes?profile=${profile}#/chat/${session}?profile=${profile}`,
        );
      } else {
        await authenticate(page, `${origin}/chathermes?profile=default#/inbox?profile=default`);
        const row = page
          .getByRole("region", { name: "Inbox", exact: true })
          .locator(`li[data-session="${session}"]`);
        await expect(row).toHaveCount(1);
        await row.getByRole("button").click();
      }
      await expect(request()).toBeVisible({ timeout: 90000 });
      const [lookupResponse, deleteResponse] = await Promise.all([lookup, deletion]);
      expect(lookupResponse.status()).toBe(200);
      expect(((await lookupResponse.json()) as InboxPage).items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: notificationId, profile, session, kind }),
        ]),
      );
      expect(deleteResponse.status()).toBe(200);
      expect(await deleteResponse.json()).toEqual({ deleted: true });
      await expect
        .poll(async () => {
          const data = (await (await page.request.get(query)).json()) as InboxPage;
          return data.items.some((item) => item.profile === profile && item.session === session);
        })
        .toBe(false);
      await page.screenshot({ path: info.outputPath(`inbox-${kind}-read-still-pending.png`) });
      await page.reload();
      await expect(request()).toBeVisible({ timeout: 90000 });
      await expect
        .poll(async () => {
          const data = (await (await page.request.get(query)).json()) as InboxPage;
          return data.items.some((item) => item.profile === profile && item.session === session);
        })
        .toBe(false);
      await page.getByRole("button", { name: answer, exact: typeof answer === "string" }).click();
      await expect(page.locator(".message.assistant").last()).toContainText(
        kind === "clarify" ? "Clarification accepted." : "Approved once.",
      );
    });
  }
}
