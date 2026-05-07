import { describe, it, expect } from 'vitest';
import { codeFor, batchCodes } from '@/lib/calc/smart-lock-codes';

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

  it('clamps out-of-range digit lengths', () => {
    expect(codeFor({ bookingId: 'X', secret: 'Y', digits: 2 })).toHaveLength(4);
    expect(codeFor({ bookingId: 'X', secret: 'Y', digits: 12 })).toHaveLength(8);
  });

  it('batchCodes preserves order', () => {
    const r = batchCodes({ bookings: ['a', 'b', 'c'], secret: 'S', digits: 6 });
    expect(r.map(x => x.bookingId)).toEqual(['a', 'b', 'c']);
  });

  it('batch results match single-call results', () => {
    const r = batchCodes({ bookings: ['a', 'b'], secret: 'S', digits: 6 });
    expect(r[0].code).toBe(codeFor({ bookingId: 'a', secret: 'S', digits: 6 }));
    expect(r[1].code).toBe(codeFor({ bookingId: 'b', secret: 'S', digits: 6 }));
  });
});
