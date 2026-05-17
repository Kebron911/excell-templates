import PQueue from "p-queue";
import { randomBytes } from "node:crypto";
import { PinforgeError } from "../errors.js";
import { generatePin, type OrchestratorDeps } from "../orchestrator/generate.js";
import type { PinResult } from "../input.js";

export interface BatchResult {
  jobId: string;
  succeeded: { input: unknown; result: PinResult }[];
  failed: { input: unknown; error: { code: string; message: string; context: Record<string, unknown> } }[];
}

export function createJobId(): string {
  return `job_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

export async function generateBatch(inputs: unknown[], deps: OrchestratorDeps): Promise<BatchResult> {
  const queue = new PQueue({
    concurrency: deps.env.queueConcurrency,
    intervalCap: deps.env.queueIntervalCap,
    interval: deps.env.queueIntervalMs
  });
  const jobId = createJobId();
  const succeeded: BatchResult["succeeded"] = [];
  const failed: BatchResult["failed"] = [];

  await Promise.all(inputs.map(input => queue.add(async () => {
    try {
      const result = await generatePin(input, deps);
      succeeded.push({ input, result });
    } catch (e) {
      const err = e instanceof PinforgeError
        ? { code: e.code, message: e.message, context: e.context }
        : { code: "UNKNOWN", message: e instanceof Error ? e.message : String(e), context: {} };
      failed.push({ input, error: err });
    }
  })));

  return { jobId, succeeded, failed };
}
