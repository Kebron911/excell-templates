/**
 * Linen par-level calculator.
 *
 * Convention from STR ops literature: hold N sets per bed (typical 3 — one
 * on the bed, one washed, one in the closet) and N sets per bath (~2.5
 * accounts for hand towels + bath towels). King/queen mix lets ops order
 * the right size ratio at restock time.
 */

export interface LinenInput {
  bedrooms: number;
  bathrooms: number;
  sheetSetsPerBed: number;
  towelsPerBath: number;
  /** 0..1 — share of beds that are king-size. */
  kingShare: number;
}

export interface LinenResult {
  sheetSets: number;
  towelSets: number;
  kingSheetSets: number;
  queenSheetSets: number;
}

export function computeLinenPar(i: LinenInput): LinenResult {
  const sheetSets = Math.round(Math.max(0, i.bedrooms) * Math.max(0, i.sheetSetsPerBed));
  const towelSets = Math.round(Math.max(0, i.bathrooms) * Math.max(0, i.towelsPerBath));
  const kingShare = Math.max(0, Math.min(1, i.kingShare));
  const kingSheetSets = Math.ceil(sheetSets * kingShare);
  const queenSheetSets = Math.max(0, sheetSets - kingSheetSets);
  return { sheetSets, towelSets, kingSheetSets, queenSheetSets };
}
