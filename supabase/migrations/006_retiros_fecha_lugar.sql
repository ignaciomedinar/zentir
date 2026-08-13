-- ============================================================
-- Zentir — Fecha y lugar de retiros (para la sección "Próximos
-- retiros" del landing) + acceso público de lectura
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

alter table retiros add column fecha date;
alter table retiros add column lugar text;

-- Un retiro con fecha se considera publicado: cualquiera (incluso
-- sin sesión) puede verlo para mostrarlo en el landing público.
create policy "Retiros con fecha son públicos"
  on retiros for select using (fecha is not null);
