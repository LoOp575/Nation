-- Explicit deny policies document the private-table boundary for API roles.
create policy "No public access to ingestion jobs"
on public.ingestion_jobs for all to anon, authenticated
using (false) with check (false);

create policy "No public access to raw source documents"
on public.raw_source_documents for all to anon, authenticated
using (false) with check (false);

create policy "No public access to observation revisions"
on public.observation_revisions for all to anon, authenticated
using (false) with check (false);

create policy "No public access to audit logs"
on public.audit_logs for all to anon, authenticated
using (false) with check (false);

-- Cover foreign-key columns used for joins/deletes and future operational queries.
create index if not exists audit_logs_actor_id_idx
  on public.audit_logs (actor_id);
create index if not exists event_evidence_document_id_idx
  on public.event_evidence (document_id);
create index if not exists event_evidence_news_article_id_idx
  on public.event_evidence (news_article_id);
create index if not exists event_evidence_source_id_idx
  on public.event_evidence (source_id);
create index if not exists indicator_observations_source_id_idx
  on public.indicator_observations (source_id);
create index if not exists indicators_source_id_idx
  on public.indicators (source_id);
create index if not exists ingestion_jobs_source_id_idx
  on public.ingestion_jobs (source_id);
create index if not exists news_articles_source_id_idx
  on public.news_articles (source_id);
create index if not exists observation_revisions_changed_by_idx
  on public.observation_revisions (changed_by);
create index if not exists observation_revisions_observation_id_idx
  on public.observation_revisions (observation_id);
create index if not exists observation_revisions_source_document_id_idx
  on public.observation_revisions (source_document_id);
create index if not exists raw_source_documents_source_id_idx
  on public.raw_source_documents (source_id);
