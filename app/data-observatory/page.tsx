import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Source = {
  id: string;
  code: string;
  name: string;
  source_type: string;
  source_url: string;
  is_active: boolean;
};

type Job = {
  id: string;
  source_id: string | null;
  job_type: string;
  status: string;
  started_at: string | null;
  finished_at: string | null;
  records_seen: number;
  records_inserted: number;
  records_rejected: number;
};

function dateLabel(value: string | null) {
  if (!value) return "Belum tersedia";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function DataObservatoryPage() {
  let sources: Source[] = [];
  let jobs: Job[] = [];
  let connected = false;
  let errorMessage: string | null = null;

  try {
    const supabase = createSupabaseAdminClient();
    const [sourceResult, jobResult] = await Promise.all([
      supabase.from("data_sources")
        .select("id, code, name, source_type, source_url, is_active")
        .order("name"),
      supabase.from("ingestion_jobs")
        .select("id, source_id, job_type, status, started_at, finished_at, records_seen, records_inserted, records_rejected")
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    if (sourceResult.error || jobResult.error) {
      throw new Error("Database belum dapat membaca katalog sumber dan riwayat ingestion.");
    }
    sources = sourceResult.data ?? [];
    jobs = jobResult.data ?? [];
    connected = true;
  } catch (error) {
    errorMessage = error instanceof Error
      ? error.message
      : "Konfigurasi observability belum tersedia.";
  }

  const sourceName = new Map(sources.map((source) => [source.id, source.name]));
  const succeeded = jobs.filter((job) => job.status === "SUCCEEDED").length;
  const failed = jobs.filter((job) => job.status === "FAILED").length;

  return (
    <main className="module-page">
      <div className="page-eyebrow">DATA OPERATIONS</div>
      <div className="module-title-row">
        <div>
          <h1>Data Observatory</h1>
          <p className="page-lead">
            Pantau katalog sumber, hasil pengambilan data, dan kesehatan pipeline.
            Status koneksi tidak disamakan dengan keberhasilan validasi atau publikasi data.
          </p>
        </div>
        <span className="module-status">{connected ? "DATABASE CONNECTED" : "SETUP REQUIRED"}</span>
      </div>

      {errorMessage && (
        <div className="module-note">
          <strong>Observability belum aktif.</strong> {errorMessage}
          <p>Tambahkan konfigurasi server Supabase sebelum halaman ini dapat membaca status operasional.</p>
        </div>
      )}

      <div className="observatory-stats">
        <article className="observatory-stat"><span>Sumber terdaftar</span><strong>{connected ? sources.length : "—"}</strong></article>
        <article className="observatory-stat"><span>Job berhasil (12 terakhir)</span><strong>{connected ? succeeded : "—"}</strong></article>
        <article className="observatory-stat"><span>Job gagal (12 terakhir)</span><strong>{connected ? failed : "—"}</strong></article>
        <article className="observatory-stat"><span>Riwayat job tersedia</span><strong>{connected ? jobs.length : "—"}</strong></article>
      </div>

      <div className="section-title-row">
        <div><h2>Source registry</h2><p>Sumber terdaftar bukan berarti konektornya sudah aktif mengambil data.</p></div>
      </div>
      <div className="observatory-table-wrap">
        <table className="observatory-table">
          <thead><tr><th>Sumber</th><th>Tipe</th><th>Status</th><th>Dokumentasi</th></tr></thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id}>
                <td><strong>{source.name}</strong><small>{source.code}</small></td>
                <td>{source.source_type}</td>
                <td><span className={source.is_active ? "source-active" : "source-inactive"}>{source.is_active ? "Terdaftar aktif" : "Nonaktif"}</span></td>
                <td><a href={source.source_url} target="_blank" rel="noreferrer">Buka sumber ↗</a></td>
              </tr>
            ))}
            {connected && sources.length === 0 && <tr><td colSpan={4}>Belum ada sumber terdaftar.</td></tr>}
            {!connected && <tr><td colSpan={4}>Menunggu konfigurasi Supabase server.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="section-title-row">
        <div><h2>Ingestion history</h2><p>12 pekerjaan terakhir. Error internal tidak diekspos di halaman publik.</p></div>
      </div>
      <div className="observatory-table-wrap">
        <table className="observatory-table">
          <thead><tr><th>Proses</th><th>Status</th><th>Mulai</th><th>Rekaman</th></tr></thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td><strong>{job.job_type}</strong><small>{sourceName.get(job.source_id ?? "") ?? "Sumber tidak diketahui"}</small></td>
                <td><span className={job.status === "SUCCEEDED" ? "source-active" : job.status === "FAILED" ? "source-inactive" : "source-pending"}>{job.status}</span></td>
                <td>{dateLabel(job.started_at)}</td>
                <td>{job.records_inserted} / {job.records_seen} <small>ditolak: {job.records_rejected}</small></td>
              </tr>
            ))}
            {connected && jobs.length === 0 && <tr><td colSpan={4}>Belum ada ingestion job. Jalankan konektor setelah semua kredensial tersedia.</td></tr>}
            {!connected && <tr><td colSpan={4}>Riwayat ingestion belum dapat dibaca.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="module-note">
        <strong>Catatan integritas:</strong> job SUCCEEDED hanya berarti proses ingestion selesai. Data statistik tetap harus dipetakan, divalidasi, dan ditinjau sebelum menjadi observasi PUBLISHED.
      </div>
      <Link className="back-link" href="/">← Kembali ke National Snapshot</Link>
    </main>
  );
}
