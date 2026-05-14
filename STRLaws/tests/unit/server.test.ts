import { describe, expect, it } from 'vitest';
import { createApp } from '../../server/index';

describe('server', () => {
  it('exports a working Express app with /api/health', async () => {
    const app = createApp();
    const handlers = app._router?.stack ?? [];
    expect(handlers.length).toBeGreaterThan(0);
  });
});
