import type { GatewayEvent } from "../../../vendor/hermes/gateway-events";
import type {
  SessionResumeResult,
  OpenRequestEntry,
} from "../../../vendor/hermes/gateway-contract.generated";
import type { DisplayMetadata } from "./gateway-display";
export class NativeError extends Error {
  outcome: string;
  constructor(message: string, outcome = "unknown") {
    super(message);
    this.outcome = outcome;
  }
}
export interface Recovery {
  epoch: string;
  start?: number;
  through: number;
  base_row_ids: string[] | null;
  complete: boolean;
}
export type NativeSnapshot = SessionResumeResult & { recovery: Recovery };
export interface NativeHooks {
  snapshot: (snapshot: NativeSnapshot) => void;
  event: (event: GatewayEvent) => void;
  input: (
    text: string,
    correction: boolean,
    admissionId?: string,
    display?: DisplayMetadata,
  ) => void;
  requests: (requests: OpenRequestEntry[]) => void;
  connection: (state: "connecting" | "recovering" | "open" | "closed", error?: string) => void;
  recovered: () => void;
}

export { NativeGatewayViewer as NativeViewer } from "./native-gateway";
