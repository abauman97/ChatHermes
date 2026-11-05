import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";

const digest = (value) => createHash("sha256").update(value).digest("hex");

// Discover output rather than guessing Vite's hashed chunk names. Only shipped
// static files are eligible; the worker itself is versioned through its source.
export async function generatePrecache(outDir, workerSource) {
  if (!workerSource.includes("/* __CHATHERMES_PRECACHE__ */ null"))
    throw new Error("Precache worker injection point missing");
  async function files(directory, prefix = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map((entry) => {
        const name = prefix + entry.name;
        return entry.isDirectory() ? files(`${directory}/${entry.name}`, name + "/") : [name];
      }),
    );
    return nested.flat();
  }
  const names = (await files(outDir))
    .filter(
      (name) =>
        (/\.(?:m?js|css)$/.test(name) && name !== "push-service-worker.js") ||
        name === "manifest.webmanifest" ||
        name === "apple-touch-icon.png" ||
        (name.startsWith("assets/") &&
          /\.(?:m?js|css|png|jpe?g|gif|webp|ico|svg|woff2?|ttf|otf)$/.test(name)) ||
        (name.startsWith("icons/") && name.endsWith(".png")),
    )
    .sort();
  for (const required of ["index.js", "style.css", "manifest.webmanifest", "apple-touch-icon.png"])
    if (!names.includes(required)) throw new Error(`Precache asset missing: ${required}`);
  if (!names.some((name) => name.startsWith("assets/") && name.endsWith(".js")))
    throw new Error("Precache app bundle missing");
  const assets = await Promise.all(
    names.map(async (name) => ({
      url:
        (name.startsWith("icons/") ||
        name.endsWith(".webmanifest") ||
        name === "apple-touch-icon.png"
          ? "/api/plugins/chathermes/assets/dist/"
          : "/dashboard-plugins/chathermes/dist/") + name,
      revision: digest(await readFile(`${outDir}/${name}`)),
    })),
  );
  const manifest = { release: digest(workerSource + JSON.stringify(assets)), assets };
  await writeFile(`${outDir}/precache-manifest.json`, JSON.stringify(manifest, null, 2) + "\n");
  await writeFile(
    `${outDir}/push-service-worker.js`,
    workerSource.replace("/* __CHATHERMES_PRECACHE__ */ null", JSON.stringify(manifest)),
  );
  return manifest;
}
