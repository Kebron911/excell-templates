import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../../server/index';
import { hashConfirmToken, type AlertsRepository } from '../../server/routes/alerts';
import type { AlertSubscriber, EmailMessage, EmailProvider, EmailSendResult } from '../../server/lib/alerts/types';

function makeFakeRepo(): AlertsRepository & {
  _subscribers: Map<number, AlertSubscriber>;
  _byEmail: Map<string, number>;
  _byTokenHash: Map<string, number>;
  _subscriptions: Array<{ subscriberId: number; cityId: number; threshold: string }>;
  _nextId: number;
} {
  const subscribers = new Map<number, AlertSubscriber>();
  const byEmail = new Map<string, number>();
  const byTokenHash = new Map<string, number>();
  const subscriptions: Array<{ subscriberId: number; cityId: number; threshold: string }> = [];
  let nextId = 1;

  return {
    _subscribers: subscribers,
    _byEmail: byEmail,
    _byTokenHash: byTokenHash,
    _subscriptions: subscriptions,
    _nextId: nextId,

    async upsertSubscriberWithConfirmToken(input) {
      const existingId = byEmail.get(input.email);
      if (existingId) {
        byTokenHash.set(input.confirmTokenHash, existingId);
        return { subscriber: subscribers.get(existingId)!, isNew: false };
      }
      const id = nextId++;
      const sub: AlertSubscriber = {
        id,
        email: input.email,
        tier: 'free',
        influencersoft_contact_id: null,
        confirmed_at: null,
        unsubscribed_at: null,
      };
      subscribers.set(id, sub);
      byEmail.set(input.email, id);
      byTokenHash.set(input.confirmTokenHash, id);
      return { subscriber: sub, isNew: true };
    },
    async addSubscription(input) {
      const exists = subscriptions.some((s) => s.subscriberId === input.subscriberId && s.cityId === input.cityId);
      if (exists) return { inserted: false };
      subscriptions.push({ subscriberId: input.subscriberId, cityId: input.cityId, threshold: input.severityThreshold });
      return { inserted: true };
    },
    async findByConfirmTokenHash(hash) {
      const id = byTokenHash.get(hash);
      return id ? subscribers.get(id)! : null;
    },
    async markConfirmed(subscriberId) {
      const s = subscribers.get(subscriberId);
      if (s) s.confirmed_at = new Date().toISOString();
    },
    async findByEmail(email) {
      const id = byEmail.get(email);
      return id ? subscribers.get(id)! : null;
    },
    async markUnsubscribed(subscriberId) {
      const s = subscribers.get(subscriberId);
      if (s) s.unsubscribed_at = new Date().toISOString();
    },
  };
}

function makeFakeProvider(): EmailProvider & { sent: EmailMessage[] } {
  const sent: EmailMessage[] = [];
  return {
    channel: 'resend',
    sent,
    async send(message: EmailMessage): Promise<EmailSendResult> {
      sent.push(message);
      return { providerMessageId: `fake_${sent.length}`, status: 'sent', errorMessage: null };
    },
  };
}

async function request(app: ReturnType<typeof createApp>, method: 'GET' | 'POST', path: string, body?: unknown) {
  // Minimal supertest-free harness — use the express handler directly via http.
  // We bind to port 0 → ephemeral port.
  const { createServer } = await import('node:http');
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  try {
    const r = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await r.text();
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // ignore — leave parsed null
    }
    return { status: r.status, body: parsed as Record<string, unknown> | null };
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

let repo: ReturnType<typeof makeFakeRepo>;
let provider: ReturnType<typeof makeFakeProvider>;
let app: ReturnType<typeof createApp>;

function setup() {
  repo = makeFakeRepo();
  provider = makeFakeProvider();
  app = createApp({ alerts: { repo, confirmationProvider: provider } });
}

afterEach(() => {
  /* no-op; per-test setup() is called inside each test */
});

describe('POST /api/alerts/subscribe', () => {
  it('accepts a valid signup, returns 202, and sends confirmation', async () => {
    setup();
    const r = await request(app, 'POST', '/api/alerts/subscribe', {
      email: 'daniel@example.com',
      city_id: 42,
    });
    expect(r.status).toBe(202);
    expect(r.body?.status).toBe('pending_confirmation');
    expect(r.body?.is_new_subscriber).toBe(true);
    expect(provider.sent).toHaveLength(1);
    expect(provider.sent[0]!.to).toBe('daniel@example.com');
    expect(provider.sent[0]!.subject.toLowerCase()).toContain('confirm');
    expect(repo._subscriptions).toHaveLength(1);
    expect(repo._subscriptions[0]!.cityId).toBe(42);
  });

  it('rejects invalid email with 400', async () => {
    setup();
    const r = await request(app, 'POST', '/api/alerts/subscribe', { email: 'not-an-email', city_id: 1 });
    expect(r.status).toBe(400);
    expect(r.body?.error).toBe('invalid_email');
    expect(provider.sent).toHaveLength(0);
  });

  it('rejects disposable email with 400', async () => {
    setup();
    const r = await request(app, 'POST', '/api/alerts/subscribe', { email: 'x@mailinator.com', city_id: 1 });
    expect(r.status).toBe(400);
    expect(r.body?.error).toBe('invalid_email');
  });

  it('rejects malformed payload (missing city_id) with 400', async () => {
    setup();
    const r = await request(app, 'POST', '/api/alerts/subscribe', { email: 'x@y.com' });
    expect(r.status).toBe(400);
    expect(r.body?.error).toBe('invalid_payload');
  });

  it('reuses an existing subscriber (is_new_subscriber=false) on second signup', async () => {
    setup();
    await request(app, 'POST', '/api/alerts/subscribe', { email: 'a@b.com', city_id: 1 });
    const r2 = await request(app, 'POST', '/api/alerts/subscribe', { email: 'a@b.com', city_id: 2 });
    expect(r2.status).toBe(202);
    expect(r2.body?.is_new_subscriber).toBe(false);
    expect(repo._subscribers.size).toBe(1);
    expect(repo._subscriptions).toHaveLength(2);
  });
});

describe('GET /api/alerts/confirm', () => {
  it('confirms a subscriber from a valid token and returns 200', async () => {
    setup();
    await request(app, 'POST', '/api/alerts/subscribe', { email: 'c@d.com', city_id: 1 });
    // Pull the token URL out of the sent email
    const link = provider.sent[0]!.text.match(/token=([^\s]+)/)?.[1];
    expect(link).toBeTruthy();
    const decoded = decodeURIComponent(link!);
    const r = await request(app, 'GET', `/api/alerts/confirm?token=${encodeURIComponent(decoded)}`);
    expect(r.status).toBe(200);
    expect(r.body?.status).toBe('confirmed');
    expect(r.body?.email).toBe('c@d.com');
    const subscriber = [...repo._subscribers.values()][0]!;
    expect(subscriber.confirmed_at).not.toBeNull();
  });

  it('returns 400 when token query param is missing', async () => {
    setup();
    const r = await request(app, 'GET', '/api/alerts/confirm');
    expect(r.status).toBe(400);
  });

  it('returns 404 on unknown token (no DB row matches the hash)', async () => {
    setup();
    const r = await request(app, 'GET', '/api/alerts/confirm?token=bogus_token_no_one_has');
    expect(r.status).toBe(404);
  });

  it('is idempotent — confirming an already-confirmed sub returns 200 again', async () => {
    setup();
    await request(app, 'POST', '/api/alerts/subscribe', { email: 'e@f.com', city_id: 1 });
    const link = provider.sent[0]!.text.match(/token=([^\s]+)/)?.[1]!;
    const decoded = decodeURIComponent(link);
    await request(app, 'GET', `/api/alerts/confirm?token=${encodeURIComponent(decoded)}`);
    const r2 = await request(app, 'GET', `/api/alerts/confirm?token=${encodeURIComponent(decoded)}`);
    expect(r2.status).toBe(200);
  });
});

describe('POST /api/alerts/unsubscribe', () => {
  it('marks an existing subscriber as unsubscribed and returns 200', async () => {
    setup();
    await request(app, 'POST', '/api/alerts/subscribe', { email: 'u@v.com', city_id: 1 });
    const r = await request(app, 'POST', '/api/alerts/unsubscribe', { email: 'u@v.com' });
    expect(r.status).toBe(200);
    const subscriber = [...repo._subscribers.values()][0]!;
    expect(subscriber.unsubscribed_at).not.toBeNull();
  });

  it('returns 200 even for unknown email (no enumeration)', async () => {
    setup();
    const r = await request(app, 'POST', '/api/alerts/unsubscribe', { email: 'nobody@nowhere.com' });
    expect(r.status).toBe(200);
  });
});

describe('hashConfirmToken', () => {
  it('produces stable 64-char hex SHA-256 digests', () => {
    expect(hashConfirmToken('hello')).toBe(hashConfirmToken('hello'));
    expect(hashConfirmToken('hello')).toMatch(/^[0-9a-f]{64}$/);
    expect(hashConfirmToken('a')).not.toBe(hashConfirmToken('b'));
  });
});
