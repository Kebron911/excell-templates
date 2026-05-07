import { describe, it, expect } from 'vitest';
import { computeRestock } from '@/lib/calc/restock';

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
    // 10 × 3 × 4 × 0.5 = 60 rolls/mo
    expect(r.lines.find(l => l.name === 'Toilet paper rolls')!.qtyPerMonth).toBe(60);
    expect(r.lines.find(l => l.name === 'Dish soap (oz)')!.qtyPerMonth).toBe(120);
  });

  it('per-year qty = per-month × 12', () => {
    const r = computeRestock({
      bookingsPerMonth: 5,
      avgGuestsPerStay: 2,
      items: [{ name: 'Coffee pods', perGuestNight: 1, avgNights: 3 }],
    });
    expect(r.lines[0].qtyPerMonth).toBe(30);
    expect(r.lines[0].qtyPerYear).toBe(360);
  });

  it('zero bookings returns zero qtys', () => {
    const r = computeRestock({
      bookingsPerMonth: 0,
      avgGuestsPerStay: 2,
      items: [{ name: 'Trash bags', perGuestNight: 0.25, avgNights: 4 }],
    });
    expect(r.lines[0].qtyPerMonth).toBe(0);
    expect(r.lines[0].qtyPerYear).toBe(0);
  });

  it('rounds non-integer products', () => {
    const r = computeRestock({
      bookingsPerMonth: 3,
      avgGuestsPerStay: 2,
      items: [{ name: 'Item', perGuestNight: 0.33, avgNights: 3 }],
    });
    // 3 × 2 × 3 × 0.33 = 5.94 → 6
    expect(r.lines[0].qtyPerMonth).toBe(6);
  });
});
