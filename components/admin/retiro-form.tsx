"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function RetiroForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", fecha: "", lugar: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("retiros").insert({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      fecha: form.fecha || null,
      lugar: form.lugar.trim() || null,
    });

    if (error) {
      toast.error("Error al crear el retiro: " + error.message);
    } else {
      toast.success("Retiro creado");
      setForm({ nombre: "", descripcion: "", fecha: "", lugar: "" });
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crear retiro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej: Retiro Costa 2026"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              placeholder="Breve descripción del retiro..."
              rows={2}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={form.fecha}
                onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar</Label>
              <Input
                id="lugar"
                value={form.lugar}
                onChange={(e) => setForm((p) => ({ ...p, lugar: e.target.value }))}
                placeholder="Ej: Tulum, México"
              />
            </div>
          </div>
          <p className="text-xs text-stone-400">
            Si cargas fecha y lugar, el retiro aparece automáticamente en "Próximos retiros" del sitio público.
          </p>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear retiro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
