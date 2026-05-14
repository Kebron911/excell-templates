/**
 * MockAiProvider — deterministic offline AI for unit/golden tests.
 *
 * Detects the dimension from the user message and returns a synthesized
 * scorecard JSON shaped to match the production schema. Models realistic
 * token usage including cache hits for a typical 5-dim audit.
 *
 * Used by:
 *   - scorecard.test.ts  — verifies orchestrator + synthesizer behavior
 *   - cost-budget.test.ts — asserts realistic per-audit cost under $0.08
 *
 * This is NOT a substitute for live-API integration testing. It validates
 * that the audit pipeline correctly composes well-formed model outputs.
 */

import type {
  AiCompletionRequest,
  AiCompletionResponse,
  AiProvider,
} from '../../lib/ai/anthropic';
import type { Dimension } from '../../lib/audit/types';

const DIMENSIONS: Dimension[] = ['title', 'description', 'photos', 'amenities', 'reviews'];

interface MockOptions {
  /**
   * Bias on score per fixture-name. Without this every fixture would score the same.
   * Real models produce variance — we mimic it deterministically based on the listing data.
   */
  scoreBias?: number;
  /**
   * Whether this provider's run is the FIRST audit (cache miss) or a WARM audit (cache hit).
   * Drives cache_read vs cache_write token counts.
   */
  warmCache?: boolean;
}

export class MockAiProvider implements AiProvider {
  constructor(private readonly options: MockOptions = {}) {}

  async complete(req: AiCompletionRequest): Promise<AiCompletionResponse> {
    if (req.model === 'claude-sonnet-4-5') {
      return this.synthResponse(req);
    }
    const dim = this.detectDimension(req.userMessage);
    if (dim) return this.dimResponse(req, dim);
    throw new Error(`mock_ai_no_match: model=${req.model}`);
  }

  private detectDimension(userMessage: string): Dimension | null {
    for (const d of DIMENSIONS) {
      if (userMessage.startsWith(`Listing data for the ${d} dimension`)) return d;
    }
    return null;
  }

  private dimResponse(req: AiCompletionRequest, dim: Dimension): AiCompletionResponse {
    const payload = this.parsePayload(req.userMessage);
    const score = this.synthesizeScore(dim, payload);
    const fixes = this.synthesizeFixes(dim, payload, score);
    const json = {
      score,
      reasoning: `Mock ${dim} reasoning at score ${score}.`,
      fixes,
    };
    const text = JSON.stringify(json);
    return {
      text,
      model: 'claude-haiku-4-5',
      usage: this.makeHaikuUsage(),
    };
  }

  private synthResponse(req: AiCompletionRequest): AiCompletionResponse {
    // Pull dimension scores + all fix ids from the user message payload.
    let parsed: any;
    try {
      parsed = JSON.parse(req.userMessage);
    } catch {
      parsed = { fixes: [] };
    }
    const fixIds: string[] = Array.isArray(parsed.fixes)
      ? parsed.fixes.map((f: any) => f.id)
      : [];

    // Deterministically pick the first fix per dimension, capped at 5.
    const byDim = new Map<string, string>();
    for (const f of parsed.fixes ?? []) {
      if (!byDim.has(f.dimension)) byDim.set(f.dimension, f.id);
    }
    const topFixIds = Array.from(byDim.values()).slice(0, 5);
    // If we have fewer than 5 because some dims produced no fixes, top up from remaining.
    for (const id of fixIds) {
      if (topFixIds.length >= 5) break;
      if (!topFixIds.includes(id)) topFixIds.push(id);
    }

    const json = {
      summary: `Mock synthesizer summary. Top fix: ${topFixIds[0] ?? 'none'}.`,
      topFixIds,
    };
    return {
      text: JSON.stringify(json),
      model: 'claude-sonnet-4-5',
      usage: this.makeSonnetUsage(),
    };
  }

  private parsePayload(userMessage: string): any {
    const idx = userMessage.indexOf('\n\n');
    if (idx < 0) return {};
    try {
      return JSON.parse(userMessage.slice(idx + 2));
    } catch {
      return {};
    }
  }

  /** Deterministic per-dimension score based on simple input heuristics. */
  private synthesizeScore(dim: Dimension, payload: any): number {
    const bias = this.options.scoreBias ?? 0;
    switch (dim) {
      case 'title': {
        const len = payload.titleLength ?? 0;
        if (len < 10) return clamp(20 + bias);
        if (len < 25) return clamp(50 + bias);
        if (len <= 60) return clamp(85 + bias);
        if (len <= 75) return clamp(70 + bias);
        return clamp(55 + bias);
      }
      case 'description': {
        const len = payload.descriptionLength ?? 0;
        if (len < 80) return clamp(15 + bias);
        if (len < 200) return clamp(45 + bias);
        if (len <= 1500) return clamp(80 + bias);
        return clamp(60 + bias);
      }
      case 'photos': {
        const n = payload.totalCount ?? 0;
        if (n < 3) return clamp(20 + bias);
        if (n < 8) return clamp(45 + bias);
        if (n < 15) return clamp(65 + bias);
        return clamp(85 + bias);
      }
      case 'amenities': {
        const n = payload.amenityCount ?? 0;
        if (n < 3) return clamp(20 + bias);
        if (n < 8) return clamp(50 + bias);
        if (n < 15) return clamp(70 + bias);
        return clamp(85 + bias);
      }
      case 'reviews': {
        const avg = payload.ratingAverage ?? 0;
        const count = payload.reviewCount ?? 0;
        if (count < 5) return clamp(35 + bias);
        if (avg >= 4.9) return clamp(90 + bias);
        if (avg >= 4.7) return clamp(75 + bias);
        if (avg >= 4.5) return clamp(60 + bias);
        return clamp(40 + bias);
      }
    }
  }

  private synthesizeFixes(dim: Dimension, payload: any, score: number) {
    if (score >= 90) return [];
    // Always emit 2 fixes for low+mid scoring dimensions so the synthesizer has material.
    const impact = score < 50 ? 'high' : score < 75 ? 'medium' : 'low';
    return [
      {
        id: `${dim}:primary`,
        title: `Mock primary fix for ${dim}`,
        description: `Mock description for ${dim} primary fix at score ${score}.`,
        impact,
        effort: 'low',
      },
      {
        id: `${dim}:secondary`,
        title: `Mock secondary fix for ${dim}`,
        description: `Mock secondary fix description for ${dim} at score ${score}.`,
        impact: 'low',
        effort: 'medium',
      },
    ];
  }

  private makeHaikuUsage() {
    // Typical per-dim call: 600 in / 400 out, 1200 cached system prompt.
    if (this.options.warmCache) {
      return { inputTokens: 600, outputTokens: 400, cacheReadTokens: 1200, cacheWriteTokens: 0 };
    }
    // Cold cache: one of the five Haiku calls writes cache; the rest read.
    // We model this at the audit-pipeline level by toggling warmCache between calls.
    return { inputTokens: 600, outputTokens: 400, cacheReadTokens: 0, cacheWriteTokens: 1200 };
  }

  private makeSonnetUsage() {
    if (this.options.warmCache) {
      return { inputTokens: 1500, outputTokens: 600, cacheReadTokens: 900, cacheWriteTokens: 0 };
    }
    return { inputTokens: 1500, outputTokens: 600, cacheReadTokens: 0, cacheWriteTokens: 900 };
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Realistic audit-level cache pattern: first per-dim call writes cache,
 * remaining four read. Synth also reads cache on the second+ audit.
 *
 * For the 5-call burst we approximate with one cache_write + four cache_reads
 * per audit. This is a simplification — real Anthropic cache behavior is
 * connection-pooled. Good enough for budget testing.
 */
export class RealisticMockAiProvider implements AiProvider {
  private callCount = 0;
  constructor(private readonly auditIsWarm = false) {}

  async complete(req: AiCompletionRequest): Promise<AiCompletionResponse> {
    this.callCount += 1;
    // First Haiku call cold, rest warm. Synth: cold on first audit, warm on subsequent.
    const isHaiku = req.model === 'claude-haiku-4-5';
    const warmThisCall = isHaiku
      ? this.callCount > 1 // first haiku call writes cache, rest read
      : this.auditIsWarm; // synth cache state determined externally

    const provider = new MockAiProvider({ warmCache: warmThisCall });
    return provider.complete(req);
  }
}
