import { describe, it, expect } from 'vitest';
import { buildSchedulePdf } from '@/lib/pdf/maintenance-schedule';
import { buildSchedule } from '@/lib/calc/maintenance-schedule';
import type { TaskCatalog } from '@/lib/types';
import seed from '@/data/maintenance-tasks-seed.json';
import { PDFDocument } from 'pdf-lib';

const catalog = seed as unknown as TaskCatalog;

describe('maintenance-schedule PDF', () => {
  it('produces a valid PDF', async () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365,
      propertyTraits: { hasHvac: true, hasFireplace: true, climate: 'cold' },
      catalog,
    });
    const bytes = await buildSchedulePdf(r, '123 Pine St — 2026');
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');
    const parsed = await PDFDocument.load(bytes);
    expect(parsed.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(parsed.getTitle()).toBe('Maintenance Schedule');
  });

  it('produces multi-page output for long horizons', async () => {
    const r = buildSchedule({
      startDate: '2026-01-01',
      horizonDays: 365 * 3,
      propertyTraits: { hasHvac: true, hasFireplace: true, climate: 'cold' },
      catalog,
    });
    const bytes = await buildSchedulePdf(r, '123 Pine St — 3yr horizon');
    const parsed = await PDFDocument.load(bytes);
    expect(parsed.getPageCount()).toBeGreaterThan(1);
  });
});
