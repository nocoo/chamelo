export const colorFormats = ['hex', 'rgb', 'hsl', 'oklch'] as const;

export type ColorFormat = (typeof colorFormats)[number];

export const categories = [
  { id: 'all', label: '全部意象', english: 'The collection' },
  { id: 'murals', label: '壁画与石窟', english: 'Murals & grottoes' },
  { id: 'landscapes', label: '山水与四时', english: 'Land & seasons' },
  { id: 'objects', label: '器物与日常', english: 'Objects & rituals' },
  { id: 'poetry', label: '诗词与梦境', english: 'Poetry & dreams' },
] as const;

export type Category = (typeof categories)[number]['id'];

export const tokenLabels = {
  background: '页面背景',
  surface: '内容表面',
  'surface-alt': '次级表面',
  text: '正文文字',
  'text-muted': '次级文字',
  border: '装饰分隔',
  primary: '主要操作',
  'primary-hover': '悬停状态',
  'on-primary': '主色上文字',
  accent: '点睛强调',
  'on-accent': '强调色上文字',
  focus: '焦点轮廓',
} as const;

export type ThemeToken = keyof typeof tokenLabels;
export type Theme = Record<ThemeToken, string>;

export type CollectionEntry = Palette | PaletteDraft;

export interface PaletteSwatch {
  id: string;
  name: string;
  english: string;
  hex: string;
  role: string;
}

interface CollectionEntryFields {
  id: string;
  number: string;
  name: string;
  english: string;
  category: Exclude<Category, 'all'>;
  description: string;
  tags: string[];
}

export interface PaletteDraft extends CollectionEntryFields {
  status: 'todo';
  direction: { primary: string; secondary: string; accent: string };
}
export interface Palette extends CollectionEntryFields {
  status: 'published';
  story: string;
  artDirection: string;
  artwork: {
    src: string;
    original: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
  provenance: {
    model: string;
    generatedAt: string;
    extraction: string;
  };
  swatches: PaletteSwatch[];
  theme: Theme;
  distribution: {
    label: string;
    percentage: number;
    color: string;
    description: string;
  }[];
}
