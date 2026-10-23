import { describe, expect, it } from 'vitest';
import {
  activeEntry,
  adjacentEntry,
  selectEntries,
  themeEntry,
} from '../../src/viewmodels/explorer';
import { coolFixture, draftFixture, warmFixture } from '../fixtures/palettes';

const entries = [warmFixture];

describe('selectEntries', () => {
  it('shows the complete collection without a search', () => {
    expect(selectEntries(entries, 'all', '')).toEqual(entries);
    expect(selectEntries([], 'all', '')).toEqual([]);
  });

  it('filters by the cultural category', () => {
    expect(selectEntries(entries, 'murals', '')).toEqual(entries);
    expect(selectEntries(entries, 'landscapes', '')).toEqual([]);
  });

  it('searches names, English names and tags without case or boundary whitespace', () => {
    for (const query of [' 敦煌 ', ' DUNHUANG ', '石青', '温润']) {
      expect(selectEntries(entries, 'all', query)).toEqual(entries);
    }
    expect(selectEntries(entries, 'all', '天青色')).toEqual([]);
  });

  it('combines category and search instead of broadening either', () => {
    expect(selectEntries(entries, 'murals', '石青')).toEqual(entries);
    expect(selectEntries(entries, 'objects', '石青')).toEqual([]);
  });

  it('searches draft concepts by their imagery and tags', () => {
    const drafts = [draftFixture];
    expect(selectEntries(drafts, 'all', draftFixture.name)).toEqual(drafts);
    expect(selectEntries(drafts, 'all', draftFixture.tags[0] ?? '')).toEqual(drafts);
  });
});

describe('single featured entry selection', () => {
  const collection = [warmFixture, draftFixture, coolFixture];

  it('keeps a selection or picks the first visible match', () => {
    expect(activeEntry(collection, coolFixture.id)).toBe(coolFixture);
    expect(activeEntry(collection, draftFixture.id)).toBe(draftFixture);
    expect(activeEntry(collection, null)).toBe(warmFixture);
    expect(activeEntry([warmFixture], coolFixture.id)).toBe(warmFixture);
    expect(activeEntry([], null)).toBeUndefined();
  });

  it('cycles in both directions without adding another feature card', () => {
    expect(adjacentEntry(collection, warmFixture.id, 1)).toBe(draftFixture.id);
    expect(adjacentEntry(collection, draftFixture.id, 1)).toBe(coolFixture.id);
    expect(adjacentEntry(collection, warmFixture.id, -1)).toBe(coolFixture.id);
    expect(adjacentEntry(collection, 'missing', 1)).toBe(draftFixture.id);
    expect(adjacentEntry([], null, 1)).toBeNull();
  });
});

describe('theme source for the surrounding site', () => {
  it('uses the selected entry when it carries a published theme', () => {
    expect(themeEntry([warmFixture, draftFixture], warmFixture)).toBe(warmFixture);
  });

  it('falls back to the first published palette for a draft selection', () => {
    expect(themeEntry([draftFixture, coolFixture], draftFixture)).toBe(coolFixture);
  });

  it('returns nothing when the collection has no published palette', () => {
    expect(themeEntry([draftFixture], draftFixture)).toBeUndefined();
    expect(themeEntry([], undefined)).toBeUndefined();
  });
});
