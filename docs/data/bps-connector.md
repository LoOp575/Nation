# BPS WebAPI connector

## Implemented scope

The first connector fetches the BPS province-domain registry and persists the source records in Supabase. This is reference-data ingestion only: it does not yet import statistical indicators or publish indicator observations.

Official documentation: https://webapi.bps.go.id/documentation/

BPS documents the endpoint as:

```text
GET https://webapi.bps.go.id/v1/api/domain/type/prov/key/{API_KEY}
```

The response is JSON with `status`, `data-availability`, and a `data` array. The second array element contains province-domain records with `domain_id`, `domain_name`, and `domain_url`.

## Environment

Set these only in the server environment (Vercel server environment variables or local `.env.local`):

- `BPS_API_KEY`: key issued to the registered National Pulse application by BPS.
- `NATIONAL_PULSE_INGESTION_SECRET`: long random secret protecting the internal ingestion route.
- `NEXT_PUBLIC_SUPABASE_URL`: project URL.
- `SUPABASE_SECRET_KEY`: Supabase secret key, server-side only.

The Supabase secret key bypasses RLS. It is used only in a server-only module after the route validates its own bearer secret. Never prefix secrets with `NEXT_PUBLIC_`; never commit their values.

## Run ingestion

After setting all variables and deploying:

```bash
curl -X POST \
  -H "Authorization: Bearer $NATIONAL_PULSE_INGESTION_SECRET" \
  https://YOUR_DEPLOYMENT_HOST/api/ingestion/bps/domains
```

The endpoint:
1. Rejects requests without the configured bearer secret.
2. Confirms the `BPS_WEBAPI` source is active in Supabase.
3. Creates an `ingestion_jobs` record.
4. Fetches and validates the BPS province-domain response.
5. Upserts raw records using the unique `source_id,external_id` identity.
6. Stores a SHA-256 content hash, source URL, fetch timestamp, and domain metadata.
7. Marks the job `SUCCEEDED` or `FAILED` with a bounded error summary.

The endpoint is private and should be called only by an operator or a protected scheduler. It is not a public API.

## Data integrity boundaries

- Domain records are stored in `raw_source_documents`; they are not statistical indicator observations.
- Nothing is automatically marked `PUBLISHED`.
- Repeated runs are idempotent by the database unique key on `source_id,external_id`.
- A successful HTTP response does not imply that the BPS data license permits every downstream reuse.
- Keep BPS attribution, respect rate limits, and re-check current terms before public/commercial reuse.
- Do not scrape or bypass access controls.

## Next milestone

After the first authenticated ingestion succeeds:
1. Select specific statistical variables and periods with documented definitions and units.
2. Import their source metadata and raw responses.
3. Normalize periods, units, and geographic identifiers.
4. Create indicator observations as `DRAFT`.
5. Add validation and analyst review before publication.
