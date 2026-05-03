import Image from "next/image";
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
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.jpeg"
          alt="Retiro Zentir"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-white/80 font-medium mb-4">
            Zentir
          </p>
          <h1 className="text-5xl md:text-[4.5rem] font-semibold leading-tight text-white mb-6">
            Un espacio para sentir,{" "}
            <span className="text-[#f0b49a]">sanar</span> y crecer
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed mb-8">
            Retiros de bienestar y movimiento para quienes buscan reconectar
            consigo mismas. Viví una experiencia que te transforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <ButtonLink
                href="/biblioteca"
                className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
              >
                Ir a mi biblioteca
              </ButtonLink>
            ) : (
              <>
                <ButtonLink
                  href="/register"
                  className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
                >
                  Quiero vivir esto
                </ButtonLink>
                <ButtonLink
                  href="/login"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur text-white border border-white/40 px-8 py-3.5 rounded-full text-sm font-medium transition-colors"
                >
                  Ya tengo cuenta
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p className="text-sm uppercase tracking-widest text-zentir font-medium">
            Qué es Zentir
          </p>
          <h2 className="text-[2.2rem] font-semibold leading-tight">
            Más que un retiro. Una experiencia que te cambia.
          </h2>
          <p className="text-[#737373] leading-relaxed text-lg">
            Zentir es un espacio de retiros de bienestar, movimiento y conexión.
            Cada experiencia está diseñada para que puedas soltar lo que ya no te sirve,
            encontrarte con vos misma y llevarte herramientas reales para tu vida cotidiana.
          </p>
        </div>
      </section>

      {/* Photo mosaic */}
      <section className="px-6 pb-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2 row-span-2 relative h-[480px] rounded-[12px] overflow-hidden">
            <Image src="/images/retreat-ocean.jpeg" alt="Retiro al atardecer" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative h-[234px] rounded-[12px] overflow-hidden">
            <Image src="/images/yoga-poolside.jpeg" alt="Yoga junto a la pileta" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative h-[234px] rounded-[12px] overflow-hidden">
            <Image src="/images/outdoor-yoga.jpeg" alt="Yoga al aire libre" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative h-[234px] rounded-[12px] overflow-hidden">
            <Image src="/images/joy-retreat.jpeg" alt="Alegría en el retiro" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative h-[234px] rounded-[12px] overflow-hidden">
            <Image src="/images/group-terrace.jpeg" alt="Grupo en terraza" fill className="object-cover object-top hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* What you'll experience */}
      <section className="py-24 px-6 border-t border-[#cdcdcd] mt-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-zentir font-medium mb-3">
              La experiencia
            </p>
            <h2 className="text-[2.2rem] font-semibold leading-tight">
              ¿Qué vivís en un retiro Zentir?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "/images/yoga-indoor.jpeg",
                alt: "Movimiento y yoga",
                title: "Movimiento y yoga",
                desc: "Clases guiadas para todos los niveles. Desde flow dinámico hasta prácticas restaurativas que calman el sistema nervioso.",
              },
              {
                img: "/images/beach-circle.jpeg",
                alt: "Comunidad y círculos",
                title: "Comunidad genuina",
                desc: "Círculos de mujeres, conversaciones profundas y vínculos que duran mucho más que el retiro.",
              },
              {
                img: "/images/guidance.jpeg",
                alt: "Guía personalizada",
                title: "Guía y herramientas",
                desc: "Meditaciones, journaling y prácticas de bienestar diseñadas para que te lleves algo real a tu vida diaria.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="relative h-72 rounded-[12px] overflow-hidden mb-5">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-semibold text-xl mb-2 group-hover:text-zentir transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#737373] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / Atmosphere */}
      <section className="relative py-32 px-6 overflow-hidden">
        <Image
          src="/images/sunset.jpeg"
          alt="Atardecer en retiro"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <p className="text-3xl md:text-4xl font-semibold leading-snug mb-6">
            "El retiro me dio permiso de parar, de sentir y de volver a ser yo."
          </p>
          <p className="text-white/70 text-sm uppercase tracking-widest">
            — Participante Zentir 2024
          </p>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[2rem] font-semibold">Momentos que quedaron</h2>
            <p className="text-[#737373] mt-2">Galería de experiencias Zentir</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { src: "/images/connection.jpeg", alt: "Conexión" },
              { src: "/images/meditation.jpeg", alt: "Meditación" },
              { src: "/images/group-desert.jpeg", alt: "Grupo en el desierto" },
              { src: "/images/sailboat.jpeg", alt: "Paseo en velero" },
              { src: "/images/community-collage.jpeg", alt: "Comunidad" },
              { src: "/images/journaling.jpeg", alt: "Journaling" },
              { src: "/images/group-pool.jpeg", alt: "Grupo en piscina" },
              { src: "/images/ice-bath.jpeg", alt: "Baño de hielo" },
            ].map((item) => (
              <div key={item.src} className="relative h-48 md:h-56 rounded-[10px] overflow-hidden group">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member area teaser */}
      <section className="py-20 px-6 bg-[#faf8f6] border-t border-[#cdcdcd]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-widest text-zentir font-medium">
              Zona de miembros
            </p>
            <h2 className="text-[2rem] font-semibold leading-tight">
              Seguí creciendo después del retiro
            </h2>
            <p className="text-[#737373] leading-relaxed">
              Como participante Zentir, accedés a nuestra biblioteca exclusiva:
              guías de meditación, materiales de retiro, ejercicios y recursos
              diseñados para acompañarte en tu camino diario.
            </p>
            <ul className="space-y-3 text-[#737373]">
              {[
                "Guías de meditación en PDF",
                "Materiales exclusivos de cada retiro",
                "Prácticas de movimiento y yoga",
                "Recursos de bienestar personalizados",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zentir flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {!user && (
              <ButtonLink
                href="/register"
                className="inline-flex bg-zentir hover:bg-zentir/90 text-white px-7 py-3 rounded-full text-sm font-medium"
              >
                Crear mi cuenta
              </ButtonLink>
            )}
          </div>
          <div className="relative h-[420px] rounded-[16px] overflow-hidden">
            <Image
              src="/images/aerial-yoga.png"
              alt="Comunidad Zentir"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-28 px-6 text-center border-t border-[#cdcdcd]">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-sm uppercase tracking-widest text-zentir font-medium">
            Próximos retiros
          </p>
          <h2 className="text-[2.5rem] font-semibold leading-tight">
            ¿Lista para vivir la experiencia?
          </h2>
          <p className="text-[#737373] text-lg leading-relaxed">
            Registrate gratis, accedé a los materiales exclusivos y enterate
            antes que nadie de los próximos retiros Zentir.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <ButtonLink
                href="/register"
                className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
              >
                Quiero ser parte
              </ButtonLink>
              <ButtonLink
                href="/login"
                className="border border-[#cdcdcd] text-black hover:text-zentir px-8 py-3.5 rounded-full text-sm font-medium transition-colors"
              >
                Ya tengo cuenta
              </ButtonLink>
            </div>
          ) : (
            <ButtonLink
              href="/biblioteca"
              className="inline-flex bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
            >
              Ir a mi biblioteca
            </ButtonLink>
          )}
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-[#737373] border-t border-[#cdcdcd]">
        <Image src="/images/logo.png" alt="Zentir" width={80} height={28} className="mx-auto mb-4 opacity-60" />
        <p>© {new Date().getFullYear()} Zentir. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
