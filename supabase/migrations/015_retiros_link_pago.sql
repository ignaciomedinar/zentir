-- ============================================================
-- RETIROS: link de pago externo (WeTravel, etc)
-- ============================================================

alter table retiros add column if not exists link_pago text;

notify pgrst, 'reload schema';
