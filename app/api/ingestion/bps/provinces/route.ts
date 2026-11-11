import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { BpsApiError } from "@/lib/sources/bps/client";
import { ingestBpsProvinceDomains } from "@/lib/sources/bps/ingest-provinces";

export const runtime = "nodejs";
export const maxDuration = 30;

function isAuthorized(request: NextRequest) {
  const expected = process.env.NATIONAL_PULSE_INGESTION_SECRET;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !provided) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await ingestBpsProvinceDomains();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof BpsApiError
      ? error.message
      : "Ingestion gagal. Periksa konfigurasi server dan catatan job di Supabase.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
