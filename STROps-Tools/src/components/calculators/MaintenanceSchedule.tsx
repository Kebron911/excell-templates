/**
 * MaintenanceSchedule — hydrated island. Form: startDate, horizonDays,
 * hasHvac, hasFireplace, climate. Three actions: download PDF, download
 * .ics, print. URL-stateful.
 */

import { useEffect, useMemo, useState } from 'react';
import { buildSchedule, type PropertyTraits } from '@/lib/calc/maintenance-schedule';
import { buildSchedulePdf } from '@/lib/pdf/maintenance-schedule';
import { buildIcs, downloadIcs } from '@/lib/calendar/ics';
import { downloadBytes } from '@/lib/pdf/download';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import tasks from '@/data/tasks.json';
import type { TaskCatalog } from '@/lib/types';

const catalog = tasks as TaskCatalog;

type State = {
  startDate: string;
  horizonDays: number;
  hasHvac: boolean;
  hasFireplace: boolean;
  climate: 'cold' | 'temperate' | 'hot';
  propertyName: string;
};

const defaults: State = {
  startDate: '2026-01-01',
  horizonDays: 365,
  hasHvac: true,
  hasFireplace: false,
  climate: 'temperate',
  propertyName: '123 Pine St',
};

export default function MaintenanceSchedule() {
  const [s, setS] = useState<State>(defaults);
  const replacer = useMemo(() => createDebouncedReplaceState(200), []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parsed = parse(window.location.search, defaults as unknown as Record<string, string | number | boolean>);
      setS(parsed as unknown as State);
    }
  }, []);

  useEffect(() => {
    replacer(s as unknown as Record<string, string | number | boolean>, defaults as unknown as Record<string, string | number | boolean>);
  }, [s, replacer]);

  const traits: PropertyTraits = {
    hasHvac: s.hasHvac,
    hasFireplace: s.hasFireplace,
    climate: s.climate,
  };
  const result = useMemo(
    () => buildSchedule({ startDate: s.startDate, horizonDays: s.horizonDays, propertyTraits: traits, catalog }),
    [s.startDate, s.horizonDays, s.hasHvac, s.hasFireplace, s.climate],
  );

  async function downloadPdf() {
    const subtitle = `${s.propertyName} — ${s.startDate} (+${s.horizonDays}d)`;
    const bytes = await buildSchedulePdf(result, subtitle);
    downloadBytes(bytes, `maintenance-schedule-${s.startDate}.pdf`);
  }

  function downloadIcsFile() {
    const ics = buildIcs(result);
    downloadIcs(ics, `maintenance-schedule-${s.startDate}.ics`);
  }

  return (
    <div className="surface-calc p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Property name</span>
          <input
            value={s.propertyName}
            onChange={e => setS({ ...s, propertyName: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Start date</span>
          <input
            type="date"
            value={s.startDate}
            onChange={e => setS({ ...s, startDate: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Horizon (days)</span>
          <input
            type="number"
            min={30}
            max={1825}
            step={30}
            value={s.horizonDays}
            onChange={e => setS({ ...s, horizonDays: Number(e.target.value) || 365 })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>

        <label className="text-small flex items-center gap-2">
          <input
            type="checkbox"
            checked={s.hasHvac}
            onChange={e => setS({ ...s, hasHvac: e.target.checked })}
            className="rounded border-rule"
          />
          Has HVAC
        </label>
        <label className="text-small flex items-center gap-2">
          <input
            type="checkbox"
            checked={s.hasFireplace}
            onChange={e => setS({ ...s, hasFireplace: e.target.checked })}
            className="rounded border-rule"
          />
          Has fireplace
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Climate</span>
          <select
            value={s.climate}
            onChange={e => setS({ ...s, climate: e.target.value as State['climate'] })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 focus:outline-none focus:border-accent focus:shadow-focus"
          >
            <option value="cold">Cold</option>
            <option value="temperate">Temperate</option>
            <option value="hot">Hot</option>
          </select>
        </label>
      </div>

      <p className="label text-navy mb-2">Schedule ({result.events.length} events)</p>
      <div className="max-h-96 overflow-auto border border-rule rounded-md">
        <table className="w-full text-small">
          <thead className="bg-parchment-alt sticky top-0">
            <tr className="text-ink-3 text-left">
              <th className="font-normal py-1.5 px-3">Date</th>
              <th className="font-normal py-1.5 px-3">Task</th>
              <th className="font-normal py-1.5 px-3 text-right">Cadence</th>
            </tr>
          </thead>
          <tbody>
            {result.events.length === 0 && (
              <tr>
                <td colSpan={3} className="py-2 px-3 text-ink-3">
                  No events. Increase the horizon or enable HVAC / fireplace traits.
                </td>
              </tr>
            )}
            {result.events.map((e, i) => (
              <tr key={i} className="border-t border-rule">
                <td className="py-1.5 px-3 font-mono num">{e.date}</td>
                <td className="py-1.5 px-3">{e.name}</td>
                <td className="py-1.5 px-3 num text-right font-mono">{e.cadenceDays}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={result.events.length === 0}
          className="rounded-md bg-accent text-parchment px-5 py-2 text-ui font-semibold hover:bg-accent-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-std focus:outline-none focus:shadow-focus"
        >
          Download schedule (PDF)
        </button>
        <button
          type="button"
          onClick={downloadIcsFile}
          disabled={result.events.length === 0}
          className="rounded-md bg-navy text-parchment px-5 py-2 text-ui font-semibold hover:bg-navy-tint disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-std focus:outline-none focus:shadow-focus"
        >
          Add to calendar (.ics)
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
