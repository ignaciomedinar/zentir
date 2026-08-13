import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RetiroForm } from "@/components/admin/retiro-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palmtree, ChevronRight, Calendar, MapPin } from "lucide-react";

export default async function AdminRetirosPage() {
  const supabase = await createClient();

  const { data: retiros } = await supabase
    .from("retiros")
    .select("*, content(count), retiro_access(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Retiros</h1>
        <p className="text-stone-500 mt-1">Crea retiros, sube material y da acceso a usuarios específicos</p>
      </div>

      <RetiroForm />

      <div>
        <h2 className="text-lg font-medium text-stone-700 mb-4">Retiros creados</h2>
        {!retiros?.length ? (
          <div className="text-center py-12 text-stone-400 border rounded-lg bg-white">
            <Palmtree className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No hay retiros creados todavía.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {retiros.map((r) => (
              <Link key={r.id} href={`/admin/retiros/${r.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{r.nombre}</CardTitle>
                      <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 mt-1" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1">
                    {r.descripcion && (
                      <p className="text-sm text-stone-500 line-clamp-2">{r.descripcion}</p>
                    )}
                    {(r.fecha || r.lugar) && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                        {r.fecha && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(r.fecha + "T00:00:00").toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        {r.lugar && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {r.lugar}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-4 text-xs text-stone-400 pt-2">
                      <span>{(r.content as { count: number }[])[0]?.count ?? 0} archivos</span>
                      <span>{(r.retiro_access as { count: number }[])[0]?.count ?? 0} con acceso</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
