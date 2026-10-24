import { converter, formatHex, interpolate, wcagLuminance } from 'culori';
import type { Palette, PaletteMode, Theme } from '../models/palette';
import { contrastRatio } from './colors';

const toOklch = converter('oklch');

const NEAR_BLACK = '#0B0A09';
const NEAR_WHITE = '#FBF8F1';
const TEXT_MINIMUM = 4.6;
const FOCUS_MINIMUM = 3.1;

interface Oklch {
  l: number;
  c: number;
  h: number;
}

function channels(hex: string): Oklch {
  const parsed = toOklch(hex) as { l: number; c: number; h?: number };
  return { l: parsed.l, c: parsed.c, h: parsed.h ?? Number.NaN };
}

function hexOf(color: Oklch): string {
  return formatHex({
    mode: 'oklch',
    l: Math.min(Math.max(color.l, 0), 1),
    c: Math.max(color.c, 0),
    h: color.h,
  });
}

function mix(from: string, to: string, amount: number): string {
  return formatHex(interpolate([from, to], 'oklab')(amount));
}

function ensureContrast(color: string, against: string, minimum: number): string {
  const base = channels(color);
  const direction = wcagLuminance(against) < 0.18 ? 1 : -1;
  let candidate = color;
  for (let step = 0; step <= 110; step += 1) {
    candidate = hexOf({ ...base, l: base.l + direction * step * 0.008 });
    if (contrastRatio(candidate, against) >= minimum) return candidate;
  }
  return candidate;
}

function readableOn(background: string): string {
  return contrastRatio(background, NEAR_BLACK) >= contrastRatio(background, NEAR_WHITE)
    ? NEAR_BLACK
    : NEAR_WHITE;
}

function brandPair(palette: Palette): { brand: string; counter: string } {
  let brand = palette.theme.primary;
  let counter = palette.theme.accent;
  let best = -1;
  let second = -1;
  for (const swatch of palette.swatches) {
    const chroma = channels(swatch.hex).c;
    if (chroma > best) {
      second = best;
      counter = brand;
      best = chroma;
      brand = swatch.hex;
    } else if (chroma > second) {
      second = chroma;
      counter = swatch.hex;
    }
  }
  return { brand, counter };
}

function extremes(palette: Palette): { darkest: string; lightest: string } {
  return palette.swatches.reduce(
    (found, swatch) => {
      const luminance = wcagLuminance(swatch.hex);
      return {
        darkest: luminance < wcagLuminance(found.darkest) ? swatch.hex : found.darkest,
        lightest: luminance > wcagLuminance(found.lightest) ? swatch.hex : found.lightest,
      };
    },
    { darkest: palette.theme.background, lightest: palette.theme.background },
  );
}

function darkTheme(palette: Palette): Theme {
  const { darkest, lightest } = extremes(palette);
  const { brand, counter } = brandPair(palette);

  const background = mix(darkest, NEAR_BLACK, 0.45);
  const surface = mix(background, NEAR_WHITE, 0.06);
  const text = ensureContrast(mix(lightest, NEAR_WHITE, 0.2), surface, TEXT_MINIMUM);
  const primary = ensureContrast(brand, NEAR_BLACK, TEXT_MINIMUM);
  const onPrimary = readableOn(primary);
  const accent = ensureContrast(counter, background, TEXT_MINIMUM);

  return {
    background,
    surface,
    'surface-alt': mix(background, NEAR_WHITE, 0.12),
    text,
    'text-muted': ensureContrast(mix(text, background, 0.42), surface, TEXT_MINIMUM),
    border: mix(background, text, 0.22),
    primary,
    'primary-hover': ensureContrast(
      hexOf({ ...channels(primary), l: channels(primary).l + 0.05 }),
      onPrimary,
      TEXT_MINIMUM,
    ),
    'on-primary': onPrimary,
    accent,
    'on-accent': readableOn(accent),
    focus: ensureContrast(primary, background, FOCUS_MINIMUM),
  };
}

function lightTheme(palette: Palette): Theme {
  const { darkest, lightest } = extremes(palette);
  const { brand, counter } = brandPair(palette);

  const background = mix(lightest, NEAR_WHITE, 0.72);
  const text = ensureContrast(mix(darkest, NEAR_BLACK, 0.2), background, TEXT_MINIMUM);
  const primary = ensureContrast(brand, background, TEXT_MINIMUM);
  const onPrimary = readableOn(primary);
  const accent = ensureContrast(counter, background, TEXT_MINIMUM);

  return {
    background,
    surface: mix(lightest, NEAR_WHITE, 0.9),
    'surface-alt': mix(lightest, NEAR_WHITE, 0.4),
    text,
    'text-muted': ensureContrast(mix(text, background, 0.34), background, TEXT_MINIMUM),
    border: mix(background, text, 0.18),
    primary,
    'primary-hover': ensureContrast(
      hexOf({ ...channels(primary), l: channels(primary).l - 0.05 }),
      onPrimary,
      TEXT_MINIMUM,
    ),
    'on-primary': onPrimary,
    accent,
    'on-accent': readableOn(accent),
    focus: ensureContrast(primary, background, FOCUS_MINIMUM),
  };
}

export function oppositeMode(mode: PaletteMode): PaletteMode {
  return mode === 'dark' ? 'light' : 'dark';
}

export function resolveTheme(palette: Palette, mode: PaletteMode): Theme {
  if (mode === palette.mode) return palette.theme;
  return mode === 'dark' ? darkTheme(palette) : lightTheme(palette);
}
