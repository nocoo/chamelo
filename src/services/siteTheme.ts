import type { Palette } from '../models/palette';

export function siteThemeVariables(palette: Palette | undefined): Record<string, string> {
  if (!palette) return {};
  return Object.fromEntries(
    Object.entries(palette.theme).map(([token, color]) => [`--theme-${token}`, color]),
  );
}
