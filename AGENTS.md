# Chamelo (守宫)

Chinese-cultural colour atlas (codename Chameleon, first edition Dunhuang Splendour) built as a React 19 + Vite static SPA deployed to Cloudflare Workers (`chamelo.hexly.ai`).
Docs: [README.md](README.md) · [Product Spec](docs/01-product-spec.md) · [Brand](docs/brand.md) · [Releasing](docs/releasing.md) · [Palette Authoring](.agents/skills/chamelo-palette/SKILL.md) · [Retrospective](Retrospective.md)

## Commands

Run from root with Bun `1.4.3` and Node `>=22.12.0` (CI uses Node `26.12.1`). Local env names live in `.env.example`.

```sh
bun install
bun run dev             # https://chamelo.dev.hexly.ai -> 127.0.0.1:7061
bun run typecheck       # S1: tsc --noEmit
bun run lint            # S2: Biome check-only, 0 warnings
bun run test            # Unit tests
bun run test:coverage   # L1: >=95% coverage gate
bun run check           # S2 + S1 + L1 combined gate
bun run verify:l1-gate  # L1 / pre-commit proof
bun run build           # B1: typecheck + build
bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst
bun run release -- --dry-run
bun run verify:production
```

## Invariants

- **Curation & scope**: Curate themes from original imagery + extraction; never ship raw pixel averages as pairing. No login, CMS, public generation API, compat wrapper, or speculative storage.
- **Language & brand**: UI copy is Chinese (keep cultural names); code/docs are English. Display name `守宫` (no English wordmark; slugs stay `chamelo`); never alter Hexly marks ([brand.md](docs/brand.md)).
- **Data & drafts**: `src/data/palettes.ts` holds published palettes; `src/data/draft-palettes.ts` holds TODO concepts (no artwork, hex, exports, or provenance). Keep models/services separate from React views.
- **Draft guard & numbering**: Load drafts only when `import.meta.env.DEV` is true (never a runtime flag or hidden route). Derive catalogue numbers from `src/data/collection.ts` position; never store numbers.
- **Mode & band**: Declare scene-matched `mode: 'light' | 'dark'` (keep both modes); 60% distribution band repeats `theme.background`.
- **Opposite-mode switch**: `src/services/appearance.ts` derives the toggled mode from swatch evidence passing `themeContrastChecks`; curated tokens stay authoritative for exports and preview.
- **UI & browsers**: Target Safari/Chrome (incl. iPhone), hover-free, reduced-motion safe; liquid refraction on artwork only, never text/controls. Layout & chrome: [Product Spec](docs/01-product-spec.md).
- **Authoring**: Follow [chamelo-palette](.agents/skills/chamelo-palette/SKILL.md): culturally situated scenes (no tabletop studies) and 6 pixel-evidenced swatches from `src/data/traditional-colours.ts`.
- **Artwork & archives**: Use `gpt-image-2.5-sunburst`; keep originals at `public/artworks/<id>/original.png`, rejected attempts under `content/<id>/archive/`, and prompts/evidence/WebP derivatives intact.
- **Offline prep**: `bun run artwork:prepare` runs offline (no API calls) and requires explicit `--model` (cannot infer from pixels).
- **Promotion**: Pass `bun run check`, inspect at `1440x900`/`390x844`, strip placeholders, and log under `Unreleased` in `CHANGELOG.md` before committing.
- **Secrets**: Root `.env` holds `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY` for internal generation only; never print, track, or expose via `VITE_` vars or client code.
- **Version & health**: `package.json` is the sole version source; `/api/live` is a static liveness artifact (not an Azure/DB probe), and `bun run release` commits locally only ([releasing.md](docs/releasing.md)).
- **CD & release**: Main-push CI success triggers production CD (`.github/workflows/release.yml`) — never push unfinished work assuming it is deploy-free. Publish via authorized CD, not local `bun run deploy`.

## Quality & Local Gates

Follows `system1-quality`; CI slots and pinned `base-ci` live in `.github/workflows/quality-slots.yml` (`quality / Z1: Gate` required on `main`, incl. `l1-precommit-gate`). Status: `enforced`, `planned`, `manual`, `N/A`.

- **Coverage**: `L1` enforces >=95% statements/branches/functions/lines on `src/services/**/*.ts`, `src/viewmodels/**/*.ts`, and `scripts/lib/**/*.ts` (no empty/pending suites).
- **Exceptions**: `L2 Runtime`, `L3 Integration`, `P1 Package` are `N/A` (private static Worker SPA, no app API); `L4 E2E` is `planned` (Playwright on `27061`, `tests/e2e` not yet in CI).
- **Local hooks**: `bun run prepare` installs `.husky/pre-commit` (no `pre-push` yet); runs `lint`, `typecheck`, and `scripts/unit-coverage-gate.ts` on a staged snapshot in `$TMPDIR/chamelo-index.*`.
- **Hook timeout & proof**: 25s child timeout per step (exit `124` timeout, `127` missing `bun`), symlinked `node_modules`; proof via `bun run verify:l1-gate`.

## Resources & Isolation

| Lane  | Endpoint / State                         | Boundary                                                    |
| ----- | ---------------------------------------- | ----------------------------------------------------------- |
| Dev   | `chamelo.dev.hexly.ai -> 127.0.0.1:7061` | Herdr `dev server` tab; Caddy `/opt/homebrew/etc/Caddyfile` |
| Tests | E2E `17061`, browser/BDD `27061`         | Isolated ports; Playwright launches fresh on `27061`        |
| Prod  | `https://chamelo.hexly.ai`               | CF Worker static assets; read-only unless authorized        |

Caddy source: `system0/services/caddy/Caddyfile`; wildcard DNS/certs already cover `https://chamelo.dev.hexly.ai`.

## Retrospective

Record incident narratives in [Retrospective.md](Retrospective.md); promote recurring project constraints to `Invariants` above and enforceable safeguards to tests/hooks.
