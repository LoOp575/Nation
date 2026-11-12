"use client";

import { useEffect } from "react";
import { X, ShieldAlert, Scale, FileText, AlertTriangle } from "lucide-react";
import {
  EvidenceBadge,
  FindingStatusBadge,
  type FindingStatus,
} from "@/components/evidence/evidence-badge";

export type EvidenceDrawerCase = {
  title: string;
  subtitle: string;
  isBlueprint: boolean;
  findingStatus: FindingStatus;
  evidenceStatus: "OBSERVED" | "REPORTED" | "ESTIMATED" | "FORECAST";
  lifecycleStage: string;
  supportingSignals: string[];
  counterEvidence: string[];
  dataGaps: string[];
  sourceNote: string;
};

export function EvidenceDrawer({
  item,
  onClose,
}: {
  item: EvidenceDrawerCase | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true" aria-label={item.title}>
      <button
        type="button"
        className="drawer-scrim"
        aria-label="Tutup panel bukti"
        onClick={onClose}
      />
      <aside className="evidence-drawer">
        <div className="drawer-header">
          <div>
            <div className="drawer-badges">
              <FindingStatusBadge status={item.findingStatus} />
              <EvidenceBadge status={item.evidenceStatus} compact />
              {item.isBlueprint && (
                <span className="evidence-badge badge-awaiting">
                  STRUKTUR TEMPLATE · BUKAN KASUS NYATA
                </span>
              )}
            </div>
            <h2>{item.title}</h2>
            <p className="drawer-subtitle">{item.subtitle}</p>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-stage-box">
            <span>TAHAP SIKLUS PEMANTAUAN</span>
            <strong>{item.lifecycleStage}</strong>
          </div>

          <div className="drawer-fair-grid">
            <section className="drawer-col supporting">
              <div className="drawer-col-head">
                <ShieldAlert size={15} />
                <h3>Sinyal & Bukti Pendukung</h3>
              </div>
              <ul>
                {item.supportingSignals.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>

            <section className="drawer-col counter">
              <div className="drawer-col-head">
                <Scale size={15} />
                <h3>Penjelasan Pembanding (Counter-Evidence)</h3>
              </div>
              <ul>
                {item.counterEvidence.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="drawer-gaps">
            <div className="drawer-col-head">
              <AlertTriangle size={15} />
              <h3>Celah Data & Batas Verifikasi</h3>
            </div>
            <ul>
              {item.dataGaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </section>

          <div className="drawer-legal-note">
            <FileText size={15} />
            <div>
              <strong>Prinsip Hukum & Akuntabilitas:</strong>{" "}
              {item.sourceNote} Sinyal risiko adalah petunjuk pemeriksaan, bukan vonis bersalah atau tuduhan pidana terhadap pihak mana pun.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
