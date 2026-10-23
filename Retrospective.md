# Retrospective

## 2026-10-24 - Measure the transformed image, not the source

While sampling colour regions, calling `sharp(source).extract(region).stats()` returned the same mean for different crops. Sharp statistics were reading the input rather than the queued transform. The identical values exposed the mistake before they were adopted as palette evidence.

Materializing each crop with `toBuffer()` and passing that buffer to a new Sharp instance produced the intended regional statistics. For future image analysis, materialize the transformation before measuring it and compare at least two visibly different regions. Whole-image quantization and curated colour roles remain separate evidence.

## 2026-10-24 - Inspect automatic configuration migrations

Biome 2.5.15 migrated `recommended: true` to `preset: "none"`, unexpectedly disabling recommended lint rules. Comparing the configuration and vanished diagnostics exposed the regression; the preset was explicitly restored to `recommended` before accepting any check result. Inspect generated configuration changes, not only the migration command's exit status.

## 2026-10-24 - Size the actual glass-filter surface

Making the source image absolutely positioned during the viewport-fit adjustment collapsed the liquid-glass library's internal filtered wrapper to zero height. The first visual capture showed a blank image even though the page dimensions were correct. The image now stays in flow and its filtered wrapper receives the available height. For third-party visual effects, inspect the actual DOM surface and image rendering, not only outer container dimensions.
