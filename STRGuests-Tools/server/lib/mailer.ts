/**
 * Minimal mailer — sends verification + receipt emails.
 *
 * Provider selection by `EMAIL_PROVIDER` env:
 *   - unset / 'console' (default in dev/test): logs the email payload to console + returns OK.
 *   - 'webhook': POSTs the payload to PUBLIC_ESP_WEBHOOK as JSON (lets the ESP do the SMTP).
 *
 * Production wiring (Resend/Postmark/etc.) lives behind the same `sendMail()` contract; swap providers
 * by adding a new branch here without touching the routes.
 */

export interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface MailResult {
  delivered: boolean;
  provider: string;
  /** Verification links etc. — populated by 'console' provider for dev convenience. */
  previewBody?: string;
}

export async function sendMail(payload: MailPayload): Promise<MailResult> {
  const provider = (process.env.EMAIL_PROVIDER ?? 'console').toLowerCase();

  if (provider === 'console') {
    // eslint-disable-next-line no-console
    console.log(`[mailer:console] to=${payload.to} subject="${payload.subject}"\n${payload.text}`);
    return { delivered: true, provider: 'console', previewBody: payload.text };
  }

  if (provider === 'webhook') {
    const url = process.env.PUBLIC_ESP_WEBHOOK;
    if (!url) throw new Error('PUBLIC_ESP_WEBHOOK not set');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { delivered: res.ok, provider: 'webhook' };
  }

  throw new Error(`unknown EMAIL_PROVIDER: ${provider}`);
}
