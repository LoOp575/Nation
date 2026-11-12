# Canonical Repository Structure

## Purpose

This document defines the target repository layout for National Pulse. It is an architectural contract, not a claim that every directory already exists. Directories are created when the first real implementation requires them; empty placeholder trees are discouraged.

## Current technology decisions

- Next.js App Router and TypeScript remain the web application.
- Supabase PostgreSQL remains the canonical shared data store.
- Vercel hosts the web application and short-lived HTTP handlers.
- GitHub is the source of truth for code, migrations, tests, and documentation.
- Long-running ingestion and scheduled processing belong in a separately operated worker, not in a request handler with a short execution limit.

## Target layout

```text
app/
  (dashboard)/                 # User-facing dashboard route group when introduced
  [module]/                    # Existing shared module shell; keep until dedicated pages exist
  api/
    ingestion/                 # Authenticated source ingestion triggers
    indicators/                # Canonical indicator read APIs
    analysis/                   # Domain analysis APIs
    events/                     # Event and evidence APIs
    reports/                    # Generated report APIs
components/
  app-shell/                    # Navigation and responsive application shell
  dashboard/                    # Snapshot and KPI presentation
  charts/                       # Reusable chart components
  maps/                         # Geographic visualizations
  tables/                       # Accessible data tables
  evidence/                     # Provenance and evidence presentation
lib/
  config/                       # Validated runtime configuration
  connectors/                   # Provider-specific API clients and parsers
    bps/
    bi/
    kemenkeu/
    ojk/
    bappenas/
    lkpp/
    bmkg/
  data/                          # Canonical read models and query composition
  data-engine/
    ingestion/                   # Job orchestration and idempotency
    normalization/               # Units, periods, geography and identifiers
    validation/                  # Schema and domain validation
    provenance/                  # Source and retrieval metadata
    revision/                    # Revision detection and history
    publication/                 # Review and publish rules
  intelligence-engine/
    economic/
    fiscal/
    social/
    development/
    governance/
    news/
    event-impact/
    anti-mafia/
    national-risk/
    regional/
    historical/
  ai-engine/
    retrieval/
    analyst/
    briefing/
    evaluation/
  security/                      # Authorization and safe server utilities
  supabase/                      # Typed clients and generated database types
workers/
  ingestion/                     # Scheduled and bulk source collection
  processing/                    # Asynchronous normalization and analysis
supabase/
  migrations/                    # Versioned schema changes
  tests/                         # Database security and integrity tests
  seed/                          # Explicitly non-production reference/test data
docs/
  architecture/
  data/
  development/
  intelligence/
  product/
  security/
.github/
  workflows/
```

## Layer ownership

| Layer | Owns | Must not own |
|---|---|---|
| `app/` | Routing, request/response handling, page composition | Provider parsing, domain calculations, direct privileged SQL scattered across pages |
| `components/` | Reusable presentation and interaction | Source access, secrets, business rules |
| `lib/connectors/` | Provider transport, provider-specific parsing, source metadata | Publishing observations or deciding national risk |
| `lib/data-engine/` | Ingestion lifecycle, validation, normalization, provenance, revision and publication workflow | UI rendering or AI-generated facts |
| `lib/intelligence-engine/` | Deterministic domain metrics and explainable rules | Provider-specific HTTP calls or direct UI state |
| `lib/ai-engine/` | Retrieval, explanation, briefing and evaluation | Numeric source of truth, silent publication, legal conclusions |
| `lib/data/` | Read models shared by dashboard and APIs | Duplicate copies of canonical records |
| `workers/` | Scheduled, retryable and long-running work | User-facing page rendering |
| `supabase/` | Versioned database schema, policies and tests | Untracked production schema changes |

## Connector convention

The canonical location for new provider integrations is `lib/connectors/<provider>/`. Existing BPS code under `lib/sources/bps/` is retained for compatibility until a reviewed migration moves or wraps it. Do not create a second implementation of the same BPS endpoint. Before moving code, inventory imports, tests, route consumers and behavior; then perform one small migration with CI verification.

Every connector must document:
- provider and dataset identifiers
- endpoint and access method
- authentication requirements without storing credentials in code
- attribution, terms, rate limits and coverage
- request timeout and bounded retry policy
- parser/schema version
- publication and observation timestamps when supplied
- error categories and safe logging behavior

## Module contract

A domain module consumes canonical, validated records through shared data services. It must not call external provider APIs from a page component. Its output must identify:
- input record IDs and source provenance
- calculation/rule version
- observation period and geography
- evidence status and publication status
- uncertainty, missing inputs and counter-evidence where relevant
- generated timestamp

A module may return `not_assessed` or `insufficient_data`; it must not manufacture a score to fill a blank panel.

## API contract

- Validate all request parameters at the boundary.
- Keep privileged credentials and service-role access server-only.
- Authenticate ingestion and administrative mutations.
- Return stable machine-readable error codes; never expose secrets, stack traces or raw provider credentials.
- Use idempotency keys for retryable ingestion operations.
- Separate public published-data reads from private operational writes.
- Version breaking API contracts.

## Data integrity contract

All source-derived records preserve source identity, source URL or document reference, retrieval time, source publication time when available, observation period, parser version and content hash where applicable.

Evidence labels remain distinct: `OBSERVED`, `REPORTED`, `ESTIMATED`, and `FORECAST`. Publication state is separate from evidence type. An estimated value is not automatically publishable, and a reported claim is not an independently observed fact.

## Implementation policy

1. Do not create empty directories solely to imitate this target tree.
2. Build one end-to-end vertical slice before expanding module breadth.
3. Keep existing routes and data contracts stable unless a migration plan is documented.
4. Every schema change uses a versioned SQL migration and generated type refresh.
5. Every meaningful slice includes tests, documentation and a CI run.
6. Never commit API keys, service-role keys, personal data or production exports.
7. Keep free-tier resource use bounded; no paid service or upgrade without explicit approval.
