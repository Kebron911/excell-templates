/**
 * WifiSignGenerator — React island for the Wi-Fi sign PDF tool.
 *
 * Form-on-left: SSID + password + house name + 3-template radio.
 * Preview-on-right: live HTML mock matching the chosen template, with the
 * QR code rendered as a data URL via the qrcode package.
 */

import { useEffect, useMemo, useState } from 'react';
import { buildWifiSignPdf, type WifiSignTemplate } from '@/lib/pdf/wifi-sign';
import { buildWifiQrDataUrl } from '@/lib/pdf/wifi-qr';

const TOOL_SLUG = 'wifi-sign';

const TEMPLATES: Array<{ id: WifiSignTemplate; label: string; blurb: string }> = [
  { id: 'minimal',    label: 'Minimal',     blurb: 'Quiet typography, no flourishes.' },
  { id: 'hospitable', label: 'Hospitable',  blurb: 'Warm, recommended for most STRs.' },
  { id: 'fun',        label: 'Fun',         blurb: 'Big QR, playful header.' },
];

export default function WifiSignGenerator() {
  const [ssid, setSsid] = useState('CabinGuest');
  const [password, setPassword] = useState('mountain1982');
  const [houseName, setHouseName] = useState('Cozy Cabin');
  const [template, setTemplate] = useState<WifiSignTemplate>('hospitable');

  const input = useMemo(() => ({
    ssid: ssid.trim(),
    password: password,
    houseName: houseName.trim() || undefined,
    template,
  }), [ssid, password, houseName, template]);

  // QR data URL for preview
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  useEffect(() => {
    let cancelled = false;
    if (!ssid.trim() || !password) {
      setQrDataUrl('');
      return;
    }
    buildWifiQrDataUrl({ ssid: ssid.trim(), password }, 256).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    }).catch(() => {
      if (!cancelled) setQrDataUrl('');
    });
    return () => { cancelled = true; };
  }, [ssid, password]);

  // Register PDF generator on window
  useEffect(() => {
    const w = window as any;
    w.__strguests = w.__strguests ?? {};
    w.__strguests.generatePdf = w.__strguests.generatePdf ?? {};
    w.__strguests.generatePdf[TOOL_SLUG] = () => buildWifiSignPdf(input);
    return () => {
      if (w.__strguests?.generatePdf?.[TOOL_SLUG]) delete w.__strguests.generatePdf[TOOL_SLUG];
    };
  }, [input]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6">
      {/* Form */}
      <section className="surface-gen p-5">
        <h2 className="font-serif text-h3 text-navy">Wi-Fi sign details</h2>
        <p className="mt-1 text-small text-ink-2 leading-snug">
          Enter network credentials and pick a template. The QR code regenerates
          live as you type — guests can scan to join, or read the credentials below.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Network (SSID)" value={ssid} onChange={setSsid} />
          <Field label="Password" value={password} onChange={setPassword} />
          <Field label="House / property name (optional)" value={houseName} onChange={setHouseName} />
        </div>

        <fieldset className="mt-6">
          <legend className="text-caption text-ink-2 uppercase tracking-widest">Template</legend>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {TEMPLATES.map((t) => (
              <label key={t.id} className="flex items-start gap-3 cursor-pointer rounded-md border border-rule px-3 py-2 hover:border-[color:var(--accent-500)] has-[input:checked]:border-[color:var(--accent-500)] has-[input:checked]:bg-parchment-light">
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={template === t.id}
                  onChange={() => setTemplate(t.id)}
                  className="mt-1 h-4 w-4 accent-[color:var(--accent-500)]"
                />
                <span>
                  <span className="block text-ui font-semibold text-navy">{t.label}</span>
                  <span className="block text-caption text-ink-2">{t.blurb}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {/* Preview */}
      <section
        aria-label="Wi-Fi sign preview"
        className={`generator-preview rounded-md border border-rule bg-white p-7 shadow-card text-center min-h-[520px] flex flex-col ${template === 'fun' ? 'justify-start' : 'justify-center'}`}
      >
        {template === 'minimal' && (
          <>
            <p className="label text-ink-2">WI-FI</p>
            {input.houseName && <p className="mt-3 font-serif italic text-graphite text-[18px]">{input.houseName}</p>}
            <div className="mt-7 mx-auto" style={{ width: 180, height: 180 }}>
              {qrDataUrl ? <img src={qrDataUrl} alt="Wi-Fi QR" className="w-full h-full" width={180} height={180} /> : <PlaceholderQr />}
            </div>
            <p className="label mt-7 text-ink-2">NETWORK</p>
            <p className="font-mono font-bold text-navy text-[18px]">{input.ssid}</p>
            <p className="label mt-3 text-ink-2">PASSWORD</p>
            <p className="font-mono font-bold text-navy text-[18px]">{password}</p>
            <p className="mt-5 font-serif italic text-ink-2 text-small">Scan or type — either works.</p>
          </>
        )}

        {template === 'hospitable' && (
          <>
            <p className="label text-[color:var(--accent-500)]">WELCOME</p>
            {input.houseName && <p className="mt-3 font-bold text-navy text-[26px]">{input.houseName}</p>}
            <hr className="accent-rule mx-auto mt-3" />
            <p className="mt-3 font-serif italic text-graphite text-[16px]">Get connected</p>
            <div className="mt-5 mx-auto" style={{ width: 168, height: 168 }}>
              {qrDataUrl ? <img src={qrDataUrl} alt="Wi-Fi QR" className="w-full h-full" width={168} height={168} /> : <PlaceholderQr />}
            </div>
            <div className="mt-7 mx-auto max-w-md rounded-md border border-[color:var(--accent-500)] bg-parchment p-4 text-left">
              <p className="label text-ink-2">NETWORK</p>
              <p className="mt-1 font-mono font-bold text-navy text-[18px]">{input.ssid}</p>
              <p className="label mt-3 text-ink-2">PASSWORD</p>
              <p className="mt-1 font-mono font-bold text-navy text-[18px]">{password}</p>
            </div>
            <p className="mt-5 font-serif italic text-ink-2 text-small">Make yourself at home.</p>
          </>
        )}

        {template === 'fun' && (
          <>
            <p className="font-bold text-[color:var(--accent-500)] text-[22px]">WI-FI'S OVER HERE →</p>
            {input.houseName && <p className="mt-2 font-serif italic text-ink-2 text-small">{input.houseName}</p>}
            <div className="mt-3 mx-auto" style={{ width: 240, height: 240 }}>
              {qrDataUrl ? <img src={qrDataUrl} alt="Wi-Fi QR" className="w-full h-full" width={240} height={240} /> : <PlaceholderQr />}
            </div>
            <p className="mt-5 font-serif italic text-ink-2">or type:</p>
            <p className="mt-1 font-mono font-bold text-navy text-[16px]">{input.ssid}</p>
            <p className="font-mono font-bold text-[color:var(--accent-500)] text-[16px]">{password}</p>
          </>
        )}

        <footer className="mt-auto pt-3 border-t border-rule text-caption text-ink-3 text-center font-mono">
          Generated {new Date().toISOString().slice(0, 10)} · strguests.tools
        </footer>
      </section>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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

function PlaceholderQr() {
  return (
    <div className="w-full h-full grid place-items-center bg-parchment-alt rounded-sm border border-dashed border-rule">
      <span className="text-caption text-ink-3">QR will appear here</span>
    </div>
  );
}
