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

test("saved Cron documents open only their own response, including after reload and profile changes", async ({
  page,
}, info) => {
  const seed = runtime(
    `
import json,sys
from cron.jobs import create_job,save_job_output
from cron.scheduler import _run_doc_header
from cron.scheduler_diagnostics import format_run_error
from dotenv import load_dotenv
from hermes_constants import get_process_hermes_home
load_dotenv(get_process_hermes_home()/'.env')
sys.path.insert(0,'/opt/chathermes/plugin/dashboard')
from plugin_api import _gateway_settings
from hermes_cli.web_server_cron import _cron_store_scope,_cron_profile_home
key=_gateway_settings()[1]
assert key
prompt=key+' Private assembled prompt 🦉\\n\\n## Response\\n\\nQuoted previous run'
answer='# Saved result 🦉\\n\\n## Response\\n\\nThe whole answer survives.'+key
def save(job_id,stamp,body):
    path=save_job_output(job_id,body)
    path.rename(path.with_name(stamp+'.md'))
with _cron_store_scope(_cron_profile_home('default')[1]):
    job=create_job(prompt=prompt,schedule='0 0 1 1 *',name=sys.argv[1],paused=True)
    header=_run_doc_header(job,job['name'],job['id'],prompt,prompt_stamp=f'**Prompt Characters:** {len(prompt)}\\n')
    save(job['id'],'2026-01-01_00-00-00',header+f'**Response Characters:** {len(answer)}\\n## Response\\n\\n{answer}\\n')
    second='Second run result only.'
    save(job['id'],'2026-01-02_00-00-00',header+f'**Response Characters:** {len(second)}\\n## Response\\n\\n{second}\\n')
    legacy=_run_doc_header(job,job['name'],job['id'],prompt)
    save(job['id'],'2026-01-03_00-00-00',legacy+'## Response\\n\\n'+answer+'\\n')
    save(job['id'],'2026-01-04_00-00-00',legacy+format_run_error(RuntimeError('Private failure '+key)))
print(json.dumps({'job':job['id']}))
`,
    "Saved document " + randomUUID(),
  );
  const origin = new URL(page.url()).origin;
  const destination = (stamp: string, profile = "default") =>
    `${origin}/chathermes#/scheduled/${seed.job}/output%3A${stamp}?profile=${profile}`;
  await page.goto(`${origin}/chathermes#/scheduled/${seed.job}?profile=default`);
  const runs = page.getByRole("navigation", { name: "Job runs" });
  await expect(runs.getByRole("button")).toHaveCount(4);
  await runs.getByRole("button").nth(3).click();
  const result = page.locator(".scheduled-page");
  await expect(result.locator(".message.assistant")).toContainText("The whole answer survives.");
  await expect(result.locator("h1")).toHaveText("Saved result 🦉");
  await expect(result).toContainText("[redacted]");
  await expect(result.locator(".message.assistant h2")).toHaveText("Response");
  for (const hidden of [
    "Private assembled prompt",
    "Quoted previous run",
    "Characters:",
    "Second run result",
  ])
    await expect(result).not.toContainText(hidden);
  await expect(result.locator(".message.user, .activity, .work-summary")).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("scheduled-saved-response.png") });
  await page.reload();
  await expect(result.locator(".message.assistant")).toContainText("The whole answer survives.");
  await page.goto(destination("2026-01-02_00-00-00"));
  await expect(result.locator(".message.assistant")).toHaveText("Second run result only.");
  await expect(result).not.toContainText("The whole answer survives.");
  await page.screenshot({ path: info.outputPath("scheduled-distinct-run.png") });
  for (const stamp of ["2026-01-03_00-00-00", "2026-01-04_00-00-00"]) {
    await page.goto(destination(stamp));
    await expect(result).toContainText(
      "Saved output or error diagnostics could not be safely separated",
    );
    await expect(result.locator(".message.assistant")).toHaveCount(0);
    await expect(result).not.toContainText("Private assembled prompt");
    await expect(result).not.toContainText("Quoted previous run");
    await expect(result).not.toContainText("Private failure");
  }
  await page.screenshot({ path: info.outputPath("scheduled-unverified-output.png") });
  // The same job/run URL in another profile must never fall back to default.
  await page.goto(destination("2026-01-02_00-00-00", "beta"));
  await expect(result.getByRole("alert")).toBeVisible();
  await expect(result.locator(".message.assistant")).toHaveCount(0);
  await expect(result).not.toContainText("Second run result only.");
});
