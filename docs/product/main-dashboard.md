# Main Dashboard Specification

## Product decision

The Main Dashboard is the primary product surface and the central monitor for all National Pulse modules. Users should understand the national picture at a glance without opening every menu. Detail pages are drill-down destinations, not independent data silos.

## Dashboard layout

### 1. Header and national context
- Product identity and selected geography (initially Indonesia)
- Data-as-of timestamp
- Global data freshness status
- Search for indicators, events, projects, people, and organizations
- Clear notice when data sources are delayed or unavailable

### 2. National Snapshot
A compact set of indicators selected by editorial/data governance:
- GDP growth
- Inflation
- Exchange rate
- Policy rate
- State revenue and expenditure
- Fiscal balance/debt indicators
- Unemployment and poverty
- Trade and investment indicators

Each tile shows value, unit, reference period, publication date, source, and change versus a clearly defined comparison period. Do not compare incompatible periods.

### 3. Sector overview
Cards or compact charts for:
- Economy and industry
- Fiscal and monetary
- Social welfare
- Food and agriculture
- Energy and mining
- Infrastructure and development
- Governance and public policy
- Regional conditions

Each card links to a detailed module.

### 4. National Alerts
Only material, evidence-backed changes should appear. Each alert includes:
- what changed
- why it was flagged
- affected sector/indicator
- source and timestamp
- observed versus potential impact
- confidence/uncertainty
- link to evidence and history

Avoid alarmist language. A threshold crossing is not automatically a crisis.

### 5. News and Events
Show a deduplicated event timeline rather than a raw flood of headlines. Group multiple reports about the same event while preserving each source. Display official statements and independent reporting distinctly.

### 6. Event Impact
Show linked indicators and sectors. Separate:
- observed indicator movement
- plausible transmission channel
- empirically supported effect
- unresolved or competing explanations

### 7. Anti-Mafia Watch
Show public project/procurement monitoring:
- projects under observation
- budget and contract milestones
- tender status and competition signals
- contract changes and delivery status
- verified ownership links where legally available
- public-benefit/outcome evidence
- evidence gaps and counter-evidence

Do not expose an allegation as a fact. Use neutral statuses such as Recorded, Needs Review, Elevated Risk Signal, and Official Legal Finding.

### 8. National Risk
Display dimensions only when methodology is documented and validated. For every score show factors, weights, baseline, period, uncertainty, model version, and historical performance. If not ready, display a qualitative evidence-backed status or "not yet assessed", not a fabricated number.

### 9. Regional Overview
Map and rank regions only when coverage and definitions are comparable. Show missing-data coverage and avoid interpreting missing records as zero.

### 10. AI National Briefing
AI produces a concise explanation based on retrieved records:
- what changed
- what evidence supports it
- what may explain it
- what is uncertain or disputed
- what to monitor next

Every material statement links to sources. The AI must disclose when it cannot answer reliably.

## Responsive behavior

Desktop:
- Multi-column layout
- National Snapshot at top
- News, alerts, and sector panels arranged by importance
- Persistent navigation to detail modules

Mobile:
- Single-column priority order
- Snapshot tiles compact and scrollable
- Alerts and major events near the top
- Charts simplified without losing units or source metadata
- Avoid hiding source attribution behind inaccessible interactions

## Data display rules

- Show the period measured separately from publication and retrieval timestamps.
- Show unit and comparison basis.
- Distinguish provisional, revised, and final values.
- Mark stale and missing data.
- Never show placeholder/demo values as live data.
- Every chart must identify source and methodology.


## Approved visual and navigation direction (12 November 2026)

- Theme: light modern interface, white surfaces, soft neutral backgrounds, blue primary accent, and restrained status colors.
- Navigation: executive-first. The National Snapshot is the landing page; detailed modules remain accessible in grouped secondary navigation.
- Devices: responsive desktop and mobile layouts. Desktop uses a persistent sidebar; mobile uses a dismissible navigation drawer and compact stacked content.
- Main page: executive heading, system/data status, published national indicators, sector overview, AI briefing entry point, evidence legend, and advanced-module directory.
- Data integrity remains unchanged: no demo values are presented as live observations. Empty states explain the missing data and link to Data Observatory.
