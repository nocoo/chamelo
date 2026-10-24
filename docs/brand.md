# Chamelo brand identity

The catalogue identity is a Dunhuang-mural chameleon head, painted as an
ancient-imagined auspicious beast. It enters the frame from the left edge and
leaves roughly half of the square empty.

## Masters

| Path | Role | Source |
| --- | --- | --- |
| `logo.png` | Transparent 2048 × 2048 master | `chamelo-transparent-2048.png`, copied byte for byte |
| `assets/brand/icon.png` | Opaque square 2048 × 2048 presentation, weathered plaster field | `chamelo-icon-2048.png` |
| `assets/brand/icon-rounded.png` | Rounded 2048 × 2048 presentation | `chamelo-rounded-2048.png` |
| `public/apple-touch-icon.png` | 180 × 180 iOS/PWA icon, resampled from the square master | `chamelo-icon-2048.png` |
| `public/favicon.svg` | Browser tab mark | Previous identity, retained deliberately |

Hashes: `logo.png` `338f4041…`, `icon.png` `343be998…`, `icon-rounded.png`
`6355fba8…`. Generation, exact prompt, owner approval, extraction recipe,
palette evidence and every export size live in the Hexly study
`artwork/logo-family/chamelo/2026-10-24-05`.

## Why the tab keeps the vector mark

The painting is an edge-entry portrait with fine gold flecks and page-like
paper grain. At 16 px it becomes a two-tone crest-and-ribbon silhouette: it
survives as colour and direction, not as a drawing. The existing `favicon.svg`
is a crisp vector arc that still reads at 16 px, so the browser tab keeps it
while every larger application mark adopts the painting. This is an intentional
size-specific exception, not an unfinished replacement; revisit it if a
simplified vector mark is drawn later.

## Presentation colours

The finished presentation uses a sand plaster field (`#faf4e7` → `#efe3cb` →
`#dcc7a5`) with project-specific hairline cracks, one lifting plaster edge and
three pigment flecks. Website tokens remain the curated palette values in
`src/data/palettes.ts` and are not derived from the Logo.

## Rights

The painting was generated for this project with Azure `gpt-image-2.5-sunburst`
using references from Chamelo's own Dunhuang artwork. The previous `C` arc
favicon and all website artwork remain unchanged and keep their own authorship.
