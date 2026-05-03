import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Download, Mail } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalUsuarios },
    { count: totalContenido },
    { count: totalDescargas },
    { count: totalEmails },
    { data: usuariosRecientes },
    { data: descargasRecientes },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("content").select("*", { count: "exact", head: true }),
    supabase.from("downloads").select("*", { count: "exact", head: true }),
    supabase.from("email_logs").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("nombre, apellido, perfil_tipo, created_at")
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("downloads")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "Usuarios registrados", value: totalUsuarios ?? 0, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Archivos subidos", value: totalContenido ?? 0, icon: FileText, color: "text-green-600 bg-green-50" },
    { label: "Descargas totales", value: totalDescargas ?? 0, icon: Download, color: "text-purple-600 bg-purple-50" },
    { label: "Emails enviados", value: totalEmails ?? 0, icon: Mail, color: "text-orange-600 bg-orange-50" },
  ];

  const perfilLabels: Record<string, string> = {
    general: "General",
    curioso: "Curioso/a",
    terapeuta: "Terapeuta",
    facilitador: "Facilitador/a",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Dashboard</h1>
        <p className="text-stone-500 mt-1">Resumen de actividad de Zentir</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-800">{s.value}</p>
                  <p className="text-xs text-stone-500">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Usuarios recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usuarios recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {!usuariosRecientes?.length ? (
              <p className="text-sm text-stone-400">Sin usuarios todavía.</p>
            ) : (
              <div className="space-y-3">
                {usuariosRecientes.map((u, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-stone-700">{u.nombre} {u.apellido}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(u.created_at).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      {perfilLabels[u.perfil_tipo] ?? u.perfil_tipo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Descargas recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descargas recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {!descargasRecientes?.length ? (
              <p className="text-sm text-stone-400">Sin descargas todavía.</p>
            ) : (
              <div className="space-y-2">
                {descargasRecientes.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <p className="text-stone-500">Descarga registrada</p>
                    <span className="text-xs text-stone-400">
                      {new Date(d.created_at).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
