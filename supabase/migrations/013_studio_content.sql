-- ============================================================
-- STUDIO CONTENT: contenido público de "Zentir Studio"
-- (podcasts, publicaciones y documentos, visibles sin login)
-- ============================================================

create table if not exists studio_content (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  content_type text not null check (content_type in ('documento', 'podcast', 'publicacion')),
  external_url text,
  file_url text,
  file_name text,
  file_size bigint,
  file_type text,
  created_at timestamptz not null default now(),
  constraint studio_content_source check (
    (content_type = 'documento' and file_url is not null and external_url is null) or
    (content_type in ('podcast', 'publicacion') and external_url is not null and file_url is null)
  )
);

alter table studio_content enable row level security;

drop policy if exists "Cualquiera puede ver contenido de studio" on studio_content;
create policy "Cualquiera puede ver contenido de studio"
  on studio_content for select using (true);

drop policy if exists "Admins gestionan contenido de studio" on studio_content;
create policy "Admins gestionan contenido de studio"
  on studio_content for all using (is_admin()) with check (is_admin());

-- ============================================================
-- STORAGE: bucket público para documentos de Zentir Studio
-- ============================================================
insert into storage.buckets (id, name, public)
values ('studio-files', 'studio-files', true)
on conflict (id) do nothing;

drop policy if exists "Admins suben archivos de studio" on storage.objects;
create policy "Admins suben archivos de studio"
  on storage.objects for insert with check (
    bucket_id = 'studio-files' and is_admin()
  );

drop policy if exists "Admins borran archivos de studio" on storage.objects;
create policy "Admins borran archivos de studio"
  on storage.objects for delete using (
    bucket_id = 'studio-files' and is_admin()
  );

drop policy if exists "Cualquiera puede ver archivos de studio" on storage.objects;
create policy "Cualquiera puede ver archivos de studio"
  on storage.objects for select using (
    bucket_id = 'studio-files'
  );

notify pgrst, 'reload schema';
