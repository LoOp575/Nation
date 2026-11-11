# Phase 0: Application Foundation

## What this phase establishes

- Next.js App Router + TypeScript application scaffold.
- Supabase SSR browser/server client factories using the publishable key.
- Environment validation that allows the app shell to render before credentials exist.
- Initial PostgreSQL schema for source catalog, ingestion jobs, raw documents, indicators, observations, revisions, news, events, evidence, and audit logs.
- RLS on all 10 initial tables.
- Public read-only access only for explicitly published dashboard records.
- Explicit deny policies for private operational tables.
- Foreign-key indexes for expected joins and referential operations.
- GitHub Actions workflow for TypeScript checks and production build.

## Supabase project

A dedicated Supabase project has been provisioned for National Pulse:

- Project name: `National Pulse`
- Project ref: `bwdvzleoggzdmjlkpdsx`
- Region: `ap-southeast-1` (Singapore)
- Database: PostgreSQL 17
- Project status at last verification: `ACTIVE_HEALTHY`
- Project creation estimate returned by Supabase: USD 0/month

This project is separate from the existing `Warung` and `Whale-act` projects. Do not link or migrate either existing project.

## Applied migrations

The following migrations are applied to the dedicated project and versioned in this repository:

1. `20261111103247_initial_national_pulse_foundation`
2. `20261111103315_national_pulse_security_and_fk_indexes`

The initial schema contains 10 tables. All 10 have RLS enabled. Public roles have read-only grants on the published dashboard surface; private operational tables have no public table grants and explicit deny policies. The source registry currently contains two official source entries: BPS WebAPI and Bank Indonesia SEKI. This is source registration only, not active automated ingestion; BPS requires a registered API key and commercial-use approval where applicable, while a permitted stable BI API endpoint has not yet been verified.

## Verification completed

- SQL assertions in `supabase/tests/001_initial_security.sql`: passed.
- Supabase security advisor: no findings after explicit deny policies were added.
- Supabase performance advisor: no foreign-key index findings. It currently reports unused indexes because the new database has not yet received production query traffic; do not remove these indexes solely on this initial empty-database signal.
- GitHub Actions CI: multiple runs after generated database types and live snapshot integration have passed typecheck and production build. The latest migration-file rename has triggered a fresh run and must be checked before release.

## Local setup

Requirements: Node.js 22 and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The project URL is available from the Supabase project settings. Use the publishable key, never the service-role/secret key, in browser-exposed configuration. Never put a service-role/secret key in a `NEXT_PUBLIC_*` variable or browser bundle.

The dashboard reads only PUBLISHED indicators and observations from Supabase, joins source metadata, and displays observation periods, evidence labels, source links, and fetched timestamps. It still displays pending states when no official observations are published. Do not add demo values that look like national observations.

## Remaining gates

- Generate and commit `package-lock.json` with `npm install` before production deployment.
- Re-run CI after the latest repository changes and fix any failures.
- Configure the two public Supabase environment variables in the Vercel project.
- Verify a Vercel preview deployment.
- Implement and verify the first official source ingestion connector. BPS WebAPI and BI SEKI are registered as source entry points only; no automated ingestion is active yet.
- Introduce analyst/admin roles only with a documented authorization model and dedicated RLS tests.

## Security contract

- RLS is enabled on all application tables in the exposed `public` schema.
- Public roles can only SELECT active source catalog entries and explicitly published dashboard records.
- Draft, review, and archived rows are not exposed by public read policies.
- Ingestion jobs, raw documents, revision history, and audit logs are private operational data.
- No service-role/secret key is used by the browser application.
- RLS and SQL grants are separate controls; both are configured explicitly.
