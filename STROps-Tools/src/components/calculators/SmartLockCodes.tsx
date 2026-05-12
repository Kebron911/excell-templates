import { useEffect, useMemo, useState } from 'react';
import { codeForAsync } from '@lib/calc/smart-lock-codes';
import { parse, createDebouncedReplaceState } from '@str/url-state';
import { track, markCalcRunOnce } from '@lib/analytics';

type State = { secret: string; digits: number; bookings: string };
const defaults: State = {
  secret: 'change-me-host-secret',
  digits: 6,
  bookings: 'B-1001\nB-1002\nB-1003',
};

export default function SmartLockCodes() {
  const [s, setS] = useState<State>(defaults);
  const [out, setOut] = useState<{ id: string; code: string }[]>([]);
  const replacer = useMemo(() => createDebouncedReplaceState(200), []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setS(parse(new URLSearchParams(window.location.search), defaults));
    }
  }, []);
  useEffect(() => {
    replacer(s, defaults);
  }, [s, replacer]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = s.bookings
        .split('\n')
        .map(x => x.trim())
        .filter(Boolean);
      const rows = await Promise.all(
        ids.map(async id => ({
          id,
          code: await codeForAsync({ bookingId: id, secret: s.secret, digits: s.digits }),
        })),
      );
      if (!cancelled) {
        setOut(rows);
        if (rows.length > 0 && markCalcRunOnce('smart-lock-codes')) {
          track('tool_calc_run', { tool: 'smart-lock-codes' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [s]);

  return (
    <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <label className="text-sm md:col-span-2">
          Host secret (kept in URL — rotate for production!)
          <input
            value={s.secret}
            onChange={e => setS({ ...s, secret: e.target.value })}
            className="block w-full border border-rule px-3 py-2 mono"
          />
        </label>
        <label className="text-sm">
          Code digits (4-8)
          <input
            type="number"
            min={4}
            max={8}
            value={s.digits}
            onChange={e => setS({ ...s, digits: Number(e.target.value) })}
            className="block w-full border border-rule px-3 py-2 num"
          />
        </label>
        <label className="text-sm md:col-span-3">
          Booking IDs (one per line)
          <textarea
            rows={4}
            value={s.bookings}
            onChange={e => setS({ ...s, bookings: e.target.value })}
            className="block w-full border border-rule px-3 py-2 mono text-xs"
          />
        </label>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink3">
            <th className="text-left">Booking ID</th>
            <th className="text-left">Lock code</th>
          </tr>
        </thead>
        <tbody>
          {out.map(r => (
            <tr key={r.id} className="border-t border-rule">
              <td className="mono">{r.id}</td>
              <td className="mono text-lg num">{r.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-ink3 text-xs mt-3">
        These codes are deterministic — the same booking + secret always produces the same
        code. Store your secret somewhere safe (a password manager). Rotate it if it leaks.
      </p>
    </div>
  );
}
