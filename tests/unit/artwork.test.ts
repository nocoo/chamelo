import { describe, expect, it } from 'vitest';
import { artworkPlan } from '../../scripts/lib/artwork';

describe('artwork preparation paths', () => {
  it('scopes original, delivery and evidence paths to the selected motif', () => {
    expect(artworkPlan('tianqing-yanyu', 'gpt-image-2.5-sunburst')).toEqual({
      source: 'public/artworks/tianqing-yanyu/original.png',
      delivery: 'public/artworks/tianqing-yanyu/artwork.webp',
      prompt: 'content/tianqing-yanyu/prompt.txt',
      extraction: 'content/tianqing-yanyu/extraction.json',
      model: 'gpt-image-2.5-sunburst',
    });
  });

  it('records explicitly selected Flare provenance without replacing it with Sunburst', () => {
    expect(artworkPlan('study-002', 'gpt-image-2.5-flare').model).toBe('gpt-image-2.5-flare');
  });

  it.each([
    undefined,
    '',
    '../outside',
    '/absolute',
    'with/slash',
    'two--hyphens',
    'UPPER',
    'a'.repeat(65),
  ])('rejects unsafe or invalid IDs: %s', (id) => {
    expect(() => artworkPlan(id, 'gpt-image-2.5-sunburst')).toThrow('lowercase palette ID');
  });

  it('accepts the maximum ID length', () => {
    expect(artworkPlan('a'.repeat(64), 'gpt-image-2.5-sunburst').source).toContain('a'.repeat(64));
  });

  it.each([undefined, '', 'unknown-model'])('requires the actual supported model: %s', (model) => {
    expect(() => artworkPlan('dunhuang-huacai', model)).toThrow('actual Sunburst or Flare');
  });
});
