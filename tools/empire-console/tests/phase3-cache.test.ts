import { describe, it, expect } from 'vitest';
import { MoneyCacheSchema } from '../src/lib/data/money.js';
import { TrafficCacheSchema } from '../src/lib/data/traffic.js';
import { SeoCacheSchema } from '../src/lib/data/seo.js';
import { ContactsCacheSchema } from '../src/lib/data/contacts.js';

describe('MoneyCacheSchema', () => {
  it('accepts an empty object (all defaults)', () => {
    const parsed = MoneyCacheSchema.parse({});
    expect(parsed.mtd.revenue).toBe(0);
    expect(parsed.channels).toEqual([]);
    expect(parsed.refundSpikes).toEqual([]);
  });

  it('accepts a populated payload', () => {
    const parsed = MoneyCacheSchema.parse({
      generatedAt: '2026-05-10T03:00:00Z',
      mtd: { revenue: 1234, orders: 12, refunds: 1, burn: 500 },
      channels: [
        { name: 'Etsy', amount: 800, share: 0.65, orders: 8, refunds: 0 },
      ],
      refundSpikes: [
        { sku: 'ACQ-001', refundCount24h: 4, refundRate24h: 0.12, triggerAt: '2026-05-10T01:00:00Z' },
      ],
    });
    expect(parsed.mtd.burn).toBe(500);
    expect(parsed.channels[0].name).toBe('Etsy');
    expect(parsed.refundSpikes[0].sku).toBe('ACQ-001');
  });

  it('rejects non-numeric revenue', () => {
    expect(() => MoneyCacheSchema.parse({ mtd: { revenue: 'lots' } })).toThrow();
  });
});

describe('TrafficCacheSchema', () => {
  it('accepts empty', () => {
    const parsed = TrafficCacheSchema.parse({});
    expect(parsed.bySite).toEqual([]);
    expect(parsed.anomalies).toEqual([]);
  });

  it('keeps deltaPct14d nullable', () => {
    const parsed = TrafficCacheSchema.parse({
      bySite: [{ id: 'thestrledger', name: 'thestrledger.com', sessions: 100, users: 80, deltaPct14d: null }],
    });
    expect(parsed.bySite[0].deltaPct14d).toBeNull();
  });
});

describe('SeoCacheSchema', () => {
  it('accepts empty', () => {
    const parsed = SeoCacheSchema.parse({});
    expect(parsed.gsc.impressions).toBe(0);
    expect(parsed.cwv.worstLcpMs).toBeNull();
    expect(parsed.topQueries).toEqual([]);
  });

  it('accepts striking-distance shape with optional page', () => {
    const parsed = SeoCacheSchema.parse({
      strikingDistance: [
        { query: 'str deal analyzer', position: 8.4, impressions: 220 },
        { query: 'airbnb roi spreadsheet', position: 12.1, impressions: 180, page: '/tools/roi' },
      ],
    });
    expect(parsed.strikingDistance).toHaveLength(2);
    expect(parsed.strikingDistance[1].page).toBe('/tools/roi');
  });
});

describe('ContactsCacheSchema', () => {
  it('accepts empty', () => {
    const parsed = ContactsCacheSchema.parse({});
    expect(parsed.list.total).toBe(0);
    expect(parsed.funnel).toEqual([]);
  });

  it('preserves funnel stage order', () => {
    const parsed = ContactsCacheSchema.parse({
      funnel: [
        { label: 'Visitor', count: 1000 },
        { label: 'Email opt-in', count: 120 },
        { label: 'Engaged', count: 60 },
        { label: 'Purchaser', count: 18 },
      ],
    });
    expect(parsed.funnel.map((s) => s.label)).toEqual(['Visitor', 'Email opt-in', 'Engaged', 'Purchaser']);
    expect(parsed.funnel[3].count).toBe(18);
  });

  it('clamps unknown health fields out', () => {
    const parsed = ContactsCacheSchema.parse({
      health: { bounceRate: 1.5, unsubRate: 0.2, complaintRate: 0.05, avgOpen: 32, avgClick: 4.5 },
    });
    expect(parsed.health.complaintRate).toBeCloseTo(0.05);
  });
});
