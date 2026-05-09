import { describe, it, expect } from 'vitest';
import { buildDispatch, smsTemplate } from '@lib/calc/cleaner-dispatch';

describe('cleaner-dispatch', () => {
  it('assigns cleaners round-robin', () => {
    const r = buildDispatch({
      date: '2026-06-05',
      turnovers: [
        { propertyId: 'p1', address: '123 Pine', bedrooms: 2 },
        { propertyId: 'p2', address: '456 Oak', bedrooms: 3 },
        { propertyId: 'p3', address: '789 Elm', bedrooms: 1 },
      ],
      cleaners: [
        { name: 'Ana', phone: '555-0001' },
        { name: 'Beto', phone: '555-0002' },
      ],
    });
    expect(r.assignments).toHaveLength(3);
    expect(r.assignments[0].cleaner.name).toBe('Ana');
    expect(r.assignments[1].cleaner.name).toBe('Beto');
    expect(r.assignments[2].cleaner.name).toBe('Ana');
  });
  it('SMS template fills variables', () => {
    const s = smsTemplate({
      cleanerName: 'Ana',
      address: '123 Pine',
      date: '2026-06-05',
      bedrooms: 2,
    });
    expect(s).toMatch(/Ana/);
    expect(s).toMatch(/123 Pine/);
    expect(s).toMatch(/2026-06-05/);
  });
  it('returns empty when no cleaners', () => {
    const r = buildDispatch({
      date: '2026-06-05',
      turnovers: [{ propertyId: 'p1', address: 'X', bedrooms: 1 }],
      cleaners: [],
    });
    expect(r.assignments).toHaveLength(0);
  });
});
