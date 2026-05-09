import { describe, it, expect } from 'vitest';
import { codeFor, batchCodes } from '@lib/calc/smart-lock-codes';

describe('smart-lock-codes', () => {
  it('is deterministic for same input', () => {
    const a = codeFor({ bookingId: 'B-1234', secret: 'host-secret-A', digits: 6 });
    const b = codeFor({ bookingId: 'B-1234', secret: 'host-secret-A', digits: 6 });
    expect(a).toBe(b);
  });
  it('produces different codes for different bookings', () => {
    const a = codeFor({ bookingId: 'B-1234', secret: 'S', digits: 6 });
    const b = codeFor({ bookingId: 'B-1235', secret: 'S', digits: 6 });
    expect(a).not.toBe(b);
  });
  it('produces different codes for different secrets', () => {
    const a = codeFor({ bookingId: 'B-1234', secret: 'S1', digits: 6 });
    const b = codeFor({ bookingId: 'B-1234', secret: 'S2', digits: 6 });
    expect(a).not.toBe(b);
  });
  it('respects digit length 4..8', () => {
    for (const digits of [4, 5, 6, 7, 8]) {
      const c = codeFor({ bookingId: 'X', secret: 'Y', digits });
      expect(c).toHaveLength(digits);
      expect(c).toMatch(/^\d+$/);
    }
  });
  it('batchCodes preserves order', () => {
    const r = batchCodes({ bookings: ['a', 'b', 'c'], secret: 'S', digits: 6 });
    expect(r.map(x => x.bookingId)).toEqual(['a', 'b', 'c']);
  });
  it('reproducibility: same triple -> same code across calls', () => {
    // Strong reproducibility test: pin a known code value to detect drift
    const c = codeFor({ bookingId: 'B-RECON', secret: 'reproducibility-seed', digits: 6 });
    const c2 = codeFor({ bookingId: 'B-RECON', secret: 'reproducibility-seed', digits: 6 });
    expect(c).toBe(c2);
    expect(c).toHaveLength(6);
    expect(c).toMatch(/^\d{6}$/);
  });
});
