/**
 * End-to-end audit pipeline orchestrator.
 *
 *   1. fetchListingSnapshot(url)  — Phase 2
 *   2. UPDATE audit_runs.snapshot_json + apify_cost_usd
 *   3. scoreListingSnapshot(snap, ai) — Phase 3
 *   4. generateShareImage(...)  — Phase 4 (this file)
 *   5. UPDATE audit_runs.status='ready' + result + costs
 *
 * Runs asynchronously after POST /api/audit returns the id. Errors are
 * captured and persisted to status='failed' so the result page can render
 * a meaningful message.
 */

import { fetchListingSnapshot } from './scrape/index';
import { scoreListingSnapshot } from './audit/scorecard';
import { AnthropicProvider, type AiProvider } from './ai/anthropic';
import { generateShareImage } from './share-image';
import { attachSnapshot, completeAuditRun, failAuditRun } from './audit-runs';

export interface RunPipelineOptions {
  /** Override the AI provider — tests pass MockAiProvider; production uses the default. */
  ai?: AiProvider;
  /** Skip writing the share image (useful for tests). */
  skipShareImage?: boolean;
}

export async function runAuditPipeline(
  id: string,
  url: string,
  options: RunPipelineOptions = {},
): Promise<void> {
  const ai = options.ai ?? new AnthropicProvider();

  try {
    // Step 1 — scrape
    const apifyToken = process.env.APIFY_TOKEN;
    const apifyActor = process.env.APIFY_AIRBNB_ACTOR ?? 'tri_angle/airbnb-scraper';
    const { snapshot, costUsd } = await fetchListingSnapshot(url, {
      apify: apifyToken ? { token: apifyToken, actor: apifyActor } : undefined,
    });
    await attachSnapshot(id, snapshot, costUsd);

    // Step 2 — score
    const { result, cost } = await scoreListingSnapshot(snapshot, ai);

    // Step 3 — share image
    let sharePath: string | null = null;
    if (!options.skipShareImage) {
      try {
        sharePath = await generateShareImage({
          id,
          score: result.overallScore,
          title: snapshot.title || url,
          location: snapshot.location,
        });
      } catch (err) {
        console.error('[pipeline] share-image failed (non-fatal):', err);
      }
    }

    // Step 4 — persist
    await completeAuditRun(id, { result, cost, shareImagePath: sharePath });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const code = message.startsWith('scrape_failed') ? 'scrape_failed' : 'pipeline_error';
    console.error('[pipeline] audit', id, 'failed:', err);
    try {
      await failAuditRun(id, code, message);
    } catch (dbErr) {
      console.error('[pipeline] failed to mark audit', id, 'failed:', dbErr);
    }
  }
}
