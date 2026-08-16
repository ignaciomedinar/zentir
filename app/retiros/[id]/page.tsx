import { notFound } from "next/navigation";
import { Calendar, MapPin, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { InscribirseButton } from "@/components/retiros/inscribirse-button";

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
    .select("id, nombre, descripcion, descripcion_detallada, fecha_inicio, fecha_fin, lugar, precio, moneda, imagen_portada, link_pago")
    .eq("id", id)
    .single();

  if (!retiro) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-zentir-clay text-white">
      <Header user={user} isAdmin={isAdmin} variant="dark" />

      <main className="flex-1">
        {retiro.imagen_portada && (
          <div className="w-full h-80 sm:h-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={retiro.imagen_portada}
              alt={retiro.nombre}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-200 mx-auto px-6 py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">{retiro.nombre}</h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/60 mb-8">
            {retiro.fecha_inicio && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zentir shrink-0" />
                {new Date(retiro.fecha_inicio + "T00:00:00").toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {retiro.fecha_fin && (
                  <>
                    {" – "}
                    {new Date(retiro.fecha_fin + "T00:00:00").toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </>
                )}
              </span>
            )}
            {retiro.lugar && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zentir shrink-0" />
                {retiro.lugar}
              </span>
            )}
            {retiro.precio != null && (
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-zentir shrink-0" />
                {retiro.precio.toLocaleString("es-MX")} {retiro.moneda}
              </span>
            )}
          </div>

          {retiro.descripcion && (
            <p className="text-lg text-white/90 leading-relaxed whitespace-pre-wrap mb-6">
              {retiro.descripcion}
            </p>
          )}

          {retiro.descripcion_detallada && (
            <p className="text-white/60 leading-relaxed whitespace-pre-wrap mb-10">
              {retiro.descripcion_detallada}
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
                Reservar mi lugar
              </a>
            ) : (
              <InscribirseButton retiroId={retiro.id} isSignedIn={!!user} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
