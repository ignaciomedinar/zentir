-- ============================================================
-- Zentir — Retiros con acceso por usuario (reemplaza premium)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- RETIROS
-- ============================================================
create table retiros (
  id          uuid primary key default uuid_generate_v4(),
  nombre      text not null,
  descripcion text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger retiros_updated_at
  before update on retiros
  for each row execute procedure update_updated_at();

-- ============================================================
-- RETIRO_ACCESS — qué usuario tiene acceso a qué retiro
-- ============================================================
create table retiro_access (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  retiro_id  uuid not null references retiros(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, retiro_id)
);

-- ============================================================
-- CONTENT: contenido puede pertenecer a un retiro
-- ============================================================
alter table content add column retiro_id uuid references retiros(id) on delete cascade;

-- ============================================================
-- Quitar el concepto de premium
-- ============================================================
alter table profiles drop column if exists is_premium;

-- Simplificar access_level: solo queda 'all' y 'terapeuta'
-- (el acceso "premium" anterior se reemplaza por retiro_access)
update content set nivel_acceso = 'all' where nivel_acceso::text = 'premium';

alter table content alter column nivel_acceso drop default;
alter type access_level rename to access_level_old;
create type access_level as enum ('all', 'terapeuta');

alter table content
  alter column nivel_acceso type access_level
  using (
    case nivel_acceso::text
      when 'terapeuta' then 'terapeuta'::access_level
      else 'all'::access_level
    end
  );

alter table content alter column nivel_acceso set default 'all'::access_level;
drop type access_level_old;

-- ============================================================
-- Funciones helper (security definer, evitan recursión RLS)
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

create policy "Acceso a retiros"
  on retiros for select using (
    is_admin() or is_terapeuta() or has_retiro_access(id)
  );

create policy "Solo admins modifican retiros"
  on retiros for all using (is_admin());

-- ============================================================
-- RLS: retiro_access
-- ============================================================
alter table retiro_access enable row level security;

create policy "Usuarios ven su propio acceso a retiros"
  on retiro_access for select using (auth.uid() = user_id or is_admin());

create policy "Solo admins modifican retiro_access"
  on retiro_access for insert with check (is_admin());

create policy "Solo admins eliminan retiro_access"
  on retiro_access for delete using (is_admin());

-- ============================================================
-- RLS: storage.objects — la descarga debe respetar el acceso a content
-- ============================================================
drop policy if exists "Usuarios autenticados pueden descargar" on storage.objects;

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
