-- ============================================================
-- Zentir — Retiros: subir imagen de portada (en vez de URL),
-- descripción detallada separada de la breve, y moneda del precio
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

alter table retiros add column if not exists descripcion_detallada text;
alter table retiros add column if not exists moneda text not null default 'MXN';

-- ============================================================
-- STORAGE: bucket público para imágenes de portada de retiros
-- ============================================================
insert into storage.buckets (id, name, public)
values ('retiro-images', 'retiro-images', true)
on conflict (id) do nothing;

drop policy if exists "Admins suben imágenes de retiros" on storage.objects;
create policy "Admins suben imágenes de retiros"
  on storage.objects for insert with check (
    bucket_id = 'retiro-images' and is_admin()
  );

drop policy if exists "Admins borran imágenes de retiros" on storage.objects;
create policy "Admins borran imágenes de retiros"
  on storage.objects for delete using (
    bucket_id = 'retiro-images' and is_admin()
  );

drop policy if exists "Cualquiera puede ver imágenes de retiros" on storage.objects;
create policy "Cualquiera puede ver imágenes de retiros"
  on storage.objects for select using (
    bucket_id = 'retiro-images'
  );

notify pgrst, 'reload schema';
