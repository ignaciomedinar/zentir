"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RetiroImageUpload } from "@/components/admin/retiro-image-upload";
import { toast } from "sonner";

const MONEDAS = ["MXN", "USD", "EUR", "GBP", "AED"];

export function RetiroForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    descripcion_detallada: "",
    fecha_inicio: "",
    fecha_fin: "",
    lugar: "",
    precio: "",
    moneda: "MXN",
    imagen_portada: "",
  });

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
      descripcion_detallada: form.descripcion_detallada.trim() || null,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin: form.fecha_fin || null,
      lugar: form.lugar.trim() || null,
      precio: form.precio ? Number(form.precio) : null,
      moneda: form.moneda,
      imagen_portada: form.imagen_portada.trim() || null,
    });

    if (error) {
      toast.error("Error al crear el retiro: " + error.message);
    } else {
      toast.success("Retiro creado");
      setForm({
        nombre: "",
        descripcion: "",
        descripcion_detallada: "",
        fecha_inicio: "",
        fecha_fin: "",
        lugar: "",
        precio: "",
        moneda: "MXN",
        imagen_portada: "",
      });
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
            <Label htmlFor="descripcion">Descripción breve</Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              placeholder="Aparece en la página principal, en la tarjeta del retiro..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion_detallada">Descripción detallada (opcional)</Label>
            <Textarea
              id="descripcion_detallada"
              value={form.descripcion_detallada}
              onChange={(e) => setForm((p) => ({ ...p, descripcion_detallada: e.target.value }))}
              placeholder="Aparece en la página del retiro: itinerario, qué incluye, requisitos, etc."
              rows={5}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={form.fecha_inicio}
                onChange={(e) => setForm((p) => ({ ...p, fecha_inicio: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de fin (opcional)</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={form.fecha_fin}
                onChange={(e) => setForm((p) => ({ ...p, fecha_fin: e.target.value }))}
              />
            </div>
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
          <div className="grid sm:grid-cols-[1fr_auto] gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (opcional)</Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={(e) => setForm((p) => ({ ...p, precio: e.target.value }))}
                placeholder="Ej: 8500"
              />
            </div>
            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select
                value={form.moneda}
                onValueChange={(v) => setForm((p) => ({ ...p, moneda: v as string }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONEDAS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <RetiroImageUpload
            value={form.imagen_portada}
            onChange={(url) => setForm((p) => ({ ...p, imagen_portada: url }))}
          />
          <p className="text-xs text-stone-400">
            Si cargas fecha de inicio y lugar, el retiro aparece automáticamente en &ldquo;Próximos retiros&rdquo; del sitio público.
          </p>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear retiro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
