"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export function RetiroImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    const supabase = createClient();
    const path = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

    const { error } = await supabase.storage.from("retiro-images").upload(path, file);
    if (error) {
      toast.error("Error al subir la imagen: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("retiro-images").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  }

  return (
    <div className="space-y-2">
      <Label>Imagen de portada (opcional)</Label>
      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Portada del retiro" className="w-full h-40 object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors"
        >
          <Upload className="w-6 h-6 mx-auto text-stone-400 mb-1" />
          <p className="text-sm text-stone-500">
            {uploading ? "Subiendo..." : "Arrastra una imagen o haz clic para seleccionarla"}
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
