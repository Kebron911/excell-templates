/**
 * WelcomeBookBuilder — React island for the Welcome Book multi-page PDF.
 *
 * Form-on-left has section toggles + per-section forms. Preview-on-right
 * renders one page at a time with prev/next nav (mirrors the multi-page PDF).
 */

import { useEffect, useMemo, useState } from 'react';
import { buildWelcomeBookPdf, type WelcomeBookInput } from '@/lib/pdf/welcome-book';
import { formatPhone } from '@str/format';

const TOOL_SLUG = 'welcome-book';

type SectionKey = 'wifi' | 'access' | 'neighborhood' | 'tips' | 'emergency';

const SECTION_LABELS: Record<SectionKey, string> = {
  wifi: 'Wi-Fi',
  access: 'Access codes',
  neighborhood: 'Neighborhood favorites',
  tips: 'House tips',
  emergency: 'Emergency contacts',
};

export default function WelcomeBookBuilder() {
  const [propertyName, setPropertyName] = useState('Cozy Cabin on Fox Ridge');
  const [hostName, setHostName] = useState('Daniel');
  const [tagline, setTagline] = useState('Welcome to your mountain retreat');
  const [heroNote, setHeroNote] = useState('Built 1982. Updated 2024.');

  const [enabled, setEnabled] = useState<Record<SectionKey, boolean>>({
    wifi: true,
    access: true,
    neighborhood: true,
    tips: true,
    emergency: true,
  });

  const [ssid, setSsid] = useState('CabinGuest');
  const [password, setPassword] = useState('mountain1982');
  const [wifiNotes, setWifiNotes] = useState('Router is in the kitchen pantry.');

  const [doorCode, setDoorCode] = useState('4815');
  const [garageCode, setGarageCode] = useState('');
  const [accessNotes, setAccessNotes] = useState('Lockbox on the porch column.');

  const [favorites, setFavorites] = useState(
    'Fox Ridge Coffee | 5 min walk; opens 7am\nTrailhead — Bear Loop | 0.4 mi; moderate',
  );

  const [tips, setTips] = useState(
    'Hot tub: 5-min flush before use; lid back on after.\nTrash day is Wednesday — bins on the curb by 7am.',
  );

  const [hostPhone, setHostPhone] = useState('4155550142');
  const [hospital, setHospital] = useState('Mountain Regional, 12 min drive — 555-0199');
  const [police, setPolice] = useState('911');

  const input: WelcomeBookInput = useMemo(() => {
    const fav = favorites
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, detail] = line.split('|').map((s) => s.trim());
        return { name: name ?? '', detail: detail || undefined };
      })
      .filter((f) => f.name);

    return {
      propertyName: propertyName.trim() || 'Your Property',
      hostName: hostName.trim() || undefined,
      cover: { tagline: tagline.trim() || 'Welcome', heroNote: heroNote.trim() || undefined },
      wifi: enabled.wifi
        ? { ssid: ssid.trim(), password: password.trim(), notes: wifiNotes.trim() || undefined }
        : undefined,
      accessCodes: enabled.access
        ? {
            doorCode: doorCode.trim() || undefined,
            garageCode: garageCode.trim() || undefined,
            notes: accessNotes.trim() || undefined,
          }
        : undefined,
      neighborhood: enabled.neighborhood && fav.length > 0 ? { favorites: fav } : undefined,
      houseTips: enabled.tips
        ? tips.split('\n').map((s) => s.trim()).filter(Boolean)
        : undefined,
      emergency: enabled.emergency
        ? {
            hostPhone: hostPhone.trim() || undefined,
            nearestHospital: hospital.trim() || undefined,
            police: police.trim() || undefined,
          }
        : undefined,
    };
  }, [propertyName, hostName, tagline, heroNote, enabled, ssid, password, wifiNotes, doorCode, garageCode, accessNotes, favorites, tips, hostPhone, hospital, police]);

  // Register on window for PdfDownloadButton
  useEffect(() => {
    const w = window as any;
    w.__strguests = w.__strguests ?? {};
    w.__strguests.generatePdf = w.__strguests.generatePdf ?? {};
    w.__strguests.generatePdf[TOOL_SLUG] = () => buildWelcomeBookPdf(input);
    return () => {
      if (w.__strguests?.generatePdf?.[TOOL_SLUG]) {
        delete w.__strguests.generatePdf[TOOL_SLUG];
      }
    };
  }, [input]);

  // Compute pages for preview navigation
  const pages = useMemo(() => {
    const out: Array<{ key: string; title: string }> = [{ key: 'cover', title: 'Cover' }];
    if (input.wifi) out.push({ key: 'wifi', title: 'Wi-Fi & access' });
    else if (input.accessCodes) out.push({ key: 'access', title: 'Access codes' });
    if (input.neighborhood) out.push({ key: 'neighborhood', title: 'Neighborhood favorites' });
    if (input.houseTips) out.push({ key: 'tips', title: 'House tips' });
    if (input.emergency) out.push({ key: 'emergency', title: 'Emergency' });
    return out;
  }, [input]);

  const [pageIndex, setPageIndex] = useState(0);
  useEffect(() => {
    if (pageIndex >= pages.length) setPageIndex(Math.max(0, pages.length - 1));
  }, [pages.length, pageIndex]);

  const currentPage = pages[pageIndex] ?? pages[0];

  const toggleSection = (k: SectionKey) =>
    setEnabled((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6">
      {/* ---- Form ---------------------------------------------------------- */}
      <section className="surface-gen p-5">
        <h2 className="font-serif text-h3 text-navy">Build your welcome book</h2>
        <p className="mt-1 text-small text-ink-2 leading-snug">
          Toggle sections to include. Each enabled section becomes its own page.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldText label="Property name" value={propertyName} onChange={setPropertyName} />
          <FieldText label="Host name (optional)" value={hostName} onChange={setHostName} />
          <FieldText label="Tagline" value={tagline} onChange={setTagline} />
          <FieldText label="Hero note (optional)" value={heroNote} onChange={setHeroNote} />
        </div>

        <fieldset className="mt-6">
          <legend className="text-caption text-ink-2 uppercase tracking-widest">Sections</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((k) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-parchment-alt">
                <input
                  type="checkbox"
                  checked={enabled[k]}
                  onChange={() => toggleSection(k)}
                  className="h-4 w-4 accent-[color:var(--accent-500)]"
                />
                <span className="text-ui text-graphite">{SECTION_LABELS[k]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {enabled.wifi && (
          <Block title="Wi-Fi">
            <FieldText label="Network (SSID)" value={ssid} onChange={setSsid} />
            <FieldText label="Password" value={password} onChange={setPassword} />
            <FieldText label="Notes (optional)" value={wifiNotes} onChange={setWifiNotes} />
          </Block>
        )}

        {enabled.access && (
          <Block title="Access codes">
            <FieldText label="Front door code" value={doorCode} onChange={setDoorCode} />
            <FieldText label="Garage code (optional)" value={garageCode} onChange={setGarageCode} />
            <FieldText label="Notes (optional)" value={accessNotes} onChange={setAccessNotes} />
          </Block>
        )}

        {enabled.neighborhood && (
          <Block title="Neighborhood favorites">
            <FieldTextarea
              label="One per line — Name | optional detail"
              value={favorites}
              onChange={setFavorites}
              rows={4}
            />
          </Block>
        )}

        {enabled.tips && (
          <Block title="House tips">
            <FieldTextarea label="One per line" value={tips} onChange={setTips} rows={4} />
          </Block>
        )}

        {enabled.emergency && (
          <Block title="Emergency contacts">
            <FieldText label="Host phone" value={hostPhone} onChange={setHostPhone} />
            <FieldText label="Nearest hospital" value={hospital} onChange={setHospital} />
            <FieldText label="Police" value={police} onChange={setPolice} />
          </Block>
        )}
      </section>

      {/* ---- Preview ------------------------------------------------------- */}
      <section
        aria-label="PDF preview"
        className="generator-preview rounded-md border border-rule bg-white shadow-card flex flex-col"
      >
        {/* Page nav */}
        <div className="flex items-center justify-between border-b border-rule px-5 py-2 bg-parchment-light">
          <button
            type="button"
            onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
            className="text-ui text-navy disabled:text-ink-3 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-caption text-ink-2 uppercase tracking-widest font-mono">
            Page {pageIndex + 1} of {pages.length} · {currentPage?.title}
          </span>
          <button
            type="button"
            onClick={() => setPageIndex(Math.min(pages.length - 1, pageIndex + 1))}
            disabled={pageIndex >= pages.length - 1}
            className="text-ui text-navy disabled:text-ink-3 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 p-7 min-h-[520px]">
          {currentPage?.key === 'cover' && (
            <div className="text-center">
              <p className="label text-[color:var(--accent-500)] mb-12">A guidebook for your stay</p>
              <h3 className="font-sans font-bold text-navy text-[56px] leading-none">Welcome</h3>
              <hr className="accent-rule mx-auto mt-3" />
              <p className="mt-8 font-serif italic text-graphite text-[18px]">{input.cover.tagline}</p>
              <div className="mt-20">
                <p className="label font-bold text-navy">{input.propertyName.toUpperCase()}</p>
                {input.cover.heroNote && <p className="mt-1 text-caption text-ink-2">{input.cover.heroNote}</p>}
                {input.hostName && <p className="mt-2 text-caption text-ink-2">Hosted by {input.hostName}</p>}
              </div>
            </div>
          )}

          {currentPage?.key === 'wifi' && input.wifi && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">Wi-Fi & access</h3>
              <p className="text-small text-ink-2">Connect on arrival</p>
              <hr className="accent-rule mt-2" />
              <div className="mt-5 rounded-md border border-[color:var(--accent-500)] bg-parchment p-4">
                <p className="label text-ink-2">NETWORK</p>
                <p className="font-bold text-navy text-[18px] mt-1">{input.wifi.ssid}</p>
                <p className="label text-ink-2 mt-3">PASSWORD</p>
                <p className="font-bold text-navy text-[18px] mt-1 font-mono">{input.wifi.password}</p>
              </div>
              {input.wifi.notes && <p className="mt-3 text-small text-ink-2">{input.wifi.notes}</p>}
              {input.accessCodes && (
                <div className="mt-6">
                  <p className="font-bold text-navy">Access codes</p>
                  {input.accessCodes.doorCode && (
                    <p className="mt-1 text-ui text-graphite">Front door code: <span className="font-mono">{input.accessCodes.doorCode}</span></p>
                  )}
                  {input.accessCodes.garageCode && (
                    <p className="mt-1 text-ui text-graphite">Garage code: <span className="font-mono">{input.accessCodes.garageCode}</span></p>
                  )}
                  {input.accessCodes.notes && <p className="mt-1 text-small text-ink-2">{input.accessCodes.notes}</p>}
                </div>
              )}
            </div>
          )}

          {currentPage?.key === 'access' && input.accessCodes && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">Access codes</h3>
              <p className="text-small text-ink-2">On arrival</p>
              <hr className="accent-rule mt-2" />
              {input.accessCodes.doorCode && (
                <p className="mt-3 text-ui text-graphite">Front door code: <span className="font-mono">{input.accessCodes.doorCode}</span></p>
              )}
              {input.accessCodes.garageCode && (
                <p className="mt-1 text-ui text-graphite">Garage code: <span className="font-mono">{input.accessCodes.garageCode}</span></p>
              )}
            </div>
          )}

          {currentPage?.key === 'neighborhood' && input.neighborhood && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">Neighborhood favorites</h3>
              <p className="text-small text-ink-2">Where the locals go</p>
              <hr className="accent-rule mt-2" />
              <ul className="mt-5 space-y-3 list-none p-0">
                {input.neighborhood.favorites.map((f, i) => (
                  <li key={i}>
                    <p className="font-bold text-navy">{f.name}</p>
                    {f.detail && <p className="text-small text-ink-2">{f.detail}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentPage?.key === 'tips' && input.houseTips && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">House tips</h3>
              <p className="text-small text-ink-2">Little things that make the stay smoother</p>
              <hr className="accent-rule mt-2" />
              <ol className="mt-5 space-y-3 list-decimal pl-5 marker:font-bold marker:text-[color:var(--accent-500)]">
                {input.houseTips.map((t, i) => (
                  <li key={i} className="text-ui text-graphite">{t}</li>
                ))}
              </ol>
            </div>
          )}

          {currentPage?.key === 'emergency' && input.emergency && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">Emergency</h3>
              <p className="text-small text-ink-2">If something goes wrong</p>
              <hr className="accent-rule mt-2" />
              <dl className="mt-5 space-y-4">
                {input.emergency.hostPhone && (
                  <div>
                    <dt className="label text-ink-2">HOST</dt>
                    <dd className="font-bold text-navy text-[14px]">{formatPhone(input.emergency.hostPhone)}</dd>
                  </div>
                )}
                {input.emergency.nearestHospital && (
                  <div>
                    <dt className="label text-ink-2">NEAREST HOSPITAL</dt>
                    <dd className="font-bold text-navy text-[14px]">{input.emergency.nearestHospital}</dd>
                  </div>
                )}
                {input.emergency.police && (
                  <div>
                    <dt className="label text-ink-2">POLICE</dt>
                    <dd className="font-bold text-navy text-[14px]">{input.emergency.police}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        <footer className="border-t border-rule py-3 text-caption text-ink-3 text-center font-mono">
          Generated {new Date().toISOString().slice(0, 10)} · strguests.tools
        </footer>
      </section>
    </div>
  );
}

// ---- Small input helpers (kept local to file) -------------------------------

function FieldText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
      {label}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus normal-case tracking-normal"
      />
    </label>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus normal-case tracking-normal font-sans"
      />
    </label>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-5 border-t border-rule pt-4">
      <legend className="sr-only">{title}</legend>
      <p className="label text-navy mb-3">{title}</p>
      <div className="grid grid-cols-1 gap-3">{children}</div>
    </fieldset>
  );
}
