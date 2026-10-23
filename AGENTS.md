# Chamelo

A Chinese-cultural colour atlas. Codename: Chameleon. The first edition is Dunhuang Splendour.

## Product Invariants

- Generate original cultural imagery, extract candidate colours, then deliberately curate a usable website theme. Do not present raw pixel extraction as professional colour pairing.
- Every palette includes a source image, six curated swatches, twelve semantic roles, recommended proportions, a website preview, and complete CSS/agent-prompt export.
- `src/data/palettes.ts` is the curated content source. Models and pure services stay separate from React views.
- Current Safari and Chrome, including iPhone Safari, are primary targets. Native responsive layouts and dialogs must not depend on hover. Liquid refraction affects artwork only, never essential text or controls.
- Visual direction: contemporary editorial typography, mineral hues, restrained glass and meaningful density. No inherited UI template or component library is required.
- Desktop viewports at least 1024px wide and 650px tall use a full-width, viewport-height composition. Smaller or zoomed viewports scroll naturally. Keep essential controls visible instead of masking document overflow.
- Interface copy is Chinese; code, documentation and comments are English. Preserve cultural names in content.
- Do not add a login, CMS, public generation API, compatibility wrapper or speculative storage layer without a concrete requirement.

## Generation And Secrets

- Use `gpt-image-2.5-sunburst` for approved artwork. Original PNGs remain unchanged; WebP files are delivery derivatives.
- Store exact prompts and non-secret extraction evidence under `content/`.
- Root `.env` contains `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY` for internal generation only. Never print, track or expose them through `VITE_` variables or client code.
- `bun run artwork:prepare` processes the existing first-edition source without making API calls.

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
```

`bun run check` is the pre-commit entrypoint: Biome with warning rejection, strict TypeScript, and Vitest V8 coverage with statements/branches/functions/lines each >=95%. Husky materializes the index into an owned temporary repository before checking. Coverage scope is pure services and viewmodels; view rendering, event wiring and editorial scripts are outside this first scope. Detailed browser verification and hook rejection probes remain unverified; do not claim an L1 grade or full 6DQ certification from the initial checks.

## Local And Deployment

- Local: `https://chamelo.dev.hexly.ai` -> `127.0.0.1:7061`.
- Reserved test ports: E2E `17061`, browser/BDD `27061`.
- Keep normal dev servers in the current Herdr space's `dev server` tab.
- Caddy mapping is maintained in `/opt/homebrew/etc/Caddyfile` and `../workflow/caddy/Caddyfile`. Existing wildcard DNS and certificates cover the local hostname; no certificate regeneration is required.
- `nmem` was unavailable during initial allocation. Ports were checked against both Caddyfiles and bind availability; memory registration is pending.
- Production: `chamelo.hexly.ai`, future Cloudflare Worker static assets. `wrangler.jsonc` is prepared; no deployment or DNS mutation is authorized implicitly.
- `package.json` is the sole authoritative version. Stage only explicit task paths and make passing atomic commits; do not push unless asked.

## Retrospective

Record failures and lessons in root `Retrospective.md`, not this handbook.
