-- ============================================================
-- Zentir — Simplificar perfiles y niveles de acceso
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 0. Eliminar políticas que referencian las columnas que vamos a alterar
--    (Postgres no permite alterar el tipo de columnas usadas en policies)
drop policy if exists "Usuarios autenticados ven contenido según nivel" on content;
drop policy if exists "Acceso a contenido según nivel" on content;

-- 1. Migrar profile_type: renombrar el viejo y crear el nuevo
alter type profile_type rename to profile_type_old;
create type profile_type as enum ('usuario', 'terapeuta');

-- 2. Actualizar la columna profiles.perfil_tipo al nuevo enum
--    (hay que quitar el default primero para que Postgres pueda castear el tipo)
alter table profiles alter column perfil_tipo drop default;

alter table profiles
  alter column perfil_tipo type profile_type
  using (
    case perfil_tipo::text
      when 'terapeuta'   then 'terapeuta'::profile_type
      when 'facilitador' then 'terapeuta'::profile_type
      else 'usuario'::profile_type
    end
  );

alter table profiles alter column perfil_tipo set default 'usuario'::profile_type;

-- Eliminar el enum viejo
drop type profile_type_old;

-- 3. Migrar access_level: renombrar el viejo y crear el nuevo
alter type access_level rename to access_level_old;
create type access_level as enum ('all', 'premium', 'terapeuta');

-- 4. Actualizar la columna content.nivel_acceso al nuevo enum
--    (hay que quitar el default primero para que Postgres pueda castear el tipo)
alter table content alter column nivel_acceso drop default;

alter table content
  alter column nivel_acceso type access_level
  using (
    case nivel_acceso::text
      when 'premium'     then 'premium'::access_level
      when 'terapeuta'   then 'terapeuta'::access_level
      when 'facilitador' then 'terapeuta'::access_level
      else 'all'::access_level
    end
  );

alter table content alter column nivel_acceso set default 'all'::access_level;

drop type access_level_old;

-- 5. Actualizar el trigger handle_new_user para usar el nuevo default
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, nombre, apellido, perfil_tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'apellido', ''),
    coalesce(
      case new.raw_user_meta_data->>'perfil_tipo'
        when 'terapeuta' then 'terapeuta'
        else 'usuario'
      end,
      'usuario'
    )::profile_type
  );
  return new;
end;
$$;

-- 6. Actualizar la política RLS de contenido para reflejar la nueva lógica:
--    all      → cualquier usuario autenticado
--    premium  → usuarios con is_premium = true, o terapeuta
--    terapeuta → solo perfil terapeuta
drop policy if exists "Usuarios autenticados ven contenido según nivel" on content;

create policy "Usuarios autenticados ven contenido según nivel"
  on content for select using (
    auth.uid() is not null and
    exists (
      select 1 from profiles p
      where p.user_id = auth.uid()
        and p.aprobado = true
        and (
          nivel_acceso = 'all'
          or (nivel_acceso = 'premium' and (p.is_premium = true or p.perfil_tipo = 'terapeuta'))
          or (nivel_acceso = 'terapeuta' and p.perfil_tipo = 'terapeuta')
        )
    )
  );
