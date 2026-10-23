import { describe, expect, it } from 'vitest';
import { siteThemeVariables } from '../../src/services/siteTheme';
import { coolFixture, warmFixture } from '../fixtures/palettes';

describe('site theme follows the selected palette', () => {
  it('maps every semantic role without changing the exported values', () => {
    for (const palette of [warmFixture, coolFixture]) {
      const variables = siteThemeVariables(palette);
      expect(Object.keys(variables)).toHaveLength(12);
      for (const [role, value] of Object.entries(palette.theme)) {
        expect(variables[`--theme-${role}`]).toBe(value);
      }
    }
    expect(siteThemeVariables(warmFixture)).not.toEqual(siteThemeVariables(coolFixture));
  });

  it('leaves neutral CSS defaults available without a selection', () => {
    expect(siteThemeVariables(undefined)).toEqual({});
  });
});
