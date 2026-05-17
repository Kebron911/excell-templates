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

export interface RegulationChangeRow {
  id: number;
  city_id: number;
  prev_regulation_id: number | null;
  next_regulation_id: number;
  severity: 'minor' | 'material' | 'major';
  diff_json: string | object;
  summary_md: string | null;
  blog_post_slug: string | null;
  published_at: string | null;
  alerts_dispatched_at: string | null;
  created_at: string;
}

export interface RegulationChangeWithCity extends RegulationChangeRow {
  city_slug: string;
  city_name: string;
  state_slug: string;
  state_name: string;
}

/**
 * Recent regulation_changes across all cities, newest first. Used by the
 * blog index, the homepage recent-changes feed, and the alert-dispatcher
 * post-publish lookup.
 * Returns empty array when the database is unreachable (build-time fallback
 * so the site still builds before Phase 3 wires up MySQL).
 */
export async function getRecentChanges(limit = 25): Promise<RegulationChangeWithCity[]> {
  try {
    return await query<RegulationChangeWithCity>(
      `SELECT rc.*, c.slug AS city_slug, c.name AS city_name,
              s.slug AS state_slug, s.name AS state_name
       FROM regulation_changes rc
       INNER JOIN cities c ON c.id = rc.city_id
       INNER JOIN states s ON s.id = c.state_id
       WHERE rc.published_at IS NOT NULL
       ORDER BY rc.published_at DESC, rc.id DESC
       LIMIT ?`,
      [limit],
    );
  } catch {
    return [];
  }
}

export async function getChangeBySlug(slug: string): Promise<RegulationChangeWithCity | null> {
  try {
    return await queryOne<RegulationChangeWithCity>(
      `SELECT rc.*, c.slug AS city_slug, c.name AS city_name,
              s.slug AS state_slug, s.name AS state_name
       FROM regulation_changes rc
       INNER JOIN cities c ON c.id = rc.city_id
       INNER JOIN states s ON s.id = c.state_id
       WHERE rc.blog_post_slug = ?
       LIMIT 1`,
      [slug],
    );
  } catch {
    return null;
  }
}

/**
 * Full change history for a single city, newest first. The /history page
 * gates entries older than 12 months to premium (handled at render time,
 * not in this query — premium subscribers see everything).
 */
export async function getCityHistory(cityId: number): Promise<RegulationChangeRow[]> {
  try {
    return await query<RegulationChangeRow>(
      `SELECT * FROM regulation_changes
       WHERE city_id = ?
       ORDER BY created_at DESC, id DESC`,
      [cityId],
    );
  } catch {
    return [];
  }
}
