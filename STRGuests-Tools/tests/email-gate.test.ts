import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isGateDismissed,
  markGateDismissed,
  clearGateDismissed,
  isValidEmail,
  buildEspPayload,
  submit,
} from '@str/email-gate';

// Lightweight sessionStorage stub. Vitest 'node' env has no DOM globals.
class SessionStorageStub {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.has(k) ? this.store.get(k)! : null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
  get length() { return this.store.size; }
  key(i: number) { return Array.from(this.store.keys())[i] ?? null; }
}

describe('isGateDismissed / markGateDismissed', () => {
  beforeEach(() => {
    (globalThis as any).window = { sessionStorage: new SessionStorageStub() };
  });

  afterEach(() => {
    delete (globalThis as any).window;
  });

  it('returns false before any mark', () => {
    expect(isGateDismissed('house-rules-pdf')).toBe(false);
  });

  it('returns true after markGateDismissed for the same slug', () => {
    markGateDismissed('house-rules-pdf');
    expect(isGateDismissed('house-rules-pdf')).toBe(true);
  });

  it('is per-toolSlug — dismissing one does not suppress another', () => {
    markGateDismissed('house-rules-pdf');
    expect(isGateDismissed('welcome-book')).toBe(false);
  });

  it('clearGateDismissed undoes the mark', () => {
    markGateDismissed('wifi-sign');
    clearGateDismissed('wifi-sign');
    expect(isGateDismissed('wifi-sign')).toBe(false);
  });

  it('SSR-safe — returns false when window is undefined', () => {
    delete (globalThis as any).window;
    expect(isGateDismissed('any')).toBe(false);
    // mark should not throw either
    expect(() => markGateDismissed('any')).not.toThrow();
  });
});

describe('isValidEmail', () => {
  it.each(['daniel@example.com', 'a+b@c.io', 'first.last@strguests.tools'])(
    'accepts %s',
    (e) => expect(isValidEmail(e)).toBe(true),
  );

  it.each(['', 'no-at-sign', 'foo@bar', '@bar.com', 'foo@.com', 'foo@bar.', null, undefined, 42, {}])(
    'rejects %p',
    (e) => expect(isValidEmail(e as any)).toBe(false),
  );
});

describe('buildEspPayload', () => {
  it('returns the canonical strguests payload shape', () => {
    const t0 = Date.now();
    const out = buildEspPayload({ siteId: 'guests', email: '  daniel@example.com  ', magnet: 'wb', toolSlug: 'welcome-book' });
    expect(out.email).toBe('daniel@example.com'); // trimmed
    expect(out.magnet).toBe('wb');
    expect(out.source).toBe('strguests.tools');
    expect(out.tool).toBe('welcome-book');
    expect(out.utm_source).toBe('strguests-tools');
    expect(out.utm_medium).toBe('pdf-download');
    expect(out.utm_content).toBe('welcome-book');
    expect(typeof out.ts).toBe('number');
    expect(out.ts as number).toBeGreaterThanOrEqual(t0);
  });

  it('honors a utmMedium override (e.g. for non-PDF email captures)', () => {
    const out = buildEspPayload({ siteId: 'guests', email: 'd@e.io', magnet: 'm', toolSlug: 't', utmMedium: 'card' });
    expect(out.utm_medium).toBe('card');
  });
});

describe('submit (ESP webhook)', () => {
  beforeEach(() => {
    (globalThis as any).fetch = vi.fn(async () => ({ ok: true } as Response));
  });

  afterEach(() => {
    delete (globalThis as any).fetch;
  });

  it('returns false for invalid email (no fetch made)', async () => {
    const ok = await submit({ siteId: 'guests', email: 'not-an-email' });
    expect(ok).toBe(false);
    expect((globalThis as any).fetch).not.toHaveBeenCalled();
  });

  it('logs (no fetch) when no webhook is provided — resolves true so caller flow continues', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const ok = await submit(
      { siteId: 'guests', email: 'd@e.io', magnet: 'm', toolSlug: 't' },
      { webhook: '' }, // explicit empty override — bypasses import.meta.env lookup
    );
    expect(ok).toBe(true);
    expect((globalThis as any).fetch).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('POSTs JSON to the webhook when one is provided and returns res.ok', async () => {
    const ok = await submit(
      { siteId: 'guests', email: 'd@e.io', magnet: 'm', toolSlug: 't' },
      { webhook: 'https://example.com/hook' },
    );
    expect(ok).toBe(true);
    const fetchMock = (globalThis as any).fetch as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.com/hook');
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    const body = JSON.parse(init.body as string);
    expect(body.email).toBe('d@e.io');
    expect(body.tool).toBe('t');
  });

  it('returns false when fetch rejects (network error)', async () => {
    (globalThis as any).fetch = vi.fn(async () => { throw new Error('network'); });
    const ok = await submit(
      { siteId: 'guests', email: 'd@e.io', magnet: 'm', toolSlug: 't' },
      { webhook: 'https://example.com/hook' },
    );
    expect(ok).toBe(false);
  });

  it('returns false when fetch is not available (SSR)', async () => {
    delete (globalThis as any).fetch;
    const ok = await submit(
      { siteId: 'guests', email: 'd@e.io', magnet: 'm', toolSlug: 't' },
      { webhook: 'https://example.com/hook' },
    );
    expect(ok).toBe(false);
  });
});
