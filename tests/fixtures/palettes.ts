import { draftPalettes } from '../../src/data/draft-palettes';
import { palettes } from '../../src/data/palettes';
import type { DraftEntry, PublicationEntry } from '../../src/models/palette';

const source = palettes[0];
if (!source) throw new Error('The initial curated palette is missing.');

export const warmFixture: PublicationEntry = {
  ...source,
  id: 'fixture-warm',
  name: 'Warm fixture',
  number: '901',
};
export const coolFixture: PublicationEntry = {
  ...source,
  id: 'fixture-cool',
  name: 'Cool fixture',
  number: '902',
  english: 'Isolated transition fixture',
  category: 'landscapes',
  artDirection: 'A testing fixture, not a published or generated cultural artwork.',
  artwork: { ...source.artwork, src: source.artwork.original, caption: '过渡测试样例' },
  theme: {
    background: '#E6EEF0',
    surface: '#F7FAFB',
    'surface-alt': '#D7E2E6',
    text: '#203C4B',
    'text-muted': '#496777',
    border: '#9CB8C4',
    primary: '#234A5E',
    'primary-hover': '#143344',
    'on-primary': '#FAFDFC',
    accent: '#85482F',
    'on-accent': '#FFFAF2',
    focus: '#234A5E',
  },
};

const sourceDraft = draftPalettes[0];
if (!sourceDraft) throw new Error('The draft concept collection is missing.');

export const draftFixture: DraftEntry = {
  ...sourceDraft,
  id: 'fixture-draft',
  name: 'Draft fixture',
  number: '903',
};
