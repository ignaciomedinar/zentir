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

  // Contenido filtrado (RLS controla acceso por nivel)
  let query = supabase
    .from("content")
    .select("*, categories(nombre, slug)")
    .order("created_at", { ascending: false });

  if (categoriaSlug) {
    const cat = categories?.find((c) => c.slug === categoriaSlug);
    if (cat) query = query.eq("categoria_id", cat.id);
  }

  const { data: contenido } = await query;

  const perfilLabels: Record<string, string> = {
    general: "Público general",
    curioso: "Curioso/a",
    terapeuta: "Terapeuta",
    facilitador: "Facilitador/a",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} isAdmin={profile.role === "admin"} />

      <main className="max-w-6xl mx-auto w-full px-4 py-10 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-stone-800">Mi biblioteca</h1>
          <div className="flex items-center gap-2">
            {profile.is_premium && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                ⭐ Premium
              </Badge>
            )}
            <Badge variant="secondary">
              {perfilLabels[profile.perfil_tipo] ?? profile.perfil_tipo}
            </Badge>
          </div>
        </div>
        <p className="text-stone-500 mb-8">
          Hola, {profile.nombre}. Aquí está el contenido disponible para vos.
        </p>

        {/* Filtro por categoría */}
        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Grid de contenido */}
        {!contenido || contenido.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg">Todavía no hay contenido disponible.</p>
            <p className="text-sm mt-1">Volvé pronto, se van sumando materiales.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contenido.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                userId={user.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
