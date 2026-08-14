import { createClient } from "@/lib/supabase/server";
import { UploadStudioForm } from "@/components/admin/upload-studio-form";
import { StudioTable } from "@/components/admin/studio-table";

export default async function AdminEstudioPage() {
  const supabase = await createClient();

  const { data: contenido } = await supabase
    .from("studio_content")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Zentir Studio</h1>
        <p className="text-stone-500 mt-1">
          Podcasts, publicaciones y documentos públicos, visibles en la landing y en /estudio
        </p>
      </div>

      <UploadStudioForm />

      <div>
        <h2 className="text-lg font-medium text-stone-700 mb-4">Contenido publicado</h2>
        <StudioTable contenido={contenido ?? []} />
      </div>
    </div>
  );
}
