import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend/send-email";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: retiroId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: retiro } = await supabase
    .from("retiros")
    .select("id, nombre")
    .eq("id", retiroId)
    .single();

  if (!retiro) {
    return NextResponse.json({ error: "Retiro no encontrado" }, { status: 404 });
  }

  const { data: existente } = await supabase
    .from("inscripciones")
    .select("id")
    .eq("user_id", user.id)
    .eq("retiro_id", retiroId)
    .maybeSingle();

  if (existente) {
    return NextResponse.json({ ok: true, yaInscrito: true });
  }

  const { error } = await supabase.from("inscripciones").insert({
    user_id: user.id,
    retiro_id: retiroId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, apellido")
    .eq("user_id", user.id)
    .single();

  const adminClient = await createAdminClient();
  const { data: admins } = await adminClient
    .from("profiles")
    .select("user_id")
    .eq("role", "admin");

  const adminEmails: string[] = [];
  for (const admin of admins ?? []) {
    const { data } = await adminClient.auth.admin.getUserById(admin.user_id);
    if (data.user?.email) adminEmails.push(data.user.email);
  }

  if (adminEmails.length) {
    const nombreCompleto = profile ? `${profile.nombre} ${profile.apellido}`.trim() : "";
    await sendEmail({
      to: adminEmails,
      subject: `Nueva inscripción: ${retiro.nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 24px; color: #1c1917; margin-bottom: 16px;">Zentir</h1>
          <p style="color: #44403c; line-height: 1.7;">
            <strong>${nombreCompleto || user.email}</strong> (${user.email}) se inscribió al retiro
            <strong>${retiro.nombre}</strong>.
          </p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true, yaInscrito: false });
}
