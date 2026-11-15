# Chamelo (display name 守宫)

A Chinese-cultural colour atlas. Codename: Chameleon. The first edition is Dunhuang Splendour.

## Product Invariants

- Generate original cultural imagery, extract candidate colours, then deliberately curate a usable website theme. Do not present raw pixel extraction as professional colour pairing.
- Every published palette includes a source image, six curated swatches, twelve semantic roles, recommended proportions, a website preview, and complete CSS/agent-prompt export. Draft concepts are TODO placeholders: no artwork, no hex values, no exports.
- The explorer shows one selected entry at a time. Selection drives the site's semantic colours, atmosphere and exports; swatch clicks only copy. Respect reduced motion and never publish testing palettes or incomplete concepts as generated content.
- `src/data/palettes.ts` holds published palettes; `src/data/draft-palettes.ts` holds TODO concepts whose only colour data is a traditional-colour direction. Models and pure services stay separate from React views.
- Current Safari and Chrome, including iPhone Safari, are primary targets. Native responsive layouts and dialogs must not depend on hover. Liquid refraction affects artwork only, never essential text or controls.
- Visual direction: contemporary editorial typography, mineral hues, restrained glass and meaningful density. No inherited UI template or component library is required.
- Desktop viewports at least 1024px wide and 650px tall use a full-width, viewport-height composition. Smaller or zoomed viewports scroll naturally. Keep essential controls visible instead of masking document overflow.
- Interface copy is Chinese; code, documentation and comments are English. Preserve cultural names in content.
- Do not add a login, CMS, public generation API, compatibility wrapper or speculative storage layer without a concrete requirement.

## Identity And Chrome

- The interface is named 守宫 and shows no English brand wordmark. Repository, package, Worker, domain and asset slugs stay `chamelo`; only the display name changes.
- Brand bytes come from the Hexly study: header mark `/brand/mark-64.png`, browser tab `/brand/mark-32.png` and `/brand/mark-16.png`, iOS icon a 180 px resample of `assets/brand/icon.png`, family link `/brand/hexly-mark.svg`. Never redraw, recolour or crop them; see [brand identity](docs/brand.md).
- The header carries four icon actions in one row: the Hexly family link, the GitHub repository, the light/dark switch and the guide. The guide has no text label; keep its `aria-label` and `title`.
- Each palette declares `mode`, and the switch derives the opposite mode from that palette's swatch evidence through `src/services/appearance.ts`. The derivation must keep all `themeContrastChecks` passing; curated tokens stay authoritative for exports and the mini preview.

## Palette Authoring

- Follow `.agents/skills/chamelo-palette/SKILL.md` for every new or revised palette: scene brief, canonical prompt tail, generation and archiving, extraction evidence, curation, promotion, browser verification. It is the authority for the house style; this file only states the invariants.
- Artwork is a culturally situated scene — a hall, chamber, workshop, courtyard, garden, river or cave — with the motif as one element inside three depths. Never a tabletop object study, never a bare empty room.
- Six swatches use names from `src/data/traditional-colours.ts`; colours must be evidenced by the image's pixels. If the evidence lacks a colour, drop the colour instead of inventing a swatch.
- Every palette declares `mode: 'light' | 'dark'` to match its scene. Night interiors, grottoes and lamplit studies are dark pages; workshops, courtyards and weather scenes are light ones. The collection must keep both modes, and the 60% distribution band repeats `theme.background`.
- Rejected artwork attempts stay under `content/<id>/archive/attempt-NN-<reason>.png`; the accepted original stays unchanged at `public/artworks/<id>/original.png`.
- Verify a promotion in a browser at 1440x900 and 390x844 before committing, and record the promotion under `Unreleased` in `CHANGELOG.md`.

## Generation And Secrets

- Use `gpt-image-2.5-sunburst` for approved artwork. Original PNGs remain unchanged; WebP files are delivery derivatives.
- Store exact prompts and non-secret extraction evidence under `content/`.
- Root `.env` contains `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY` for internal generation only. Never print, track or expose them through `VITE_` variables or client code.
- `bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst` processes an archived PNG and prompt without making API calls. Supply the actual generation model; the script cannot infer it from pixels.

## Draft Concepts

- `src/data/draft-palettes.ts` records concepts that have no artwork yet: category, description, tags and a three-slot traditional-colour direction drawn from `src/data/traditional-colours.ts`. A draft carries no hex values, swatches, exports, preview or provenance.
- The catalogue includes drafts only when `import.meta.env.DEV` is true, so production builds never ship ungenerated ideas. Keep this build-time guard; do not replace it with a runtime flag or a hidden route.
- Catalogue numbers derive from position in `src/data/collection.ts`. Never store a number in the data; reordering or publishing renumbers automatically.
- Promote a concept only after its artwork passes review: generate with `gpt-image-2.5-sunburst`, run `bun run artwork:prepare -- <id> --model gpt-image-2.5-sunburst`, keep the prompt and extraction evidence under `content/<id>/`, curate six swatches, twelve semantic roles and the 60/30/10 proportions, and add story, art direction and provenance. Then move the entry into `src/data/palettes.ts` with `status: 'published'` and delete it from `draft-palettes.ts`. The 待生成 ribbon, TODO marking and local-only guard disappear with the draft entry.
- Run `bun run check` and review the entry in a local browser before committing a promotion. A draft must never be presented as curated content, and a promoted entry must never keep placeholder copy.

## Commands

```sh
bun install
bun run dev
bun run build
bun run lint
bun run typecheck
bun run test
bun run test:coverage
bun run check
bun run verify:l1-gate
bun run release -- --dry-run
```

### Verification

Quality follows System1 v1.3.0 Native Mode (`nocoo/base-ci v2026.15`) in `.github/workflows/quality-slots.yml` and `.github/workflows/ci.yml`. Statuses: `enforced`, `planned`, `manual`, `N/A`.

| Slot              | Status   | Evidence                                                                                           |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `S1` Types        | enforced | `bun run typecheck` (pre-commit + CI)                                                              |
| `S2` Lint         | enforced | `bun run lint` (pre-commit + CI)                                                                   |
| `S3` Workflow     | enforced | SHA-pinned workflow action check in CI                                                             |
| `G1` Secrets      | enforced | `gitleaks` scan in CI                                                                              |
| `G2` Dependencies | enforced | `osv-scanner` scan (`bun.lock`) in CI                                                              |
| `B1` Build        | enforced | `bun run build` in CI                                                                              |
| `L1` Unit         | enforced | `bun run test:coverage` + `scripts/unit-coverage-gate.ts` (≥95% floors) + `bun run verify:l1-gate` |
| `L2` Runtime      | N/A      | Static assets deployed to Cloudflare Worker                                                        |
| `L3` Integration  | N/A      | Static site without application API                                                                |
| `L4` E2E          | planned  | Playwright config ready; `tests/e2e` not yet wired in CI                                           |
| `P1` Package      | N/A      | Private repo, not published to npm                                                                 |
| `Z1` Gate         | enforced | `quality / Z1: Gate` required status check on `main` (includes `pre-commit-gate-proof`)            |

Entrypoint: Husky `.husky/pre-commit` materialises the git index into an owned snapshot under `$TMPDIR/chamelo-index.*`, symlinks `node_modules`, then runs `bun run lint`, `bun run typecheck`, and `bun scripts/unit-coverage-gate.ts` with a **25s** child timeout (exit **124** on expiry, **127** if `bun` is missing). `bun run check` is the same three steps for local/CI quality. Repeatable proof: `bun run verify:l1-gate`.

## Local And Deployment

- Local: `https://chamelo.dev.hexly.ai` -> `127.0.0.1:7061`.
- Reserved test ports: E2E `17061`, browser/BDD `27061`.
- Keep normal dev servers in the current Herdr space's `dev server` tab.
- Caddy mapping is maintained in `/opt/homebrew/etc/Caddyfile` and `../workflow/caddy/Caddyfile`. Existing wildcard DNS and certificates cover the local hostname; no certificate regeneration is required.
- `nmem` was unavailable during initial allocation. Ports were checked against both Caddyfiles and bind availability; memory registration is pending.
- Production: `chamelo.hexly.ai`, Cloudflare Worker static assets. Main-push CI success triggers CD through the pinned `base-ci` workflows; do not push unfinished work assuming it is deployment-free. Publishing requires authorization; use CD rather than a local deployment.
- `package.json` is the sole authoritative version. Stage only explicit task paths and make passing atomic commits; do not push unless asked.
- `/api/live` is a versioned static-build liveness artifact, not an Azure or database probe. See [versioning and release](docs/releasing.md); the release script prepares a local commit only.

## Retrospective

Record failures and lessons in root `Retrospective.md`, not this handbook.
