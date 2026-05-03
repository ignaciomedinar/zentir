import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { ButtonLink } from "@/components/ui/button-link";

export default async function HomePage() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} isAdmin={isAdmin} />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-linear-to-b from-stone-100 to-stone-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-sm uppercase tracking-widest text-stone-500 font-medium">Zentir</p>
          <h1 className="text-4xl md:text-6xl font-light text-stone-800 leading-tight">
            Un espacio para
            <span className="font-semibold"> sentir, sanar</span> y crecer
          </h1>
          <p className="text-lg text-stone-500 max-w-xl mx-auto">
            Retiros, meditación y prácticas de bienestar para quienes buscan reconectar consigo mismos.
            Accedé a materiales exclusivos diseñados para tu camino.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {user ? (
              <ButtonLink size="lg" href="/biblioteca">Ir a mi biblioteca</ButtonLink>
            ) : (
              <>
                <ButtonLink size="lg" href="/register">Comenzar ahora</ButtonLink>
                <ButtonLink size="lg" variant="outline" href="/login">Ya tengo cuenta</ButtonLink>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-stone-800 text-center mb-12">
            ¿Qué encontrás en Zentir?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧘",
                title: "Guías de meditación",
                desc: "PDFs y presentaciones con prácticas guiadas para distintos niveles y necesidades.",
              },
              {
                icon: "🌿",
                title: "Materiales de retiro",
                desc: "Recursos exclusivos de nuestros retiros: ejercicios, reflexiones y herramientas prácticas.",
              },
              {
                icon: "✨",
                title: "Contenido personalizado",
                desc: "El material que ves está adaptado a tu perfil: quién sos y qué buscás.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center space-y-3 p-6 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="text-4xl">{f.icon}</div>
                <h3 className="font-semibold text-stone-800">{f.title}</h3>
                <p className="text-stone-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-stone-800 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-light">Empezá tu camino hoy</h2>
          <p className="text-stone-300">
            Registrate gratis y accedé a contenido diseñado para tu bienestar.
          </p>
          {!user && (
            <ButtonLink size="lg" variant="secondary" href="/register" className="mt-4">
              Crear cuenta gratuita
            </ButtonLink>
          )}
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-stone-400 border-t border-stone-200 bg-white">
        <p>© {new Date().getFullYear()} Zentir. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
