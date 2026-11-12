"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Filter, Newspaper, SearchCheck } from "lucide-react";
import type { NationalSnapshot } from "@/lib/data/national-snapshot";
import { EvidenceBadge } from "@/components/evidence/evidence-badge";

const CATEGORIES = [
  { id: "ALL", label: "Semua Peristiwa" },
  { id: "FISCAL", label: "Fiskal, Pajak & APBN" },
  { id: "PROJECT", label: "Proyek & Pengadaan" },
  { id: "SOCIAL", label: "Harga, Pangan & Sosial" },
  { id: "POLICY", label: "Kebijakan & Tata Kelola" },
];

export function NewsEventsView({ snapshot }: { snapshot: NationalSnapshot }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [evidenceFilter, setEvidenceFilter] = useState<"ALL" | "REPORTED" | "OBSERVED">("ALL");

  const filteredEvents = useMemo(() => {
    return snapshot.events.filter((ev) => {
      if (evidenceFilter !== "ALL" && ev.evidence_status !== evidenceFilter) return false;
      if (selectedCategory !== "ALL" && !ev.event_type.toUpperCase().includes(selectedCategory)) {
        return false;
      }
      return true;
    });
  }, [evidenceFilter, selectedCategory, snapshot.events]);

  return (
    <main className="module-page-wide">
      <div className="page-eyebrow">NEWS &amp; ANTI-COCOKLOGI</div>
      <div className="module-title-row">
        <div>
          <h1>Radar Berita Harian &amp; Verifikasi Klaim</h1>
          <p className="page-lead">
            Berita tidak ditampilkan sebagai banjir headline yang diulang-ulang. National Pulse mengelompokkan liputan ke dalam satu peristiwa lalu menyandingkannya dengan data resmi untuk mematahkan cocoklogi.
          </p>
        </div>
        <span className="module-status">PHASE 3 PIPELINE READY-SCHEMA</span>
      </div>

      <div className="newsroom-3pane">
        {/* Pane 1: Filter */}
        <aside className="dashboard-panel news-filter-pane">
          <div className="pane-title">
            <Filter size={15} />
            <strong>Filter Alur Berita</strong>
          </div>

          <div className="filter-group">
            <span className="filter-group-label">TINGKAT BUKTI</span>
            {(["ALL", "REPORTED", "OBSERVED"] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={evidenceFilter === status ? "filter-list-btn active" : "filter-list-btn"}
                onClick={() => setEvidenceFilter(status)}
              >
                {status === "ALL"
                  ? "Semua Status"
                  : status === "REPORTED"
                    ? "Baru Dilaporkan (REPORTED)"
                    : "Terkonfirmasi Data (OBSERVED)"}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <span className="filter-group-label">TOPIK PEMANTAUAN</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={selectedCategory === cat.id ? "filter-list-btn active" : "filter-list-btn"}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="news-policy-note">
            <strong>Aturan Viral vs Rutin:</strong>
            <p>
              Platform mengambil rilis resmi &amp; berita kebijakan harian secara rutin (meski tidak viral), dan menjadikan isu viral sebagai pemicu cek silang data.
            </p>
          </div>
        </aside>

        {/* Pane 2: Deduplicated Event Timeline */}
        <section className="dashboard-panel news-feed-pane">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">LINIMASA PERISTIWA TERDEDUPLIKASI</span>
              <h2>Peristiwa Publik ({filteredEvents.length})</h2>
            </div>
            <Newspaper size={16} />
          </div>

          {filteredEvents.length > 0 ? (
            <div className="event-feed-list">
              {filteredEvents.map((ev) => (
                <article key={ev.id} className="event-feed-card">
                  <div className="efc-top">
                    <EvidenceBadge status={ev.evidence_status} compact />
                    <span className="mono-num">
                      {ev.started_at ? new Date(ev.started_at).toLocaleDateString("id-ID") : "—"}
                    </span>
                  </div>
                  <strong>{ev.title}</strong>
                  {ev.description && <p>{ev.description}</p>}
                  <div className="efc-fact-strip">
                    <CheckCircle2 size={13} />
                    <span>{ev.evidence_count} bukti tertaut · Lokasi: {ev.location_name ?? "Nasional"}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="anti-cocoklogi-blueprint">
              <div className="blueprint-banner">
                <Newspaper size={16} />
                <span>
                  Belum ada peristiwa berita terpublikasi di tabel <code>events</code>. Di bawah adalah struktur baku yang aktif saat konektor RSS/rilis resmi berjalan:
                </span>
              </div>

              <div className="blueprint-pair-card">
                <div className="bp-claim">
                  <EvidenceBadge status="REPORTED" compact />
                  <strong>Contoh Struktur Kartu Peristiwa (Event Deduplication)</strong>
                  <p>
                    Jika 15 portal berita memberitakan topik kenaikan tarif atau proyek tertentu pada hari yang sama, sistem menggabungkannya ke <strong>1 peristiwa tunggal</strong> dan menyimpan ke-15 tautan asli sebagai referensi sumber.
                  </p>
                </div>
                <div className="bp-fact">
                  <EvidenceBadge status="OBSERVED" compact />
                  <div>
                    <strong>Tautan Cek Silang Data Resmi</strong>
                    <p>
                      Setiap kartu peristiwa menyediakan tautan cepat ke indikator terkait (misal data realisasi APBN, inflasi BPS, atau dokumen tender LPSE) agar publik langsung melihat apakah narasi cocoklogi selaras dengan angka.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {snapshot.newsArticles.length > 0 && (
            <div className="raw-articles-block">
              <h3>Artikel Sumber Terdaftar ({snapshot.newsArticles.length})</h3>
              <ul className="article-link-list">
                {snapshot.newsArticles.map((art) => (
                  <li key={art.id}>
                    <div>
                      <strong>{art.title}</strong>
                      <small>{art.publisher}</small>
                    </div>
                    <a href={art.canonical_url} target="_blank" rel="noreferrer">
                      Buka sumber <ExternalLink size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Pane 3: Anti-Cocoklogi Checker */}
        <aside className="dashboard-panel news-verify-pane">
          <div className="pane-title">
            <SearchCheck size={16} />
            <strong>Mekanisme Anti-Cocoklogi</strong>
          </div>

          <ol className="verify-steps">
            <li>
              <strong>1. Pisahkan Tanggal Rilis vs Tanggal Kejadian</strong>
              <p>Berita lama yang digoreng ulang langsung ketahuan karena metadata tanggal kejadian dan tanggal publikasi dipisah.</p>
            </li>
            <li>
              <strong>2. Klaim Tetap Berstatus REPORTED</strong>
              <p>Pernyataan pejabat maupun viral media sosial tidak pernah dinaikkan jadi fakta tanpa dokumen pembanding.</p>
            </li>
            <li>
              <strong>3. Cocokkan dengan Angka OBSERVED</strong>
              <p>Sistem menarik indikator terkait (APBN, BPS, BI, LKPP) pada periode yang persis sama.</p>
            </li>
            <li>
              <strong>4. Akui Celah Data</strong>
              <p>Jika data pembanding belum tersedia, sistem menyatakan <em>Belum dapat diverifikasi</em> daripada menebak.</p>
            </li>
          </ol>

          <Link href="/data-observatory" className="text-link">
            Lihat status konektor sumber ↗
          </Link>
        </aside>
      </div>
    </main>
  );
}
