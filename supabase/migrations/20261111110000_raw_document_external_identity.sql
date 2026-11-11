-- Make the BPS raw catalog upsert idempotent per source and external identifier.
create unique index if not exists raw_source_documents_source_external_uidx
  on public.raw_source_documents (source_id, external_id)
  where external_id is not null;
