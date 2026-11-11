import { getNationalSnapshot } from "@/lib/data/national-snapshot";
import { getSupabasePublicEnv } from "@/lib/config/env";

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

function formatValue(value: number, unit: string) {
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

export default async function HomePage() {
  const supabaseEnv = getSupabasePublicEnv();
  const snapshot = await getNationalSnapshot();

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand"><span className="brand-mark">NP</span><span>NATIONAL PULSE</span></div>
          <div className="nav-label">Indonesia · National Intelligence & Public Accountability</div>
        </div>
      </header>
      <main className="shell">
        <div className="eyebrow">National dashboard · Live data foundation</div>
        <h1>Membaca kondisi Indonesia dari data yang bisa diperiksa.</h1>
        <p className="lead">
          National Pulse menghubungkan indikator ekonomi, fiskal, sosial, pembangunan,
          kebijakan, berita, dan bukti tata kelola. Setiap angka harus punya sumber,
          periode pengamatan, waktu pembaruan, dan label kualitas bukti.
        </p>
        <div className="status-row">
          <span className="status-pill"><strong>FASE 1</strong> · Data foundation</span>
          <span className="status-pill"><strong>Supabase</strong> · {supabaseEnv.configured ? "Terhubung ke konfigurasi" : "Belum dikonfigurasi"}</span>
          <span className="status-pill"><strong>Observasi publik</strong> · {snapshot.observationCount}</span>
        </div>

        <div className="section-heading">
          <h2>National snapshot</h2>
          <p>{snapshot.error ? "Data belum dapat dimuat" : snapshot.observationCount > 0 ? "Observasi resmi yang telah dipublikasikan" : "Belum ada observasi yang dipublikasikan"}</p>
        </div>
        {snapshot.indicators.length > 0 ? (
          <section className="grid" aria-label="Published national indicators">
            {snapshot.indicators.map((item) => (
              <article className="panel" key={item.id}>
                <div className="panel-label">{item.category} · {item.name}</div>
                <div className="panel-value">
                  {item.latest ? formatValue(item.latest.value, item.latest.unit) : "Menunggu observasi"}
                </div>
                <div className="panel-note">
                  {item.latest
                    ? `Periode ${formatPeriod(item.latest.period_start)} – ${formatPeriod(item.latest.period_end)} · ${item.latest.evidence_status}`
                    : item.description ?? `Satuan: ${item.unit}`}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="grid" aria-label="National snapshot indicators">
            {[
              ["Ekonomi & harga", "PDB, inflasi, perdagangan, dan sektor riil"],
              ["Fiskal & moneter", "APBN, realisasi belanja, suku bunga, dan likuiditas"],
              ["Kesejahteraan", "Kemiskinan, tenaga kerja, pendidikan, dan kesehatan"],
              ["Pembangunan", "Proyek, anggaran, progres, dan hasil publik"],
              ["Tata kelola", "Kebijakan, keputusan, dan jejak akuntabilitas"],
              ["Risiko nasional", "Belum dinilai: metodologi harus tervalidasi"],
            ].map(([label, note]) => (
              <article className="panel" key={label}>
                <div className="panel-label">{label}</div>
                <div className="panel-value">{label === "Risiko nasional" ? "Belum dinilai" : "Menunggu data"}</div>
                <div className="panel-note">{note}</div>
              </article>
            ))}
          </section>
        )}

        {snapshot.error && (
          <div className="notice" role="status">
            <strong>Koneksi data belum tersedia.</strong> {snapshot.error}
            Nilai tidak diganti dengan angka contoh.
          </div>
        )}

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
          <strong>Integritas data:</strong> hanya observasi dengan status PUBLISHED yang
          ditampilkan. OBSERVED, REPORTED, ESTIMATED, dan FORECAST tetap dibedakan.
          Tanggal publikasi sumber tidak disamakan dengan periode pengamatan.
        </div>
      </main>
      <footer><div className="shell">National Pulse · Data provenance first · Published data only</div></footer>
    </>
  );
}
