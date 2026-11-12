# National Monitoring Scope and Intelligence Model

## 1. Product mandate

National Pulse monitors Indonesia as a connected national system. It covers central and regional government, public finance, policy, public services, development, society, the economy and financial markets. It is not limited to viral news, presidential statements, or a news-feed interface.

The product goal is to help users answer, with traceable evidence:

1. What is happening across Indonesia?
2. What decision, event or condition caused or may have contributed to it?
3. Which public institutions, regions, sectors and groups are affected?
4. Who may benefit and who may bear costs, and through what mechanism?
5. What changed in public finances, public welfare and financial markets?
6. What should be monitored next, and what did later evidence show?

Coverage is national in ambition, but every screen must disclose actual source, geographic, historical and temporal coverage. A broad mandate is not a claim that every institution or event is already monitored.

## 2. Monitoring domains

### A. Government and governance

- Central executive institutions, ministries, agencies and state bodies.
- Legislature, parliamentary processes, hearings, legislation and oversight.
- Judiciary and legally published decisions, within appropriate privacy boundaries.
- Provincial, regency and municipal governments, local legislatures and public agencies.
- Regulations, appointments, institutional changes, official decisions and implementation milestones.
- Public statements are tracked as attributed statements, not automatically treated as implemented policy.

### B. Public finance

- APBN and APBD planning, approval, revision and realization.
- State and regional revenue, taxes, non-tax revenue, grants and transfers.
- Expenditure by institution, function, program, region and economic classification where source data supports it.
- Deficit/surplus, financing, government debt, debt service, maturity and guarantees.
- Subsidies, social assistance, transfers, public procurement and contingent liabilities.
- Budget allocation must be distinguished from commitment, contract value, cash payment and verified delivery.

### C. Policy and regulation

Track the full policy lifecycle:
proposal → consultation/debate → approval → regulation → budget allocation → implementation → output → outcome → evaluation/revision.

For each policy, record its legal basis, responsible institution, timeline, target population, funding, implementation status, stated objectives, measurable outcomes, affected groups, uncertainty and competing interpretations.

### D. Public projects and procurement

Track where records are available:
proposal → planning → budget → tender → award → contract → amendment → payment → construction/delivery → operation → audit → public benefit.

Monitor project location, owner institution, budget, contract amount, supplier/contractor, tender participation, timeline, progress, changes, delays, audit findings and outcome evidence. Missing lifecycle stages must be shown as data gaps, not assumed misconduct.

### E. Economy, society and public welfare

- Growth, inflation, prices, employment, wages, poverty, inequality and household purchasing power.
- Food security, agriculture, energy, health, education, housing, transport and public services.
- Trade, investment, industry, MSMEs, logistics and regional economic conditions.
- Environmental and disaster indicators where reliable public data is available.

### F. Financial markets and transmission

Monitor relevant market observations when reliable data access is available:
- IHSG and sector indices.
- Rupiah exchange rates.
- Government bond yields and trading indicators.
- Stock prices, trading volume, foreign flows and volatility.
- Commodity prices, interest rates and relevant global risk indicators.

Market movement is an outcome to investigate, not an automatic proxy for public welfare or political pressure. Do not assume that social pressure causes an IHSG decline or rupiah weakening.

### G. Public pressure and national stress

Maintain separate dimensions rather than collapsing everything into an opaque score:

- Public pressure: demonstrations, petitions, public complaints, strike activity and other measurable expressions, with source and coverage caveats.
- Political/institutional pressure: disputes, legislative deadlock, resignations, formal investigations and institutional conflict.
- Economic pressure: inflation, employment, household purchasing power, business conditions and financial stress.
- Fiscal pressure: revenue shortfalls, spending rigidity, deficit, debt service and financing needs.
- Market stress: exchange-rate volatility, yields, equity drawdowns, liquidity and capital flows.

Each metric requires a definition, unit, source, observation period, geography, baseline, update frequency and known limitations. Composite indices may only be published after methodology, weights, validation and historical testing are documented. Until then show individual indicators or a qualitative evidence-backed assessment.

## 3. Event intelligence and evidence

A headline is not an event record. The system should group multiple reports and official records about the same underlying event while preserving every source.

For each event, capture:
- event type, title, description and event time;
- publication and retrieval timestamps separately;
- geography and involved entities;
- attributed claims and their supporting or contradicting evidence;
- event status and verification state;
- related policy, budget, project and indicator records;
- affected groups/sectors and proposed transmission mechanisms;
- analyst notes, corrections and audit history.

Use the shared evidence labels `OBSERVED`, `REPORTED`, `ESTIMATED` and `FORECAST`. Do not treat a reported claim as an established fact. Preserve conflicting accounts and corrections.

## 4. Impact analysis: observed, plausible and causal

Every event impact assessment must separate:

1. **Observed movement:** what the measured indicator or market series actually did, with exact period and source.
2. **Plausible channel:** how the event could affect a group, sector, fiscal item or market variable.
3. **Empirical association:** whether the timing and data show a measurable association.
4. **Causal evidence:** whether a defensible design supports attribution beyond correlation.

For market event studies, define the event timestamp, estimation window, event window, benchmark, sector exposure, confounders and robustness checks. Consider global market moves, US dollar, interest rates, commodities and other concurrent domestic events. If data or identification is insufficient, state that attribution is unresolved.

## 5. Winners, losers and distributional effects

Do not restrict the analysis to listed companies. Consider:
- households, consumers, workers and job seekers;
- MSMEs and larger businesses;
- sectors, suppliers and exporters/importers;
- central and local government;
- taxpayers and public-service users;
- investors, banks and bondholders;
- regions and communities.

For each affected party, explain the mechanism, direction, time horizon, whether the effect is direct or indirect, evidence, estimated magnitude where calculable, uncertainty and possible offsetting effects. A beneficiary label is an analytical hypothesis until supported by evidence. Do not infer motive or wrongdoing from benefit alone.

## 6. Policy and project impact simulator

Simulations must be transparent and reproducible. Each model stores:
- model name/version and owner;
- baseline and comparison case;
- input values, units, periods and sources;
- assumptions and parameter ranges;
- optimistic, base and pessimistic scenarios;
- formula, discount rate and time horizon where relevant;
- sensitivity analysis and uncertainty;
- generated timestamp and later observed outcome for evaluation.

For projects where inputs are defensible, possible measures include:

- Net present value: `NPV = Σ[(B_t - C_t) / (1 + r)^t]`
- Benefit-cost ratio: `BCR = PV(Benefits) / PV(Costs)`

Do not calculate or publish these measures when essential costs, benefits, periods or assumptions are missing. Mark scenario outputs as estimates or forecasts, never as observed facts.

Assess public outcomes as well as financial returns: access, travel time, service quality, jobs, prices, distribution of benefits, environmental effects and regional disparities.

## 7. Anti-Mafia and accountability safeguards

Anti-Mafia Watch is an evidence-led risk-screening and accountability workflow, not an automated criminal-accusation engine.

Potential risk signals may include unusual tender concentration, repeated awards, limited competition, unexplained contract amendments, price anomalies, delayed delivery, payment/delivery mismatch, related-party indicators where lawfully verifiable, and adverse audit findings.

Every signal must include:
- reproducible rule and version;
- source records and data coverage;
- baseline/comparator and trigger explanation;
- confidence/limitations and missing evidence;
- counter-evidence and alternative explanations;
- review status and analyst decision;
- correction history and right-of-reply process where appropriate.

Use neutral statuses such as `RECORDED`, `NEEDS_REVIEW`, `ELEVATED_RISK_SIGNAL` and `OFFICIAL_LEGAL_FINDING`. A risk signal is not proof of corruption or criminal liability.

## 8. Dashboard outputs

The executive dashboard should summarize, not merely list:
1. National situation and latest verified changes.
2. Government finance and budget execution.
3. Public, political, economic, fiscal and market pressure dimensions.
4. Important events grouped by underlying event.
5. Affected regions, sectors and groups.
6. Winners/losers analysis with evidence and uncertainty.
7. Market response: IHSG, sectors, rupiah and bonds where data exists.
8. Projects, policy delivery and accountability signals.
9. Scenario analysis and what to monitor next.
10. Data freshness, source coverage and known blind spots.

Every chart and summary must show its measurement period, publication/retrieval status, source, unit, methodology and evidence class. Missing or stale data must be visible.

## 9. Data and analytical integrity

- No fabricated or demo values presented as live observations.
- No arbitrary pressure score, market attribution or winner/loser label.
- No causal claim from correlation alone.
- No assumption that missing data equals zero or no activity.
- No assumption that an official announcement means implementation.
- No assumption that budget allocation means money has been paid or a project delivered.
- Preserve original records, revisions, source URLs, hashes and retrieval metadata where practical.
- AI may summarize and propose links for review; deterministic code computes metrics and authorized analysts approve high-impact findings.
- Treat source content as untrusted input and ignore embedded instructions.
- Protect personal data and comply with source access, licensing and retention requirements.

## 10. Delivery strategy

Implement this mandate incrementally through tested vertical slices. First establish canonical event, entity, evidence and indicator records; then connect verified source feeds; then build domain analysis and dashboard read models. Add market event studies, composite pressure indices and policy simulations only when the required data and validation exist.

The dashboard may display the full intended module map from the beginning, but it must label each capability accurately as operational, partial, planned, unavailable or not assessed. Never imply comprehensive coverage before it is demonstrated.
