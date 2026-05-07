/**
 * Furnishing Budget calculator — pure logic.
 *
 * Outputs a reasonable starting budget broken down by category for an STR.
 * Numbers come from operator surveys, IKEA + mid-market retailer baselines,
 * and the "Stage by Hand" turnkey package mid-tier benchmark.
 *
 * Tiers:
 *   - basic: budget-everywhere (IKEA, Wayfair sales, target)
 *   - mid:   mix of mid-market + a few statement pieces
 *   - luxury: design-forward, high-margin listings (Article, West Elm, custom)
 *
 * Bedrooms scale: 1, 2, 3, 4 (caps at 4 for the calculator; larger needs
 * a real designer).
 */

export type FurnishingTier = 'basic' | 'mid' | 'luxury';

export interface FurnishingInput {
  bedrooms: number;       // 1–4 (clamped)
  tier: FurnishingTier;
}

export interface FurnishingResult {
  tier: FurnishingTier;
  bedrooms: number;       // clamped 1–4
  byCategory: {
    livingRoom: number;
    bedrooms: number;     // total across all bedrooms
    kitchen: number;
    diningRoom: number;
    bathrooms: number;
    decorAndArt: number;
    contingency: number;
  };
  total: number;
}

export const FURNISHING_DEFAULTS: FurnishingInput = {
  bedrooms: 2,
  tier: 'mid',
};

/**
 * Per-room baselines by tier (in dollars). Values are starting points
 * tuned to 2025–26 retail. Bedrooms multiply by bedroom count.
 */
const TIER_BASELINES: Record<FurnishingTier, {
  livingRoom: number;
  perBedroom: number;
  kitchen: number;
  diningRoom: number;
  perBathroom: number;
  decorAndArtPerBedroom: number;
  contingencyPct: number;
}> = {
  basic: {
    livingRoom: 2_500,
    perBedroom: 1_800,
    kitchen: 1_200,
    diningRoom: 800,
    perBathroom: 350,
    decorAndArtPerBedroom: 350,
    contingencyPct: 0.10,
  },
  mid: {
    livingRoom: 5_000,
    perBedroom: 3_500,
    kitchen: 2_500,
    diningRoom: 1_800,
    perBathroom: 700,
    decorAndArtPerBedroom: 700,
    contingencyPct: 0.10,
  },
  luxury: {
    livingRoom: 12_000,
    perBedroom: 7_500,
    kitchen: 5_000,
    diningRoom: 4_000,
    perBathroom: 1_400,
    decorAndArtPerBedroom: 1_500,
    contingencyPct: 0.15,
  },
};

export function calculateFurnishing(i: FurnishingInput): FurnishingResult {
  const bedrooms = Math.max(1, Math.min(4, Math.round(i.bedrooms)));
  // Estimate bathrooms = bedrooms (approximation; calculator stays simple).
  const bathrooms = bedrooms;
  const t = TIER_BASELINES[i.tier];

  const livingRoom = t.livingRoom;
  const bedroomsTotal = t.perBedroom * bedrooms;
  const kitchen = t.kitchen;
  const diningRoom = t.diningRoom;
  const bathroomsTotal = t.perBathroom * bathrooms;
  const decorAndArt = t.decorAndArtPerBedroom * bedrooms;

  const subtotal = livingRoom + bedroomsTotal + kitchen + diningRoom + bathroomsTotal + decorAndArt;
  const contingency = subtotal * t.contingencyPct;

  return {
    tier: i.tier,
    bedrooms,
    byCategory: {
      livingRoom,
      bedrooms: bedroomsTotal,
      kitchen,
      diningRoom,
      bathrooms: bathroomsTotal,
      decorAndArt,
      contingency,
    },
    total: subtotal + contingency,
  };
}
