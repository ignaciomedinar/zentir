-- ============================================================
-- Zentir — Arreglar recursión infinita en políticas de profiles
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Función security definer: evita que la política de profiles
-- se vuelva a consultar a sí misma (causa de la recursión infinita)
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Reemplazar las políticas de profiles para usar la función
drop policy if exists "Admins ven todos los perfiles" on profiles;
drop policy if exists "Admins modifican perfiles" on profiles;

create policy "Admins ven todos los perfiles"
  on profiles for select using (is_admin());

create policy "Admins modifican perfiles"
  on profiles for update using (is_admin());
