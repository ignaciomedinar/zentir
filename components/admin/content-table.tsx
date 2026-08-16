"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  titulo: string;
  file_name: string;
  file_size: number;
  created_at: string;
  content_retiros?: { retiros: { nombre: string } | null }[];
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ContentTable({ contenido }: { contenido: ContentItem[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    const supabase = createClient();

    const item = contenido.find((c) => c.id === id);
    if (!item) return;

    // Borrar de storage y DB
    await supabase.storage.from("content-files").remove([item.file_name]);
    const { error } = await supabase.from("content").delete().eq("id", id);

    if (error) {
      toast.error("Error al eliminar: " + error.message);
    } else {
      toast.success("Archivo eliminado");
      router.refresh();
    }
    setDeleting(null);
    setConfirmId(null);
  }

  if (!contenido.length) {
    return (
      <div className="text-center py-12 text-stone-400 border rounded-lg">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>No hay archivos subidos todavía.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border overflow-x-auto bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead>Título</TableHead>
              <TableHead>Visible para</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contenido.map((item) => {
              const retiroNombres = (item.content_retiros ?? [])
                .map((cr) => cr.retiros?.nombre)
                .filter((n): n is string => !!n);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-stone-700 text-sm">{item.titulo}</p>
                      <p className="text-xs text-stone-400">{item.file_name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {retiroNombres.length ? (
                      <div className="flex flex-wrap gap-1">
                        {retiroNombres.map((n) => (
                          <Badge key={n} variant="outline" className="text-xs">{n}</Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">Todos</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-stone-500">
                    {formatBytes(item.file_size)}
                  </TableCell>
                  <TableCell className="text-sm text-stone-500">
                    {new Date(item.created_at).toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setConfirmId(item.id)}
                      disabled={deleting === item.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar archivo?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El archivo y sus registros de descarga se eliminarán permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={() => confirmId && handleDelete(confirmId)}
              disabled={!!deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
