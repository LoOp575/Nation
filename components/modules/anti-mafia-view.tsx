"use client";

import { useState } from "react";
import { Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  AwaitingBadge,
  FindingStatusBadge,
  type FindingStatus,
} from "@/components/evidence/evidence-badge";
import {
  EvidenceDrawer,
  type EvidenceDrawerCase,
} from "@/components/evidence/evidence-drawer";

const LIFECYCLE_STAGES = [
  {
    step: "01",
    title: "Proposal & Perencanaan",
    source: "Bappenas / RKAKL",
    watch: "Apakah proyek muncul mendadak tanpa kajian kebutuhan atau dokumen perencanaan?",
  },
  {
    step: "02",
    title: "Alokasi Anggaran",
    source: "APBN / APBD",
    watch: "Kewajaran satuan harga & pergeseran pagu anggaran sebelum lelang dimulai.",
  },
  {
    step: "03",
    title: "Timeline Keputusan",
    source: "Catatan Resmi & Berita",
    watch: "Perubahan pejabat kunci, penolakan teknis, atau revisi regulasi menjelang tender.",
  },
  {
    step: "04",
    title: "Rencana & Tender",
    source: "LKPP / SiRUP / LPSE",
    watch: "Jumlah peserta, syarat teknis yang terlalu mengerucut, dan pola penawaran identik.",
  },
  {
    step: "05",
    title: "Pemasok & Pemilik Manfaat",
    source: "AHU / Data Sah Publik",
    watch: "Konsentrasi pemenang berulang serta potensi benturan kepentingan yang terverifikasi sah.",
  },
  {
    step: "06",
    title: "Kontrak & Adendum",
    source: "LPSE / Dokumen Kontrak",
    watch: "Lonjakan nilai kontrak atau perubahan spesifikasi/waktu melalui adendum berulang.",
  },
  {
    step: "07",
    title: "Pembayaran vs Progres Fisik",
    source: "Realisasi Keuangan & Lapangan",
    watch: "Ketimpangan antara termin uang keluar dengan penyelesaian fisik di lapangan.",
  },
  {
    step: "08",
    title: "Audit & Manfaat Publik",
    source: "BPK / Indikator Lokal",
    watch: "Temuan audit tanpa tindak lanjut dan apakah masyarakat benar-benar menerima manfaat proyek.",
  },
];

const RISK_RULES = [
  {
    code: "RULE-AM-01",
    name: "Kompetisi Tender Minim",
    desc: "Peserta yang menawar atau lolos evaluasi jauh di bawah rata-rata proyek sejenis di sektor yang sama.",
  },
  {
    code: "RULE-AM-02",
    name: "Konsentrasi Pemenang Berulang",
    desc: "Pola kemenangan berulang pada grup pemasok yang sama lintas paket dalam periode pendek.",
  },
  {
    code: "RULE-AM-03",
    name: "Adendum & Pembengkakan Nilai",
    desc: "Perubahan kontrak berulang yang menaikkan biaya atau memundurkan jadwal penyelesaian secara material.",
  },
  {
    code: "RULE-AM-04",
    name: "Ketimpangan Pembayaran vs Fisik",
    desc: "Realisasi pembayaran tinggi sementara laporan fisik tertinggal atau kualitas proyek gagal uji.",
  },
  {
    code: "RULE-AM-05",
    name: "Tindak Lanjut Audit Mandek",
    desc: "Temuan pemeriksaan resmi (misalnya BPK/Inspektorat) yang berlarut tanpa penyelesaian.",
  },
];

const FINDING_LADDER: { status: FindingStatus; meaning: string }[] = [
  { status: "RECORDED", meaning: "Dokumen/peristiwa resmi tercatat dengan tautan sumber asli." },
  { status: "NEEDS_REVIEW", meaning: "Satu sinyal risiko memicu perlunya pemeriksaan konteks & pembanding." },
  { status: "ELEVATED_RISK_SIGNAL", meaning: "Beberapa aturan risiko terpenuhi serentak; masih bukan vonis hukum." },
  { status: "UNDER_OFFICIAL_REVIEW", meaning: "Otoritas resmi secara terbuka mengonfirmasi sedang melakukan pemeriksaan." },
  { status: "OFFICIAL_LEGAL_FINDING", meaning: "Putusan atau temuan hukum resmi lembaga berwenang telah diterbitkan." },
];

const DEMO_DRAWER_CASE: EvidenceDrawerCase = {
  title: "Struktur Panel Bukti Kasus Anti-Mafia",
  subtitle: "Menunjukkan bagaimana sinyal risiko dan penjelasan pembanding wajib ditampilkan seimbang.",
  isBlueprint: true,
  findingStatus: "ELEVATED_RISK_SIGNAL",
  evidenceStatus: "OBSERVED",
  lifecycleStage: "04 Tender LPSE → 06 Kontrak & Adendum → 07 Pembayaran vs Fisik",
  supportingSignals: [
    "Aturan RULE-AM-01 & RULE-AM-03 memicu skor risiko secara deterministik (bukan tebakan AI).",
    "Menyertakan tautan arsip tender, tanggal perubahan kontrak, dan selisih realisasi pembayaran vs fisik.",
  ],
  counterEvidence: [
    "Menampilkan klarifikasi resmi instansi, hak jawab vendor, serta faktor objektif (force majeure, kenaikan harga acuan resmi).",
    "Setiap catatan yang tidak lengkap tetap ditandai sebagai celah data, bukan dianggap niat jahat.",
  ],
  dataGaps: [
    "Integrasi tabel pengadaan & kontrak (Phase 4–5) belum dijalankan.",
    "Verifikasi Beneficial Ownership dibatasi hanya pada catatan resmi yang sah diakses publik.",
  ],
  sourceNote:
    "Sesuai docs/intelligence/anti-mafia.md, sistem dilarang menuduh individu/perusahaan sebagai 'mafia' atau 'koruptor' secara otomatis.",
};

export function AntiMafiaView() {
  const [activeStage, setActiveStage] = useState(LIFECYCLE_STAGES[0]);
  const [drawerItem, setDrawerItem] = useState<EvidenceDrawerCase | null>(null);

  return (
    <main className="module-page-wide">
      <div className="page-eyebrow">PUBLIC ACCOUNTABILITY · ANTI-MAFIA WATCH</div>
      <div className="module-title-row">
        <div>
          <h1>Meja Pengawasan Belanja &amp; Proyek Publik</h1>
          <p className="page-lead">
            Anti-Mafia Intelligence melacak siklus hidup uang publik dari perencanaan, tender, kontrak, adendum, progres fisik, hingga manfaat masyarakat—berbasis aturan sinyal risiko yang dapat diaudit, bukan mesin fitnah otomatis.
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setDrawerItem(DEMO_DRAWER_CASE)}
        >
          <Scale size={15} /> Lihat Panel Bukti &amp; Counter-Evidence
        </button>
      </div>

      {/* Siklus 8 Tahap Interaktif */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">KLIK TAHAP UNTUK MELIHAT PARAMETER PENGAWASAN</span>
            <h2>Siklus Pengawasan Dana Publik</h2>
          </div>
          <AwaitingBadge label="INTEGRASI LKPP / LPSE (PHASE 4–5)" />
        </div>

        <div className="lifecycle-pills">
          {LIFECYCLE_STAGES.map((stage) => (
            <button
              key={stage.step}
              type="button"
              className={activeStage.step === stage.step ? "lifecycle-pill active" : "lifecycle-pill"}
              onClick={() => setActiveStage(stage)}
            >
              <span className="mono-num">{stage.step}</span>
              <strong>{stage.title}</strong>
            </button>
          ))}
        </div>

        <div className="lifecycle-detail-box">
          <div>
            <span className="section-kicker">TAHAP {activeStage.step} · SUMBER TARGET: {activeStage.source}</span>
            <h3>{activeStage.title}</h3>
            <p>{activeStage.watch}</p>
          </div>
          <div className="lifecycle-detail-status">
            <AwaitingBadge label="MENUNGGU DATA PENGADAAN" />
          </div>
        </div>
      </section>

      <div className="cc-split-55-45">
        {/* Aturan Sinyal Risiko */}
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">ATURAN DETERMINISTIK</span>
              <h2>Daftar Sinyal Risiko (Red-Flag Rules)</h2>
            </div>
            <ShieldAlert size={16} />
          </div>

          <div className="rules-list">
            {RISK_RULES.map((rule) => (
              <div key={rule.code} className="rule-row">
                <span className="mono-num rule-code">{rule.code}</span>
                <div>
                  <strong>{rule.name}</strong>
                  <p>{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Tangga Status Hukum */}
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">PEMBATASAN ETIK &amp; HUKUM</span>
              <h2>5 Tingkat Status Temuan</h2>
            </div>
            <ShieldCheck size={16} />
          </div>

          <div className="ladder-list">
            {FINDING_LADDER.map((tier) => (
              <div key={tier.status} className="ladder-row">
                <FindingStatusBadge status={tier.status} />
                <p>{tier.meaning}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <EvidenceDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
    </main>
  );
}
