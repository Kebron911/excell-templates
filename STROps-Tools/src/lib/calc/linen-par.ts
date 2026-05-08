export interface LinenInput {
  bedrooms: number;
  bathrooms: number;
  sheetSetsPerBed: number;
  towelsPerBath: number;
  kingShare: number; // 0..1
}
export interface LinenResult {
  sheetSets: number;
  towelSets: number;
  kingSheetSets: number;
  queenSheetSets: number;
}
export function computeLinenPar(i: LinenInput): LinenResult {
  const sheetSets = Math.round(i.bedrooms * i.sheetSetsPerBed);
  const towelSets = Math.round(i.bathrooms * i.towelsPerBath);
  const kingSheetSets = Math.ceil(sheetSets * Math.max(0, Math.min(1, i.kingShare)));
  const queenSheetSets = sheetSets - kingSheetSets;
  return { sheetSets, towelSets, kingSheetSets, queenSheetSets };
}
