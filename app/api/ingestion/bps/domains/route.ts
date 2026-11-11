import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { BpsApiError, getBpsProvinceDomains } from "@/lib/connectors/bps/client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.NATIONAL_PULSE_INGESTION_SECRET;
  const authorization = request.headers.get("authorization");
  const provided = authorization?.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : null;
  if (!expected || !provided) return false;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  return expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    endpoint: "/api/ingestion/bps/domains",
    method: "POST",
    purpose: "Fetch and upsert BPS province-domain reference records into Supabase",
    requiredEnvironment: [
      "BPS_API_KEY",
      "NATIONAL_PULSE_INGESTION_SECRET",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SECRET_KEY",
    ],
  }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let supabase: ReturnType<typeof createSupabaseAdminClient>;
  try {
    supabase = createSupabaseAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Supabase server credentials are not configured." },
      { status: 503 },
    );
  }

  const { data: source, error: sourceError } = await supabase
    .from("data_sources")
    .select("id, code, name")
    .eq("code", "BPS_WEBAPI")
    .eq("is_active", true)
    .single();

  if (sourceError || !source) {
    return NextResponse.json(
      { error: "Sumber BPS_WEBAPI belum terdaftar atau tidak aktif di Supabase." },
      { status: 503 },
    );
  }

  const { data: job, error: jobError } = await supabase
    .from("ingestion_jobs")
    .insert({
      source_id: source.id,
      job_type: "BPS_PROVINCE_DOMAIN_SYNC",
      status: "RUNNING",
      started_at: new Date().toISOString(),
      metadata: { endpoint: "domain/type/prov", method: "GET" },
    })
    .select("id")
    .single();

  if (jobError || !job) {
    return NextResponse.json(
      { error: "Tidak dapat mencatat ingestion job di Supabase." },
      { status: 500 },
    );
  }

  try {
    const result = await getBpsProvinceDomains();
    const documents = result.domains.map((domain) => {
      const externalId = `bps-domain-${domain.domain_id}`;
      const content = JSON.stringify(domain);
      return {
        source_id: source.id,
        external_id: externalId,
        source_url: domain.domain_url,
        title: `BPS domain: ${domain.domain_name}`,
        media_type: "application/json",
        content_text: content,
        content_hash: createHash("sha256").update(content).digest("hex"),
        observed_at: result.fetchedAt,
        fetched_at: result.fetchedAt,
        metadata: {
          record_type: "BPS_PROVINCE_DOMAIN",
          domain_id: domain.domain_id,
          domain_name: domain.domain_name,
          api_endpoint: "domain/type/prov",
        },
      };
    });

    const { data: stored, error: storageError } = await supabase
      .from("raw_source_documents")
      .upsert(documents, { onConflict: "source_id,external_id" })
      .select("id");

    if (storageError) {
      throw new Error("Supabase gagal menyimpan dokumen domain BPS.");
    }

    const { error: finishError } = await supabase
      .from("ingestion_jobs")
      .update({
        status: "SUCCEEDED",
        finished_at: new Date().toISOString(),
        records_seen: result.domains.length,
        records_inserted: stored?.length ?? 0,
        records_rejected: 0,
        error_summary: null,
        metadata: {
          endpoint: "domain/type/prov",
          source_code: source.code,
          fetched_at: result.fetchedAt,
          domain_count: result.domains.length,
          persistence: "upsert_by_source_and_external_id",
        },
      })
      .eq("id", job.id);

    if (finishError) {
      throw new Error("Data tersimpan, tetapi status ingestion job gagal diperbarui.");
    }

    return NextResponse.json({
      status: "succeeded",
      jobId: job.id,
      source: source.name,
      recordsSeen: result.domains.length,
      recordsUpserted: stored?.length ?? 0,
      fetchedAt: result.fetchedAt,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof BpsApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unknown ingestion error";

    await supabase.from("ingestion_jobs").update({
      status: "FAILED",
      finished_at: new Date().toISOString(),
      error_summary: message.slice(0, 500),
    }).eq("id", job.id);

    const status = error instanceof BpsApiError ? error.statusCode : 502;
    return NextResponse.json(
      { status: "failed", jobId: job.id, error: message },
      { status },
    );
  }
}
