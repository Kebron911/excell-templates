import pino from "pino";
import type { JobState } from "./jobs.js";

const logger = pino({ name: "webhook-dispatcher" });

const WEBHOOK_TIMEOUT_MS = 10_000;
const WEBHOOK_MAX_BODY = 100 * 1024;  // 100KB

export interface WebhookPayload {
  jobId: string;
  status: "done" | "failed";
  progress: { done: number; total: number; failed: number };
  completedAt: string;
  resultsUrl?: string;     // pollUrl for caller to GET full results
  fatalError?: { code: string; message: string };
}

/** Fire-and-forget POST to caller's callbackUrl. Errors logged, never thrown. */
export async function dispatchWebhook(
  callbackUrl: string,
  job: JobState,
  baseUrl: string
): Promise<void> {
  const payload: WebhookPayload = {
    jobId: job.jobId,
    status: job.status === "done" ? "done" : "failed",
    progress: job.progress,
    completedAt: job.completedAt ?? new Date().toISOString(),
    resultsUrl: `${baseUrl}/v1/jobs/${job.jobId}`,
    ...(job.fatalError ? { fatalError: { code: job.fatalError.code, message: job.fatalError.message } } : {})
  };

  try {
    const body = JSON.stringify(payload);
    if (body.length > WEBHOOK_MAX_BODY) {
      logger.warn({ jobId: job.jobId, size: body.length }, "webhook payload exceeds max body, truncating");
    }
    const res = await fetch(callbackUrl, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "PinForge-API/0.1 (webhook)" },
      body,
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS)
    });
    if (!res.ok) {
      logger.warn({ jobId: job.jobId, callbackUrl, status: res.status }, "webhook callback returned non-2xx");
    } else {
      logger.info({ jobId: job.jobId, callbackUrl, status: res.status }, "webhook delivered");
    }
  } catch (e) {
    logger.warn({ jobId: job.jobId, callbackUrl, err: String(e) }, "webhook dispatch failed");
  }
}
