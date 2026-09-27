---
name: project-types-and-utils
description: Place TypeScript types and utility functions at the right scope in this work tracker. Use when creating, moving, or reviewing types or helpers.
---

# Project Types and Utilities

Keep types and helpers close to their consumers until they are genuinely shared.

## Placement

- Keep function parameter and return annotations, component prop types, and small types used only by one implementation alongside that implementation.
- Every component must declare a named props `type` or `interface` immediately above its component function and pass it as `Handle<ComponentProps>`; do not inline an object type inside `Handle`.
- Put reusable feature/domain types in a `types/` folder owned by that feature or subsystem, such as `app/actions/projects/types/`, `app/db/types/`, `app/auth/types/`, and `app/theme/types/`.
- Keep component props immediately above their component and function-specific parameter types beside the function. These are the intentional exceptions to the `types/` folder rule.
- Keep database types, auth types, theme types, and browser-only types with their owning subsystem. Use `app/types/` only for types genuinely shared across unrelated features; do not make it a catch-all.
- Put genuinely cross-feature helpers in focused files under `app/utils/`. Keep feature-only helpers in the feature that owns them. Name files after one concept, such as `format-duration.ts` or `payment-method-label.ts`, rather than collecting unrelated helpers in `utils.ts`.
- Avoid catch-all `types.ts` or `utils.ts` files. Name shared files for the concepts they contain and keep unrelated domains separate.

## Sharing threshold

Before moving a type or helper upward, identify its current consumers. When the same behavior is implemented in multiple places, move it to one scoped source of truth and update all consumers. Generalize only when multiple modules share the same concept and behavior; avoid speculative abstractions built for a single call site. Similar-looking behavior with different semantics, such as a rounded work duration and a ticking `HH:MM:SS` timer, should remain separate. Prefer type-only imports for types that do not need runtime values, and keep server-only or browser-only dependencies on the correct side of the boundary.

For date and time logic, follow the Temporal rule in the repository's `AGENTS.md`. Import runtime APIs from the shared Temporal adapter; keep implementation-specific types in its type contract and do not import the polyfill from feature code.
