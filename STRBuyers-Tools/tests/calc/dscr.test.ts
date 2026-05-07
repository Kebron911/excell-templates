import { describe, it, expect } from 'vitest';
import { calculateDscr } from '@/lib/calc/dscr';

describe('calculateDscr', () => {
  it('computes ratio = rent / pitia', () => {
    const r = calculateDscr({ monthlyRent: 5000, monthlyPitia: 4000 });
    expect(r.ratio).toBeCloseTo(1.25, 4);
  });

  it('labels ≥1.25 as strong', () => {
    const r = calculateDscr({ monthlyRent: 5000, monthlyPitia: 4000 });
    expect(r.tier).toBe('strong');
  });

  it('labels 1.00–1.24 as qualifying', () => {
    const r = calculateDscr({ monthlyRent: 5000, monthlyPitia: 4500 });
    expect(r.tier).toBe('qualifying');
    expect(r.ratio).toBeGreaterThan(1.0);
    expect(r.ratio).toBeLessThan(1.25);
  });

  it('labels <1.00 as short', () => {
    const r = calculateDscr({ monthlyRent: 4000, monthlyPitia: 5000 });
    expect(r.tier).toBe('short');
  });

  it('handles zero pitia gracefully (ratio 0)', () => {
    const r = calculateDscr({ monthlyRent: 5000, monthlyPitia: 0 });
    expect(r.ratio).toBe(0);
    expect(r.tier).toBe('short');
  });

  it('boundary at exactly 1.0 is qualifying not short', () => {
    const r = calculateDscr({ monthlyRent: 4000, monthlyPitia: 4000 });
    expect(r.ratio).toBe(1);
    expect(r.tier).toBe('qualifying');
  });

  it('boundary at exactly 1.25 is strong', () => {
    const r = calculateDscr({ monthlyRent: 5000, monthlyPitia: 4000 });
    expect(r.tier).toBe('strong');
  });
});
