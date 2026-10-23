import { describe, expect, it } from 'vitest';
import type { ColorFormat, Theme } from '../../src/models/palette';
import {
  contrastRatio,
  foregroundFor,
  formatColor,
  themeContrastChecks,
} from '../../src/services/colors';

const theme: Theme = {
  background: '#FFFFFF',
  surface: '#F5F0E4',
  'surface-alt': '#E8DFCC',
  text: '#172B28',
  'text-muted': '#777777',
  border: '#C9BDA4',
  primary: '#123456',
  'primary-hover': '#FFFFFF',
  'on-primary': '#FFFFFF',
  accent: '#123456',
  'on-accent': '#FFFFFF',
  focus: '#172B28',
};

describe('formatColor', () => {
  it('formats a valid hex color in every supported color space', () => {
    const hex = '#7A2E45';

    expect(formatColor(hex, 'hex')).toBe('#7A2E45');
    expect(formatColor(hex, 'rgb')).toBe('rgb(122, 46, 69)');
    expect(formatColor(hex, 'hsl')).toBe('hsl(341.8, 45.2%, 32.9%)');
    expect(formatColor(hex, 'oklch')).toBe('oklch(41.65% 0.1082 4.21)');
  });

  it('normalizes mixed-case hex and gives achromatic colors a zero hue', () => {
    expect(formatColor('#aBcDeF', 'hex')).toBe('#ABCDEF');
    expect(formatColor('#808080', 'hsl')).toBe('hsl(0.0, 0.0%, 50.2%)');
    expect(formatColor('#808080', 'oklch')).toBe('oklch(59.99% 0.0000 0.00)');
  });

  it.each(['fff', '#fff', '#12345678', '123456', '#gg0000'])('rejects invalid hex %s', (hex) => {
    expect(() => formatColor(hex, 'hex')).toThrow(/#RRGGBB/);
  });

  it('rejects non-string values and unsupported formats', () => {
    expect(() => formatColor(42 as unknown as string, 'hex')).toThrow(/#RRGGBB/);
    expect(() => formatColor('#123456', 'hsv' as ColorFormat)).toThrow(/Unsupported color format/);
  });
});

describe('contrast helpers', () => {
  it('uses Culori WCAG contrast for valid hex colors', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBe(21);
    expect(contrastRatio('#FFFFFF', '#000000')).toBe(21);
  });

  it('rejects invalid contrast inputs', () => {
    expect(() => contrastRatio('white', '#FFFFFF')).toThrow(/#RRGGBB/);
    expect(() => contrastRatio('#FFFFFF', '#FFFF')).toThrow(/#RRGGBB/);
    expect(() => foregroundFor('transparent')).toThrow(/#RRGGBB/);
  });

  it('chooses the higher-contrast foreground color', () => {
    expect(foregroundFor('#000000')).toBe('#FFFFFF');
    expect(foregroundFor('#FFFFFF')).toBe('#172B28');
  });

  it('checks the required theme pairs in order with their respective thresholds', () => {
    const checks = themeContrastChecks(theme);

    expect(checks.map(({ label }) => label)).toEqual([
      'text/background',
      'text/surface',
      'text-muted/background',
      'text-muted/surface',
      'on-primary/primary',
      'on-primary/primary-hover',
      'on-accent/accent',
      'focus/background',
      'focus/surface',
    ]);
    expect(checks).toHaveLength(9);
    expect(checks[0]).toMatchObject({
      foreground: theme.text,
      background: theme.background,
      passes: true,
    });
    expect(checks[2]).toMatchObject({ passes: false });
    expect(checks[5]).toMatchObject({ passes: false });
    expect(checks[7]).toMatchObject({ passes: true });
    expect(checks[0]?.ratio).toBeCloseTo(contrastRatio(theme.text, theme.background));
  });
});
