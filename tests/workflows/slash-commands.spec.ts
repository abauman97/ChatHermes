import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { runtime } from "./helpers";
import { sessionFromUrl } from "../visual/login";
import { mockserverURL } from "../docker/compose.mjs";

// Independent authenticated viewer; return only the fields under verification.
async function nativeRoute(page: import("@playwright/test").Page, stored: string) {
  return page.evaluate(async (stored) => {
    const { ticket } = await (await fetch("/api/auth/ws-ticket", { method: "POST" })).json();
    return new Promise<{
      model: string;
      provider: string;
      effort: string;
      configuredEffort: string;
    }>((resolve, reject) => {
      const url = new URL("/api/ws", location.href);
      url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
      const socket = new WebSocket(url, ["hermes-gateway-v1", `hermes-gateway-ticket.${ticket}`]);
      const finish = () => {
        clearTimeout(timer);
        socket.close();
      };
      const timer = setTimeout(() => {
        finish();
        reject(new Error("Native route read timed out"));
      }, 15000);
      socket.onopen = () =>
        socket.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: "route",
            method: "session.resume",
            params: { profile: "default", session_id: stored, source: "desktop" },
          }),
        );
      let info: { model: string; provider: string; reasoning_effort: string };
      socket.onmessage = (event) => {
        for (const line of String(event.data).split("\n").filter(Boolean)) {
          const frame = JSON.parse(line);
          if (!["route", "configured-effort"].includes(frame.id)) continue;
          if (frame.error) {
            finish();
            reject(new Error("Native route read failed"));
          } else if (frame.id === "route") {
            info = frame.result.info;
            // A fresh lazy session has no agent yet: its info effort is empty.
            // config.get also reads create_reasoning_override before first build.
            socket.send(
              JSON.stringify({
                jsonrpc: "2.0",
                id: "configured-effort",
                method: "config.get",
                params: {
                  profile: "default",
                  session_id: frame.result.session_id,
                  key: "reasoning",
                },
              }),
            );
          } else {
            finish();
            resolve({
              model: info.model,
              provider: info.provider,
              effort: info.reasoning_effort,
              configuredEffort: frame.result.value,
            });
          }
        }
      };
      socket.onerror = () => {
        finish();
        reject(new Error("Native route connection failed"));
      };
    });
  }, stored);
}

test("slash reasoning changes the live session and queries preserve the pending effort", async ({
  page,
}, info) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  const send = page.getByRole("button", { name: "Send message", exact: true });
  const output = page.getByRole("region", { name: "Command results" });
  await composer.fill("/reasoning high");
  await send.click();
  await expect(output).toContainText("Reasoning effort: high");
  const stored = sessionFromUrl(page.url())!;
  expect((await nativeRoute(page, stored)).configuredEffort).toBe("high");
  const picker = page.getByRole("button", { name: "Choose model", exact: true });
  const effort = page.getByRole("combobox", { name: "Reasoning effort", exact: true });
  await picker.click();
  await expect(effort).toHaveValue("high");
  await effort.selectOption("low");
  await effort.press("Escape");
  await composer.fill("/reasoning");
  await send.click();
  await expect(output).toContainText("/reasoning · temporary result");
  await picker.click();
  await expect(effort).toHaveValue("low");
  await page.screenshot({ path: info.outputPath("slash-reasoning-pending.png") });
  await effort.press("Escape");
  expect((await nativeRoute(page, stored)).configuredEffort).toBe("high");
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await send.click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  expect((await nativeRoute(page, stored)).effort).toBe("low");
  await page.reload();
  await expect(picker).toBeEnabled();
  await picker.click();
  await expect(effort).toHaveValue("low");
});

test("slash MoA runs reference and aggregator inference then restores the previous route", async ({
  page,
}, info) => {
  runtime(`import json
import hermes_yaml as yaml
from hermes_cli.profiles import get_profile_dir
p=get_profile_dir('default')/'config.yaml'; cfg=yaml.safe_load(p.read_text())
cfg['moa']={'default_preset':'default','presets':{'default':{'reference_models':[{'provider':'chathermes-test','model':'chathermes-moa-reference'}],'aggregator':{'provider':'chathermes-test','model':'chathermes-moa-aggregate'}}}}
p.write_text(yaml.safe_dump(cfg)); print(json.dumps(True))`);
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  const send = page.getByRole("button", { name: "Send message", exact: true });
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await send.click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  const stored = sessionFromUrl(page.url())!;
  const previous = await nativeRoute(page, stored);
  const marker = `moa-contract-${randomUUID()}`;
  await composer.fill(`/moa ${marker}`);
  await send.click();
  await expect(page.locator(".message.assistant").last()).toContainText("Synthetic MoA aggregate.");
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
  expect(await nativeRoute(page, stored)).toEqual(previous);
  // Read only matched synthetic inference; never print request bodies or headers.
  for (const model of ["chathermes-moa-reference", "chathermes-moa-aggregate"]) {
    const response = await fetch(`${mockserverURL()}/mockserver/retrieve?type=REQUESTS`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        method: "POST",
        path: "/v1/chat/completions",
        body: { type: "JSON", json: JSON.stringify({ model }), matchType: "ONLY_MATCHING_FIELDS" },
      }),
    });
    expect(response.ok).toBe(true);
    const requests = await response.json();
    expect(
      requests.some((request: { body: unknown }) => JSON.stringify(request.body).includes(marker)),
    ).toBe(true);
  }
  await page.screenshot({ path: info.outputPath("slash-moa-restored.png") });
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await send.click();
  await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
  expect(await nativeRoute(page, stored)).toEqual(previous);
});

for (const profile of ["default", "alpha"]) {
  test(`native slash discovery, skill execution and local controls (${profile})`, async ({
    page,
  }, info) => {
    test.setTimeout(180_000);
    let admitted = 0;
    page.on("websocket", (socket) =>
      socket.on("framesent", ({ payload }) => {
        try {
          if (JSON.parse(String(payload)).method === "prompt.submit") admitted++;
        } catch {
          /* unrelated frames */
        }
      }),
    );
    const name = `slash-${randomUUID().slice(0, 8)}`;
    runtime(
      `import json,sys
import hermes_yaml as yaml
from hermes_cli.profiles import get_profile_dir
home=get_profile_dir(sys.argv[1]); name=sys.argv[2]
p=home/'skills'/name; p.mkdir(parents=True)
(p/'SKILL.md').write_text('---\\nname: '+name+'\\ndescription: Synthetic slash contract skill\\n---\\nFollow the user task.\\n')
b=home/'skill-bundles'; b.mkdir(exist_ok=True)
(b/(name+'-bundle.yaml')).write_text('name: '+name+'-bundle\\ndescription: Synthetic slash bundle\\nskills: ['+name+']\\n')
config=home/'config.yaml'; settings=yaml.safe_load(config.read_text()) or {}
settings.setdefault('quick_commands',{})[name+'-quick']={'type':'exec','command':'printf slash-quick-ok','description':'Synthetic scoped quick command'}
settings['quick_commands'][name+'-alias']={'type':'alias','target':'status','description':'Synthetic scoped alias'}
config.write_text(yaml.safe_dump(settings))
print(json.dumps(True))`,
      profile,
      name,
    );
    const origin = new URL(page.url()).origin;
    await page.goto(`${origin}/chathermes?profile=${profile}#/?profile=${profile}`);
    const plugin = page.locator(".chathermes-embedded");
    const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
    const send = plugin.getByRole("button", { name: "Send message", exact: true });
    await composer.focus();
    await expect(composer).toBeFocused();
    await composer.fill("/");
    const menu = plugin.getByRole("listbox", { name: "Slash commands" });
    await expect(menu.getByRole("option").first()).toBeVisible();
    await page.screenshot({ path: info.outputPath(`slash-${profile}-menu.png`) });
    expect(sessionFromUrl(page.url())).toBeFalsy();
    await composer.fill(`/${name}`);
    const skill = menu.getByRole("option").filter({ hasText: "Synthetic slash contract skill" });
    await expect(skill).toBeVisible();
    if (info.project.name === "mobile") await skill.tap();
    else await skill.click();
    await expect(composer).toBeFocused();
    await expect(composer).toHaveValue("");
    const skillChip = page.getByRole("button", { name: `Edit skill /${name}`, exact: true });
    await expect(skillChip).toBeVisible();
    await skillChip.click();
    await expect(composer).toHaveValue(`/${name} `);
    expect(sessionFromUrl(page.url())).toBeFalsy();
    await composer.fill(`/goal use /${name}`);
    await expect(skill).toBeVisible();
    await expect(
      menu.getByRole("option").filter({ hasText: "Synthetic scoped quick command" }),
    ).toHaveCount(0);
    await expect(
      menu.getByRole("option").filter({ hasText: "Synthetic scoped alias" }),
    ).toHaveCount(0);
    await composer.press("Tab");
    await expect(composer).toHaveValue(`/goal use /${name} `);
    await expect(composer).toBeFocused();
    expect(sessionFromUrl(page.url())).toBeFalsy();
    await page.screenshot({ path: info.outputPath(`slash-${profile}-inline-skill.png`) });
    await composer.fill(`/${name}-bundle`);
    await expect(
      menu.getByRole("option").filter({ hasText: "Synthetic slash bundle" }),
    ).toBeVisible();
    await composer.press("Escape");
    // Help is a catalog read and must not allocate a session or fake turns.
    await composer.fill("/help");
    await send.click();
    const output = plugin.getByRole("region", { name: "Command results" });
    await expect(output).toContainText("temporary result");
    await expect(output).toContainText("/status");
    expect(sessionFromUrl(page.url())).toBeFalsy();
    await expect(plugin.locator(".message.user")).toHaveCount(0);
    await composer.fill(`/${name} [workflow-stream] ${randomUUID()}`);
    await send.click();
    await expect(plugin.locator(".message.assistant")).toContainText("Stream complete.");
    await expect(plugin.locator(".message.user")).toHaveCount(1);
    await expect(plugin.locator(".message.user")).toContainText(`/${name}`);
    await expect(plugin.locator(".chat-content")).not.toContainText("Follow the user task.");
    expect(sessionFromUrl(page.url())).toBeTruthy();
    await composer.fill(`/${name}-quick`);
    await expect(
      menu.getByRole("option").filter({ hasText: "Synthetic scoped quick command" }),
    ).toBeVisible();
    await send.click();
    await expect(output).toContainText("slash-quick-ok");
    expect(admitted).toBe(1);
    await composer.fill(`/${name}-alias`);
    await send.click();
    await expect(output).toContainText(`/${name}-alias · temporary result`);
    await expect(output).not.toContainText("outcome may be unknown");
    expect(admitted).toBe(1);
    await composer.fill("/steer change direction");
    await send.click();
    await expect(output).toContainText("Use Guide this run in the composer");
    await expect(output).not.toContainText("outcome may be unknown");
    await expect(composer).toHaveValue("/steer change direction");
    expect(admitted).toBe(1);
    await composer.fill("/retry");
    await send.click();
    await expect.poll(() => admitted).toBe(2);
    await expect(plugin.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
    await expect(plugin.locator(".message.assistant").last()).toContainText("Stream complete.");
    // Native retry can persist a System wrapper which the pinned Desktop
    // projection hides. Read the authoritative transcript instead of counting
    // an optimistic invocation as a durable user turn.
    await page.reload();
    await expect(plugin.locator(".message.assistant").last()).toContainText("Stream complete.");
    const usersAfterRetry = await plugin.locator(".message.user").count();
    await composer.fill("/status");
    await send.click();
    await expect(output).toContainText("/status · temporary result");
    await expect(output).not.toContainText("outcome may be unknown");
    await expect(output).not.toContainText("Hermes refused");
    await expect(plugin.locator(".message.user")).toHaveCount(usersAfterRetry);
    await expect(composer).toBeEnabled();
    await composer.fill("/compress");
    await send.click();
    await expect(output).toContainText("/compress · temporary result");
    await expect(output).not.toContainText("outcome may be unknown");
    await expect(output).not.toContainText("Hermes refused");
    await expect(send).toBeDisabled(); // empty draft, refreshed idle session
    await composer.fill("/history");
    await expect(send).toBeEnabled();
    // Compression owns the replacement transcript; it may remove older asks.
    // A refused client command must preserve that authoritative result.
    const usersAfterCompression = await plugin.locator(".message.user").count();
    await send.click();
    await expect(output).toContainText("does not support");
    await expect(composer).toHaveValue("/history");
    await expect(plugin.locator(".message.user")).toHaveCount(usersAfterCompression);
    await page.screenshot({ path: info.outputPath(`slash-${profile}-results.png`) });
    await composer.fill("Next draft remains editable");
    await expect(composer).toBeFocused();
    await page.reload();
    await expect(plugin.getByRole("region", { name: "Command results" })).toHaveCount(0);
    await expect(plugin.locator(".message.assistant")).toContainText("Stream complete.");
    await expect(plugin.locator(".chat-content")).not.toContainText("Follow the user task.");
    // A profile-only extension must disappear from another profile's palette.
    const other = profile === "alpha" ? "beta" : "alpha";
    await page.goto(`${origin}/chathermes?profile=${other}#/?profile=${other}`);
    await composer.fill(`/${name}`);
    await expect(
      plugin.getByText(
        /No command suggestions\. Escape closes this menu\.|Some command sources are unavailable or have naming conflicts\./,
      ),
    ).toBeVisible();
    await expect(menu.getByRole("option")).toHaveCount(0);
  });
}

test("slash plan creates a project draft in its authoritative workspace", async ({
  page,
}, info) => {
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    randomUUID(),
  );
  const { api } = await import("./helpers");
  const made = await api(page, "/api/plugins/chathermes/projects/manage?profile=alpha", {
    action: "create",
    name: `Slash project ${randomUUID()}`,
    primary_path: workspace,
  });
  expect(made.status).toBe(200);
  await page.goto(
    `${new URL(page.url()).origin}/chathermes?profile=alpha#/?profile=alpha&project=${encodeURIComponent(made.body.project.id)}`,
  );
  const plugin = page.locator(".chathermes-embedded");
  await expect(plugin.locator(".header-project-subtitle")).toContainText("Slash project");
  expect(sessionFromUrl(page.url())).toBeFalsy();
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.fill(`/plan [workflow-project] ${randomUUID()}`);
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant")).toContainText("Workspace verified.");
  expect(sessionFromUrl(page.url())).toBeTruthy();
  expect(
    runtime(
      "import pathlib,sys,json; print(json.dumps((pathlib.Path(sys.argv[1])/'workflow-artifact.txt').read_text()))",
      workspace,
    ),
  ).toBe("Generated project artifact");
  await expect(plugin.locator(".header-project-subtitle")).toContainText("Slash project");
  await page.screenshot({ path: info.outputPath("slash-project-plan.png") });
});

test("slash palette supports keyboard arguments and compact scrolling without sending", async ({
  page,
}, info) => {
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 440 });
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  const menu = plugin.getByRole("listbox", { name: "Slash commands" });
  await composer.fill("/");
  await expect(menu.getByRole("option").first()).toBeVisible();
  await expect(menu.locator("p").filter({ hasText: /^Session$/ })).toHaveCount(0);
  await expect(menu).not.toContainText("Client/terminal feature · type command for details");
  await page.screenshot({ path: info.outputPath("slash-menu-labels.png") });
  const bounds = await menu.evaluate((element) => {
    const scroll = element.parentElement!;
    const rect = scroll.getBoundingClientRect();
    scroll.scrollTop = scroll.scrollHeight;
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      scrolled: scroll.scrollTop,
      width: innerWidth,
    };
  });
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.width);
  expect(bounds.scrolled).toBeGreaterThan(0);
  const input = (await composer.boundingBox())!;
  expect(bounds.bottom).toBeLessThanOrEqual(input.y);
  await expect(composer).toBeFocused();
  await expect(composer).toHaveCSS("font-size", "16px");
  await page.screenshot({ path: info.outputPath("slash-menu-scrolled.png") });
  await composer.press("ArrowDown");
  await expect(menu.getByRole("option").nth(1)).toHaveAttribute("aria-selected", "true");
  await composer.press("Tab");
  await expect(composer).toHaveValue(/^\/\S+ $|^$/);
  const pickedChip = page.getByRole("button", { name: /^Edit (command|skill) / });
  if (await pickedChip.count()) await pickedChip.click();
  await expect(composer).toBeFocused();
  await composer.fill("/heartbeat st");
  await expect(menu.getByRole("option").first()).toBeVisible();
  // The native registry infers mixed mode from heartbeat's <prompt> hint:
  // Tab selects its suggestion; implicit Enter preserves the typed argument.
  await composer.press("Tab");
  await expect(composer).toHaveValue("");
  await expect(composer).toBeFocused();
  await page.getByRole("button", { name: "Edit command /heartbeat status", exact: true }).click();
  await composer.fill("/stat");
  await expect(menu.getByRole("option").first()).toBeVisible();
  await composer.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(composer).toHaveValue("/stat");
  await composer.fill("Ordinary /slash text\nsecond line");
  await expect(menu).toHaveCount(0);
  await expect(plugin.locator(".message.user")).toHaveCount(0);
  expect(sessionFromUrl(page.url())).toBeFalsy();
  await page.screenshot({ path: info.outputPath("slash-multiline-draft.png") });
});

test("slash command selection advances to arguments and preserves prose submission", async ({
  page,
}, info) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  const menu = page.getByRole("listbox", { name: "Slash commands" });
  const send = page.getByRole("button", { name: "Send message", exact: true });
  await composer.fill("/heart");
  await expect(menu.getByRole("option").filter({ hasText: "/heartbeat" }).first()).toBeVisible();
  await composer.press("Tab");
  await expect(composer).toHaveValue("/heartbeat ");
  const status = menu.getByRole("option").filter({ hasText: /^status/ });
  await expect(status).toBeVisible();
  await page.screenshot({ path: info.outputPath("slash-argument-step.png") });
  if (info.project.name === "mobile") await status.tap();
  else await status.click();
  await expect(composer).toHaveValue("");
  const directive = page.getByRole("button", {
    name: "Edit command /heartbeat status",
    exact: true,
  });
  await expect(directive).toBeVisible();
  await expect(composer).toBeFocused();
  await expect(menu).toHaveCount(0);
  const directiveBounds = (await directive.boundingBox())!;
  const inputBounds = (await composer.boundingBox())!;
  expect(directiveBounds.y + directiveBounds.height).toBeLessThanOrEqual(inputBounds.y);
  expect(directiveBounds.x + directiveBounds.width).toBeLessThanOrEqual(
    await page.evaluate(() => innerWidth),
  );
  await page.screenshot({ path: info.outputPath("slash-argument-directive.png") });
  await expect(composer).toHaveAttribute(
    "aria-describedby",
    (await directive.getAttribute("id")) || "",
  );
  await composer.fill("😀 use /work draft\nkeep this suffix");
  await expect(composer).toHaveValue("😀 use /work draft\nkeep this suffix");
  await expect(directive).toBeVisible();
  await page.screenshot({ path: info.outputPath("slash-directive-suffix.png") });
  if (info.project.name === "mobile") await directive.tap();
  else {
    await directive.focus();
    await directive.press("Enter");
  }
  await expect(composer).toHaveValue("/heartbeat status 😀 use /work draft\nkeep this suffix");
  await expect(directive).toHaveCount(0);
  await expect(composer).toBeFocused();
  expect(
    await composer.evaluate((element: HTMLTextAreaElement) => [
      element.selectionStart,
      element.selectionEnd,
    ]),
  ).toEqual([0, 17]);
  await composer.fill("/status");
  await expect(menu.getByRole("option").first()).toBeVisible();
  await composer.press("Space");
  await expect(
    page.getByRole("button", { name: "Edit command /status", exact: true }),
  ).toBeVisible();
  if (info.project.name === "mobile") await send.click();
  else await composer.press("Enter");
  await expect(page.getByRole("region", { name: "Command results" })).toContainText(
    "/status · temporary result",
  );
  await composer.fill(`/plan [workflow-stream] ${randomUUID()} deliver the redesign`);
  await expect(menu).toHaveCount(0);
  if (info.project.name === "mobile") await send.click();
  else await composer.press("Enter");
  await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
  await expect(page.locator(".message.user").last()).toContainText("deliver the redesign");
  await expect(composer).toBeEnabled();
  await composer.focus();
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("slash-prose-submitted.png") });
});
