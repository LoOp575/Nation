"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  Clock,
  Database,
  FileCheck2,
  Landmark,
  Newspaper,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type {
  NationalSnapshot,
  SnapshotIndicator,
} from "@/lib/data/national-snapshot";
import { useWorkspace } from "@/components/workspace-context";
import {
  AwaitingBadge,
  EvidenceBadge,
  EvidenceLegendStrip,
} from "@/components/evidence/evidence-badge";
import {
  BudgetAllocationVisual,
  TrendSeriesVisual,
  type BudgetAllocationSlot,
} from "@/components/charts/fiscal-charts";
import { IndonesiaRegionMap } from "@/components/maps/indonesia-region-map";
import {
  EvidenceDrawer,
  type EvidenceDrawerCase,
} from "@/components/evidence/evidence-drawer";

function formatNumber(value: number, unit: string) {
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

function formatPeriod(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function findMatchingIndicator(
  indicators: SnapshotIndicator[],
  keywords: string[],
): SnapshotIndicator | null {
  for (const ind of indicators) {
    const hay = `${ind.code} ${ind.name} ${ind.category}`.toLowerCase();
    if (keywords.some((kw) => hay.includes(kw))) {
      return ind;
    }
  }
  return null;
}

const BUDGET_SLOTS: BudgetAllocationSlot[] = [
  {
    key: "pendidikan",
    label: "Pendidikan",
    description: "Mandat minimal 20% APBN (BOS, KIP, gaji & infrastruktur sekolah)",
    targetSource: "Kemenkeu APBN KiTa",
    colorClass: "alloc-blue",
    value: null,
    sharePercent: null,
  },
  {
    key: "perlinsos",
    label: "Perlindungan Sosial",
    description: "PKH, sembako, bantuan iuran JKN, dan bantalan daya beli",
    targetSource: "Kemenkeu / Kemensos",
    colorClass: "alloc-emerald",
    value: null,
    sharePercent: null,
  },
  {
    key: "infrastruktur",
    label: "Infrastruktur & Konektivitas",
    description: "Jalan, irigasi, pelabuhan, energi, dan akses dasar daerah",
    targetSource: "Kemenkeu / PUPR / LKPP",
    colorClass: "alloc-cyan",
    value: null,
    sharePercent: null,
  },
  {
    key: "kesehatan",
    label: "Kesehatan",
    description: "Layanan rumah sakit, pencegahan stunting, dan jaminan kesehatan",
    targetSource: "Kemenkeu / Kemenkes",
    colorClass: "alloc-violet",
    value: null,
    sharePercent: null,
  },
  {
    key: "subsidi",
    label: "Subsidi & Kompensasi",
    description: "BBM, listrik, pupuk, dan stabilisasi pasokan pangan",
    targetSource: "Kemenkeu APBN KiTa",
    colorClass: "alloc-amber",
    value: null,
    sharePercent: null,
  },
  {
    key: "bunga_utang",
    label: "Pembayaran Bunga Utang",
    description: "Beban imbal hasil SBN & pinjaman yang dibayar dari pendapatan negara",
    targetSource: "Kemenkeu DJPPR",
    colorClass: "alloc-rose",
    value: null,
    sharePercent: null,
  },
];

const SAMPLE_ANATOMY_CASE: EvidenceDrawerCase = {
  title: "Anatomi Pemeriksaan Siklus Proyek & Anti-Mafia",
  subtitle:
    "Ilustrasi alur kerja bukti National Pulse sebelum konektor LPSE/SiRUP/BPK diaktifkan. Tidak merujuk proyek atau pihak tertentu.",
  isBlueprint: true,
  findingStatus: "NEEDS_REVIEW",
  evidenceStatus: "OBSERVED",
  lifecycleStage: "03 Kontrak & Adendum → 04 Progres Fisik Lapangan",
  supportingSignals: [
    "Aturan #R-02: Adendum nilai kontrak dan perubahan lingkup tercatat berulang di dokumen pengadaan resmi.",
    "Aturan #R-05: Perbandingan persentase pencairan termin vs laporan kemajuan fisik menunjukkan selisih yang perlu diperiksa.",
    "Setiap sinyal wajib menyimpan tautan dokumen sumber asli, hash SHA-256, dan timestamp pengambilan.",
  ],
  counterEvidence: [
    "Penyesuaian harga material resmi atau keadaan kahar (cuaca/pembebasan lahan) dapat menjelaskan perubahan jadwal secara sah.",
    "Laporan fisik lapangan dapat mengalami keterlambatan administrasi pelaporan dibanding jadwal transfer termin.",
    "Tidak ada nama perusahaan atau pejabat yang dilabeli koruptor oleh sistem otomatis.",
  ],
  dataGaps: [
    "Konektor LKPP/SiRUP/LPSE belum terhubung ke database Supabase.",
    "Data kepemilikan manfaat (Beneficial Ownership) baru dapat ditautkan bila tersedia melalui akses hukum yang sah.",
  ],
  sourceNote:
    "Sesuai docs/intelligence/anti-mafia.md, status meningkat dari RECORDED ke OFFICIAL_LEGAL_FINDING hanya setelah verifikasi dokumen lembaga berwenang.",
};

export function ExecutiveCommandCenter({
  snapshot,
  todayLabel,
}: {
  snapshot: NationalSnapshot;
  todayLabel: string;
}) {
  const { fiscalYear, regionScope } = useWorkspace();
  const [fiscalTab, setFiscalTab] = useState<"allocation" | "trend">("allocation");
  const [newsFilter, setNewsFilter] = useState<"ALL" | "REPORTED" | "OBSERVED">("ALL");
  const [drawerCase, setDrawerCase] = useState<EvidenceDrawerCase | null>(null);

  const debtIndicator = useMemo(
    () => findMatchingIndicator(snapshot.indicators, ["utang", "debt"]),
    [snapshot.indicators],
  );
  const revenueIndicator = useMemo(
    () => findMatchingIndicator(snapshot.indicators, ["pendapatan", "apbn", "revenue", "pajak", "tax"]),
    [snapshot.indicators],
  );
  const gdpIndicator = useMemo(
    () => findMatchingIndicator(snapshot.indicators, ["pdb", "gdp", "pertumbuhan"]),
    [snapshot.indicators],
  );
  const inflationIndicator = useMemo(
    () => findMatchingIndicator(snapshot.indicators, ["inflasi", "inflation", "ihk"]),
    [snapshot.indicators],
  );

  const primaryTrendIndicator = useMemo(
    () => snapshot.indicators.find((i) => i.history.length >= 2) ?? snapshot.indicators[0] ?? null,
    [snapshot.indicators],
  );

  const coveredProvinceCodes = useMemo(() => {
    const codes = new Set<string>();
    for (const ind of snapshot.indicators) {
      for (const obs of ind.history) {
        if (obs.geography_code && obs.geography_code !== "ID" && obs.geography_code.startsWith("ID-")) {
          codes.add(obs.geography_code);
        }
      }
    }
    return Array.from(codes);
  }, [snapshot.indicators]);

  const filteredEvents = useMemo(() => {
    if (newsFilter === "ALL") return snapshot.events;
    return snapshot.events.filter((ev) => ev.evidence_status === newsFilter);
  }, [newsFilter, snapshot.events]);

  const hasPublishedData = snapshot.observationCount > 0;

  return (
    <main className="command-center">
      {/* HEADER KONTEKS */}
      <section className="cc-hero-head">
        <div>
          <div className="eyebrow">
            {todayLabel.toUpperCase()} · {fiscalYear} · WILAYAH {regionScope}
          </div>
          <h1>Kondisi Negara dalam Sekali Lihat</h1>
          <p className="lead">
            Ringkasan uang negara, ekonomi rakyat, berita harian terverifikasi, serta radar akuntabilitas proyek pemerintah dalam satu layar berbasis bukti.
          </p>
        </div>

        <div className="cc-hero-actions">
          <Link href="/event-impact#simulator" className="btn-secondary">
            <Calculator size={15} />
            <span>Simulasi Rumus</span>
          </Link>
          <Link href="/ai-analyst" className="btn-primary">
            <Sparkles size={15} />
            <span>AI Briefing</span>
          </Link>
        </div>
      </section>

      {/* STATUS PIPELINE STRIP */}
      <section className="pulse-strip" aria-label="Status keandalan data nasional">
        <div>
          <span className="pulse-label">KONEKSI DATABASE</span>
          <strong>
            <i className={snapshot.configured ? "pulse-dot good" : "pulse-dot"} />
            {snapshot.configured ? "Supabase terhubung" : "Menunggu konfigurasi"}
          </strong>
        </div>
        <div>
          <span className="pulse-label">OBSERVASI TERPUBLIKASI</span>
          <strong className="mono-num">
            {snapshot.observationCount} <small>indikator resmi</small>
          </strong>
        </div>
        <div>
          <span className="pulse-label">PERISTIWA HARIAN</span>
          <strong className="mono-num">
            {snapshot.events.length} <small>event terpublikasi</small>
          </strong>
        </div>
        <div>
          <span className="pulse-label">SUMBER TERDAFTAR</span>
          <strong className="mono-num">
            {snapshot.dataSources.length} <small>katalog aktif</small>
          </strong>
        </div>
      </section>

      {snapshot.error && (
        <div className="notice" role="status">
          <strong>Catatan koneksi data:</strong> {snapshot.error} Nilai kosong tidak pernah diganti dengan angka contoh.
        </div>
      )}

      {/* LEGENDA BUKTI */}
      <EvidenceLegendStrip />

      {/* ============================================================
          LAPISAN 1 — PAHAM DALAM 5 DETIK (DENYUT SEKTOR + 4 KARTU INTI)
          ============================================================ */}
      <section className="cc-section" aria-label="Ringkasan 5 detik kondisi negara">
        <div className="section-heading">
          <div>
            <span className="section-kicker">LAPISAN 01 · RINGKASAN 5 DETIK</span>
            <h2>Denyut Kondisi Negara &amp; Dompet Publik</h2>
          </div>
          <span className="section-aside">
            {hasPublishedData ? "Data PUBLISHED aktif" : "Mode Blueprint Jujur (Menunggu Data Resmi)"}
          </span>
        </div>

        {/* 4 Status Kondisi Sektor + Ringkasan 3 Poin */}
        <div className="digest-band">
          <div className="sector-pulse-grid">
            <Link href="/economy" className="sector-pulse-card">
              <div className="spc-top">
                <span>Ekonomi &amp; Harga</span>
                <TrendingUp size={15} />
              </div>
              <strong>
                {gdpIndicator?.latest
                  ? formatNumber(gdpIndicator.latest.value, gdpIndicator.latest.unit)
                  : "Menunggu data BPS"}
              </strong>
              <small>Target: PDB &amp; Inflasi (BPS / BI)</small>
            </Link>

            <Link href="/fiscal-monetary" className="sector-pulse-card">
              <div className="spc-top">
                <span>Fiskal &amp; Utang</span>
                <Landmark size={15} />
              </div>
              <strong>
                {debtIndicator?.latest
                  ? formatNumber(debtIndicator.latest.value, debtIndicator.latest.unit)
                  : "Menunggu Kemenkeu"}
              </strong>
              <small>Target: APBN, Pajak &amp; DJPPR</small>
            </Link>

            <Link href="/development" className="sector-pulse-card">
              <div className="spc-top">
                <span>Kesejahteraan &amp; Proyek</span>
                <Activity size={15} />
              </div>
              <strong>Belum terhubung</strong>
              <small>Target: Kemiskinan, Naker &amp; Proyek</small>
            </Link>

            <Link href="/news-events" className="sector-pulse-card">
              <div className="spc-top">
                <span>Berita &amp; Akuntabilitas</span>
                <ShieldAlert size={15} />
              </div>
              <strong className="mono-num">
                {snapshot.events.length > 0
                  ? `${snapshot.events.length} Peristiwa`
                  : "0 Peristiwa Publik"}
              </strong>
              <small>Pemisahan klaim vs bukti resmi</small>
            </Link>
          </div>

          <div className="digest-summary-box">
            <div className="digest-head">
              <FileCheck2 size={15} />
              <span>RINGKASAN SITUASI BERBASIS CATATAN SAAT INI</span>
            </div>
            <ul className="digest-points">
              <li>
                <strong>Fiskal &amp; Makro:</strong>{" "}
                {hasPublishedData
                  ? `${snapshot.observationCount} observasi resmi telah dipublikasikan dengan sumber terverifikasi.`
                  : "Belum ada observasi BPS atau Kemenkeu (Utang, Pendapatan, Pajak) yang berstatus PUBLISHED. Kartu di bawah siap terisi otomatis begitu ingestion dan review selesai."}
              </li>
              <li>
                <strong>Berita &amp; Anti-Cocoklogi:</strong>{" "}
                {snapshot.events.length > 0
                  ? `${snapshot.events.length} peristiwa terpublikasi tersedia dan terhubung dengan ${snapshot.events.reduce((acc, ev) => acc + ev.evidence_count, 0)} catatan bukti.`
                  : "Pipeline berita harian (Phase 3) belum diaktifkan. Klaim viral (REPORTED) akan disandingkan langsung dengan data resmi (OBSERVED) tanpa menyebarkan narasi sepihak."}
              </li>
              <li>
                <strong>Kesiapan Sumber:</strong>{" "}
                {snapshot.dataSources.length > 0
                  ? `${snapshot.dataSources.length} sumber resmi terdaftar (${snapshot.dataSources.map((s) => s.code).join(", ")}). Catatan: terdaftar di katalog belum berarti konektor otomatis sudah menarik angka.`
                  : "Menunggu aktivasi konektor resmi di Data Observatory."}
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Kartu Inti Negara */}
        <div className="core-kpi-grid">
          {/* Kartu 1: Total Utang Pemerintah */}
          <article className="core-kpi-card">
            <div className="ck-header">
              <span className="ck-kicker">01 · KEWAJIBAN NEGARA</span>
              {debtIndicator?.latest ? (
                <EvidenceBadge status={debtIndicator.latest.evidence_status} compact />
              ) : (
                <AwaitingBadge label="KEMENKEU DJPPR" />
              )}
            </div>
            <h3>Total Utang Pemerintah</h3>
            <div className="ck-value mono-num">
              {debtIndicator?.latest
                ? formatNumber(debtIndicator.latest.value, debtIndicator.latest.unit)
                : "Rp —"}
            </div>
            <div className="ck-visual-meter">
              <div className="meter-labels">
                <span>Rasio Utang / PDB</span>
                <span className="mono-num">Batas UU: 60%</span>
              </div>
              <div className="meter-track">
                <div className="meter-threshold" style={{ left: "60%" }} title="Batas maksimal UU Keuangan Negara 60% PDB" />
              </div>
              <div className="meter-sub">
                <span>Beban Bunga / Pendapatan: —%</span>
                <Link href="/fiscal-monetary">Detail utang ↗</Link>
              </div>
            </div>
            <div className="ck-footer">
              {debtIndicator?.latest
                ? `Periode ${formatPeriod(debtIndicator.latest.period_start)} · ${debtIndicator.latest.source?.name ?? "Sumber terverifikasi"}`
                : "Menunggu data DJPPR & APBN KiTa · Nilai kosong tidak dianggap nol"}
            </div>
          </article>

          {/* Kartu 2: Pendapatan & Pajak Negara */}
          <article className="core-kpi-card">
            <div className="ck-header">
              <span className="ck-kicker">02 · PENERIMAAN NEGARA</span>
              {revenueIndicator?.latest ? (
                <EvidenceBadge status={revenueIndicator.latest.evidence_status} compact />
              ) : (
                <AwaitingBadge label="APBN KITA / DJP" />
              )}
            </div>
            <h3>Pendapatan &amp; Pajak Negara</h3>
            <div className="ck-value mono-num">
              {revenueIndicator?.latest
                ? formatNumber(revenueIndicator.latest.value, revenueIndicator.latest.unit)
                : "Rp —"}
            </div>
            <div className="ck-visual-meter">
              <div className="meter-labels">
                <span>Realisasi vs Target {fiscalYear}</span>
                <span className="mono-num">—%</span>
              </div>
              <div className="meter-track" />
              <div className="tax-mini-pills">
                <span>PPh: —</span>
                <span>PPN: —</span>
                <span>Cukai: —</span>
              </div>
            </div>
            <div className="ck-footer">
              {revenueIndicator?.latest
                ? `Periode ${formatPeriod(revenueIndicator.latest.period_start)} · ${revenueIndicator.latest.source?.name ?? "Kemenkeu"}`
                : "Melacak Pajak, PNBP, Tax Ratio & Defisit APBN"}
            </div>
          </article>

          {/* Kartu 3: Pertumbuhan Ekonomi & Inflasi */}
          <article className="core-kpi-card">
            <div className="ck-header">
              <span className="ck-kicker">03 · EKONOMI RAKYAT</span>
              {gdpIndicator?.latest ? (
                <EvidenceBadge status={gdpIndicator.latest.evidence_status} compact />
              ) : (
                <AwaitingBadge label="BPS WEBAPI / BI" />
              )}
            </div>
            <h3>Pertumbuhan PDB &amp; Inflasi</h3>
            <div className="ck-dual-values">
              <div>
                <small>Pertumbuhan YoY</small>
                <strong className="mono-num">
                  {gdpIndicator?.latest
                    ? formatNumber(gdpIndicator.latest.value, gdpIndicator.latest.unit)
                    : "—%"}
                </strong>
              </div>
              <div>
                <small>Inflasi Tahunan</small>
                <strong className="mono-num">
                  {inflationIndicator?.latest
                    ? formatNumber(inflationIndicator.latest.value, inflationIndicator.latest.unit)
                    : "—%"}
                </strong>
              </div>
            </div>
            <div className="ck-visual-meter">
              <div className="tax-mini-pills">
                <span>Kurs IDR/USD: —</span>
                <span>BI-Rate: —%</span>
              </div>
            </div>
            <div className="ck-footer">
              {gdpIndicator?.latest?.source
                ? `Sumber: ${gdpIndicator.latest.source.name}`
                : "Menunggu observasi terpublikasi BPS WebAPI & Bank Indonesia"}
            </div>
          </article>

          {/* Kartu 4: Radar Berita & Proyek Anti-Mafia */}
          <article className="core-kpi-card">
            <div className="ck-header">
              <span className="ck-kicker">04 · HARIAN &amp; PROYEK</span>
              <EvidenceBadge status="REPORTED" compact />
            </div>
            <h3>Peristiwa &amp; Pengawasan Proyek</h3>
            <div className="ck-dual-values">
              <div>
                <small>Peristiwa Publik</small>
                <strong className="mono-num">{snapshot.events.length}</strong>
              </div>
              <div>
                <small>Sinyal Proyek</small>
                <strong className="mono-num">0</strong>
              </div>
            </div>
            <div className="ck-visual-meter">
              <div className="meter-sub">
                <Link href="/news-events">Cek fakta berita ↗</Link>
                <Link href="/anti-mafia">Radar Anti-Mafia ↗</Link>
              </div>
            </div>
            <div className="ck-footer">
              Berita viral (REPORTED) selalu dicek terhadap data resmi sebelum disimpulkan.
            </div>
          </article>
        </div>

        {/* Jika ada indikator published lain di DB, tampilkan semua agar tidak tersembunyi */}
        {snapshot.indicators.length > 0 && (
          <div className="extra-indicators-block">
            <div className="extra-header">
              <strong>Semua Indikator Terpublikasi ({snapshot.indicators.length})</strong>
              <span>Langsung dari tabel publik Supabase</span>
            </div>
            <div className="executive-metric-grid">
              {snapshot.indicators.map((item) => (
                <article className="metric-card" key={item.id}>
                  <div className="metric-category">{item.category}</div>
                  <h3>{item.name}</h3>
                  <div className="metric-value mono-num">
                    {item.latest
                      ? formatNumber(item.latest.value, item.latest.unit)
                      : "Belum tersedia"}
                  </div>
                  <div className="metric-period">
                    {item.latest
                      ? `Periode ${formatPeriod(item.latest.period_start)} – ${formatPeriod(item.latest.period_end)}`
                      : item.description ?? `Satuan: ${item.unit}`}
                  </div>
                  {item.latest && (
                    <div className="metric-source">
                      <EvidenceBadge status={item.latest.evidence_status} compact />{" "}
                      {item.latest.source ? (
                        <a href={item.latest.source.source_url} target="_blank" rel="noreferrer">
                          {item.latest.source.name}
                        </a>
                      ) : (
                        "Sumber belum dicantumkan"
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================
          LAPISAN 2 — PAHAM DALAM 30 DETIK (BELANJA PAJAK + RADAR BERITA)
          ============================================================ */}
      <section className="cc-section" aria-label="Detail 30 detik uang negara dan berita harian">
        <div className="section-heading">
          <div>
            <span className="section-kicker">LAPISAN 02 · TRANSPARANSI 30 DETIK</span>
            <h2>Uang Pajak Dipakai Apa &amp; Kejadian Hari Ini</h2>
          </div>
          <span className="section-aside">Fiskal vs Berita Terverifikasi</span>
        </div>

        <div className="cc-split-60-40">
          {/* Kiri: Alokasi Rp 100 Pajak & Tren */}
          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">KE MANA UANG NEGARA PERGI</span>
                <h3>Alokasi Belanja Publik &amp; Tren</h3>
              </div>
              <div className="tab-pills" role="tablist" aria-label="Tampilan fiskal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={fiscalTab === "allocation"}
                  className={fiscalTab === "allocation" ? "tab-pill active" : "tab-pill"}
                  onClick={() => setFiscalTab("allocation")}
                >
                  Rp 100 Pajak
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={fiscalTab === "trend"}
                  className={fiscalTab === "trend" ? "tab-pill active" : "tab-pill"}
                  onClick={() => setFiscalTab("trend")}
                >
                  Tren Historis
                </button>
              </div>
            </div>

            {fiscalTab === "allocation" ? (
              <BudgetAllocationVisual
                slots={BUDGET_SLOTS}
                totalLabel="Menampilkan struktur pos utama belanja negara yang langsung memengaruhi masyarakat & beban utang. Buka Fiskal & Moneter untuk detail lengkap."
              />
            ) : (
              <TrendSeriesVisual
                title={primaryTrendIndicator ? primaryTrendIndicator.name : "Indikator Nasional"}
                unit={primaryTrendIndicator?.unit ?? ""}
                observations={primaryTrendIndicator?.history ?? []}
                emptyHint="Setiap grafik di National Pulse melampirkan sumber resmi, periode pengamatan, dan catatan revisi bila ada."
              />
            )}

            <div className="panel-footer-link">
              <Link href="/fiscal-monetary" className="text-link">
                Buka Ruang Fiskal, Utang &amp; Pajak lengkap ↗
              </Link>
            </div>
          </article>

          {/* Kanan: Daily Pulse Berita & Anti-Cocoklogi */}
          <article className="dashboard-panel" id="daily-pulse">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">RADAR HARIAN · ANTI-COCOKLOGI</span>
                <h3>Klaim Beredar vs Data Resmi</h3>
              </div>
              <Link href="/news-events" className="text-link">
                Newsroom ↗
              </Link>
            </div>

            <div className="filter-pills">
              {(["ALL", "REPORTED", "OBSERVED"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={newsFilter === filter ? "filter-pill active" : "filter-pill"}
                  onClick={() => setNewsFilter(filter)}
                >
                  {filter === "ALL"
                    ? "Semua"
                    : filter === "REPORTED"
                      ? "Klaim (REPORTED)"
                      : "Data Resmi (OBSERVED)"}
                </button>
              ))}
            </div>

            {filteredEvents.length > 0 ? (
              <div className="event-feed-list">
                {filteredEvents.slice(0, 4).map((ev) => (
                  <div key={ev.id} className="event-feed-card">
                    <div className="efc-top">
                      <EvidenceBadge status={ev.evidence_status} compact />
                      <span className="mono-num">
                        {ev.started_at
                          ? new Date(ev.started_at).toLocaleDateString("id-ID")
                          : "Tanggal belum dicatat"}
                      </span>
                    </div>
                    <strong>{ev.title}</strong>
                    {ev.description && <p>{ev.description}</p>}
                    <div className="efc-fact-strip">
                      <CheckCircle2 size={13} />
                      <span>
                        {ev.evidence_count > 0
                          ? `${ev.evidence_count} dokumen bukti terhubung`
                          : "Belum tertaut ke bukti observasi resmi"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="anti-cocoklogi-blueprint">
                <div className="blueprint-banner">
                  <Newspaper size={15} />
                  <span>
                    Belum ada peristiwa publik di database. Begini format pembanding anti-cocoklogi saat pipeline berita (Phase 3) aktif:
                  </span>
                </div>
                <div className="blueprint-pair-card">
                  <div className="bp-claim">
                    <EvidenceBadge status="REPORTED" compact />
                    <strong>Slot 1 — Narasi / Berita Beredar (Dikelompokkan per Peristiwa)</strong>
                    <p>
                      Beberapa artikel media yang membahas kejadian sama digabung menjadi 1 kartu peristiwa agar tidak banjir berita kembar, tanpa menghapus sumber aslinya.
                    </p>
                  </div>
                  <div className="bp-fact">
                    <EvidenceBadge status="OBSERVED" compact />
                    <div>
                      <strong>Slot 2 — Cek Silang Data Resmi Terkait</strong>
                      <p>
                        Otomatis membandingkan klaim dengan data realisasi APBN, statistik BPS, atau dokumen tender resmi—atau menyatakan <em>&ldquo;Belum ada bukti pendukung&rdquo;</em>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </section>

      {/* ============================================================
          LAPISAN 3 — PAHAM DALAM 3 MENIT (ANTI-MAFIA + PETA + AI/RUMUS)
          ============================================================ */}
      <section className="cc-section" aria-label="Pengawasan proyek, peta wilayah, dan simulasi">
        <div className="section-heading">
          <div>
            <span className="section-kicker">LAPISAN 03 · PENGAWASAN &amp; SIMULASI</span>
            <h2>Jejak Proyek Publik, Wilayah &amp; Simulasi Rumus</h2>
          </div>
          <span className="section-aside">Proyek, 38 Provinsi &amp; Skenario</span>
        </div>

        <div className="cc-split-55-45">
          {/* Kiri: Radar Proyek & Anti-Mafia 5-Tahap */}
          <article className="dashboard-panel" id="anti-mafia-watch">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">SIKLUS BELANJA PUBLIK</span>
                <h3>Radar Proyek &amp; Anti-Mafia Watch</h3>
                <p>Melacak proyek dari alokasi anggaran hingga manfaat nyata di masyarakat.</p>
              </div>
              <Link href="/anti-mafia" className="text-link">
                Buka modul ↗
              </Link>
            </div>

            <div className="pipeline-steps-legend">
              <span>01 Anggaran</span>
              <span>→</span>
              <span>02 Tender</span>
              <span>→</span>
              <span>03 Kontrak</span>
              <span>→</span>
              <span>04 Fisik</span>
              <span>→</span>
              <span>05 Manfaat</span>
            </div>

            <div className="project-blueprint-table">
              <div className="pbt-row pbt-head">
                <span>AREA PEMANTAUAN</span>
                <span>TAHAP SIKLUS</span>
                <span>STATUS BUKTI</span>
              </div>

              <div className="pbt-row">
                <div>
                  <strong>Pengadaan &amp; Kontrak Pemerintah (SiRUP/LPSE)</strong>
                  <small>Menunggu konektor LKPP &amp; kontrak publik</small>
                </div>
                <div className="stage-dots" title="Tahap belum aktif">
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                </div>
                <AwaitingBadge label="PHASE 4–5" />
              </div>

              <div className="pbt-row">
                <div>
                  <strong>Audit &amp; Tindak Lanjut Keuangan Negara</strong>
                  <small>Menunggu sinkronisasi catatan audit resmi (BPK)</small>
                </div>
                <div className="stage-dots">
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                </div>
                <AwaitingBadge label="BELUM TERHUBUNG" />
              </div>

              <div className="pbt-row interactive">
                <div>
                  <strong>Anatomi Bukti &amp; Counter-Evidence (Demo Alur Kerja)</strong>
                  <small>Lihat bagaimana sinyal risiko ditimbang adil sebelum jadi kesimpulan</small>
                </div>
                <div className="stage-dots">
                  <i className="stage-dot ok" />
                  <i className="stage-dot ok" />
                  <i className="stage-dot warn" />
                  <i className="stage-dot waiting" />
                  <i className="stage-dot waiting" />
                </div>
                <button
                  type="button"
                  className="btn-inline-inspect"
                  onClick={() => setDrawerCase(SAMPLE_ANATOMY_CASE)}
                >
                  <Scale size={13} /> Buka Panel Bukti
                </button>
              </div>
            </div>
          </article>

          {/* Kanan: Peta 38 Provinsi */}
          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">CAKUPAN 38 PROVINSI</span>
                <h3>Peta Kesiapan Data Wilayah</h3>
                <p>Wilayah tanpa data resmi ditandai kosong, tidak pernah diisi angka nol.</p>
              </div>
              <Link href="/data-gaps" className="text-link">
                Celah data ↗
              </Link>
            </div>

            <IndonesiaRegionMap coveredCodes={coveredProvinceCodes} />
          </article>
        </div>

        {/* Bottom Action Launchpad: AI Briefing + Kalkulator Dampak Rumus + Data Observatory */}
        <div className="launchpad-grid">
          <article className="briefing-card">
            <span className="section-kicker">AI NATIONAL BRIEFING</span>
            <h3>Penjelasan Berbasis Dokumen, Bukan Mengarang</h3>
            <p>
              AI National Analyst merangkum indikator dan berita dengan sitasi catatan resmi, memisahkan fakta dari opini, dan menyatakan tidak tahu bila bukti tidak cukup.
            </p>
            <Link href="/ai-analyst" className="primary-link">
              Buka AI National Analyst <ArrowUpRight size={15} />
            </Link>
          </article>

          <article className="simulator-teaser-card">
            <div className="stc-top">
              <span className="section-kicker">SIMULASI RUMUS DETERMINISTIK</span>
              <EvidenceBadge status="ESTIMATED" compact />
            </div>
            <h3>Uji Dampak Proyek &amp; Sensitivitas Utang</h3>
            <p>
              Hitung perkiraan multiplier belanja proyek ke ekonomi lokal dan sensitivitas bunga utang menggunakan rumus transparan yang terpisah dari data aktual.
            </p>
            <Link href="/event-impact#simulator" className="btn-secondary">
              <Calculator size={15} /> Jalankan Simulator Rumus <ArrowUpRight size={15} />
            </Link>
          </article>

          <article className="observatory-teaser-card">
            <span className="section-kicker">KESEHATAN SUMBER DATA</span>
            <h3>Data Observatory</h3>
            <div className="otc-metrics">
              <div>
                <Database size={14} />
                <span>{snapshot.dataSources.length} Sumber terdaftar</span>
              </div>
              <div>
                <Clock size={14} />
                <span>Ingestion: lihat log job</span>
              </div>
            </div>
            <Link href="/data-observatory" className="text-link">
              Periksa katalog sumber &amp; pipeline ↗
            </Link>
          </article>
        </div>
      </section>

      <div className="executive-footnote">
        <strong>Jaminan Integritas National Pulse:</strong> Layanan ini menggunakan API Badan Pusat Statistik (BPS) serta dirancang memadukan sumber resmi Kemenkeu, Bank Indonesia, dan LKPP. Data <code>OBSERVED</code>, <code>REPORTED</code>, <code>ESTIMATED</code>, dan <code>FORECAST</code> tidak pernah dicampur.
      </div>

      <EvidenceDrawer item={drawerCase} onClose={() => setDrawerCase(null)} />
    </main>
  );
}
