-- PostgreSQL ON CONFLICT inference needs a non-partial unique index for the upsert target.
drop index if exists public.raw_source_documents_source_external_uidx;
create unique index raw_source_documents_source_external_uidx
  on public.raw_source_documents (source_id, external_id);
