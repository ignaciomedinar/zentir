"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Presentation } from "lucide-react";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  titulo: string;
  descripcion: string | null;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  nivel_acceso: string;
  created_at: string;
  categories?: { nombre: string; slug: string } | null;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function FileIcon({ type }: { type: string }) {
  if (type.includes("presentation") || type.includes("powerpoint")) {
    return <Presentation className="w-5 h-5" />;
  }
  return <FileText className="w-5 h-5" />;
}

export function ContentCard({ item, userId }: { item: ContentItem; userId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("content-files")
      .createSignedUrl(item.file_url, 60);

    if (error || !data?.signedUrl) {
      toast.error("No se pudo descargar el archivo");
      setLoading(false);
      return;
    }

    // Registrar descarga
    await supabase.from("downloads").insert({ user_id: userId, content_id: item.id });

    // Abrir descarga
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = item.file_name;
    a.click();

    toast.success("Descarga iniciada");
    setLoading(false);
  }

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
            <FileIcon type={item.file_type} />
          </div>
          {item.categories && (
            <Badge variant="outline" className="text-xs">
              {item.categories.nombre}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base mt-2 leading-snug">{item.titulo}</CardTitle>
        {item.descripcion && (
          <CardDescription className="text-sm line-clamp-2">{item.descripcion}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">{formatBytes(item.file_size)}</span>
          <Button size="sm" variant="outline" onClick={handleDownload} disabled={loading}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {loading ? "Descargando..." : "Descargar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
