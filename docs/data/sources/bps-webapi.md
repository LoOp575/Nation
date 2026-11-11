# BPS WebAPI Connector

## Current status

The BPS WebAPI source is registered in `public.data_sources`. The repository contains a server-only client for the official API, but automated ingestion is **not active** until the National Pulse application is registered with BPS and its API key is configured in the server environment.

Official references:
- [BPS WebAPI documentation](https://webapi.bps.go.id/documentation/)
- [BPS WebAPI portal and terms of use](https://webapi.bps.go.id/developer/)

## Access and compliance

- BPS documents that users must register an application and obtain an API key.
- The API key is a secret credential. Never commit it, expose it in browser code, place it in a `NEXT_PUBLIC_*` variable, or include it in logs/errors.
- BPS documents GET endpoints with JSON responses and applies rate limiting. The exact limit may vary by application, endpoint, period, and service capacity; do not assume a fixed quota.
- Standard WebAPI access is described as free under the terms. Commercial use requires prior BPS approval or a cooperation agreement. Confirm National Pulse's intended use and obtain any required approval before commercial operation.
- Respect attribution, metadata, observation periods, units, and dataset-specific reuse conditions.
- Cache responses reasonably and preserve source retrieval timestamps. Do not poll aggressively or bypass rate limits.

## Configuration

Set the following server-side variable in local development and the Vercel project after BPS application registration:

```dotenv
BPS_API_KEY=your_registered_application_key
```

Do not put the key in `.env.example`, source code, browser props, or any `NEXT_PUBLIC_*` variable. The example file contains only an empty placeholder.

## Implemented client surface

File: `lib/sources/bps/client.ts`

- `getBpsDomains()`: fetches the official BPS domain catalogue.
- `getBpsDynamicTable({ domainId, variableId, periodId })`: fetches one dynamic-table response using IDs obtained from BPS metadata.

The client validates required IDs, uses a 15-second timeout, disables implicit response caching, and keeps the API key server-side. It returns the source response without guessing a normalized observation schema.

## Not yet implemented

- No live request has been verified because no API key is configured.
- No automated scheduler or ingestion job is active.
- No BPS dataset has yet been mapped to National Pulse indicator definitions.
- No raw payload or indicator observation has been inserted from BPS.

Before ingestion is enabled, select a specific BPS dataset, verify its variable/period/unit/geography metadata, define an idempotency key, preserve the original response and source timestamps, and test rate-limit/error handling. Publish observations only after validation and review.
