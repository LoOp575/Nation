"use client";

import type { PublishedObservation } from "@/lib/data/national-snapshot";

export type BudgetAllocationSlot = {
  key: string;
  label: string;
  description: string;
  targetSource: string;
  colorClass: string;
  value?: number | null;
  sharePercent?: number | null;
};

export function BudgetAllocationVisual({
  slots,
  totalLabel,
}: {
  slots: BudgetAllocationSlot[];
  totalLabel?: string | null;
}) {
  const hasRealValues = slots.some((s) => typeof s.sharePercent === "number" && s.sharePercent > 0);

  return (
    <div className="budget-alloc-wrap">
      <div className="budget-alloc-bar" role="img" aria-label="Proporsi belanja dan alokasi APBN">
        {hasRealValues ? (
          slots.map((slot) => {
            const pct = Math.max(0, slot.sharePercent ?? 0);
            if (pct === 0) return null;
            return (
              <div
                key={slot.key}
                className={`alloc-segment ${slot.colorClass}`}
                style={{ width: `${pct}%` }}
                title={`${slot.label}: ${pct.toFixed(1)}%`}
              />
            );
          })
        ) : (
          <div className="alloc-segment alloc-empty" style={{ width: "100%" }}>
            <span>Menunggu realisasi belanja APBN dari Kemenkeu untuk membagi proporsi Rp 100 pajak</span>
          </div>
        )}
      </div>

      <div className="alloc-grid">
        {slots.map((slot) => (
          <div key={slot.key} className="alloc-item">
            <div className="alloc-item-head">
              <span className={`alloc-dot ${slot.colorClass}`} />
              <strong>{slot.label}</strong>
              <span className="mono-num alloc-pct">
                {typeof slot.sharePercent === "number" ? `${slot.sharePercent.toFixed(1)}%` : "—%"}
              </span>
            </div>
            <p>{slot.description}</p>
            <div className="alloc-item-foot">
              <span className="mono-num">
                {typeof slot.value === "number"
                  ? `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(slot.value)} T`
                  : "Menunggu data realisasi"}
              </span>
              <small>{slot.targetSource}</small>
            </div>
          </div>
        ))}
      </div>

      {totalLabel && <div className="alloc-total-note">{totalLabel}</div>}
    </div>
  );
}

export function TrendSeriesVisual({
  title,
  unit,
  observations,
  emptyHint,
}: {
  title: string;
  unit: string;
  observations: PublishedObservation[];
  emptyHint: string;
}) {
  const ordered = [...observations]
    .sort((a, b) => a.period_end.localeCompare(b.period_end))
    .slice(-12);

  if (ordered.length < 2) {
    return (
      <div className="chart-empty-canvas" aria-label={`Grafik ${title} menunggu data`}>
        <svg viewBox="0 0 600 180" className="chart-svg-empty" preserveAspectRatio="none">
          {[36, 72, 108, 144].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} className="chart-grid-line" />
          ))}
          <line x1="0" y1="164" x2="600" y2="164" className="chart-axis-line" />
        </svg>
        <div className="chart-empty-overlay">
          <strong>Deret waktu {title} belum terisi ({ordered.length} dari minimal 2 periode)</strong>
          <p>{emptyHint}</p>
        </div>
      </div>
    );
  }

  const width = 600;
  const height = 180;
  const padX = 28;
  const padY = 20;
  const values = ordered.map((d) => Number(d.value));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const points = ordered.map((obs, idx) => {
    const x = padX + (idx / (ordered.length - 1)) * (width - padX * 2);
    const y = height - padY - ((Number(obs.value) - minVal) / range) * (height - padY * 2);
    return { x, y, obs };
  });

  const polyline = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${points[0].x.toFixed(1)},${height - padY} ${polyline} ${points[points.length - 1].x.toFixed(1)},${height - padY}`;

  return (
    <div className="chart-live-canvas">
      <div className="chart-live-meta">
        <span>{title}</span>
        <span className="mono-num">
          Rentang: {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(minVal)} –{" "}
          {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(maxVal)} {unit}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg-live">
        <defs>
          <linearGradient id="npTrendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[36, 72, 108, 144].map((y) => (
          <line key={y} x1={padX} y1={y} x2={width - padX} y2={y} className="chart-grid-line" />
        ))}
        <polygon points={area} fill="url(#npTrendGrad)" />
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polyline}
        />
        {points.map((pt, i) => (
          <g key={`${pt.obs.period_end}-${i}`}>
            <circle cx={pt.x} cy={pt.y} r="3.6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div className="chart-axis-labels mono-num">
        <span>{ordered[0].period_end.slice(0, 7)}</span>
        <span>{ordered[Math.floor(ordered.length / 2)].period_end.slice(0, 7)}</span>
        <span>{ordered[ordered.length - 1].period_end.slice(0, 7)}</span>
      </div>
    </div>
  );
}
