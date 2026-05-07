import { describe, it, expect } from 'vitest';
import { calculateMarketScore } from '@/lib/calc/market-score';

describe('calculateMarketScore', () => {
  it('returns score 0 + label avoid when banned', () => {
    const r = calculateMarketScore({
      medianADR: 400, occupancyPct: 0.8, regulationStatus: 'banned', saturationTier: 'low',
    });
    expect(r.score).toBe(0);
    expect(r.label).toBe('avoid');
    expect(r.notes.some((n) => /not allowed/i.test(n))).toBe(true);
  });

  it('strong market (high ADR, high occupancy, allowed, low saturation) hits 90+', () => {
    const r = calculateMarketScore({
      medianADR: 380, occupancyPct: 0.74, regulationStatus: 'allowed', saturationTier: 'low',
    });
    expect(r.score).toBeGreaterThanOrEqual(90);
    expect(r.label).toBe('strong');
  });

  it('marginal market in the 30–49 range', () => {
    const r = calculateMarketScore({
      medianADR: 140, occupancyPct: 0.45, regulationStatus: 'restrictive', saturationTier: 'high',
    });
    expect(r.score).toBeGreaterThanOrEqual(30);
    expect(r.score).toBeLessThan(50);
    expect(r.label).toBe('marginal');
  });

  it('clamps score to 0–100', () => {
    const r = calculateMarketScore({
      medianADR: 9999, occupancyPct: 9, regulationStatus: 'allowed', saturationTier: 'low',
    });
    expect(r.score).toBeLessThanOrEqual(100);
    const r2 = calculateMarketScore({
      medianADR: -100, occupancyPct: -1, regulationStatus: 'allowed', saturationTier: 'high',
    });
    expect(r2.score).toBeGreaterThanOrEqual(0);
  });

  it('flags high saturation in notes', () => {
    const r = calculateMarketScore({
      medianADR: 250, occupancyPct: 0.65, regulationStatus: 'allowed', saturationTier: 'high',
    });
    expect(r.notes.some((n) => /saturation/i.test(n))).toBe(true);
  });

  it('component weights sum correctly', () => {
    const r = calculateMarketScore({
      medianADR: 240, occupancyPct: 0.6, regulationStatus: 'allowed', saturationTier: 'medium',
    });
    const sum = r.components.adr + r.components.occupancy + r.components.regulation + r.components.saturation;
    expect(Math.round(sum)).toBe(r.score);
  });
});
