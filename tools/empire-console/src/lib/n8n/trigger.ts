/**
 * Client-side n8n webhook helper. Used by capture flows (inbox, time-log,
 * voice, decisions, near-misses, console-actions) to POST directly to the
 * n8n capture-receiver flow.
 *
 * The receiver appends to ops/<file>.ndjson and (optionally) git-pushes,
 * eliminating the manual paste-flow.
 *
 * Configuration:
 *   PUBLIC_N8N_WEBHOOK_BASE — e.g. "https://n8n.thestrledger.com/webhook"
 *
 * Falls back to localStorage queue if the webhook isn't configured or the
 * POST fails (offline, n8n down, etc.). The /inbox page surfaces pending
 * items and offers manual drain.
 */

// ImportMetaEnv is augmented in src/env.d.ts (Astro convention) —
// PUBLIC_N8N_WEBHOOK_BASE is added there. Don't redeclare here.

export type CaptureType =
  | 'inbox'
  | 'voice'
  | 'decisions'
  | 'time-log'
  | 'near-misses'
  | 'console-actions';

export interface CaptureResult {
  ok: boolean;
  id?: string;
  file?: string;
  via: 'webhook' | 'queue';
  error?: string;
}

const FALLBACK_QUEUE_KEY = 'empire-capture-failed-queue';

function webhookBase(): string | null {
  if (typeof window === 'undefined') return null;
  // Astro inlines PUBLIC_* env vars at build time
  const fromEnv = (window as unknown as { __EMPIRE_WEBHOOK_BASE__?: string }).__EMPIRE_WEBHOOK_BASE__;
  return fromEnv || null;
}

/** Send a capture to n8n. On failure, queues into localStorage for retry. */
export async function sendCapture(type: CaptureType, payload: object): Promise<CaptureResult> {
  const base = webhookBase();
  if (!base) {
    queueLocally(type, payload, 'no webhook configured');
    return { ok: false, via: 'queue', error: 'PUBLIC_N8N_WEBHOOK_BASE not set' };
  }

  try {
    const res = await fetch(`${base}/empire-capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { ok: true, id: json.id, file: json.file, via: 'webhook' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    queueLocally(type, payload, msg);
    return { ok: false, via: 'queue', error: msg };
  }
}

function queueLocally(type: CaptureType, payload: object, reason: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(FALLBACK_QUEUE_KEY) || '[]');
    existing.push({ type, payload, reason, ts: new Date().toISOString() });
    localStorage.setItem(FALLBACK_QUEUE_KEY, JSON.stringify(existing));
  } catch { /* swallow */ }
}

/** Drain the fallback queue. Called by /inbox page on demand. */
export async function drainQueue(): Promise<{ sent: number; failed: number }> {
  if (typeof localStorage === 'undefined') return { sent: 0, failed: 0 };
  let queue;
  try { queue = JSON.parse(localStorage.getItem(FALLBACK_QUEUE_KEY) || '[]'); }
  catch { return { sent: 0, failed: 0 }; }

  let sent = 0;
  const remaining: typeof queue = [];
  for (const item of queue) {
    const result = await sendCapture(item.type, item.payload);
    if (result.via === 'webhook') sent++;
    else remaining.push(item);
  }
  localStorage.setItem(FALLBACK_QUEUE_KEY, JSON.stringify(remaining));
  return { sent, failed: remaining.length };
}

export function fallbackQueueSize(): number {
  if (typeof localStorage === 'undefined') return 0;
  try { return JSON.parse(localStorage.getItem(FALLBACK_QUEUE_KEY) || '[]').length; }
  catch { return 0; }
}
