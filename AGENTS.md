# Aj Webdev Work Tracker Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
```

Use `npm run hmr` for live server and browser updates; `npm run dev` only watches and restarts the server. `npm run start` runs in production mode without a separate build step.

## Building Features

### Date and time

- Use the JavaScript Temporal APIs for all date, time, timestamp, and elapsed-time logic. Import `Temporal` from `app/utils/temporal.ts` in server code; browser code should use `app/utils/temporal-browser.ts` to access the native API without bundling the server polyfill. Keep direct polyfill imports inside the Temporal adapter and its type contract only.
- When the supported Node runtime provides native Temporal, the adapter prefers it automatically; remove the polyfill fallback and dependency in the adapter when the app's minimum Node version no longer needs them.
- Use `Temporal.PlainDate` / `Temporal.PlainTime` for date-only and wall-clock values, `Temporal.Instant` for timestamps, `Temporal.ZonedDateTime` with an explicit time zone when converting wall time to an instant, and `Temporal.Duration` for elapsed time and unit conversion.
- Keep existing database boundaries stable: ISO date strings for date-only columns and epoch milliseconds for timestamp columns.
- Do not introduce `Date`, `Date.now()`, legacy Date getters/setters, or `Intl.DateTimeFormat` formatting a `Date`.

### Types, utilities, and shared UI

- Put reusable feature and domain types in a scoped `types/` folder, such as `app/actions/<feature>/types/`, `app/db/types/`, `app/auth/types/`, or `app/theme/types/`. Keep component prop types immediately above their component and function-specific parameter types beside their function.
- Keep helpers in focused files named for one concept. If formatting, status mapping, label generation, initials, or other behavior is duplicated, move the identical behavior to one source of truth and update its consumers. Keep similar-but-different behavior separate when its semantics differ.
- Keep cross-feature helpers in concept-specific files under `app/utils/`; keep feature-only helpers in their feature. Avoid catch-all `types.ts` and `utils.ts` files.
- Use the Node-native `#app/` import alias for cross-folder imports into `app/`; keep short relative imports for adjacent modules. Include the target `.ts` or `.tsx` extension. The package import mapping is in `package.json` and works in both Node and the Remix asset server.
- Put feature components in `app/actions/<feature>/components/`; put app-wide action components such as the document shell in `app/actions/components/`. Keep shared, dumb presentation primitives in `app/ui/`. Components own their canonical styling; represent standard visual differences with typed props (for example, Card padding) and keep route data, href generation, and domain rules in feature modules.
- In component modules, put module-level `css(...)` mix objects below their component functions; keep small, one-use mixes inline in the JSX.
- Before adding a shared component or style, search for an existing equivalent and consolidate exact duplicates when that improves clarity. Keep single-use layout and feature behavior local.
- Keep repeated design values and enumerated visual choices in the theme source of truth. Derive related types from typed value lists instead of maintaining duplicate unions and arrays.

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.

Use the project-specific skills under `./.agents/skills/` for these concerns:

- `project-theming` when adding or changing visual styles and design tokens
- `project-components` when deciding where UI components belong or how they should behave in Remix
- `project-types-and-utils` when placing shared, module-scoped, and inline types or utilities
- `project-composition` when structuring pages and splitting feature JSX into components

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to controllers and installs the standard Remix UI renderer and middleware
- `app/middleware/` contains request middleware installed by the router; keep auth provider setup in `app/auth/`
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router smoke test
- Feature UI belongs in `app/actions/<feature>/components/`; the app-wide document shell belongs in `app/actions/components/document.tsx`
- `app/actions/public/entry.ts` starts the app-wide browser runtime. Put feature-specific browser-reachable source in a `public/` folder inside its feature (for example, `app/actions/home/public/`); root `public/` is for static files served unchanged. Keep database access and secrets in server-only modules
- `app/db/` owns database setup, domain tables, and SQL-first migrations
- `app/theme/` contains shared design tokens and common styles
- `app/ui/` contains reusable interface components
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, `app/ui/`, and `test/` only when you need them.

Use `npm run lint` for Oxlint and `npm run format` for Oxfmt. `npm run format:check` and `npm run lint` are non-mutating; `npm run check` runs both checks.
