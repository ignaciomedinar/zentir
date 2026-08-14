import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { ContentCard } from "@/components/shared/content-card";

export default async function BibliotecaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Todo el contenido al que el usuario tiene acceso (RLS ya filtra
  // por retiro_access / nivel_acceso / rol), con los retiros a los que
  // está asignado cada archivo.
  const { data: contenido } = await supabase
    .from("content")
    .select("*, content_retiros(retiro_id, retiros(id, nombre, descripcion))")
    .order("created_at", { ascending: false });

  const contenidoGeneral = (contenido ?? []).filter((item) => !item.content_retiros?.length);

  const retirosMap = new Map<string, { id: string; nombre: string; descripcion: string | null; items: typeof contenido }>();
  for (const item of contenido ?? []) {
    for (const cr of item.content_retiros ?? []) {
      if (!cr.retiros) continue;
      if (!retirosMap.has(cr.retiros.id)) {
        retirosMap.set(cr.retiros.id, { ...cr.retiros, items: [] });
      }
      retirosMap.get(cr.retiros.id)!.items!.push(item);
    }
  }

  const perfilLabels: Record<string, string> = {
    usuario: "Usuario",
    terapeuta: "Terapeuta Zentir",
  };

  const sinContenido = !contenido?.length;

  return (
    <div className="min-h-screen flex flex-col bg-zentir-clay text-white">
      <Header user={user} isAdmin={profile.role === "admin"} variant="dark" />

      <main className="max-w-250 mx-auto w-full px-6 py-14 flex-1">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h1 className="text-3xl font-semibold">Mi biblioteca</h1>
          <span className="text-xs uppercase tracking-widest text-zentir font-medium bg-zentir/15 rounded-full px-3 py-1.5 shrink-0">
            {perfilLabels[profile.perfil_tipo] ?? profile.perfil_tipo}
          </span>
        </div>
        <p className="text-white/60 mb-12">
          Hola, {profile.nombre}. Aquí está el contenido disponible para ti.
        </p>

        {sinContenido ? (
          <div className="text-center py-20 text-white/40">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg">Todavía no hay contenido disponible.</p>
            <p className="text-sm mt-1">Vuelve pronto, se van sumando materiales.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {/* Material general */}
            {!!contenidoGeneral.length && (
              <section>
                <h2 className="text-lg font-semibold mb-5">General</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contenidoGeneral.map((item) => (
                    <ContentCard key={item.id} item={item} userId={user.id} />
                  ))}
                </div>
              </section>
            )}

            {/* Material por retiro */}
            {Array.from(retirosMap.values()).map((retiro) => (
              <section key={retiro.id}>
                <h2 className="text-lg font-semibold mb-1">{retiro.nombre}</h2>
                {retiro.descripcion && (
                  <p className="text-sm text-white/60 mb-5">{retiro.descripcion}</p>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {retiro.items!.map((item) => (
                    <ContentCard key={item.id} item={item} userId={user.id} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
