# Changelog

## Unreleased

- Rename the interface to 守宫 and drop the English wordmark from the brand, footer and modal kicker; repository, package and domain keep the `chamelo` slug. Title, `aria-label` set and brand docs follow.
- Adopt the Hexly-approved identity in the header (mark-64), browser tab (32/16) and iOS icon, and retire the hand-drawn `C` arc favicon.
- Add four header icon actions: the Hexly family link, the GitHub repository, a light/dark appearance switch and an icon-only guide button. Below 760px the icon row replaces the text navigation.
- Add a per-palette light/dark switch: `src/services/appearance.ts` derives the opposite mode from the palette's swatch evidence and keeps every contrast pair above AA; the curated tokens stay authoritative for exports and the mini preview.
- Follow the effective page colour in `theme-color` so mobile browser chrome matches the palette.

- Give every palette a surface mode: 黑漆螺钿, 玄金夜锦, 秋江渔火, 榆林幽蓝 and 醉里挑灯 are now dark pages, the rest stay light. The mode is authored per scene, exported through `color-scheme` and the agent prompt, and kept honest by a contract test.
- Align the column footnotes in the desktop composition with a shared `--feature-footnote` row, so the artwork caption and the preview footnote sit on one line.
- Publish 朱漆鎏金 as the second curated palette: an imagined Song palace hall rather than a tabletop study, with its original artwork, extracted evidence and a 60/30/10 cream, vermilion and gilt theme.
- Publish 黑漆螺钿, 犀皮流霞, 玄金夜锦, 紫檀嵌螺, 月白缠枝 and 绛红团花 as imagined cultural scenes — a moonlit chamber, a garden corridor at dusk, a banquet hall, a scholar's studio, a moonlit courtyard and a hall dressed for a festival — each with its original artwork, extraction evidence and a curated 60/30/10 theme.
- Publish twelve more scenes, bringing the atlas to twenty curated palettes: a porcelain workshop (青花缠枝), a kesi loom (缂丝云鹤), a rainlit study with a Ru water bowl (汝窑开片), an indigo dye yard (蓝白缬染), a ginkgo palace lane (宫墙银杏), a rain lake (天青烟雨), a snowbound palace court (宫苑初雪), an autumn river at night (秋江渔火), a temple caisson ceiling (藻井莲华), a grotto wall in ultramarine (榆林幽蓝), the moon palace terrace (广寒清辉) and a lamplit study (醉里挑灯).
- Fix the palette authoring style as a project skill at `.agents/skills/chamelo-palette/SKILL.md` and point `AGENTS.md` at it.

## v0.1.1 - 2026-10-24

- 1c5af60 feat: page with arrow keys and mark ungenerated concepts with a local-only ribbon
- bec2c83 feat: collect 77 draft colour concepts with placeholder views
- b157573 docs: record the first CD release evidence

## v0.1.0 - 2026-10-24

- Establish the first cultural palette, original artwork, semantic theme and agent exports.
- Fit the desktop atlas to the viewport while retaining natural mobile scrolling.
- Follow the selected palette across the site with interpolated semantic colours, layered gradients and artwork crossfades.
- Derive the footer version and uncached `/api/live` artifact from the root manifest.
- Add local release preparation following the system0 version policy; the first publication is delivered through CD from a proven main CI run.
