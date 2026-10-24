import {
  type Palette,
  type PublicationEntry,
  type ThemeToken,
  tokenLabels,
} from '../models/palette';
import { formatColor } from './colors';

export function createCss(palette: Palette): string {
  const variables = Object.entries(palette.theme)
    .map(([token, color]) => `  --color-${token}: ${color};`)
    .join('\n');

  return `:root {\n${variables}\n}`;
}

export function createAgentPrompt(palette: PublicationEntry): string {
  const swatches = palette.swatches
    .map((swatch) => {
      const formats = (['hex', 'rgb', 'hsl', 'oklch'] as const)
        .map((format) => `${format.toUpperCase()}: ${formatColor(swatch.hex, format)}`)
        .join(' | ');
      return `- ${swatch.name} (${swatch.english}) — ${formats}. Role: ${swatch.role}`;
    })
    .join('\n');

  const semanticTokens = Object.entries(palette.theme)
    .map(([token, color]) => {
      const key = token as ThemeToken;
      return `- ${token} (${tokenLabels[key]}): ${formatColor(color, 'hex')}`;
    })
    .join('\n');

  const distribution = palette.distribution
    .map(
      ({ label, percentage, color, description }) =>
        `- ${label}: ${percentage}% (${color}) — ${description}`,
    )
    .join('\n');

  return `You are a senior visual designer creating an original, high-end, responsive website inspired by the following Chinese cultural palette. Build a refined editorial experience, not a generic template. Use the supplied palette and story as the source of truth; do not invent historical facts, artifacts, or cultural claims.

## Chinese motif and story
- Chinese title: ${palette.name}
- English title: ${palette.english}
- Palette number: ${palette.number}
- Motif/category: ${palette.category}
- Chinese description: ${palette.description}
- Chinese story: ${palette.story}
- Artwork alt text: ${palette.artwork.alt}

## Palette swatches
Use these exact colors and treat their stated roles as guidance:
${swatches}

## Semantic color tokens
Implement every semantic token below. Preserve each role and value; do not omit or silently substitute tokens:
${semanticTokens}

## Visual weight
Use these palette distribution percentages to guide relative visual emphasis, not as mandatory pixel or CSS percentages:
${distribution}

## Art direction
${palette.artDirection}
Use Noto Serif SC for expressive Chinese display typography and Manrope for interface and supporting text, with sensible fallbacks. Build a coherent spatial system with aligned grids, intentional rhythm, and carefully layered surfaces. Use glass only as a restrained decorative material; never put essential reading content on a low-contrast translucent surface.

## Responsive behavior
Design mobile-first and adapt the hierarchy, spacing, navigation, and palette compositions for narrow, medium, and wide viewports. Prevent horizontal overflow, preserve readable line lengths, and keep every interactive target usable by touch and keyboard. Respect reduced-motion preferences.

## Contrast and interaction requirements
Use text on background/surface, on-primary on primary, and on-accent on accent. Use primary-hover for the primary action's hover state. Use focus as a clearly visible keyboard-focus outline against both background and surface; do not remove native focus visibility without an equally clear replacement. Check actual foreground/background pairs at their rendered opacity and size: target at least 4.5:1 for text and 3:1 for focus indicators and other meaningful non-text indicators. Do not claim that the entire website is WCAG-conformant based only on palette checks. Provide distinct hover, pressed, disabled, and focus states without relying on color alone, and keep transitions subtle and accessible.

## Accuracy and asset constraints
The artwork is an AI interpretation, not historical documentation or evidence. Do not invent an unseen image URL, imply that you inspected an unavailable asset, or fetch an image from an unspecified URL. Use only assets explicitly supplied with the task; otherwise create the visual direction from the textual palette brief. Do not present generated design details as authenticated historical material.`;
}

export function paletteVariables(palette: Palette): Record<string, string> {
  return Object.fromEntries(
    Object.entries(palette.theme).map(([token, color]) => [`--palette-${token}`, color]),
  );
}
