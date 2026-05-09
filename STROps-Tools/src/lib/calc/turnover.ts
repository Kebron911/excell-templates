export interface Booking {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
}
export interface Turnover {
  propertyId: string;
  fromBooking: string;
  toBooking: string;
  gapHours: number;
  tight: boolean;
}
export interface Conflict {
  propertyId: string;
  bookingA: string;
  bookingB: string;
}
export interface ScheduleResult {
  turnovers: Turnover[];
  conflicts: Conflict[];
  byProperty: Record<string, Booking[]>;
}

export function computeSchedule(
  bookings: Booking[],
  opts: { turnoverHours: number },
): ScheduleResult {
  const byProperty: Record<string, Booking[]> = {};
  for (const b of bookings) (byProperty[b.propertyId] ||= []).push(b);
  for (const k of Object.keys(byProperty))
    byProperty[k].sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  const turnovers: Turnover[] = [];
  const conflicts: Conflict[] = [];
  for (const [pid, list] of Object.entries(byProperty)) {
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      const b = list[i + 1];
      const aOut = Date.parse(a.checkOut + 'T11:00:00Z');
      const bIn = Date.parse(b.checkIn + 'T15:00:00Z');
      const gapHours = (bIn - aOut) / 3_600_000;
      if (gapHours < 0) {
        conflicts.push({ propertyId: pid, bookingA: a.id, bookingB: b.id });
      } else {
        turnovers.push({
          propertyId: pid,
          fromBooking: a.id,
          toBooking: b.id,
          gapHours: Math.max(0, Math.round(gapHours)),
          tight: gapHours < opts.turnoverHours,
        });
      }
    }
  }
  return { turnovers, conflicts, byProperty };
}

export const hasConflict = (r: ScheduleResult) => r.conflicts.length > 0;
