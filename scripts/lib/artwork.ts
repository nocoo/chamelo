export function artworkPlan(id: string | undefined, model: string | undefined) {
  if (!id || id.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error('Use a lowercase palette ID of at most 64 letters, digits and hyphens.');
  }
  if (model !== 'gpt-image-2.5-sunburst' && model !== 'gpt-image-2.5-flare') {
    throw new Error('Supply --model with the actual Sunburst or Flare deployment used.');
  }
  return {
    source: `public/artworks/${id}/original.png`,
    delivery: `public/artworks/${id}/artwork.webp`,
    prompt: `content/${id}/prompt.txt`,
    extraction: `content/${id}/extraction.json`,
    model,
  };
}
