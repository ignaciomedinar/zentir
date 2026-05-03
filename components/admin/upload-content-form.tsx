"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  nombre: string;
  slug: string;
}

const ACCESS_LEVELS = [
  { value: "all", label: "Todos los usuarios (free)" },
  { value: "premium", label: "⭐ Solo usuarios premium" },
  { value: "general", label: "Público general" },
  { value: "curioso", label: "Curiosos/as" },
  { value: "terapeuta", label: "Terapeutas" },
  { value: "facilitador", label: "Facilitadores/as" },
];

export function UploadContentForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria_id: "",
    nivel_acceso: "all",
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Seleccioná un archivo");
      return;
    }
    if (!form.titulo.trim()) {
      toast.error("El título es requerido");
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const filePath = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

    // Subir archivo a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("content-files")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Error al subir el archivo: " + uploadError.message);
      setLoading(false);
      return;
    }

    // Guardar metadata en DB
    const { error: dbError } = await supabase.from("content").insert({
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      file_url: filePath,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      categoria_id: form.categoria_id || null,
      nivel_acceso: form.nivel_acceso as "all",
    });

    if (dbError) {
      toast.error("Error al guardar: " + dbError.message);
      // Limpiar archivo subido si falla la DB
      await supabase.storage.from("content-files").remove([filePath]);
      setLoading(false);
      return;
    }

    toast.success("Archivo subido correctamente");
    setForm({ titulo: "", descripcion: "", categoria_id: "", nivel_acceso: "all" });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Subir nuevo archivo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
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
                <p className="text-stone-600 font-medium">Arrastrá tu archivo aquí</p>
                <p className="text-sm text-stone-400">o hacé click para seleccionarlo</p>
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                placeholder="Ej: Guía de meditación para principiantes"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={form.descripcion}
                onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                placeholder="Breve descripción del contenido..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select onValueChange={(v) => setForm((p) => ({ ...p, categoria_id: v as string }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>¿Quién puede verlo?</Label>
              <Select
                defaultValue="all"
                onValueChange={(v) => setForm((p) => ({ ...p, nivel_acceso: v as string }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Subiendo..." : "Subir archivo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
