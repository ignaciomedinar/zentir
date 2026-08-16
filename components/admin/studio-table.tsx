"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { StudioContentType } from "@/lib/types/database";

interface StudioItem {
  id: string;
  titulo: string;
  content_type: StudioContentType;
  external_url: string | null;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<StudioContentType, string> = {
  documento: "Documento",
  podcast: "Podcast",
  publicacion: "Publicación",
  video: "Video",
};

export function StudioTable({ contenido }: { contenido: StudioItem[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    const supabase = createClient();

    const item = contenido.find((c) => c.id === id);
    if (!item) return;

    if (item.file_url) {
      await supabase.storage.from("studio-files").remove([item.file_url]);
    }
    const { error } = await supabase.from("studio_content").delete().eq("id", id);

    if (error) {
      toast.error("Error al eliminar: " + error.message);
    } else {
      toast.success("Contenido eliminado");
      router.refresh();
    }
    setDeleting(null);
    setConfirmId(null);
  }

  if (!contenido.length) {
    return (
      <div className="text-center py-12 text-stone-400 border rounded-lg">
        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>Todavía no hay nada publicado en Zentir Studio.</p>
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
              <TableHead>Tipo</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contenido.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium text-stone-700 text-sm">{item.titulo}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{TYPE_LABELS[item.content_type]}</Badge>
                </TableCell>
                <TableCell className="text-sm text-stone-500">
                  {item.external_url ? (
                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-zentir hover:underline max-w-60 truncate"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {item.external_url}
                    </a>
                  ) : (
                    item.file_name
                  )}
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
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar contenido?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer y dejará de verse en la landing y en /estudio.
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
