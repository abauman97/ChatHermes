import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../../", import.meta.url));
// Compose derives the project from this checkout's directory, not tests/docker.
export const composeArgs = [
  "compose",
  "--project-directory",
  root,
  "-f",
  `${root}tests/docker/compose.yml`,
];
export function compose(...args) {
  return execFileSync("docker", [...composeArgs, ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}
export function serviceContainer(service) {
  const id = compose("ps", "-q", service);
  if (!id || id.includes("\n")) throw new Error(`Expected one running Compose ${service} service`);
  return id;
}
export function dockerExec(container, ...args) {
  return execFileSync("docker", ["exec", container, ...args], {
    encoding: "utf8",
    timeout: 20000,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}
export function endpoint(port, override) {
  if (override) return override;
  const remote = process.env.DOCKER_HOST?.match(/^tcp:\/\/([^:/]+)/)?.[1];
  const host = process.env.CHATHERMES_DASHBOARD_URL_HOST || remote || "127.0.0.1";
  return `http://${host}:${port}`;
}
export const dashboardURL = () =>
  endpoint(process.env.CHATHERMES_DASHBOARD_PORT || 9119, process.env.CHATHERMES_TEST_URL);
export const mockserverURL = () =>
  endpoint(process.env.CHATHERMES_MOCKSERVER_PORT || 1080, process.env.CHATHERMES_MOCKSERVER_URL);
export const androidEndpoint = () =>
  endpoint(
    process.env.CHATHERMES_ANDROID_CDP_PORT || 9223,
    process.env.CHATHERMES_ANDROID_CDP_ENDPOINT,
  );
