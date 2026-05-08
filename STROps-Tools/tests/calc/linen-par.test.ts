import { describe, it, expect } from 'vitest';
import { computeLinenPar } from '@lib/calc/linen-par';

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
  });
});
