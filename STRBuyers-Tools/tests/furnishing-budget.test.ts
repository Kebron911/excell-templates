import { describe, it, expect } from 'vitest';
import { calculateFurnishingBudget } from '@/lib/calc/furnishing-budget';

describe('calculateFurnishingBudget', () => {
  it('3 bed / 2 bath / mid tier @ 1500 sqft has positive budget across all rooms', () => {
    const r = calculateFurnishingBudget({ bedrooms: 3, bathrooms: 2, tier: 'mid', squareFootage: 1500 });
    expect(r.total).toBeGreaterThan(0);
    expect(r.breakdown.bedrooms).toBeGreaterThan(0);
    expect(r.breakdown.bathrooms).toBeGreaterThan(0);
    expect(r.breakdown.livingRoom).toBeGreaterThan(0);
    expect(r.breakdown.kitchen).toBeGreaterThan(0);
    expect(r.breakdown.decor).toBeGreaterThan(0);
  });

  it('luxury tier costs more than mid which costs more than budget', () => {
    const args = { bedrooms: 3, bathrooms: 2, squareFootage: 1500 };
    const budget = calculateFurnishingBudget({ ...args, tier: 'budget' });
    const mid = calculateFurnishingBudget({ ...args, tier: 'mid' });
    const luxury = calculateFurnishingBudget({ ...args, tier: 'luxury' });
    expect(mid.total).toBeGreaterThan(budget.total);
    expect(luxury.total).toBeGreaterThan(mid.total);
  });

  it('per-sqft rate scales with tier', () => {
    const args = { bedrooms: 3, bathrooms: 2, squareFootage: 1500 };
    const budget = calculateFurnishingBudget({ ...args, tier: 'budget' });
    const luxury = calculateFurnishingBudget({ ...args, tier: 'luxury' });
    expect(luxury.perSqFt).toBeGreaterThan(budget.perSqFt);
  });

  it('breakdown sums to total', () => {
    const r = calculateFurnishingBudget({ bedrooms: 3, bathrooms: 2, tier: 'mid', squareFootage: 1500 });
    const summed =
      r.breakdown.bedrooms +
      r.breakdown.bathrooms +
      r.breakdown.livingRoom +
      r.breakdown.kitchen +
      r.breakdown.decor;
    expect(summed).toBeCloseTo(r.total, 2);
  });

  it('handles 0 sqft (returns 0 perSqFt)', () => {
    const r = calculateFurnishingBudget({ bedrooms: 2, bathrooms: 1, tier: 'mid', squareFootage: 0 });
    expect(r.perSqFt).toBe(0);
  });

  it('more bedrooms cost more', () => {
    const r2 = calculateFurnishingBudget({ bedrooms: 2, bathrooms: 2, tier: 'mid', squareFootage: 1500 });
    const r4 = calculateFurnishingBudget({ bedrooms: 4, bathrooms: 2, tier: 'mid', squareFootage: 1500 });
    expect(r4.breakdown.bedrooms).toBeGreaterThan(r2.breakdown.bedrooms);
  });
});
