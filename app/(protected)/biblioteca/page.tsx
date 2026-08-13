import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { ContentCard } from "@/components/shared/content-card";
import { Badge } from "@/components/ui/badge";

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const params = await searchParams;
  const categoriaSlug = params.categoria;

  // Categorías disponibles
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("nombre");

  // Contenido general (sin retiro), filtrado por categoría
  let query = supabase
    .from("content")
    .select("*, categories(nombre, slug)")
    .is("retiro_id", null)
    .order("created_at", { ascending: false });

  if (categoriaSlug) {
    const cat = categories?.find((c) => c.slug === categoriaSlug);
    if (cat) query = query.eq("categoria_id", cat.id);
  }

  const { data: contenidoGeneral } = await query;

  // Retiros a los que el usuario tiene acceso, con su material
  const { data: retiros } = await supabase
    .from("retiros")
    .select("*, content(*, categories(nombre, slug))")
    .order("created_at", { ascending: false });

  const perfilLabels: Record<string, string> = {
    usuario: "Usuario",
    terapeuta: "Terapeuta Zentir",
  };

  const sinContenido = !contenidoGeneral?.length && !retiros?.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} isAdmin={profile.role === "admin"} />

      <main className="max-w-6xl mx-auto w-full px-4 py-10 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-stone-800">Mi biblioteca</h1>
          <Badge variant="secondary">
            {perfilLabels[profile.perfil_tipo] ?? profile.perfil_tipo}
          </Badge>
        </div>
        <p className="text-stone-500 mb-8">
          Hola, {profile.nombre}. Aquí está el contenido disponible para ti.
        </p>

        {sinContenido ? (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg">Todavía no hay contenido disponible.</p>
            <p className="text-sm mt-1">Vuelve pronto, se van sumando materiales.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Material general */}
            <section>
              <div className="flex flex-wrap gap-2 mb-6">
                <a
                  href="/biblioteca"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    !categoriaSlug
                      ? "bg-stone-800 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Todos
                </a>
                {categories?.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/biblioteca?categoria=${cat.slug}`}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      categoriaSlug === cat.slug
                        ? "bg-stone-800 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat.nombre}
                  </a>
                ))}
              </div>

              {!contenidoGeneral?.length ? (
                <p className="text-sm text-stone-400">No hay material general todavía.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contenidoGeneral.map((item) => (
                    <ContentCard key={item.id} item={item} userId={user.id} />
                  ))}
                </div>
              )}
            </section>

            {/* Material por retiro */}
            {retiros?.map((retiro) => {
              const itemsRetiro = retiro.content ?? [];
              if (!itemsRetiro.length) return null;
              return (
                <section key={retiro.id}>
                  <h2 className="text-lg font-semibold text-stone-800 mb-1">{retiro.nombre}</h2>
                  {retiro.descripcion && (
                    <p className="text-sm text-stone-500 mb-4">{retiro.descripcion}</p>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsRetiro.map((item) => (
                      <ContentCard key={item.id} item={item} userId={user.id} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
