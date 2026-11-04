import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { runtime } from "./helpers";

test("scheduled result renders only the final response, with raw output for runs without responses", async ({
  page,
}, info) => {
  const seed = runtime(
    `
import json,sys
from cron.jobs import create_job,save_job_output
from hermes_cli.web_server_sessions import _open_session_db_for_profile
job=create_job(prompt='Private scheduled prompt',schedule='0 0 1 1 *',name=sys.argv[1],paused=True)
sid='cron_'+job['id']+'_20260101_000000'
db=_open_session_db_for_profile('default',read_only=False)
db.create_session(sid,source='cron')
db.append_message(sid,'user','Private scheduled prompt')
db.append_message(sid,'assistant','Intermediate progress',reasoning='Private reasoning')
db.append_message(sid,'tool','Private tool output',tool_name='terminal',tool_call_id='scheduled-tool')
db.append_message(sid,'assistant','Final scheduled response.')
db.close()
raw=save_job_output(job['id'],'# Raw scheduled output\\n\\nExact saved script result.')
print(json.dumps({'job':job['id'],'run':sid,'raw':'output:'+raw.stem}))
`,
    "Scheduled result " + randomUUID(),
  );
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes#/scheduled/${seed.job}?profile=default`);
  const runs = page.getByRole("navigation", { name: "Job runs" });
  // Open the persisted run from its actual history entry, regardless of timestamp formatting.
  const data = await (
    await page.request.get(
      `/api/plugins/chathermes/scheduled/runs?job_id=${seed.job}&profile=default`,
    )
  ).json();
  const index = data.runs.findIndex((run: { id: string }) => run.id === seed.run);
  expect(index).toBeGreaterThanOrEqual(0);
  await runs.getByRole("button").nth(index).click();
  const result = page.locator(".scheduled-page");
  await expect(result.locator(".message.assistant")).toHaveText("Final scheduled response.");
  await expect(result.locator(".message.user, .activity, .work-summary")).toHaveCount(0);
  for (const hidden of [
    "Private scheduled prompt",
    "Intermediate progress",
    "Private reasoning",
    "Private tool output",
  ])
    await expect(result).not.toContainText(hidden);
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.focus();
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("scheduled-final-response.png") });
  await page.reload();
  await expect(result.locator(".message.assistant")).toHaveText("Final scheduled response.");
  await page.goto(
    `${origin}/chathermes#/scheduled/${seed.job}/${encodeURIComponent(seed.raw)}?profile=default`,
  );
  await expect(result.locator(".message.assistant")).toContainText("Exact saved script result.");
  await expect(result.locator(".activity, .work-summary")).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("scheduled-raw-output.png") });
});
