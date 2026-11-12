"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, FileText, Sparkles } from "lucide-react";
import type { NationalSnapshot } from "@/lib/data/national-snapshot";
import { EvidenceBadge } from "@/components/evidence/evidence-badge";

type SamplePrompt = {
  id: string;
  question: string;
  topic: string;
};

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: "debt",
    question: "Berapa total utang negara, pendapatan negara, dan pajak terbaru saat ini?",
    topic: "Fiskal & Utang",
  },
  {
    id: "news",
    question: "Apa kejadian paling penting hari ini dan apakah isu viralnya cocok dengan data resmi?",
    topic: "Berita & Anti-Cocoklogi",
  },
  {
    id: "mafia",
    question: "Proyek pemerintah mana yang punya indikasi korupsi paling tinggi?",
    topic: "Anti-Mafia Watch",
  },
];

export function AiAnalystView({ snapshot }: { snapshot: NationalSnapshot }) {
  const [selectedPrompt, setSelectedPrompt] = useState<string>("debt");

  const buildGroundedResponse = () => {
    if (selectedPrompt === "debt") {
      if (snapshot.observationCount === 0) {
        return {
          mode: "ABSTAIN_INSUFFICIENT_DATA",
          headline: "Abstain: Data observasi APBN dan Utang Pemerintah belum dipublikasikan.",
          body: "AI National Analyst tidak boleh mengarang angka utang, pendapatan, atau pajak negara. Saat ini terdapat 0 observasi berstatus PUBLISHED di Supabase.",
          citations: [
            `Status koneksi database: ${snapshot.configured ? "Terhubung" : "Belum dikonfigurasi"}`,
            `Sumber aktif terdaftar di katalog: ${snapshot.dataSources.map((s) => s.code).join(", ") || "Belum ada"}`,
          ],
          missing: [
            "Konektor Kemenkeu APBN KiTa (pendapatan & pajak)",
            "Konektor Kemenkeu DJPPR (posisi utang & profil jatuh tempo)",
          ],
        };
      }

      return {
        mode: "GROUNDED_SUMMARY",
        headline: `Ditemukan ${snapshot.observationCount} observasi terpublikasi di database.`,
        body: `Indikator tersedia: ${snapshot.indicators.map((i) => `${i.name} (${i.latest ? `${i.latest.value} ${i.latest.unit}` : "tanpa nilai terbaru"})`).join("; ")}.`,
        citations: snapshot.indicators.slice(0, 4).map((i) => `Indicator ID ${i.id} · ${i.code}`),
        missing: ["Periksa Data Observatory untuk melihat cakupan sumber fiskal yang belum terhubung."],
      };
    }

    if (selectedPrompt === "news") {
      if (snapshot.events.length === 0) {
        return {
          mode: "ABSTAIN_INSUFFICIENT_DATA",
          headline: "Abstain: Belum ada peristiwa berita berstatus PUBLISHED untuk dirangkum.",
          body: "Sesuai kontrak modul AI, asisten menolak merangkum kabar dari memori umum atau media luar yang tidak melalui jalur penyimpanan bukti National Pulse.",
          citations: ["Tabel events (PUBLISHED): 0 baris", "Tabel news_articles (PUBLISHED): 0 baris"],
          missing: ["Pipeline ingestion berita (Phase 3) dan tautan event_evidence"],
        };
      }

      return {
        mode: "GROUNDED_SUMMARY",
        headline: `Tersedia ${snapshot.events.length} peristiwa terpublikasi untuk dirangkum.`,
        body: snapshot.events.map((e) => `${e.title} [${e.evidence_status}]`).join(" · "),
        citations: snapshot.events.map((e) => `Event ID ${e.id}`),
        missing: ["Pastikan klaim berstatus REPORTED tetap dicek terhadap indikator OBSERVED."],
      };
    }

    return {
      mode: "ABSTAIN_POLICY_AND_DATA",
      headline: "Abstain: Sistem tidak memvonis 'korupsi' dan belum ada data pengadaan terhubung.",
      body: "National Pulse dilarang melabeli pihak atau proyek sebagai koruptor oleh AI. Analisis hanya meninjau sinyal risiko terstruktur (RECORDED s/d OFFICIAL_LEGAL_FINDING) beserta counter-evidence setelah konektor LKPP/LPSE/BPK aktif.",
      citations: ["Kontrak Anti-Mafia: docs/intelligence/anti-mafia.md", "Data proyek & tender: 0 baris (Phase 4–5)"],
      missing: ["Tabel proyek, tender, kontrak, dan catatan audit resmi"],
    };
  };

  const response = buildGroundedResponse();

  return (
    <main className="module-page-wide">
      <div className="page-eyebrow">EVIDENCE-AWARE AI ANALYST</div>
      <div className="module-title-row">
        <div>
          <h1>AI National Analyst</h1>
          <p className="page-lead">
            Asisten analisis yang hanya berbicara berdasarkan catatan resmi di database National Pulse. Setiap pernyataan menyertakan sitasi, membedakan fakta vs klaim, dan wajib menolak menjawab (abstain) jika data tidak mencukupi.
          </p>
        </div>
        <EvidenceBadge status="OBSERVED" />
      </div>

      <div className="cc-split-55-45">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">UJI KONDISI DATA SAAT INI</span>
              <h2>Pilih Pertanyaan Analisis</h2>
            </div>
            <Sparkles size={16} />
          </div>

          <div className="prompt-list">
            {SAMPLE_PROMPTS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={selectedPrompt === item.id ? "prompt-btn active" : "prompt-btn"}
                onClick={() => setSelectedPrompt(item.id)}
              >
                <small>{item.topic}</small>
                <strong>{item.question}</strong>
              </button>
            ))}
          </div>

          <div className="ai-response-card">
            <div className="arc-head">
              <span className={response.mode === "GROUNDED_SUMMARY" ? "arc-pill ok" : "arc-pill abstain"}>
                {response.mode === "GROUNDED_SUMMARY" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <AlertCircle size={13} />
                )}
                {response.mode}
              </span>
            </div>
            <h3>{response.headline}</h3>
            <p>{response.body}</p>

            <div className="arc-meta-grid">
              <div>
                <strong>Rujukan Catatan Database</strong>
                <ul>
                  {response.citations.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Data yang Belum Tersedia</strong>
                <ul>
                  {response.missing.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <aside className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">PAGAR KESELAMATAN AI</span>
              <h2>Kontrak Kerja AI National Pulse</h2>
            </div>
            <FileText size={16} />
          </div>

          <ol className="verify-steps">
            <li>
              <strong>Bukan Sumber Angka Kebenaran</strong>
              <p>Semua perhitungan makro, APBN, dan skor risiko dihitung oleh kode deterministik SQL/TypeScript, bukan oleh LLM.</p>
            </li>
            <li>
              <strong>Wajib Sitasi Record Kanonis</strong>
              <p>Setiap klaim harus merujuk ke ID indikator, event, atau dokumen sumber yang tersimpan di Supabase.</p>
            </li>
            <li>
              <strong>Abstain Saat Bukti Kurang</strong>
              <p>Daripada berhalusinasi mengisi kekosongan data pemerintah, AI otomatis menyatakan bagian mana yang belum terhubung.</p>
            </li>
            <li>
              <strong>Proteksi Prompt Injection</strong>
              <p>Artikel berita atau dokumen luar dianggap input tidak tepercaya sehingga instruksi tersembunyi di dalamnya diabaikan.</p>
            </li>
          </ol>

          <Link href="/data-observatory" className="text-link">
            Cek kelengkapan sumber data di Observatory ↗
          </Link>
        </aside>
      </div>
    </main>
  );
}
