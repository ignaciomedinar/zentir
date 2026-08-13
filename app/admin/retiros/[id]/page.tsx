import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UploadContentForm } from "@/components/admin/upload-content-form";
import { ContentTable } from "@/components/admin/content-table";
import { RetiroAccessTable } from "@/components/admin/retiro-access-table";
import { RetiroDetailsForm } from "@/components/admin/retiro-details-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminRetiroDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: retiro }, { data: contenido }, { data: usuarios }, { data: accesos }] =
    await Promise.all([
      supabase.from("retiros").select("*").eq("id", id).single(),
      supabase
        .from("content")
        .select("*, content_retiros!inner(retiro_id, retiros(nombre))")
        .eq("content_retiros.retiro_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("user_id, nombre, apellido, perfil_tipo")
        .eq("role", "user")
        .eq("aprobado", true)
        .order("nombre"),
      supabase.from("retiro_access").select("user_id").eq("retiro_id", id),
    ]);

  if (!retiro) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">{retiro.nombre}</h1>
        {retiro.descripcion && <p className="text-stone-500 mt-1">{retiro.descripcion}</p>}
      </div>

      <RetiroDetailsForm retiro={retiro} />

      <UploadContentForm retiros={[]} retiroId={retiro.id} />

      <div>
        <h2 className="text-lg font-medium text-stone-700 mb-4">Material de este retiro</h2>
        <ContentTable contenido={contenido ?? []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usuarios con acceso</CardTitle>
        </CardHeader>
        <CardContent>
          <RetiroAccessTable
            retiroId={retiro.id}
            usuarios={usuarios ?? []}
            accessUserIds={(accesos ?? []).map((a) => a.user_id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
