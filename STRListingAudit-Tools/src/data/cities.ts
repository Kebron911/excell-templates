/**
 * Programmatic SEO data file — 10 launch cities.
 *
 * Each entry drives `src/pages/audit/cities/[slug].astro`. The page is a
 * city-specific landing with the same `<AuditForm />` and a few city-tailored
 * conversion hooks (typical listing patterns, common complaints, etc).
 *
 * Cities chosen for v0.1 are the highest STR-volume US markets where Airbnb
 * search is the dominant booking channel. Add more by appending to this array.
 */

export interface CityEntry {
  slug: string;
  name: string;
  region: string;
  /** One-sentence positioning that doubles as h1 + meta description hook. */
  hook: string;
  /** What's most likely to score low here — used as the "watch out for" callout. */
  watchOut: string;
  /** Search-filter amenities especially relevant to this market. */
  marketAmenities: string[];
}

export const cities: CityEntry[] = [
  {
    slug: 'austin',
    name: 'Austin',
    region: 'Texas',
    hook: 'Audit your Austin Airbnb in 30 seconds — see why your listing isn\'t pulling SXSW or ACL traffic.',
    watchOut: 'Titles that don\'t namecheck Rainey, East Austin, or the lakes lose search clicks to listings that do.',
    marketAmenities: ['EV charger', 'Workspace', 'Pool', 'Pet-friendly'],
  },
  {
    slug: 'nashville',
    name: 'Nashville',
    region: 'Tennessee',
    hook: 'Audit your Nashville STR — see what you\'re losing to the saturated bachelorette market.',
    watchOut: 'Generic "downtown" titles disappear in search. Calling out The Gulch, East Nashville, or 5 Points moves you up.',
    marketAmenities: ['Hot tub', 'Game room', 'Walkable', 'Pet-friendly'],
  },
  {
    slug: 'denver',
    name: 'Denver',
    region: 'Colorado',
    hook: 'Audit your Denver Airbnb — find the friction killing your business-traveler and ski-pass bookings.',
    watchOut: 'Missing "ski storage" or "altitude tips" amenities loses you the November–April premium.',
    marketAmenities: ['Ski storage', 'Hot tub', 'EV charger', 'Workspace'],
  },
  {
    slug: 'asheville',
    name: 'Asheville',
    region: 'North Carolina',
    hook: 'Audit your Asheville cabin — find what\'s costing you the Blue Ridge Parkway crowd.',
    watchOut: 'Mountain-view listings without a "view from porch" photo and amenity rank below ones that have both.',
    marketAmenities: ['Hot tub', 'Fireplace', 'Mountain view', 'Pet-friendly'],
  },
  {
    slug: 'joshua-tree',
    name: 'Joshua Tree',
    region: 'California',
    hook: 'Audit your Joshua Tree desert getaway — find the design choices keeping you off the front page.',
    watchOut: 'Generic exterior cover photos lose to ones that show the famous "spa shot" or stargazing view.',
    marketAmenities: ['Hot tub', 'Pool', 'Stargazing', 'Pet-friendly'],
  },
  {
    slug: 'smoky-mountains',
    name: 'Gatlinburg & Pigeon Forge',
    region: 'Tennessee',
    hook: 'Audit your Smokies cabin — see what\'s costing you the multi-generation family-trip market.',
    watchOut: 'Cabins without a "sleeps X" call-out in the title lose to ones that lead with it.',
    marketAmenities: ['Hot tub', 'Game room', 'Pool table', 'Pet-friendly'],
  },
  {
    slug: 'outer-banks',
    name: 'Outer Banks',
    region: 'North Carolina',
    hook: 'Audit your OBX rental — find the photo and amenity gaps that lose you bookings to neighbors.',
    watchOut: 'Listings that don\'t name the specific beach town (Nags Head, Duck, Corolla, Avon) lose to ones that do.',
    marketAmenities: ['Beach access', 'Pool', 'Hot tub', 'Beach gear'],
  },
  {
    slug: 'sedona',
    name: 'Sedona',
    region: 'Arizona',
    hook: 'Audit your Sedona Airbnb — find what\'s costing you the wellness and stargazing crowd.',
    watchOut: 'Listings without "red rock view" or "stargazing patio" lose to ones that explicitly name them.',
    marketAmenities: ['Hot tub', 'Yoga space', 'Red rock view', 'Workspace'],
  },
  {
    slug: 'park-city',
    name: 'Park City',
    region: 'Utah',
    hook: 'Audit your Park City rental — find what\'s costing you the Sundance and ski-pass bookings.',
    watchOut: 'Missing ski-in/ski-out language or shuttle distance in the title kills the conversion premium.',
    marketAmenities: ['Hot tub', 'Ski storage', 'Heated driveway', 'EV charger'],
  },
  {
    slug: 'big-bear',
    name: 'Big Bear Lake',
    region: 'California',
    hook: 'Audit your Big Bear cabin — find the photo, amenity, and pricing patterns that win the LA-getaway crowd.',
    watchOut: 'Photos shot in summer for a winter-shoulder-season rental kill conversion. Update them or note both seasons.',
    marketAmenities: ['Hot tub', 'Fireplace', 'Lake view', 'Pet-friendly'],
  },
];

export const citiesBySlug: Record<string, CityEntry> = Object.fromEntries(
  cities.map((c) => [c.slug, c]),
);
