import { createClient } from "@/lib/supabase/server";
import { EmailComposer } from "@/components/admin/email-composer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminEmailsPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("email_logs")
    .select("*")
    .order("enviado_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Emails</h1>
        <p className="text-stone-500 mt-1">Enviá mensajes a tus usuarios</p>
      </div>

      <EmailComposer />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emails enviados</CardTitle>
        </CardHeader>
        <CardContent>
          {!logs?.length ? (
            <p className="text-sm text-stone-400">Sin emails enviados todavía.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium text-stone-700">{log.asunto}</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Para: {log.destinatarios}
                      </p>
                    </div>
                    <span className="text-xs text-stone-400 shrink-0">
                      {new Date(log.enviado_at).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
