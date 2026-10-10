import type {
  ApprovalChoice,
  ApprovalRequestParams,
  ClarifyRequestParams,
  SecretRequestParams,
  OpenRequestEntry,
  ApprovalResult,
  ClarifyResult,
  ValueResult,
} from "../../../vendor/hermes/gateway-contract.generated";
export type PendingRequest =
  | {
      kind: "approval";
      id: string;
      params: Pick<ApprovalRequestParams, "command"> & { choices: ApprovalChoice[] };
    }
  | { kind: "clarify"; id: string; params: Pick<ClarifyRequestParams, "questions"> }
  | { kind: "secret"; id: string; params: Pick<SecretRequestParams, "prompt" | "env_var"> }
  | { kind: "unsupported"; id: string };
export type RequestAnswer = ApprovalResult | ClarifyResult | ValueResult;
const choices: ApprovalChoice[] = ["once", "session", "always", "deny"];
/** Keep the transport envelope ID; never display unknown payloads. */
export function normalizeRequest(request?: OpenRequestEntry): PendingRequest | undefined {
  if (!request) return;
  const { id, method, params } = request;
  if (
    method === "approval" &&
    (params.choices === undefined ||
      (Array.isArray(params.choices) && params.choices.every((choice) => choices.includes(choice))))
  )
    return {
      kind: "approval",
      id,
      params: {
        choices: params.choices || [],
        command: typeof params.command === "string" ? params.command : undefined,
      },
    };
  if (
    method === "clarify" &&
    Array.isArray(params.questions) &&
    params.questions.every(
      (q) =>
        q &&
        typeof q.qid === "string" &&
        typeof q.question === "string" &&
        (q.choices == null ||
          (Array.isArray(q.choices) && q.choices.every((v: unknown) => typeof v === "string"))) &&
        (q.multi_select === undefined || typeof q.multi_select === "boolean"),
    )
  )
    return { kind: "clarify", id, params: { questions: params.questions } };
  if (
    method === "secret" &&
    typeof params.prompt === "string" &&
    typeof params.env_var === "string"
  )
    return { kind: "secret", id, params: { prompt: params.prompt, env_var: params.env_var } };
  return { kind: "unsupported", id };
}
