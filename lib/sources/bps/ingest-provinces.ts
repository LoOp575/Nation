import "server-only";

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";
import { fetchBpsProvinceDomains } from "@/lib/sources/bps/client";

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secretKey) throw new Error("Konfigurasi server Supabase belum lengkap.");
  return createClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function ingestBpsProvinceDomains() {
  const supabase = createAdminClient();
  const { data: source, error: sourceError } = await supabase
    .from("data_sources")
    .select("id")
    .eq("code", "BPS_WEBAPI")
    .eq("is_active", true)
    .single();
  if (sourceError || !source) throw new Error("Sumber BPS_WEBAPI tidak ditemukan atau tidak aktif.");

  const { data: job, error: jobError } = await supabase
    .from("ingestion_jobs")
    .insert({
      source_id: source.id,
      job_type: "BPS_PROVINCE_DOMAIN_DISCOVERY",
      status: "RUNNING",
      started_at: new Date().toISOString(),
      metadata: { endpoint_kind: "province_domains", api_version: "v1" },
    })
    .select("id")
    .single();
  if (jobError || !job) throw new Error("Tidak dapat membuat catatan ingestion job.");

  try {
    const domains = await fetchBpsProvinceDomains();
    const fetchedAt = new Date().toISOString();
    const contentHash = createHash("sha256").update(JSON.stringify(domains)).digest("hex");
    const { data: existing, error: lookupError } = await supabase
      .from("raw_source_documents")
      .select("id, content_hash")
      .eq("source_id", source.id)
      .eq("external_id", "bps-domain-province-v1")
      .maybeSingle();
    if (lookupError) throw new Error("Tidak dapat memeriksa katalog BPS sebelumnya.");

    const unchanged = existing?.content_hash === contentHash;
    if (!unchanged) {
      const serialized = JSON.stringify({
        status: "OK",
        data: domains,
        source: "BPS WebAPI",
        endpoint_kind: "province_domains",
        fetched_at: fetchedAt,
      });
      const { error: documentError } = await supabase
        .from("raw_source_documents")
        .upsert({
          source_id: source.id,
          external_id: "bps-domain-province-v1",
          source_url: "https://webapi.bps.go.id/documentation/",
          title: "BPS province domain catalog",
          media_type: "application/json",
          content_text: serialized,
          content_hash: contentHash,
          observed_at: fetchedAt,
          fetched_at: fetchedAt,
          metadata: {
            endpoint_kind: "province_domains",
            api_version: "v1",
            domain_count: domains.length,
            attribution: "Layanan ini menggunakan API Badan Pusat Statistik (BPS).",
          } as Json,
        }, { onConflict: "source_id,external_id" });
      if (documentError) throw new Error("Gagal menyimpan dokumen mentah BPS ke Supabase.");
    }

    const { error: finishError } = await supabase
      .from("ingestion_jobs")
      .update({
        status: "SUCCEEDED",
        finished_at: fetchedAt,
        records_seen: domains.length,
        records_inserted: existing || unchanged ? 0 : 1,
        records_rejected: 0,
        metadata: {
          endpoint_kind: "province_domains",
          content_hash: contentHash,
          unchanged,
          document_updated: Boolean(existing) && !unchanged,
        },
      })
      .eq("id", job.id);
    if (finishError) throw new Error("Gagal menyelesaikan catatan ingestion job.");

    return { jobId: job.id, domainCount: domains.length, unchanged };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingestion failure";
    await supabase
      .from("ingestion_jobs")
      .update({
        status: "FAILED",
        finished_at: new Date().toISOString(),
        error_summary: message.slice(0, 500),
      })
      .eq("id", job.id);
    throw error;
  }
}
