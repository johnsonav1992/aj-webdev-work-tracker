---
name: project-types-and-utils
description: Place TypeScript types and utility functions at the right scope in this work tracker. Use when creating, moving, or reviewing types or helpers.
---

# Project Types and Utilities

Keep types and helpers close to their consumers until they are genuinely shared.

## Placement

- Keep function parameter and return annotations, component prop types, and small types used only by one implementation alongside that implementation.
- Every component must declare a named props `type` or `interface` immediately above its component function and pass it as `Handle<ComponentProps>`; do not inline an object type inside `Handle`.
- Put feature-specific types and helpers inside the feature or route folder that owns them, such as `app/actions/home/`. Use focused files such as `home.types.ts` or `home.utils.ts` when the definitions are substantial or shared across files in that feature.
- Put genuinely cross-feature types in `app/types/` and cross-feature helpers in `app/utils/`. Add those directories only when there is a real shared need.
- Keep database types, auth types, theme types, and browser-only types with their owning subsystem. Do not pull them into a generic root-level type file.
- Avoid catch-all `types.ts` or `utils.ts` files. Name shared files for the concepts they contain and keep unrelated domains separate.

## Sharing threshold

Before moving a type or helper upward, identify its current consumers. Generalize it only when multiple modules share the same concept and behavior; avoid speculative abstractions built for a single call site. Prefer type-only imports for types that do not need runtime values, and keep server-only or browser-only dependencies on the correct side of the boundary.
