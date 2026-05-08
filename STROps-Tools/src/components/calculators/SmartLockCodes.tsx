/**
 * SmartLockCodes — hydrated island. Browser-side `codeForAsync` (subtle
 * crypto). Inputs round-trip through URL state so a host can bookmark the
 * scenario per-property + secret combo.
 *
 * Security note: the host secret lives in the URL. We surface that warning
 * inline so operators don't accidentally share a tab with the secret in it.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { codeForAsync } from '@/lib/calc/smart-lock-codes';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { trackEvent } from '@/lib/analytics';

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
  const fired = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setS(parse(window.location.search, defaults));
    if (!fired.current) {
      fired.current = true;
      trackEvent('tool_used', { tool: 'smart-lock-codes' });
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
      if (!cancelled) setOut(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [s.secret, s.digits, s.bookings]);

  return (
    <div className="surface-calc p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <label className="text-small block md:col-span-2">
          <span className="block text-ink-2 mb-1">Host secret</span>
          <input
            value={s.secret}
            onChange={e => setS({ ...s, secret: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 font-mono focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Code digits (4–8)</span>
          <input
            type="number"
            min={4}
            max={8}
            value={s.digits}
            onChange={e => setS({ ...s, digits: Number(e.target.value) || 6 })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block md:col-span-3">
          <span className="block text-ink-2 mb-1">Booking IDs (one per line)</span>
          <textarea
            rows={5}
            value={s.bookings}
            onChange={e => setS({ ...s, bookings: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 font-mono text-caption focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
      </div>

      <table className="w-full text-small">
        <thead>
          <tr className="text-ink-3 text-left">
            <th className="font-normal py-1">Booking ID</th>
            <th className="font-normal py-1">Lock code</th>
          </tr>
        </thead>
        <tbody>
          {out.length === 0 && (
            <tr>
              <td colSpan={2} className="py-2 text-ink-3">
                Add at least one booking ID.
              </td>
            </tr>
          )}
          {out.map(r => (
            <tr key={r.id} className="border-t border-rule">
              <td className="py-1.5 font-mono">{r.id}</td>
              <td className="py-1.5 font-mono num text-lg text-navy">{r.code}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-caption text-ink-3 leading-snug max-w-2xl">
        These codes are <strong className="text-ink-2">deterministic</strong> — the same booking ID + secret always produces the same code.
        Your secret rides in the URL, so don't paste this share link in a public channel. Rotate the secret if it leaks.
      </p>

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
