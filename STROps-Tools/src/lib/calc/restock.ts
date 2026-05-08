export interface RestockItem {
  name: string;
  perGuestNight: number;
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
    const qtyPerMonth = Math.round(
      i.bookingsPerMonth * i.avgGuestsPerStay * it.avgNights * it.perGuestNight,
    );
    return { name: it.name, qtyPerMonth, qtyPerYear: qtyPerMonth * 12 };
  });
  return { lines };
}
