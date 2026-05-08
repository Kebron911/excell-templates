import { useEffect, useMemo, useState } from 'react';
import { buildSchedule } from '@lib/calc/maintenance-schedule';
import { buildSchedulePdf } from '@lib/pdf/maintenance-schedule';
import { buildIcs, downloadIcs } from '@lib/calendar/ics';
import { downloadBytes } from '@lib/pdf/base';
import { encodeState, decodeState, browserReplacer } from '@lib/url-state';
import tasks from '@data/tasks.json';
import type { TaskCatalog } from '@lib/types';

const catalog = tasks as unknown as TaskCatalog;

type Climate = 'cold' | 'temperate' | 'hot';
type State = {
  startDate: string;
  horizonDays: number;
  hasHvac: boolean;
  hasFireplace: boolean;
  climate: Climate;
  propertyName: string;
};
const defaults: State = {
  startDate: '2026-01-01',
  horizonDays: 365,
  hasHvac: true,
  hasFireplace: false,
  climate: 'temperate',
  propertyName: 'My Property',
};

export default function MaintenanceSchedule() {
  const [s, setS] = useState<State>(defaults);
  const replacer = useMemo(() => browserReplacer(200), []);
  useEffect(() => {
    if (typeof window !== 'undefined') setS(decodeState(window.location.search, defaults));
  }, []);
  useEffect(() => {
    replacer(encodeState(s));
  }, [s, replacer]);

  const result = useMemo(
    () =>
      buildSchedule({
        startDate: s.startDate,
        horizonDays: s.horizonDays,
        propertyTraits: {
          hasHvac: s.hasHvac,
          hasFireplace: s.hasFireplace,
          climate: s.climate,
        },
        catalog,
      }),
    [s],
  );

  async function downloadPdf() {
    const bytes = await buildSchedulePdf(result, `Property: ${s.propertyName}`);
    downloadBytes(bytes, `maintenance-${s.startDate}.pdf`);
  }
  function downloadCalendar() {
    const ics = buildIcs(result);
    downloadIcs(ics, `maintenance-${s.startDate}.ics`);
  }

  return (
    <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <label className="text-sm">
          Property name
          <input
            value={s.propertyName}
            onChange={e => setS({ ...s, propertyName: e.target.value })}
            className="block w-full border border-rule px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Start date
          <input
            type="date"
            value={s.startDate}
            onChange={e => setS({ ...s, startDate: e.target.value })}
            className="block w-full border border-rule px-3 py-2 num"
          />
        </label>
        <label className="text-sm">
          Horizon (days)
          <input
            type="number"
            min={30}
            max={1825}
            value={s.horizonDays}
            onChange={e => setS({ ...s, horizonDays: Number(e.target.value) })}
            className="block w-full border border-rule px-3 py-2 num"
          />
        </label>
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={s.hasHvac}
            onChange={e => setS({ ...s, hasHvac: e.target.checked })}
          />
          Has HVAC
        </label>
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={s.hasFireplace}
            onChange={e => setS({ ...s, hasFireplace: e.target.checked })}
          />
          Has fireplace
        </label>
        <label className="text-sm">
          Climate
          <select
            value={s.climate}
            onChange={e => setS({ ...s, climate: e.target.value as Climate })}
            className="block w-full border border-rule px-3 py-2"
          >
            <option value="cold">Cold</option>
            <option value="temperate">Temperate</option>
            <option value="hot">Hot</option>
          </select>
        </label>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink3 text-left">
            <th>Date</th>
            <th>Task</th>
            <th>Cadence</th>
          </tr>
        </thead>
        <tbody>
          {result.events.map((e, i) => (
            <tr key={i} className="border-t border-rule">
              <td className="mono">{e.date}</td>
              <td>{e.name}</td>
              <td className="mono num">{e.cadenceDays}d</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex gap-3 flex-wrap" data-print="hide">
        <button
          onClick={downloadPdf}
          className="bg-accent text-parchment px-4 py-2 text-sm font-semibold hover:bg-accent-deep"
        >
          Download schedule (PDF)
        </button>
        <button
          onClick={downloadCalendar}
          className="bg-accent text-parchment px-4 py-2 text-sm font-semibold hover:bg-accent-deep"
        >
          Download calendar (.ics)
        </button>
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
