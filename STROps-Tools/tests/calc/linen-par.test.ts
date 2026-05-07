import { describe, it, expect } from 'vitest';
import { computeLinenPar } from '@/lib/calc/linen-par';

describe('linen-par', () => {
  it('3 sets per bed, 2.5 per bath default', () => {
    const r = computeLinenPar({
      bedrooms: 3,
      bathrooms: 2,
      sheetSetsPerBed: 3,
      towelsPerBath: 2.5,
      kingShare: 0.5,
    });
    expect(r.sheetSets).toBe(9);
    expect(r.towelSets).toBe(5);
    expect(r.kingSheetSets).toBe(5); // ceil(9 * 0.5)
    expect(r.queenSheetSets).toBe(4);
  });

  it('zero rooms returns zeros', () => {
    const r = computeLinenPar({
      bedrooms: 0,
      bathrooms: 0,
      sheetSetsPerBed: 3,
      towelsPerBath: 2.5,
      kingShare: 0,
    });
    expect(r.sheetSets).toBe(0);
    expect(r.towelSets).toBe(0);
    expect(r.kingSheetSets).toBe(0);
    expect(r.queenSheetSets).toBe(0);
  });

  it('clamps kingShare to [0, 1]', () => {
    const high = computeLinenPar({ bedrooms: 4, bathrooms: 0, sheetSetsPerBed: 3, towelsPerBath: 0, kingShare: 2 });
    expect(high.kingSheetSets).toBe(12);
    expect(high.queenSheetSets).toBe(0);

    const low = computeLinenPar({ bedrooms: 4, bathrooms: 0, sheetSetsPerBed: 3, towelsPerBath: 0, kingShare: -1 });
    expect(low.kingSheetSets).toBe(0);
    expect(low.queenSheetSets).toBe(12);
  });

  it('rounds non-integer products', () => {
    const r = computeLinenPar({
      bedrooms: 2,
      bathrooms: 3,
      sheetSetsPerBed: 2.5,
      towelsPerBath: 1.7,
      kingShare: 0,
    });
    expect(r.sheetSets).toBe(5); // round(2 * 2.5)
    expect(r.towelSets).toBe(5); // round(3 * 1.7 = 5.1)
  });
});
