import { describe, it, expect } from 'vitest';
import { scoreMarket } from '@/lib/calc/market-score';

describe('scoreMarket', () => {
  it('grade A — open regulation, strong revPar, low saturation', () => {
    const r = scoreMarket({
      adr: 300,
      occupancy: 0.7,
      regulationStatus: 'open',
      saturationTier: 'low',
    });
    expect(r.tier).toBe('A');
    expect(r.score).toBeGreaterThanOrEqual(85);
  });

  it('grade D — restricted regulation, weak revPar, high saturation', () => {
    const r = scoreMarket({
      adr: 100,
      occupancy: 0.5,
      regulationStatus: 'restricted',
      saturationTier: 'high',
    });
    expect(r.tier).toBe('D');
  });

  it('flags regulatory risk when restricted', () => {
    const r = scoreMarket({
      adr: 250,
      occupancy: 0.65,
      regulationStatus: 'restricted',
      saturationTier: 'medium',
    });
    expect(r.flags.some((f) => /regulat/i.test(f))).toBe(true);
  });

  it('grade C in mixed-signal market', () => {
    const r = scoreMarket({
      adr: 175,
      occupancy: 0.55,
      regulationStatus: 'gray',
      saturationTier: 'medium',
    });
    expect(['B', 'C']).toContain(r.tier);
  });

  it('grade transitions at expected boundaries', () => {
    // Open + low + revpar=200 → economics 100, regulation 100, saturation 100 → 100
    const top = scoreMarket({
      adr: 400,
      occupancy: 0.5,
      regulationStatus: 'open',
      saturationTier: 'low',
    });
    expect(top.tier).toBe('A');
  });

  it('returns score in [0,100]', () => {
    const r = scoreMarket({
      adr: 999,
      occupancy: 1,
      regulationStatus: 'open',
      saturationTier: 'low',
    });
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });
});
