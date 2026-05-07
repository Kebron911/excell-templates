import { describe, it, expect } from 'vitest';
import { calculateFurnishing } from '@/lib/calc/furnishing-budget';

describe('calculateFurnishing', () => {
  it('produces a 2br mid-tier baseline', () => {
    const r = calculateFurnishing({ bedrooms: 2, tier: 'mid' });
    expect(r.bedrooms).toBe(2);
    // mid: living 5000 + bedrooms 2*3500=7000 + kitchen 2500 + dining 1800 + baths 2*700=1400 + decor 2*700=1400 = 19,100 + 10% contingency = 21,010
    expect(r.byCategory.livingRoom).toBe(5_000);
    expect(r.byCategory.bedrooms).toBe(7_000);
    expect(r.total).toBeCloseTo(21_010, 0);
  });

  it('clamps bedrooms to [1,4]', () => {
    const r1 = calculateFurnishing({ bedrooms: 0, tier: 'basic' });
    expect(r1.bedrooms).toBe(1);
    const r2 = calculateFurnishing({ bedrooms: 99, tier: 'mid' });
    expect(r2.bedrooms).toBe(4);
  });

  it('luxury > mid > basic for the same bedroom count', () => {
    const basic = calculateFurnishing({ bedrooms: 3, tier: 'basic' });
    const mid = calculateFurnishing({ bedrooms: 3, tier: 'mid' });
    const lux = calculateFurnishing({ bedrooms: 3, tier: 'luxury' });
    expect(mid.total).toBeGreaterThan(basic.total);
    expect(lux.total).toBeGreaterThan(mid.total);
  });

  it('contingency is a percentage of subtotal', () => {
    const r = calculateFurnishing({ bedrooms: 2, tier: 'basic' });
    const subtotal =
      r.byCategory.livingRoom +
      r.byCategory.bedrooms +
      r.byCategory.kitchen +
      r.byCategory.diningRoom +
      r.byCategory.bathrooms +
      r.byCategory.decorAndArt;
    expect(r.byCategory.contingency).toBeCloseTo(subtotal * 0.10, 4);
  });

  it('integer rounding on bedrooms input', () => {
    const r = calculateFurnishing({ bedrooms: 2.6, tier: 'mid' });
    expect(r.bedrooms).toBe(3);
  });
});
