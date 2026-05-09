import { describe, it, expect } from 'vitest';
import { buildSchedulePdf } from '@lib/pdf/maintenance-schedule';

describe('maintenance-schedule pdf', () => {
  it('builds a valid PDF', async () => {
    const bytes = await buildSchedulePdf(
      {
        events: [
          { taskSlug: 'hvac', name: 'Replace HVAC filter', date: '2026-03-01', cadenceDays: 60 },
          { taskSlug: 'smoke', name: 'Test smoke detectors', date: '2026-04-01', cadenceDays: 90 },
        ],
      },
      'Property: Maple Cottage',
    );
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');
    expect(bytes.byteLength).toBeGreaterThan(500);
  });
});
