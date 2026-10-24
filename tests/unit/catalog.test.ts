import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildCatalog, collection } from '../../src/data/collection';
import { draftPalettes } from '../../src/data/draft-palettes';
import { palettes } from '../../src/data/palettes';
import { traditionalColours } from '../../src/data/traditional-colours';
import { categories, tokenLabels } from '../../src/models/palette';
import { contrastRatio, themeContrastChecks } from '../../src/services/colors';

const categoryIds: string[] = categories
  .map((category) => category.id)
  .filter((id) => id !== 'all');
const vocabulary = new Set<string>(traditionalColours);

describe('published palette contract', () => {
  it('keeps identifiers unique and every entry complete', () => {
    expect(palettes.length).toBeGreaterThan(0);
    expect(new Set(palettes.map((palette) => palette.id)).size).toBe(palettes.length);
    for (const palette of palettes) {
      expect(palette.status).toBe('published');
      expect(palette.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(palette.swatches).toHaveLength(6);
      expect(Object.keys(palette.theme).sort()).toEqual(Object.keys(tokenLabels).sort());
      expect(palette.distribution.reduce((sum, item) => sum + item.percentage, 0)).toBe(100);
      expect(themeContrastChecks(palette.theme).every((check) => check.passes)).toBe(true);
      expect(palette.artDirection.trim().length).toBeGreaterThan(0);
      expect(palette.artwork.caption.trim().length).toBeGreaterThan(0);
      expect(['light', 'dark']).toContain(palette.mode);
      expect(existsSync(`public${palette.artwork.src}`)).toBe(true);
      expect(existsSync(`public${palette.artwork.original}`)).toBe(true);
      expect(existsSync(`content/${palette.id}/prompt.txt`)).toBe(true);
      expect(existsSync(`content/${palette.id}/extraction.json`)).toBe(true);
    }
  });
});

describe('palette surface modes', () => {
  it('declares a mode that matches the page background', () => {
    for (const palette of palettes) {
      const background = palette.theme.background;
      const leansDark = contrastRatio('#FFFFFF', background) > contrastRatio('#000000', background);
      expect(leansDark).toBe(palette.mode === 'dark');
      expect(palette.distribution[0]?.percentage).toBe(60);
      expect(palette.distribution[0]?.color).toBe(background);
    }
  });

  it('mixes dark and light palettes so the atlas is not one tone', () => {
    expect(new Set(palettes.map((palette) => palette.mode)).size).toBe(2);
  });
});

describe('draft concept contract', () => {
  it('keeps every concept searchable, categorised and free of colour values', () => {
    expect(draftPalettes.length).toBeGreaterThanOrEqual(50);
    for (const draft of draftPalettes) {
      expect(draft.status).toBe('todo');
      expect(draft.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(draft.name.trim().length).toBeGreaterThan(0);
      expect(draft.english.trim().length).toBeGreaterThan(0);
      expect(draft.description.trim().length).toBeGreaterThan(0);
      expect(draft.tags.length).toBeGreaterThan(0);
      expect(categoryIds).toContain(draft.category);
      expect(JSON.stringify(draft)).not.toContain('#');
    }
  });

  it('plans every colour role with a traditional Chinese colour name', () => {
    for (const draft of draftPalettes) {
      for (const name of Object.values(draft.direction)) {
        expect(vocabulary.has(name)).toBe(true);
      }
    }
  });
});

describe('collection contract', () => {
  it('numbers entries from their catalogue position', () => {
    const numbered = buildCatalog([...palettes, ...draftPalettes]);
    expect(numbered.map((entry) => entry.number)).toEqual(
      numbered.map((_, index) => String(index + 1).padStart(3, '0')),
    );
    expect(new Set(numbered.map((entry) => entry.id)).size).toBe(numbered.length);
    expect(new Set(numbered.map((entry) => entry.number)).size).toBe(numbered.length);
  });

  it('keeps unpublished concepts out of production builds', () => {
    expect(collection.slice(0, palettes.length).map((entry) => entry.id)).toEqual(
      palettes.map((palette) => palette.id),
    );
    expect(collection.length).toBe(
      import.meta.env.DEV ? palettes.length + draftPalettes.length : palettes.length,
    );
  });
});
