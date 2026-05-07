import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { hashIp, extractIp } from '../../server/lib/ip-hash';

describe('hashIp', () => {
  beforeEach(() => {
    process.env.IP_HASH_SALT = 'test-salt-abc';
  });
  afterEach(() => {
    delete process.env.IP_HASH_SALT;
  });

  it('returns 64-char sha256 hex', () => {
    const h = hashIp('203.0.113.7');
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is stable for the same input + salt', () => {
    expect(hashIp('203.0.113.7')).toBe(hashIp('203.0.113.7'));
  });

  it('changes when salt changes', () => {
    const a = hashIp('203.0.113.7');
    process.env.IP_HASH_SALT = 'different-salt';
    const b = hashIp('203.0.113.7');
    expect(a).not.toBe(b);
  });

  it('differs across IPs', () => {
    expect(hashIp('203.0.113.7')).not.toBe(hashIp('203.0.113.8'));
  });
});

describe('extractIp', () => {
  it('prefers x-forwarded-for first hop', () => {
    expect(
      extractIp({
        headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
        ip: '10.0.0.1',
      }),
    ).toBe('203.0.113.7');
  });

  it('falls back to req.ip when no XFF', () => {
    expect(extractIp({ headers: {}, ip: '198.51.100.4' })).toBe('198.51.100.4');
  });

  it('falls back to socket.remoteAddress when both are absent', () => {
    expect(
      extractIp({ headers: {}, socket: { remoteAddress: '198.51.100.5' } }),
    ).toBe('198.51.100.5');
  });

  it('returns 0.0.0.0 when nothing is available', () => {
    expect(extractIp({ headers: {} })).toBe('0.0.0.0');
  });
});
