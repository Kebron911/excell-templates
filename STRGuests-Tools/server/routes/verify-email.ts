/**
 * Email verification HTTP routes.
 *
 *   POST /api/verify-email/start    { email }            → { ok, expiresAt }
 *   GET  /api/verify-email/confirm  ?email&nonce         → 302 redirect to /verified or { status: '...' }
 *
 * The confirm endpoint sets the `sg-verified-email` signed cookie on success so the
 * rate-limit middleware upgrades the visitor on subsequent requests.
 */

import type { Request, Response } from 'express';
import { startVerification, confirmVerification, isValidEmail } from '../lib/email-verify';
import { buildSetCookieHeader } from '../lib/verified-cookie';
import { sendMail } from '../lib/mailer';

function siteBaseUrl(req: Request): string {
  const override = process.env.PUBLIC_API_BASE;
  if (override) return override.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = req.headers.host ?? 'strguests.tools';
  return `${proto}://${host}`;
}

export async function verifyEmailStart(req: Request, res: Response): Promise<void> {
  const email = String(req.body?.email ?? '').trim();
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'invalid_email' });
    return;
  }
  try {
    const { nonce, expiresAt } = await startVerification(email);
    const link = `${siteBaseUrl(req)}/api/verify-email/confirm?email=${encodeURIComponent(email)}&nonce=${nonce}`;
    await sendMail({
      to: email,
      subject: 'Confirm your strguests.tools email',
      text: `Hi —\n\nConfirm your email to unlock 50 AI generations per day (vs 5/hour):\n\n${link}\n\nThis link expires in 24 hours.\n\nstrguests.tools`,
    });
    res.json({ ok: true, expiresAt });
  } catch (err) {
    res.status(500).json({ error: 'send_failed' });
  }
}

export async function verifyEmailConfirm(req: Request, res: Response): Promise<void> {
  const email = String(req.query?.email ?? '').trim();
  const nonce = String(req.query?.nonce ?? '').trim();
  if (!email || !nonce) {
    res.status(400).json({ error: 'missing_params' });
    return;
  }
  const status = await confirmVerification(email, nonce);
  if (status === 'ok') {
    const secure = (req.headers['x-forwarded-proto'] as string) === 'https';
    res.setHeader('Set-Cookie', buildSetCookieHeader(email, { secure }));
    // Browsers hitting the link get a friendly redirect; JSON callers (tests, curl) get the JSON.
    const wantsJson = (req.headers.accept ?? '').includes('application/json');
    if (wantsJson) {
      res.json({ status: 'ok' });
      return;
    }
    res.redirect(302, '/verified');
    return;
  }
  res.status(400).json({ status });
}
