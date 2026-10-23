import type { Category, Palette } from '../models/palette';

export function selectPalettes(palettes: Palette[], category: Category, query: string): Palette[] {
  const normalized = query.trim().toLocaleLowerCase();
  return palettes.filter((palette) => {
    const inCategory = category === 'all' || palette.category === category;
    const searchable = [palette.name, palette.english, palette.description, ...palette.tags]
      .join(' ')
      .toLocaleLowerCase();
    return inCategory && searchable.includes(normalized);
  });
}

export function activePalette(palettes: Palette[], selectedId: string | null): Palette | undefined {
  return palettes.find((palette) => palette.id === selectedId) ?? palettes[0];
}

export function adjacentPalette(
  palettes: Palette[],
  selectedId: string | null,
  step: -1 | 1,
): string | null {
  if (!palettes.length) return null;
  const index = Math.max(
    0,
    palettes.findIndex((palette) => palette.id === selectedId),
  );
  return palettes[(index + step + palettes.length) % palettes.length]?.id ?? null;
}
