import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { StudioContentCard } from "@/components/shared/studio-content-card";
import { Sparkles } from "lucide-react";

export default async function EstudioPage() {
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

  const { data: contenido } = await supabase
    .from("studio_content")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen flex flex-col bg-zentir-clay text-white">
      <Header user={user} isAdmin={isAdmin} variant="dark" />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-zentir-warm font-medium mb-3">
              Zentir Studio
            </p>
            <h1 className="text-[2.2rem] font-semibold leading-tight">
              Prácticas, meditaciones y herramientas para volver a ti
            </h1>
          </div>

          {contenido?.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contenido.map((item) => (
                <StudioContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">
              <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-60" />
              <p className="text-lg">Todavía no hay contenido publicado.</p>
              <p className="text-sm mt-1">Vuelve pronto, se van sumando materiales.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
