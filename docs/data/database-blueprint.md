# Database Blueprint

This is a logical schema blueprint for the selected Supabase PostgreSQL platform. It is not an applied database migration. Final physical types, indexes, constraints, RLS policies, and migrations must be reviewed and tested before production.

## 1. Platform decision

Use Supabase-managed PostgreSQL as the canonical database for National Pulse.

- SQL migrations live in `supabase/migrations/`.
- Use Supabase CLI for local development and controlled migration deployment.
- Keep separate development/staging/production projects where practical.
- Generate and commit TypeScript database types from the schema.
- Supabase Auth is the planned identity provider when accounts and analyst roles are introduced.
- Supabase Storage is for permitted source documents and internal attachments; PostgreSQL stores metadata and provenance.
- Keep service-role credentials server-side only.

## 2. Design rules

- Use stable UUID primary keys for canonical records.
- Store original source payloads separately from normalized records.
- Preserve source timestamps and observation periods.
- Use append-only revision/history records for published observations and evidence.
- Keep provenance references on every externally sourced fact.
- Store money with explicit currency and precision; never assume all values are IDR.
- Store time in UTC and retain source timezone where relevant.
- Do not store sensitive personal data unless necessary, lawful, and access-controlled.
- Enable RLS on all tables exposed through the Supabase Data API.
- Default to deny; grant access through explicit least-privilege policies.
- Keep privileged ingestion writes behind trusted server/worker credentials.

## 3. Core tables

### Reference and sources
- countries
- regions
- data_sources
- source_connectors
- ingestion_jobs
- raw_source_documents

### Indicators and observations
- indicators
- indicator_observations
- observation_revisions
- indicator_methodologies
- indicator_geographies

### News and events
- news_articles
- news_article_sources
- events
- event_evidence
- event_entities
- event_impacts
- causal_relationships

### Entities
- persons
- organizations
- entity_aliases
- entity_identifiers
- entity_relationships
- office_holders
- office_terms

### Policy and government projects
- policies
- policy_events
- projects
- project_milestones
- project_locations
- project_budgets
- budget_realizations

### Procurement and accountability
- tenders
- tender_participants
- contracts
- contract_amendments
- suppliers
- ownership_records
- conflict_of_interest_signals
- audit_records
- delivery_assessments
- public_benefit_assessments
- investigation_cases
- case_evidence
- case_reviews
- right_of_reply_records

### Risk, analysis, and operations
- risk_assessments
- risk_factors
- forecasts
- simulation_or_scenario_records (only if a later product requirement explicitly adds scenario tools)
- ai_reports
- model_versions
- alerts
- audit_logs
- user_roles
- access_grants

## 4. Supabase-specific security and storage model

### Row Level Security

- Enable RLS on every exposed application table.
- Public read access must be explicitly limited to approved, publication-ready records.
- Drafts, analyst notes, personal data, case evidence under review, and internal operational records are not public by default.
- Analysts receive only the permissions required for their assigned work.
- Administrative access is restricted and audited.
- Test policies for anonymous, authenticated, analyst, and administrator roles.
- Never treat hiding a UI control as access control.

### Storage buckets

Start with private buckets for:
- `source-archive`: original files when storage and redistribution are permitted
- `analyst-attachments`: restricted working attachments

Use non-guessable object paths and storage policies tied to record permissions. Store checksum, original URL, source, retrieval timestamp, licence/retention notes, and MIME type in relational metadata. Do not mirror copyrighted or restricted material without permission.

### Secrets

- Browser: only the Supabase publishable/anon key with RLS-protected access.
- Server/worker: service-role key or narrowly scoped server credentials stored in deployment secrets.
- Never commit `.env` files containing secrets.
- Never expose service-role credentials through `NEXT_PUBLIC_*` variables.

## 5. Common provenance fields

For source-backed records, use a shared pattern:
- id
- source_id
- source_record_key
- source_url
- published_at
- observed_at or period_start/period_end
- retrieved_at
- verification_status
- provenance_label
- raw_document_id
- created_at
- updated_at

Not every table needs every field; use a normalized provenance relation where appropriate.

## 6. Important relationships

- One source has many raw documents and ingestion jobs.
- One indicator has many observations.
- One observation may have multiple revisions.
- One event has many evidence records and related entities.
- One project has many milestones, budgets, tenders, contracts, and assessments.
- One contract belongs to a tender/project where supported by source data.
- One organization may have aliases, identifiers, ownership records, and contracts.
- One investigation case has evidence, reviews, counter-evidence, and response records.
- Every risk assessment references a methodology/model version and input records.

## 7. Data integrity constraints

- Unique source_record_key per source when provider keys are stable.
- Valid time ranges for office terms and ownership records.
- Explicit currency for financial values.
- Explicit unit and frequency for indicators.
- No duplicate canonical entity identifiers without review.
- Foreign keys for provenance and project relationships.
- No deletion of historical published values without a documented legal/retention reason and audit entry.

## 8. First migration boundary

The first deployable database migration should focus on:
1. data_sources and ingestion_jobs
2. raw_source_documents
3. indicators and indicator_observations
4. observation_revisions
5. news_articles and events
6. event_evidence
7. audit_logs

Add project/procurement/entity tables in a later migration after source mapping and field definitions are verified. Avoid creating a giant untested schema in one migration.
