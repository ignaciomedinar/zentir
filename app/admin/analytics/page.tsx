import { getAnalyticsSummary } from "@/lib/analytics/ga";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, BarChart3 } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const summary = await getAnalyticsSummary(30);
  const maxDaily = Math.max(1, ...summary.daily.map((d) => d.visitors));
  const maxCountry = Math.max(1, ...summary.byCountry.map((c) => c.visitors));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Visitantes</h1>
        <p className="text-stone-500 mt-1">Datos de Google Analytics, últimos 30 días</p>
      </div>

      {!summary.configured ? (
        <Card>
          <CardContent className="py-10 text-center text-stone-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="font-medium text-stone-700">Google Analytics todavía no está conectado</p>
            <p className="text-sm mt-1 max-w-md mx-auto">
              Falta configurar las credenciales de Google Analytics para que esta sección muestre datos reales.
            </p>
          </CardContent>
        </Card>
      ) : summary.error ? (
        <Card>
          <CardContent className="py-10 text-center text-stone-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="font-medium text-stone-700">No se pudo consultar Google Analytics</p>
            <p className="text-sm mt-1 max-w-md mx-auto">{summary.error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visitantes por día</CardTitle>
            </CardHeader>
            <CardContent>
              {!summary.daily.length ? (
                <p className="text-sm text-stone-400">Sin datos todavía.</p>
              ) : (
                <div className="flex items-end gap-1 h-40 overflow-x-auto">
                  {summary.daily.map((d) => (
                    <div key={d.date} className="flex flex-col items-center gap-1 shrink-0" title={`${d.date}: ${d.visitors}`}>
                      <div
                        className="w-3 bg-zentir/70 rounded-t"
                        style={{ height: `${Math.max(4, (d.visitors / maxDaily) * 130)}px` }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-stone-400 mt-2">
                Pasa el cursor sobre cada barra para ver la fecha y el número de visitantes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> Visitantes por país
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!summary.byCountry.length ? (
                <p className="text-sm text-stone-400">Sin datos todavía.</p>
              ) : (
                <div className="space-y-3">
                  {summary.byCountry.map((c) => (
                    <div key={c.country} className="flex items-center gap-3">
                      <span className="text-sm text-stone-600 w-32 shrink-0 truncate">{c.country}</span>
                      <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-zentir h-full rounded-full"
                          style={{ width: `${(c.visitors / maxCountry) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-stone-500 w-10 text-right shrink-0">{c.visitors}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
