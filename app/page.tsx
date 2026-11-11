import { getSupabasePublicEnv } from "@/lib/config/env";

const indicators = [
  { label: "Ekonomi & harga", value: "Menunggu data", note: "PDB, inflasi, perdagangan, dan sektor riil" },
  { label: "Fiskal & moneter", value: "Menunggu data", note: "APBN, realisasi belanja, suku bunga, dan likuiditas" },
  { label: "Kesejahteraan", value: "Menunggu data", note: "Kemiskinan, tenaga kerja, pendidikan, dan kesehatan" },
  { label: "Pembangunan", value: "Menunggu data", note: "Proyek, anggaran, progres, dan hasil publik" },
  { label: "Tata kelola", value: "Menunggu data", note: "Kebijakan, keputusan, dan jejak akuntabilitas" },
  { label: "Risiko nasional", value: "Belum dinilai", note: "Tidak ada skor risiko sebelum metodologi tervalidasi" },
];

const modules = [
  ["Economic Intelligence", "Indikator ekonomi dan sektor riil"],
  ["Fiscal & Monetary", "Anggaran, belanja, dan kebijakan moneter"],
  ["Social & Public Welfare", "Kondisi sosial dan kesejahteraan"],
  ["Development Monitor", "Proyek dan capaian pembangunan"],
  ["Political & Governance", "Kebijakan dan proses pengambilan keputusan"],
  ["News Intelligence", "Berita, sumber, dan peristiwa"],
  ["Event Impact", "Dampak peristiwa terhadap indikator"],
  ["Anti-Mafia Watch", "Sinyal risiko dan bukti pengadaan"],
];

export default function HomePage() {
  const supabase = getSupabasePublicEnv();

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand"><span className="brand-mark">NP</span><span>NATIONAL PULSE</span></div>
          <div className="nav-label">Indonesia · National Intelligence & Public Accountability</div>
        </div>
      </header>
      <main className="shell">
        <div className="eyebrow">National dashboard · Foundation build</div>
        <h1>Membaca kondisi Indonesia dari data yang bisa diperiksa.</h1>
        <p className="lead">
          National Pulse menghubungkan indikator ekonomi, fiskal, sosial, pembangunan,
          kebijakan, berita, dan bukti tata kelola. Setiap angka harus punya sumber,
          periode pengamatan, waktu pembaruan, dan label kualitas bukti.
        </p>
        <div className="status-row">
          <span className="status-pill"><strong>FASE 0</strong> · Fondasi aplikasi</span>
          <span className="status-pill"><strong>Data live</strong> · Belum tersambung</span>
          <span className="status-pill"><strong>Supabase</strong> · {supabase.configured ? "Konfigurasi tersedia" : "Belum dikonfigurasi"}</span>
        </div>

        <div className="section-heading">
          <h2>National snapshot</h2>
          <p>Belum ada observasi yang dipublikasikan</p>
        </div>
        <section className="grid" aria-label="National snapshot indicators">
          {indicators.map((item) => (
            <article className="panel" key={item.label}>
              <div className="panel-label">{item.label}</div>
              <div className="panel-value">{item.value}</div>
              <div className="panel-note">{item.note}</div>
            </article>
          ))}
        </section>

        <div className="section-heading">
          <h2>Intelligence modules</h2>
          <p>Modul akan aktif setelah sumber data dan tata kelola siap</p>
        </div>
        <section className="module-grid" aria-label="Intelligence modules">
          {modules.map(([title, description]) => (
            <article className="module" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <div className="notice">
          <strong>Integritas data:</strong> tampilan ini sengaja tidak memakai angka contoh.
          Label “menunggu data” berarti konektor dan observasi resmi belum tersedia,
          bukan berarti kondisi nasional bernilai nol.
        </div>
      </main>
      <footer><div className="shell">National Pulse · Data provenance first · Status: foundation scaffold</div></footer>
    </>
  );
}
