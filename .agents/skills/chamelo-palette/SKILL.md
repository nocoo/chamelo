---
name: chamelo-palette
description: Author or revise a Chamelo palette end to end — culturally situated scene artwork, archived prompt and extraction evidence, six curated swatches from the traditional colour vocabulary, twelve semantic tokens, 60/30/10 proportions, contrast verification — and promote it from draft to published. Use for adding, regenerating or auditing Chamelo artworks and palettes; Chinese triggers 新增色板, 生成配图, 重做配图, 策展配色.
---

# Chamelo palette authoring

A published palette is one culturally situated scene, six curated swatches, twelve semantic tokens, a 60/30/10 proportion plan, a website preview and a copyable brief. This skill fixes the house style for the artwork and the discipline for the curation.

Read the project `AGENTS.md` first. The rules below are the specific, repeatable version of its "Product Invariants".

## 1. The scene rule

Artwork is an **image, not a product shot**. Every palette image is an imagined place inside Chinese culture — a hall, a chamber, a workshop, a courtyard, a garden, a river, a cave — and the motif named by the palette is only one element inside it.

- Three depths: a soft foreground element at one edge, the motif in the middle distance, and architecture or landscape behind it.
- Density comes from architecture, textiles, pigment and light. Never a bare empty room, never a tabletop close-up, never a symmetrical postcard.
- Negative space is made of air, shadow and light falloff, not of a reserved blank half of the frame.
- The subject must be a scene the palette's name could happen in. 汝窑开片 belongs in a rainy scholar's room, not on a grey sweep.
- The image must actually contain the colours the palette claims. If the pixels do not support a colour, drop the colour — never invent it. A forced regeneration with a colour instruction is acceptable; a fabricated swatch is not.

## 2. The canonical prompt tail

Every artwork prompt ends with the same style and technical block, so the whole atlas reads as one series. Compose: `scene paragraphs + palette paragraph + tail + negative list`.

```text
Composition holds three depths: a soft foreground element at one edge, the motif in the middle distance, and an architectural or garden space behind it. Detail density comes from architecture, textiles and light rather than from scattered props. Emptiness is supplied by air, shadow and one broad quiet area, not by a reserved blank half of the frame.

Art direction: a cinematic film still of an imagined Chinese interior, courtyard or landscape; painterly atmospheric realism, sculpted directional light, subtle haze and dust, gentle bloom at the brightest highlights, natural film grain, deep but quiet shadow, disciplined saturation. Rich, densely layered architecture and surface detail, never a bare empty room. Not a museum visualisation, not a tourist photograph, not a flat architectural rendering, not glossy CGI, not a symmetrical postcard.

Technical: photorealistic micro-detail at the focal plane with natural falloff elsewhere. Landscape aspect ratio 3:2, high quality, image fills the entire canvas edge to edge.

No text, no lettering, no calligraphy, no inscribed plaques, no seals, no colour swatches, no website UI, no borders, no signatures, no logos, no people, no hands, no silhouettes of people, no scattered clutter of many antiques, no glitter, no chrome reflections.
```

The scene paragraph opens by naming the palette and its English gloss, then states plainly "This is a poetic cultural scene, not a museum record". The palette paragraph lists the colours in plain English with a dominance order. Add a per-image negative only when a specific prop would derail the scene.

Never put Chinese characters, catalogue numbers or palette titles in the image prompt body beyond the quoted name — the model will try to paint them.

## 3. Generate and archive

One image at a time; the model rate-limits under parallel load. Retry with growing sleeps on HTTP 429.

```sh
set -a && . ./.env && set +a
python3 /Users/nocoo/.agents/skills/agi-image-generation/scripts/generate.py \
  "$(cat content/<id>/prompt.txt)" \
  -o "$(pwd)/public/artworks/<id>/original.png" \
  --size 1536x1024 --quality high --model gpt-image-2.5-sunburst
```

- Save the exact prompt to `content/<id>/prompt.txt` **before** generating; `artwork:prepare` refuses to run without it.
- Keep the accepted original at `public/artworks/<id>/original.png`, unchanged.
- Archive every rejected attempt under `content/<id>/archive/attempt-NN-<reason>.png`. Review the PNG yourself before accepting it: no text, no people, motif present, colours present, three depths readable.
- Reject and regenerate rather than Photoshop-fix. The point of the archive is honesty about which attempt was used.

## 4. Evidence

```sh
bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst
```

This writes the WebP delivery derivative and `content/<id>/extraction.json`: source hash, dimensions, and eleven median-cut candidates from a 240x160 reduction. It makes no API call and never touches the original.

Regional and hue-targeted sampling is the second kind of evidence and is what makes a palette specific rather than generic. Rules that cost time when forgotten:

- Materialise the crop first: `sharp(source).extract(region).toBuffer()` and then `new sharp(buffer).stats()`. Calling `.stats()` on a queued transform returns the source values.
- For hue targeting use `.raw().toBuffer({ resolveWithObject: true })` and iterate pixels with an HSL function; bucket by hue/saturation/lightness and take a median. Sample every ninth byte at most — full-resolution loops are unnecessary.
- Sample the materials you will name: a wall, a beam, a cloth in shadow, the lit side of the gilt, the flame. Write the numbers into the palette rationale when they decide a role.

## 5. Curate

Six swatches, ordered light to dark or motif to accent, each with a real name from `src/data/traditional-colours.ts`, an English gloss and a role.

Choose `mode` before choosing tokens. A night interior, a lamplit study, a grotto wall or a river at night belongs on a dark page; a porcelain workshop, a dye yard, a snow court or a rain lake belongs on a light one. The atlas must not be one tone: keep both modes in the collection and let the mode follow the scene, not the other way round.

- `mode: 'light'` puts `background` near the lightest credible evidence and `text` on the dark end of the palette.
- `mode: 'dark'` puts `background` in the scene's night ink, `surface` a step lighter, `text` on the palette's light end, and `primary` on a luminous colour with a near-black `on-primary`; `primary-hover` goes lighter, not darker.
- The 60% distribution band always repeats `background` exactly, so the band reads as the page ground in both modes.
- The base swatch is the lightest credible evidence from the image; in dark mode it stays the swatch list's light end while the page ground is the dark one.
- The brand colour (`primary`) is the palette's identity colour, taken darker than the raw evidence if contrast demands it.
- The accent is the scarce colour — gold, flame, shell, lantern. It is allowed to fail the border-only contrast check and nothing else.
- Twelve tokens, exactly the keys in `tokenLabels`: `background`, `surface`, `surface-alt`, `text`, `text-muted`, `border`, `primary`, `primary-hover`, `on-primary`, `accent`, `on-accent`, `focus`.
- 60/30/10 distribution with a sentence per band saying what carries that share.
- Copy is Chinese and concrete: description one line, caption four to eight characters, story two or three sentences naming the place and the light. Stories end by stating the image is an AI interpretation, not a record.
- `artDirection` is English and written for a coding agent: which surfaces, which accents, what to avoid. State the mode in it ("in dark mode: a near-black ground...") so the brief cannot drift into the opposite surface treatment.
- Exports carry the mode: `createCss` emits `color-scheme`, and the agent prompt states the surface mode.

Every contrast pair in `themeContrastChecks` must pass before committing — `text/*` and `on-*/*` at 4.5, `focus/*` at 3.0. `border/background` is decorative and is not checked; keep it non-essential. Check candidate themes with `culori`'s `wcagContrast` in a scratch script before editing data, and delete the scratch script.

## 6. Promote

1. Add the full entry to `src/data/palettes.ts` with `status: 'published'`, `category` from the existing four, and the `provenance` block (`model`, `generatedAt`, `extraction` description).
2. Delete the matching concept from `src/data/draft-palettes.ts`; it must not exist in both.
3. Update the count copy in the palette modal and any README sentence that enumerates the set.
4. `bun run check` — the catalogue contract test enforces six swatches, twelve tokens, 100% distribution, passing contrast, existing `artwork.webp`/`original.png`, `content/<id>/prompt.txt` and `content/<id>/extraction.json`, unique ids, and traditional colour names in every draft direction.
5. Record the promotion in `CHANGELOG.md` under `Unreleased`.

## 7. Verify in the browser

```sh
bun run build
```

Then capture the palette at 1440x900 and 390x844 through the dev server, checking for console errors and horizontal overflow. Look at the image, not only at the log:

```js
import pw from './node_modules/playwright/index.js';
const browser = await pw.chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto('https://chamelo.dev.hexly.ai/', { waitUntil: 'networkidle' });
await page.getByLabel('搜索色板').fill('<palette name>');
await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/s-<id>.png' });
```

Label legibility on high-key artwork comes from the umber gradient scrim in `.artwork-scrim`. Never restore a colour layer there; it darkens dark art and lies about the palette.

## 8. Pitfalls

- A hairline material is invisible to median-cut. Size any colour the palette needs by the pixels an extractor can see.
- `bun run artwork:prepare` requires the actual model string; it cannot infer the model from pixels.
- Never leave draft entries in production builds, and never let a draft carry a `#` value.
- Delete scratch scripts (`*-tmp.mjs`, `gen-loop.sh`) before committing; run them from `/tmp` where possible.
- Anything that fails, and any lesson learned about it, belongs in `Retrospective.md`, not here.
