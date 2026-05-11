/**
 * CheckinInstructionsGenerator — React island for the Check-in PDF tool.
 *
 * Section toggles + per-section forms + image upload (door photo,
 * parking photo). Images are read via FileReader into Uint8Array bytes
 * with the kind ('png'|'jpg') derived from the MIME type.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildCheckinPdf,
  type CheckinInput,
  type CheckinImage,
  type CheckinImageKind,
} from '@/lib/pdf/checkin';
import { formatPhone } from '@str/format';

const TOOL_SLUG = 'check-in-instructions';

type SectionKey = 'gettingHere' | 'gettingIn' | 'wifi' | 'firstNight' | 'emergency';

const SECTION_LABELS: Record<SectionKey, string> = {
  gettingHere: 'Getting here',
  gettingIn: 'Getting in',
  wifi: 'Wi-Fi',
  firstNight: 'First-night basics',
  emergency: 'Emergency contacts',
};

async function fileToImage(f: File | null): Promise<CheckinImage | null> {
  if (!f) return null;
  const kind: CheckinImageKind | null =
    f.type === 'image/png' ? 'png' : f.type === 'image/jpeg' || f.type === 'image/jpg' ? 'jpg' : null;
  if (!kind) return null;
  const buf = await f.arrayBuffer();
  return { bytes: new Uint8Array(buf), kind };
}

export default function CheckinInstructionsGenerator() {
  const [propertyName, setPropertyName] = useState('Cozy Cabin on Fox Ridge');
  const [hostName, setHostName] = useState('Daniel');
  const [arrivalWindow, setArrivalWindow] = useState('After 4pm — before 9pm');
  const [address, setAddress] = useState('142 Fox Ridge Rd, Pinewood, CA 95612');

  const [enabled, setEnabled] = useState<Record<SectionKey, boolean>>({
    gettingHere: true,
    gettingIn: true,
    wifi: true,
    firstNight: true,
    emergency: true,
  });

  const [parkingNotes, setParkingNotes] = useState(
    'Park in the gravel lot. Two spots — first come, first served.\nDo not block the neighbor’s driveway.',
  );
  const [parkingCaption, setParkingCaption] = useState('Park in the gravel lot');
  const [parkingImage, setParkingImage] = useState<CheckinImage | null>(null);
  const parkingFileRef = useRef<HTMLInputElement | null>(null);

  const [doorCode, setDoorCode] = useState('4815');
  const [doorNotes, setDoorNotes] = useState('Lockbox is on the porch column to the right of the front door.');
  const [doorCaption, setDoorCaption] = useState('Front porch lockbox');
  const [doorImage, setDoorImage] = useState<CheckinImage | null>(null);
  const doorFileRef = useRef<HTMLInputElement | null>(null);

  const [ssid, setSsid] = useState('CabinGuest');
  const [password, setPassword] = useState('mountain1982');

  const [firstNight, setFirstNight] = useState(
    'Lights: hallway switch by entry, kitchen switch behind the fridge.\nThermostat: keep between 65–78°F.\nTrash day is Wednesday — please bring bins to the curb.\nDrinking water is from the tap; pitcher in the fridge if you prefer cold.',
  );

  const [hostPhone, setHostPhone] = useState('4155550142');
  const [hospital, setHospital] = useState('Mountain Regional, 12 min drive — 555-0199');
  const [police, setPolice] = useState('911');

  const input: CheckinInput = useMemo(() => ({
    propertyName: propertyName.trim() || 'Your Property',
    hostName: hostName.trim() || undefined,
    arrivalWindow: arrivalWindow.trim() || undefined,
    address: address.trim() || undefined,
    parking: enabled.gettingHere
      ? {
          notes: parkingNotes,
          photo: parkingImage ? { ...parkingImage, caption: parkingCaption.trim() || undefined } : undefined,
        }
      : undefined,
    doorAccess: enabled.gettingIn
      ? {
          code: doorCode.trim() || undefined,
          notes: doorNotes.trim() || undefined,
          photo: doorImage ? { ...doorImage, caption: doorCaption.trim() || undefined } : undefined,
        }
      : undefined,
    wifi: enabled.wifi ? { ssid: ssid.trim(), password } : undefined,
    firstNight: enabled.firstNight
      ? firstNight.split('\n').map((s) => s.trim()).filter(Boolean)
      : undefined,
    emergency: enabled.emergency
      ? { hostPhone: hostPhone.trim() || undefined, nearestHospital: hospital.trim() || undefined, police: police.trim() || undefined }
      : undefined,
  }), [propertyName, hostName, arrivalWindow, address, enabled, parkingNotes, parkingImage, parkingCaption, doorCode, doorNotes, doorImage, doorCaption, ssid, password, firstNight, hostPhone, hospital, police]);

  // Register PDF generator
  useEffect(() => {
    const w = window as any;
    w.__strguests = w.__strguests ?? {};
    w.__strguests.generatePdf = w.__strguests.generatePdf ?? {};
    w.__strguests.generatePdf[TOOL_SLUG] = () => buildCheckinPdf(input);
    return () => {
      if (w.__strguests?.generatePdf?.[TOOL_SLUG]) delete w.__strguests.generatePdf[TOOL_SLUG];
    };
  }, [input]);

  // Page list for preview nav
  const pages = useMemo(() => {
    const list: Array<{ key: string; title: string }> = [{ key: 'cover', title: 'Cover' }];
    if (input.parking || input.address) list.push({ key: 'gettingHere', title: 'Getting here' });
    if (input.doorAccess && (input.doorAccess.code || input.doorAccess.notes || input.doorAccess.photo)) list.push({ key: 'gettingIn', title: 'Getting in' });
    if (input.wifi) list.push({ key: 'wifi', title: 'Wi-Fi' });
    if (input.firstNight && input.firstNight.length > 0) list.push({ key: 'firstNight', title: 'First-night basics' });
    if (input.emergency) list.push({ key: 'emergency', title: 'Emergency' });
    return list;
  }, [input]);

  const [pageIdx, setPageIdx] = useState(0);
  useEffect(() => {
    if (pageIdx >= pages.length) setPageIdx(Math.max(0, pages.length - 1));
  }, [pages.length, pageIdx]);

  const currentPage = pages[pageIdx] ?? pages[0];

  const onParkingFile = async (f: File | null) => setParkingImage(await fileToImage(f));
  const onDoorFile = async (f: File | null) => setDoorImage(await fileToImage(f));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6">
      {/* Form */}
      <section className="surface-gen p-5">
        <h2 className="font-serif text-h3 text-navy">Check-in details</h2>
        <p className="mt-1 text-small text-ink-2 leading-snug">
          Fill in arrival info. Toggle sections to include. Door + parking photos are
          optional but lift the document from "instructions" to "obvious."
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Property name" value={propertyName} onChange={setPropertyName} />
          <Field label="Host name (optional)" value={hostName} onChange={setHostName} />
          <Field label="Arrival window" value={arrivalWindow} onChange={setArrivalWindow} />
          <Field label="Address" value={address} onChange={setAddress} />
        </div>

        <fieldset className="mt-6">
          <legend className="text-caption text-ink-2 uppercase tracking-widest">Sections</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((k) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-parchment-alt">
                <input
                  type="checkbox"
                  checked={enabled[k]}
                  onChange={() => setEnabled((p) => ({ ...p, [k]: !p[k] }))}
                  className="h-4 w-4 accent-[color:var(--accent-500)]"
                />
                <span className="text-ui text-graphite">{SECTION_LABELS[k]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {enabled.gettingHere && (
          <Block title="Getting here">
            <Textarea label="Parking notes" value={parkingNotes} onChange={setParkingNotes} rows={3} />
            <Field label="Photo caption (optional)" value={parkingCaption} onChange={setParkingCaption} />
            <FileField
              label="Parking photo (PNG/JPG)"
              currentName={parkingImage ? 'Image loaded' : 'No image selected'}
              onFile={onParkingFile}
              inputRef={parkingFileRef}
              onClear={() => setParkingImage(null)}
            />
          </Block>
        )}

        {enabled.gettingIn && (
          <Block title="Getting in">
            <Field label="Door code" value={doorCode} onChange={setDoorCode} />
            <Textarea label="Door notes" value={doorNotes} onChange={setDoorNotes} rows={2} />
            <Field label="Photo caption (optional)" value={doorCaption} onChange={setDoorCaption} />
            <FileField
              label="Door / lockbox photo (PNG/JPG)"
              currentName={doorImage ? 'Image loaded' : 'No image selected'}
              onFile={onDoorFile}
              inputRef={doorFileRef}
              onClear={() => setDoorImage(null)}
            />
          </Block>
        )}

        {enabled.wifi && (
          <Block title="Wi-Fi">
            <Field label="Network (SSID)" value={ssid} onChange={setSsid} />
            <Field label="Password" value={password} onChange={setPassword} />
          </Block>
        )}

        {enabled.firstNight && (
          <Block title="First-night basics">
            <Textarea label="One per line" value={firstNight} onChange={setFirstNight} rows={4} />
          </Block>
        )}

        {enabled.emergency && (
          <Block title="Emergency contacts">
            <Field label="Host phone" value={hostPhone} onChange={setHostPhone} />
            <Field label="Nearest hospital" value={hospital} onChange={setHospital} />
            <Field label="Police" value={police} onChange={setPolice} />
          </Block>
        )}
      </section>

      {/* Preview */}
      <section
        aria-label="PDF preview"
        className="generator-preview rounded-md border border-rule bg-white shadow-card flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-rule px-5 py-2 bg-parchment-light">
          <button type="button" onClick={() => setPageIdx(Math.max(0, pageIdx - 1))} disabled={pageIdx === 0} className="text-ui text-navy disabled:text-ink-3 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <span className="text-caption text-ink-2 uppercase tracking-widest font-mono">
            Page {pageIdx + 1} of {pages.length} · {currentPage?.title}
          </span>
          <button type="button" onClick={() => setPageIdx(Math.min(pages.length - 1, pageIdx + 1))} disabled={pageIdx >= pages.length - 1} className="text-ui text-navy disabled:text-ink-3 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>

        <div className="flex-1 p-7 min-h-[520px]">
          {currentPage?.key === 'cover' && (
            <div className="text-center">
              <p className="label text-[color:var(--accent-500)] mb-12">CHECK-IN INSTRUCTIONS</p>
              <h3 className="font-sans font-bold text-navy text-[36px] leading-tight">{input.propertyName}</h3>
              <hr className="accent-rule mx-auto mt-3" />
              {input.arrivalWindow && (
                <p className="mt-7 font-serif italic text-graphite text-[16px]">Arrival: {input.arrivalWindow}</p>
              )}
              <div className="mt-20">
                {input.address && <p className="text-caption text-ink-2">{input.address}</p>}
                {input.hostName && <p className="mt-2 font-bold text-navy text-[11px]">— {input.hostName}</p>}
              </div>
            </div>
          )}

          {currentPage?.key === 'gettingHere' && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">Getting here</h3>
              <p className="text-small text-ink-2">Address + parking</p>
              <hr className="accent-rule mt-2" />
              {input.address && (
                <div className="mt-5">
                  <p className="label text-ink-2">ADDRESS</p>
                  <p className="font-bold text-navy text-[14px] mt-1">{input.address}</p>
                </div>
              )}
              {input.parking && (
                <div className="mt-5">
                  <p className="label text-ink-2">PARKING</p>
                  <p className="mt-1 text-ui text-graphite whitespace-pre-line">{input.parking.notes}</p>
                  {parkingImage && (
                    <figure className="mt-4">
                      <img src={URL.createObjectURL(new Blob([parkingImage.bytes as BlobPart], { type: parkingImage.kind === 'png' ? 'image/png' : 'image/jpeg' }))} alt="Parking" className="max-w-full max-h-[280px] rounded-sm border border-rule" />
                      {parkingCaption && <figcaption className="mt-1 font-serif italic text-caption text-ink-2">{parkingCaption}</figcaption>}
                    </figure>
                  )}
                </div>
              )}
            </div>
          )}

          {currentPage?.key === 'gettingIn' && input.doorAccess && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">Getting in</h3>
              <p className="text-small text-ink-2">Door access</p>
              <hr className="accent-rule mt-2" />
              {input.doorAccess.code && (
                <div className="mt-5">
                  <p className="label text-ink-2">DOOR CODE</p>
                  <p className="mt-2 font-mono font-bold text-navy text-[32px] leading-none">{input.doorAccess.code}</p>
                </div>
              )}
              {input.doorAccess.notes && (
                <p className="mt-5 text-ui text-graphite whitespace-pre-line">{input.doorAccess.notes}</p>
              )}
              {doorImage && (
                <figure className="mt-4">
                  <img src={URL.createObjectURL(new Blob([doorImage.bytes as BlobPart], { type: doorImage.kind === 'png' ? 'image/png' : 'image/jpeg' }))} alt="Door / lockbox" className="max-w-full max-h-[320px] rounded-sm border border-rule" />
                  {doorCaption && <figcaption className="mt-1 font-serif italic text-caption text-ink-2">{doorCaption}</figcaption>}
                </figure>
              )}
            </div>
          )}

          {currentPage?.key === 'wifi' && input.wifi && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">Wi-Fi</h3>
              <p className="text-small text-ink-2">For the first-night essentials</p>
              <hr className="accent-rule mt-2" />
              <div className="mt-5 rounded-md border border-[color:var(--accent-500)] bg-parchment p-4">
                <p className="label text-ink-2">NETWORK</p>
                <p className="font-mono font-bold text-navy text-[18px] mt-1">{input.wifi.ssid}</p>
                <p className="label text-ink-2 mt-3">PASSWORD</p>
                <p className="font-mono font-bold text-navy text-[18px] mt-1">{input.wifi.password}</p>
              </div>
            </div>
          )}

          {currentPage?.key === 'firstNight' && input.firstNight && (
            <div>
              <h3 className="font-serif text-h3 text-navy m-0">First-night basics</h3>
              <p className="text-small text-ink-2">Quick orientation</p>
              <hr className="accent-rule mt-2" />
              <ol className="mt-5 space-y-3 list-decimal pl-5 marker:font-bold marker:text-[color:var(--accent-500)]">
                {input.firstNight.map((t, i) => (
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

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
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

function FileField({
  label,
  currentName,
  onFile,
  inputRef,
  onClear,
}: {
  label: string;
  currentName: string;
  onFile: (f: File | null) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption text-ink-2 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-rule bg-parchment-light text-navy px-3 py-1.5 text-ui hover:border-[color:var(--accent-500)] transition-colors duration-std"
        >
          Choose file
        </button>
        <span className="text-caption text-ink-3 truncate">{currentName}</span>
        <button
          type="button"
          onClick={() => {
            onClear();
            if (inputRef.current) inputRef.current.value = '';
          }}
          className="ml-auto text-caption text-ink-3 hover:text-[color:var(--accent-700)]"
        >
          Clear
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
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
