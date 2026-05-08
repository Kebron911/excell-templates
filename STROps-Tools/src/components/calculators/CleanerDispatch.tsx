import { useEffect, useMemo, useState } from 'react';
import { buildDispatch } from '@lib/calc/cleaner-dispatch';
import { buildDispatchPdf } from '@lib/pdf/cleaner-dispatch';
import { downloadBytes } from '@lib/pdf/base';
import { encodeState, decodeState, browserReplacer } from '@lib/url-state';

type State = { date: string; turnovers: string; cleaners: string };
const defaults: State = {
  date: '2026-06-05',
  turnovers: 'p1,123 Pine,2\np2,456 Oak,3',
  cleaners: 'Ana,555-0001\nBeto,555-0002',
};

export default function CleanerDispatch() {
  const [s, setS] = useState<State>(defaults);
  const replacer = useMemo(() => browserReplacer(200), []);
  useEffect(() => {
    if (typeof window !== 'undefined') setS(decodeState(window.location.search, defaults));
  }, []);
  useEffect(() => {
    replacer(encodeState(s));
  }, [s, replacer]);

  const turnovers = s.turnovers
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [propertyId, address, bedrooms] = r.split(',').map(x => x.trim());
      return { propertyId, address, bedrooms: Number(bedrooms) || 1 };
    });
  const cleaners = s.cleaners
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [name, phone] = r.split(',').map(x => x.trim());
      return { name, phone };
    });
  const result = buildDispatch({ date: s.date, turnovers, cleaners });

  async function downloadPdf() {
    const bytes = await buildDispatchPdf(result);
    downloadBytes(bytes, `dispatch-${result.date}.pdf`);
  }

  return (
    <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <label className="text-sm">
          Dispatch date
          <input
            type="date"
            value={s.date}
            onChange={e => setS({ ...s, date: e.target.value })}
            className="block w-full border border-rule px-3 py-2 num"
          />
        </label>
        <label className="text-sm">
          Turnovers (propertyId,address,bedrooms)
          <textarea
            rows={5}
            value={s.turnovers}
            onChange={e => setS({ ...s, turnovers: e.target.value })}
            className="block w-full border border-rule px-3 py-2 mono text-xs"
          />
        </label>
        <label className="text-sm">
          Cleaners (name,phone)
          <textarea
            rows={5}
            value={s.cleaners}
            onChange={e => setS({ ...s, cleaners: e.target.value })}
            className="block w-full border border-rule px-3 py-2 mono text-xs"
          />
        </label>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink3 text-left">
            <th>Property</th>
            <th>Address</th>
            <th>BR</th>
            <th>Cleaner</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {result.assignments.map((a, i) => (
            <tr key={i} className="border-t border-rule">
              <td>{a.turnover.propertyId}</td>
              <td>{a.turnover.address}</td>
              <td className="num">{a.turnover.bedrooms}</td>
              <td>{a.cleaner.name}</td>
              <td className="mono">{a.cleaner.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 className="mt-4 mb-2 font-semibold">SMS templates</h4>
      <ul className="space-y-2">
        {result.assignments.map((a, i) => (
          <li key={i} className="text-sm border-l-2 border-accent pl-3">
            {a.sms}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-3" data-print="hide">
        <button
          onClick={downloadPdf}
          className="bg-accent text-parchment px-4 py-2 text-sm font-semibold hover:bg-accent-deep"
        >
          Download dispatch sheet (PDF)
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
