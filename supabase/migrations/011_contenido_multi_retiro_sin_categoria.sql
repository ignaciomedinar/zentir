-- ============================================================
-- Zentir — Contenido: quitar categorías, permitir múltiples
-- retiros por archivo (antes: 1 retiro vía content.retiro_id)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- CONTENT_RETIROS (many-to-many)
-- ============================================================
create table if not exists content_retiros (
  content_id uuid not null references content(id) on delete cascade,
  retiro_id  uuid not null references retiros(id) on delete cascade,
  primary key (content_id, retiro_id)
);

-- Migrar datos existentes de content.retiro_id -> content_retiros
insert into content_retiros (content_id, retiro_id)
select id, retiro_id from content where retiro_id is not null
on conflict do nothing;

-- Las políticas viejas dependen de content.retiro_id: hay que quitarlas
-- antes de poder borrar la columna.
drop policy if exists "Acceso a contenido" on content;
drop policy if exists "Descarga según acceso a contenido" on storage.objects;

alter table content drop column if exists retiro_id;
alter table content drop column if exists categoria_id;

-- ============================================================
-- Helper: ¿tiene el usuario acceso a alguno de los retiros
-- asignados a este contenido?
-- ============================================================
create or replace function has_any_retiro_access(cid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from content_retiros cr
    join retiro_access ra on ra.retiro_id = cr.retiro_id
    where cr.content_id = cid and ra.user_id = auth.uid()
  );
$$;

create or replace function content_has_retiros(cid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from content_retiros where content_id = cid);
$$;

-- ============================================================
-- RLS: content_retiros
-- ============================================================
alter table content_retiros enable row level security;

drop policy if exists "Acceso a content_retiros según acceso a contenido" on content_retiros;
create policy "Acceso a content_retiros según acceso a contenido"
  on content_retiros for select using (
    is_admin() or is_terapeuta() or has_retiro_access(retiro_id)
  );

drop policy if exists "Solo admins modifican content_retiros" on content_retiros;
create policy "Solo admins modifican content_retiros"
  on content_retiros for all using (is_admin());

-- ============================================================
-- RLS: content (reemplaza política anterior basada en retiro_id)
-- ============================================================
drop policy if exists "Acceso a contenido" on content;
create policy "Acceso a contenido"
  on content for select using (
    is_admin()
    or (
      auth.uid() is not null
      and exists (select 1 from profiles p where p.user_id = auth.uid() and p.aprobado = true)
      and (
        (not content_has_retiros(id) and (nivel_acceso = 'all' or is_terapeuta()))
        or (content_has_retiros(id) and (is_terapeuta() or has_any_retiro_access(id)))
      )
    )
  );

-- ============================================================
-- RLS: storage.objects (reemplaza lógica anterior basada en retiro_id)
-- ============================================================
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
            (not content_has_retiros(c.id) and (c.nivel_acceso = 'all' or is_terapeuta()))
            or (content_has_retiros(c.id) and (is_terapeuta() or has_any_retiro_access(c.id)))
          )
      )
    )
  );

notify pgrst, 'reload schema';
