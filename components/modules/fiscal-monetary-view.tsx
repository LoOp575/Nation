"use client";

import Link from "next/link";
import { Calculator, ExternalLink, Landmark, ShieldCheck } from "lucide-react";
import type { NationalSnapshot } from "@/lib/data/national-snapshot";
import { useWorkspace } from "@/components/workspace-context";
import { AwaitingBadge, EvidenceBadge } from "@/components/evidence/evidence-badge";
import {
  BudgetAllocationVisual,
  TrendSeriesVisual,
  type BudgetAllocationSlot,
} from "@/components/charts/fiscal-charts";

const APBN_ALLOCATION_SLOTS: BudgetAllocationSlot[] = [
  {
    key: "pendidikan",
    label: "Fungsi Pendidikan (Mandat 20%)",
    description: "Transfer daerah pendidikan, KIP Kuliah, BOS, riset, dan sarana sekolah",
    targetSource: "Kemenkeu APBN KiTa",
    colorClass: "alloc-blue",
  },
  {
    key: "perlinsos",
    label: "Perlindungan Sosial",
    description: "PKH, bantuan pangan, subsidi iuran PBI JKN, dan bansos terarah",
    targetSource: "Kemenkeu / Kemensos",
    colorClass: "alloc-emerald",
  },
  {
    key: "infrastruktur",
    label: "Infrastruktur & Konektivitas",
    description: "Jalan nasional, irigasi, bandara/pelabuhan, dan infrastruktur dasar",
    targetSource: "Kemenkeu / PUPR",
    colorClass: "alloc-cyan",
  },
  {
    key: "kesehatan",
    label: "Kesehatan Publik",
    description: "Penurunan stunting, fasilitas kesehatan daerah, dan layanan BPJS",
    targetSource: "Kemenkeu / Kemenkes",
    colorClass: "alloc-violet",
  },
  {
    key: "subsidi",
    label: "Subsidi & Kompensasi Energi",
    description: "BBM bersubsidi, LPG 3 kg, tarif listrik, dan subsidi pupuk",
    targetSource: "Kemenkeu APBN KiTa",
    colorClass: "alloc-amber",
  },
  {
    key: "bunga_utang",
    label: "Pembayaran Bunga Utang",
    description: "Beban kupon SBN & bunga pinjaman yang dibayar sebelum belanja produktif",
    targetSource: "Kemenkeu DJPPR",
    colorClass: "alloc-rose",
  },
];

export function FiscalMonetaryView({ snapshot }: { snapshot: NationalSnapshot }) {
  const { fiscalYear } = useWorkspace();

  const fiscalIndicators = snapshot.indicators.filter((ind) => {
    const hay = `${ind.code} ${ind.name} ${ind.category}`.toLowerCase();
    return ["fiskal", "fiscal", "apbn", "utang", "debt", "pajak", "tax", "moneter", "bi"].some(
      (kw) => hay.includes(kw),
    );
  });

  const primarySeries = fiscalIndicators.find((i) => i.history.length >= 2) ?? fiscalIndicators[0] ?? null;

  return (
    <main className="module-page-wide">
      <div className="page-eyebrow">PUBLIC FINANCE · {fiscalYear}</div>
      <div className="module-title-row">
        <div>
          <h1>Fiskal, Utang Negara &amp; Pajak</h1>
          <p className="page-lead">
            Pantau total utang pemerintah, rasio utang terhadap PDB, realisasi pendapatan dan penerimaan pajak, serta ke mana uang APBN dibelanjakan—dengan pemisahan ketat antara pagu anggaran dan realisasi aktual.
          </p>
        </div>
        <div className="module-head-actions">
          <Link href="/event-impact#simulator" className="btn-secondary">
            <Calculator size={15} /> Simulasi Sensitivitas Utang
          </Link>
        </div>
      </div>

      {/* 4 Pilar Dompet Negara */}
      <section className="fiscal-pillars-grid">
        <article className="core-kpi-card">
          <div className="ck-header">
            <span className="ck-kicker">UTANG PEMERINTAH</span>
            <AwaitingBadge label="DJPPR KEMENKEU" />
          </div>
          <h3>Total Posisi Utang</h3>
          <div className="ck-value mono-num">Rp —</div>
          <div className="ck-visual-meter">
            <div className="meter-labels">
              <span>Rasio Utang / PDB</span>
              <span className="mono-num">Plafon UU: 60%</span>
            </div>
            <div className="meter-track">
              <div className="meter-threshold" style={{ left: "60%" }} />
            </div>
          </div>
          <div className="ck-footer">Meliputi SBN Domestik, SBN Valas, dan Pinjaman Bilateral/Multilateral.</div>
        </article>

        <article className="core-kpi-card">
          <div className="ck-header">
            <span className="ck-kicker">PENDAPATAN NEGARA</span>
            <AwaitingBadge label="APBN KITA" />
          </div>
          <h3>Realisasi Pendapatan</h3>
          <div className="ck-value mono-num">Rp —</div>
          <div className="ck-visual-meter">
            <div className="meter-labels">
              <span>Capaian vs Target {fiscalYear}</span>
              <span className="mono-num">—%</span>
            </div>
            <div className="meter-track" />
          </div>
          <div className="ck-footer">Penjumlahan Penerimaan Perpajakan, PNBP, dan Hibah.</div>
        </article>

        <article className="core-kpi-card">
          <div className="ck-header">
            <span className="ck-kicker">PENERIMAAN PAJAK</span>
            <AwaitingBadge label="DJP & DJBC" />
          </div>
          <h3>Pajak &amp; Kepabeanan</h3>
          <div className="ck-value mono-num">Rp —</div>
          <div className="tax-mini-pills">
            <span>PPh: —</span>
            <span>PPN/PPnBM: —</span>
            <span>Cukai: —</span>
            <span>Tax Ratio: —%</span>
          </div>
          <div className="ck-footer">Mengukur kemampuan negara membiayai belanja tanpa menambah utang baru.</div>
        </article>

        <article className="core-kpi-card">
          <div className="ck-header">
            <span className="ck-kicker">KESEIMBANGAN FISKAL</span>
            <AwaitingBadge label="APBN & BI" />
          </div>
          <h3>Defisit APBN &amp; Bunga Utang</h3>
          <div className="ck-value mono-num">—% PDB</div>
          <div className="ck-visual-meter">
            <div className="meter-labels">
              <span>Batas Defisit UU No. 17/2003</span>
              <span className="mono-num">Maks 3,0% PDB</span>
            </div>
            <div className="meter-track">
              <div className="meter-threshold" style={{ left: "50%" }} />
            </div>
          </div>
          <div className="ck-footer">Menampilkan keseimbangan primer serta porsi pendapatan yang terserap bunga utang.</div>
        </article>
      </section>

      {/* Alokasi Belanja & Tren */}
      <div className="cc-split-60-40">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">TRANSPARANSI BELANJA PUBLIK</span>
              <h2>Ke Mana Setiap Rp 100 Pajak Pergi?</h2>
            </div>
            <EvidenceBadge status="OBSERVED" compact />
          </div>
          <BudgetAllocationVisual
            slots={APBN_ALLOCATION_SLOTS}
            totalLabel="Angka aktual hanya ditampilkan setelah laporan realisasi APBN KiTa Kemenkeu dipublikasikan ke tabel indicator_observations."
          />
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">DERET WAKTU FISKAL</span>
              <h2>Tren Historis APBN &amp; Utang</h2>
            </div>
            <Landmark size={16} />
          </div>
          <TrendSeriesVisual
            title={primarySeries ? primarySeries.name : "Utang & Penerimaan Negara"}
            unit={primarySeries?.unit ?? "Rp T"}
            observations={primarySeries?.history ?? []}
            emptyHint="Setelah minimal 2 periode laporan bulanan Kemenkeu atau BI SEKI tervalidasi, grafik historis otomatis menggambar tren realisasi."
          />
          <div className="fiscal-sources-box">
            <strong>Sumber Target Resmi Phase 2:</strong>
            <ul>
              <li>
                <span>Kementerian Keuangan — APBN KiTa &amp; DJPPR (Utang)</span>
                <a href="https://www.kemenkeu.go.id" target="_blank" rel="noreferrer">
                  kemenkeu.go.id <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <span>Bank Indonesia — Statistik Ekonomi &amp; Keuangan (SEKI)</span>
                <a href="https://www.bi.go.id/id/statistik/ekonomi-keuangan/seki/Default.aspx" target="_blank" rel="noreferrer">
                  bi.go.id <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </article>
      </div>

      {fiscalIndicators.length > 0 && (
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">DATA TERPUBLIKASI</span>
              <h2>Indikator Fiskal &amp; Moneter di Supabase ({fiscalIndicators.length})</h2>
            </div>
          </div>
          <div className="executive-metric-grid">
            {fiscalIndicators.map((ind) => (
              <article key={ind.id} className="metric-card">
                <div className="metric-category">{ind.category}</div>
                <h3>{ind.name}</h3>
                <div className="metric-value mono-num">
                  {ind.latest ? `${ind.latest.value} ${ind.latest.unit}` : "Belum tersedia"}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="module-note">
        <ShieldCheck size={15} />
        <span>
          <strong>Aturan Integritas Fiskal:</strong> National Pulse memisahkan angka <em>Target APBN</em>, <em>Realisasi Sementara</em>, dan <em>LKPP Audited BPK</em>. Tidak ada angka utang atau pajak yang dikarang saat konektor belum berjalan.
        </span>
      </div>
    </main>
  );
}
