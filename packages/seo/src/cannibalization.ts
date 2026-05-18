import type { Catalog, Tool } from '@str/catalog';

export type Severity = 'high' | 'medium' | 'low';

export interface CannibalizationConflict {
  severity: Severity;
  toolA: string;
  toolB: string;
  sharedKeywords: string[];
  crossSite: boolean;
  sameCategory: boolean;
}

export interface CannibalizationReport {
  conflicts: CannibalizationConflict[];
  scannedTools: number;
  generatedAt: string;
}

function normalize(kw: string): string {
  return kw.toLowerCase().trim().replace(/\s+/g, ' ');
}

function severityFor(shared: number, crossSite: boolean, sameCategory: boolean): Severity {
  if (shared >= 3 && crossSite) return 'high';
  if (shared >= 2 && crossSite && sameCategory) return 'high';
  if (shared >= 2) return 'medium';
  return 'low';
}

/**
 * Scan the catalog for tools that target overlapping keyword sets.
 * Pairs are considered conflicts when they share 2+ normalized keywords.
 *
 * Cross-site same-keyword pairs are the dangerous ones — they're what causes
 * empire sites to compete with each other in Google. Same-site pairs are
 * usually intentional clustering (e.g. multiple host calculators share the
 * "str profit" keyword) so they default to lower severity.
 */
export function checkCannibalization(
  catalog: Catalog,
  opts: { minShared?: number; includeStatuses?: Array<Tool['status']> } = {},
): CannibalizationReport {
  const minShared = opts.minShared ?? 2;
  const includeStatuses = opts.includeStatuses ?? ['shipped', 'beta'];

  const tools = catalog.tools.filter((t) => includeStatuses.includes(t.status));

  const kwSets: Array<{ tool: Tool; kws: Set<string> }> = tools.map((tool) => ({
    tool,
    kws: new Set(tool.keywords.map(normalize)),
  }));

  const conflicts: CannibalizationConflict[] = [];

  for (let i = 0; i < kwSets.length; i++) {
    const a = kwSets[i]!;
    for (let j = i + 1; j < kwSets.length; j++) {
      const b = kwSets[j]!;
      const shared: string[] = [];
      for (const kw of a.kws) if (b.kws.has(kw)) shared.push(kw);
      if (shared.length < minShared) continue;

      const crossSite = a.tool.site !== b.tool.site;
      const sameCategory = a.tool.category === b.tool.category;
      conflicts.push({
        severity: severityFor(shared.length, crossSite, sameCategory),
        toolA: a.tool.id,
        toolB: b.tool.id,
        sharedKeywords: shared.sort(),
        crossSite,
        sameCategory,
      });
    }
  }

  conflicts.sort((x, y) => {
    const order: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
    if (order[x.severity] !== order[y.severity]) return order[x.severity] - order[y.severity];
    return y.sharedKeywords.length - x.sharedKeywords.length;
  });

  return {
    conflicts,
    scannedTools: tools.length,
    generatedAt: new Date().toISOString(),
  };
}

export interface SummarizedReport {
  total: number;
  high: number;
  medium: number;
  low: number;
  highConflicts: CannibalizationConflict[];
}

export function summarize(report: CannibalizationReport): SummarizedReport {
  const high = report.conflicts.filter((c) => c.severity === 'high');
  return {
    total: report.conflicts.length,
    high: high.length,
    medium: report.conflicts.filter((c) => c.severity === 'medium').length,
    low: report.conflicts.filter((c) => c.severity === 'low').length,
    highConflicts: high,
  };
}

export function renderMarkdownReport(report: CannibalizationReport): string {
  const summary = summarize(report);
  const lines: string[] = [];
  lines.push('# Keyword Cannibalization Report');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Scanned: ${report.scannedTools} tools`);
  lines.push(`Conflicts: ${summary.total} (high ${summary.high}, medium ${summary.medium}, low ${summary.low})`);
  lines.push('');

  if (summary.high > 0) {
    lines.push('## HIGH severity — fix before merge');
    lines.push('');
    for (const c of summary.highConflicts) {
      lines.push(`- \`${c.toolA}\` ⇆ \`${c.toolB}\` — shares: ${c.sharedKeywords.map((k) => `\`${k}\``).join(', ')}`);
    }
    lines.push('');
  }

  if (summary.medium > 0) {
    lines.push('## MEDIUM severity — review');
    lines.push('');
    for (const c of report.conflicts.filter((x) => x.severity === 'medium')) {
      lines.push(`- \`${c.toolA}\` ⇆ \`${c.toolB}\` — shares: ${c.sharedKeywords.join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
