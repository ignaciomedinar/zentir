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

interface Retiro {
  id: string;
  nombre: string;
}

export function UploadContentForm({
  retiros,
  retiroId,
}: {
  retiros: Retiro[];
  retiroId?: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ titulo: "", descripcion: "" });
  // undefined = usar retiroId fijo (subida desde el detalle de un retiro)
  const [selectedRetiros, setSelectedRetiros] = useState<string[]>([]);

  function toggleTodos() {
    setSelectedRetiros([]);
  }

  function toggleRetiro(id: string) {
    setSelectedRetiros((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

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
      toast.error("Selecciona un archivo");
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
    const { data: contentRow, error: dbError } = await supabase
      .from("content")
      .insert({
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        file_url: filePath,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        nivel_acceso: "all",
      })
      .select("id")
      .single();

    if (dbError || !contentRow) {
      toast.error("Error al guardar: " + dbError?.message);
      await supabase.storage.from("content-files").remove([filePath]);
      setLoading(false);
      return;
    }

    // Asignar retiro(s): fijo si viene de la página de un retiro,
    // o los seleccionados en el picker (vacío = visible para todos)
    const retirosAAsignar = retiroId ? [retiroId] : selectedRetiros;
    if (retirosAAsignar.length) {
      const { error: linkError } = await supabase.from("content_retiros").insert(
        retirosAAsignar.map((rid) => ({ content_id: contentRow.id, retiro_id: rid }))
      );
      if (linkError) {
        toast.error("El archivo se subió, pero no se pudo asignar el retiro: " + linkError.message);
      }
    }

    toast.success("Archivo subido correctamente");
    setForm({ titulo: "", descripcion: "" });
    setSelectedRetiros([]);
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

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={form.titulo}
              onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
              placeholder="Ej: Guía de meditación para principiantes"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              placeholder="Breve descripción del contenido..."
              rows={2}
            />
          </div>

          {!retiroId && (
            <div className="space-y-2">
              <Label>¿Quién puede verlo?</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleTodos}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedRetiros.length === 0
                      ? "bg-stone-800 text-white border-stone-800"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  Todos
                </button>
                {retiros.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRetiro(r.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedRetiros.includes(r.id)
                        ? "bg-stone-800 text-white border-stone-800"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {r.nombre}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400">
                &ldquo;Todos&rdquo; lo hace visible a cualquier usuario aprobado. Si eliges uno o varios
                retiros, solo lo verán quienes tengan acceso a esos retiros.
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Subiendo..." : "Subir archivo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
