# BPS WebAPI connector

## Current scope

This first connector slice discovers BPS province domains. It is a connectivity and credential check, not yet a data ingestion pipeline. It does not write to Supabase or publish indicator observations.

Official documentation: https://webapi.bps.go.id/documentation/

BPS documents the province-domain endpoint as:

```text
GET https://webapi.bps.go.id/v1/api/domain/type/prov/key/{API_KEY}
```

The API key is read from the server-only `BPS_API_KEY`. Requests use JSON, a 15-second timeout, HTTP/BPS status validation, and response-shape checks. The key is never returned.

## Environment

Set these only in the server environment (Vercel server environment variables or local `.env.local`):

- `BPS_API_KEY`: key issued to the registered National Pulse application by BPS.
- `NATIONAL_PULSE_INGESTION_SECRET`: long random secret protecting the internal discovery route.

Do not prefix either variable with `NEXT_PUBLIC_`. Do not commit their values.

## Test

After setting both variables and deploying:

```bash
curl -H "Authorization: Bearer $NATIONAL_PULSE_INGESTION_SECRET" \
  https://YOUR_DEPLOYMENT_HOST/api/ingestion/bps/domains
```

The response contains province domain IDs/names, count, and retrieval time. Missing or invalid credentials, network failures, and invalid responses return explicit errors. This is a protected internal endpoint, not a public API.

## Usage requirements

- Register National Pulse as an application and use its own API key.
- Keep the key secret and respect BPS rate limits.
- Attribute BPS as the source in the product.
- Preserve source metadata, statistical period, unit, and revisions.
- Re-check current BPS terms before public/commercial reuse.
- Do not scrape or bypass access controls.

## Next milestone

After the discovery request succeeds:
1. Select datasets and variables with documented definitions and units.
2. Store source responses and ingestion job metadata with idempotency keys.
3. Normalize periods, units, and geographic identifiers.
4. Add validated observations as unpublished records first.
5. Publish only after validation and source attribution checks.
