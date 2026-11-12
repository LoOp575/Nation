import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EvidenceStatus = "OBSERVED" | "REPORTED" | "ESTIMATED" | "FORECAST";

export type PublishedObservation = {
  indicator_id: string;
  source_id: string | null;
  geography_code: string;
  geography_name: string;
  value: number;
  unit: string;
  period_start: string;
  period_end: string;
  evidence_status: EvidenceStatus;
  fetched_at: string;
  source_published_at: string | null;
};

export type SourceRecord = {
  id: string;
  code: string;
  name: string;
  agency: string | null;
  source_url: string;
  source_type: string;
  update_frequency: string | null;
};

export type SnapshotIndicator = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  latest: (PublishedObservation & { source: SourceRecord | null }) | null;
  history: PublishedObservation[];
};

export type PublishedEventSummary = {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  location_name: string | null;
  region_code: string | null;
  started_at: string | null;
  evidence_status: EvidenceStatus;
  evidence_count: number;
};

export type PublishedNewsSummary = {
  id: string;
  publisher: string;
  title: string;
  canonical_url: string;
  content_excerpt: string | null;
  article_published_at: string | null;
  evidence_status: EvidenceStatus;
};

export type NationalSnapshot = {
  configured: boolean;
  indicators: SnapshotIndicator[];
  observationCount: number;
  dataSources: SourceRecord[];
  events: PublishedEventSummary[];
  newsArticles: PublishedNewsSummary[];
  error: string | null;
};

export async function getNationalSnapshot(): Promise<NationalSnapshot> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      configured: false,
      indicators: [],
      observationCount: 0,
      dataSources: [],
      events: [],
      newsArticles: [],
      error: "Lengkapi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY untuk menyambungkan data live.",
    };
  }

  const [sourceRes, indicatorRes, eventRes, newsRes] = await Promise.all([
    supabase
      .from("data_sources")
      .select("id, code, name, agency, source_url, source_type, update_frequency")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase
      .from("indicators")
      .select("id, code, name, description, category, unit, source_id")
      .eq("publication_status", "PUBLISHED")
      .order("category", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("events")
      .select("id, event_type, title, description, location_name, region_code, started_at, evidence_status")
      .eq("publication_status", "PUBLISHED")
      .order("started_at", { ascending: false })
      .limit(8),
    supabase
      .from("news_articles")
      .select("id, publisher, title, canonical_url, content_excerpt, article_published_at, evidence_status")
      .eq("publication_status", "PUBLISHED")
      .order("article_published_at", { ascending: false })
      .limit(10),
  ]);

  const dataSources = (sourceRes.data ?? []) as SourceRecord[];

  if (indicatorRes.error) {
    return {
      configured: true,
      indicators: [],
      observationCount: 0,
      dataSources,
      events: [],
      newsArticles: [],
      error: "Gagal membaca katalog indikator dari Supabase. Periksa Data API dan kebijakan RLS.",
    };
  }

  const indicators = indicatorRes.data ?? [];
  const sourcesById = new Map<string, SourceRecord>(
    dataSources.map((source) => [source.id, source]),
  );

  let observationRows: PublishedObservation[] = [];
  if (indicators.length > 0) {
    const ids = indicators.map((indicator) => indicator.id);
    const { data: observations, error: observationError } = await supabase
      .from("indicator_observations")
      .select(
        "indicator_id, source_id, geography_code, geography_name, value, unit, period_start, period_end, evidence_status, fetched_at, source_published_at",
      )
      .in("indicator_id", ids)
      .eq("publication_status", "PUBLISHED")
      .order("period_end", { ascending: false });

    if (observationError) {
      return {
        configured: true,
        indicators: [],
        observationCount: 0,
        dataSources,
        events: [],
        newsArticles: [],
        error: "Katalog indikator tersedia, tetapi observasi gagal dimuat. Periksa kebijakan RLS.",
      };
    }

    observationRows = (observations ?? []) as PublishedObservation[];
  }

  const historyByIndicator = new Map<string, PublishedObservation[]>();
  for (const row of observationRows) {
    const existing = historyByIndicator.get(row.indicator_id) ?? [];
    existing.push(row);
    historyByIndicator.set(row.indicator_id, existing);
  }

  const rawEvents = eventRes.data ?? [];
  const evidenceCounts = new Map<string, number>();
  if (rawEvents.length > 0) {
    const { data: evidenceRows } = await supabase
      .from("event_evidence")
      .select("event_id")
      .in("event_id", rawEvents.map((ev) => ev.id))
      .eq("publication_status", "PUBLISHED");

    for (const row of evidenceRows ?? []) {
      evidenceCounts.set(row.event_id, (evidenceCounts.get(row.event_id) ?? 0) + 1);
    }
  }

  const events: PublishedEventSummary[] = rawEvents.map((ev) => ({
    id: ev.id,
    event_type: ev.event_type,
    title: ev.title,
    description: ev.description,
    location_name: ev.location_name,
    region_code: ev.region_code,
    started_at: ev.started_at,
    evidence_status: ev.evidence_status as EvidenceStatus,
    evidence_count: evidenceCounts.get(ev.id) ?? 0,
  }));

  const newsArticles: PublishedNewsSummary[] = (newsRes.data ?? []).map((item) => ({
    id: item.id,
    publisher: item.publisher,
    title: item.title,
    canonical_url: item.canonical_url,
    content_excerpt: item.content_excerpt,
    article_published_at: item.article_published_at,
    evidence_status: item.evidence_status as EvidenceStatus,
  }));

  return {
    configured: true,
    indicators: indicators.map((indicator) => {
      const history = historyByIndicator.get(indicator.id) ?? [];
      const latest = history[0] ?? null;
      const sourceId = latest?.source_id ?? indicator.source_id ?? null;
      return {
        id: indicator.id,
        code: indicator.code,
        name: indicator.name,
        description: indicator.description,
        category: indicator.category,
        unit: indicator.unit,
        history,
        latest: latest
          ? { ...latest, source: sourceId ? sourcesById.get(sourceId) ?? null : null }
          : null,
      };
    }),
    observationCount: observationRows.length,
    dataSources,
    events,
    newsArticles,
    error: null,
  };
}
