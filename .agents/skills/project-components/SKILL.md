---
name: project-components
description: Choose component boundaries and implement reusable UI with this app's Remix 3 component model. Use when adding, moving, or reviewing UI components.
---

# Project Components

Follow the Remix 3 component runtime described in [the project Remix skill](../remix/SKILL.md). These rules decide where a component belongs and what it may know.

## Component boundaries

- `app/ui/` is for dumb, reusable presentation primitives that are not owned by a particular feature: examples include text fields, buttons, panels, avatars, and status badges.
- Keep feature-specific UI beside its route or feature code, such as `app/actions/home/`. A component that knows about projects, clients, payments, authentication, a route, or a domain workflow belongs with that feature even if it renders JSX.
- Keep components presentational. Load database data and secrets in server-only modules and route controllers; pass the component only the props it needs to render.
- Do not move a component into `app/ui/` just to shorten a page. Move it there only when its behavior and meaning are genuinely reusable across features.
- Shared UI components own their canonical styling inside the component. Consumers choose a typed variant or size (for example, `<Button variant='quiet'>`) instead of importing a shared style recipe and applying it to raw elements. Keep one-off layout adjustments local to the consumer through a narrow styling prop when needed.

## Remix UI behavior

- A component setup function runs once and returns its render function. Read changing values from `handle.props` inside that render function.
- Use Remix UI primitives and Web APIs. Do not use React hooks, React lifecycle assumptions, or stateful component patterns from another framework.
- Keep component props explicit and serializable when they cross the server/browser boundary. Put the component's prop shape next to its component.
- Declare a named props `type` or `interface` immediately above every component function, and use `Handle<ThatProps>`; do not inline an object type inside `Handle`.
- Hydrated behavior belongs in the appropriate browser-reachable module and should be explicit; server-rendered markup alone is not interactive.

Before adding a shared primitive, inspect `app/ui/` for an existing component with the same role and extend it when that keeps its API coherent.
