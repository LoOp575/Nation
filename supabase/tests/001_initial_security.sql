-- Run against a disposable/local Supabase database after applying migrations.
-- Raises an exception if the initial access-control contract is broken.

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'data_sources',
    'ingestion_jobs',
    'raw_source_documents',
    'indicators',
    'indicator_observations',
    'observation_revisions',
    'news_articles',
    'events',
    'event_evidence',
    'audit_logs'
  ]
  loop
    if not exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = table_name
        and c.relrowsecurity = true
    ) then
      raise exception 'RLS is not enabled on public.%', table_name;
    end if;
  end loop;

  if not has_table_privilege('anon', 'public.indicators', 'SELECT') then
    raise exception 'anon must have SELECT on published indicator catalog';
  end if;

  if has_table_privilege('anon', 'public.ingestion_jobs', 'SELECT') then
    raise exception 'anon must not have SELECT on ingestion_jobs';
  end if;

  if has_table_privilege('authenticated', 'public.raw_source_documents', 'SELECT') then
    raise exception 'authenticated must not have SELECT on raw_source_documents';
  end if;

  if has_table_privilege('anon', 'public.indicators', 'INSERT')
     or has_table_privilege('anon', 'public.indicators', 'UPDATE')
     or has_table_privilege('anon', 'public.indicators', 'DELETE') then
    raise exception 'anon must not have write privileges on indicators';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'indicator_observations'
      and policyname = 'Public can read published observations'
  ) then
    raise exception 'Published-observation read policy is missing';
  end if;
end;
$$;

select 'National Pulse initial RLS checks passed' as result;
