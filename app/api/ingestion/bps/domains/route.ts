import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { BpsApiError, getBpsProvinceDomains } from "@/lib/connectors/bps/client";

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

  try {
    const result = await getBpsProvinceDomains();
    return NextResponse.json({
      status: "ok",
      source: "BPS WebAPI",
      count: result.domains.length,
      fetchedAt: result.fetchedAt,
      documentation: result.sourceUrl,
      domains: result.domains,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof BpsApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada konektor BPS." },
      { status: 500 },
    );
  }
}
