import "server-only";

const BPS_API_BASE_URL = "https://webapi.bps.go.id/v1/api";

export type BpsDomain = {
  domain_id: string;
  domain_name: string;
  domain_url: string;
};

type BpsEnvelope = {
  status?: string;
  "data-availability"?: string;
  data?: unknown;
  error?: string;
};

function getApiKey(): string {
  const key = process.env.BPS_API_KEY?.trim();
  if (!key) {
    throw new Error("BPS_API_KEY belum dikonfigurasi pada environment server.");
  }
  return key;
}

async function requestBps(path: string): Promise<BpsEnvelope> {
  const key = getApiKey();
  const url = `${BPS_API_BASE_URL}/${path}/key/${encodeURIComponent(key)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`BPS WebAPI mengembalikan HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Format respons BPS WebAPI tidak valid.");
  }

  const envelope = payload as BpsEnvelope;
  if (envelope.status !== "OK") {
    throw new Error("BPS WebAPI tidak mengembalikan status OK.");
  }

  return envelope;
}

/**
 * Fetches the official BPS domain catalogue.
 * The API key is read only from server environment variables and is never
 * returned to callers, serialized into page props, or included in errors.
 */
export async function getBpsDomains(): Promise<BpsDomain[]> {
  const envelope = await requestBps("domain/type/all");
  if (!Array.isArray(envelope.data) || !Array.isArray(envelope.data[1])) {
    throw new Error("Katalog domain BPS tidak memiliki struktur data yang dikenali.");
  }

  return envelope.data[1].filter(
    (item): item is BpsDomain =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as BpsDomain).domain_id === "string" &&
      typeof (item as BpsDomain).domain_name === "string" &&
      typeof (item as BpsDomain).domain_url === "string",
  );
}

/**
 * Fetches one BPS dynamic-table response without guessing its schema.
 * Dataset IDs (domain, variable, and period) must come from BPS metadata.
 * Normalization and database insertion are intentionally handled separately.
 */
export async function getBpsDynamicTable(input: {
  domainId: string;
  variableId: string;
  periodId: string;
}): Promise<BpsEnvelope> {
  for (const [name, value] of Object.entries(input)) {
    if (!/^\d+$/.test(value)) {
      throw new Error(`Parameter BPS ${name} harus berupa ID numerik.`);
    }
  }

  const { domainId, variableId, periodId } = input;
  return requestBps(
    `list/model/data/domain/${domainId}/var/${variableId}/th/${periodId}`,
  );
}
