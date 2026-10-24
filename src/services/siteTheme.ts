import type { Theme } from '../models/palette';

export function siteThemeVariables(theme: Theme | undefined): Record<string, string> {
  if (!theme) return {};
  return Object.fromEntries(
    Object.entries(theme).map(([token, color]) => [`--theme-${token}`, color]),
  );
}
