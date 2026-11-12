import Link from "next/link";
import { notFound } from "next/navigation";
import { getNationalSnapshot } from "@/lib/data/national-snapshot";
import { AwaitingBadge, EvidenceBadge } from "@/components/evidence/evidence-badge";
import { IndonesiaRegionMap } from "@/components/maps/indonesia-region-map";

const modules: Record<
  string,
  {
    title: string;
    eyebrow: string;
    description: string;
    purpose: string;
    inputs: string[];
    targetSources: string[];
    matchKeywords: string[];
  }
> = {
  economy: {
    title: "Economic Intelligence",
    eyebrow: "ECONOMIC MONITORING",
    description:
      "Pantau pertumbuhan ekonomi (PDB), inflasi, harga pangan, perdagangan, dan aktivitas sektor riil Indonesia dengan periode pengamatan yang konsisten.",
    purpose:
      "Menyajikan perubahan ekonomi dengan konteks historis dan pembanding periode, bukan sekadar angka sesaat.",
    inputs: [
      "PDB dan pertumbuhan ekonomi (YoY / QoQ)",
      "Inflasi IHK dan komponen harga bergejolak",
      "Perdagangan ekspor-impor dan neraca eksternal",
      "Indikator daya beli dan aktivitas sektor riil",
    ],
    targetSources: ["BPS WebAPI", "Bank Indonesia SEKI", "Kementerian Perdagangan"],
    matchKeywords: ["pdb", "gdp", "inflasi", "ekonomi", "perdagangan", "ekspor"],
  },
  "social-welfare": {
    title: "Social & Public Welfare",
    eyebrow: "PUBLIC WELFARE",
    description:
      "Pantau kemiskinan, ketimpangan (Gini), pengangguran, upah riil, pendidikan, dan akses layanan kesehatan masyarakat.",
    purpose:
      "Menguji apakah angka pertumbuhan makro benar-benar membaik pada kondisi rumah tangga dan layanan dasar.",
    inputs: [
      "Tingkat kemiskinan dan ketimpangan (Rasio Gini)",
      "Ketenagakerjaan, pengangguran terbuka, & sektor informal",
      "Capaian akses pendidikan dan angka partisipasi",
      "Kesehatan publik, gizi, dan perlindungan sosial",
    ],
    targetSources: ["BPS Susenas & Sakernas", "Kemenkes", "Kemensos"],
    matchKeywords: ["kemiskinan", "miskin", "gini", "kerja", "pengangguran", "sosial"],
  },
  development: {
    title: "Development Monitor",
    eyebrow: "PUBLIC PROJECTS",
    description:
      "Pantau proyek pembangunan strategis, lokasi, anggaran, realisasi kontrak, progres fisik, dan manfaat yang dirasakan masyarakat.",
    purpose:
      "Menghubungkan rencana dan anggaran proyek dengan realisasi fisik serta dampak nyata di wilayah sasaran.",
    inputs: [
      "Daftar proyek publik dan koordinat lokasi",
      "Pagu anggaran vs realisasi pencairan dana",
      "Milestone pelaksanaan dan progres fisik",
      "Evaluasi hasil dan manfaat masyarakat",
    ],
    targetSources: ["Bappenas", "Kementerian Keuangan", "LKPP / SiRUP"],
    matchKeywords: ["proyek", "pembangunan", "infrastruktur", "milestone"],
  },
  governance: {
    title: "Political & Governance",
    eyebrow: "GOVERNANCE TRACKER",
    description:
      "Catat kebijakan, regulasi baru, perubahan jabatan kunci, proses kelembagaan, dan kronologi keputusan pemerintahan secara netral.",
    purpose:
      "Merekam urutan peristiwa kelembagaan beserta dokumen resminya tanpa menyimpulkan motif yang belum terbukti.",
    inputs: [
      "Produk kebijakan, Perpres, dan regulasi baru",
      "Perubahan jabatan dan masa berlaku wewenang",
      "Kronologi keputusan serta dokumen rilis resmi",
      "Tanggapan resmi dan catatan klarifikasi pihak terkait",
    ],
    targetSources: ["JDIH / Sekretariat Negara", "Kementerian Terkait", "Media Terdaftar"],
    matchKeywords: ["kebijakan", "regulasi", "tata kelola", "keputusan"],
  },
  "national-risk": {
    title: "National Risk Monitor",
    eyebrow: "RISK & RESILIENCE",
    description:
      "Pantau dimensi ketahanan dan risiko nasional menggunakan ambang batas terdokumentasi dan metodologi yang bisa diaudit.",
    purpose:
      "Menolak menerbitkan angka skor risiko sebelum formula, bobot, dan uji historis (backtesting) dipublikasikan terbuka.",
    inputs: [
      "Risiko fiskal (rasio utang, pembiayaan, bunga)",
      "Risiko harga pangan & tekanan daya beli",
      "Risiko eksternal (kurs & neraca dagang)",
      "Risiko pelaksanaan proyek & tata kelola",
    ],
    targetSources: ["Kemenkeu", "Bank Indonesia", "BPS", "BMKG"],
    matchKeywords: ["risiko", "risk", "ketahanan"],
  },
  regional: {
    title: "Regional Intelligence",
    eyebrow: "REGIONAL OVERVIEW · 38 PROVINSI",
    description:
      "Bandingkan kondisi antarprovinsi dan kabupaten/kota hanya ketika definisi indikator dan periode waktunya setara.",
    purpose:
      "Menunjukkan kesenjangan pembangunan antarwilayah sekaligus memperlihatkan wilayah mana yang datanya masih kosong.",
    inputs: [
      "Profil makro & fiskal 38 provinsi",
      "Perbandingan inflasi, kemiskinan, & pengangguran daerah",
      "Belanja transfer daerah & proyek wilayah",
      "Peta kelengkapan dan keterbaruan data daerah",
    ],
    targetSources: ["BPS Provinsi (38 Domain)", "DJPK Kemenkeu", "Pemda"],
    matchKeywords: ["provinsi", "wilayah", "daerah", "regional"],
  },
  "data-gaps": {
    title: "Data Gaps & Uncertainty",
    eyebrow: "COVERAGE & UNCERTAINTY",
    description:
      "Menampilkan secara terbuka indikator apa saja yang belum tersedia, sumber yang terlambat rilis, dan wilayah tanpa cakupan data.",
    purpose:
      "Mencegah kesimpulan yang terlihat pasti padahal ditopang oleh data yang belum lengkap.",
    inputs: [
      "Indikator inti nasional yang belum dipublikasikan",
      "Cakupan wilayah provinsi yang belum terisi",
      "Konektor sumber yang masih membutuhkan kredensial/API",
      "Batasan metodologi dan selang ketidakpastian",
    ],
    targetSources: ["Data Observatory", "Audit Katalog Sumber"],
    matchKeywords: [],
  },
};

export const dynamic = "force-dynamic";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const item = modules[module];
  if (!item) notFound();

  const snapshot = await getNationalSnapshot();
  const matchedIndicators = snapshot.indicators.filter((ind) => {
    const hay = `${ind.code} ${ind.name} ${ind.category}`.toLowerCase();
    return item.matchKeywords.some((kw) => hay.includes(kw));
  });

  const coveredProvinceCodes = Array.from(
    new Set(
      snapshot.indicators.flatMap((ind) =>
        ind.history
          .map((obs) => obs.geography_code)
          .filter((c) => c && c !== "ID" && c.startsWith("ID-")),
      ),
    ),
  );

  return (
    <main className="module-page-wide">
      <div className="page-eyebrow">{item.eyebrow}</div>
      <div className="module-title-row">
        <div>
          <h1>{item.title}</h1>
          <p className="page-lead">{item.description}</p>
        </div>
        <AwaitingBadge
          label={matchedIndicators.length > 0 ? `${matchedIndicators.length} INDIKATOR AKTIF` : "MENUNGGU INTEGRASI DATA"}
        />
      </div>

      <section className="module-intro-card">
        <span className="card-kicker">TUJUAN MODUL</span>
        <h2>{item.purpose}</h2>
        <p>
          Sumber target modul ini: <strong>{item.targetSources.join(" · ")}</strong>. Nilai tidak pernah diisi angka simulasi atau dummy sebelum data resmi dipublikasikan.
        </p>
      </section>

      {module === "regional" && (
        <section className="dashboard-panel" style={{ marginTop: 22 }}>
          <div className="panel-heading">
            <div>
              <span className="section-kicker">CAKUPAN 38 PROVINSI INDONESIA</span>
              <h2>Peta Kesiapan Data Wilayah</h2>
            </div>
          </div>
          <IndonesiaRegionMap coveredCodes={coveredProvinceCodes} />
        </section>
      )}

      {module === "data-gaps" && (
        <section className="dashboard-panel" style={{ marginTop: 22 }}>
          <div className="panel-heading">
            <div>
              <span className="section-kicker">STATUS CAKUPAN AKTUAL SAAT INI</span>
              <h2>Daftar Celah Data Terbuka</h2>
            </div>
          </div>
          <div className="rules-list">
            <div className="rule-row">
              <span className="mono-num rule-code">GAP-01</span>
              <div>
                <strong>Observasi Statistik &amp; Makro Nasional</strong>
                <p>Saat ini terdapat {snapshot.observationCount} observasi terpublikasi. Konektor BPS WebAPI baru pada tahap katalog domain provinsi.</p>
              </div>
            </div>
            <div className="rule-row">
              <span className="mono-num rule-code">GAP-02</span>
              <div>
                <strong>Realisasi APBN, Pajak &amp; Posisi Utang (Kemenkeu)</strong>
                <p>Belum ada sumber Kemenkeu APBN KiTa / DJPPR yang terhubung otomatis ke tabel indikator.</p>
              </div>
            </div>
            <div className="rule-row">
              <span className="mono-num rule-code">GAP-03</span>
              <div>
                <strong>Berita Harian &amp; Pengadaan Proyek (Phase 3–5)</strong>
                <p>Peristiwa berita terpublikasi: {snapshot.events.length}. Konektor LPSE/SiRUP/BPK belum dibangun.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {matchedIndicators.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <div className="section-title-row">
            <div>
              <h2>Indikator Terpublikasi di Modul Ini</h2>
              <p>Data resmi dari tabel publik Supabase</p>
            </div>
          </div>
          <div className="executive-metric-grid">
            {matchedIndicators.map((ind) => (
              <article key={ind.id} className="metric-card">
                <div className="metric-category">{ind.category}</div>
                <h3>{ind.name}</h3>
                <div className="metric-value mono-num">
                  {ind.latest ? `${ind.latest.value} ${ind.latest.unit}` : "Belum tersedia"}
                </div>
                {ind.latest && (
                  <div className="metric-source">
                    <EvidenceBadge status={ind.latest.evidence_status} compact />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="section-title-row">
        <div>
          <h2>Ruang lingkup data</h2>
          <p>Komponen pemantauan yang diaktifkan bertahap sesuai sumber</p>
        </div>
        <span className="muted-label">
          {matchedIndicators.length > 0 ? "SEBAGIAN TERHUBUNG" : "BELUM TERHUBUNG KE DATA LIVE"}
        </span>
      </div>

      <section className="scope-grid">
        {item.inputs.map((input, index) => (
          <article className="scope-card" key={input}>
            <span className="scope-number mono-num">{String(index + 1).padStart(2, "0")}</span>
            <strong>{input}</strong>
            <span className="scope-state">Menunggu integrasi</span>
          </article>
        ))}
      </section>

      <div className="module-note">
        <strong>Prinsip integritas:</strong> halaman ini tidak menampilkan angka rekaan. Setiap nilai yang terpublikasi wajib membawa sumber, periode observasi, waktu pengambilan, dan status bukti.
      </div>
      <Link className="back-link" href="/">
        ← Kembali ke Ikhtisar Nasional
      </Link>
    </main>
  );
}
