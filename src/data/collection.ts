import type { CollectionEntry } from '../models/palette';
import { draftPalettes } from './draft-palettes';
import { palettes } from './palettes';

export const collection: CollectionEntry[] = [...palettes, ...draftPalettes];
