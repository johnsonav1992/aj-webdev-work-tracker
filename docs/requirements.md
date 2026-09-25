# AJ Webdev Work Tracker — Initial Requirements

## Vision

A private, dependable workspace for running a freelance web development business. It should make it easy to keep client and project details current, record money accurately, and capture work as it happens. The experience should feel calm, polished, fast, and consistent as the product grows.

## First release

- Personal login using both Google and email/password, with account settings.
- One owner account initially, with account ownership structured to support additional users later.
- Client records and projects, including active work and projects completed before the app existed.
- An agreed hourly rate per client. Time entries are associated with a project and preserve the rate used when recorded, so later rate changes do not rewrite historical totals.
- Client rates are the source of truth for their projects; projects do not override a client rate in the initial model.
- A real-time timer and manual time entry. Past work must be enterable manually with its original date; no automatic import is required.
- Manual historical time is entered as a duration; timer entries may additionally retain their exact start and end instants.
- Manual payment records associated with a client and optionally a project, including amount, date, and payment method.
- A shared theme and internal component library.
- Local SQLite storage for development and the initial app. Turso is a future hosting direction, documented below.

## Out of scope for the first release

- Invoice creation, invoice tracking, and Stripe integration. Keep Stripe as a future direction, but do not build invoice workflows yet.
- Multi-user collaboration. Keep the account model ready for it without adding team management now.
- Bulk historical data import. Enter past clients, projects, time, and payments through the app.

## Product principles

- Enter common information once and make it easy to find later.
- Keep money and time records explicit, auditable, and easy to correct.
- Make the current timer and next useful action visible without clutter.
- Keep client, project, and time-entry relationships clear.
- Prefer fast manual entry for the initial data population and historic backlog.

## First experience

The signed-in landing page should summarize active work, recently tracked time, and offer a quick way to start a timer. Clients, Projects, Time, Payments, and Settings should be easy to reach.

## Data concepts

- Account and account preferences, with one owner in the first release.
- Users and authentication identities, allowing the same user to sign in through Google or email/password.
- Clients with their agreed hourly rate and contact details.
- Projects linked to clients, including status, notes, and start/completion dates.
- Time entries linked to projects, with start/end or manually entered duration, notes, original work date, and an hourly-rate snapshot.
- Payments linked to clients and optionally projects, with amount, date, method, and notes. Currency must be explicit before real financial records are entered.
- Currency is stored explicitly on money records, with USD as the initial account/client default.

## Database and Turso path

- Use Remix `remix/data-table` with its first-party SQLite connector and SQL-first migrations for the initial local database.
- Keep the local database file out of version control and provide a clear local setup/migration command.
- Turso is a future hosted database direction, not part of this first local-data slice.
- Keep domain queries and migrations behind the Remix data-table layer. Before deploying to Turso, choose the hosted Turso product and connection mode, then implement and verify the appropriate driver. Remix's bundled SQLite connector expects a synchronous client; the current Turso server-side clients are asynchronous, and Remix documents a custom async driver extension point.
- The deployment platform and Turso client remain open decisions.

## Still to decide

- Timezone and date/number display formats.
- Timer autosave, editing, rounding, and interruption behavior.
- Hosting and Turso connection details when the app is ready to deploy.

## Current implementation boundary

The current dashboard establishes a visual direction, reusable UI primitives, and a demonstrative in-browser timer. Dashboard values are illustrative. Persistent records and real authentication are the next application foundation; invoice and payment processing remain out of scope.
