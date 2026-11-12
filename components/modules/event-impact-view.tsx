"use client";

import { useMemo, useState } from "react";
import { Activity, Calculator, ChevronDown, ChevronUp, Info, TrendingUp } from "lucide-react";
import { AwaitingBadge, EvidenceBadge } from "@/components/evidence/evidence-badge";

type SectorPreset = {
  id: string;
  label: string;
  multiplier: number;
  jobsPerTrillion: number;
  note: string;
};

const SECTOR_PRESETS: SectorPreset[] = [
  {
    id: "infra",
    label: "Infrastruktur Dasar (Jalan, Irigasi, Pelabuhan)",
    multiplier: 1.45,
    jobsPerTrillion: 14500,
    note: "Menyerap material lokal & tenaga konstruksi, tetapi sensitif terhadap konten impor alat berat.",
  },
  {
    id: "perlinsos",
    label: "Perlindungan Sosial & Subsidi Rumah Tangga",
    multiplier: 1.25,
    jobsPerTrillion: 6800,
    note: "Kecenderungan konsumsi marjinal tinggi pada rumah tangga rentan; dampak cepat ke daya beli.",
  },
  {
    id: "pangan",
    label: "Ketahanan Pangan & Pertanian",
    multiplier: 1.38,
    jobsPerTrillion: 16200,
    note: "Berdampak ke rantai pasok pangan lokal dan stabilitas inflasi bahan makanan.",
  },
  {
    id: "sdm",
    label: "Pendidikan & Layanan Kesehatan",
    multiplier: 1.32,
    jobsPerTrillion: 11400,
    note: "Efek jangka menengah-panjang terhadap produktivitas tenaga kerja dan kualitas layanan dasar.",
  },
];

export function EventImpactView() {
  const [activeTab, setActiveTab] = useState<"observed" | "simulator">("simulator");

  // Calculator 1: Project Impact Multiplier
  const [budgetTrillion, setBudgetTrillion] = useState<number>(10);
  const [sectorId, setSectorId] = useState<string>("infra");
  const [leakagePct, setLeakagePct] = useState<number>(22);
  const [delayRiskPct, setDelayRiskPct] = useState<number>(10);
  const [showFormula, setShowFormula] = useState<boolean>(true);

  // Calculator 2: Debt Interest Sensitivity
  const [floatingDebtTrillion, setFloatingDebtTrillion] = useState<number>(1200);
  const [fxDebtUsdBillion, setFxDebtUsdBillion] = useState<number>(130);
  const [rateShockBps, setRateShockBps] = useState<number>(50);
  const [fxShockIdr, setFxShockIdr] = useState<number>(500);

  const sector = useMemo(
    () => SECTOR_PRESETS.find((s) => s.id === sectorId) ?? SECTOR_PRESETS[0],
    [sectorId],
  );

  const projectCalc = useMemo(() => {
    const domesticShare = 1 - leakagePct / 100;
    const deliveryEfficiency = 1 - delayRiskPct / 100;
    const effectiveDomestic = budgetTrillion * domesticShare * deliveryEfficiency;
    const outputImpact = effectiveDomestic * sector.multiplier;
    const jobsEstimate = Math.round(effectiveDomestic * sector.jobsPerTrillion);
    const netFiscalMultiplier = budgetTrillion > 0 ? outputImpact / budgetTrillion : 0;

    return {
      effectiveDomestic,
      outputImpact,
      jobsEstimate,
      netFiscalMultiplier,
    };
  }, [budgetTrillion, delayRiskPct, leakagePct, sector]);

  const debtCalc = useMemo(() => {
    const rateDelta = rateShockBps / 10000; // 100 bps = 0.01
    const extraFloatingInterestT = floatingDebtTrillion * rateDelta;
    // Fx Debt in USD Billion * Rp shock per USD * assumed avg coupon 4.5% (0.045) -> in Rp Trillion (Billion * Rp / 1000)
    const assumedFxCoupon = 0.045;
    const extraFxInterestT = (fxDebtUsdBillion * fxShockIdr * assumedFxCoupon) / 1000;
    const totalExtraInterestT = extraFloatingInterestT + extraFxInterestT;
    const fxPrincipalRevaluationT = (fxDebtUsdBillion * fxShockIdr) / 1000;

    return {
      extraFloatingInterestT,
      extraFxInterestT,
      totalExtraInterestT,
      fxPrincipalRevaluationT,
    };
  }, [floatingDebtTrillion, fxDebtUsdBillion, fxShockIdr, rateShockBps]);

  return (
    <main className="module-page-wide">
      <div className="page-eyebrow">EVENT TRANSMISSION &amp; DETERMINISTIC SCENARIO</div>
      <div className="module-title-row">
        <div>
          <h1>Dampak Proyek &amp; Simulasi Rumus</h1>
          <p className="page-lead">
            Memisahkan evaluasi dampak nyata proyek yang sedang berjalan (OBSERVED) dari alat simulasi skenario dengan rumus matematika terbuka (ESTIMATED) agar publik bisa mengukur efek kebijakan secara rasional.
          </p>
        </div>

        <div className="tab-pills" role="tablist" aria-label="Mode dampak">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "observed"}
            className={activeTab === "observed" ? "tab-pill active" : "tab-pill"}
            onClick={() => setActiveTab("observed")}
          >
            Evaluasi Nyata (OBSERVED)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "simulator"}
            className={activeTab === "simulator" ? "tab-pill active" : "tab-pill"}
            onClick={() => setActiveTab("simulator")}
          >
            Simulator Rumus (ESTIMATED)
          </button>
        </div>
      </div>

      {activeTab === "observed" ? (
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">BEFORE-AFTER &amp; KELOMPOK PEMBANDING</span>
              <h2>Evaluasi Efek Proyek Pemerintah ke Masyarakat</h2>
            </div>
            <AwaitingBadge label="PHASE 6 · MENUNGGU DATA PROYEK" />
          </div>

          <div className="impact-framework-grid">
            <article className="impact-step-card">
              <Activity size={17} />
              <strong>1. Identifikasi Proyek &amp; Lokasi</strong>
              <p>Mengunci tanggal mulai belanja, wilayah sasaran (kabupaten/provinsi), dan jenis layanan publik.</p>
            </article>
            <article className="impact-step-card">
              <TrendingUp size={17} />
              <strong>2. Ukur Indikator Sebelum vs Sesudah</strong>
              <p>Membandingkan harga lokal, ketenagakerjaan, kemiskinan, atau PDRB sebelum dan sesudah proyek beroperasi.</p>
            </article>
            <article className="impact-step-card">
              <Info size={17} />
              <strong>3. Pisahkan Korelasi dari Kausalitas</strong>
              <p>Membandingkan wilayah proyek dengan wilayah pembanding agar faktor global/nasional tidak dikira efek proyek semata.</p>
            </article>
          </div>
        </section>
      ) : (
        <div id="simulator" className="simulator-stack">
          <div className="simulator-warning-banner">
            <EvidenceBadge status="ESTIMATED" />
            <span>
              <strong>MODE SIMULASI PARAMETER PENGGUNA — BUKAN DATA AKTUAL PEMERINTAH.</strong> Seluruh angka masukan di bawah dapat Anda ubah sendiri untuk menguji sensitivitas menggunakan rumus deterministik terbuka.
            </span>
          </div>

          {/* KALKULATOR 1: DAMPAK PROYEK */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">KALKULATOR 01 · MULTIPLIER BELANJA PROYEK</span>
                <h2>Simulasi Efek Proyek Pemerintah ke Ekonomi &amp; Tenaga Kerja</h2>
              </div>
              <Calculator size={17} />
            </div>

            <div className="sim-grid">
              <div className="sim-inputs">
                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Nilai Anggaran Proyek (Hipotetis)</span>
                    <strong className="mono-num">Rp {budgetTrillion} Triliun</strong>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={250}
                    step={1}
                    value={budgetTrillion}
                    onChange={(e) => setBudgetTrillion(Number(e.target.value))}
                  />
                </label>

                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Sektor Proyek (Menentukan Koefisien Multiplier k)</span>
                    <strong className="mono-num">k = {sector.multiplier}x</strong>
                  </div>
                  <select
                    value={sectorId}
                    onChange={(e) => setSectorId(e.target.value)}
                    className="sim-select"
                  >
                    {SECTOR_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label} (k={preset.multiplier}x)
                      </option>
                    ))}
                  </select>
                  <small className="sim-hint">{sector.note}</small>
                </label>

                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Porsi Impor / Kebocoran Luar Negeri</span>
                    <strong className="mono-num">{leakagePct}%</strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={1}
                    value={leakagePct}
                    onChange={(e) => setLeakagePct(Number(e.target.value))}
                  />
                </label>

                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Asumsi Diskon Inefisiensi / Keterlambatan / Adendum</span>
                    <strong className="mono-num">{delayRiskPct}%</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={delayRiskPct}
                    onChange={(e) => setDelayRiskPct(Number(e.target.value))}
                  />
                </label>
              </div>

              <div className="sim-outputs">
                <div className="sim-output-card highlight">
                  <div className="soc-head">
                    <span>Estimasi Tambahan Output Ekonomi (ΔY)</span>
                    <EvidenceBadge status="ESTIMATED" compact />
                  </div>
                  <strong className="mono-num">
                    Rp {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(projectCalc.outputImpact)} T
                  </strong>
                  <small>
                    Multiplier efektif bersih: {projectCalc.netFiscalMultiplier.toFixed(2)}x per Rp 1 anggaran
                  </small>
                </div>

                <div className="sim-output-pair">
                  <div className="sim-output-card">
                    <span>Belanja Efektif Domestik</span>
                    <strong className="mono-num">
                      Rp {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(projectCalc.effectiveDomestic)} T
                    </strong>
                    <small>Setelah dikurangi porsi impor &amp; diskon efisiensi</small>
                  </div>

                  <div className="sim-output-card">
                    <span>Estimasi Serapan Tenaga Kerja</span>
                    <strong className="mono-num">
                      {new Intl.NumberFormat("id-ID").format(projectCalc.jobsEstimate)} orang
                    </strong>
                    <small>Menggunakan parameter intensitas tenaga kerja sektor</small>
                  </div>
                </div>

                <button
                  type="button"
                  className="formula-toggle"
                  onClick={() => setShowFormula((v) => !v)}
                >
                  <span>Inspektor Rumus Matematika</span>
                  {showFormula ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showFormula && (
                  <div className="formula-box mono-num">
                    <div>G_dom = Anggaran × (1 - Impor%) × (1 - Diskon_Inefisiensi%)</div>
                    <div>ΔY    = G_dom × k_sektor ({sector.multiplier})</div>
                    <div>Naker = G_dom × Koef_Naker_Sektor ({sector.jobsPerTrillion}/T)</div>
                    <p>
                      Catatan: Koefisien multiplier &amp; tenaga kerja di sini adalah parameter benchmark edukasi untuk simulasi; kalibrasi resmi akan membaca Tabel Input-Output (I-O) BPS ketika tersedia.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* KALKULATOR 2: SENSITIVITAS BUNGA UTANG APBN */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">KALKULATOR 02 · SENSITIVITAS FISKAL</span>
                <h2>Simulasi Dampak Kenaikan Suku Bunga &amp; Kurs ke Beban Utang</h2>
              </div>
              <EvidenceBadge status="ESTIMATED" compact />
            </div>

            <div className="sim-grid">
              <div className="sim-inputs">
                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Eksposur Utang Berbunga Mengambang / Refinancing</span>
                    <strong className="mono-num">Rp {floatingDebtTrillion} T</strong>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={4000}
                    step={50}
                    value={floatingDebtTrillion}
                    onChange={(e) => setFloatingDebtTrillion(Number(e.target.value))}
                  />
                </label>

                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Porsi Utang Valas (Asumsi Kupon Rata-Rata 4,5%)</span>
                    <strong className="mono-num">USD {fxDebtUsdBillion} Miliar</strong>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={300}
                    step={5}
                    value={fxDebtUsdBillion}
                    onChange={(e) => setFxDebtUsdBillion(Number(e.target.value))}
                  />
                </label>

                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Skenario Kenaikan Yield / Suku Bunga</span>
                    <strong className="mono-num">+{rateShockBps} bps (+{(rateShockBps / 100).toFixed(2)}%)</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={300}
                    step={25}
                    value={rateShockBps}
                    onChange={(e) => setRateShockBps(Number(e.target.value))}
                  />
                </label>

                <label className="sim-field">
                  <div className="sim-field-head">
                    <span>Skenario Pelemahan Kurs Rupiah per USD</span>
                    <strong className="mono-num">+Rp {fxShockIdr}</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3000}
                    step={100}
                    value={fxShockIdr}
                    onChange={(e) => setFxShockIdr(Number(e.target.value))}
                  />
                </label>
              </div>

              <div className="sim-outputs">
                <div className="sim-output-card highlight">
                  <div className="soc-head">
                    <span>Tambahan Beban Bunga Tahunan APBN</span>
                    <EvidenceBadge status="ESTIMATED" compact />
                  </div>
                  <strong className="mono-num">
                    +Rp {debtCalc.totalExtraInterestT.toFixed(2)} Triliun / tahun
                  </strong>
                  <small>
                    Dari bunga mengambang (+Rp {debtCalc.extraFloatingInterestT.toFixed(2)} T) &amp; kupon valas (+Rp {debtCalc.extraFxInterestT.toFixed(2)} T)
                  </small>
                </div>

                <div className="sim-output-card">
                  <span>Kenaikan Nilai Pokok Utang Valas akibat Kurs (Stock Revaluation)</span>
                  <strong className="mono-num">
                    +Rp {debtCalc.fxPrincipalRevaluationT.toFixed(2)} Triliun
                  </strong>
                  <small>Rumus: Utang_Valas(Miliar) × ΔKurs(Rp) / 1.000</small>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
