import { createClient } from "@/lib/supabase/server";
import { UploadContentForm } from "@/components/admin/upload-content-form";
import { ContentTable } from "@/components/admin/content-table";

export default async function AdminContenidoPage() {
  const supabase = await createClient();

  const [{ data: contenido }, { data: categories }] = await Promise.all([
    supabase
      .from("content")
      .select("*, categories(nombre)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("nombre"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Contenido</h1>
        <p className="text-stone-500 mt-1">Sube y gestiona los archivos de la biblioteca</p>
      </div>

      <UploadContentForm categories={categories ?? []} />

      <div>
        <h2 className="text-lg font-medium text-stone-700 mb-4">Archivos subidos</h2>
        <ContentTable contenido={contenido ?? []} />
      </div>
    </div>
  );
}
