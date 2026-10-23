import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { palettes } from '../../src/data/palettes';
import { tokenLabels } from '../../src/models/palette';
import { themeContrastChecks } from '../../src/services/colors';

describe('published palette contract', () => {
  it('keeps identifiers unique and every entry complete', () => {
    expect(palettes.length).toBeGreaterThan(0);
    expect(new Set(palettes.map((palette) => palette.id)).size).toBe(palettes.length);
    expect(new Set(palettes.map((palette) => palette.number)).size).toBe(palettes.length);
    for (const palette of palettes) {
      expect(palette.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(palette.swatches).toHaveLength(6);
      expect(Object.keys(palette.theme).sort()).toEqual(Object.keys(tokenLabels).sort());
      expect(palette.distribution.reduce((sum, item) => sum + item.percentage, 0)).toBe(100);
      expect(themeContrastChecks(palette.theme).every((check) => check.passes)).toBe(true);
      expect(palette.artDirection.trim().length).toBeGreaterThan(0);
      expect(palette.artwork.caption.trim().length).toBeGreaterThan(0);
      expect(existsSync(`public${palette.artwork.src}`)).toBe(true);
      expect(existsSync(`public${palette.artwork.original}`)).toBe(true);
      expect(existsSync(`content/${palette.id}/prompt.txt`)).toBe(true);
      expect(existsSync(`content/${palette.id}/extraction.json`)).toBe(true);
    }
  });
});
