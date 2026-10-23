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
