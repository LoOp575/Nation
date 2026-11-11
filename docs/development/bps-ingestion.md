# BPS WebAPI ingestion: province domain discovery

## Purpose

The first BPS ingestion slice discovers the official province-domain catalog. It verifies credentials, exercises the documented BPS v1 endpoint, stores the response as a raw source document, and records the run in `ingestion_jobs`.

This is source-catalog discovery, **not yet indicator-value ingestion**. It must not create or publish indicator observations.

## Endpoint

`GET https://webapi.bps.go.id/v1/api/domain/type/prov/key/{API_KEY}`

BPS documents `type=prov` for province domains and JSON records containing `domain_id`, `domain_name`, and `domain_url`.

Reference: https://webapi.bps.go.id/documentation/

## Server configuration

Set only in a trusted server environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (Supabase secret/service key; server only)
- `BPS_API_KEY` (BPS token; server only)
- `NATIONAL_PULSE_INGESTION_SECRET` (long random bearer secret)

Never put secrets in `NEXT_PUBLIC_*`, source control, client components, browser requests, or logs. Use separate values for development and production.

## Trigger

Authenticated POST to `/api/ingestion/bps/provinces` with header:

`Authorization: Bearer <NATIONAL_PULSE_INGESTION_SECRET>`

No body is required. The route is POST-only and checks the secret using a constant-time comparison.

## Storage

- A job is created in `ingestion_jobs` before contacting BPS.
- The normalized catalog response is stored in `raw_source_documents`.
- `external_id=bps-domain-province-v1` identifies this catalog snapshot.
- SHA-256 hash is stored for integrity and change tracking.
- The API key is never stored in response, source URL, metadata, or logs.
- No indicator or observation is published.

## Constraints

- Request timeout: 20 seconds.
- BPS rate limits apply. Avoid aggressive polling.
- This bounded call can run in a Vercel route. Bulk tables and paginated imports need a dedicated worker.
- Success means the catalog was fetched and stored, not that indicator data has been validated or published.

## Current status

Adapter and protected route are committed. A real end-to-end run still requires BPS API key and server secrets in the deployment environment.
