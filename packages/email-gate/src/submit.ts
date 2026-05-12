import { EmailCapturePayloadSchema, type EmailCapturePayload } from './schema.js';
import { buildEspPayload } from './payload.js';

export interface SubmitOptions {
  /** Override the webhook URL (default reads from PUBLIC_ESP_WEBHOOK env). */
  webhook?: string;
  /** Custom fetch impl (for testing). */
  fetchImpl?: typeof fetch;
}

/**
 * POST email capture to ESP webhook. Returns true on success, false on
 * any failure (validation, network, non-2xx).
 *
 * When PUBLIC_ESP_WEBHOOK is unset (dev mode), logs the payload and
 * returns true so caller flows still complete.
 */
export async function submit(
  input: EmailCapturePayload,
  options: SubmitOptions = {},
): Promise<boolean> {
  const parsed = EmailCapturePayloadSchema.safeParse(input);
  if (!parsed.success) return false;

  const fetchFn = options.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch : undefined);
  if (!fetchFn) return false;

  const webhook =
    options.webhook ??
    (typeof import.meta !== 'undefined'
      ? ((import.meta as any).env?.PUBLIC_ESP_WEBHOOK as string | undefined)
      : undefined) ??
    '';

  const body = buildEspPayload(parsed.data);

  if (!webhook) {
    // eslint-disable-next-line no-console
    console.warn('[email-gate] PUBLIC_ESP_WEBHOOK not set; payload:', body);
    return true;
  }

  try {
    const res = await fetchFn(webhook, {
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

/**
 * Email validation matching what STRGuests's PdfDownloadButton + the
 * EmailCaptureCard component use. Exposed so all surfaces share one regex.
 */
export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
