import { mockserverURL } from "../docker/compose.mjs";

function frame(delta: object, finish_reason: string | null = null) {
  return (
    "data: " +
    JSON.stringify({
      id: "chatcmpl-visual-artifact",
      object: "chat.completion.chunk",
      created: 1,
      model: "chathermes-test",
      choices: [{ index: 0, delta, finish_reason }],
    }) +
    "\n\n"
  );
}
const quote = (value: string) => "'" + value.replaceAll("'", "'\\''") + "'";
const regex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Only inference is supplied: Hermes still approves, executes, saves and serves the files. */
export async function installArtifactInference(input: {
  device: string;
  filename: string;
  codeName: string;
  imageName: string;
  pdfName: string;
  imagePath: string;
  pdfPath: string;
}) {
  if (process.env.CHATHERMES_VISUAL_FIXTURES !== "1") return;
  const { device, filename, codeName, imageName, pdfName, imagePath, pdfPath } = input;
  const scope = filename.replace(/[^A-Za-z0-9_-]/g, "_");
  const result = `visual-artifact-files-ready-${scope}`;
  const command = [
    `printf '%s' 'Generated artifact verification' > ${quote("/opt/data/" + filename)}`,
    `printf '%s' 'print(1)' > ${quote("/opt/data/" + codeName)}`,
    `cp ${quote(imagePath)} ${quote("/opt/data/" + imageName)}`,
    `cp ${quote(pdfPath)} ${quote("/opt/data/" + pdfName)}`,
    `printf '%s' ${quote(result)}`,
  ].join(" && ");
  const answer = `Modified /opt/data/${codeName}\n\nExample: MEDIA:/opt/data/${codeName} is only documentation.\n\nMEDIA:/opt/data/${filename}\nMEDIA:/opt/data/${imageName}\nMEDIA:/opt/data/${pdfName}`;
  const expectation = (phase: string, role: string, marker: string, body: string) => ({
    id: `chathermes-visual-artifact-${scope}-${phase}`,
    priority: 30,
    httpRequest: {
      method: "POST",
      path: "/v1/chat/completions",
      body: {
        type: "JSON_PATH",
        jsonPath: `$[?(@.stream == true && @.messages[-1].role == '${role}' && @.messages[-1].content =~ /(?s).*${regex(marker)}.*/)]`,
      },
    },
    httpResponse: {
      statusCode: 200,
      headers: { "Content-Type": ["text/event-stream"] },
      body: body + "data: [DONE]\n\n",
      connectionOptions: {
        chunkSize: 250,
        chunkDelay: { timeUnit: "MILLISECONDS", value: 500 },
      },
    },
  });
  const response = await fetch(`${mockserverURL()}/mockserver/expectation`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      expectation(
        "command",
        "user",
        codeName,
        frame({
          role: "assistant",
          content: null,
          tool_calls: [
            {
              index: 0,
              id: `call_visual_artifact_${device}`,
              type: "function",
              function: { name: "terminal", arguments: JSON.stringify({ command, timeout: 60 }) },
            },
          ],
        }) + frame({}, "tool_calls"),
      ),
      expectation("result", "tool", result, frame({ content: answer }) + frame({}, "stop")),
    ]),
  });
  if (!response.ok) throw new Error(`Artifact inference setup failed (${response.status})`);
}
