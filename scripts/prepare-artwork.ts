import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import quantize from 'quantize';
import sharp from 'sharp';
import { artworkPlan } from './lib/artwork.ts';

process.chdir(resolve(import.meta.dirname, '..'));

const { values, positionals } = parseArgs({
  args: process.argv.slice(2).filter((argument) => argument !== '--'),
  allowPositionals: true,
  options: { model: { type: 'string' }, help: { type: 'boolean' } },
});
if (values.help) {
  console.log('用法：bun run artwork:prepare -- <意象 ID> --model <实际生成模型>');
  console.log('仅从已保存的原始 PNG 生成 WebP 和候选色；不调用生图接口，不修改原图。');
  process.exit(0);
}
if (positionals.length !== 1) throw new Error('Supply exactly one palette ID.');
const { source, delivery, prompt, extraction, model } = artworkPlan(positionals[0], values.model);
if (!(await readFile(prompt, 'utf8')).trim()) {
  throw new Error('Archive the exact generation prompt before preparing artwork.');
}
const bytes = await readFile(source);
const image = sharp(bytes);
const metadata = await image.metadata();
if (metadata.format !== 'png') throw new Error('Expected an unchanged original PNG.');
await image.clone().webp({ quality: 88, effort: 6 }).toFile(delivery);

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
  model,
  method: 'Modified median-cut quantization of a 240px sRGB sample, 12 candidates.',
  note: 'Candidates are source evidence, not a finished web theme. Semantic tokens are curated separately for contrast and hierarchy.',
  candidates,
};
await writeFile(extraction, `${JSON.stringify(result, null, 2)}\n`);
console.log('已保留原始 PNG，生成 WebP，并提取候选色：');
console.table(candidates.map(({ hex, rgb }) => ({ hex, rgb: rgb.join(', ') })));
