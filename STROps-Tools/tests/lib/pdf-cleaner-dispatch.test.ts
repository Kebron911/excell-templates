import { describe, it, expect } from 'vitest';
import { buildDispatchPdf } from '@lib/pdf/cleaner-dispatch';

describe('cleaner-dispatch pdf', () => {
  it('builds a valid PDF', async () => {
    const bytes = await buildDispatchPdf({
      date: '2026-06-05',
      assignments: [
        {
          turnover: { propertyId: 'p1', address: '123 Pine', bedrooms: 2 },
          cleaner: { name: 'Ana', phone: '555-0001' },
          sms: 'Hi Ana — turnover 2026-06-05 at 123 Pine.',
        },
      ],
    });
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');
    expect(bytes.byteLength).toBeGreaterThan(500);
  });
});
