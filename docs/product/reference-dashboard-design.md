# National Pulse dashboard visual system

## Reference direction
The executive dashboard adopts the information hierarchy of the supplied AAM INDO reference: light surfaces, compact utility header, persistent grouped navigation, a status strip, KPI cards, analytical panels, a structured monitoring table, sector/data coverage panels, and an AI briefing.

This is a visual and interaction-pattern reference only. National Pulse retains its own identity, terminology, evidence model, data contracts, APIs, and Supabase implementation.

## Page composition
1. Welcome/context header for the national scope.
2. National status strip for platform connectivity, published observations, and evidence readiness.
3. National Snapshot cards populated only from published observations.
4. Trend and sector movement panels, which show explicit empty states until comparable observations exist.
5. Policy and development radar for public spending, policy chronology, delivery, and public benefit.
6. Data coverage and AI National Briefing panels.
7. Advanced module directory.

## Responsive behavior
- Desktop: fixed executive sidebar and fluid content workspace.
- Tablet: KPI/status grids reduce columns while keeping analytical panels readable.
- Mobile: sidebar becomes a drawer, dashboard panels stack vertically, and monitoring rows become compact cards.

## Data integrity
No sample values, fabricated trend lines, or illustrative rankings are rendered as real data. Empty states explain which evidence is missing. The count of registered sources is not presented as proof of successful ingestion. Existing OBSERVED, REPORTED, ESTIMATED, and FORECAST labels remain distinct.

## Implementation boundary
This change is limited to dashboard presentation and navigation composition. It does not alter database schema, Supabase policies, ingestion endpoints, provider connectors, publication rules, or module contracts.
