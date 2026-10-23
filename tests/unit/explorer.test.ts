import { describe, expect, it } from 'vitest';
import { activePalette, adjacentPalette, selectPalettes } from '../../src/viewmodels/explorer';
import { coolFixture, warmFixture } from '../fixtures/palettes';

const palettes = [warmFixture];

describe('selectPalettes', () => {
  it('shows the complete collection without a search', () => {
    expect(selectPalettes(palettes, 'all', '')).toEqual(palettes);
    expect(selectPalettes([], 'all', '')).toEqual([]);
  });

  it('filters by the cultural category', () => {
    expect(selectPalettes(palettes, 'murals', '')).toEqual(palettes);
    expect(selectPalettes(palettes, 'landscapes', '')).toEqual([]);
  });

  it('searches names, English names and tags without case or boundary whitespace', () => {
    for (const query of [' 敦煌 ', ' DUNHUANG ', '石青', '温润']) {
      expect(selectPalettes(palettes, 'all', query)).toEqual(palettes);
    }
    expect(selectPalettes(palettes, 'all', '天青色')).toEqual([]);
  });

  it('combines category and search instead of broadening either', () => {
    expect(selectPalettes(palettes, 'murals', '石青')).toEqual(palettes);
    expect(selectPalettes(palettes, 'objects', '石青')).toEqual([]);
  });
});

describe('single featured palette selection', () => {
  const collection = [warmFixture, coolFixture];

  it('keeps a selection or picks the first visible match', () => {
    expect(activePalette(collection, coolFixture.id)).toBe(coolFixture);
    expect(activePalette(collection, null)).toBe(warmFixture);
    expect(activePalette([warmFixture], coolFixture.id)).toBe(warmFixture);
    expect(activePalette([], null)).toBeUndefined();
  });

  it('cycles in both directions without adding another feature card', () => {
    expect(adjacentPalette(collection, warmFixture.id, 1)).toBe(coolFixture.id);
    expect(adjacentPalette(collection, coolFixture.id, 1)).toBe(warmFixture.id);
    expect(adjacentPalette(collection, warmFixture.id, -1)).toBe(coolFixture.id);
    expect(adjacentPalette(collection, 'missing', 1)).toBe(coolFixture.id);
    expect(adjacentPalette([], null, 1)).toBeNull();
  });
});
