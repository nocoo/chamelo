import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import quantize from 'quantize';
import sharp from 'sharp';

const source = 'public/artworks/dunhuang-huacai/original.png';
const bytes = await readFile(source);
const image = sharp(bytes);
const metadata = await image.metadata();
await image
  .clone()
  .webp({ quality: 88, effort: 6 })
  .toFile('public/artworks/dunhuang-huacai/artwork.webp');

const { data, info } = await image
  .clone()
  .resize(240, 160, { fit: 'inside' })
  .removeAlpha()
  .toColourspace('srgb')
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels: quantize.RgbPixel[] = [];
for (let offset = 0; offset < data.length; offset += info.channels) {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  if (red !== undefined && green !== undefined && blue !== undefined) {
    pixels.push([red, green, blue]);
  }
}
const colors = quantize(pixels, 12);
if (!colors) throw new Error('No color candidates could be extracted.');
const candidates = colors.palette().map((rgb) => ({
  hex: `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`.toUpperCase(),
  rgb,
}));

const result = {
  source,
  sourceSha256: createHash('sha256').update(bytes).digest('hex'),
  width: metadata.width,
  height: metadata.height,
  model: 'gpt-image-2.5-sunburst',
  method: 'Modified median-cut quantization of a 240px sRGB sample, 12 candidates.',
  note: 'Candidates are source evidence, not a finished web theme. Semantic tokens are curated separately for contrast and hierarchy.',
  candidates,
};
await writeFile('content/dunhuang-huacai/extraction.json', `${JSON.stringify(result, null, 2)}\n`);
console.log('已保留原始 PNG，生成 WebP，并提取候选色：');
console.table(candidates.map(({ hex, rgb }) => ({ hex, rgb: rgb.join(', ') })));
