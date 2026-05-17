import pino from "pino";
import type { JobState } from "./jobs.js";

const logger = pino({ name: "webhook-dispatcher" });

// ---------------------------------------------------------------------------
// SSRF guard — isPublicHttpUrl
// ---------------------------------------------------------------------------

const PRIVATE_HOSTNAMES = new Set(["localhost", "ip6-localhost", "ip6-loopback"]);
const PRIVATE_HOSTNAME_SUFFIXES = [".local", ".internal", ".localhost"];

/** Returns true if the URL is safe to POST to from a server-side context. */
export function isPublicHttpUrl(rawUrl: string): boolean {
  let url: URL;
  try { url = new URL(rawUrl); } catch { return false; }

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase();

  if (PRIVATE_HOSTNAMES.has(host)) return false;
  if (PRIVATE_HOSTNAME_SUFFIXES.some(s => host.endsWith(s))) return false;

  // IPv4 literal — block private/loopback/link-local
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [parseInt(ipv4[1]!), parseInt(ipv4[2]!)];
    if (a === 127) return false;                        // loopback
    if (a === 10) return false;                         // RFC 1918
    if (a === 169 && b === 254) return false;           // link-local incl AWS IMDS
    if (a === 172 && b >= 16 && b <= 31) return false;  // RFC 1918
    if (a === 192 && b === 168) return false;           // RFC 1918
    if (a === 0) return false;                          // 0.0.0.0
    if (a >= 224) return false;                         // multicast/reserved
  }

  // IPv6 literal — Node's URL parser normalises ::ffff:a.b.c.d to hex groups.
  // host includes the surrounding brackets e.g. "[::1]", "[fe80::1]", "[::ffff:a00:1]"
  if (host.startsWith("[") && host.endsWith("]")) {
    const v6 = host.slice(1, -1).toLowerCase();
    if (v6 === "::1") return false;
    if (v6.startsWith("fe80:") || v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb")) return false; // link-local fe80::/10
    if (v6.startsWith("fc") || v6.startsWith("fd")) return false; // unique-local fc00::/7
    // Block IPv4-mapped in dotted-decimal form: ::ffff:a.b.c.d
    const v4mappedDot = v6.match(/^::ffff:(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (v4mappedDot) {
      const a = parseInt(v4mappedDot[1]!), b = parseInt(v4mappedDot[2]!);
      if (a === 127 || a === 10 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return false;
    }
    // Block IPv4-mapped in hex form (Node normalises ::ffff:10.0.0.1 → ::ffff:a00:1)
    // Pattern: ::ffff:XXYY:ZZWW — reconstruct first two IPv4 octets from XXYY
    const v4mappedHex = v6.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (v4mappedHex) {
      const high = parseInt(v4mappedHex[1]!, 16); // upper 16 bits of IPv4
      const a = (high >> 8) & 0xff;               // first octet
      const b = high & 0xff;                      // second octet
      if (a === 127 || a === 10 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return false;
    }
  }

  return true;
}

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
  if (!isPublicHttpUrl(callbackUrl)) {
    logger.warn({ jobId: job.jobId, callbackUrl }, "webhook URL rejected (private/internal target)");
    return;
  }
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
