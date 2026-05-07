/**
 * Email-gate module — Task 15 (Phase 2).
 *
 * Shared logic for the soft email modal that appears after a PDF generator
 * triggers a download. The PdfDownloadButton component (Phase 1 Task 5) is
 * the sole consumer; extracting this here means the four PDF generators
 * (T11–T14) all share one ESP-post path + one session-dismissal contract.
 *
 * Contract:
 *   - PDF download ALWAYS happens. The modal NEVER blocks the download.
 *   - "Skip and download" closes the modal silently.
 *   - "Email me" submits, posts to ESP webhook, closes the modal.
 *   - Session-level dismissal: if a visitor closes the modal once, they
 *     don't see it again for the rest of the tab session (sessionStorage,
 *     not localStorage — coming back tomorrow re-shows it).
 *   - Optional dismissal flag is per-toolSlug so dismissing house-rules
 *     doesn't suppress welcome-book.
 *
 * SSR-safe: every browser API (window, sessionStorage, fetch) is guarded
 * so the module can be imported by both server and client code paths.
 */

const DISMISS_PREFIX = 'strguests:gate-dismissed:';

export interface EmailCapturePayload {
  email: string;
  magnet: string;
  toolSlug: string;
  utm_medium?: string;
}

/**
 * Returns true when this visitor has already dismissed the gate for the
 * given toolSlug in the current tab session. Use to suppress the modal
 * after the second download in the same visit.
 *
 * SSR: returns false (no sessionStorage on the server).
 */
export function isGateDismissed(toolSlug: string): boolean {
  if (typeof window === 'undefined' || !window.sessionStorage) return false;
  try {
    return window.sessionStorage.getItem(DISMISS_PREFIX + toolSlug) === '1';
  } catch {
    // sessionStorage can throw in private-mode Safari etc.
    return false;
  }
}

/**
 * Marks the gate as dismissed for this tool + tab session.
 * SSR: no-op.
 */
export function markGateDismissed(toolSlug: string): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    window.sessionStorage.setItem(DISMISS_PREFIX + toolSlug, '1');
  } catch {
    /* private mode etc. — silent */
  }
}

/**
 * Clears the dismissal flag. Useful for tests; not exposed in the UI.
 */
export function clearGateDismissed(toolSlug: string): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(DISMISS_PREFIX + toolSlug);
  } catch {
    /* silent */
  }
}

/**
 * RFC-5322-ish email validation. Same regex as EmailCaptureCard so the
 * rules don't drift between the two surfaces.
 */
export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Builds the JSON payload sent to the ESP webhook.
 * Stable shape — EmailCaptureCard, PdfDownloadButton, and any future
 * surface should use this builder so ESP-side mappings don't drift.
 */
export function buildEspPayload(input: EmailCapturePayload): Record<string, unknown> {
  return {
    email: input.email.trim(),
    magnet: input.magnet,
    source: 'strguests.tools',
    tool: input.toolSlug,
    utm_source: 'strguests-tools',
    utm_medium: input.utm_medium ?? 'pdf-download',
    utm_content: input.toolSlug,
    ts: Date.now(),
  };
}

/**
 * POSTs the payload to PUBLIC_ESP_WEBHOOK. Returns true on success,
 * false otherwise. Resolves (never rejects) so callers don't need
 * try/catch around the optional capture step.
 *
 * When PUBLIC_ESP_WEBHOOK is unset (dev mode), the payload is logged
 * to the console for inspection and the function resolves true.
 */
export async function postEmailCapture(
  payload: EmailCapturePayload,
  webhookOverride?: string,
): Promise<boolean> {
  if (!isValidEmail(payload.email)) return false;
  if (typeof fetch === 'undefined') return false;

  const webhook =
    webhookOverride ??
    ((import.meta as any).env?.PUBLIC_ESP_WEBHOOK as string | undefined) ??
    '';

  const body = buildEspPayload(payload);

  if (!webhook) {
    // Dev mode — log so it's discoverable, return success so the
    // caller flow (close modal, gate marked dismissed) still runs.
    // eslint-disable-next-line no-console
    console.warn('[email-gate] PUBLIC_ESP_WEBHOOK not set; payload:', body);
    return true;
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
