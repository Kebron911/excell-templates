/**
 * Restock calculator — booking volume × per-stay consumable rates.
 *
 * Per-month qty = bookings_per_month × avg_guests_per_stay × avg_nights × per_guest_night_rate.
 * Per-year qty = per-month × 12. Round to whole units (you can't order half a roll).
 */

export interface RestockItem {
  name: string;
  /** Units consumed per guest per night. */
  perGuestNight: number;
  /** Avg nights per stay. Different per-property if needed; kept per-item to allow
   * weekly-only items (e.g., trash bags) to use a different "stay length" lens. */
  avgNights: number;
}

export interface RestockInput {
  bookingsPerMonth: number;
  avgGuestsPerStay: number;
  items: RestockItem[];
}

export interface RestockLine {
  name: string;
  qtyPerMonth: number;
  qtyPerYear: number;
}

export interface RestockResult {
  lines: RestockLine[];
}

export function computeRestock(i: RestockInput): RestockResult {
  const lines = i.items.map(it => {
    const monthly = Math.max(0, i.bookingsPerMonth) *
      Math.max(0, i.avgGuestsPerStay) *
      Math.max(0, it.avgNights) *
      Math.max(0, it.perGuestNight);
    const qtyPerMonth = Math.round(monthly);
    return { name: it.name, qtyPerMonth, qtyPerYear: qtyPerMonth * 12 };
  });
  return { lines };
}
