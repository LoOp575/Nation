# Economic Winners & Losers Intelligence

## 1. Purpose

Economic Winners & Losers explains how a political event, legal case, government decision or policy change may redistribute economic benefits, costs and risks across Indonesia.

It connects the event record to government decisions, public budgets, procurement, companies, economic sectors, financial markets and households. It is an analytical module, not a political judgement engine and not a stock-picking or trading signal service.

The module answers:

1. What changed, and what is the verified status of the underlying event?
2. Which decisions, budgets, contracts or institutional actions followed?
3. Which parties are exposed to the change, through what mechanism and over what horizon?
4. What market and economic indicators moved before and after the event?
5. Which effects are observed, plausible, associated or causally supported?
6. Who may receive benefits, who may bear costs, and what evidence supports each assessment?
7. What remains unknown and what should be monitored next?

## 2. Event classes

Support at least these event classes, with extensible taxonomies:

- presidential, ministerial, legislative and regional policy decisions;
- political and institutional disputes or leadership changes;
- investigations, arrests, court proceedings and official legal findings;
- security, intelligence and cyber incidents;
- public procurement, contract awards, cancellations and audits;
- subsidies, taxes, tariffs, trade restrictions and regulatory changes;
- infrastructure, energy, mining, food, health and public-service decisions;
- protests, strikes, public complaints and major social disruptions;
- disasters and other shocks with material economic consequences.

A legal case must distinguish allegation, investigation, suspect designation, charge, trial, judgement and final legal status. Being mentioned, questioned, investigated or named in media is not equivalent to arrest, guilt or conviction. Corrections and official denials must be retained with timestamps and source links.

## 3. Impact transmission graph

Represent each assessment as a traceable chain:

`Event → official/institutional response → policy or budget change → contract/operational change → organization or sector exposure → market/economic observation → household and regional outcomes`

Not every event follows every link. Missing links must be shown as gaps, not filled by inference.

Each edge in the graph stores:

- source event and target record/entity;
- relationship type and direction;
- mechanism explanation;
- evidence references;
- effective date and expected time horizon;
- status: observed, reported, estimated or forecast;
- analyst/model version, confidence rationale and limitations;
- review and correction history.

Examples of mechanisms include demand changes, government spending, taxes, financing costs, regulatory constraints, supply disruption, investor risk repricing, procurement awards and changes in consumer purchasing power.

## 4. Winners, losers and exposure categories

Assess the full distribution, not only listed shares:

- central and regional government, taxpayers and public-service users;
- households, consumers, workers and job seekers;
- MSMEs, suppliers, contractors and large companies;
- industries, exporters, importers and commodity producers;
- banks, lenders, bondholders and equity investors;
- regions and communities.

For each party or group, show:

- expected direction: potential benefit, potential cost, mixed, or not yet determined;
- direct or indirect exposure;
- mechanism and evidence chain;
- magnitude and calculation method, if defensible;
- short, medium and long-term horizon;
- distributional effects and offsetting impacts;
- alternative explanations, counter-evidence and unresolved questions.

A party receiving a contract or budget allocation is not automatically a net economic winner. Check contract execution, payment, costs, delivery, competition and public outcomes. A share-price rise is not proof that the company has received a business benefit.

## 5. Market impact and event study

When reliable time-series data exists, examine:

- IHSG and relevant sector indices;
- individual listed shares and trading volume;
- foreign investor net flows where available;
- rupiah exchange rate;
- government bond yields and spreads;
- relevant commodities, interest rates and global risk indicators.

Every event study must disclose:

- event date/time and source timestamp;
- estimation window and event window;
- benchmark index and peer/sector comparison;
- price-return and, where possible, volume/volatility measures;
- data frequency, market calendar and timezone;
- concurrent domestic and global events;
- confounders such as USD, global yields, commodity prices and broad market moves;
- method/version, missing observations and robustness checks.

Use abnormal return or relative performance only with a documented benchmark and estimation method. Report raw market movement separately from estimated event association. A before/after chart alone does not establish causation. If event timing is uncertain, information leaked earlier, trading is illiquid, or multiple events overlap, mark attribution as limited or unresolved.

Do not infer that an entire sector benefits from a political event merely because one stock rises. Check peers, index performance, company disclosures, contracts, earnings and subsequent outcomes.

## 6. Case example: alleged interception or unlawful surveillance

This is a workflow example, not a factual conclusion about any named person or company.

If a report alleges unlawful surveillance involving a president, officials or military/police personnel:

1. Create a dated event timeline and preserve the exact legal status of each person and allegation.
2. Link official police/prosecutor/court statements and documents separately from media reporting and denials.
3. Identify verified institutional responses, investigations, leadership changes, regulations or budget decisions.
4. Monitor relevant public expenditure and procurement only if an actual allocation, tender, contract or payment record appears.
5. Identify potentially exposed areas such as cybersecurity, communications security, defence/security procurement and regulated technology, but label these as exposure hypotheses until evidence of demand, procurement or revenue exists.
6. Monitor IHSG, rupiah, SBN yields, relevant sector indices and listed companies over disclosed event windows.
7. Compare with market benchmarks and global/domestic confounders.
8. Assess consequences for civil liberties, public trust, public spending and services only with suitable evidence.
9. Publish beneficiaries and cost-bearers with evidence strength, uncertainty and alternative explanations.
10. Update the assessment as investigation, court and procurement records evolve.

The system must never imply that a named company profited from an incident without verifiable evidence of a contract, revenue, transaction or other documented mechanism.

## 7. Dashboard experience

### National executive view

A compact panel should show:

- material events with potential economic or fiscal transmission;
- affected sectors and population groups;
- market observations and measurement period;
- potential beneficiaries and cost-bearers;
- evidence status and unresolved links;
- next milestones to monitor.

### Event detail view

Each event page should contain:

1. Event identity, date, geography and legal/administrative status.
2. Timeline of reports, official records, decisions and corrections.
3. Claims and evidence, including contradictions and source independence.
4. Institutional and policy response.
5. Linked budget, procurement, contract and project records.
6. Exposure map for sectors, organizations, regions and population groups.
7. Winners/losers matrix with mechanisms and evidence.
8. Market charts for IHSG, sector indices, shares, rupiah and bonds where data exists.
9. Event-study methodology and confounders.
10. Observed outcomes, scenario estimates, uncertainty and follow-up tasks.

### Winners/losers matrix

| Field | Required display |
|---|---|
| Party/group | Company, sector, government, household, workers, region or investors |
| Direction | Potential benefit, potential cost, mixed, not determined |
| Channel | Contract, spending, demand, tax, price, regulation, financing or risk |
| Evidence | Source and linked record |
| Effect type | Direct/indirect; observed/plausible/estimated/forecast |
| Horizon | Immediate, short, medium or long term |
| Magnitude | Value/range and formula, or unavailable |
| Caveat | Counter-evidence, confounders and unknowns |

## 8. Evidence and publication gates

Use the shared evidence vocabulary: `OBSERVED`, `REPORTED`, `ESTIMATED`, `FORECAST`. Also show legal/administrative case status separately from evidence status.

Minimum gates before publication:

- event identity and chronology are checked;
- original source is distinguished from syndicated repetition;
- official records are attributed, not treated as automatically proving every claim;
- claims are separated from evidence and conclusions;
- data period, unit, timezone and source are visible;
- market data is aligned to trading sessions and timestamps;
- causal language is withheld unless the method supports it;
- high-impact allegations and beneficiary claims receive human review;
- corrections, denials and counter-evidence remain accessible.

AI can propose entities, channels and summaries, but must cite retrieved records for material statements. Deterministic code computes market and fiscal metrics. Analysts approve high-impact conclusions. Source text is untrusted input.

## 9. Data requirements and dependencies

Before building the complete feature, audit existing event, news, evidence, entity, indicator and audit-log tables. Reuse canonical records where possible. Do not create duplicate event or entity tables without a documented gap analysis.

Required logical data:

- canonical event and event-source links;
- attributed claims and evidence records;
- entity and sector mappings;
- event-to-policy/budget/project relationships;
- exposure and transmission-channel definitions;
- market/indicator observations with source, period and timestamps;
- versioned analysis runs, methodology and review decisions;
- corrections and follow-up outcome records.

Potential data sources must be assessed for access stability, licensing, update frequency and geographic coverage before implementation. No connector is considered operational merely because a source is listed in the registry.

## 10. Acceptance criteria

The first release is accepted only when:

- one real event can be traced to original sources and evidence records;
- duplicate reports are grouped without losing source attribution;
- legal status and allegations are represented precisely;
- at least one exposure chain is linked to a real policy, budget, contract or other documented mechanism;
- market observations, if shown, have verified provenance and aligned timestamps;
- raw movement is separated from benchmark-relative association and causal claims;
- the winners/losers matrix displays uncertainty and counter-evidence;
- missing data is visible and no demo values are presented as live;
- calculations and relationship rules have tests and versions;
- role/access controls and review history are verified.

If source coverage or evidence is insufficient, the page must show `NOT_ASSESSED` or `INSUFFICIENT_DATA`, not an invented beneficiary, market effect or score.
