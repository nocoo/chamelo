<p align="center">
  <img src="../logo.png" width="128" alt="Shougong logo" />
</p>
<h1 align="center">Shougong</h1>
<p align="center">A Chinese-cultural colour atlas that hands you a usable website palette, not just a swatch card: artwork, six swatches, twelve semantic roles, proportions and exports.</p>
<p align="center">
  <a href="https://chamelo.hexly.ai">Website</a> ·
  <a href="../README.md">简体中文</a>
</p>

## What it does

Built for independent developers, design engineers and small teams. Most "Chinese style" palettes stop at a handful of colours; the work of deciding which one is the page ground, which one carries text, which one belongs on a button and how much of each to use is left to you. Shougong turns each palette into a specification a person or a coding agent can implement directly: an original image grown from one cultural motif, the colours that image can actually support, then a curated set of twelve semantic roles — background, surface, text, primary action, accent and the rest — with a 60/30/10 proportion guide and a written interface brief.

The collection holds 20 curated palettes and 57 concepts still waiting for curation. It is curated work, not a colour picker: swatches are tuned for lightness and contrast and are not the raw pixel average of the image.

The runtime is a static front end delivered as Cloudflare Worker static assets. There is no login, CMS, public generation API or database. Every image is a contemporary AI interpretation, not a record of an artefact, cave or building. Concepts awaiting curation exist only in local development builds and never ship to production.

## Features

- **Curated palettes**: 20 across four cultural sources — murals and grottoes, land and seasons, objects and rituals, poetry and dreams. Each carries its artwork, six swatches named in traditional Chinese colour vocabulary, twelve semantic roles, contrast records and a 60/30/10 split.
- **Light and dark**: each palette declares its own mode from its scene; the header switch flips it, and the opposite mode is derived from that palette's swatches while every contrast pair stays at AA or better.
- **Take it away**: copy a single colour as HEX / RGB / HSL / OKLCH, copy the whole set as CSS variables, or copy an agent prompt containing the motif, values, roles, proportions and implementation constraints.
- **Preview in place**: the selected palette renders a miniature site in desktop and mobile frames, with an expandable view.
- **Browse and search**: filter by cultural source, search names and tags, page with `←` / `→`, view and download originals.
- **Boundaries**: current Safari and Chrome including iPhone Safari; no interaction depends on hover; reduced-motion preferences are respected.

## Usage

Open **https://chamelo.hexly.ai**; nothing to install.

- Pick a palette from a category tab or the search field, then page through with `←` / `→`.
- Click any swatch to copy its value in the format selected at the top right.
- "复制 CSS" copies a `:root` block with the twelve semantic variables; "复制 Agent Prompt" copies a brief a coding agent can implement.
- Dialogs expose the full artwork, the twelve semantic colours with their contrast records, an expanded preview and the guide.

## Development

Requires Node.js 22.12+ and Bun 1.4.3.

```sh
bun install
bun run dev
```

The local entry point is **https://chamelo.dev.hexly.ai**; Vite listens on `127.0.0.1:7061` behind the machine's Caddy instance.

```sh
bun run build              # typecheck and build the static output
bun run dev                # development server
```

Generating new artwork is an internal editorial workflow and needs `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY` from a root `.env`. Neither is committed, prefixed with `VITE_` or shipped to the client.

```sh
# Process an archived original into the WebP delivery asset and reproducible colour evidence; no API calls
bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst

# Prepare a local version commit (no push, no deploy)
bun run release -- --dry-run
bun run release -- minor

# Read-only check of the deployed version and built bytes
bun run verify:production
```

Only a few directories matter day to day: `src/data/palettes.ts` holds curated content, `src/data/draft-palettes.ts` holds pending concepts, `src/services/` holds pure logic, `src/views/` holds the interface, `content/<id>/` keeps each prompt and its colour evidence, and `public/artworks/<id>/` keeps originals and delivery derivatives.

## Tests

```sh
bun run test           # Vitest unit tests
bun run test:coverage  # unit tests with coverage
bun run check          # Biome + strict types + coverage run
```

Unit tests cover colour conversion and contrast maths, the catalogue contract (swatch count, semantic keys, proportions summing to 100, passing contrast, files on disk), export content, and version and health artefacts. The end-to-end directory `tests/e2e` does not exist yet, so `bun run test:e2e` currently has no cases to run; the Playwright config and its local server port are in place.

`artwork:prepare` is not part of the test suite; it reads archived originals and depends on `sharp`.

## Stack

| Technology | Role |
| --- | --- |
| React 19 + Vite | Single-page interface, build and local dev server |
| TypeScript (strict) | Types for models, services and views |
| culori | Colour conversion, colour space maths and WCAG contrast |
| liquid-glass-web-react | Liquid-glass lens over the original artwork |
| Biome | Formatting and static analysis |
| Vitest | Unit tests and coverage |
| Playwright | End-to-end framework (cases pending) |
| Cloudflare Workers + Wrangler | Static asset hosting and deployment |

## Documentation

- [AGENTS.md](../AGENTS.md): the single maintained source for project invariants, commands and release rules.
- [docs/releasing.md](releasing.md): version policy, CI/CD and production verification.
- [docs/brand.md](brand.md): naming, logo provenance and size usage.
- [.agents/skills/chamelo-palette/SKILL.md](../.agents/skills/chamelo-palette/SKILL.md): the full workflow for adding or reworking a palette.
- [CHANGELOG.md](../CHANGELOG.md): release history.

## License

[MIT](../LICENSE) © 2026 Zheng Li
