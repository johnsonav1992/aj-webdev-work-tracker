# AJ Webdev Work Tracker — Initial Requirements

## Vision

A private, dependable workspace for running a freelance web development business. It should make it easy to keep client and project details current, record money accurately, and capture work as it happens. The experience should feel calm, polished, fast, and consistent as the product grows.

## Requested capabilities

- A personal login and account settings.
- A single owner account for the first release, with ownership relationships designed so additional users can be added later.
- Client records with useful contact and business details.
- Projects linked to clients, including work already completed and work in progress.
- Flexible agreed hourly rates per client, with time logged against projects and a clear history of invoices and payments, including amount, date, and payment method.
- A way to add historical clients and completed projects, with past hours and payments entered against their original dates.
- Real-time work tracking so time can be attributed to a client/project and accumulated into accurate hours.
- A future Stripe integration for taking payments and checking invoice/payment status.
- A shared theme and internal component library to keep the product visually consistent.
- SQLite-compatible data storage: a local database during development and Turso as the intended hosted database.
- A deployable application with a durable database and hosting setup selected to fit the eventual deployment plan.

## Product principles

- Enter common information once and make it easy to find later.
- Keep money and time records explicit, auditable, and easy to correct.
- Make the current timer and next useful action visible without clutter.
- Keep client, project, invoice, and time-entry relationships clear.
- Start with one owner account while keeping account ownership explicit for possible future collaborators.
- Treat Stripe as a later integration. Manual payment tracking must remain useful on its own.

## First experience

The initial signed-in landing page should summarize active work, unpaid amounts, recently tracked time, and provide a quick way to start a timer. Navigation should make Clients, Projects, Time, Payments, and Settings easy to reach.

## Data concepts to plan for

- Account / user and account preferences.
- Clients.
- Projects, including status, scope/notes, pricing model, and agreed rate or fixed fee.
- Time entries, including start/end, duration, notes, project association, and original dates for retrospective entries.
- Invoices and payment records, including amounts, dates, methods, statuses, and optional external Stripe identifiers.

## Database direction

- Use Remix `remix/data-table` with its first-party SQLite connector and SQL migrations for the initial local database.
- Turso is the intended hosted database.
- Remix's SQLite connector expects a synchronous SQLite client. Current Turso server-side clients are async, and Remix documents a custom async driver extension point. Keep domain queries and migrations in the Remix data-table layer, then select/implement the Turso driver once the cloud connection mode is confirmed.
- The eventual cloud path should be checked against the selected Turso product/client and deployment runtime before launch.

## Remaining decisions before authentication and full database integration

- Hosting/deployment target and the Turso connection model / JavaScript client (remote database connection versus local-first sync).
- Login method (the first release is one owner; the data model should allow collaborators later).
- Default currency, timezone, and preferred date/number formats.
- Whether a project may override its client's agreed hourly rate. Historical time entries should preserve the rate used when logged so later rate changes do not rewrite past earnings.
- What an invoice means in the first release: manually entered record, generated invoice, or both.
- Whether timer entries should autosave, support editing/rounding, and how interruptions are handled.
- Whether historical work is entered with individual dated time entries, summarized hours, or both; whether bulk import is needed.
- Stripe scope and timing, including whether to create invoices/payment links or only reconcile externally created payments.

## Initial implementation boundary

The current starter pass establishes a dashboard visual direction, reusable UI primitives, and a demonstrative in-browser timer. The dashboard data is illustrative. No persistent records, real authentication, payment processing, database, or deployment platform are selected or implemented yet.
