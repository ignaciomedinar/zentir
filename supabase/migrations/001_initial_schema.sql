-- ============================================================
-- Zentir — Schema inicial
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUM types
-- ============================================================
create type user_role as enum ('user', 'admin');
create type profile_type as enum ('general', 'curioso', 'terapeuta', 'facilitador');
create type access_level as enum ('all', 'general', 'curioso', 'terapeuta', 'facilitador');

-- ============================================================
-- PROFILES
-- ============================================================
create table profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  nombre      text not null,
  apellido    text not null,
  role        user_role not null default 'user',
  perfil_tipo profile_type not null default 'general',
  aprobado    boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id)
);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, nombre, apellido, perfil_tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'apellido', ''),
    coalesce((new.raw_user_meta_data->>'perfil_tipo')::profile_type, 'general')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Trigger: updated_at automático
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- ============================================================
-- CATEGORIES
-- ============================================================
create table categories (
  id         uuid primary key default uuid_generate_v4(),
  nombre     text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

-- Categorías iniciales
insert into categories (nombre, slug) values
  ('Meditación', 'meditacion'),
  ('Retiros', 'retiros'),
  ('Bienestar', 'bienestar'),
  ('Herramientas', 'herramientas'),
  ('General', 'general');

-- ============================================================
-- CONTENT
-- ============================================================
create table content (
  id           uuid primary key default uuid_generate_v4(),
  titulo       text not null,
  descripcion  text,
  file_url     text not null,
  file_name    text not null,
  file_size    bigint not null default 0,
  file_type    text not null,
  categoria_id uuid references categories(id) on delete set null,
  nivel_acceso access_level not null default 'all',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger content_updated_at
  before update on content
  for each row execute procedure update_updated_at();

-- ============================================================
-- DOWNLOADS (tracking)
-- ============================================================
create table downloads (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  content_id uuid not null references content(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- EMAIL LOGS
-- ============================================================
create table email_logs (
  id            uuid primary key default uuid_generate_v4(),
  asunto        text not null,
  cuerpo        text not null,
  destinatarios text not null,
  enviado_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
alter table profiles enable row level security;

create policy "Usuarios ven su propio perfil"
  on profiles for select using (auth.uid() = user_id);

create policy "Admins ven todos los perfiles"
  on profiles for select using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "Admins modifican perfiles"
  on profiles for update using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- content
alter table content enable row level security;

create policy "Usuarios autenticados ven contenido según nivel"
  on content for select using (
    auth.uid() is not null and (
      nivel_acceso = 'all'
      or exists (
        select 1 from profiles p
        where p.user_id = auth.uid()
          and p.aprobado = true
          and (nivel_acceso = 'all' or p.perfil_tipo::text = nivel_acceso::text)
      )
    )
  );

create policy "Solo admins modifican contenido"
  on content for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- categories
alter table categories enable row level security;

create policy "Todos ven categorías"
  on categories for select using (true);

create policy "Solo admins modifican categorías"
  on categories for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- downloads
alter table downloads enable row level security;

create policy "Usuarios ven sus propias descargas"
  on downloads for select using (auth.uid() = user_id);

create policy "Usuarios insertan sus descargas"
  on downloads for insert with check (auth.uid() = user_id);

create policy "Admins ven todas las descargas"
  on downloads for select using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- email_logs
alter table email_logs enable row level security;

create policy "Solo admins ven logs de email"
  on email_logs for all using (
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- ============================================================
-- STORAGE: bucket para archivos de contenido
-- ============================================================
insert into storage.buckets (id, name, public)
values ('content-files', 'content-files', false);

create policy "Admins pueden subir archivos"
  on storage.objects for insert with check (
    bucket_id = 'content-files' and
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "Admins pueden borrar archivos"
  on storage.objects for delete using (
    bucket_id = 'content-files' and
    exists (select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "Usuarios autenticados pueden descargar"
  on storage.objects for select using (
    bucket_id = 'content-files' and auth.uid() is not null
  );
