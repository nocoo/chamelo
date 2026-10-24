# 守宫 brand identity

The interface calls this atlas **守宫** and shows no English brand wordmark.
Repository, package, Worker and domain keep the `chamelo` slug so the deployed
URL, catalogue entry and asset history stay stable; only the display name
changed.

The identity is a Dunhuang-mural chameleon head, painted as an
ancient-imagined auspicious beast. It enters the frame from the left edge and
leaves roughly half of the square empty.

## Masters

| Path | Role | Source |
| --- | --- | --- |
| `logo.png` | Transparent 2048 × 2048 master | `chamelo-transparent-2048.png`, copied byte for byte |
| `assets/brand/icon.png` | Opaque square 2048 × 2048 presentation, weathered plaster field | `chamelo-icon-2048.png` |
| `assets/brand/icon-rounded.png` | Rounded 2048 × 2048 presentation | `chamelo-rounded-2048.png` |
| `public/brand/mark-64.png` | Header mark beside 守宫 | Hexly `transparent-64.png`, byte copy |
| `public/brand/mark-32.png` | Browser tab, 32 px | Hexly `transparent-32.png`, byte copy |
| `public/brand/mark-16.png` | Browser tab, 16 px | Hexly `transparent-16.png`, byte copy |
| `public/brand/hexly-mark.svg` | Hexly family link in the header | Hexly brand kit `hexly-mark.svg`, byte copy |
| `public/apple-touch-icon.png` | 180 × 180 iOS/PWA icon, resampled from the square master | `assets/brand/icon.png` |

Hashes: `logo.png` `338f4041…`, `icon.png` `343be998…`, `icon-rounded.png`
`6355fba8…`, `mark-64.png` `e69a30e2…`, `mark-32.png` `b5a8b99c…`,
`mark-16.png` `e6ad5ff1…`, `hexly-mark.svg` `07393a67…`,
`apple-touch-icon.png` `27b2d083…`.

Generation, exact prompt, owner approval, extraction recipe, palette evidence
and every export size live in the Hexly study
`artwork/logo-family/chamelo/2026-10-24-05`; the family record is
`src/data/projects/chamelo.json` in `nocoo/hexly.ai`.

## Header treatment

The header shows the painting at 38 px next to the 守宫 wordmark. Small marks
and the browser tab use the transparent foreground without a background tile,
per the Hexly family rules, so the mark is never padded inside another surface.

The tab previously kept a hand-drawn `C` arc because it survived 16 px better
than the painting; that mark belonged to the retired identity and has been
removed. The painting now serves 16/32 px as well. At 16 px it reads as a
crest-and-ribbon silhouette rather than a drawing — accepted deliberately. If a
simplified vector mark is ever drawn, revisit the smallest sizes.

## Presentation colours

The finished presentation uses a sand plaster field (`#faf4e7` → `#efe3cb` →
`#dcc7a5`) with project-specific hairline cracks, one lifting plaster edge and
three pigment flecks. Website tokens remain the curated palette values in
`src/data/palettes.ts` and are not derived from the Logo.

## Rights

The painting was generated for this project with Azure `gpt-image-2.5-sunburst`
using references from Chamelo's own Dunhuang artwork. The Hexly mark and family
exports belong to `nocoo/hexly.ai` and are copied byte for byte. All website
artwork keeps its own authorship.
