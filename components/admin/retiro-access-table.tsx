"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserRow {
  user_id: string;
  nombre: string;
  apellido: string;
  perfil_tipo: string;
}

export function RetiroAccessTable({
  retiroId,
  usuarios,
  accessUserIds,
}: {
  retiroId: string;
  usuarios: UserRow[];
  accessUserIds: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const accessSet = new Set(accessUserIds);

  async function toggleAccess(userId: string, hasAccess: boolean) {
    setLoading(userId);
    const supabase = createClient();

    const { error } = hasAccess
      ? await supabase.from("retiro_access").delete().eq("user_id", userId).eq("retiro_id", retiroId)
      : await supabase.from("retiro_access").insert({ user_id: userId, retiro_id: retiroId });

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success(hasAccess ? "Acceso quitado" : "Acceso otorgado");
      router.refresh();
    }
    setLoading(null);
  }

  if (!usuarios.length) {
    return <p className="text-sm text-stone-400 py-4">No hay usuarios registrados todavía.</p>;
  }

  return (
    <div className="divide-y">
      {usuarios.map((u) => {
        const hasAccess = accessSet.has(u.user_id);
        const isTerapeuta = u.perfil_tipo === "terapeuta";
        return (
          <div key={u.user_id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-stone-700">{u.nombre} {u.apellido}</p>
              <p className="text-xs text-stone-400">
                {isTerapeuta ? "Terapeuta Zentir (acceso automático)" : "Usuario"}
              </p>
            </div>
            <Button
              size="sm"
              variant={hasAccess || isTerapeuta ? "default" : "outline"}
              disabled={loading === u.user_id || isTerapeuta}
              onClick={() => toggleAccess(u.user_id, hasAccess)}
            >
              {isTerapeuta ? "Tiene acceso" : hasAccess ? "Quitar acceso" : "Dar acceso"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
