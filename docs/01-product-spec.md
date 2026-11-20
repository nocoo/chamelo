# 01 · Product, UI & Content Specification

Detailed product behaviour, visual/chrome rules, and draft-to-published content lifecycle for **Chamelo** (display name **守宫**, codename **Chameleon**, first edition **Dunhuang Splendour**). High-level invariants live in [AGENTS.md](../AGENTS.md); artwork production and curation steps live in [chamelo-palette](../.agents/skills/chamelo-palette/SKILL.md).

## Product & Explorer Behaviour

- **Curation over raw extraction**: Generate original cultural imagery, extract candidate colours, then deliberately curate a usable website theme. Never present raw pixel extraction as professional colour pairing.
- **Published palette contract**: Every published palette in `src/data/palettes.ts` includes a source image, six curated swatches, twelve semantic roles, recommended 60/30/10 proportions, a website preview, and complete CSS and agent-prompt exports.
- **Explorer interaction**: The explorer displays one selected entry at a time. Selection drives the site's semantic colours, atmosphere, and exports; clicking a swatch only copies its colour value.
- **Safety & motion**: Respect `prefers-reduced-motion`. Never publish testing palettes or incomplete concepts as generated content.
- **Language**: Interface copy is Chinese (preserving cultural names in content); code, documentation, and comments are English.
- **Architecture & scope**: Keep models and pure services (`src/services/`, `src/viewmodels/`) separate from React views (`src/views/`). Do not add a login, CMS, public generation API, compatibility wrapper, or speculative storage layer without a concrete requirement.

## Visual Direction, Layout & Browser Targets

- **Primary browsers**: Current Safari and Chrome, including iPhone Safari. Native responsive layouts and dialogs must not depend on hover.
- **Liquid refraction**: Liquid glass refraction affects artwork only, never essential text or controls.
- **Visual direction**: Contemporary editorial typography, mineral hues, restrained glass, and meaningful density. No inherited UI template or component library is required.
- **Viewport composition**: Desktop viewports at least `1024px` wide and `650px` tall use a full-width, viewport-height composition. Smaller or zoomed viewports scroll naturally; keep essential controls visible instead of masking document overflow.

## Identity, Header Chrome & Mode Derivation

- **Naming & brand bytes**: The interface is named **守宫** and shows no English brand wordmark. Repository, package, Worker, domain, and asset slugs stay `chamelo`. All brand marks are byte copies from the Hexly study — never redraw, recolour, or crop them (see [brand identity](brand.md) for exact paths and hashes).
- **Header actions**: The header carries four icon actions in one row: the Hexly family link, the GitHub repository, the light/dark switch, and the guide. The guide button has no text label; keep its `aria-label` and `title`.
- **Light/dark mode derivation**: Each palette declares `mode: 'light' | 'dark'` matching its scene (night interiors, grottoes, and lamplit studies are dark pages; workshops, courtyards, and weather scenes are light ones). The collection must keep both modes, and the 60% distribution band repeats `theme.background`.
- **Opposite-mode switch**: Toggling the light/dark switch derives the opposite mode from the palette's swatch evidence through `src/services/appearance.ts`. The derivation must keep all `themeContrastChecks` passing; the palette's curated tokens remain authoritative for exports and the mini preview.

## Draft Concepts & Promotion Lifecycle

- **Draft schema**: `src/data/draft-palettes.ts` records TODO concepts that have no artwork yet: category, description, tags, and a three-slot traditional-colour direction drawn from `src/data/traditional-colours.ts`. A draft carries no artwork, hex values, swatches, exports, preview, or provenance.
- **Build-time DEV guard**: The catalogue includes drafts only when `import.meta.env.DEV` is true, so production builds never ship ungenerated ideas. Keep this build-time guard; never replace it with a runtime flag or a hidden route.
- **Automatic numbering**: Catalogue numbers derive from position in `src/data/collection.ts`. Never store a number in the data; reordering or publishing renumbers automatically.
- **Promotion procedure** (full house style in [chamelo-palette](../.agents/skills/chamelo-palette/SKILL.md)):
  1. Generate artwork as a culturally situated scene (a hall, chamber, workshop, courtyard, garden, river, or cave — motif inside three depths, never a tabletop object study or bare empty room) using `gpt-image-2.5-sunburst`. Keep accepted originals unchanged at `public/artworks/<id>/original.png` and rejected attempts at `content/<id>/archive/attempt-NN-<reason>.png`.
  2. Run `bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst` (offline, no API calls; requires the explicit model name) to generate WebP derivatives and extraction evidence under `content/<id>/` alongside the exact prompt.
  3. Curate six pixel-evidenced swatches named from `src/data/traditional-colours.ts` (drop a colour if pixels lack evidence instead of inventing a swatch), twelve semantic roles, 60/30/10 proportions, story, art direction, and provenance.
  4. Move the entry into `src/data/palettes.ts` with `status: 'published'` and delete it from `src/data/draft-palettes.ts`. The `待生成` ribbon, TODO marking, and local-only guard disappear with the draft entry; a promoted entry must never keep placeholder copy.
  5. Run `bun run check`, verify the entry in a local browser at `1440x900` and `390x844`, and record the promotion under `Unreleased` in `CHANGELOG.md` before committing.
