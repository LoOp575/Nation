# Implementation Roadmap

## Delivery principle

Build a working vertical slice early. Do not build all 15 modules as empty UI pages. Every release must have real source data, visible provenance, error handling, and tests.

## Phase 0 — Repository and product foundation
- Confirm deployment target and runtime constraints
- Define environment variable policy
- Add application skeleton and lint/type/test pipeline
- Finalize canonical data contracts
- Create source register and connector acceptance checklist

**Exit criteria:** application builds, tests run, secrets are not committed, architecture is documented.

## Phase 1 — Data foundation and first dashboard
- PostgreSQL schema for sources, raw documents, indicators, observations, revisions
- One verified BPS connector and one BI connector, subject to access approval
- Manual/import fallback for sources without stable APIs
- National Snapshot dashboard with source, period, and freshness labels
- Data Observatory showing connector health and missing data

**Exit criteria:** displayed values trace to original source records; stale/missing data is explicit; ingestion is idempotent.

## Phase 2 — Fiscal, social, and sector coverage
- Add Ministry of Finance and OJK sources after endpoint/terms validation
- Add BPS social, labor, trade, and regional indicators
- Standardize units, periods, geography, and revisions
- Add sector detail pages

**Exit criteria:** comparable time series, documented definitions, visible revision history.

## Phase 3 — News and event intelligence
- Approved RSS/API/publication connectors
- Article deduplication and source attribution
- Event extraction and entity candidate matching
- Evidence links and event timeline
- Human correction workflow

**Exit criteria:** no un-attributed claims; duplicate stories grouped without losing original sources.

## Phase 4 — Public policy and development
- Policy lifecycle tracking
- Public project registry
- Budget and milestone tracking
- Link project records to official source documents
- Regional project views

**Exit criteria:** project status is based on sourced milestones, not inferred from headlines alone.

## Phase 5 — Anti-Mafia Intelligence
- Procurement/tender/contract source mapping
- Supplier and entity resolution
- Beneficial ownership only where lawfully accessible and verifiable
- Risk-signal rules with baselines and counter-evidence
- Evidence archive, review states, and right-of-reply process

**Exit criteria:** every signal is reproducible, source-backed, reviewable, and clearly not a legal verdict.

## Phase 6 — Event impact and national risk
- Versioned causal relationship registry
- Separate observed changes from potential transmission channels
- Calibrated risk methodology and historical evaluation
- Alert thresholds with false-positive tracking

**Exit criteria:** published risk metrics have documented methodology and backtesting; otherwise display "not assessed".

## Phase 7 — AI National Analyst
- Retrieval from approved canonical records
- Citation-required answer format
- Prompt-injection protection for retrieved documents
- Uncertainty and counter-evidence summaries
- Evaluation set for hallucinations and unsupported claims

**Exit criteria:** material factual statements are traceable; unsupported answers abstain.

## Phase 8 — Regional, historical, and scale
- Provincial and district coverage where comparable data exists
- Historical data backfill
- Forecast evaluation only if explicitly enabled as a separate labelled capability
- Performance, cost, and security hardening

**Exit criteria:** coverage gaps are visible; historical analyses are reproducible.

## Release discipline

Each phase must include:
- schema migration and rollback plan
- tests and sample fixtures clearly marked as test data
- source/terms review
- operational logging
- documentation updates
- no secrets or private data in Git

Timelines should be estimated after repository scaffold, source access, and first deployment constraints are confirmed.
