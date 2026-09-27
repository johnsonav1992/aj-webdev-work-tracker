# AJ Webdev Work Tracker

A private work tracker for freelance clients, projects, payments, and time, built with Remix 3.

The initial product requirements and still-open technology decisions are in [`docs/requirements.md`](docs/requirements.md).

## Current state

- The overview, client, project, and time pages use account-scoped data from the local database.
- Time can be tracked with the start/pause/resume/stop timer on Overview or entered manually on the Time page. Manual entries keep the selected work date and duration without requiring exact start and end times.
- Completed entries retain the hourly-rate snapshot used for their project at entry creation.
- Google OAuth login and first-time signup are implemented when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured. First-time Google sign-in creates a workspace for that user.
- Email/password login remains available for existing credentials; the initial account is created through Google sign-up.
- The local SQLite connector, account-scoped schema, and SQL-first migration are in place. Run `npm run db:migrate` to initialize the local database and `npm run db:status` to inspect migration state.
- Invoices, Stripe, and deployment are future work. The planned database path is local SQLite through Remix's SQLite connector, with the future Turso driver documented in `docs/requirements.md`.

## Remix structure

- `app/routes.ts` defines the route contract.
- `app/router.ts` connects routes, middleware, and the controller.
- `app/actions/controller.tsx` owns top-level route actions.
- `app/actions/home/components/` contains the overview page and its feature components.
- `app/actions/time/` contains time-entry routes and the time page.
- `app/actions/home/public/` contains browser-reachable timer interactions for the home feature.
- `app/actions/public/entry.ts` starts the app-wide browser runtime.
- `app/theme/` contains shared design tokens and common styles.
- `app/ui/` contains reusable interface components.

Invoices, Stripe integration, and deployment are future work.

## Commands

```sh
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
npm run lint
npm run format
npm run format:check
npm run check
npm run db:status
npm run db:migrate
```
