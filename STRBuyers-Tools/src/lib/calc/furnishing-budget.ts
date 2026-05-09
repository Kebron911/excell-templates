/**
 * Furnishing budget — three-tier estimate for outfitting an STR.
 *
 * Per-room costs scale with tier:
 *   budget  — Wayfair / Amazon-tier flat-pack
 *   mid     — Article / West Elm + a stager
 *   luxury  — Stage by Hand / Minoan trade designer-curated
 *
 * Decor & accents adds 15% on top of the room subtotal.
 */

export type Tier = 'budget' | 'mid' | 'luxury';

export interface FurnishingInputs {
  bedrooms: number;
  bathrooms: number;
  tier: Tier;
  squareFootage: number;
}

export interface FurnishingResult {
  total: number;
  perSqFt: number;
  breakdown: {
    livingRoom: number;
    bedrooms: number;
    kitchen: number;
    bathrooms: number;
    decor: number;
  };
}

const PER_BEDROOM: Record<Tier, number> = { budget: 1500, mid: 3000, luxury: 6000 };
const PER_BATHROOM: Record<Tier, number> = { budget: 300, mid: 600, luxury: 1200 };
const LIVING_ROOM: Record<Tier, number> = { budget: 2500, mid: 5000, luxury: 10000 };
const KITCHEN: Record<Tier, number> = { budget: 1500, mid: 3000, luxury: 6000 };
const DECOR_PCT = 0.15;

export function calculateFurnishingBudget(i: FurnishingInputs): FurnishingResult {
  const bedrooms = i.bedrooms * PER_BEDROOM[i.tier];
  const bathrooms = i.bathrooms * PER_BATHROOM[i.tier];
  const livingRoom = LIVING_ROOM[i.tier];
  const kitchen = KITCHEN[i.tier];
  const subtotal = bedrooms + bathrooms + livingRoom + kitchen;
  const decor = subtotal * DECOR_PCT;
  const total = subtotal + decor;
  const perSqFt = i.squareFootage > 0 ? total / i.squareFootage : 0;
  return {
    total,
    perSqFt,
    breakdown: { livingRoom, bedrooms, kitchen, bathrooms, decor },
  };
}
