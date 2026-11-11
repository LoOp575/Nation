import Link from "next/link";
import { notFound } from "next/navigation";

const modules: Record<string, { title: string; eyebrow: string; description: string; purpose: string; inputs: string[] }> = {
  economy: { title: "Economic Intelligence", eyebrow: "ECONOMIC MONITORING", description: "Pantau indikator ekonomi, harga, perdagangan, dan aktivitas sektor riil Indonesia melalui data yang memiliki sumber dan periode pengamatan.", purpose: "Menyajikan perubahan ekonomi dengan konteks historis, bukan sekadar angka terkini.", inputs: ["PDB dan pertumbuhan ekonomi", "Inflasi dan harga", "Perdagangan dan neraca eksternal", "Indikator sektor riil"] },
  "fiscal-monetary": { title: "Fiscal & Monetary", eyebrow: "PUBLIC FINANCE", description: "Pantau APBN, penerimaan, belanja, pembiayaan, suku bunga, dan kondisi moneter dengan pemisahan data anggaran dan realisasi.", purpose: "Menghubungkan keputusan fiskal dan moneter dengan data pelaksanaan yang dapat diperiksa.", inputs: ["APBN dan postur anggaran", "Realisasi pendapatan dan belanja", "Utang dan pembiayaan", "Suku bunga dan likuiditas"] },
  "social-welfare": { title: "Social & Public Welfare", eyebrow: "PUBLIC WELFARE", description: "Pantau kemiskinan, ketenagakerjaan, pendidikan, kesehatan, dan indikator kesejahteraan masyarakat.", purpose: "Membaca apakah perubahan ekonomi tercermin pada kondisi rumah tangga dan layanan publik.", inputs: ["Kemiskinan dan ketimpangan", "Ketenagakerjaan", "Pendidikan", "Kesehatan dan layanan dasar"] },
  development: { title: "Development Monitor", eyebrow: "PUBLIC PROJECTS", description: "Pantau proyek pembangunan, lokasi, anggaran, tahapan, progres, dan hasil yang dirasakan publik.", purpose: "Menghubungkan rencana dan anggaran proyek dengan realisasi serta hasil yang terverifikasi.", inputs: ["Daftar proyek dan lokasi", "Anggaran dan realisasi", "Milestone dan progres", "Hasil dan manfaat publik"] },
  governance: { title: "Political & Governance", eyebrow: "GOVERNANCE TRACKER", description: "Catat kebijakan, keputusan, perubahan jabatan, proses kelembagaan, dan kronologi peristiwa pemerintahan.", purpose: "Merekam urutan peristiwa secara netral tanpa menyimpulkan motif yang belum terbukti.", inputs: ["Kebijakan dan keputusan", "Perubahan jabatan", "Kronologi dan dokumen resmi", "Pihak terkait dan tanggapan"] },
  "news-events": { title: "News & Events", eyebrow: "NEWS INTELLIGENCE", description: "Kumpulan berita dan peristiwa dari sumber yang dapat diidentifikasi, dengan tanggal publikasi, tanggal kejadian, dan status verifikasi.", purpose: "Mengelompokkan liputan menjadi peristiwa tanpa menghilangkan sumber aslinya.", inputs: ["Berita dari sumber terdaftar", "Deteksi duplikasi", "Ekstraksi peristiwa", "Kronologi dan bukti"] },
  "event-impact": { title: "Event Impact Analysis", eyebrow: "EVENT TRANSMISSION", description: "Telusuri kemungkinan jalur dampak peristiwa terhadap sektor, wilayah, dan indikator nasional.", purpose: "Memisahkan perubahan yang benar-benar teramati dari hipotesis hubungan sebab-akibat.", inputs: ["Peristiwa dan tanggal", "Indikator sebelum dan sesudah", "Mekanisme dampak", "Bukti pendukung dan alternatif"] },
  "anti-mafia": { title: "Anti-Mafia Watch", eyebrow: "PUBLIC ACCOUNTABILITY", description: "Pantau sinyal risiko pada siklus belanja publik, pengadaan, kontrak, pemasok, pelaksanaan, dan manfaat proyek.", purpose: "Menghasilkan petunjuk pemeriksaan berbasis bukti, bukan tuduhan atau vonis otomatis.", inputs: ["Tender dan peserta", "Kontrak dan perubahan", "Kepemilikan yang sah diakses", "Pembayaran, hasil, dan audit"] },
  "national-risk": { title: "National Risk Monitor", eyebrow: "RISK & RESILIENCE", description: "Pantau dimensi risiko nasional menggunakan indikator, ambang, metodologi, dan ketidakpastian yang terdokumentasi.", purpose: "Tidak menerbitkan skor risiko sebelum metode dan kalibrasinya dapat dipertanggungjawabkan.", inputs: ["Indikator risiko terukur", "Baseline dan ambang", "Sumber dan periode", "Metode, validasi, dan ketidakpastian"] },
  regional: { title: "Regional Intelligence", eyebrow: "REGIONAL OVERVIEW", description: "Bandingkan kondisi provinsi dan kabupaten/kota ketika data antarwilayah memiliki definisi dan periode yang sebanding.", purpose: "Menunjukkan variasi wilayah sekaligus kesenjangan cakupan data.", inputs: ["Profil wilayah", "Indikator ekonomi dan sosial", "Belanja dan proyek daerah", "Kualitas dan kelengkapan data"] },
  "ai-analyst": { title: "AI National Analyst", eyebrow: "EVIDENCE-AWARE AI", description: "Asisten analisis yang menjawab berdasarkan catatan dan dokumen terverifikasi di National Pulse, lengkap dengan rujukan sumber.", purpose: "AI menjelaskan bukti dan ketidakpastian. Perhitungan angka tetap berasal dari mesin data deterministik.", inputs: ["Pencarian data kanonis", "Ringkasan berbasis sitasi", "Bukti tandingan dan celah data", "Abstain saat sumber tidak cukup"] },
  "data-observatory": { title: "Data Observatory", eyebrow: "DATA OPERATIONS", description: "Pantau kesehatan sumber, proses pengambilan, validasi, pembaruan, dan kualitas data.", purpose: "Membuat keterlambatan dan kegagalan data terlihat, bukan menyamarkannya sebagai kondisi terkini.", inputs: ["Daftar sumber dan konektor", "Status ingestion", "Waktu pembaruan terakhir", "Validasi dan riwayat revisi"] },
  "data-gaps": { title: "Data Gaps & Uncertainty", eyebrow: "COVERAGE & UNCERTAINTY", description: "Identifikasi indikator yang belum tersedia, data yang kedaluwarsa, cakupan wilayah yang kosong, dan ketidakpastian metodologi.", purpose: "Menunjukkan apa yang belum diketahui agar analisis tidak memberi kesan kepastian palsu.", inputs: ["Indikator belum tersedia", "Periode atau wilayah kosong", "Data kedaluwarsa", "Keterbatasan dan asumsi"] },
};

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const item = modules[module];
  if (!item) notFound();

  return (
    <main className="module-page">
      <div className="page-eyebrow">{item.eyebrow}</div>
      <div className="module-title-row"><div><h1>{item.title}</h1><p className="page-lead">{item.description}</p></div><span className="module-status">FOUNDATION</span></div>
      <section className="module-intro-card">
        <span className="card-kicker">TUJUAN MODUL</span>
        <h2>{item.purpose}</h2>
        <p>Modul ini merupakan kerangka produk. Data dan analisis hanya akan ditampilkan setelah sumber, metode, dan jalur validasinya tersedia.</p>
      </section>
      <div className="section-title-row"><div><h2>Ruang lingkup data</h2><p>Komponen yang akan diaktifkan bertahap</p></div><span className="muted-label">BELUM TERHUBUNG KE DATA LIVE</span></div>
      <section className="scope-grid">
        {item.inputs.map((input, index) => <article className="scope-card" key={input}><span className="scope-number">{String(index + 1).padStart(2, "0")}</span><strong>{input}</strong><span className="scope-state">Menunggu integrasi</span></article>)}
      </section>
      <div className="module-note"><strong>Prinsip integritas:</strong> halaman ini tidak menggunakan angka simulasi. Setiap nilai yang kelak tampil harus membawa sumber, periode observasi, waktu pengambilan, dan label bukti.</div>
      <Link className="back-link" href="/">← Kembali ke National Snapshot</Link>
    </main>
  );
}
