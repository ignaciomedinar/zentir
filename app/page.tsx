import { createClient } from "@/lib/supabase/server";
import { detectLocale } from "@/lib/i18n/locale";
import { LandingPage } from "@/components/landing/landing-page";

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

  const today = new Date().toISOString().slice(0, 10);
  const { data: proximosRetiros } = await supabase
    .from("retiros")
    .select("id, nombre, descripcion, fecha_inicio, fecha_fin, lugar")
    .not("fecha_inicio", "is", null)
    .gte("fecha_inicio", today)
    .order("fecha_inicio", { ascending: true });

  const initialLocale = await detectLocale();

  return (
    <LandingPage
      user={user}
      isAdmin={isAdmin}
      proximosRetiros={proximosRetiros ?? []}
      initialLocale={initialLocale}
    />
  );
}
