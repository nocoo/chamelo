import { describe, expect, it } from 'vitest';
import { type PublicationEntry, type ThemeToken, tokenLabels } from '../../src/models/palette';
import { formatColor } from '../../src/services/colors';
import { createAgentPrompt, createCss, paletteVariables } from '../../src/services/exports';

const palette: PublicationEntry = {
  id: 'dunhuang-evening',
  number: '017',
  name: '暮色入壁',
  english: 'Dusk on the Mural',
  category: 'murals',
  status: 'published',
  mode: 'light',
  description: '晚霞映照古老石壁。',
  story: '飞天衣袂掠过丹霞，余晖停在沉静的石窟之间。',
  artDirection: 'A Dunhuang-inspired interpretation of mineral pigments and evening light.',
  tags: ['敦煌', '壁画', '暮色'],
  artwork: {
    src: '/artworks/unavailable-dunhuang.webp',
    original: 'source-artwork-id',
    alt: '一幅描绘暮色石窟的 AI 创作示意图',
    width: 1200,
    height: 800,
    caption: '暮色入壁',
  },
  provenance: {
    model: 'illustration-model',
    generatedAt: '2026-01-01',
    extraction: 'sampled-pigments',
  },
  swatches: [
    {
      id: 'cinnabar',
      name: '丹霞',
      english: 'Cinnabar glow',
      hex: '#B64732',
      role: 'A warm focal pigment',
    },
    {
      id: 'mineral-blue',
      name: '石青',
      english: 'Mineral blue',
      hex: '#214F69',
      role: 'A quiet structural color',
    },
  ],
  theme: {
    background: '#F5F0E4',
    surface: '#FFFFFF',
    'surface-alt': '#E8DFCC',
    text: '#172B28',
    'text-muted': '#777777',
    border: '#C9BDA4',
    primary: '#214F69',
    'primary-hover': '#173B50',
    'on-primary': '#FFFFFF',
    accent: '#B64732',
    'on-accent': '#FFFFFF',
    focus: '#172B28',
  },
  distribution: [
    { label: 'Warm stone', percentage: 58, color: '#F5F0E4', description: 'The quiet foundation' },
    {
      label: 'Pigment accents',
      percentage: 42,
      color: '#B64732',
      description: 'Used with restraint',
    },
  ],
};

describe('palette exports', () => {
  it('creates complete root CSS variables from every theme token', () => {
    const css = createCss(palette);

    expect(css).toMatch(/^:root \{/);
    expect(css).toMatch(/\}$/);
    for (const [token, color] of Object.entries(palette.theme)) {
      expect(css).toContain(`--color-${token}: ${color};`);
    }
    expect(css.match(/--color-/g)).toHaveLength(Object.keys(palette.theme).length);
    expect(css).toContain('color-scheme: light;');
  });

  it('maps every theme token to a palette custom property', () => {
    expect(paletteVariables(palette)).toEqual({
      '--palette-background': '#F5F0E4',
      '--palette-surface': '#FFFFFF',
      '--palette-surface-alt': '#E8DFCC',
      '--palette-text': '#172B28',
      '--palette-text-muted': '#777777',
      '--palette-border': '#C9BDA4',
      '--palette-primary': '#214F69',
      '--palette-primary-hover': '#173B50',
      '--palette-on-primary': '#FFFFFF',
      '--palette-accent': '#B64732',
      '--palette-on-accent': '#FFFFFF',
      '--palette-focus': '#172B28',
    });
  });

  it('exports the dark surface mode for dark palettes', () => {
    const dark = { ...palette, mode: 'dark' as const };

    expect(createCss(dark)).toContain('color-scheme: dark;');
    expect(createAgentPrompt(dark)).toContain('Surface mode: dark');
    expect(createAgentPrompt(dark)).toContain('build the page on dark surfaces');
  });

  it('builds a self-contained English brief with Chinese palette context and all swatch formats', () => {
    const prompt = createAgentPrompt(palette);

    expect(prompt).toContain('Chinese title: 暮色入壁');
    expect(prompt).toContain('English title: Dusk on the Mural');
    expect(prompt).toContain('Motif/category: murals');
    expect(prompt).toContain('Surface mode: light');
    expect(prompt).toContain('晚霞映照古老石壁。');
    expect(prompt).toContain('飞天衣袂掠过丹霞，余晖停在沉静的石窟之间。');
    expect(prompt).toContain('一幅描绘暮色石窟的 AI 创作示意图');

    for (const swatch of palette.swatches) {
      expect(prompt).toContain(`${swatch.name} (${swatch.english})`);
      expect(prompt).toContain(`HEX: ${formatColor(swatch.hex, 'hex')}`);
      expect(prompt).toContain(`RGB: ${formatColor(swatch.hex, 'rgb')}`);
      expect(prompt).toContain(`HSL: ${formatColor(swatch.hex, 'hsl')}`);
      expect(prompt).toContain(`OKLCH: ${formatColor(swatch.hex, 'oklch')}`);
      expect(prompt).toContain(swatch.role);
    }
  });

  it('includes every semantic token, distribution, design direction, and asset/accessibility cautions', () => {
    const prompt = createAgentPrompt(palette);

    for (const [token, color] of Object.entries(palette.theme)) {
      const key = token as ThemeToken;
      expect(prompt).toContain(`- ${token} (${tokenLabels[key]}): ${formatColor(color, 'hex')}`);
    }
    for (const item of palette.distribution) {
      expect(prompt).toContain(
        `${item.label}: ${item.percentage}% (${item.color}) — ${item.description}`,
      );
    }

    expect(prompt).toContain(palette.artDirection);
    expect(prompt).toContain('Noto Serif SC');
    expect(prompt).toContain('Manrope');
    expect(prompt).toContain('mobile-first');
    expect(prompt).toContain('primary-hover');
    expect(prompt).toContain('focus');
    expect(prompt).toContain('at least 4.5:1');
    expect(prompt).toContain('3:1');
    expect(prompt).toContain('Do not claim that the entire website is WCAG-conformant');
    expect(prompt).toContain('AI interpretation, not historical documentation');
    expect(prompt).toContain('Do not invent an unseen image URL');
    expect(prompt).not.toContain(palette.artwork.src);
  });

  it("uses each motif's own direction instead of a fixed Dunhuang prompt", () => {
    const prompt = createAgentPrompt({
      ...palette,
      artDirection: 'Quiet celadon glaze and negative space.',
    });
    expect(prompt).toContain('Quiet celadon glaze and negative space.');
    expect(prompt).not.toContain('Dunhuang-inspired');
  });
});
