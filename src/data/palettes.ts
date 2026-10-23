import type { Palette } from '../models/palette';

export const palettes: Palette[] = [
  {
    id: 'dunhuang-huacai',
    number: '001',
    name: '敦煌华彩',
    english: 'Dunhuang, in colour',
    category: 'murals',
    status: 'published',
    description: '一缕石青，半壁流金。让千年的风，吹进当下的界面。',
    story:
      '灵感来自敦煌壁画的矿物颜料、飞天衣带与暮光中的砂岩。以温润的砂白留出呼吸，用沉静的石青建立秩序，再以少量丹砂唤起生命力。原图为 AI 创作的当代意象，并非真实石窟或历史壁画的记录。',
    artDirection:
      'Create a contemporary Dunhuang-inspired visual language: mineral-pigment color, restrained mural-like ornament, tactile references to aged plaster, silk, carved stone, and carefully controlled metallic accents. Keep ornament deliberate and legible; let the supplied story and colors determine the motif rather than stock cultural clichés.',
    tags: ['敦煌', '壁画', '矿物色', '温润', '石青', '朱砂'],
    artwork: {
      src: '/artworks/dunhuang-huacai/artwork.webp',
      original: '/artworks/dunhuang-huacai/original.png',
      alt: '敦煌意象：石青与朱砂色的飞天衣带掠过斑驳石壁，远方沙丘沐浴在金色暮光中。',
      width: 1536,
      height: 1024,
      caption: '一缕石青，半壁流金',
    },
    provenance: {
      model: 'gpt-image-2.5-sunburst',
      generatedAt: '2026-10-24',
      extraction:
        'sRGB median-cut + OKLCH chromatic sampling; curated semantic lightness adjustments',
    },
    swatches: [
      { id: 'paper', name: '砂白', english: 'Sand silk', hex: '#F3EBDD', role: '页面基底 · 留白' },
      {
        id: 'sand',
        name: '暖砂',
        english: 'Warm sandstone',
        hex: '#E7C8A0',
        role: '次级表面 · 氛围',
      },
      {
        id: 'gold',
        name: '流金',
        english: 'Desert gold',
        hex: '#BD985D',
        role: '装饰细节 · 低频点缀',
      },
      {
        id: 'sage',
        name: '石绿',
        english: 'Mineral sage',
        hex: '#5D705E',
        role: '辅助色 · 图形层次',
      },
      {
        id: 'teal',
        name: '石青',
        english: 'Grotto teal',
        hex: '#2E4640',
        role: '品牌主色 · 主要操作',
      },
      {
        id: 'cinnabar',
        name: '丹砂',
        english: 'Quiet cinnabar',
        hex: '#9C513B',
        role: '强调色 · 少量使用',
      },
    ],
    theme: {
      background: '#F3EBDD',
      surface: '#FFFCF6',
      'surface-alt': '#EADBC4',
      text: '#23302E',
      'text-muted': '#71604B',
      border: '#CEC1AD',
      primary: '#2E4640',
      'primary-hover': '#213832',
      'on-primary': '#FFFCF6',
      accent: '#9C513B',
      'on-accent': '#FFFCF6',
      focus: '#9C513B',
    },
    distribution: [
      {
        label: '温润基底',
        percentage: 60,
        color: '#F3EBDD',
        description: '砂白与暖砂，用于背景、表面与留白。',
      },
      {
        label: '沉静主色',
        percentage: 30,
        color: '#2E4640',
        description: '石青与石绿，建立品牌、文字和交互层级。',
      },
      {
        label: '克制点睛',
        percentage: 10,
        color: '#9C513B',
        description: '丹砂与流金，只在关键位置出现。',
      },
    ],
  },
];
