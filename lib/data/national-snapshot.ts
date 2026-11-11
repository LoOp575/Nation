import { createSupabaseServerClient } from "@/lib/supabase/server";

type PublishedObservation = {
  indicator_id: string;
  value: number;
  unit: string;
  period_start: string;
  period_end: string;
  evidence_status: "OBSERVED" | "REPORTED" | "ESTIMATED" | "FORECAST";
};

export type SnapshotIndicator = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  latest: PublishedObservation | null;
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
    .select("id, code, name, description, category, unit")
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
    .select("indicator_id, value, unit, period_start, period_end, evidence_status")
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

  return {
    indicators: indicators.map((indicator) => ({
      ...indicator,
      latest: latestByIndicator.get(indicator.id) ?? null,
    })),
    observationCount: observations?.length ?? 0,
    error: null,
  };
}
