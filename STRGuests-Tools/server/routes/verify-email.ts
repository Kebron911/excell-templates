/**
 * Email verification routes.
 *
 *   POST /api/verify-email           — issue a token, persist to email_verifications,
 *                                      "send" via console.log (mock SMTP)
 *   GET  /api/verify-email/confirm   — claim a token; sets sg_verified signed cookie
 */

import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { issueToken, isValidEmail, maskEmail, tokenHash, verifyToken } from '../lib/email-verify.js';
import { buildCookie } from '../lib/verified-cookie.js';
import { query } from '../lib/db.js';

const IssueBody = z.object({ email: z.string().min(3).max(255) });

export function makeVerifyEmailRouter(): Router {
  const r = Router();

  r.post('/api/verify-email', async (req: Request, res: Response) => {
    const parsed = IssueBody.safeParse(req.body);
    if (!parsed.success || !isValidEmail(parsed.data.email)) {
      return res.status(400).json({ error: 'invalid_email' });
    }
    try {
      const issued = issueToken(parsed.data.email);
      await query(
        'INSERT INTO email_verifications (email, token_hash, nonce, expires_at) VALUES (?, ?, ?, ?)',
        [issued.email, issued.tokenHash, issued.nonce, issued.expiresAt],
      );
      // Mock SMTP — real provider wired in Phase 6.
      console.log(`[email-verify] would send token to ${maskEmail(issued.email)} (expires ${issued.expiresAt.toISOString()})`);
      res.json({ ok: true, tokenSentTo: maskEmail(issued.email) });
    } catch (err) {
      console.error('[email-verify] issue failed:', err);
      res.status(500).json({ error: 'issue_failed' });
    }
  });

  r.get('/api/verify-email/confirm', async (req: Request, res: Response) => {
    const token = String(req.query.t ?? '');
    if (!token) return res.status(400).json({ error: 'missing_token' });

    const result = verifyToken(token);
    if (!result.ok || !result.email) {
      return res.status(400).json({ error: 'invalid_token' });
    }

    try {
      const rows = await query<{ id: number; expires_at: Date; verified_at: Date | null }>(
        'SELECT id, expires_at, verified_at FROM email_verifications WHERE token_hash = ? AND email = ? LIMIT 1',
        [tokenHash(token), result.email],
      );
      const row = rows[0];
      if (!row) return res.status(404).json({ error: 'not_found' });
      if (new Date(row.expires_at).getTime() < Date.now()) {
        return res.status(410).json({ error: 'expired' });
      }
      if (!row.verified_at) {
        await query('UPDATE email_verifications SET verified_at = NOW() WHERE id = ?', [row.id]);
      }
      res.setHeader('Set-Cookie', buildCookie(result.email));
      res.json({ ok: true, email: result.email });
    } catch (err) {
      console.error('[email-verify] confirm failed:', err);
      res.status(500).json({ error: 'confirm_failed' });
    }
  });

  return r;
}
