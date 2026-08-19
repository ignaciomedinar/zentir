-- ============================================================
-- RETIROS: contenido en inglés (opcional, con fallback al español)
-- ============================================================

alter table retiros add column if not exists nombre_en text;
alter table retiros add column if not exists descripcion_en text;
alter table retiros add column if not exists descripcion_detallada_en text;
alter table retiros add column if not exists lugar_en text;

notify pgrst, 'reload schema';
