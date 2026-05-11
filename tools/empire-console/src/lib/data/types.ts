/**
 * Shared base types used across readers. Reduces drift when categories diverge.
 *
 * Pattern: each reader defines its own Zod schema, but extends these where applicable.
 * Existing readers can adopt these incrementally — not a forced refactor.
 */

import { z } from 'zod';

/** Common shape for append-only NDJSON entries (alerts, inbox, voice, decisions, etc.). */
export const AppendOnlyBase = z.object({
  id: z.string(),
  ts: z.string(),                  // ISO timestamp
});
export type AppendOnlyBase = z.infer<typeof AppendOnlyBase>;

/** Marker schema for "things that go stale" — anything with a last_reviewed field. */
export const StaleableBase = z.object({
  last_reviewed: z.string().optional(),
});
export type StaleableBase = z.infer<typeof StaleableBase>;

/** Marker schema for "things with an expiry date" — domains, documents, insurance. */
export const ExpirableBase = z.object({
  expires: z.string().optional(),
});
export type ExpirableBase = z.infer<typeof ExpirableBase>;

/** Marker schema for "things owned by someone." */
export const OwnedBase = z.object({
  owner: z.string().optional(),
});
export type OwnedBase = z.infer<typeof OwnedBase>;

/** Standard tagged item — most lists use this. */
export const TaggedBase = z.object({
  tags: z.array(z.string()).default([]),
});
export type TaggedBase = z.infer<typeof TaggedBase>;
