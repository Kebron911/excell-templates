/**
 * TurnoverScheduler — hydrated island. URL state via Phase 1 url-state lib.
 *
 * Inputs are textarea-CSV: one booking per line as
 *   propertyId,bookingId,checkIn,checkOut
 * which keeps the UX paste-friendly for hosts pulling rows out of their PMS.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { computeSchedule, type Booking } from '@/lib/calc/turnover';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { trackEvent } from '@/lib/analytics';

type State = { turnoverHours: number; rows: string };

const defaults: State = {
  turnoverHours: 4,
  rows: 'p1,b1,2026-06-01,2026-06-05\np1,b2,2026-06-05,2026-06-08\np1,b3,2026-06-09,2026-06-12',
};

function parseRows(rows: string): Booking[] {
  return rows
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [propertyId, id, checkIn, checkOut] = r.split(',').map(s => s.trim());
      return { propertyId, id, checkIn, checkOut };
    })
    .filter(b => b.id && b.propertyId && b.checkIn && b.checkOut);
}

export default function TurnoverScheduler() {
  const [state, setState] = useState<State>(defaults);
  const replacer = useMemo(() => createDebouncedReplaceState(200), []);
  const fired = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setState(parse(window.location.search, defaults));
    if (!fired.current) {
      fired.current = true;
      trackEvent('tool_used', { tool: 'turnover-scheduler' });
    }
  }, []);

  useEffect(() => {
    replacer(state, defaults);
  }, [state, replacer]);

  const bookings = useMemo(() => parseRows(state.rows), [state.rows]);
  const result = useMemo(
    () => computeSchedule(bookings, { turnoverHours: state.turnoverHours }),
    [bookings, state.turnoverHours],
  );

  return (
    <div className="surface-calc p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Turnover hours required</span>
          <input
            type="number"
            min={0}
            max={48}
            value={state.turnoverHours}
            onChange={e => setState({ ...state, turnoverHours: Number(e.target.value) || 0 })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="md:col-span-2 text-small block">
          <span className="block text-ink-2 mb-1">
            Bookings <code className="text-caption">propertyId,bookingId,checkIn,checkOut</code>
          </span>
          <textarea
            rows={6}
            value={state.rows}
            onChange={e => setState({ ...state, rows: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 font-mono text-caption focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <p className="label text-navy mb-2">Turnovers</p>
          <table className="w-full text-small">
            <thead>
              <tr className="text-ink-3 text-left">
                <th className="font-normal py-1">Property</th>
                <th className="font-normal py-1">From</th>
                <th className="font-normal py-1">To</th>
                <th className="font-normal py-1 text-right">Gap (h)</th>
                <th className="font-normal py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.turnovers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-2 text-ink-3">
                    No turnovers detected.
                  </td>
                </tr>
              )}
              {result.turnovers.map((t, i) => (
                <tr key={i} className="border-t border-rule">
                  <td className="py-1.5">{t.propertyId}</td>
                  <td className="py-1.5 font-mono">{t.fromBooking}</td>
                  <td className="py-1.5 font-mono">{t.toBooking}</td>
                  <td className="py-1.5 num text-right">{t.gapHours}</td>
                  <td className="py-1.5">
                    {t.tight ? (
                      <span className="text-accent-deep font-semibold">tight</span>
                    ) : (
                      <span className="text-ink-2">ok</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <p className="label text-navy mb-2">Conflicts</p>
          {result.conflicts.length === 0 ? (
            <p className="text-ink-2 text-small">No conflicts detected.</p>
          ) : (
            <ul className="text-small space-y-1">
              {result.conflicts.map((c, i) => (
                <li key={i} className="text-[color:var(--semantic-error,#a23a2c)] font-mono">
                  {c.propertyId}: {c.bookingA} ⇄ {c.bookingB}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 flex gap-3 print:hidden">
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
          className="rounded-md border border-rule bg-parchment px-4 py-2 text-ui hover:border-accent hover:shadow-card transition-all duration-std focus:outline-none focus:shadow-focus"
        >
          Copy share link
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md border border-rule bg-parchment px-4 py-2 text-ui hover:border-accent hover:shadow-card transition-all duration-std focus:outline-none focus:shadow-focus"
        >
          Print
        </button>
      </div>
    </div>
  );
}
