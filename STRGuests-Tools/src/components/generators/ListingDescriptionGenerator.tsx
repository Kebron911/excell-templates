/**
 * Listing description generator — React island for /listing-description.
 *
 * Submits to POST /api/generate-listing via the shared AiGeneratorShell.
 */

import { useState } from 'react';
import AiGeneratorShell from './AiGeneratorShell';

const VIBES = ['hospitable', 'luxury', 'family', 'quirky', 'professional'] as const;
type Vibe = typeof VIBES[number];

export default function ListingDescriptionGenerator() {
  const [propertyType, setPropertyType] = useState('2BR cabin');
  const [location, setLocation] = useState('');
  const [amenitiesText, setAmenitiesText] = useState('');
  const [vibe, setVibe] = useState<Vibe>('hospitable');
  const [uniqueFeatures, setUniqueFeatures] = useState('');

  return (
    <AiGeneratorShell
      endpoint="/api/generate-listing"
      toolSlug="listing-description"
      generateLabel="Generate listing copy"
      buildBody={() => ({
        propertyType: propertyType.trim(),
        location: location.trim(),
        amenities: amenitiesText
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean),
        vibe,
        uniqueFeatures: uniqueFeatures.trim() || undefined,
      })}
      renderForm={() => (
        <>
          <div>
            <label className="label text-ink-3" htmlFor="lst-type">Property type</label>
            <input
              id="lst-type"
              type="text"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              maxLength={80}
              required
              className="mt-1 w-full rounded-md border border-rule px-3 py-2 text-body"
              placeholder="2BR cabin"
            />
          </div>
          <div>
            <label className="label text-ink-3" htmlFor="lst-loc">Location</label>
            <input
              id="lst-loc"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={80}
              required
              className="mt-1 w-full rounded-md border border-rule px-3 py-2 text-body"
              placeholder="Asheville, NC"
            />
          </div>
          <div>
            <label className="label text-ink-3" htmlFor="lst-amen">Amenities (one per line, or comma-separated)</label>
            <textarea
              id="lst-amen"
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-rule px-3 py-2 text-body"
              placeholder={'hot tub\nfire pit\noutdoor kitchen'}
            />
          </div>
          <div>
            <label className="label text-ink-3">Vibe</label>
            <div className="mt-2 flex flex-wrap gap-3">
              {VIBES.map((v) => (
                <label key={v} className="flex items-center gap-2 text-small text-navy">
                  <input
                    type="radio"
                    name="vibe"
                    value={v}
                    checked={vibe === v}
                    onChange={() => setVibe(v)}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label text-ink-3" htmlFor="lst-unique">Unique features (optional)</label>
            <textarea
              id="lst-unique"
              value={uniqueFeatures}
              onChange={(e) => setUniqueFeatures(e.target.value)}
              rows={2}
              maxLength={500}
              className="mt-1 w-full rounded-md border border-rule px-3 py-2 text-body"
              placeholder="Lake view from the deck; sunsets are the best part."
            />
          </div>
        </>
      )}
    />
  );
}
