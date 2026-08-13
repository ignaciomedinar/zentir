-- ============================================================
-- Zentir — Arreglar handle_new_user: faltaba search_path
-- El trigger fallaba con "type profile_type does not exist" porque
-- al dispararse desde auth.users, el search_path activo no incluye
-- public, y profile_type/profiles no estaban schema-qualified.
-- Esto rompía TODO registro nuevo (signup normal y creación vía
-- Admin API por igual).
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
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
