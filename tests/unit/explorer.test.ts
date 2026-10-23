import { describe, expect, it } from 'vitest';
import { palettes } from '../../src/data/palettes';
import { selectPalettes } from '../../src/viewmodels/explorer';

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
