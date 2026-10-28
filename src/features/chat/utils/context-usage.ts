import type { Usage } from "../../../vendor/hermes/gateway-contract.generated";
export function contextNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}
export function contextPercent(
  usage: Pick<Usage, "context_percent"> | null | undefined,
): number | null {
  const percent = contextNumber(usage?.context_percent);
  return percent !== null && percent <= 100 ? percent : null;
}
