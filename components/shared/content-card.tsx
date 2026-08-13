"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
    <div className="rounded-[12px] border border-[#e5e0da] bg-[#faf8f6] p-6 flex flex-col gap-4">
      <div className="p-2.5 bg-zentir/15 text-zentir rounded-lg w-fit">
        <FileIcon type={item.file_type} />
      </div>
      <div>
        <h3 className="font-semibold text-black leading-snug">{item.titulo}</h3>
        {item.descripcion && (
          <p className="text-sm text-[#737373] mt-1 line-clamp-2">{item.descripcion}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-[#a8a29e]">{formatBytes(item.file_size)}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          disabled={loading}
          className="border-black/15 text-black hover:bg-black/5"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          {loading ? "Descargando..." : "Descargar"}
        </Button>
      </div>
    </div>
  );
}
