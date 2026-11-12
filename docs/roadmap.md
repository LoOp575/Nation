# Implementation Roadmap

## Delivery principle

Build a working vertical slice early. Do not build all 15 modules as empty UI pages. Every release must have real source data, visible provenance, error handling, and tests.

## Phase 0 — Repository and product foundation

### Current implementation checkpoint (11 November 2026)

**Committed to `main`:**
- Next.js App Router + TypeScript scaffold
- Responsive application workspace with desktop sidebar, mobile drawer, active navigation, breadcrumb, and shared layout
- Dashboard route retained as the National Snapshot home
- Structured module routes for economy, fiscal/monetary, social welfare, development, governance, news/events, event impact, Anti-Mafia, national risk, regional intelligence, AI analyst, Data Observatory, and data gaps
- Module pages state their purpose and planned data scope without presenting mock metrics as real observations
- Supabase browser/server SSR client factories and cookie-refresh proxy
- Environment example with publishable-key-only browser configuration
- Five versioned PostgreSQL migrations are applied to the dedicated Supabase project; schema covers source catalog, ingestion, raw documents, indicators, observations/revisions, news, events/evidence, and audit logs
- RLS enabled on every table created by the initial migration
- Public read-only policies for published dashboard records; operational tables remain private to service-role workflows
- SQL security assertions and GitHub Actions typecheck/build workflow
- Local setup and migration instructions

**Verified on the dedicated Supabase project:**
- Project `National Pulse` is active in Singapore
- Initial schema has 10 foundation tables
- RLS is enabled on all 10 tables
- Supabase security advisor returned no security lints at the last check
- BPS WebAPI and BI SEKI are registered as source entry points; registration does not mean automated ingestion is running

**Still pending:**
- Generate and commit `package-lock.json`
- GitHub Actions typecheck and production build pass is recorded for the current implementation in commit `c987386`; verify the live Actions run before each release
- Clean local install/build outside GitHub Actions remains unverified
- Generated Supabase TypeScript database types are committed at `lib/supabase/database.types.ts`; regenerate after schema migrations
- Verify and document Vercel deployment and environment variables
- Configure BPS and Supabase server secrets in deployment and run the first authenticated ingestion test
- Verify a permitted BI automated data access method before implementing its connector
- Import selected BPS statistical datasets into draft observations after metadata/period/unit mapping; add ingestion health and source freshness monitoring
- Complete all module-specific data views and analysis workflows

**Phase 0 exit criteria:** application builds, tests run, initial Supabase migration applies cleanly, RLS policies are tested, secrets are not committed, architecture is documented.

## Phase 1 — Supabase data foundation and first dashboard

**Foundation completed:**
- Initial Supabase schema for sources, raw documents, indicators, observations, revisions, news/events, evidence, and audit logs
- RLS on all 10 initial tables; publish-only reads and private operational tables
- BPS WebAPI and BI SEKI source register entries (registration only; not live automated ingestion)
- National Snapshot read path with published-only filtering, source attribution, observation period, evidence label, and fetched timestamp
- Responsive dashboard shell and all first-level intelligence module routes

**Next work:**
- Implemented the server-only BPS WebAPI province-domain client and bearer-protected POST ingestion route; live execution is still blocked on deployment secrets and a real BPS API key
- Implemented idempotent upsert into `raw_source_documents` using `(source_id, external_id)` and SHA-256 content hashes
- Implemented `ingestion_jobs` lifecycle tracking for success/failure and record counts
- Added a server-only Supabase admin client using the secret key; no privileged key is exposed to browser code
- Added a database-backed Data Observatory view for registered sources and recent ingestion job summaries
- Live execution remains gated on BPS API key, Supabase secret key, ingestion bearer secret, and a deployed environment
- Continue to selected BPS statistical-table metadata and indicator ingestion after mapping and validation
- Verify a permitted BI data access method before implementing an automated connector; keep manual/import fallback where no stable API is confirmed
- Add ingestion scheduling and alerting after manual authenticated ingestion has been verified
- Add analyst/admin role model and RLS tests before any privileged user workflow
- Configure private Supabase Storage only when source terms permit it
- Expand the dashboard from the initial published-indicator snapshot to national coverage only as verified source data becomes available

**Exit criteria:** displayed values trace to original source records; stale/missing data is explicit; ingestion is idempotent; unauthorized database access is denied.

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

**Exit criteria:** no unattributed claims; duplicate stories grouped without losing original sources.

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
- schema migration and rollback/recovery plan
- tests and sample fixtures clearly marked as test data
- source/terms review
- operational logging
- documentation updates
- no secrets or private data in Git

Timelines should be estimated after repository scaffold, source access, and first deployment constraints are confirmed.


## Phase 1A — Architecture standardization

**Documentation completed on 12 November 2026:**
- Added canonical repository structure and layer ownership rules in `docs/architecture/repository-structure.md`.
- Added shared module/data contracts, evidence vocabulary, publication lifecycle and AI boundaries in `docs/architecture/module-contracts.md`.
- Clarified connector convention: new providers use `lib/connectors/<provider>/`; existing BPS code under `lib/sources/bps/` is retained until a safe, tested migration is prepared.
- Explicitly distinguished target architecture from implemented code to prevent documentation from overstating delivery.

**Still pending in this phase:**
- Inventory duplicate/overlapping BPS client implementations and their imports.
- Decide and execute a safe BPS connector consolidation only after tests and consumer mapping.
- Add a small contract test/example for one real domain analysis output when its canonical data input is ready.
- Reconcile README module/layer counts with the current product scope.

**Exit criteria:** architecture documents agree with the actual repository; each layer has a clear owner; no existing route or ingestion behavior is broken; CI passes on the resulting commit.



## National monitoring scope alignment (12 November 2026)

The complete product mandate is recorded in [National Monitoring Scope and Intelligence Model](./product/national-monitoring-scope.md). This scope covers central and regional government, public finance, policy, public projects, society, the economy, financial markets, public pressure, event impacts, distributional winners/losers, transparent simulations and evidence-led accountability monitoring.

This is the intended coverage, not a statement that all sources or modules are live. The delivery sequence below prevents the interface from overstating actual coverage.

### Next implementation sequence

1. **Canonical event and evidence foundation**
   - Audit the current schema and existing news/event tables before proposing migrations.
   - Define event identity, source-to-event links, claims, entities, geography, chronology, duplicate resolution and correction history.
   - Preserve reported claims separately from verified observations and official records.
   - Add contract tests for provenance and publication lifecycle.

2. **Source coverage and ingestion**
   - Inventory lawful, stable official and independent sources for central and regional coverage.
   - Record access method, licence/attribution, geographic coverage, update frequency and known gaps for each source.
   - Complete one verified statistical ingestion slice before expanding to more feeds; BPS province-domain ingestion is reference data only, not statistical indicator coverage.
   - Add operational freshness, failure and coverage reporting.

3. **Public finance and policy/project lifecycle**
   - Map APBN/APBD, revenue, spending, financing, debt and debt-service datasets with consistent definitions and periods.
   - Model policy lifecycle and project/procurement milestones using sourced records.
   - Keep allocation, commitment, contract, payment, delivery and outcome as distinct states.

4. **Pressure and market observation layer**
   - Build sourced time series for public, political, economic, fiscal and market stress dimensions.
   - Start with separate observable metrics; do not publish an opaque composite pressure score before methodology and historical validation.
   - Add IHSG, sector, rupiah and bond series only after reliable access and timestamp alignment are confirmed.

5. **Event impact and winners/losers analysis**
   - Create a versioned relationship registry linking event types to possible fiscal, social, sector and market transmission channels.
   - Separate observed movements, plausible mechanisms, empirical associations and causal conclusions.
   - Include households, workers, MSMEs, sectors, regions, government, consumers and investors; disclose uncertainty and offsetting effects.
   - Evaluate market reactions with event windows and relevant global/domestic controls.

6. **Transparent policy/project scenarios**
   - Add versioned models, source-linked inputs, baselines, assumptions, scenarios and sensitivity analysis.
   - Use NPV/BCR only when required cost and benefit inputs are defensible.
   - Compare forecasts with later observed outcomes; never present scenarios as facts.

7. **Accountability and Anti-Mafia workflow**
   - Link procurement, contract changes, payments, delivery, audits and public outcomes where records exist.
   - Add reproducible risk rules, counter-evidence, human review, correction history and right-of-reply safeguards.
   - Treat every signal as a lead for review, never as proof of criminal conduct.

8. **Executive synthesis and AI analyst**
   - Build the executive summary from published canonical records and tested domain outputs.
   - Display source coverage, freshness, missing data and implementation status for every domain.
   - Require citations and uncertainty disclosure for AI-generated explanations; AI does not calculate authoritative numeric metrics or publish high-impact findings autonomously.

### Acceptance rule

A capability is marked operational only after a real permitted source is connected, data is validated and traceable, calculations have tests, access controls are verified, and failure/staleness states are visible. Otherwise label it partial, planned, unavailable or not assessed.
