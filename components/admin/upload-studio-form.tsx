"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import type { StudioContentType } from "@/lib/types/database";

const TYPE_OPTIONS: { value: StudioContentType; label: string }[] = [
  { value: "documento", label: "Documento" },
  { value: "podcast", label: "Podcast" },
  { value: "publicacion", label: "Publicación" },
];

export function UploadStudioForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<StudioContentType>("documento");
  const [form, setForm] = useState({ titulo: "", descripcion: "", externalUrl: "" });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  function resetForm() {
    setForm({ titulo: "", descripcion: "", externalUrl: "" });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) {
      toast.error("El título es requerido");
      return;
    }
    if (contentType === "documento" && !file) {
      toast.error("Selecciona un archivo");
      return;
    }
    if (contentType !== "documento" && !form.externalUrl.trim()) {
      toast.error("Ingresa el link");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    let filePath: string | null = null;
    if (contentType === "documento" && file) {
      filePath = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("studio-files")
        .upload(filePath, file);

      if (uploadError) {
        toast.error("Error al subir el archivo: " + uploadError.message);
        setLoading(false);
        return;
      }
    }

    const { error: dbError } = await supabase.from("studio_content").insert({
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      content_type: contentType,
      external_url: contentType === "documento" ? null : form.externalUrl.trim(),
      file_url: filePath,
      file_name: file?.name ?? null,
      file_size: file?.size ?? null,
      file_type: file?.type ?? null,
    });

    if (dbError) {
      toast.error("Error al guardar: " + dbError.message);
      if (filePath) await supabase.storage.from("studio-files").remove([filePath]);
      setLoading(false);
      return;
    }

    toast.success("Publicado en Zentir Studio");
    resetForm();
    router.refresh();
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Publicar en Zentir Studio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setContentType(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    contentType === opt.value
                      ? "bg-stone-800 text-white border-stone-800"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {contentType === "documento" ? (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 rounded-lg p-8 text-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-stone-500" />
                    <div className="text-left">
                      <p className="font-medium text-stone-700">{file.name}</p>
                      <p className="text-sm text-stone-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="ml-2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-stone-400" />
                    <p className="text-stone-600 font-medium">Arrastra tu archivo aquí</p>
                    <p className="text-sm text-stone-400">o haz clic para seleccionarlo</p>
                    <p className="text-xs text-stone-400">PDF, PPT, PPTX, DOC, DOCX</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                onChange={handleFileChange}
              />
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="externalUrl">Link *</Label>
              <Input
                id="externalUrl"
                type="url"
                value={form.externalUrl}
                onChange={(e) => setForm((p) => ({ ...p, externalUrl: e.target.value }))}
                placeholder="https://open.spotify.com/episode/..."
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={form.titulo}
              onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
              placeholder="Ej: Episodio 3 — Respirar antes de reaccionar"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              placeholder="Breve descripción..."
              rows={2}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
