# AJ Webdev Work Tracker

A private workbench for tracking freelance clients, projects, payments, and time. The current Remix 3 starter slice includes an illustrative overview dashboard, a browser-only timer interaction, and reusable theme/UI primitives.

The initial product requirements and still-open technology decisions are in [`docs/requirements.md`](docs/requirements.md).

## Current state

- The overview dashboard uses illustrative data only.
- The timer runs in the current browser session and does not save entries.
- Authentication, persistence, payment processing, and deployment are not implemented or selected yet.

## Remix structure

- `app/routes.ts` defines the route contract.
- `app/router.ts` connects routes, middleware, and the controller.
- `app/actions/controller.tsx` owns top-level route actions.
- `app/actions/home-page.tsx` renders the overview page.
- `app/actions/public/` contains browser-reachable hydrated interactions.
- `app/theme/` contains shared design tokens and common styles.
- `app/ui/` contains reusable interface components.

## Commands

```sh
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
```
