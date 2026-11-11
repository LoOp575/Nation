const BPS_API_BASE = "https://webapi.bps.go.id/v1/api";
export type BpsDomain = { domain_id: string; domain_name: string; domain_url: string };
type BpsDomainResponse = { status?: string; "data-availability"?: string; data?: unknown; error?: string };
export class BpsApiError extends Error {
  constructor(message: string, readonly statusCode = 502) { super(message); this.name = "BpsApiError"; }
}
function readDomainRows(payload: BpsDomainResponse): BpsDomain[] {
  if (payload.status !== "OK") throw new BpsApiError("BPS WebAPI mengembalikan status non-OK.");
  const blocks = Array.isArray(payload.data) ? payload.data : [];
  const rows = Array.isArray(blocks[1]) ? blocks[1] : [];
  return rows.flatMap((row): BpsDomain[] => {
    if (!row || typeof row !== "object") return [];
    const item = row as Record<string, unknown>;
    if (typeof item.domain_id !== "string" || typeof item.domain_name !== "string" || typeof item.domain_url !== "string") return [];
    return [{ domain_id: item.domain_id, domain_name: item.domain_name, domain_url: item.domain_url }];
  });
}
export async function getBpsProvinceDomains(): Promise<{ domains: BpsDomain[]; fetchedAt: string; sourceUrl: string }> {
  const apiKey = process.env.BPS_API_KEY?.trim();
  if (!apiKey) throw new BpsApiError("BPS_API_KEY belum dikonfigurasi di environment server.", 503);
  const url = new URL(`${BPS_API_BASE}/domain/type/prov/key/${encodeURIComponent(apiKey)}`);
  let response: Response;
  try {
    response = await fetch(url, { method: "GET", headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  } catch {
    throw new BpsApiError("Tidak dapat menghubungi BPS WebAPI. Periksa koneksi atau coba kembali.", 504);
  }
  if (!response.ok) throw new BpsApiError(`BPS WebAPI merespons HTTP ${response.status}.`);
  let payload: BpsDomainResponse;
  try { payload = await response.json() as BpsDomainResponse; }
  catch { throw new BpsApiError("Respons BPS bukan JSON yang valid."); }
  if (payload.error === "UserNotFound") throw new BpsApiError("API key BPS tidak dikenali. Periksa kredensial aplikasi.", 401);
  const domains = readDomainRows(payload);
  if (!domains.length) throw new BpsApiError("Respons BPS valid, tetapi daftar domain provinsi tidak ditemukan.");
  return { domains, fetchedAt: new Date().toISOString(), sourceUrl: "https://webapi.bps.go.id/documentation/" };
}
