"use client";

import { useState } from "react";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Header } from "@/components/shared/header";
import { InscribirseButton } from "@/components/retiros/inscribirse-button";
import { formatDateRange, pickLocalized } from "@/lib/utils";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";

interface Retiro {
  id: string;
  nombre: string;
  nombre_en: string | null;
  descripcion: string | null;
  descripcion_en: string | null;
  descripcion_detallada: string | null;
  descripcion_detallada_en: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  lugar: string | null;
  lugar_en: string | null;
  precio: number | null;
  moneda: string;
  imagen_portada: string | null;
  link_pago: string | null;
}

interface RetiroDetailProps {
  user: { email?: string } | null;
  isAdmin: boolean;
  retiro: Retiro;
  initialLocale: Locale;
}

export function RetiroDetail({ user, isAdmin, retiro, initialLocale }: RetiroDetailProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = dictionaries[locale];

  function handleLocaleChange(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(next);
  }

  const nombre = pickLocalized(retiro.nombre, retiro.nombre_en, locale);
  const descripcion = pickLocalized(retiro.descripcion, retiro.descripcion_en, locale);
  const descripcionDetallada = pickLocalized(
    retiro.descripcion_detallada,
    retiro.descripcion_detallada_en,
    locale
  );
  const lugar = pickLocalized(retiro.lugar, retiro.lugar_en, locale);

  return (
    <div className="min-h-screen flex flex-col bg-zentir-clay text-white">
      <Header
        user={user}
        isAdmin={isAdmin}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        variant="dark"
      />

      <main className="flex-1">
        {retiro.imagen_portada && (
          <div className="w-full h-80 sm:h-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={retiro.imagen_portada}
              alt={nombre}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-200 mx-auto px-6 py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">{nombre}</h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/60 mb-8">
            {retiro.fecha_inicio && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zentir shrink-0" />
                {formatDateRange(retiro.fecha_inicio, retiro.fecha_fin, locale)}
              </span>
            )}
            {lugar && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zentir shrink-0" />
                {lugar}
              </span>
            )}
            {retiro.precio != null && (
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-zentir shrink-0" />
                {retiro.precio.toLocaleString(locale === "en" ? "en-US" : "es-MX")} {retiro.moneda}
              </span>
            )}
          </div>

          {descripcion && (
            <p className="text-lg text-white/90 leading-relaxed whitespace-pre-wrap mb-6">
              {descripcion}
            </p>
          )}

          {descripcionDetallada && (
            <p className="text-white/60 leading-relaxed whitespace-pre-wrap mb-10">
              {descripcionDetallada}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {retiro.link_pago ? (
              <a
                href={retiro.link_pago}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-zentir hover:bg-zentir/90 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
              >
                {t.retiroDetail.reservar}
              </a>
            ) : (
              <InscribirseButton retiroId={retiro.id} isSignedIn={!!user} locale={locale} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
