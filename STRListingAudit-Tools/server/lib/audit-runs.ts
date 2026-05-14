/**
 * CRUD for the `audit_runs` table.
 *
 * The audit pipeline writes here at three stages:
 *   1. POST /api/audit  → INSERT with status='running' and snapshot=null
 *   2. background       → UPDATE snapshot_json (after scrape)
 *   3. background       → UPDATE status='ready', scores_json, fixes_json, share_image_path, costs
 *
 * On failure: UPDATE status='failed', error_code, error_message.
 */

import { customAlphabet } from 'nanoid';
import { query, queryOne } from './db';
import type { ListingSnapshot } from './scrape/types';
import type { AuditResult, AuditCostBreakdown } from './audit/types';
import { toAuditRunsCostColumns } from './audit/cost-tracker';

const ID_ALPHABET = '0123456789abcdefghijkmnpqrstuvwxyz';
const generateAuditId = customAlphabet(ID_ALPHABET, 12);

export type AuditRunStatus = 'running' | 'ready' | 'failed';

export interface AuditRunRow {
  id: string;
  url: string;
  platform: 'airbnb' | 'vrbo' | 'unknown';
  listing_id: string | null;
  status: AuditRunStatus;
  snapshot_json: ListingSnapshot | null;
  scores_json: AuditResult['scores'] | null;
  fixes_json: { topFixes: AuditResult['topFixes']; summary: string; overallScore: number } | null;
  share_image_path: string | null;
  error_code: string | null;
  error_message: string | null;
  apify_cost_usd: number;
  anthropic_input_tokens: number;
  anthropic_output_tokens: number;
  anthropic_cache_read_tokens: number;
  anthropic_cache_write_tokens: number;
  total_cost_usd: number;
  ip_hash: string;
  email: string | null;
  created_at: string;
  completed_at: string | null;
}

export async function createAuditRun(params: {
  url: string;
  platform: 'airbnb' | 'vrbo' | 'unknown';
  ipHash: string;
  email?: string;
}): Promise<string> {
  const id = generateAuditId();
  await query(
    `INSERT INTO audit_runs (id, url, platform, status, ip_hash, email)
     VALUES (?, ?, ?, 'running', ?, ?)`,
    [id, params.url, params.platform, params.ipHash, params.email ?? null],
  );
  return id;
}

export async function attachSnapshot(id: string, snapshot: ListingSnapshot, apifyCost: number) {
  await query(
    `UPDATE audit_runs SET snapshot_json = ?, apify_cost_usd = ?, listing_id = ? WHERE id = ?`,
    [JSON.stringify(snapshot), apifyCost, snapshot.listingId ?? null, id],
  );
}

export async function completeAuditRun(
  id: string,
  params: {
    result: AuditResult;
    cost: AuditCostBreakdown;
    shareImagePath: string | null;
  },
) {
  const aiCols = toAuditRunsCostColumns(params.cost);
  const fixes = {
    topFixes: params.result.topFixes,
    summary: params.result.summary,
    overallScore: params.result.overallScore,
  };
  // total_cost_usd = apify + anthropic. Apify cost was set in attachSnapshot.
  await query(
    `UPDATE audit_runs SET
       status = 'ready',
       scores_json = ?,
       fixes_json = ?,
       share_image_path = ?,
       anthropic_input_tokens = ?,
       anthropic_output_tokens = ?,
       anthropic_cache_read_tokens = ?,
       anthropic_cache_write_tokens = ?,
       total_cost_usd = apify_cost_usd + ?,
       completed_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      JSON.stringify(params.result.scores),
      JSON.stringify(fixes),
      params.shareImagePath,
      aiCols.anthropic_input_tokens,
      aiCols.anthropic_output_tokens,
      aiCols.anthropic_cache_read_tokens,
      aiCols.anthropic_cache_write_tokens,
      aiCols.total_cost_usd,
      id,
    ],
  );
}

export async function failAuditRun(id: string, code: string, message: string) {
  await query(
    `UPDATE audit_runs SET status = 'failed', error_code = ?, error_message = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [code, message.slice(0, 1000), id],
  );
}

export async function attachEmail(id: string, email: string) {
  await query(`UPDATE audit_runs SET email = ? WHERE id = ?`, [email.toLowerCase(), id]);
}

export async function getAuditRun(id: string): Promise<AuditRunRow | null> {
  if (!/^[0-9a-z]{12}$/.test(id)) return null;
  const row = await queryOne<AuditRunRow>(`SELECT * FROM audit_runs WHERE id = ? LIMIT 1`, [id]);
  if (!row) return null;
  return {
    ...row,
    snapshot_json: row.snapshot_json
      ? typeof row.snapshot_json === 'string'
        ? JSON.parse(row.snapshot_json as any)
        : row.snapshot_json
      : null,
    scores_json: row.scores_json
      ? typeof row.scores_json === 'string'
        ? JSON.parse(row.scores_json as any)
        : row.scores_json
      : null,
    fixes_json: row.fixes_json
      ? typeof row.fixes_json === 'string'
        ? JSON.parse(row.fixes_json as any)
        : row.fixes_json
      : null,
  };
}

export { generateAuditId };
