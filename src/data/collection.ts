import type { CatalogEntry, CollectionEntry } from '../models/palette';
import { draftPalettes } from './draft-palettes';
import { palettes } from './palettes';

export function buildCatalog(entries: CollectionEntry[]): CatalogEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    number: String(index + 1).padStart(3, '0'),
  }));
}

export const collection = buildCatalog(
  import.meta.env.DEV ? [...palettes, ...draftPalettes] : palettes,
);
