import { converter, formatHex, wcagContrast } from 'culori';
import type { ColorFormat, Theme, ThemeToken } from '../models/palette';

const hexColorPattern = /^#[\da-f]{6}$/i;
const toRgb = converter('rgb');
const toHsl = converter('hsl');
const toOklch = converter('oklch');

function assertHexColor(hex: string): void {
  if (typeof hex !== 'string' || !hexColorPattern.test(hex)) {
    throw new Error(`Expected a hex color in #RRGGBB format, received: ${String(hex)}`);
  }
}

function rounded(value: number, digits: number): string {
  return Number(value.toFixed(digits)).toFixed(digits);
}

export function formatColor(hex: string, format: ColorFormat): string {
  assertHexColor(hex);

  switch (format) {
    case 'hex':
      return (formatHex(hex) as string).toUpperCase();
    case 'rgb': {
      const { r, g, b } = toRgb(hex) as NonNullable<ReturnType<typeof toRgb>>;
      return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }
    case 'hsl': {
      const { h, s, l } = toHsl(hex) as NonNullable<ReturnType<typeof toHsl>>;
      return `hsl(${rounded(h ?? 0, 1)}, ${rounded(s * 100, 1)}%, ${rounded(l * 100, 1)}%)`;
    }
    case 'oklch': {
      const { h, c, l } = toOklch(hex) as NonNullable<ReturnType<typeof toOklch>>;
      return `oklch(${rounded(l * 100, 2)}% ${rounded(c, 4)} ${rounded(h ?? 0, 2)})`;
    }
    default:
      throw new Error(`Unsupported color format: ${String(format)}`);
  }
}

export function contrastRatio(first: string, second: string): number {
  assertHexColor(first);
  assertHexColor(second);
  return wcagContrast(first, second);
}

export function foregroundFor(hex: string): string {
  const white = '#FFFFFF';
  const dark = '#172B28';
  return contrastRatio(hex, white) >= contrastRatio(hex, dark) ? white : dark;
}

export function themeContrastChecks(theme: Theme): Array<{
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  passes: boolean;
}> {
  const pairs: Array<{
    label: string;
    foreground: ThemeToken;
    background: ThemeToken;
    minimum: number;
  }> = [
    { label: 'text/background', foreground: 'text', background: 'background', minimum: 4.5 },
    { label: 'text/surface', foreground: 'text', background: 'surface', minimum: 4.5 },
    {
      label: 'text-muted/background',
      foreground: 'text-muted',
      background: 'background',
      minimum: 4.5,
    },
    { label: 'text-muted/surface', foreground: 'text-muted', background: 'surface', minimum: 4.5 },
    { label: 'on-primary/primary', foreground: 'on-primary', background: 'primary', minimum: 4.5 },
    {
      label: 'on-primary/primary-hover',
      foreground: 'on-primary',
      background: 'primary-hover',
      minimum: 4.5,
    },
    { label: 'on-accent/accent', foreground: 'on-accent', background: 'accent', minimum: 4.5 },
    { label: 'focus/background', foreground: 'focus', background: 'background', minimum: 3.0 },
    { label: 'focus/surface', foreground: 'focus', background: 'surface', minimum: 3.0 },
  ];

  return pairs.map(({ label, foreground, background, minimum }) => {
    const foregroundColor = theme[foreground];
    const backgroundColor = theme[background];
    const ratio = contrastRatio(foregroundColor, backgroundColor);
    return {
      label,
      foreground: foregroundColor,
      background: backgroundColor,
      ratio,
      passes: ratio >= minimum,
    };
  });
}
