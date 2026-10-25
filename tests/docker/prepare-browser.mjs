import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import {
  serviceContainer,
  dockerExec,
  dashboardURL,
  androidEndpoint,
  endpoint,
} from "./compose.mjs";
import { startChrome, waitForChrome, openDashboard } from "./android-browser.mjs";

const sessions = new Map();

export async function authenticate(page, url = `${dashboardURL()}/chathermes`) {
  const origin = new URL(url).origin;
  if (!(await page.context().cookies(origin)).length && sessions.has(origin)) {
    await page.context().addCookies(sessions.get(origin));
  }
  await page.goto(url);
  if (new URL(page.url()).pathname === "/login") {
    await page.getByLabel("Username").fill("tester");
    await page.getByLabel("Password", { exact: true }).fill("chathermes-local-test");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL((value) => value.pathname !== "/login");
  }
  await page
    .getByRole("button", { name: "Choose model", exact: true })
    .waitFor({ state: "visible" });
  sessions.set(origin, await page.context().cookies(origin));
  return page;
}

export async function prepareAndroid() {
  const container = serviceContainer("android");
  const adb = (...args) => dockerExec(container, "adb", ...args);
  if (adb("shell", "getprop", "sys.boot_completed") !== "1") {
    throw new Error(
      "Android is not booted; inspect docker compose ps and KVM before preparing Chrome",
    );
  }
  const proxy = await readFile(new URL("./android-proxy.py", import.meta.url), "utf8");
  for (const [port, host, target] of [
    [9119, "hermes", 9119],
    [9222, "127.0.0.1", 19222],
  ]) {
    const listening = dockerExec(
      container,
      "python3",
      "-c",
      "import socket,sys; s=socket.socket(); print(s.connect_ex(('127.0.0.1',int(sys.argv[1]))))",
      String(port),
    );
    if (listening !== "0")
      execFileSync("docker", [
        "exec",
        "-d",
        container,
        "python3",
        "-c",
        proxy,
        String(port),
        host,
        String(target),
      ]);
  }
  adb("reverse", "tcp:9119", "tcp:9119");
  adb("forward", "tcp:19222", "localabstract:chrome_devtools_remote");
  const connectChrome = () =>
    waitForChrome(androidEndpoint(), (url, options) => chromium.connectOverCDP(url, options));
  // Reuse a live Chrome process; only initialize Chrome on a fresh device.
  const running = adb("shell", "cat", "/proc/net/unix").includes("chrome_devtools_remote");
  const browser = running ? await connectChrome() : await startChrome(adb, connectChrome);
  const dashboard = await openDashboard(browser, connectChrome);
  await dashboard.page.bringToFront();
  return { ...dashboard, container, adb, connectChrome };
}

export async function prepareDesktop({ headless = false, contextOptions = {} } = {}) {
  const browser = await chromium.launch({
    headless,
    executablePath: process.env.CHATHERMES_CHROMIUM,
  });
  try {
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    await authenticate(page);
    return { browser, context, page };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--android")) {
    const { browser } = await prepareAndroid();
    await browser.close();
    console.log(
      `Android browser ready: http://localhost:9119/chathermes\nCDP: ${androidEndpoint()}\nnoVNC: ${endpoint(process.env.CHATHERMES_ANDROID_VNC_PORT || 6080)}/?autoconnect=true&resize=scale`,
    );
  } else {
    const { browser } = await prepareDesktop();
    console.log(`Browser ready: ${dashboardURL()}/chathermes; close its window to exit.`);
    await new Promise((resolve) => browser.on("disconnected", resolve));
  }
}
