import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
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
  for (const selected of ["alpha", "beta"]) {
    await authenticate(page, `${origin}/chathermes?profile=${selected}#/inbox?profile=${selected}`);
    const inbox = page.getByRole("region", { name: "Inbox", exact: true });
    for (const profile of ["alpha", "beta"])
      await expect(inbox.locator(`li[data-session="${sessions[profile]}"]`)).toHaveCount(1);
    await page.reload();
    for (const profile of ["alpha", "beta"])
      await expect(inbox.locator(`li[data-session="${sessions[profile]}"]`)).toHaveCount(1);
    await page.screenshot({ path: info.outputPath(`inbox-${selected}.png`) });
    await inbox.getByRole("combobox", { name: "Inbox view" }).selectOption("profile");
    await expect(inbox.locator(`li[data-session="${sessions[selected]}"]`)).toHaveCount(1);
    const other = selected === "alpha" ? "beta" : "alpha";
    await expect(inbox.locator(`li[data-session="${sessions[other]}"]`)).toHaveCount(0);
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
  const alphaItem = inbox.locator(`li[data-session="${sessions.alpha}"] .inbox-open`);
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

test("Inbox profile filtering remains responsive across repeated reloads", async ({
  page,
}, info) => {
  const origin = new URL(page.url()).origin;
  const { runtime } = await import("./helpers");
  const sessions = runtime(
    `
import json, sys, time
sys.path.insert(0, '/opt/data/plugins')
from hermes_cli.web_server_sessions import _open_session_db_for_profile
from chathermes.dashboard import inbox, push_store
result = {}
for profile in ('alpha', 'beta'):
    sid = 'inbox-filter-' + profile + '-' + sys.argv[1]
    db = _open_session_db_for_profile(profile, read_only=False)
    db.create_session(sid, source='desktop')
    db.set_session_title(sid, 'Filter regression ' + profile + ' ' + sys.argv[1])
    identity = db.append_message(sid, 'assistant', 'Saved filter response ' + profile)
    db.close()
    inbox.record(push_store, profile, sid, str(identity), 'turn.complete', occurred=time.time(), title='Filter regression ' + profile, preview='Saved filter response ' + profile)
    result[profile] = sid
print(json.dumps(result))
`,
    randomUUID(),
  ) as Record<string, string>;
  const evidence: object[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/api/plugins/chathermes/inbox")
      evidence.push({ event: "request", query: Object.fromEntries(url.searchParams) });
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.pathname === "/api/plugins/chathermes/project-events")
      evidence.push({
        event: "metadata stream response",
        profile: url.searchParams.get("profile"),
        status: response.status(),
      });
  });
  try {
    for (let visit = 0; visit < 6; visit++) {
      // More than the pinned runtime's four per-profile hosted-request workers.
      // Leaving/reloading must release subscriptions, not strand ordinary reads.
      // Exit the document: a hash-only visit keeps a focused mobile draft's
      // compact composer, where authenticate's model button is hidden.
      await page.goto(origin + "/");
      await authenticate(page, `${origin}/chathermes?profile=alpha#/inbox?profile=alpha`);
      const inbox = page.getByRole("region", { name: "Inbox", exact: true });
      for (const profile of ["alpha", "beta"])
        await expect(inbox.locator(`li[data-session="${sessions[profile]}"]`)).toHaveCount(1);
      await page.reload();
      for (const profile of ["alpha", "beta"])
        await expect(inbox.locator(`li[data-session="${sessions[profile]}"]`)).toHaveCount(1);
      const started = Date.now();
      evidence.push({ visit, event: "before selection", hash: new URL(page.url()).hash });
      const filtered = page.waitForResponse(
        (response) => {
          const url = new URL(response.url());
          return (
            url.pathname === "/api/plugins/chathermes/inbox" &&
            url.searchParams.get("scope") === "profile" &&
            url.searchParams.get("profile") === "alpha" &&
            url.searchParams.get("unread") === "true"
          );
        },
        { timeout: 10000 },
      );
      await inbox.getByRole("combobox", { name: "Inbox view" }).selectOption("profile");
      await expect(page).toHaveURL(/#\/inbox\?profile=alpha&scope=profile$/);
      evidence.push({
        visit,
        event: "selected route",
        hash: new URL(page.url()).hash,
        select: await inbox.getByRole("combobox", { name: "Inbox view" }).inputValue(),
      });
      const response = await filtered;
      expect(response.status()).toBe(200);
      const data = (await response.json()) as InboxPage;
      evidence.push({
        visit,
        event: "filtered response",
        elapsedMs: Date.now() - started,
        status: response.status(),
        profiles: [...new Set(data.items.map((item) => item.profile))],
      });
      expect(data.items.some((item) => item.session === sessions.alpha)).toBe(true);
      expect(data.items.every((item) => item.profile === "alpha")).toBe(true);
      await expect(inbox.locator(`li[data-session="${sessions.alpha}"]`)).toHaveCount(1);
      await expect(inbox.locator(`li[data-session="${sessions.beta}"]`)).toHaveCount(0);
      await expect(inbox.getByRole("combobox", { name: "Inbox view" })).toHaveValue("profile");
      const composer = page.getByRole("textbox", { name: "Message Hermes" });
      await composer.fill("Filter draft");
      await expect(composer).toBeFocused();
      if (visit === 5) await page.screenshot({ path: info.outputPath("inbox-filtered.png") });
    }
  } finally {
    evidence.push({
      event: "final UI",
      hash: new URL(page.url()).hash,
      rows: await page
        .locator('[aria-label="Inbox"] li .text-xs span')
        .allTextContents()
        .catch(() => null),
    });
    const evidencePath = info.outputPath("inbox-filter-evidence.json");
    await writeFile(evidencePath, JSON.stringify(evidence, null, 2));
    await info.attach("inbox-filter-evidence", {
      path: evidencePath,
      contentType: "application/json",
    });
  }
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
      let accept!: () => void;
      const accepted = new Promise<void>((resolve) => {
        accept = resolve;
      });
      page.on("websocket", (socket) => {
        const submissions = new Set<string | number>();
        socket.on("framesent", ({ payload }) => {
          try {
            const frame = JSON.parse(String(payload));
            if (frame.method === "prompt.submit") submissions.add(frame.id);
          } catch {
            /* Do not retain raw native frames. */
          }
        });
        socket.on("framereceived", ({ payload }) => {
          try {
            const frame = JSON.parse(String(payload));
            if (submissions.has(frame.id) && frame.result?.status === "streaming") accept();
          } catch {
            /* Do not retain raw native frames. */
          }
        });
      });
      await authenticate(page, `${origin}/chathermes?profile=${profile}#/?profile=${profile}`);
      await page
        .getByRole("textbox", { name: "Message Hermes" })
        .fill(`[${marker}] ${randomUUID()}`);
      await page.getByRole("button", { name: "Send message", exact: true }).click();
      const request = () =>
        requestText
          ? page.getByText(requestText, { exact: true })
          : page.getByRole("button", { name: answer, exact: true });
      await accepted;
      const session = sessionFromUrl(page.url())!;
      // Leave after real admission, before viewing the request marks its notice read.
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
        await row.locator(".inbox-open").click();
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

test("Home previews five latest messages and removes messages without opening on Home and Inbox", async ({
  page,
}, info) => {
  const origin = new URL(page.url()).origin;
  const { runtime } = await import("./helpers");
  const marker = randomUUID();
  const seeded = runtime(
    `
import json, sys, time
sys.path.insert(0, '/opt/data/plugins')
from hermes_cli.web_server_sessions import _open_session_db_for_profile
from chathermes.dashboard import inbox, push_store
result = []
for i in range(7):
    profile = 'alpha' if i % 2 == 0 else 'beta'
    sid = 'home-preview-' + sys.argv[1] + '-' + str(i)
    title = 'Quick message ' + str(i) + ' ' + sys.argv[1]
    db = _open_session_db_for_profile(profile, read_only=False)
    db.create_session(sid, source='desktop')
    db.set_session_title(sid, title)
    identity = db.append_message(sid, 'assistant', 'Saved quick response ' + str(i))
    db.close()
    inbox.record(push_store, profile, sid, str(identity), 'turn.complete', occurred=time.time()+i, title=title, preview='Saved quick response ' + str(i))
    result.append({'session':sid, 'profile':profile, 'title':title})
print(json.dumps(list(reversed(result))))
`,
    marker,
  ) as { session: string; profile: string; title: string }[];
  await authenticate(page, origin + "/chathermes");
  const home = page.getByRole("region", { name: "Recent inbox messages", exact: true });
  await expect(home.locator("li")).toHaveCount(5);
  await expect(home.locator("li").first()).toHaveAttribute("data-session", seeded[0]!.session);
  expect(
    await home
      .locator("li")
      .evaluateAll((rows) => rows.map((row) => row.getAttribute("data-session"))),
  ).toEqual(seeded.slice(0, 5).map((item) => item.session));
  await expect(home.getByRole("combobox")).toHaveCount(0);
  await expect(home.getByRole("button", { name: "Load More" })).toHaveCount(0);
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill("Keep this Home draft");
  await expect(composer).toBeFocused();
  await composer.blur();
  await page.screenshot({ path: info.outputPath("home-five-messages.png") });
  const first = seeded[0]!;
  const deletion = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname.startsWith("/api/plugins/chathermes/inbox/") &&
      url.searchParams.get("profile") === first.profile &&
      response.request().method() === "DELETE"
    );
  });
  await home.getByRole("button", { name: `Remove ${first.title} from inbox`, exact: true }).click();
  expect((await deletion).status()).toBe(200);
  await expect(home.locator("li")).toHaveCount(5);
  await expect(home.locator(`li[data-session="${first.session}"]`)).toHaveCount(0);
  await expect(home.locator(`li[data-session="${seeded[5]!.session}"]`)).toHaveCount(1);
  await expect(composer).toHaveValue("Keep this Home draft");
  await expect(page).toHaveURL(/#\/$/);
  await page.reload();
  await expect(home.locator(`li[data-session="${first.session}"]`)).toHaveCount(0);
  await home.locator(`li[data-session="${seeded[1]!.session}"] .inbox-open`).click();
  await expect(page.locator(".message.assistant")).toContainText("Saved quick response 5");
  await expect(page).toHaveURL(new RegExp(`chat/${seeded[1]!.session}\\?profile=beta`));
  await authenticate(page, origin + "/chathermes#/inbox?profile=alpha");
  const inbox = page.getByRole("region", { name: "Inbox", exact: true });
  await inbox.getByRole("combobox", { name: "Inbox view" }).selectOption("profile");
  const target = seeded[2]!;
  await expect(inbox.locator(`li[data-session="${target.session}"]`)).toBeVisible();
  await page.screenshot({ path: info.outputPath("inbox-remove-controls.png") });
  await inbox
    .getByRole("button", { name: `Remove ${target.title} from inbox`, exact: true })
    .click();
  await expect(inbox.locator(`li[data-session="${target.session}"]`)).toHaveCount(0);
  await expect(page).toHaveURL(/#\/inbox\?/);
  await page.reload();
  await expect(inbox.locator(`li[data-session="${target.session}"]`)).toHaveCount(0);
  const result = await page.request.get("/api/plugins/chathermes/inbox?profile=default&limit=100");
  const remaining = (await result.json()) as InboxPage;
  expect(
    remaining.items.some(
      (item) => item.session === first.session || item.session === target.session,
    ),
  ).toBe(false);
});
