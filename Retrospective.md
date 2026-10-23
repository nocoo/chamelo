# Retrospective

## 2026-10-24 - Measure the transformed image, not the source

While sampling colour regions, calling `sharp(source).extract(region).stats()` returned the same mean for different crops. Sharp statistics were reading the input rather than the queued transform. The identical values exposed the mistake before they were adopted as palette evidence.

Materializing each crop with `toBuffer()` and passing that buffer to a new Sharp instance produced the intended regional statistics. For future image analysis, materialize the transformation before measuring it and compare at least two visibly different regions. Whole-image quantization and curated colour roles remain separate evidence.

## 2026-10-24 - Inspect automatic configuration migrations

Biome 2.5.15 migrated `recommended: true` to `preset: "none"`, unexpectedly disabling recommended lint rules. Comparing the configuration and vanished diagnostics exposed the regression; the preset was explicitly restored to `recommended` before accepting any check result. Inspect generated configuration changes, not only the migration command's exit status.

## 2026-10-24 - Size the actual glass-filter surface

Making the source image absolutely positioned during the viewport-fit adjustment collapsed the liquid-glass library's internal filtered wrapper to zero height. The first visual capture showed a blank image even though the page dimensions were correct. The image now stays in flow and its filtered wrapper receives the available height. For third-party visual effects, inspect the actual DOM surface and image rendering, not only outer container dimensions.

## 2026-10-24 - Avoid zsh's reserved path variable

A read-only workflow download loop used `path` as its iterator. In zsh, that variable is tied to `PATH`, so assigning a filename removed command lookup and stopped the loop before any workflow files were downloaded. The loop now uses `file`. Use non-reserved iterator names in shell commands and keep dependent commands fail-fast; no deployment or credential change occurred.

## 2026-10-24 - Environment secrets still need an explicit caller mapping

The first CD run failed at `Require Cloudflare credentials` with both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` empty, even though the `production` environment already held them. The caller passed no `secrets:` block to the reusable `deploy-worker.yml`, and declaring `environment: production` inside the called workflow did not expose those environment secrets to the job.

Forwarding the same two names from the caller (`secrets: CLOUDFLARE_API_TOKEN/CLOUDFLARE_ACCOUNT_ID`) made the identical secrets visible, matching the older `wooly` release workflow. When wiring environment secrets into a reusable workflow, verify the caller mapping and read the credential step of the first real run instead of assuming environment context alone injects them.

## 2026-10-24 - Fix an OSV finding with an override, and regenerate the lockfile from the public registry

The security gate failed on `undici@7.29.1` (one high and two moderate advisories, fixed in 7.30.1). It arrives only through `miniflare`, which pins that exact version, and Wrangler 4.151.1 is already the latest release, so bumping the direct dependency could not resolve it. A `bun` override to `7.30.1` fixed the scan, following the same choice already recorded in `wooly` and `otter`.

The first attempt resolved the override through the internal mirror and rewrote hundreds of lockfile entries with mirror tarball URLs, which the release script rejects. Regenerating against the default registry afterwards kept the diff to the override plus the single `undici` entry. Reproduce dependency changes with the default registry whenever reachable, and inspect `bun.lock` for absolute URLs before committing.
