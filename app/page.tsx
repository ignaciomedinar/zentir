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
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header user={user} isAdmin={isAdmin} />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-sm uppercase tracking-widest text-[#737373] font-medium">
            Zentir
          </p>
          <h1 className="text-5xl md:text-[4rem] font-semibold leading-tight tracking-[-0.03em]">
            Un espacio para{" "}
            <span className="text-zentir">sentir, sanar</span>
            {" "}y crecer
          </h1>
          <p className="text-lg text-[#737373] max-w-xl mx-auto leading-relaxed">
            Retiros, meditación y prácticas de bienestar para quienes buscan
            reconectar consigo mismos. Accedé a materiales exclusivos diseñados
            para tu camino.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {user ? (
              <ButtonLink href="/biblioteca" className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3 rounded-full text-sm font-medium">
                Ir a mi biblioteca
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/register" className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3 rounded-full text-sm font-medium">
                  Comenzar ahora
                </ButtonLink>
                <ButtonLink href="/login" className="border border-[#cdcdcd] text-black hover:text-zentir px-8 py-3 rounded-full text-sm font-medium transition-colors">
                  Ya tengo cuenta
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-[#cdcdcd]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2rem] font-semibold tracking-[-0.03em] text-center mb-16">
            ¿Qué encontrás en Zentir?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Guías de meditación",
                desc: "PDFs y presentaciones con prácticas guiadas para distintos niveles y necesidades.",
              },
              {
                title: "Materiales de retiro",
                desc: "Recursos exclusivos de nuestros retiros: ejercicios, reflexiones y herramientas prácticas.",
              },
              {
                title: "Contenido personalizado",
                desc: "El material que ves está adaptado a tu perfil: quién sos y qué buscás.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-[8px] border border-[#cdcdcd] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-zentir/10 mb-6" />
                <h3 className="font-semibold text-xl mb-3 tracking-[-0.03em] group-hover:text-zentir transition-colors">
                  {f.title}
                </h3>
                <p className="text-[#737373] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center border-t border-[#cdcdcd]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-[2rem] font-semibold tracking-[-0.03em]">
            Empezá tu camino hoy
          </h2>
          <p className="text-[#737373] leading-relaxed">
            Registrate gratis y accedé a contenido diseñado para tu bienestar.
          </p>
          {!user && (
            <ButtonLink
              href="/register"
              className="inline-flex bg-zentir hover:bg-zentir/90 text-white px-8 py-3 rounded-full text-sm font-medium mt-4"
            >
              Crear cuenta gratuita
            </ButtonLink>
          )}
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-[#737373] border-t border-[#cdcdcd]">
        <p>© {new Date().getFullYear()} Zentir. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
