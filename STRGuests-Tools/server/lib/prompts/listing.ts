/**
 * Listing-description generator prompts (gpt-4o-mini).
 *
 * The system prompt is the safety + style harness. The user-prompt builder takes structured
 * form input and renders a deterministic instruction block — no free-form prompt injection from
 * the visitor, and the model receives clear section headings to reduce drift.
 */

export const LISTING_SYSTEM = `You are an Airbnb listing copywriter for short-term rental hosts.
Write listing descriptions that are honest, vivid, and conversion-focused.
RULES:
- NEVER invent amenities the host has not provided.
- NEVER make medical, safety, or legal claims.
- NEVER promise discounts, refunds, or guarantees.
- Output ONLY the four sections requested. No preamble. No closing line.
- Each section uses a single blank line as separator.
- The Headline is one sentence, ≤ 60 characters.`;

export type ListingVibe = 'luxury' | 'family' | 'quirky' | 'professional' | 'hospitable';

export interface ListingInput {
  propertyType: string;   // "2BR cabin"
  location: string;       // "Asheville, NC"
  amenities: string[];    // ["hot tub", "fire pit", ...]
  vibe: ListingVibe;
  uniqueFeatures?: string;
}

export function validateListingInput(raw: unknown): ListingInput | { error: string } {
  if (typeof raw !== 'object' || raw === null) return { error: 'body must be an object' };
  const r = raw as Record<string, unknown>;

  const propertyType = typeof r.propertyType === 'string' ? r.propertyType.trim() : '';
  if (!propertyType || propertyType.length > 80) return { error: 'propertyType: 1–80 chars' };

  const location = typeof r.location === 'string' ? r.location.trim() : '';
  if (!location || location.length > 80) return { error: 'location: 1–80 chars' };

  const amenitiesRaw = Array.isArray(r.amenities) ? r.amenities : [];
  if (amenitiesRaw.length > 40) return { error: 'amenities: max 40 items' };
  const amenities: string[] = [];
  for (const a of amenitiesRaw) {
    if (typeof a !== 'string') return { error: 'amenities must be strings' };
    const t = a.trim();
    if (!t) continue;
    if (t.length > 80) return { error: 'each amenity: ≤80 chars' };
    amenities.push(t);
  }

  const validVibes: ListingVibe[] = ['luxury', 'family', 'quirky', 'professional', 'hospitable'];
  const vibe = typeof r.vibe === 'string' && (validVibes as string[]).includes(r.vibe) ? (r.vibe as ListingVibe) : null;
  if (!vibe) return { error: `vibe must be one of: ${validVibes.join(', ')}` };

  let uniqueFeatures: string | undefined;
  if (r.uniqueFeatures != null) {
    if (typeof r.uniqueFeatures !== 'string') return { error: 'uniqueFeatures must be a string' };
    const t = r.uniqueFeatures.trim();
    if (t.length > 500) return { error: 'uniqueFeatures: ≤500 chars' };
    if (t) uniqueFeatures = t;
  }

  return { propertyType, location, amenities, vibe, uniqueFeatures };
}

export function buildListingPrompt(input: ListingInput): string {
  const amenitiesLine = input.amenities.length
    ? input.amenities.join(', ')
    : '(none listed — describe the space without inventing amenities)';
  return [
    `Write an Airbnb listing description for:`,
    `Property: ${input.propertyType} in ${input.location}`,
    `Amenities: ${amenitiesLine}`,
    `Vibe: ${input.vibe}`,
    input.uniqueFeatures ? `Unique features: ${input.uniqueFeatures}` : '',
    ``,
    `Output sections (in order, separated by single blank lines):`,
    `1. Headline (one sentence, < 60 chars)`,
    `2. The Space (3–4 paragraphs)`,
    `3. Guest Access`,
    `4. Other Things to Note`,
  ].filter(Boolean).join('\n');
}
