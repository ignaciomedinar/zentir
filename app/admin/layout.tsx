import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, nombre")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/biblioteca");

  return <AdminShell profileName={profile.nombre}>{children}</AdminShell>;
}
