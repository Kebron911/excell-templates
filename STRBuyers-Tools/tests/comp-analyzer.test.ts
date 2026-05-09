import { describe, it, expect } from 'vitest';
import { analyzeComps } from '@/lib/calc/comp-analyzer';

describe('analyzeComps', () => {
  const baseRows = [
    { label: 'A', adr: 200, occupancy: 0.6 },
    { label: 'B', adr: 220, occupancy: 0.65 },
    { label: 'C', adr: 210, occupancy: 0.62 },
  ];

  it('computes mean ADR and occupancy', () => {
    const r = analyzeComps(baseRows);
    expect(r.avgAdr).toBeCloseTo(210, 1);
    expect(r.avgOcc).toBeCloseTo(0.623, 2);
  });

  it('derives RevPAR from ADR × occupancy', () => {
    const r = analyzeComps(baseRows);
    expect(r.listings[0].revPar).toBeCloseTo(120, 1);
    expect(r.avgRevpar).toBeCloseTo(131, 0);
  });

  it('flags 4th listing as outlier when ADR is 2x mean', () => {
    const r = analyzeComps([...baseRows, { label: 'D', adr: 500, occupancy: 0.6 }]);
    expect(r.outliers.adr).toContain(3);
  });

  it('flags occupancy outlier when row deviates >25% from mean', () => {
    const r = analyzeComps([
      { label: 'A', adr: 200, occupancy: 0.7 },
      { label: 'B', adr: 200, occupancy: 0.7 },
      { label: 'C', adr: 200, occupancy: 0.3 },
    ]);
    expect(r.outliers.occupancy).toContain(2);
  });

  it('does not flag rows within 25% deviation', () => {
    const r = analyzeComps(baseRows);
    expect(r.outliers.adr).toHaveLength(0);
    expect(r.outliers.occupancy).toHaveLength(0);
  });

  it('uses provided revPar override when present', () => {
    const r = analyzeComps([{ label: 'A', adr: 200, occupancy: 0.6, revPar: 150 }]);
    expect(r.listings[0].revPar).toBe(150);
  });
});
