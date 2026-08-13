import { createClient } from "@/lib/supabase/server";
import { UploadContentForm } from "@/components/admin/upload-content-form";
import { ContentTable } from "@/components/admin/content-table";

export default async function AdminContenidoPage() {
  const supabase = await createClient();

  const [{ data: contenido }, { data: retiros }] = await Promise.all([
    supabase
      .from("content")
      .select("*, content_retiros(retiros(nombre))")
      .order("created_at", { ascending: false }),
    supabase.from("retiros").select("id, nombre").order("nombre"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Contenido</h1>
        <p className="text-stone-500 mt-1">Sube y gestiona los archivos de la biblioteca</p>
      </div>

      <UploadContentForm retiros={retiros ?? []} />

      <div>
        <h2 className="text-lg font-medium text-stone-700 mb-4">Archivos subidos</h2>
        <ContentTable contenido={contenido ?? []} />
      </div>
    </div>
  );
}
