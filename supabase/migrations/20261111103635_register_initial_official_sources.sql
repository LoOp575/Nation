-- Register verified official statistical source entry points.
-- Registration does not imply that automated ingestion is already active.

insert into public.data_sources
  (code, name, agency, source_url, source_type, update_frequency, license_notes, attribution_text, is_active)
values
  (
    'BPS_WEBAPI',
    'WebAPI Badan Pusat Statistik',
    'Badan Pusat Statistik',
    'https://webapi.bps.go.id/documentation/',
    'API',
    'Depends on dataset release schedule',
    'Requires application registration and a secret API key. Follow current BPS WebAPI terms, respect rate limits and dataset metadata. BPS terms state that commercial use requires prior approval or a cooperation agreement. Do not store the API key in client code.',
    'Layanan ini menggunakan API Badan Pusat Statistik (BPS).',
    true
  ),
  (
    'BI_SEKI',
    'Statistik Ekonomi dan Keuangan Indonesia (SEKI)',
    'Bank Indonesia',
    'https://www.bi.go.id/id/statistik/ekonomi-keuangan/seki/Default.aspx',
    'WEB',
    'Monthly publication',
    'Official monthly statistical publication. Record the publication date, observation period, table metadata, units, and any source institution identified by BI. Automated API access has not yet been verified; use documented/manual acquisition until a permitted stable endpoint is confirmed.',
    'Sumber: Bank Indonesia, Statistik Ekonomi dan Keuangan Indonesia (SEKI).',
    true
  )
on conflict (code) do update set
  name = excluded.name,
  agency = excluded.agency,
  source_url = excluded.source_url,
  source_type = excluded.source_type,
  update_frequency = excluded.update_frequency,
  license_notes = excluded.license_notes,
  attribution_text = excluded.attribution_text,
  is_active = excluded.is_active,
  updated_at = now();
