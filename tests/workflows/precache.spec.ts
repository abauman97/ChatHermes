import { createHash, randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { dockerExec, serviceContainer } from "../docker/compose.mjs";

const workerUrl = "/api/plugins/chathermes/push-service-worker.js";
const cachePrefix = "chathermes-static-v1-";

test("@desktop updates preserve live work until each tab approves reloading", async ({
  page,
}, info) => {
  test.setTimeout(150000);
  const context = page.context();
  const original = await (await page.request.get(workerUrl)).text();
  const match = /const PRECACHE = (\{[^\n]+\});/.exec(original);
  expect(match, "production worker contains the build manifest").toBeTruthy();
  const current = JSON.parse(match![1]!);
  const profile = JSON.parse(/const ASSET_PROFILE = ("[^"\n]*");/.exec(original)![1]!);
  const suffix = profile ? "-" + encodeURIComponent(profile) : "";
  const assets = current.assets.flatMap((asset: { url: string; revision: string }) =>
    profile && asset.url.startsWith("/dashboard-plugins/")
      ? [
          asset,
          {
            ...asset,
            url: asset.url.replace(
              "/dashboard-plugins/",
              "/dashboard-plugins/@" + encodeURIComponent(profile) + "/",
            ),
          },
        ]
      : [asset],
  );
  const release = createHash("sha256").update(randomUUID()).digest("hex");
  const next = { ...current, release };
  const broken = {
    ...next,
    release: release + "-failed",
    assets: current.assets.map((asset: { url: string; revision: string }, index: number) =>
      index === 1 ? { ...asset, revision: "0".repeat(64) } : asset,
    ),
  };
  // Update only this isolated fixture container's deployed worker. Application
  // assets and real Hermes APIs remain untouched. Restore even on test failure.
  const container = serviceContainer("hermes");
  const originalDisk = dockerExec(
    container,
    "/opt/hermes/.venv/bin/python",
    "-c",
    "import base64,os,pathlib; p=pathlib.Path(os.environ['HERMES_HOME'])/'plugins/chathermes/dashboard/dist/push-service-worker.js'; print(base64.b64encode(p.read_bytes()).decode())",
  );
  const deploy = (body: string) =>
    dockerExec(
      container,
      "/opt/hermes/.venv/bin/python",
      "-c",
      "import base64,os,pathlib,sys; p=pathlib.Path(os.environ['HERMES_HOME'])/'plugins/chathermes/dashboard/dist/push-service-worker.js'; p.write_bytes(base64.b64decode(sys.argv[1]))",
      Buffer.from(body).toString("base64"),
    );
  const updatedSource = (value: unknown) =>
    original.replace(match![0], `const PRECACHE = ${JSON.stringify(value)};`);
  const update = () =>
    page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration("/chathermes");
      const result = new Promise<string>((resolve) => {
        registration!.addEventListener(
          "updatefound",
          () => {
            const worker = registration!.installing!;
            worker.addEventListener("statechange", () => {
              if (worker.state === "installed" || worker.state === "redundant")
                resolve(worker.state);
            });
          },
          { once: true },
        );
      });
      await registration!.update();
      return result;
    });
  try {
    await page.evaluate(async (workerUrl) => {
      await navigator.serviceWorker.register(workerUrl, {
        scope: "/chathermes",
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
    }, workerUrl);
    const assetRoot =
      "/dashboard-plugins/" +
      (profile ? "@" + encodeURIComponent(profile) + "/" : "") +
      "chathermes/dist/";
    const cachedLoads = Promise.all(
      assets
        .filter(
          (asset: { url: string }) =>
            asset.url.startsWith(assetRoot) && /\.(?:js|css)$/.test(asset.url),
        )
        .map((asset: { url: string }) =>
          page.waitForResponse((response) => new URL(response.url()).pathname === asset.url),
        ),
    );
    await page.reload();
    expect((await cachedLoads).every((response) => response.fromServiceWorker())).toBe(true);
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    deploy(updatedSource(broken));
    expect(await update()).toBe("redundant");
    expect(await page.evaluate(() => caches.keys())).not.toContain(
      cachePrefix + broken.release + suffix,
    );
    deploy(updatedSource(next));
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill(`[workflow-resume] precache update ${randomUUID()}`);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.getByRole("button", { name: "Stop response", exact: true })).toBeVisible();
    const installation = update();
    await expect(page.locator(".message.assistant")).toContainText("Before disconnect.");
    const conversation = page.url();
    await composer.fill("Draft survives worker update");
    await composer.focus();
    await page.evaluate(() => {
      document.documentElement.dataset.precacheDocument = "original";
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        document.documentElement.dataset.precacheDocument = "controller changed";
      });
    });
    expect(await installation).toBe("installed");
    const prompt = page.getByRole("dialog", { name: "ChatHermes update available" });
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText("may interrupt drafts, uploads, or work in progress");
    await page.screenshot({ path: info.outputPath("update-prompt.png") });
    await prompt.getByRole("button", { name: "Not now", exact: true }).click();
    await expect(prompt).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Update available", exact: true })).toBeVisible();
    await composer.focus();
    await expect(page.getByRole("button", { name: "Guide this run", exact: true })).toBeVisible();
    expect(
      await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())?.waiting),
    ).toBe(true);
    expect(await page.evaluate(() => caches.keys())).toEqual(
      expect.arrayContaining([
        cachePrefix + current.release + suffix,
        cachePrefix + release + suffix,
      ]),
    );
    await expect(composer).toHaveValue("Draft survives worker update");
    await expect(composer).toBeFocused();
    await expect(page.locator("html")).toHaveAttribute("data-precache-document", "original");
    await expect(page.locator(".message.assistant")).toContainText("Resume complete.");
    await expect(page.locator(".message.user")).toHaveCount(1);
    await page.getByRole("button", { name: "Send message", exact: true }).click({ trial: true });
    await page.screenshot({ path: info.outputPath("waiting-release-session.png") });

    // Offline asset reads exercise the real controller; the dashboard document
    // and session APIs deliberately have no offline fallback.
    await context.setOffline(true);
    try {
      const cached = await page.evaluate(
        async (assets: { url: string }[]) =>
          Promise.all(assets.map(async ({ url }) => (await fetch(url)).status)),
        assets,
      );
      expect(cached.every((status) => status === 200)).toBe(true);
      expect(
        await page.evaluate(async () => {
          try {
            await fetch("/api/plugins/chathermes/push/config");
            return "unexpected";
          } catch {
            return "network only";
          }
        }),
      ).toBe("network only");
    } finally {
      await context.setOffline(false);
    }
    // A second tab detects the already-waiting update and can defer independently.
    const host = await context.newPage();
    await host.goto(conversation);
    const otherPrompt = host.getByRole("dialog", { name: "ChatHermes update available" });
    await expect(otherPrompt).toBeVisible();
    await expect(host.locator(".message.assistant")).toContainText("Resume complete.");
    await expect(host.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
    await otherPrompt.getByRole("button", { name: "Not now", exact: true }).click();
    const otherComposer = host.getByRole("textbox", { name: "Message Hermes" });
    await otherComposer.fill("Other tab draft stays intact");
    await host.evaluate(() => {
      document.documentElement.dataset.otherDocument = "original";
    });
    await page.getByRole("button", { name: "Update available", exact: true }).click();
    await expect(prompt).toBeVisible();
    await Promise.all([
      page.waitForEvent("load"),
      prompt.getByRole("button", { name: "Update", exact: true }).click(),
    ]);
    await expect(page.locator(".message.assistant")).toContainText("Resume complete.");
    await expect(page.locator(".message.user")).toHaveCount(1);
    await expect(host.locator("html")).toHaveAttribute("data-other-document", "original");
    await expect(otherComposer).toHaveValue("Other tab draft stays intact");
    await expect(otherPrompt).not.toBeVisible();
    expect(await host.evaluate(() => caches.keys())).toContain(
      cachePrefix + current.release + suffix,
    );
    await host.getByRole("button", { name: "Update available", exact: true }).click();
    await Promise.all([
      host.waitForEvent("load"),
      otherPrompt.getByRole("button", { name: "Update", exact: true }).click(),
    ]);
    await expect(host.locator(".message.assistant")).toContainText("Resume complete.");
    expect(
      await host.evaluate(
        async ({ release, suffix }) => {
          const cache = await caches.open(
            (await caches.keys()).find(
              (name) => name === "chathermes-static-v1-" + release + suffix,
            )!,
          );
          return (await cache.keys()).map((request) => new URL(request.url).pathname).sort();
        },
        { release, suffix },
      ),
    ).toEqual(assets.map((asset: { url: string }) => asset.url).sort());
    await host.screenshot({ path: info.outputPath("activated-release-session.png") });
  } finally {
    deploy(Buffer.from(originalDisk, "base64").toString("utf8"));
  }
});
