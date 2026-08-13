import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend/send-email";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { destinatarios, asunto, cuerpo } = await request.json();

  if (!asunto || !cuerpo) {
    return NextResponse.json({ error: "Asunto y cuerpo son requeridos" }, { status: 400 });
  }

  // Obtener emails según filtro
  const adminClient = await createAdminClient();
  let profilesQuery = adminClient
    .from("profiles")
    .select("user_id, nombre")
    .eq("aprobado", true)
    .eq("role", "user");

  if (destinatarios !== "todos") {
    profilesQuery = profilesQuery.eq("perfil_tipo", destinatarios);
  }

  const { data: profiles } = await profilesQuery;

  if (!profiles?.length) {
    return NextResponse.json({ error: "No hay usuarios en ese grupo" }, { status: 400 });
  }

  // Obtener emails de auth.users via admin API
  const userIds = profiles.map((p) => p.user_id);
  const emails: string[] = [];

  for (const uid of userIds) {
    const { data } = await adminClient.auth.admin.getUserById(uid);
    if (data.user?.email) emails.push(data.user.email);
  }

  if (!emails.length) {
    return NextResponse.json({ error: "No se encontraron emails" }, { status: 400 });
  }

  // HTML del email
  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 24px; color: #1c1917; margin-bottom: 16px;">Zentir</h1>
      <div style="color: #44403c; line-height: 1.7; white-space: pre-wrap;">${cuerpo.replace(/\n/g, "<br>")}</div>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e7e5e4;" />
      <p style="font-size: 12px; color: #a8a29e;">Este correo fue enviado desde Zentir. Si no quieres recibirlos, contáctanos.</p>
    </div>
  `;

  // Enviar en batch (Resend permite hasta 50 destinatarios por llamada)
  const batchSize = 50;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    await sendEmail({ to: batch, subject: asunto, html: htmlBody });
  }

  // Registrar en logs
  const destinatariosLabel = destinatarios === "todos"
    ? "Todos los usuarios"
    : `Perfil: ${destinatarios}`;

  await adminClient.from("email_logs").insert({
    asunto,
    cuerpo,
    destinatarios: `${destinatariosLabel} (${emails.length} emails)`,
  });

  return NextResponse.json({ ok: true, count: emails.length });
}
