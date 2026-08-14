-- ============================================================
-- STUDIO CONTENT: agregar tipo "video" (link a YouTube, etc)
-- ============================================================

alter table studio_content drop constraint if exists studio_content_content_type_check;
alter table studio_content add constraint studio_content_content_type_check check (
  content_type in ('documento', 'podcast', 'publicacion', 'video')
);

alter table studio_content drop constraint if exists studio_content_source;
alter table studio_content add constraint studio_content_source check (
  (content_type = 'documento' and file_url is not null and external_url is null) or
  (content_type in ('podcast', 'publicacion', 'video') and external_url is not null and file_url is null)
);

notify pgrst, 'reload schema';
