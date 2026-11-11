import { createSupabaseServerClient } from "@/lib/supabase/server";

type PublishedObservation = {
  indicator_id: string;
  source_id: string | null;
  value: number;
  unit: string;
  period_start: string;
  period_end: string;
  evidence_status: "OBSERVED" | "REPORTED" | "ESTIMATED" | "FORECAST";
  fetched_at: string;
};

type SourceRecord = {
  id: string;
  name: string;
  source_url: string;
};

export type SnapshotIndicator = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  latest: (PublishedObservation & { source: SourceRecord | null }) | null;
};

export async function getNationalSnapshot(): Promise<{
  indicators: SnapshotIndicator[];
  observationCount: number;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      indicators: [],
      observationCount: 0,
      error: "Lengkapi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  const { data: indicators, error: indicatorError } = await supabase
    .from("indicators")
    .select("id, code, name, description, category, unit, source_id")
    .eq("publication_status", "PUBLISHED")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (indicatorError) {
    return {
      indicators: [],
      observationCount: 0,
      error: "Gagal membaca katalog indikator dari Supabase. Periksa Data API dan kebijakan RLS.",
    };
  }

  if (!indicators?.length) {
    return { indicators: [], observationCount: 0, error: null };
  }

  const ids = indicators.map((indicator) => indicator.id);
  const { data: observations, error: observationError } = await supabase
    .from("indicator_observations")
    .select("indicator_id, source_id, value, unit, period_start, period_end, evidence_status, fetched_at")
    .in("indicator_id", ids)
    .eq("publication_status", "PUBLISHED")
    .order("period_end", { ascending: false });

  if (observationError) {
    return {
      indicators: [],
      observationCount: 0,
      error: "Katalog indikator tersedia, tetapi observasi gagal dimuat. Periksa kebijakan RLS.",
    };
  }

  const latestByIndicator = new Map<string, PublishedObservation>();
  for (const observation of (observations ?? []) as PublishedObservation[]) {
    if (!latestByIndicator.has(observation.indicator_id)) {
      latestByIndicator.set(observation.indicator_id, observation);
    }
  }

  const sourceIds = Array.from(new Set([
    ...indicators.map((indicator) => indicator.source_id as string | null),
    ...Array.from(latestByIndicator.values()).map((observation) => observation.source_id),
  ].filter((id): id is string => Boolean(id))));

  let sourcesById = new Map<string, SourceRecord>();
  if (sourceIds.length > 0) {
    const { data: sources, error: sourceError } = await supabase
      .from("data_sources")
      .select("id, name, source_url")
      .in("id", sourceIds)
      .eq("is_active", true);

    if (sourceError) {
      return {
        indicators: [],
        observationCount: 0,
        error: "Observasi ditemukan, tetapi metadata sumber gagal dimuat.",
      };
    }
    sourcesById = new Map((sources ?? []).map((source) => [source.id, source as SourceRecord]));
  }

  return {
    indicators: indicators.map((indicator) => {
      const latest = latestByIndicator.get(indicator.id) ?? null;
      const sourceId = latest?.source_id ?? indicator.source_id ?? null;
      return {
        ...indicator,
        latest: latest
          ? { ...latest, source: sourceId ? sourcesById.get(sourceId) ?? null : null }
          : null,
      };
    }),
    observationCount: observations?.length ?? 0,
    error: null,
  };
}
