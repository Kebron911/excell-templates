/**
 * Alert signup + double-opt-in routes.
 *
 *   POST /api/alerts/subscribe   — email + city_id → confirmation email
 *   GET  /api/alerts/confirm     — token from email → mark confirmed_at
 *   POST /api/alerts/unsubscribe — email → mark unsubscribed_at
 *
 * Subscriber-storage and email-provider are injected so the route is unit-
 * testable without MySQL or Resend creds. Server.bootstrap wires the real
 * implementations from env at startup.
 */
import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { createHash, randomBytes } from 'node:crypto';
import { assertValidEmail, InvalidEmailError } from '../lib/alerts/email-validate';
import { confirmationEmail } from '../lib/alerts/templates';
import type { AlertSubscriber, EmailProvider } from '../lib/alerts/types';

const subscribeBody = z.object({
  email: z.string(),
  city_id: z.number().int().positive(),
  severity_threshold: z.enum(['minor', 'material', 'major']).optional().default('material'),
  source_page: z.string().max(255).optional(),
  utm: z.record(z.string(), z.string()).optional(),
});

export type SubscribeRequest = z.infer<typeof subscribeBody>;

/**
 * Persistence port. The orchestrator wires up the MySQL-backed impl; tests
 * pass an in-memory fake.
 */
export interface AlertsRepository {
  upsertSubscriberWithConfirmToken(input: {
    email: string;
    sourcePage: string | null;
    utm: Record<string, string> | null;
    confirmTokenHash: string;
  }): Promise<{ subscriber: AlertSubscriber; isNew: boolean }>;
  addSubscription(input: {
    subscriberId: number;
    cityId: number;
    severityThreshold: SubscribeRequest['severity_threshold'];
  }): Promise<{ inserted: boolean }>;
  findByConfirmTokenHash(hash: string): Promise<AlertSubscriber | null>;
  markConfirmed(subscriberId: number): Promise<void>;
  findByEmail(email: string): Promise<AlertSubscriber | null>;
  markUnsubscribed(subscriberId: number): Promise<void>;
}

export interface AlertsRouterDeps {
  repo: AlertsRepository;
  confirmationProvider: EmailProvider | null;
}

/**
 * Generate a 32-byte URL-safe confirmation token and its sha256 hash.
 * The unhashed token goes in the confirmation email; only the hash is stored.
 */
export function generateConfirmToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url');
  // hash is computed lazily via crypto to avoid pulling node:crypto twice
  return { token, hash: hashConfirmToken(token) };
}

export function hashConfirmToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createAlertsRouter(deps: AlertsRouterDeps): Router {
  const router = Router();

  router.post('/subscribe', async (req: Request, res: Response) => {
    const parsed = subscribeBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'invalid_payload', details: parsed.error.issues });
    }

    let email: string;
    try {
      email = assertValidEmail(parsed.data.email);
    } catch (err) {
      if (err instanceof InvalidEmailError) {
        return res.status(400).json({ error: 'invalid_email', message: err.message });
      }
      throw err;
    }

    const { token, hash } = generateConfirmToken();

    const { subscriber, isNew } = await deps.repo.upsertSubscriberWithConfirmToken({
      email,
      sourcePage: parsed.data.source_page ?? null,
      utm: parsed.data.utm ?? null,
      confirmTokenHash: hash,
    });

    await deps.repo.addSubscription({
      subscriberId: subscriber.id,
      cityId: parsed.data.city_id,
      severityThreshold: parsed.data.severity_threshold,
    });

    if (deps.confirmationProvider) {
      await deps.confirmationProvider.send(confirmationEmail({ toEmail: email, confirmToken: token }));
    }

    return res.status(202).json({ status: 'pending_confirmation', is_new_subscriber: isNew });
  });

  router.get('/confirm', async (req: Request, res: Response) => {
    const token = typeof req.query.token === 'string' ? req.query.token : '';
    if (!token) return res.status(400).json({ error: 'missing_token' });

    const subscriber = await deps.repo.findByConfirmTokenHash(hashConfirmToken(token));
    if (!subscriber) return res.status(404).json({ error: 'invalid_or_expired_token' });

    if (!subscriber.confirmed_at) {
      await deps.repo.markConfirmed(subscriber.id);
    }
    return res.status(200).json({ status: 'confirmed', email: subscriber.email });
  });

  router.post('/unsubscribe', async (req: Request, res: Response) => {
    const parsed = z.object({ email: z.string() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_payload' });
    let email: string;
    try {
      email = assertValidEmail(parsed.data.email);
    } catch {
      return res.status(400).json({ error: 'invalid_email' });
    }
    const subscriber = await deps.repo.findByEmail(email);
    if (!subscriber) return res.status(200).json({ status: 'ok' }); // don't leak existence
    if (!subscriber.unsubscribed_at) {
      await deps.repo.markUnsubscribed(subscriber.id);
    }
    return res.status(200).json({ status: 'ok' });
  });

  return router;
}
