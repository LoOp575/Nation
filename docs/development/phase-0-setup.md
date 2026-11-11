# Phase 0: Application Foundation

## What this commit establishes

- Next.js App Router + TypeScript application scaffold.
- Supabase SSR browser/server client factories using the publishable key.
- Environment validation that allows the app shell to render before credentials exist.
- Initial PostgreSQL migration for source catalog, ingestion jobs, raw documents, indicators, observations, revisions, news, events, evidence, and audit logs.
- RLS on every table created by the migration.
- Public read-only grants for explicitly published dashboard records.
- Private operational tables with no anon/authenticated table grants.
- CI workflow for TypeScript checks and production build.

## Local setup

Requirements: Node.js 22 and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The dashboard intentionally displays "Menunggu data" until a real project and verified source connectors are configured. Do not add demo values that look like national observations.

Set these variables in `.env.local` after creating the dedicated National Pulse Supabase project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_*` variable or browser bundle.

## Supabase migration

The migration is in `supabase/migrations/`. Once the dedicated project exists and is linked with the Supabase CLI:

```bash
supabase link --project-ref YOUR_NATIONAL_PULSE_PROJECT_REF
supabase db push
```

For a local disposable database:

```bash
supabase start
supabase db reset
```

Then run the SQL assertions in `supabase/tests/001_initial_security.sql` using the local SQL editor/psql connection. They check that RLS is enabled on all initial tables, private operational tables are not readable by public roles, and public roles have no write grants.

## Security contract

- RLS is enabled on all tables in the exposed `public` schema created here.
- Public roles can only SELECT the published dashboard surface.
- Draft/review/archived rows are not exposed by the read policies.
- Ingestion jobs, raw documents, revision history, and audit logs are service-role operational data.
- No service-role/secret key is used by this web app.
- RLS and SQL grants are separate controls; both are configured explicitly.

## Not yet complete

- No National Pulse Supabase project has been selected or provisioned.
- Migration has not been applied to a remote database.
- No real source connector or official observation has been ingested.
- No authenticated analyst/admin role model has been introduced.
- No deployment environment variables or Vercel project have been configured.
- A dependency lockfile must be generated with `npm install` and committed before production deployment.

## Exit checks

```bash
npm run typecheck
npm run build
```

Run the SQL assertions only after applying the migration to a disposable/local database or the dedicated project.
