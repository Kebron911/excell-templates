import { describe, expect, it } from 'vitest';
import {
  haversineKm,
  pickNearestCities,
  type CityRow,
  type CityWithState,
} from '../../src/lib/city-data';

function city(
  id: number,
  name: string,
  state_slug: string,
  state_name: string,
  lat: number | null,
  lng: number | null,
): CityWithState {
  return {
    id,
    state_id: 1,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    population: null,
    str_market_rank: null,
    lat,
    lng,
    last_verified_at: null,
    status: 'active',
    state_slug,
    state_name,
  };
}

describe('haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineKm({ lat: 40, lng: -111 }, { lat: 40, lng: -111 })).toBe(0);
  });

  it('matches the known SLC ↔ Park City distance (~40km)', () => {
    const slc = { lat: 40.7608, lng: -111.891 };
    const parkCity = { lat: 40.6461, lng: -111.4979 };
    const d = haversineKm(slc, parkCity);
    expect(d).toBeGreaterThan(30);
    expect(d).toBeLessThan(50);
  });

  it('is symmetric', () => {
    const a = { lat: 35, lng: -120 };
    const b = { lat: 42, lng: -71 };
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 5);
  });
});

describe('pickNearestCities', () => {
  const anchor: CityRow = {
    id: 1,
    state_id: 1,
    slug: 'salt-lake-city',
    name: 'Salt Lake City',
    population: null,
    str_market_rank: null,
    lat: 40.7608,
    lng: -111.891,
    last_verified_at: null,
    status: 'active',
  };

  const candidates: CityWithState[] = [
    city(1, 'Salt Lake City', 'utah', 'Utah', 40.7608, -111.891), // self
    city(2, 'Park City', 'utah', 'Utah', 40.6461, -111.4979),
    city(3, 'Provo', 'utah', 'Utah', 40.2338, -111.6585),
    city(4, 'New York City', 'new-york', 'New York', 40.7128, -74.006),
    city(5, 'Los Angeles', 'california', 'California', 34.0522, -118.2437),
    city(6, 'Denver', 'colorado', 'Colorado', 39.7392, -104.9903),
    city(7, 'Missing GPS', 'wyoming', 'Wyoming', null, null),
  ];

  it('excludes the anchor city itself', () => {
    const result = pickNearestCities(anchor, candidates, 10);
    expect(result.find((r) => r.slug === 'salt-lake-city')).toBeUndefined();
  });

  it('orders by ascending distance', () => {
    const result = pickNearestCities(anchor, candidates, 5);
    const distances = result.map((r) => r.distance_km);
    const sorted = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sorted);
  });

  it('puts Park City and Provo at the top (Utah neighbors)', () => {
    const result = pickNearestCities(anchor, candidates, 2);
    const names = result.map((r) => r.name);
    expect(names).toContain('Park City');
    expect(names).toContain('Provo');
  });

  it('skips candidates with missing lat/lng', () => {
    const result = pickNearestCities(anchor, candidates, 10);
    expect(result.find((r) => r.name === 'Missing GPS')).toBeUndefined();
  });

  it('respects the limit', () => {
    expect(pickNearestCities(anchor, candidates, 3)).toHaveLength(3);
  });

  it('returns empty array if anchor has no coordinates', () => {
    const noCoords = { ...anchor, lat: null, lng: null };
    expect(pickNearestCities(noCoords, candidates, 5)).toEqual([]);
  });
});
