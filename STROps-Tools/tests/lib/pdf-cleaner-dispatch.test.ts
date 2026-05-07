import { describe, it, expect } from 'vitest';
import { buildDispatchPdf } from '@/lib/pdf/cleaner-dispatch';
import { PDFDocument } from 'pdf-lib';

describe('cleaner-dispatch PDF', () => {
  it('produces a valid PDF buffer', async () => {
    const bytes = await buildDispatchPdf({
      date: '2026-06-05',
      assignments: [
        {
          turnover: { propertyId: 'p1', address: '123 Pine St', bedrooms: 2 },
          cleaner: { name: 'Ana', phone: '555-0001' },
          sms: 'Hi Ana — turnover 2026-06-05 at 123 Pine St (2BR). Standard SOP. Reply Y to confirm.',
        },
      ],
    });
    // Magic bytes
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');
    // Round-trips through pdf-lib
    const parsed = await PDFDocument.load(bytes);
    expect(parsed.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(parsed.getTitle()).toBe('Cleaner Dispatch Sheet');
  });

  it('produces multi-page output for many assignments', async () => {
    const assignments = Array.from({ length: 60 }, (_, i) => ({
      turnover: { propertyId: `p${i}`, address: `${i} Pine St`, bedrooms: 2 },
      cleaner: { name: 'Ana', phone: '555-0001' },
      sms: `Hi Ana — turnover 2026-06-05 at ${i} Pine St (2BR). Standard SOP. Reply Y to confirm.`,
    }));
    const bytes = await buildDispatchPdf({ date: '2026-06-05', assignments });
    const parsed = await PDFDocument.load(bytes);
    expect(parsed.getPageCount()).toBeGreaterThan(1);
  });

  it('handles zero assignments without throwing', async () => {
    const bytes = await buildDispatchPdf({ date: '2026-06-05', assignments: [] });
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');
  });
});
