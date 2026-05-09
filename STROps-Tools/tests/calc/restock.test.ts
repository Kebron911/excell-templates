import { describe, it, expect } from 'vitest';
import { computeRestock } from '@lib/calc/restock';

describe('restock', () => {
  it('multiplies booking_volume by per-stay rates', () => {
    const r = computeRestock({
      bookingsPerMonth: 10,
      avgGuestsPerStay: 3,
      items: [
        { name: 'Toilet paper rolls', perGuestNight: 0.5, avgNights: 4 },
        { name: 'Dish soap (oz)', perGuestNight: 1.0, avgNights: 4 },
      ],
    });
    // 10 stays × 3 guests × 4 nights × 0.5 = 60 rolls/mo
    expect(r.lines.find(l => l.name === 'Toilet paper rolls')!.qtyPerMonth).toBe(60);
    expect(r.lines.find(l => l.name === 'Dish soap (oz)')!.qtyPerMonth).toBe(120);
  });
  it('annual is 12x monthly', () => {
    const r = computeRestock({
      bookingsPerMonth: 5,
      avgGuestsPerStay: 2,
      items: [{ name: 'X', perGuestNight: 1, avgNights: 1 }],
    });
    expect(r.lines[0].qtyPerYear).toBe(r.lines[0].qtyPerMonth * 12);
  });
});
