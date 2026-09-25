---
name: project-composition
description: Structure route pages and decide when to split Remix UI composition into feature components. Use when building or reviewing large JSX/render functions.
---

# Project Composition

Keep pages easy to scan by composing focused components, while avoiding fragmentation that obscures the feature.

## Composition rules

- Let route-owned page components coordinate the page structure and data passed from the controller.
- Split a long render function when a section has its own meaning, behavior, or reusable boundary, or when extracting it makes the parent substantially easier to understand.
- Keep feature-specific sections in their feature folder (for example, `app/actions/home/`). Only move a component to `app/ui/` when it is generic and useful beyond that feature; follow `project-components` for that decision.
- Keep small, one-use markup inline when naming and extracting it would add indirection without clarifying the page.
- Avoid both extremes: a single file containing an entire complex screen, and a file for every wrapper, label, or handful of static elements.
- Pass section data and actions explicitly. Keep database loading, route decisions, and browser behavior in their owning layers rather than hiding them in a visual subcomponent.

## Review

Read the parent page from top to bottom. Its component tree should make the page's major sections apparent, and each extracted component should have a clear responsibility and owner.
