import { createClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/admin/users-table";

export default async function AdminUsuariosPage() {
  const supabase = await createClient();

  const { data: usuarios } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Usuarios</h1>
        <p className="text-stone-500 mt-1">
          {usuarios?.length ?? 0} usuarios registrados
        </p>
      </div>
      <UsersTable usuarios={usuarios ?? []} />
    </div>
  );
}
