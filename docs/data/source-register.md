# Initial Official Source Register

This register identifies official source entry points. A source being listed or active in the catalog does **not** mean its connector is running or that any observations have been imported.

## 1. BPS WebAPI

- Agency: Badan Pusat Statistik
- Entry point: https://webapi.bps.go.id/documentation/
- Access: read-only JSON API; all documented endpoints use GET.
- Access requirement: register the National Pulse application and obtain an API key.
- Cost: BPS states that WebAPI access is free for compliant use.
- Attribution: display **"Layanan ini menggunakan API Badan Pusat Statistik (BPS)."**
- Important restrictions: keep the API key secret; use it only for the registered application; respect rate limits and current terms. BPS terms say commercial use requires prior approval or a cooperation agreement.
- Ingestion status: registered as a source candidate; connector and API key are not yet configured.

## 2. Bank Indonesia SEKI

- Agency: Bank Indonesia
- Entry point: https://www.bi.go.id/id/statistik/ekonomi-keuangan/seki/Default.aspx
- Coverage: monthly statistical publication across monetary, government finance, real, and external sectors.
- Acquisition: the public SEKI publication is verified. A stable public API endpoint and its terms have not yet been verified, so National Pulse must not pretend this is an API connector. Use a controlled import/manual acquisition path until an approved machine-readable endpoint is confirmed.
- Required metadata: table identifier, unit, reference period, publication date, extraction timestamp, and original source institution where BI republishes another agency's data.
- Ingestion status: source catalog candidate; no automated connector is active.

## Data handling rules

1. Keep publication date separate from the period measured.
2. Preserve the original table/indicator title, unit, frequency, geography, notes, and source URL.
3. Do not silently mix BI-republished BPS values with the original BPS observation. Store the provenance chain.
4. Do not mark an observation PUBLISHED until validation and review are complete.
5. Label evidence OBSERVED, REPORTED, ESTIMATED, or FORECAST based on the actual record and method, not the source's reputation alone.
6. Store API credentials only in server-side secret configuration, never in Git or NEXT_PUBLIC_* variables.

## Verification references

- BPS API documentation: https://webapi.bps.go.id/documentation/
- BPS WebAPI terms and developer portal: https://webapi.bps.go.id/developer/
- BPS public service statement on free WebAPI registration: https://ppid.bps.go.id/app/konten/0000/Layanan-BPS.html
- BI SEKI official page: https://www.bi.go.id/id/statistik/ekonomi-keuangan/seki/Default.aspx

Last reviewed: 11 November 2026.
