/**
 * CleanerDispatch — hydrated island. URL state via Phase 1 url-state lib.
 *
 * "Download dispatch sheet (PDF)" wires to `buildDispatchPdf` + the shared
 * `downloadBytes` helper. No email gate — ops audience prefers direct download.
 */

import { useEffect, useMemo, useState } from 'react';
import { buildDispatch, type Cleaner, type DispatchTurnover } from '@/lib/calc/cleaner-dispatch';
import { buildDispatchPdf } from '@/lib/pdf/cleaner-dispatch';
import { downloadBytes } from '@/lib/pdf/download';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';

type State = { date: string; turnovers: string; cleaners: string };

const defaults: State = {
  date: '2026-06-05',
  turnovers: 'p1,123 Pine St,2\np2,456 Oak Ave,3\np3,789 Elm Rd,1',
  cleaners: 'Ana,555-0001\nBeto,555-0002',
};

function parseTurnovers(rows: string): DispatchTurnover[] {
  return rows
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [propertyId, address, bedrooms] = r.split(',').map(x => x.trim());
      return { propertyId, address, bedrooms: Number(bedrooms) || 1 };
    });
}

function parseCleaners(rows: string): Cleaner[] {
  return rows
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [name, phone] = r.split(',').map(x => x.trim());
      return { name, phone };
    });
}

export default function CleanerDispatch() {
  const [s, setS] = useState<State>(defaults);
  const replacer = useMemo(() => createDebouncedReplaceState(200), []);
  useEffect(() => {
    if (typeof window !== 'undefined') setS(parse(window.location.search, defaults));
  }, []);
  useEffect(() => {
    replacer(s, defaults);
  }, [s, replacer]);

  const turnovers = useMemo(() => parseTurnovers(s.turnovers), [s.turnovers]);
  const cleaners = useMemo(() => parseCleaners(s.cleaners), [s.cleaners]);
  const result = useMemo(
    () => buildDispatch({ date: s.date, turnovers, cleaners }),
    [s.date, turnovers, cleaners],
  );

  async function downloadPdf() {
    const bytes = await buildDispatchPdf(result);
    downloadBytes(bytes, `dispatch-${result.date}.pdf`);
  }

  return (
    <div className="surface-calc p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Dispatch date</span>
          <input
            type="date"
            value={s.date}
            onChange={e => setS({ ...s, date: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">
            Turnovers <code className="text-caption">propertyId,address,br</code>
          </span>
          <textarea
            rows={5}
            value={s.turnovers}
            onChange={e => setS({ ...s, turnovers: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 font-mono text-caption focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">
            Cleaners <code className="text-caption">name,phone</code>
          </span>
          <textarea
            rows={5}
            value={s.cleaners}
            onChange={e => setS({ ...s, cleaners: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 font-mono text-caption focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
      </div>

      <p className="label text-navy mb-2">Assignments</p>
      <table className="w-full text-small">
        <thead>
          <tr className="text-ink-3 text-left">
            <th className="font-normal py-1">Property</th>
            <th className="font-normal py-1">Address</th>
            <th className="font-normal py-1 text-right">BR</th>
            <th className="font-normal py-1">Cleaner</th>
            <th className="font-normal py-1">Phone</th>
          </tr>
        </thead>
        <tbody>
          {result.assignments.length === 0 && (
            <tr>
              <td colSpan={5} className="py-2 text-ink-3">
                Add at least one turnover and one cleaner.
              </td>
            </tr>
          )}
          {result.assignments.map((a, i) => (
            <tr key={i} className="border-t border-rule">
              <td className="py-1.5">{a.turnover.propertyId}</td>
              <td className="py-1.5">{a.turnover.address}</td>
              <td className="py-1.5 num text-right">{a.turnover.bedrooms}</td>
              <td className="py-1.5">{a.cleaner.name}</td>
              <td className="py-1.5 font-mono">{a.cleaner.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="label text-navy mt-6 mb-2">SMS templates</p>
      <ul className="space-y-2">
        {result.assignments.map((a, i) => (
          <li
            key={i}
            className="text-small font-mono border-l-2 border-accent pl-3 py-1 leading-snug"
          >
            {a.sms}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={result.assignments.length === 0}
          className="rounded-md bg-accent text-parchment px-5 py-2 text-ui font-semibold hover:bg-accent-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-std focus:outline-none focus:shadow-focus"
        >
          Download dispatch sheet (PDF)
        </button>
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
