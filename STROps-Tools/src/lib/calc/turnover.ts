/**
 * Turnover scheduler — pure logic.
 *
 * Computes per-property checkout→checkin gaps in hours, flags "tight" turns,
 * and reports overlapping bookings as conflicts. Per-property bookings are
 * sorted by check-in date to derive consecutive turnovers.
 *
 * Convention: standard STR check-out 11:00 UTC, check-in 15:00 UTC. The 4hr
 * implicit window is what makes same-day turnovers "0 gap" rather than "-4".
 */

export interface Booking {
  id: string;
  propertyId: string;
  /** ISO YYYY-MM-DD */
  checkIn: string;
  /** ISO YYYY-MM-DD */
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

export interface ScheduleOptions {
  /** Hours below which a turnover is flagged "tight". */
  turnoverHours: number;
}

export function computeSchedule(bookings: Booking[], opts: ScheduleOptions): ScheduleResult {
  const byProperty: Record<string, Booking[]> = {};
  for (const b of bookings) (byProperty[b.propertyId] ||= []).push(b);
  for (const k of Object.keys(byProperty)) {
    byProperty[k].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  }

  const turnovers: Turnover[] = [];
  const conflicts: Conflict[] = [];

  for (const [pid, list] of Object.entries(byProperty)) {
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      const b = list[i + 1];
      // Detect overlap independent of the 11:00/15:00 standard window —
      // overlap = next check-in strictly before previous check-out.
      if (b.checkIn < a.checkOut) {
        conflicts.push({ propertyId: pid, bookingA: a.id, bookingB: b.id });
        continue;
      }
      const aOut = Date.parse(a.checkOut + 'T11:00:00Z');
      const bIn = Date.parse(b.checkIn + 'T15:00:00Z');
      const gapHours = (bIn - aOut) / 3_600_000;
      turnovers.push({
        propertyId: pid,
        fromBooking: a.id,
        toBooking: b.id,
        gapHours: Math.max(0, Math.round(gapHours)),
        tight: gapHours < opts.turnoverHours,
      });
    }
  }
  return { turnovers, conflicts, byProperty };
}

export const hasConflict = (r: ScheduleResult): boolean => r.conflicts.length > 0;
