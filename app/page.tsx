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

export default async function HomePage() {
  const supabaseEnv = getSupabasePublicEnv();
  const snapshot = await getNationalSnapshot();
  const configured = supabaseEnv.configured;
  const hasPublishedData = snapshot.observationCount > 0;

  return (
    <main className="executive-page">
      <section className="executive-heading">
        <div>
          <div className="eyebrow">EXECUTIVE OVERVIEW · INDONESIA</div>
          <h1>Gambaran nasional, dalam satu pandangan.</h1>
          <p className="lead">Pantau kondisi ekonomi, kesejahteraan, pembangunan, dan tata kelola melalui data yang sumber serta periodenya dapat diperiksa.</p>
        </div>
        <div className="context-card">
          <span className="context-label">RUANG LINGKUP</span>
          <strong>Indonesia</strong>
          <span className="context-muted">Pemantauan nasional</span>
        </div>
      </section>

      <section className="executive-status" aria-label="System status">
        <div className="status-item"><span className={configured ? "status-indicator good" : "status-indicator pending"} /> <span>Supabase {configured ? "terkonfigurasi" : "belum dikonfigurasi"}</span></div>
        <div className="status-item"><span className={hasPublishedData ? "status-indicator good" : "status-indicator pending"} /> <span>{snapshot.observationCount} observasi dipublikasikan</span></div>
        <div className="status-item"><span className="status-indicator pending" /> <span>{hasPublishedData ? "Cakupan mengikuti data tersedia" : "Menunggu data statistik tervalidasi"}</span></div>
      </section>

      <section className="executive-section">
        <div className="section-heading">
          <div><span className="section-kicker">01 / NATIONAL SNAPSHOT</span><h2>Indikator utama</h2></div>
          <span className="section-aside">{hasPublishedData ? "Data berstatus PUBLISHED" : "Belum ada data terpublikasi"}</span>
        </div>
        {snapshot.indicators.length > 0 ? (
          <div className="executive-metric-grid">
            {snapshot.indicators.map((item) => (
              <article className="metric-card" key={item.id}>
                <div className="metric-category">{item.category}</div>
                <h3>{item.name}</h3>
                <div className="metric-value">{item.latest ? formatValue(item.latest.value, item.latest.unit) : "Belum tersedia"}</div>
                <div className="metric-period">{item.latest ? `Periode ${formatPeriod(item.latest.period_start)} – ${formatPeriod(item.latest.period_end)}` : item.description ?? `Satuan: ${item.unit}`}</div>
                {item.latest && <div className="metric-source">{item.latest.evidence_status} · {item.latest.source ? <a href={item.latest.source.source_url} target="_blank" rel="noreferrer">{item.latest.source.name}</a> : "Sumber belum dicantumkan"}<br />Diambil {new Date(item.latest.fetched_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</div>}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-data-panel">
            <div className="empty-data-icon">▦</div>
            <div><strong>Data nasional belum tersedia untuk ditampilkan.</strong><p>Panel ini akan terisi otomatis setelah indikator bersumber resmi berhasil diambil, dipetakan, divalidasi, dan dipublikasikan. Tidak ada angka contoh yang disamarkan sebagai data aktual.</p></div>
            <Link href="/data-observatory" className="text-link">Periksa Data Observatory ↗</Link>
          </div>
        )}
        {snapshot.error && <div className="notice"><strong>Koneksi data:</strong> {snapshot.error} Nilai tidak diganti dengan angka contoh.</div>}
      </section>

      <section className="executive-section">
        <div className="section-heading"><div><span className="section-kicker">02 / NATIONAL PULSE</span><h2>Bidang pemantauan</h2></div><span className="section-aside">Ringkasan lintas sektor</span></div>
        <div className="sector-grid">
          {[
            { title: "Ekonomi & Industri", description: "Aktivitas ekonomi, harga, perdagangan, dan investasi.", href: "/economy", icon: "↗" },
            { title: "Fiskal & Moneter", description: "Pendapatan, belanja, pembiayaan, dan likuiditas.", href: "/fiscal-monetary", icon: "▤" },
            { title: "Sosial & Kesejahteraan", description: "Kondisi rumah tangga dan layanan dasar masyarakat.", href: "/social-welfare", icon: "◎" },
            { title: "Pembangunan Publik", description: "Proyek, pelaksanaan, keluaran, dan manfaat.", href: "/development", icon: "⌂" },
          ].map((item) => <Link href={item.href} className="sector-card" key={item.href}><span className="sector-icon">{item.icon}</span><span><strong>{item.title}</strong><small>{item.description}</small></span><span className="card-arrow">↗</span></Link>)}
        </div>
      </section>

      <section className="executive-lower-grid">
        <article className="briefing-card">
          <span className="section-kicker">03 / AI NATIONAL BRIEFING</span>
          <h2>Analisis berdasarkan bukti, bukan asumsi.</h2>
          <p>AI National Analyst akan merangkum perubahan, menghubungkan indikator, menyebutkan sumber, dan menunjukkan hal yang belum diketahui.</p>
          <Link href="/ai-analyst" className="primary-link">Buka AI National Analyst ↗</Link>
        </article>
        <article className="integrity-card">
          <span className="section-kicker">04 / DATA INTEGRITY</span>
          <h2>Transparansi status bukti</h2>
          <div className="evidence-list"><span><b className="evidence-dot observed" /> OBSERVED <small>Hasil pengamatan</small></span><span><b className="evidence-dot reported" /> REPORTED <small>Dilaporkan sumber</small></span><span><b className="evidence-dot estimated" /> ESTIMATED <small>Hasil estimasi</small></span><span><b className="evidence-dot forecast" /> FORECAST <small>Proyeksi</small></span></div>
          <Link href="/data-observatory" className="text-link">Lihat kualitas dan sumber data ↗</Link>
        </article>
      </section>

      <section className="executive-section">
        <div className="section-heading"><div><span className="section-kicker">05 / ANALYSIS WORKSPACE</span><h2>Modul analisis lanjutan</h2><p className="section-description">Pilih bidang untuk menelusuri data dan bukti lebih dalam.</p></div><span className="section-aside">13 modul</span></div>
        <div className="advanced-module-grid">
          {modules.map((item) => <Link href={item.href} className="advanced-module" key={item.href}><span className="advanced-icon">{item.icon}</span><span className="advanced-copy"><strong>{item.title}</strong><small>{item.description}</small></span><span className="card-arrow">↗</span></Link>)}
        </div>
      </section>

      <div className="executive-footnote"><strong>Catatan metodologi:</strong> nilai hanya ditampilkan dari observasi PUBLISHED. Periode pengamatan, waktu pengambilan, sumber, dan label bukti tetap dibedakan. Data yang belum tersedia tidak dianggap nol.</div>
    </main>
  );
}
