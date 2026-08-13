-- ============================================================
-- Zentir — Página pública de retiro + inscripciones
-- Agrega precio/imagen de portada a retiros y crea la tabla
-- de inscripciones (usuario que se anota a un retiro).
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

alter table retiros add column if not exists precio numeric(10, 2);
alter table retiros add column if not exists imagen_portada text;

create table if not exists inscripciones (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  retiro_id  uuid not null references retiros(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, retiro_id)
);

alter table inscripciones enable row level security;

drop policy if exists "Usuarios ven sus propias inscripciones" on inscripciones;
create policy "Usuarios ven sus propias inscripciones"
  on inscripciones for select using (auth.uid() = user_id or is_admin());

drop policy if exists "Usuarios se inscriben a sí mismos" on inscripciones;
create policy "Usuarios se inscriben a sí mismos"
  on inscripciones for insert with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
