-- ============================================================
-- Zentir — Migración: usuarios premium
-- IMPORTANTE: ejecutar en DOS pasos en el SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- PASO 1: Ejecutar esto primero (solo estas dos líneas)
-- ============================================================

alter table profiles
  add column if not exists is_premium boolean not null default false;

alter type access_level add value if not exists 'premium';

-- ============================================================
-- PASO 2: Después de que el PASO 1 se ejecute con éxito,
--         ejecutar todo esto en una nueva query
-- ============================================================

-- drop policy if exists "Usuarios autenticados ven contenido según nivel" on content;

-- create policy "Acceso a contenido según nivel"
--   on content for select using (
--     auth.uid() is not null and (
--       nivel_acceso = 'all'
--       or (
--         nivel_acceso = 'premium'
--         and exists (
--           select 1 from profiles p
--           where p.user_id = auth.uid()
--             and p.is_premium = true
--             and p.aprobado = true
--         )
--       )
--       or exists (
--         select 1 from profiles p
--         where p.user_id = auth.uid()
--           and p.aprobado = true
--           and p.perfil_tipo::text = nivel_acceso::text
--       )
--     )
--   );

-- drop policy if exists "Solo admins modifican contenido" on content;

-- create policy "Solo admins modifican contenido"
--   on content for all using (
--     exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
--   );

-- create policy "Admins ven todo el contenido"
--   on content for select using (
--     exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
--   );
