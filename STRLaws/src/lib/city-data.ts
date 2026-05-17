import { query, queryOne } from './db';

export interface StateRow {
  id: number;
  slug: string;
  name: string;
  has_state_law: number;
  summary_md: string | null;
  last_verified_at: string | null;
}

export interface CityRow {
  id: number;
  state_id: number;
  slug: string;
  name: string;
  population: number | null;
  str_market_rank: number | null;
  lat: number | null;
  lng: number | null;
  last_verified_at: string | null;
  status: 'active' | 'skeleton' | 'archived';
}

export interface RegulationRow {
  id: number;
  city_id: number;
  snapshot_id: number | null;
  effective_date: string | null;
  permit_required: number | null;
  permit_cost_usd: number | null;
  permit_url: string | null;
  occupancy_cap_persons: number | null;
  tax_rate_pct: number | null;
  tax_authority: string | null;
  ban_status: 'none' | 'partial' | 'full' | 'moratorium' | null;
  ban_details_md: string | null;
  registration_required: number | null;
  registration_url: string | null;
  primary_residence_only: number | null;
  max_nights_per_year: number | null;
  zoning_notes_md: string | null;
  enforcement_notes_md: string | null;
}

export async function getAllStates(): Promise<StateRow[]> {
  return query<StateRow>('SELECT * FROM states ORDER BY name ASC');
}

export async function getStateBySlug(slug: string): Promise<StateRow | null> {
  return queryOne<StateRow>('SELECT * FROM states WHERE slug = ? LIMIT 1', [slug]);
}

export async function getCitiesByState(stateId: number): Promise<CityRow[]> {
  return query<CityRow>(
    "SELECT * FROM cities WHERE state_id = ? AND status != 'archived' ORDER BY str_market_rank IS NULL, str_market_rank ASC, name ASC",
    [stateId],
  );
}

export async function getCityBySlug(stateSlug: string, citySlug: string): Promise<CityRow | null> {
  return queryOne<CityRow>(
    `SELECT c.* FROM cities c
     INNER JOIN states s ON s.id = c.state_id
     WHERE s.slug = ? AND c.slug = ? AND c.status != 'archived'
     LIMIT 1`,
    [stateSlug, citySlug],
  );
}

export async function getLatestRegulation(cityId: number): Promise<RegulationRow | null> {
  return queryOne<RegulationRow>(
    'SELECT * FROM regulations WHERE city_id = ? ORDER BY id DESC LIMIT 1',
    [cityId],
  );
}

export async function getAllActiveCitiesWithState(): Promise<Array<CityRow & { state_slug: string; state_name: string }>> {
  return query<CityRow & { state_slug: string; state_name: string }>(
    `SELECT c.*, s.slug AS state_slug, s.name AS state_name
     FROM cities c
     INNER JOIN states s ON s.id = c.state_id
     WHERE c.status = 'active'
     ORDER BY s.name ASC, c.str_market_rank IS NULL, c.str_market_rank ASC, c.name ASC`,
  );
}

export interface CityWithState extends CityRow {
  state_slug: string;
  state_name: string;
}

export interface NeighborCity {
  slug: string;
  name: string;
  state_slug: string;
  state_name: string;
  distance_km: number;
}

/**
 * Haversine distance in kilometers between two lat/lng points.
 * Exported for unit testing.
 */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Return the N geographically-nearest active cities to the given anchor.
 * Cities without lat/lng are skipped. The anchor itself is excluded.
 */
export function pickNearestCities(
  anchor: CityRow,
  candidates: CityWithState[],
  limit: number,
): NeighborCity[] {
  if (anchor.lat == null || anchor.lng == null) return [];
  const a = { lat: Number(anchor.lat), lng: Number(anchor.lng) };
  return candidates
    .filter((c) => c.id !== anchor.id && c.lat != null && c.lng != null)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      state_slug: c.state_slug,
      state_name: c.state_name,
      distance_km: haversineKm(a, { lat: Number(c.lat), lng: Number(c.lng) }),
    }))
    .sort((x, y) => x.distance_km - y.distance_km)
    .slice(0, limit);
}

export async function getNearestCities(city: CityRow, limit = 5): Promise<NeighborCity[]> {
  const all = await getAllActiveCitiesWithState();
  return pickNearestCities(city, all, limit);
}
