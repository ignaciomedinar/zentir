"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/shared/header";
import { ButtonLink } from "@/components/ui/button-link";
import { StudioContentCard } from "@/components/shared/studio-content-card";
import { Calendar, MapPin, Star } from "lucide-react";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";
import type { StudioContentType } from "@/lib/types/database";

interface Retiro {
  id: string;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  lugar: string | null;
}

interface StudioItem {
  id: string;
  titulo: string;
  descripcion: string | null;
  content_type: StudioContentType;
  external_url: string | null;
  file_url: string | null;
}

interface LandingPageProps {
  user: { email?: string } | null;
  isAdmin: boolean;
  proximosRetiros: Retiro[];
  studioContent: StudioItem[];
  initialLocale: Locale;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function LandingPage({ user, isAdmin, proximosRetiros, studioContent, initialLocale }: LandingPageProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = dictionaries[locale];

  function handleLocaleChange(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(next);
  }

  return (
    <div className="min-h-screen flex flex-col bg-zentir-clay text-white">
      <Header
        user={user}
        isAdmin={isAdmin}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        variant="dark"
      />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-125 sm:h-[90vh] sm:min-h-150 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.jpeg"
          alt="Retiro Zentir"
          fill
          priority
          className="object-cover object-[center_60%] sm:object-[center_75%]"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-[4.5rem] font-semibold leading-tight text-white mb-10">
            {t.hero.titlePre}
            <span className="text-zentir">{t.hero.titleHighlight}</span>
            {t.hero.titlePost}
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <ButtonLink
                href="/biblioteca"
                className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
              >
                {t.hero.ctaLibrary}
              </ButtonLink>
            ) : (
              <>
                <ButtonLink
                  href="/register"
                  className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
                >
                  {t.hero.ctaRegister}
                </ButtonLink>
                <ButtonLink
                  href="/login"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur text-white border border-white/40 px-8 py-3.5 rounded-full text-sm font-medium transition-colors"
                >
                  {t.hero.ctaLogin}
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p className="text-sm uppercase tracking-widest text-zentir-warm font-medium">
            {t.intro.eyebrow}
          </p>
          <h2 className="text-[2.2rem] font-bold leading-tight">{t.intro.title}</h2>
          <p className="text-lg font-semibold text-white/90 pt-2">{t.intro.subheading}</p>
          <p className="text-white/60 leading-relaxed text-lg">{t.intro.paragraph}</p>
          <p className="text-xs uppercase tracking-widest text-zentir-warm pt-2">{t.intro.tags}</p>
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

      {/* Próximos retiros */}
      {!!proximosRetiros?.length && (
        <section className="py-24 px-6">
          <div className="max-w-250 mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-[2.2rem] font-semibold leading-tight uppercase tracking-wide">
                {t.proximosRetiros.title}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {proximosRetiros.map((r) => (
                <div
                  key={r.id}
                  className="rounded-[12px] border border-[#e5e0da] bg-[#faf8f6] p-7 flex flex-col gap-3"
                >
                  <h3 className="text-xl font-semibold text-black">{r.nombre}</h3>
                  <div className="flex flex-col gap-1.5 text-[#737373]">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zentir shrink-0" />
                      {new Date(r.fecha_inicio + "T00:00:00").toLocaleDateString(
                        t.proximosRetiros.dateLocale,
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                      {r.fecha_fin && (
                        <>
                          {" – "}
                          {new Date(r.fecha_fin + "T00:00:00").toLocaleDateString(
                            t.proximosRetiros.dateLocale,
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </>
                      )}
                    </span>
                    {r.lugar && (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-zentir shrink-0" />
                        {r.lugar}
                      </span>
                    )}
                  </div>
                  {r.descripcion && (
                    <p className="text-[#737373] leading-relaxed">{r.descripcion}</p>
                  )}
                  <ButtonLink
                    href={`/retiros/${r.id}`}
                    className="inline-flex self-start mt-2 bg-zentir hover:bg-zentir/90 text-white px-6 py-2.5 rounded-full text-sm font-medium"
                  >
                    {t.proximosRetiros.verMas}
                  </ButtonLink>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What you'll experience */}
      <section className="py-24 px-6 border-t border-white/10 mt-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[2.2rem] font-semibold leading-tight">{t.experience.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: "/images/yoga-indoor.jpeg", alt: "Movimiento y yoga" },
              { img: "/images/beach-circle.jpeg", alt: "Comunidad y círculos" },
              { img: "/images/guidance.jpeg", alt: "Guía personalizada" },
            ].map((item, i) => (
              <div key={item.img} className="group">
                <div className="relative h-72 rounded-[12px] overflow-hidden mb-5">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-semibold text-xl mb-2 group-hover:text-zentir-warm transition-colors">
                  {t.experience.items[i].title}
                </h3>
                <p className="text-white/60 leading-relaxed">{t.experience.items[i].desc}</p>
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
            &ldquo;{t.quote.text}&rdquo;
          </p>
          <p className="text-white/70 text-sm uppercase tracking-widest">{t.quote.attribution}</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/10 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold tracking-[-0.03em] text-black">{t.testimonials.title}</h2>
            <p className="text-xl text-[#737373] max-w-3xl mx-auto mt-6">{t.testimonials.subtitle}</p>
          </div>
        </div>
        <div className="relative" style={{ height: 280 }}>
          <div className="absolute left-0 top-0 w-32 h-full bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-32 h-full bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="relative h-full overflow-hidden flex items-center">
            <div className="flex items-center h-full gap-5 testimonials-track">
              {[...t.testimonials.items, ...t.testimonials.items].map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="shrink-0 bg-white border border-[#cdcdcd] shadow-sm rounded-2xl p-6"
                  style={{ width: 325, minWidth: 325 }}
                >
                  {!!item.rating && (
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: item.rating }).map((_, r) => (
                        <Star key={r} className="w-4 h-4 fill-[#9a9a9a] text-[#9a9a9a]" />
                      ))}
                    </div>
                  )}
                  <p className="text-black text-sm mb-4 leading-relaxed">{item.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zentir/15 text-zentir flex items-center justify-center text-sm font-semibold shrink-0">
                      {initials(item.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-black">{item.name}</p>
                      {item.role && <p className="text-xs text-[#737373]">{item.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[2rem] font-semibold">{t.gallery.title}</h2>
            <p className="text-white/60 mt-2">{t.gallery.subtitle}</p>
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

      {/* Zentir Studio teaser */}
      <section className="py-20 px-6 bg-[#faf8f6] border-t border-white/10">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-black">
            <p className="text-sm uppercase tracking-widest text-zentir font-medium">
              {t.memberTeaser.eyebrow}
            </p>
            <h2 className="text-[2rem] font-semibold leading-tight">{t.memberTeaser.title}</h2>
            <p className="text-[#737373] leading-relaxed">{t.memberTeaser.paragraph}</p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <ButtonLink
                  href="/register"
                  className="inline-flex bg-zentir hover:bg-zentir/90 text-white px-7 py-3 rounded-full text-sm font-medium"
                >
                  {t.memberTeaser.ctaPrimary}
                </ButtonLink>
                <ButtonLink
                  href="/login"
                  variant="ghost"
                  className="inline-flex border bg-transparent border-black/20 text-black hover:bg-black/5 hover:text-zentir hover:border-zentir/40 px-7 py-3 rounded-full text-sm font-medium transition-colors"
                >
                  {t.memberTeaser.ctaSecondary}
                </ButtonLink>
              </div>
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

        {!!studioContent.length && (
          <div className="max-w-[1200px] mx-auto mt-14">
            <div className="flex flex-wrap justify-center gap-6">
              {studioContent.map((item) => (
                <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-90">
                  <StudioContentCard item={item} />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <ButtonLink
                href="/estudio"
                variant="ghost"
                className="inline-flex border bg-transparent border-black/20 text-black hover:bg-black/5 hover:text-zentir hover:border-zentir/40 px-7 py-3 rounded-full text-sm font-medium transition-colors"
              >
                {t.memberTeaser.ctaVerMas}
              </ButtonLink>
            </div>
          </div>
        )}
      </section>

      {/* CTA final */}
      <section className="py-28 px-6 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-sm uppercase tracking-widest text-zentir-warm font-medium">
            {t.ctaFinal.eyebrow}
          </p>
          <h2 className="text-[2.5rem] font-semibold leading-tight">{t.ctaFinal.title}</h2>
          <p className="text-white/60 text-lg leading-relaxed">{t.ctaFinal.paragraph}</p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <ButtonLink
                href="/register"
                className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
              >
                {t.ctaFinal.ctaJoin}
              </ButtonLink>
              <ButtonLink
                variant="ghost"
                href="/login"
                className="border bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-zentir-warm hover:border-zentir-warm/60 px-8 py-3.5 rounded-full text-sm font-medium transition-colors"
              >
                {t.ctaFinal.ctaLogin}
              </ButtonLink>
            </div>
          ) : (
            <ButtonLink
              href="/biblioteca"
              className="inline-flex bg-zentir hover:bg-zentir/90 text-white px-8 py-3.5 rounded-full text-sm font-medium"
            >
              {t.ctaFinal.ctaLibrary}
            </ButtonLink>
          )}
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-white/50 border-t border-white/10">
        <Image
          src="/images/logo.png"
          alt="Zentir"
          width={80}
          height={28}
          className="mx-auto mb-4 opacity-60 brightness-0 invert"
        />
        <p suppressHydrationWarning>© {new Date().getFullYear()} Zentir. {t.footer.rights}</p>
        <p className="mt-2">
          {t.footer.contact}{" "}
          <a href="mailto:hola@venazentir.com" className="text-zentir-warm hover:underline">
            hola@venazentir.com
          </a>
        </p>
      </footer>
    </div>
  );
}
