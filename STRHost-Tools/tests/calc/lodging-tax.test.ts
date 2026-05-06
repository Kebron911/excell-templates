import { describe, it, expect } from 'vitest';
import { calculateLodgingTax } from '@/lib/calc/lodging-tax';

describe('calculateLodgingTax', () => {
  it('adds state + local rate and applies to subtotal', () => {
    const r = calculateLodgingTax({ subtotal: 1000, stateRate: 0.06, localRate: 0.04 });
    expect(r.effectiveRate).toBeCloseTo(0.10, 4);
    expect(r.taxAmount).toBeCloseTo(100, 2);
    expect(r.guestTotal).toBeCloseTo(1100, 2);
  });

  it('handles zero rates (e.g., California has no state lodging tax)', () => {
    const r = calculateLodgingTax({ subtotal: 500, stateRate: 0, localRate: 0 });
    expect(r.taxAmount).toBe(0);
    expect(r.guestTotal).toBe(500);
  });

  it('handles state-only (no local add-on)', () => {
    const r = calculateLodgingTax({ subtotal: 1000, stateRate: 0.085, localRate: 0 });
    expect(r.effectiveRate).toBeCloseTo(0.085, 4);
    expect(r.taxAmount).toBeCloseTo(85, 2);
  });

  it('handles local-only (e.g., Nevada has no state tax)', () => {
    const r = calculateLodgingTax({ subtotal: 1000, stateRate: 0, localRate: 0.135 });
    expect(r.effectiveRate).toBeCloseTo(0.135, 4);
    expect(r.taxAmount).toBeCloseTo(135, 2);
  });

  it('handles zero subtotal', () => {
    const r = calculateLodgingTax({ subtotal: 0, stateRate: 0.06, localRate: 0.04 });
    expect(r.taxAmount).toBe(0);
    expect(r.guestTotal).toBe(0);
  });
});
