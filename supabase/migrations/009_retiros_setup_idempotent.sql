-- ============================================================
-- Zentir — Crear infraestructura de retiros (idempotente)
-- Las migraciones 005/006/008 nunca se aplicaron en producción
-- (la tabla retiros no existía). Esta migración crea todo lo
-- necesario de una sola vez, ya con fecha_inicio/fecha_fin.
-- Segura de re-ejecutar aunque partes ya existan.
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- RETIROS
-- ============================================================
create table if not exists retiros (
  id           uuid primary key default uuid_generate_v4(),
  nombre       text not null,
  descripcion  text,
  fecha_inicio date,
  fecha_fin    date,
  lugar        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table retiros add column if not exists fecha_inicio date;
alter table retiros add column if not exists fecha_fin date;
alter table retiros add column if not exists lugar text;

drop trigger if exists retiros_updated_at on retiros;
create trigger retiros_updated_at
  before update on retiros
  for each row execute procedure update_updated_at();

-- ============================================================
-- RETIRO_ACCESS
-- ============================================================
create table if not exists retiro_access (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  retiro_id  uuid not null references retiros(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, retiro_id)
);

-- ============================================================
-- CONTENT: contenido puede pertenecer a un retiro
-- ============================================================
alter table content add column if not exists retiro_id uuid references retiros(id) on delete cascade;

-- ============================================================
-- Funciones helper (security definer, con search_path explícito)
-- ============================================================
create or replace function is_terapeuta()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where user_id = auth.uid() and perfil_tipo = 'terapeuta'
  );
$$;

create or replace function has_retiro_access(rid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from retiro_access where user_id = auth.uid() and retiro_id = rid
  );
$$;

-- ============================================================
-- RLS: content
-- ============================================================
drop policy if exists "Usuarios autenticados ven contenido según nivel" on content;
drop policy if exists "Acceso a contenido según nivel" on content;
drop policy if exists "Acceso a contenido" on content;

create policy "Acceso a contenido"
  on content for select using (
    is_admin()
    or (
      auth.uid() is not null
      and exists (select 1 from profiles p where p.user_id = auth.uid() and p.aprobado = true)
      and (
        (retiro_id is null and (nivel_acceso = 'all' or is_terapeuta()))
        or (retiro_id is not null and (is_terapeuta() or has_retiro_access(retiro_id)))
      )
    )
  );

-- ============================================================
-- RLS: retiros
-- ============================================================
alter table retiros enable row level security;

drop policy if exists "Acceso a retiros" on retiros;
create policy "Acceso a retiros"
  on retiros for select using (
    is_admin() or is_terapeuta() or has_retiro_access(id)
  );

drop policy if exists "Solo admins modifican retiros" on retiros;
create policy "Solo admins modifican retiros"
  on retiros for all using (is_admin());

drop policy if exists "Retiros con fecha son públicos" on retiros;
create policy "Retiros con fecha son públicos"
  on retiros for select using (fecha_inicio is not null);

-- ============================================================
-- RLS: retiro_access
-- ============================================================
alter table retiro_access enable row level security;

drop policy if exists "Usuarios ven su propio acceso a retiros" on retiro_access;
create policy "Usuarios ven su propio acceso a retiros"
  on retiro_access for select using (auth.uid() = user_id or is_admin());

drop policy if exists "Solo admins modifican retiro_access" on retiro_access;
create policy "Solo admins modifican retiro_access"
  on retiro_access for insert with check (is_admin());

drop policy if exists "Solo admins eliminan retiro_access" on retiro_access;
create policy "Solo admins eliminan retiro_access"
  on retiro_access for delete using (is_admin());

-- ============================================================
-- RLS: storage.objects — la descarga debe respetar el acceso a content
-- ============================================================
drop policy if exists "Usuarios autenticados pueden descargar" on storage.objects;
drop policy if exists "Descarga según acceso a contenido" on storage.objects;

create policy "Descarga según acceso a contenido"
  on storage.objects for select using (
    bucket_id = 'content-files' and (
      is_admin()
      or exists (
        select 1 from content c
        where c.file_url = storage.objects.name
          and exists (select 1 from profiles p where p.user_id = auth.uid() and p.aprobado = true)
          and (
            (c.retiro_id is null and (c.nivel_acceso = 'all' or is_terapeuta()))
            or (c.retiro_id is not null and (is_terapeuta() or has_retiro_access(c.retiro_id)))
          )
      )
    )
  );

-- Forzar a PostgREST a refrescar su caché de esquema
notify pgrst, 'reload schema';
