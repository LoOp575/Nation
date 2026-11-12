import type { EvidenceStatus } from "@/lib/data/national-snapshot";

export type FindingStatus =
  | "RECORDED"
  | "NEEDS_REVIEW"
  | "ELEVATED_RISK_SIGNAL"
  | "UNDER_OFFICIAL_REVIEW"
  | "OFFICIAL_LEGAL_FINDING";

const EVIDENCE_META: Record<
  EvidenceStatus,
  { label: string; hint: string; className: string }
> = {
  OBSERVED: {
    label: "OBSERVED",
    hint: "Tercatat langsung di sumber data/dokumen resmi",
    className: "badge-observed",
  },
  REPORTED: {
    label: "REPORTED",
    hint: "Klaim atau laporan media; belum otomatis terbukti",
    className: "badge-reported",
  },
  ESTIMATED: {
    label: "ESTIMATED",
    hint: "Nilai turunan dengan metode, rumus & asumsi terbuka",
    className: "badge-estimated",
  },
  FORECAST: {
    label: "FORECAST",
    hint: "Proyeksi masa depan disertai rentang ketidakpastian",
    className: "badge-forecast",
  },
};

const FINDING_META: Record<
  FindingStatus,
  { label: string; className: string }
> = {
  RECORDED: { label: "RECORDED", className: "badge-reported" },
  NEEDS_REVIEW: { label: "NEEDS REVIEW", className: "badge-estimated" },
  ELEVATED_RISK_SIGNAL: { label: "ELEVATED RISK SIGNAL", className: "badge-risk" },
  UNDER_OFFICIAL_REVIEW: { label: "OFFICIAL REVIEW", className: "badge-forecast" },
  OFFICIAL_LEGAL_FINDING: { label: "LEGAL FINDING", className: "badge-observed" },
};

export function EvidenceBadge({
  status,
  compact = false,
}: {
  status: EvidenceStatus;
  compact?: boolean;
}) {
  const meta = EVIDENCE_META[status];
  return (
    <span
      className={`evidence-badge ${meta.className} ${compact ? "compact" : ""}`}
      title={meta.hint}
    >
      <i className="badge-dot" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function FindingStatusBadge({ status }: { status: FindingStatus }) {
  const meta = FINDING_META[status];
  return <span className={`evidence-badge ${meta.className}`}>{meta.label}</span>;
}

export function AwaitingBadge({ label = "MENUNGGU DATA" }: { label?: string }) {
  return <span className="evidence-badge badge-awaiting">{label}</span>;
}

export function EvidenceLegendStrip() {
  return (
    <div className="evidence-legend-strip" aria-label="Legenda status bukti">
      {(Object.keys(EVIDENCE_META) as EvidenceStatus[]).map((key) => {
        const item = EVIDENCE_META[key];
        return (
          <div key={key} className="legend-item">
            <EvidenceBadge status={key} compact />
            <span>{item.hint}</span>
          </div>
        );
      })}
    </div>
  );
}
