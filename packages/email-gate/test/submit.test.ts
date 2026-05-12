import { describe, it, expect, vi } from 'vitest';
import { submit } from '../src/submit.js';
import { buildEspPayload } from '../src/payload.js';

describe('submit (ESP webhook)', () => {
  it('rejects invalid email', async () => {
    const result = await submit({ siteId: 'guests', email: 'not-an-email' });
    expect(result).toBe(false);
  });

  it('rejects bad siteId', async () => {
    const result = await submit({ siteId: 'foo' as any, email: 'a@b.co' });
    expect(result).toBe(false);
  });

  it('returns true and logs in dev mode (no webhook)', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await submit(
      { siteId: 'guests', email: 'a@b.co', magnet: 'house-rules', toolSlug: 'house-rules-pdf' },
      { webhook: '' },
    );
    expect(result).toBe(true);
    expect(consoleWarn).toHaveBeenCalled();
    consoleWarn.mockRestore();
  });

  it('POSTs to webhook with built payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    const result = await submit(
      { siteId: 'guests', email: 'a@b.co', magnet: 'house-rules', toolSlug: 'house-rules-pdf' },
      { webhook: 'https://hooks.example.com/x', fetchImpl: fetchMock as any },
    );
    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://hooks.example.com/x');
    expect(init).toMatchObject({ method: 'POST', keepalive: true });
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      email: 'a@b.co',
      source: 'strguests.tools',
      utm_source: 'strguests-tools',
      magnet: 'house-rules',
      tool: 'house-rules-pdf',
    });
  });

  it('returns false when fetch throws', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network'));
    const result = await submit(
      { siteId: 'guests', email: 'a@b.co' },
      { webhook: 'https://hooks.example.com/x', fetchImpl: fetchMock as any },
    );
    expect(result).toBe(false);
  });

  it('returns false on non-2xx response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    const result = await submit(
      { siteId: 'guests', email: 'a@b.co' },
      { webhook: 'https://hooks.example.com/x', fetchImpl: fetchMock as any },
    );
    expect(result).toBe(false);
  });
});

describe('buildEspPayload', () => {
  it('uses correct site domain per siteId', () => {
    expect(buildEspPayload({ siteId: 'guests', email: 'a@b.co' }).source).toBe('strguests.tools');
    expect(buildEspPayload({ siteId: 'buyers', email: 'a@b.co' }).source).toBe('strbuyers.tools');
    expect(buildEspPayload({ siteId: 'host', email: 'a@b.co' }).source).toBe('strhost.tools');
    expect(buildEspPayload({ siteId: 'ops', email: 'a@b.co' }).source).toBe('strops.tools');
  });

  it('defaults utm_medium to pdf-download', () => {
    const p = buildEspPayload({ siteId: 'guests', email: 'a@b.co' });
    expect(p.utm_medium).toBe('pdf-download');
  });

  it('respects custom utmMedium', () => {
    const p = buildEspPayload({ siteId: 'guests', email: 'a@b.co', utmMedium: 'email-capture' });
    expect(p.utm_medium).toBe('email-capture');
  });
});
