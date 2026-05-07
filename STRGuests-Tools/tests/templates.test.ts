import { describe, it, expect } from 'vitest';
import templatesData from '@/data/templates.json';

interface TemplateEntry {
  name: string;
  category: string;
  scenario: string;
  exampleInput: string;
  exampleOutput: string;
  lastVerified: string;
}

interface TemplatesFile {
  categories: string[];
  templates: Record<string, TemplateEntry>;
}

const data = templatesData as unknown as TemplatesFile;

const REQUIRED: Array<keyof TemplateEntry> = [
  'name', 'category', 'scenario', 'exampleInput', 'exampleOutput', 'lastVerified',
];

describe('templates.json', () => {
  it('declares the 10 spec categories', () => {
    expect(data.categories).toEqual([
      'pre-arrival',
      'check-in',
      'mid-stay',
      'check-out',
      'post-checkout',
      'problem-resolution',
      'review-request',
      'repeat-guest',
      'cancellation',
      'special-occasion',
    ]);
  });

  it('every entry has all required fields, non-empty', () => {
    for (const [key, entry] of Object.entries(data.templates)) {
      for (const field of REQUIRED) {
        expect(typeof entry[field], `${key}.${field} type`).toBe('string');
        expect((entry[field] as string).trim().length, `${key}.${field} non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it('every entry references a declared category', () => {
    const set = new Set(data.categories);
    for (const [key, entry] of Object.entries(data.templates)) {
      expect(set.has(entry.category), `${key} → ${entry.category}`).toBe(true);
    }
  });

  it('every key is kebab-case', () => {
    const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    for (const key of Object.keys(data.templates)) {
      expect(re.test(key), `${key}`).toBe(true);
    }
  });

  it('every lastVerified is a valid YYYY-MM-DD', () => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    for (const [key, entry] of Object.entries(data.templates)) {
      expect(re.test(entry.lastVerified), `${key}`).toBe(true);
      const d = new Date(entry.lastVerified + 'T00:00:00Z');
      expect(Number.isNaN(d.getTime()), `${key}`).toBe(false);
    }
  });

  it('exampleOutput is at least 60 characters (real template, not placeholder)', () => {
    for (const [key, entry] of Object.entries(data.templates)) {
      expect(entry.exampleOutput.length, `${key}`).toBeGreaterThanOrEqual(60);
    }
  });
});
