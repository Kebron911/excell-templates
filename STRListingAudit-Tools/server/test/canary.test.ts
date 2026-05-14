/**
 * Canary — proves vitest + tsx + the server tree are wired correctly.
 * Real test suites land in Phase 2 (scrape), Phase 3 (scorecard + cost-budget),
 * and Phase 4 (audit API + share-image generation).
 */

import { describe, it, expect } from 'vitest';
import { app } from '../index';

describe('server canary', () => {
  it('mounts /api/health', async () => {
    // Sanity check: the Express app object exists and has the route registered.
    // Full HTTP-level testing arrives in Phase 4 with supertest or fetch+fastify-test.
    const routes = (app._router?.stack ?? [])
      .filter((layer: any) => layer.route)
      .map((layer: any) => layer.route.path);
    expect(routes).toContain('/api/health');
  });
});
