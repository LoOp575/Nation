-- National Pulse foundation schema.
-- Public reads are limited to explicitly published records.
-- Ingestion, raw documents, revisions, and audit logs are service-role only.

create table public.data_sources (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  agency text,
  source_url text not null,
  source_type text not null check (source_type in ('API', 'WEB', 'FILE', 'MANUAL')),
  update_frequency text,
  license_notes text,
  attribution_text text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.data_sources(id) on delete set null,
  job_type text not null,
  status text not null default 'QUEUED'
    check (status in ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED')),
  started_at timestamptz,
  finished_at timestamptz,
  records_seen integer not null default 0 check (records_seen >= 0),
  records_inserted integer not null default 0 check (records_inserted >= 0),
  records_rejected integer not null default 0 check (records_rejected >= 0),
  error_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.raw_source_documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.data_sources(id) on delete restrict,
  external_id text,
  source_url text not null,
  title text,
  media_type text,
  content_text text,
  content_hash text,
  source_published_at timestamptz,
  observed_at timestamptz,
  fetched_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.indicators (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  category text not null,
  unit text not null,
  geography_level text not null default 'NATIONAL',
  methodology text,
  source_id uuid references public.data_sources(id) on delete set null,
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.indicator_observations (
  id uuid primary key default gen_random_uuid(),
  indicator_id uuid not null references public.indicators(id) on delete restrict,
  source_id uuid references public.data_sources(id) on delete set null,
  geography_code text not null default 'ID',
  geography_name text not null default 'Indonesia',
  period_start date not null,
  period_end date not null,
  value numeric not null,
  unit text not null,
  evidence_status text not null
    check (evidence_status in ('OBSERVED', 'REPORTED', 'ESTIMATED', 'FORECAST')),
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED')),
  source_published_at timestamptz,
  observed_at timestamptz,
  fetched_at timestamptz not null default now(),
  revision integer not null default 1 check (revision > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (period_end >= period_start),
  unique (indicator_id, geography_code, period_start, period_end, revision)
);

create table public.observation_revisions (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.indicator_observations(id) on delete restrict,
  previous_value numeric,
  next_value numeric not null,
  change_reason text not null,
  source_document_id uuid references public.raw_source_documents(id) on delete set null,
  changed_at timestamptz not null default now(),
  changed_by uuid references auth.users(id) on delete set null
);

create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.data_sources(id) on delete set null,
  publisher text not null,
  title text not null,
  canonical_url text not null unique,
  content_excerpt text,
  article_published_at timestamptz,
  fetched_at timestamptz not null default now(),
  evidence_status text not null default 'REPORTED'
    check (evidence_status in ('OBSERVED', 'REPORTED', 'ESTIMATED', 'FORECAST')),
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  title text not null,
  description text,
  location_name text,
  region_code text,
  started_at timestamptz,
  ended_at timestamptz,
  evidence_status text not null
    check (evidence_status in ('OBSERVED', 'REPORTED', 'ESTIMATED', 'FORECAST')),
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ended_at is null or started_at is null or ended_at >= started_at)
);

create table public.event_evidence (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  source_id uuid references public.data_sources(id) on delete set null,
  document_id uuid references public.raw_source_documents(id) on delete set null,
  news_article_id uuid references public.news_articles(id) on delete set null,
  evidence_type text not null,
  excerpt text,
  source_url text not null,
  source_published_at timestamptz,
  captured_at timestamptz not null default now(),
  publication_status text not null default 'DRAFT'
    check (publication_status in ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  check (num_nonnulls(document_id, news_article_id) <= 1)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  request_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index indicator_observations_lookup_idx
  on public.indicator_observations (indicator_id, geography_code, period_end desc);
create index indicator_observations_public_idx
  on public.indicator_observations (publication_status, period_end desc);
create index news_articles_published_idx
  on public.news_articles (article_published_at desc)
  where publication_status = 'PUBLISHED';
create index events_published_idx
  on public.events (started_at desc)
  where publication_status = 'PUBLISHED';
create index event_evidence_event_idx on public.event_evidence (event_id);

-- Keep updated_at consistent for mutable catalog/event records.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger data_sources_set_updated_at
before update on public.data_sources
for each row execute function public.set_updated_at();

create trigger indicators_set_updated_at
before update on public.indicators
for each row execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- RLS is enabled on every table in the exposed public schema.
alter table public.data_sources enable row level security;
alter table public.ingestion_jobs enable row level security;
alter table public.raw_source_documents enable row level security;
alter table public.indicators enable row level security;
alter table public.indicator_observations enable row level security;
alter table public.observation_revisions enable row level security;
alter table public.news_articles enable row level security;
alter table public.events enable row level security;
alter table public.event_evidence enable row level security;
alter table public.audit_logs enable row level security;

-- Public dashboard read policies. Draft, review, and archived records stay private.
create policy "Public can read active source catalog"
on public.data_sources for select to anon, authenticated
using (is_active = true);

create policy "Public can read published indicators"
on public.indicators for select to anon, authenticated
using (publication_status = 'PUBLISHED');

create policy "Public can read published observations"
on public.indicator_observations for select to anon, authenticated
using (
  publication_status = 'PUBLISHED'
  and exists (
    select 1 from public.indicators i
    where i.id = indicator_id and i.publication_status = 'PUBLISHED'
  )
);

create policy "Public can read published news"
on public.news_articles for select to anon, authenticated
using (publication_status = 'PUBLISHED');

create policy "Public can read published events"
on public.events for select to anon, authenticated
using (publication_status = 'PUBLISHED');

create policy "Public can read published event evidence"
on public.event_evidence for select to anon, authenticated
using (
  publication_status = 'PUBLISHED'
  and exists (
    select 1 from public.events e
    where e.id = event_id and e.publication_status = 'PUBLISHED'
  )
);

-- Explicit least-privilege grants. No public write permissions are granted.
grant usage on schema public to anon, authenticated, service_role;

revoke all on table
  public.data_sources,
  public.ingestion_jobs,
  public.raw_source_documents,
  public.indicators,
  public.indicator_observations,
  public.observation_revisions,
  public.news_articles,
  public.events,
  public.event_evidence,
  public.audit_logs
from anon, authenticated;

grant select on table
  public.data_sources,
  public.indicators,
  public.indicator_observations,
  public.news_articles,
  public.events,
  public.event_evidence
to anon, authenticated;

grant all on table
  public.data_sources,
  public.ingestion_jobs,
  public.raw_source_documents,
  public.indicators,
  public.indicator_observations,
  public.observation_revisions,
  public.news_articles,
  public.events,
  public.event_evidence,
  public.audit_logs
to service_role;

comment on table public.indicator_observations is
  'Versioned, provenance-aware observations. Evidence status is never inferred from publication status.';
comment on table public.event_evidence is
  'Evidence links for events. Published evidence is visible only when its parent event is published.';
