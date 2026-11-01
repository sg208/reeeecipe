import { describe, it, expect } from 'vitest';
import { createSlug } from '~/utils/slugify';

describe('createSlug', () => {
  it('lowercases and hyphenates words', () => {
    expect(createSlug('Classic Margherita Pizza')).toBe(
      'classic-margherita-pizza'
    );
  });

  it('strips diacritics', () => {
    expect(createSlug('Crème Brûlée à la Niçoise')).toBe(
      'creme-brulee-a-la-nicoise'
    );
  });

  it('removes punctuation and collapses repeated hyphens', () => {
    expect(createSlug("Mom's  Best -- Chili!!")).toBe('moms-best-chili');
  });

  it('trims leading and trailing whitespace and hyphens', () => {
    expect(createSlug('  --Hello World--  ')).toBe('hello-world');
  });

  it('returns an empty string for symbol-only input', () => {
    expect(createSlug('!!!')).toBe('');
  });
});
