import { describe, expect, it } from 'vitest';
import { palettes } from '../../src/data/palettes';
import { tokenLabels } from '../../src/models/palette';
import { oppositeMode, resolveTheme } from '../../src/services/appearance';
import { contrastRatio, themeContrastChecks } from '../../src/services/colors';

describe('appearance modes', () => {
  it('flips between the two surface modes', () => {
    expect(oppositeMode('light')).toBe('dark');
    expect(oppositeMode('dark')).toBe('light');
  });

  it('keeps the curated tokens untouched for the authored mode', () => {
    for (const palette of palettes) {
      expect(resolveTheme(palette, palette.mode)).toBe(palette.theme);
    }
  });

  it('derives the opposite mode for every palette with complete, passing tokens', () => {
    for (const palette of palettes) {
      const mode = oppositeMode(palette.mode);
      const theme = resolveTheme(palette, mode);

      expect(Object.keys(theme).sort()).toEqual(Object.keys(tokenLabels).sort());
      expect(themeContrastChecks(theme).every((check) => check.passes)).toBe(true);

      const leansDark =
        contrastRatio('#FFFFFF', theme.background) > contrastRatio('#000000', theme.background);
      expect(leansDark).toBe(mode === 'dark');
    }
  });

  it('stays deterministic so the same palette always resolves the same way', () => {
    for (const palette of palettes) {
      const mode = oppositeMode(palette.mode);
      expect(resolveTheme(palette, mode)).toEqual(resolveTheme(palette, mode));
    }
  });

  it('keeps the page ground distinct from the surface it carries', () => {
    for (const palette of palettes) {
      const theme = resolveTheme(palette, oppositeMode(palette.mode));
      expect(theme.primary).not.toBe(theme.background);
      expect(theme.primary).not.toBe(theme.accent);
      expect(theme.surface).not.toBe(theme.background);
    }
  });
});
