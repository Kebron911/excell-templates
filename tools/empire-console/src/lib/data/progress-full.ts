import { readFile } from 'node:fs/promises';
import { paths } from '../paths.js';

/**
 * Phase-by-phase PROGRESS.md browser. Companion to readProgress() which
 * only surfaces top P0 actions; this returns the full structured tree.
 */

export interface ProgressItem {
  text: string;
  checked: boolean;
  line: number;
}

export interface ProgressSubsection {
  id: string;            // e.g. "P9.2"
  title: string;         // full heading text
  items: ProgressItem[];
  checked: number;
  total: number;
  pct: number;
}

export interface ProgressPhase {
  id: string;            // e.g. "P9"
  title: string;         // section heading
  subsections: ProgressSubsection[];
  checked: number;
  total: number;
  pct: number;
}

export interface ProgressFullReport {
  phases: ProgressPhase[];
  totals: { checked: number; total: number; pct: number };
}

const PHASE_HEADING = /^##+\s+(P\d+(?:\.\d+)?)\s*[—-]?\s*(.+)$/;
const ITEM = /^[ \t]*-\s+\[( |x|X)\]\s+(.+)$/;

export async function readProgressFull(): Promise<ProgressFullReport> {
  let raw = '';
  try { raw = await readFile(paths.progress, 'utf8'); }
  catch { return { phases: [], totals: { checked: 0, total: 0, pct: 0 } }; }

  const lines = raw.split(/\r?\n/);
  const phases: ProgressPhase[] = [];
  let currentPhase: ProgressPhase | null = null;
  let currentSub: ProgressSubsection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = line.match(PHASE_HEADING);
    if (heading) {
      const id = heading[1];
      const title = heading[2].trim();
      // Top-level phase: P0, P1, ... P9 (no decimal)
      if (/^P\d+$/.test(id)) {
        currentPhase = { id, title, subsections: [], checked: 0, total: 0, pct: 0 };
        phases.push(currentPhase);
        currentSub = null;
        continue;
      }
      // Sub-phase: P0.0, P9.2, etc.
      if (/^P\d+\.\d+$/.test(id)) {
        // Auto-create parent phase if not seen
        const parentId = id.split('.')[0];
        if (!currentPhase || currentPhase.id !== parentId) {
          let parent = phases.find((p) => p.id === parentId);
          if (!parent) {
            parent = { id: parentId, title: parentId, subsections: [], checked: 0, total: 0, pct: 0 };
            phases.push(parent);
          }
          currentPhase = parent;
        }
        currentSub = { id, title, items: [], checked: 0, total: 0, pct: 0 };
        currentPhase.subsections.push(currentSub);
        continue;
      }
    }

    const itemMatch = line.match(ITEM);
    if (itemMatch && currentPhase) {
      const checked = itemMatch[1].toLowerCase() === 'x';
      const text = itemMatch[2].trim();
      const item: ProgressItem = { text, checked, line: i + 1 };
      // Items between phase heading and first sub go into a synthetic "main" sub
      if (!currentSub) {
        currentSub = { id: `${currentPhase.id}.main`, title: 'Main items', items: [], checked: 0, total: 0, pct: 0 };
        currentPhase.subsections.push(currentSub);
      }
      currentSub.items.push(item);
    }
  }

  // Compute totals
  let grandChecked = 0, grandTotal = 0;
  for (const phase of phases) {
    for (const sub of phase.subsections) {
      sub.checked = sub.items.filter((i) => i.checked).length;
      sub.total = sub.items.length;
      sub.pct = sub.total > 0 ? sub.checked / sub.total : 0;
      phase.checked += sub.checked;
      phase.total += sub.total;
    }
    phase.pct = phase.total > 0 ? phase.checked / phase.total : 0;
    grandChecked += phase.checked;
    grandTotal += phase.total;
  }

  return {
    phases,
    totals: {
      checked: grandChecked,
      total: grandTotal,
      pct: grandTotal > 0 ? grandChecked / grandTotal : 0,
    },
  };
}
