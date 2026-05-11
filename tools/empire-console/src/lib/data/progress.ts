import { readFile } from 'node:fs/promises';
import { paths } from '../paths.js';

export interface ProgressItem {
  section: string;
  text: string;
  line: number;
}

export interface ProgressSummary {
  totalChecked: number;
  totalUnchecked: number;
  nextActions: ProgressItem[];
  lastReviewed: string | null;
}

const SECTION_RE = /^#{1,6}\s+(P\d+(?:\.\d+)?(?:\s+[—-]\s+[^\n]+)?)/;
const ITEM_RE = /^[ \t]*-\s+\[( |x|X)\]\s+(.+)$/;
const LAST_REVIEWED_RE = /Last reviewed:\*\*\s+([\d-]+)/;

export async function readProgress(): Promise<ProgressSummary> {
  let raw: string;
  try {
    raw = await readFile(paths.progress, 'utf8');
  } catch {
    return { totalChecked: 0, totalUnchecked: 0, nextActions: [], lastReviewed: null };
  }

  const lines = raw.split(/\r?\n/);
  let currentSection = '';
  let totalChecked = 0;
  let totalUnchecked = 0;
  const nextActions: ProgressItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sectionMatch = line.match(SECTION_RE);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }
    const itemMatch = line.match(ITEM_RE);
    if (itemMatch) {
      const checked = itemMatch[1].toLowerCase() === 'x';
      if (checked) {
        totalChecked++;
      } else {
        totalUnchecked++;
        // collect the first 5 unchecked items in P0/P0.0/P0.5 sections
        if (
          nextActions.length < 5 &&
          /^P0(\.\d+)?(\s|$)/.test(currentSection)
        ) {
          nextActions.push({ section: currentSection, text: itemMatch[2].trim(), line: i + 1 });
        }
      }
    }
  }

  const lastReviewedMatch = raw.match(LAST_REVIEWED_RE);
  return {
    totalChecked,
    totalUnchecked,
    nextActions,
    lastReviewed: lastReviewedMatch ? lastReviewedMatch[1] : null,
  };
}
