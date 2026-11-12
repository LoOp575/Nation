import Link from "next/link";
import { getNationalSnapshot } from "@/lib/data/national-snapshot";
import { getSupabasePublicEnv } from "@/lib/config/env";

const modules = [
  { href: "/economy", title: "Economic Intelligence", group: "Ekonomi", description: "Pertumbuhan, harga, perdagangan, dan sektor riil", icon: "↗" },
  { href: "/fiscal-monetary", title: "Fiscal & Monetary", group: "Fiskal", description: "APBN, belanja negara, utang, dan kebijakan moneter", icon: "▤" },
  { href: "/social-welfare", title: "Social & Public Welfare", group: "Sosial", description: "Kemiskinan, tenaga kerja, pendidikan, dan kesehatan", icon: "◎" },
  { href: "/development", title: "Development Monitor", group: "Pembangunan", description: "Proyek, anggaran, progres, dan manfaat publik", icon: "⌂" },
  { href: "/governance", title: "Political & Governance", group: "Tata kelola", description: "Kebijakan, keputusan, dan kronologi kelembagaan", icon: "◇" },
  { href: "/news-events", title: "News & Events", group: "Peristiwa", description: "Berita terverifikasi dan linimasa peristiwa", icon: "▧" },
  { href: "/event-impact", title: "Event Impact", group: "Dampak", description: "Jalur dampak peristiwa pada sektor dan indikator", icon: "⌁" },
  { href: "/anti-mafia", title: "Anti-Mafia Watch", group: "Akuntabilitas", description: "Sinyal risiko pengadaan dan siklus belanja publik", icon: "⬡" },
  { href: "/national-risk", title: "National Risk Monitor", group: "Risiko", description: "Risiko nasional dengan metodologi yang dapat diperiksa", icon: "△" },
  { href: "/regional", title: "Regional Intelligence", group: "Wilayah", description: "Perbandingan indikator antarwilayah", icon: "⌖" },
  { href: "/ai-analyst", title: "AI National Analyst", group: "Analisis AI", description: "Briefing berbasis bukti dan rujukan sumber", icon: "✳" },
  { href: "/data-observatory", title: "Data Observatory", group: "Data", description: "Katalog sumber dan kesehatan pipeline", icon: "◉" },
  { href: "/data-gaps", title: "Data Gaps & Uncertainty", group: "Data", description: "Cakupan kosong, keterlambatan, dan ketidakpastian", icon: "◌" },
];

function formatValue(value: number, unit: string) {
  const formatted = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

function formatPeriod(value: string) {
  return new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

function EmptyPanel({ title, description, href = "/data-observatory" }: { title: string; description: string; href?: string }) {
  return <div className="dashboard-empty"><span className="empty-mark">○</span><div><strong>{title}</strong><p>{description}</p><Link href={href}>Telusuri data dan sumber ↗</Link></div></div>;
}

export default async function HomePage() {
  const supabaseEnv = getSupabasePublicEnv();
  const snapshot = await getNationalSnapshot();
  const configured = supabaseEnv.configured;
  const hasPublishedData = snapshot.observationCount > 0;
  const todayLabel = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date());

  return (
    <main className="executive-page dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <div className="eyebrow">{todayLabel.toUpperCase()} · NATIONAL INTELLIGENCE</div>
          <h1>Ikhtisar nasional Indonesia</h1>
          <p className="lead">Pantau ekonomi, pembangunan, kesejahteraan, dan tata kelola dari satu ruang kendali.</p>
        </div>
        <div className="dashboard-actions"><span className="dashboard-date">CAKUPAN: INDONESIA</span><Link href="/data-observatory" className="dashboard-action">Data Observatory ↗</Link></div>
      </section>

      <section className="pulse-strip" aria-label="Status data nasional">
        <div><span className="pulse-label">STATUS PLATFORM</span><strong><i className={configured ? "pulse-dot good" : "pulse-dot"} />{configured ? "Supabase terhubung" : "Menunggu konfigurasi"}</strong></div>
        <div><span className="pulse-label">OBSERVASI PUBLIK</span><strong>{snapshot.observationCount} <small>dipublikasikan</small></strong></div>
        <div><span className="pulse-label">STATUS BUKTI</span><strong>{hasPublishedData ? "Data tersedia" : "Menunggu validasi"}</strong></div>
        <div><span className="pulse-label">PRINSIP</span><strong>Evidence first</strong></div>
      </section>

      {snapshot.error && <div className="notice"><strong>Koneksi data:</strong> {snapshot.error} Nilai tidak diganti dengan angka contoh.</div>}

      <section className="executive-section dashboard-section">
        <div className="section-heading"><div><span className="section-kicker">01 / NATIONAL SNAPSHOT</span><h2>Indikator utama</h2></div><span className="section-aside">{hasPublishedData ? "Hanya data PUBLISHED" : "Belum ada data terpublikasi"}</span></div>
        {snapshot.indicators.length ? (
          <div className="executive-metric-grid">
            {snapshot.indicators.map((item) => <article className="metric-card" key={item.id}>
              <div className="metric-category">{item.category}</div><h3>{item.name}</h3>
              <div className="metric-value">{item.latest ? formatValue(item.latest.value, item.latest.unit) : "Belum tersedia"}</div>
              <div className="metric-period">{item.latest ? `Periode ${formatPeriod(item.latest.period_start)} – ${formatPeriod(item.latest.period_end)}` : item.description ?? `Satuan: ${item.unit}`}</div>
              {item.latest && <div className="metric-source">{item.latest.evidence_status} · {item.latest.source ? <a href={item.latest.source.source_url} target="_blank" rel="noreferrer">{item.latest.source.name}</a> : "Sumber belum dicantumkan"}<br />Diambil {new Date(item.latest.fetched_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</div>}
            </article>)}
          </div>
        ) : <EmptyPanel title="Belum ada indikator nasional yang dipublikasikan" description="Kartu indikator akan terisi setelah data resmi diambil, dipetakan, divalidasi, dan dipublikasikan. Nilai kosong tidak dianggap nol." />}
      </section>

      <section className="dashboard-analysis-grid">
        <article className="dashboard-panel trend-panel">
          <div className="panel-heading"><div><span className="section-kicker">02 / NATIONAL TREND</span><h2>Tren indikator nasional</h2></div><span className="panel-tag">HISTORIS</span></div>
          <EmptyPanel title="Deret waktu belum tersedia" description="Grafik akan muncul setelah observasi historis yang sebanding tersedia. Setiap titik akan membawa periode dan sumber." href="/economy" />
        </article>
        <article className="dashboard-panel movement-panel">
          <div className="panel-heading"><div><span className="section-kicker">03 / SECTOR MOVEMENT</span><h2>Sektor yang bergerak</h2></div><span className="panel-tag">LINTAS SEKTOR</span></div>
          <EmptyPanel title="Belum ada sinyal sektor tervalidasi" description="Perubahan sektor ditampilkan setelah indikator dan periode pembanding tersedia." href="/economy" />
        </article>
      </section>

      <section className="dashboard-panel radar-panel">
        <div className="panel-heading"><div><span className="section-kicker">04 / POLICY & DEVELOPMENT RADAR</span><h2>Radar kebijakan dan pembangunan</h2><p>Telusuri keputusan, anggaran, proyek, progres, dan manfaat publik.</p></div><Link href="/development" className="text-link">Buka monitor ↗</Link></div>
        <div className="radar-columns"><span>AREA PEMANTAUAN</span><span>BUKTI / DATA</span><span>STATUS</span></div>
        <div className="radar-row"><strong>Belanja dan proyek publik</strong><span>Menunggu data pengadaan dan progres</span><span className="status-chip pending">Belum tersedia</span></div>
        <div className="radar-row"><strong>Keputusan dan kebijakan</strong><span>Menunggu kronologi dan dokumen sumber</span><span className="status-chip pending">Belum tersedia</span></div>
        <div className="radar-row"><strong>Hasil dan manfaat masyarakat</strong><span>Menunggu indikator keluaran dan dampak</span><span className="status-chip pending">Belum tersedia</span></div>
      </section>

      <section className="dashboard-lower-grid">
        <article className="dashboard-panel">
          <div className="panel-heading"><div><span className="section-kicker">05 / DATA COVERAGE</span><h2>Cakupan data</h2></div><Link href="/data-observatory" className="text-link">Buka observatorium ↗</Link></div>
          <div className="coverage-list"><div><span>Registri sumber</span><strong><Link href="/data-observatory">Lihat katalog ↗</Link></strong></div><div><span>Observasi dipublikasikan</span><strong>{snapshot.observationCount}</strong></div><div><span>Status koneksi Supabase</span><strong>{configured ? "Terhubung" : "Belum aktif"}</strong></div></div>
          <p className="coverage-note">Jumlah sumber terdaftar bukan bukti bahwa seluruh konektor telah berhasil mengambil data.</p>
        </article>
        <article className="briefing-card dashboard-briefing">
          <span className="section-kicker">06 / AI NATIONAL BRIEFING</span><h2>Analisis berdasarkan bukti, bukan asumsi.</h2>
          <p>AI National Analyst akan merangkum perubahan, menghubungkan indikator, menyebutkan sumber, dan menunjukkan hal yang belum diketahui.</p>
          <Link href="/ai-analyst" className="primary-link">Buka AI National Analyst ↗</Link>
        </article>
      </section>

      <section className="executive-section dashboard-section">
        <div className="section-heading"><div><span className="section-kicker">07 / ANALYSIS WORKSPACE</span><h2>Modul analisis</h2><p className="section-description">Masuk ke area pemantauan yang lebih spesifik.</p></div><span className="section-aside">13 modul</span></div>
        <div className="advanced-module-grid">{modules.map((item) => <Link href={item.href} className="advanced-module" key={item.href}><span className="advanced-icon">{item.icon}</span><span className="advanced-copy"><strong>{item.title}</strong><small>{item.description}</small></span><span className="card-arrow">↗</span></Link>)}</div>
      </section>

      <div className="executive-footnote"><strong>Catatan metodologi:</strong> OBSERVED, REPORTED, ESTIMATED, dan FORECAST tidak dicampur. Setiap indikator harus memiliki periode, sumber, waktu pengambilan, dan status bukti. Data yang belum tersedia tidak dianggap nol.</div>
    </main>
  );
}
