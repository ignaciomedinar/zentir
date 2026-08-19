import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { detectLocale } from "@/lib/i18n/locale";
import { RetiroDetail } from "@/components/retiros/retiro-detail";

export default async function RetiroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  const { data: retiro } = await supabase
    .from("retiros")
    .select(
      "id, nombre, nombre_en, descripcion, descripcion_en, descripcion_detallada, descripcion_detallada_en, fecha_inicio, fecha_fin, lugar, lugar_en, precio, moneda, imagen_portada, link_pago"
    )
    .eq("id", id)
    .single();

  if (!retiro) {
    notFound();
  }

  const initialLocale = await detectLocale();

  return <RetiroDetail user={user} isAdmin={isAdmin} retiro={retiro} initialLocale={initialLocale} />;
}
