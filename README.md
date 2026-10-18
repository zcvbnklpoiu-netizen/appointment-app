# MediBook clinic platform

Responsive multi-doctor clinic directory and appointment application built with Next.js App Router. Public pages keep the existing demonstration directory available until live doctor records are configured. Booking, account, and dashboard operations use the server and database.

## Runtime architecture

This project uses the Next.js Node.js server. Static export has been removed because static hosting cannot run the authenticated write APIs, database-backed pages, or appointment transactions. The app supports a configurable base path. Local development keeps `/appointment-app`; a root-domain deployment leaves `NEXT_PUBLIC_BASE_PATH` empty or unset.

Prisma 7 supports two database profiles. Local development defaults to SQLite through the BetterSQLite3 driver adapter. Production can use PostgreSQL through `@prisma/adapter-pg`. SQLite and PostgreSQL have separate schemas and migration histories; changing the provider does not copy data between them.

## Source layout

- `app/` contains App Router pages, layouts, reusable interface components, and `app/api/` route handlers.
- `app/dashboard/` contains role-specific dashboard views and their client-side management controls.
- `lib/` contains shared validation and date utilities, Prisma access, and authentication helpers. Database and permission checks stay in server route handlers and server-only modules.
- `prisma/` contains the schema and additive migrations; `scripts/` contains local setup and administrator bootstrap commands.

## Doctor profile data

Migration `20261017190000_doctor_professional_profile` adds nullable professional title, training, subspecialties, services, procedures, languages, practice start year, and procedure count fields to `Doctor`. Existing doctor rows are retained and receive no invented profile details. List fields are entered one item per line; blank values are omitted from the public profile. A procedure count is optional and should only be entered from practice supplied records. Doctors can edit their own professional fields from the doctor dashboard; administrators can edit the same fields in doctor management. Both changes are authorized server-side and audited.

The current scheduling flow supports weekly working windows and generated appointment slots. Per-date leave and recurring break periods are not yet represented in the schema; do not treat a published slot list as incorporating those exclusions until that scheduling work is added.

## Local setup

Requirements: Node.js 20.6 or later and npm.

```sh
npm install
Copy-Item .env.example .env   # PowerShell; on macOS/Linux use: cp .env.example .env
```

Edit `.env` and set a unique random `SESSION_SECRET` of at least 32 characters. Keep `.env` private. The example database URL is `file:./dev.db` at the project root. The example keeps the local `/appointment-app` base path.

Apply the SQLite migrations and start the app:

```sh
npm run db:deploy
npm run dev
```

Open `http://localhost:3000/appointment-app`.

## Vercel and PostgreSQL preparation

Create or connect a persistent PostgreSQL database in the hosting provider, then configure these Vercel environment variables for each intended environment. Use the provider's pooled URL as `DATABASE_URL` and its direct URL as `DIRECT_URL` when supplied. Never put credentials in source control or share them in logs.

```dotenv
DATABASE_PROVIDER="postgresql"
DATABASE_URL="<provider-pooled-postgresql-url>"
DIRECT_URL="<provider-direct-postgresql-url>"
BETTER_AUTH_URL="https://<your-production-domain>"
NEXT_PUBLIC_SITE_URL="https://<your-production-domain>"
NEXT_PUBLIC_BASE_PATH=""
SESSION_SECRET="<unique-random-secret-at-least-32-characters>"
```

`BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` must be the same HTTPS origin without a path. `SESSION_SECRET` must be unique and at least 32 characters. The root-domain deployment uses an empty base path; the local setting remains `/appointment-app`. Prisma Client generation for both providers runs before `npm run build`.

This baseline is for a new, empty PostgreSQL database. If the chosen database already contains application tables or data, stop and inspect it before running migrations. After PostgreSQL is configured, review the baseline migration and apply it once with `npm run db:deploy` in an environment that has those variables. This applies only to the configured PostgreSQL database; it does not import local SQLite records. Confirm the target before running it. Connect the existing GitHub repository to Vercel and set its environment variables before creating a deployment.

For production builds outside Vercel, set the same variables before building and starting:

```sh
npm run build
npm run start
```

Never run `prisma migrate reset` against a database with data. Use `npm run db:migrate` for a development migration, review the provider-specific migration folder, then use `npm run db:deploy` in a controlled deployment. Back up production data before applying migrations.

## Initial administrator and clinic setup

Create the first administrator only after migrations have been applied. Choose the email address that the administrator will use to sign in, then set these private values in `.env` and run `npm run admin:create`:

```dotenv
ADMIN_EMAIL="your-chosen-admin-email@example.com"
ADMIN_NAME="Clinic Administrator"
ADMIN_PASSWORD="use-a-unique-password-of-at-least-12-characters"
```

The bootstrap command creates the first administrator only; it refuses to run if an administrator already exists and never modifies an existing account. `ADMIN_EMAIL` is the sign-in email. Sign in at `/appointment-app/login` locally (or `/login` at the production root), then create a specialty, create the doctor profile with the practice-supplied details, set weekly availability, and generate future appointment slots. Link a doctor account if that clinician needs the doctor dashboard. Published, future slots are then available to authenticated patients. Patients register through the public registration form. Public sample doctor cards are demonstrations; only database-backed doctor records have bookable slots.

## Available scripts

- `npm run lint` — ESLint
- `npx tsc --noEmit` — TypeScript check
- `npm test` — unit tests
- `npm run test:integration` — isolated SQLite/API integration test against the production build (run `npm run build` first)
- `npm run db:generate` — regenerate Prisma Client
- `npm run db:migrate` — create/apply a development migration
- `npm run db:deploy` — apply checked-in migrations without resetting data
- `npm run db:studio` — Prisma Studio

The integration test creates a uniquely named database under `tests/` and leaves it in place for inspection. It does not use the configured development database.

## Contact support configuration

The public contact form saves submissions in the `ContactSubmission` table and returns a reference number only after the database write succeeds. Administrators can search the private inbox, review message content, and update its status; those changes create audit events. Public requests are limited to five per client address per hour using `ContactRateLimit`. Configure the hosting proxy to replace `X-Forwarded-For` with the actual client address; otherwise per-client rate limits may be inaccurate. Keep `SESSION_SECRET` private because it keys the stored rate-limit identifier.

WhatsApp is optional. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to a real support number in international digits only (8–15 digits, no plus sign or punctuation). If unset or invalid, the page clearly states it is not configured. No message email delivery is configured; saved messages remain available to administrators in the dashboard.

The contact page embeds OpenStreetMap around central Cairo as a geographic reference, explicitly not as a MediaBook office address.

## Security and operational notes

Roles are enforced in server handlers and server-rendered dashboard data. Patient endpoints scope records to the signed-in patient's profile. Appointment reservation uses a database transaction and conditional slot update so concurrent requests cannot both claim the same published slot. Status changes are recorded in the audit table.

Configure HTTPS, secure backups, database monitoring, outbound email/password recovery, and a shared production database before serving real patients. Email verification and password reset delivery are not configured in this local setup. Do not enter real patient information into an unconfigured deployment.
