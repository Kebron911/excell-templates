/**
 * Cleaning fee calculator — pure logic.
 *
 *   laborCost              = hours * hourlyRate
 *   recommendedCleaningFee = laborCost + suppliesCost + laundryCost + buffer
 *   perNightCost           = recommendedCleaningFee / avgNightsPerStay (0 if 0)
 *   pctOfNightly           = recommendedCleaningFee / nightlyRate      (0 if 0)
 */

export interface CleaningFeeInput {
  hours: number;
  hourlyRate: number;
  suppliesCost: number;
  laundryCost: number;
  buffer: number;
  avgNightsPerStay: number;
  nightlyRate: number;
}

export interface CleaningFeeResult {
  laborCost: number;
  recommendedCleaningFee: number;
  perNightCost: number;
  pctOfNightly: number;
}

export const CLEANING_FEE_DEFAULTS: CleaningFeeInput = {
  hours: 4,
  hourlyRate: 25,
  suppliesCost: 10,
  laundryCost: 15,
  buffer: 10,
  avgNightsPerStay: 3,
  nightlyRate: 200,
};

export function calculateCleaningFee(i: CleaningFeeInput): CleaningFeeResult {
  const laborCost = i.hours * i.hourlyRate;
  const recommendedCleaningFee = laborCost + i.suppliesCost + i.laundryCost + i.buffer;
  const perNightCost = i.avgNightsPerStay > 0 ? recommendedCleaningFee / i.avgNightsPerStay : 0;
  const pctOfNightly = i.nightlyRate > 0 ? recommendedCleaningFee / i.nightlyRate : 0;
  return { laborCost, recommendedCleaningFee, perNightCost, pctOfNightly };
}
