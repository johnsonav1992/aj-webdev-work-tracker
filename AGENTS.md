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

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.

Use the project-specific skills under `./.agents/skills/` for these concerns:

- `project-theming` when adding or changing visual styles and design tokens
- `project-components` when deciding where UI components belong or how they should behave in Remix
- `project-types-and-utils` when placing shared, module-scoped, and inline types or utilities
- `project-composition` when structuring pages and splitting feature JSX into components

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to controllers and installs the standard Remix UI renderer used by actions
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router smoke test
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI
- `app/actions/public/` contains browser-reachable source and hydrated interactions; keep database access and secrets in server-only modules
- `app/db/` owns database setup, domain tables, and SQL-first migrations
- `app/theme/` contains shared design tokens and common styles
- `app/ui/` contains reusable interface components
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, `app/ui/`, and `test/` only when you need them.

Use `npm run lint` for Oxlint and `npm run format` for Oxfmt. `npm run format:check` and `npm run lint` are non-mutating; `npm run check` runs both checks.
