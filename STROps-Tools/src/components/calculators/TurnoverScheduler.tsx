import { useEffect, useMemo, useState } from 'react';
import { computeSchedule, type Booking } from '@lib/calc/turnover';
import { encodeState, decodeState, browserReplacer } from '@lib/url-state';
import { track, markCalcRunOnce } from '@lib/analytics';

type State = { turnoverHours: number; rows: string };
const defaults: State = {
  turnoverHours: 4,
  rows: 'p1,b1,2026-06-01,2026-06-05\np1,b2,2026-06-05,2026-06-08',
};

function parseRows(rows: string): Booking[] {
  return rows
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [propertyId, id, checkIn, checkOut] = r.split(',').map(s => s.trim());
      return { propertyId, id, checkIn, checkOut };
    });
}

export default function TurnoverScheduler() {
  const [state, setState] = useState<State>(defaults);
  const replacer = useMemo(() => browserReplacer(200), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setState(decodeState(window.location.search, defaults));
  }, []);
  useEffect(() => {
    replacer(encodeState(state));
  }, [state, replacer]);

  const bookings = useMemo(() => parseRows(state.rows), [state.rows]);
  const result = useMemo(
    () => computeSchedule(bookings, { turnoverHours: state.turnoverHours }),
    [bookings, state.turnoverHours],
  );

  useEffect(() => {
    if (result.turnovers.length > 0 && markCalcRunOnce('turnover-scheduler')) {
      track('tool_calc_run', { tool: 'turnover-scheduler' });
    }
  }, [result]);

  return (
    <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <label className="text-sm">
          Turnover hours required
          <input
            type="number"
            min={0}
            max={48}
            value={state.turnoverHours}
            onChange={e =>
              setState({ ...state, turnoverHours: Number(e.target.value) })
            }
            className="block w-full border border-rule px-3 py-2 num"
          />
        </label>
        <label className="md:col-span-2 text-sm">
          Bookings (one per line: <code>propertyId,bookingId,checkIn,checkOut</code>)
          <textarea
            rows={6}
            value={state.rows}
            onChange={e => setState({ ...state, rows: e.target.value })}
            className="block w-full border border-rule px-3 py-2 mono text-xs"
          />
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h3 className="font-semibold mb-2">Turnovers</h3>
          <table className="w-full text-sm num">
            <thead>
              <tr className="text-ink3">
                <th className="text-left">Property</th>
                <th className="text-left">From</th>
                <th className="text-left">To</th>
                <th className="text-left">Gap (h)</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.turnovers.map((t, i) => (
                <tr key={i} className="border-t border-rule">
                  <td>{t.propertyId}</td>
                  <td>{t.fromBooking}</td>
                  <td>{t.toBooking}</td>
                  <td>{t.gapHours}</td>
                  <td>
                    {t.tight ? (
                      <span className="text-accent-deep font-semibold">tight</span>
                    ) : (
                      'ok'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h3 className="font-semibold mb-2">Conflicts</h3>
          {result.conflicts.length === 0 ? (
            <p className="text-ink2 text-sm">No conflicts detected.</p>
          ) : (
            <ul className="text-sm">
              {result.conflicts.map((c, i) => (
                <li key={i} className="text-[color:var(--semantic-error)]">
                  {c.propertyId}: {c.bookingA} ⇄ {c.bookingB}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <div className="mt-6 flex gap-3" data-print="hide">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="border border-rule px-4 py-2 text-sm"
        >
          Copy share link
        </button>
        <button
          onClick={() => window.print()}
          className="border border-rule px-4 py-2 text-sm"
        >
          Print
        </button>
      </div>
    </div>
  );
}
