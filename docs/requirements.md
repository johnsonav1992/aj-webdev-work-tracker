# AJ Webdev Work Tracker — Initial Requirements

## Vision

A private, dependable workspace for running a freelance web development business. It should make it easy to keep client and project details current, record money accurately, and capture work as it happens. The experience should feel calm, polished, fast, and consistent as the product grows.

## Requested capabilities

- A personal login and account settings.
- Client records with useful contact and business details.
- Projects linked to clients, including work already completed and work in progress.
- Project pricing and a clear history of invoices and payments, including amount, date, and payment method.
- Real-time work tracking so time can be attributed to a client/project and accumulated into accurate hours.
- A future Stripe integration for taking payments and checking invoice/payment status.
- A shared theme and internal component library to keep the product visually consistent.
- A deployable application with a durable database, selected to fit the eventual deployment plan.

## Product principles

- Enter common information once and make it easy to find later.
- Keep money and time records explicit, auditable, and easy to correct.
- Make the current timer and next useful action visible without clutter.
- Keep client, project, invoice, and time-entry relationships clear.
- Start as a single-person business tool; revisit multi-user access only if requested.
- Treat Stripe as a later integration. Manual payment tracking must remain useful on its own.

## First experience

The initial signed-in landing page should summarize active work, unpaid amounts, recently tracked time, and provide a quick way to start a timer. Navigation should make Clients, Projects, Time, Payments, and Settings easy to reach.

## Data concepts to plan for

- Account / user and account preferences.
- Clients.
- Projects, including status, scope/notes, pricing model, and agreed rate or fixed fee.
- Time entries, including start/end, duration, notes, and project association.
- Invoices and payment records, including amounts, dates, methods, statuses, and optional external Stripe identifiers.

## Decisions to confirm before persistence or authentication work

- Database, hosting/deployment target, and migration approach.
- Login method and whether access is strictly one user or may include collaborators later.
- Default currency, timezone, and preferred date/number formats.
- Pricing models to support first (hourly, fixed, retainer, or a combination).
- What an invoice means in the first release: manually entered record, generated invoice, or both.
- Whether timer entries should autosave, support editing/rounding, and how interruptions are handled.
- Stripe scope and timing, including whether to create invoices/payment links or only reconcile externally created payments.

## Initial implementation boundary

The current starter pass establishes a dashboard visual direction, reusable UI primitives, and a demonstrative in-browser timer. The dashboard data is illustrative. No persistent records, real authentication, payment processing, database, or deployment platform are selected or implemented yet.
