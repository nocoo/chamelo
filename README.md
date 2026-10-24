# Chamelo

A considered colour atlas rooted in Chinese culture. Original AI artwork becomes a curated palette, a semantic website theme, and a self-contained brief for a coding agent.

The curated set opens with **Dunhuang Splendour**, a Song palace hall in 朱漆鎏金, and six imagined scenes — 黑漆螺钿, 犀皮流霞, 玄金夜锦, 紫檀嵌螺, 月白缠枝 and 绛红团花 — each taking its colour from an original GPT Image 2.5 Sunburst artwork. The images are artistic interpretations, not records of historical places or objects.

## Develop

Requires Node.js 22.12+ and Bun 1.4.3.

```sh
bun install
bun run dev
```

Open **https://chamelo.dev.hexly.ai**. Vite binds to `127.0.0.1:7061`; Caddy provides local HTTPS using the existing wildcard certificate. The Herdr `dev server` tab keeps the development process visible. Production is `https://chamelo.hexly.ai`; every successful `main` CI run deploys through CD.

On the owner's restricted network, install with the approved temporary registry:

```sh
BUN_CONFIG_REGISTRY=https://packagefeedproxy.microsoft.io/npm/ bun install
```

Do not persist mirror tarball URLs in `bun.lock`.

## What Works

- 78 collected concepts: eight fully curated palettes and 70 TODO concepts spanning murals, textiles, ceramics, lacquer, gardens, seasons and poetry. Draft concepts appear only in local development builds and are marked with a 待生成 ribbon.
- Cultural categories and motif/tag search, including honest empty states.
- HEX, RGB, HSL and OKLCH formats with individual colour copying.
- Twelve semantic theme variables, colour-pair contrast records, and CSS export.
- One-click agent prompt export including the motif, every colour, semantic roles, proportions and implementation constraints.
- A working miniature website using the exact exported theme, plus an expanded preview.
- Original artwork viewing/download and an isolated liquid-glass lens using `liquid-glass-web-react`.
- Responsive layouts and native modal dialogs; current Safari and Chrome are the browser targets.

## Content Workflow

0. Record the concept in `src/data/draft-palettes.ts` with its category, one-line description, tags and a traditional-colour direction using names from `src/data/traditional-colours.ts`. A concept stays `status: 'todo'`, renders as a local-only placeholder, and never enters a production build until it is promoted to `palettes.ts` with artwork, extraction evidence and curated roles (see `AGENTS.md`).
1. Write an original cultural concept and image prompt under `content/<id>/`.
2. Generate the source image with the configured `agi-image-generation` skill using `gpt-image-2.5-sunburst`. Keep the original PNG unchanged. `content/dunhuang-huacai/prompt.txt` records this edition's exact prompt.
3. Run `bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst` to create that edition's WebP delivery asset and reproducible colour evidence from its original PNG. Supply the actual generation model; the script cannot infer it from pixels. This command makes **no API calls**.
4. Curate swatches and semantic roles in `src/data/palettes.ts`. Raw extraction is evidence, not the finished theme: adjust lightness, foreground contrast, usage hierarchy and proportions deliberately.

`extraction.json` is reproducible with the preparation script. `exploration.json` preserves supplementary first-edition regional and chromatic samples; the original exploratory hue thresholds were not retained, so those samples are archival rather than a reproducibility claim.

Azure credentials belong only in the ignored root `.env`, using the names in `.env.example`. Never prefix them with `VITE_`, expose them to the frontend, print them or commit them. Image generation is an internal editorial workflow, not a public client feature.

## Commands

```sh
bun run build          # Strict typecheck and production Vite build
bun run lint           # Biome checks; warnings fail
bun run format         # Explicit formatting and safe fixes
bun run typecheck      # Strict TypeScript checks
bun run test           # Pure domain/export/filter tests
bun run test:coverage  # Four coverage metrics, each at least 95%
bun run check          # Lint, typecheck and coverage
```

Husky runs `check` against a temporary index snapshot. Unit coverage currently measures `src/services/**/*.ts` and `src/viewmodels/**/*.ts`, not pure views, UI event wiring or editorial scripts. Browser compatibility and detailed interaction review are deferred until the owner accepts the first visual direction; no full accessibility or quality certification is claimed. Browser test configuration reserves `27061` and is not a completed E2E suite.

## Deploy Through CD

The pinned `nocoo/base-ci` workflows run checks on `main` and deploy the exact successful main-push revision to Cloudflare Worker static assets at **chamelo.hexly.ai**. Configure the two Cloudflare deployment secrets in the GitHub `production` environment; see [release operations](docs/releasing.md). Publish only when authorized, through CD rather than a workstation deployment. Credentials and source-generation tools are not part of the public bundle.

## Layout

- `src/models/`: shared palette and theme contracts.
- `src/data/`: curated collection; the content source of truth.
- `src/services/`: colour calculations and export builders using Culori.
- `src/viewmodels/`: pure filtering logic.
- `src/views/`: React rendering and presentation state.
- `src/styles/`: shared design tokens and responsive editorial layout.
- `content/`: generation prompts and extraction evidence.
- `public/artworks/`: preserved original and web delivery image.

All direct dependencies are pinned to registry stable releases selected on 2026-10-24. `package.json` is the version source of truth.
