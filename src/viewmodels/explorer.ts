import type { Category, CollectionEntry, Palette } from '../models/palette';

export function selectEntries(
  entries: CollectionEntry[],
  category: Category,
  query: string,
): CollectionEntry[] {
  const normalized = query.trim().toLocaleLowerCase();
  return entries.filter((entry) => {
    const inCategory = category === 'all' || entry.category === category;
    const searchable = [entry.name, entry.english, entry.description, ...entry.tags]
      .join(' ')
      .toLocaleLowerCase();
    return inCategory && searchable.includes(normalized);
  });
}

export function activeEntry(
  entries: CollectionEntry[],
  selectedId: string | null,
): CollectionEntry | undefined {
  return entries.find((entry) => entry.id === selectedId) ?? entries[0];
}

export function adjacentEntry(
  entries: CollectionEntry[],
  selectedId: string | null,
  step: -1 | 1,
): string | null {
  if (!entries.length) return null;
  const index = Math.max(
    0,
    entries.findIndex((entry) => entry.id === selectedId),
  );
  return entries[(index + step + entries.length) % entries.length]?.id ?? null;
}

export function themeEntry(
  entries: CollectionEntry[],
  active: CollectionEntry | undefined,
): Palette | undefined {
  if (active?.status === 'published') return active;
  return entries.find((entry): entry is Palette => entry.status === 'published');
}
