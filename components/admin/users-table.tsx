"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types/database";

interface UserProfile {
  id: string;
  user_id: string;
  nombre: string;
  apellido: string;
  perfil_tipo: string;
  aprobado: boolean;
  role: string;
  created_at: string;
}

const PERFIL_LABELS: Record<string, string> = {
  general: "General",
  curioso: "Curioso/a",
  terapeuta: "Terapeuta",
  facilitador: "Facilitador/a",
};

export function UsersTable({ usuarios }: { usuarios: UserProfile[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateUser(userId: string, updates: { aprobado?: boolean; role?: UserRole }) {
    setLoading(userId);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId);

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("Usuario actualizado");
      router.refresh();
    }
    setLoading(null);
  }

  if (!usuarios.length) {
    return (
      <div className="text-center py-12 text-stone-400 border rounded-lg bg-white">
        <p>No hay usuarios registrados todavía.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-stone-50">
            <TableHead>Nombre</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((u) => (
            <TableRow key={u.id} className={!u.aprobado ? "opacity-60" : ""}>
              <TableCell>
                <p className="font-medium text-stone-700 text-sm">
                  {u.nombre} {u.apellido}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {PERFIL_LABELS[u.perfil_tipo] ?? u.perfil_tipo}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={u.aprobado ? "default" : "secondary"}
                  className="text-xs"
                >
                  {u.aprobado ? "Activo" : "Bloqueado"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-stone-500">
                {new Date(u.created_at).toLocaleDateString("es-AR")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={loading === u.user_id}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {u.aprobado ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => updateUser(u.user_id, { aprobado: false })}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Bloquear acceso
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => updateUser(u.user_id, { aprobado: true })}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Aprobar acceso
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => updateUser(u.user_id, { role: "admin" as UserRole })}
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Hacer administrador
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
