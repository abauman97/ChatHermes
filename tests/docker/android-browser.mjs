import { setTimeout as delay } from "node:timers/promises";

const dashboardUrl = "http://localhost:9119/chathermes";

// Retry transient Android activity and CDP startup failures against a deadline.
async function untilReady(operation, message, options = {}) {
  const { timeout = 60000, now = Date.now, wait = delay } = options;
  const deadline = now() + timeout;
  let cause;
  while (now() < deadline) {
    try {
      return await operation(Math.min(5000, deadline - now()));
    } catch (error) {
      cause = error;
      const remaining = deadline - now();
      if (remaining > 0) await wait(Math.min(1000, remaining));
    }
  }
  throw new Error(message, { cause });
}

export async function startChrome(adb, connectChrome, options) {
  const start = (...args) => {
    const output = adb("shell", "am", "start", "-W", ...args);
    // am start can report a failure while adb itself exits successfully.
    if (/Error:|Status:\s*(?!ok\b)\S+/i.test(output)) {
      throw new Error("Android activity did not start");
    }
  };
  await untilReady(
    () => {
      // Initialize HOME before Chrome caches pin-shortcut support.
      adb(
        "shell",
        "cmd",
        "package",
        "set-home-activity",
        "com.google.android.apps.nexuslauncher/.NexusLauncherActivity",
      );
      start("-a", "android.intent.action.MAIN", "-c", "android.intent.category.HOME");
    },
    "Android launcher unavailable",
    options,
  );
  await untilReady(
    () => {
      adb("shell", "am", "force-stop", "com.android.chrome");
      adb("shell", "am", "set-debug-app", "--persistent", "com.android.chrome");
      adb(
        "shell",
        "echo 'chrome --no-first-run --disable-fre --no-default-browser-check' > /data/local/tmp/chrome-command-line",
      );
      start("-a", "android.intent.action.VIEW", "-d", dashboardUrl, "com.android.chrome");
    },
    "Android Chrome did not start",
    options,
  );
  return connectChrome();
}

export async function waitForChrome(endpoint, connect, options = {}) {
  const { request = fetch } = options;
  return untilReady(
    async (timeout) => {
      // The TCP proxy can accept connections before Chrome creates its socket.
      const response = await request(`${endpoint}/json/version`, {
        signal: AbortSignal.timeout(timeout),
      });
      if (!response.ok || !(await response.json()).webSocketDebuggerUrl) {
        throw new Error("Chrome debugging endpoint not ready");
      }
      return connect(endpoint, { timeout });
    },
    "Chrome debugging unavailable",
    options,
  );
}

export async function openDashboard(browser, connectChrome) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let page;
    try {
      const context = browser.contexts()[0];
      page =
        context.pages().find((candidate) => candidate.url().startsWith("http://localhost:9119/")) ||
        context.pages()[0] ||
        (await context.newPage());
      page.setDefaultTimeout(30000);
      await page.goto(dashboardUrl);
      // A replaced Chrome target can retain the successful sign-in cookie.
      if (new URL(page.url()).pathname === "/login") {
        await page.getByLabel("Username").fill("tester");
        await page.getByLabel("Password", { exact: true }).fill("chathermes-local-test");
        await page.getByRole("button", { name: "Sign in", exact: true }).click();
      }
      await page.getByRole("button", { name: "Choose model", exact: true }).waitFor();
      return { browser, context, page };
    } catch (error) {
      // Fresh Android Chrome can replace its startup tab during sign-in. Only
      // recover a lost target/connection; UI timeouts must remain real failures.
      if (attempt === 2 || (!page?.isClosed() && browser.isConnected())) {
        await browser.close();
        throw error;
      }
      console.log("Chrome closed its startup page; reconnecting to the dashboard...");
      await browser.close();
      await delay(500);
      browser = await connectChrome();
    }
  }
}
