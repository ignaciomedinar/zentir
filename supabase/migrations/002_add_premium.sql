-- ============================================================
-- Zentir — Migración: usuarios premium
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Agregar columna is_premium a profiles
alter table profiles
  add column if not exists is_premium boolean not null default false;

-- 2. Agregar valor 'premium' al enum access_level
-- (los enums en Postgres solo admiten agregar valores, no eliminar)
alter type access_level add value if not exists 'premium';

-- 3. Actualizar política de acceso a contenido para incluir premium
drop policy if exists "Usuarios autenticados ven contenido según nivel" on content;

create policy "Acceso a contenido según nivel"
  on content for select using (
    auth.uid() is not null and (
      -- Contenido libre para todos
      nivel_acceso = 'all'
      -- Contenido premium: solo usuarios premium aprobados
      or (
        nivel_acceso = 'premium'
        and exists (
          select 1 from profiles p
          where p.user_id = auth.uid()
            and p.is_premium = true
            and p.aprobado = true
        )
      )
      -- Contenido por perfil
      or exists (
        select 1 from profiles p
        where p.user_id = auth.uid()
          and p.aprobado = true
          and p.perfil_tipo::text = nivel_acceso::text
      )
    )
  );

-- Admins siempre ven todo
drop policy if exists "Solo admins modifican contenido" on content;

create policy "Solo admins modifican contenido"
  on content for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "Admins ven todo el contenido"
  on content for select using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );
