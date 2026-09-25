---
name: project-theming
description: Apply or review this work tracker's TypeScript-first design tokens and shared styles. Use when changing themes, CSS, visual tokens, or component styling.
---

# Project Theming

Keep styling consistent with the app's typed Remix UI theme. The source of truth is `app/theme/tokens.ts`.

## Conventions

- Read `app/theme/tokens.ts` and nearby component styles before adding a value or recipe.
- Use `themeTokens` for colors, spacing, typography, shapes, and other design values. Use the shared `theme` and style recipes where they fit.
- Express styles with Remix UI's `css(...)` and `mix` APIs. Do not introduce React styling assumptions, a second token system, or a CSS framework for a local styling need.
- Prefer an existing token or recipe over a repeated literal. Add a token only when the value represents a reusable design decision, give it a precise type, and use it in the same change.
- Keep one-off CSS values for layout geometry or genuinely unique effects when no design token represents them. Avoid copying palette, spacing, font, or radius values into components.
- Keep the theme lean: remove a token or shared style only after checking that it has no remaining references.

## Review

For a styling change, check both the theme definition and its consumers. Look for duplicate literals, unused tokens, and components bypassing established shared styles. Preserve responsive behavior and the existing visual language unless the request calls for a redesign.
