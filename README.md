# National Pulse

**Indonesia National Intelligence & Public Accountability Platform**

National Pulse is a real-data-first web monitoring platform for understanding Indonesia's national condition. It brings official indicators, public policy, government projects, procurement records, news events, regional conditions, and evidence-based analysis into one integrated dashboard.

> National Pulse is a monitoring and public-accountability platform, not a speculative country simulator. It must never present fabricated, synthetic, or AI-generated values as observed facts.

## Product principles

1. **Real data first** — primary indicators must come from identifiable sources.
2. **Evidence before conclusions** — every material claim links to its supporting records.
3. **Clear epistemic labels** — OBSERVED, REPORTED, ESTIMATED, and FORECAST are never conflated.
4. **Political neutrality** — evaluate decisions, processes, outcomes, and evidence, not political affiliation.
5. **Public interest** — compare public spending with delivery and public benefit.
6. **Historical integrity** — preserve publication dates, retrieval times, revisions, and audit trails.
7. **Explainable analysis** — AI explains evidence; it does not invent facts or issue legal verdicts.

## Product experience

The **Main Dashboard is the center of the product**. Users should see a concise national snapshot, material changes, alerts, news/events, project accountability signals, risk dimensions, and AI briefing in one view. Each panel links to a deeper module using the same underlying data and evidence records.

### Main dashboard sections

1. National Snapshot
2. Economic Overview
3. Fiscal & Monetary
4. Social & Public Welfare
5. Development Monitor
6. Political & Governance
7. News & Events
8. Event Impact
9. Anti-Mafia Watch
10. National Risk
11. Regional Overview
12. AI National Briefing
13. Data Freshness & Coverage

## Intelligence modules

- Economic Intelligence
- Fiscal & Monetary
- Social & Public Welfare
- Development Monitor
- Political & Governance
- News Intelligence
- Event Impact Analysis
- National Risk Monitor
- Anti-Mafia Intelligence
- Public Policy Tracker
- Regional Intelligence
- Historical Intelligence
- AI National Analyst
- Data Observatory
- Data Gap & Uncertainty Monitor

## Core system layers

1. Source adapters and ingestion
2. Raw source archive and provenance
3. Validation, normalization, deduplication, and revision handling
4. Entity resolution for people, organizations, projects, and locations
5. Indicator, event, policy, project, procurement, and evidence registries
6. Domain engines for economic, fiscal, social, development, governance, risk, and accountability analysis
7. Evidence-aware analysis and alerting
8. API and web dashboard
9. Security, audit, monitoring, and operations

## Evidence labels

| Label | Meaning |
|---|---|
| OBSERVED | A value or event directly recorded in an identified source |
| REPORTED | A claim reported by a source but not independently established |
| ESTIMATED | A transparent estimate with method and assumptions |
| FORECAST | A future projection with model, horizon, and uncertainty |

A publication date is not the same as the period measured. Every indicator must retain both.

## Anti-Mafia Intelligence safeguards

Anti-Mafia Intelligence monitors public projects, budgets, procurement, contracts, suppliers, beneficial ownership where lawfully accessible, potential conflicts of interest, delivery, and public benefit.

- A suspicious pattern is a **risk signal**, not proof of wrongdoing.
- No person or company may be labelled corrupt or criminal based only on correlation, political disagreement, dismissal, association, or an AI score.
- Show supporting evidence and counter-evidence.
- Preserve source links, document versions, timestamps, and analyst review.
- Legal findings must be grounded in relevant official legal records and described precisely.
- Protect personal data and restrict sensitive records.

## Data sources

BPS, Bank Indonesia, Ministry of Finance, OJK, Bappenas, LKPP/SiRUP/LPSE, KPK public information and LHKPN where accessible, BMKG, official ministries/agencies, regional government portals, and reputable media.

Each connector must be independently verified for access method, terms, rate limits, update frequency, and permitted reuse before implementation. Do not assume an API exists or is unrestricted.

## Technology stack

- **Web:** Next.js + TypeScript
- **Database/backend platform:** Supabase (managed PostgreSQL)
- **Authentication:** Supabase Auth when user accounts and analyst roles are introduced
- **Database security:** PostgreSQL Row Level Security (RLS), least-privilege policies
- **File archive:** Supabase Storage for permitted source documents and internal attachments; retain source URLs and metadata
- **Web hosting:** Vercel for the Next.js application and lightweight API routes
- **Data ingestion:** server-side source adapters; scheduled jobs and a separate worker for long-running or heavy processing
- **Visualization:** ECharts
- **Analytics:** deterministic SQL/Python processing; AI is not the source of numeric truth

Supabase is the selected database platform, not merely an optional compatibility target. Database schema changes must be versioned as SQL migrations in `supabase/migrations/`. Never expose the Supabase service-role key in browser code. Enable RLS for tables exposed through the Supabase API, and keep privileged ingestion operations server-side.

## Application status

The repository includes the initial Next.js + TypeScript application scaffold, Supabase SSR client setup, PostgreSQL foundation migration, baseline RLS policies, SQL security assertions, and a GitHub Actions build workflow.

A dedicated Supabase project named **National Pulse** is provisioned in Singapore and the initial migration has been applied. The database currently has 10 empty foundation tables, with RLS enabled on all 10. Supabase security advisor returned no security lints at the time of the latest check. No official data connector has been activated yet; the dashboard therefore continues to show pending states rather than fabricated national values.

### Run locally

Requirements: Node.js 22 and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the National Pulse project settings. Keep `.env.local` out of Git. The public publishable key is intended for browser use with RLS; never use a secret/service-role key in the client.

Migration and setup details: [Phase 0 setup](docs/development/phase-0-setup.md).

See:
- [Product architecture](docs/architecture/overview.md)
- [Dashboard specification](docs/product/main-dashboard.md)
- [Data governance](docs/data/data-governance.md)
- [Anti-Mafia Intelligence](docs/intelligence/anti-mafia.md)
- [Database blueprint](docs/data/database-blueprint.md)
- [Implementation roadmap](docs/roadmap.md)

## Development rule

Preserve existing work. Build a deployable vertical slice, add tests, and document source/API limitations. Never commit credentials, API keys, private personal data, or unverified allegations.
