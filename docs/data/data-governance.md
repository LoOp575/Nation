# Data Governance and Provenance

## 1. Evidence labels

| Label | Definition | Display rule |
|---|---|---|
| OBSERVED | Directly published measurement or documented event | Identify source, period, and publication |
| REPORTED | Claim reported by a source, not independently established | Attribute the claim; do not state as proven |
| ESTIMATED | Derived value with reproducible method and assumptions | Show method, assumptions, and uncertainty |
| FORECAST | Future projection | Show model, horizon, assumptions, and uncertainty |

Legal status is a separate dimension. Do not treat "reported" as "proven", or an official allegation as a final court finding.

## 2. Required provenance fields

Every imported record should preserve, where applicable:
- source_id and source_name
- source_url or document identifier
- source_type and authority class
- published_at
- observed_period_start and observed_period_end
- retrieved_at
- source_document_version or checksum
- adapter_name and adapter_version
- verification_status
- methodology and unit
- geographic_scope
- revision_status
- reviewer and review timestamp, if human-reviewed

## 3. Source authority and conflict handling

Authority is contextual, not a universal ranking. BPS is the primary source for its official statistical releases; BI for its monetary publications; Ministry of Finance for APBN publications; LKPP for procurement systems and guidance; courts for judicial outcomes. Media can be valuable for reporting events but must remain attributed.

When sources disagree:
1. Preserve both source records.
2. Compare definitions, periods, units, and revisions.
3. Prefer the designated primary source for the relevant statistic.
4. Explain unresolved differences.
5. Never silently overwrite one source with another.

## 4. Data quality dimensions

Track:
- completeness
- validity
- timeliness
- consistency
- uniqueness
- source authority
- revision frequency
- geographic coverage
- methodological comparability

Data quality must be visible in the Data Observatory. Missing information is not zero and should not be imputed without an explicit method and label.

## 5. Revisions and historical integrity

Never overwrite a published observation without retaining the prior version. Store revision timestamp, previous value, new value, source notice, and reason where available. Reports should identify the data vintage used so analyses can be reproduced.

## 6. Responsible use and legal compliance

Before enabling a connector, review:
- API terms and licensing
- attribution requirements
- commercial-use restrictions
- rate limits and caching requirements
- personal-data obligations
- document copyright and redistribution limits

Do not bypass authentication, access controls, or rate limits. Publicly accessible does not automatically mean unrestricted reuse.

## 7. Human review

Human review is required before:
- publishing sensitive allegations
- asserting a conflict-of-interest finding
- linking a named person to a company where identity is uncertain
- promoting an elevated risk signal to an investigative finding
- publishing corrections that materially change a prior conclusion

Maintain a correction and right-of-reply process for affected parties.
