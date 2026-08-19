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

interface Retiro {
  id: string;
  nombre: string;
  nombre_en: string | null;
  descripcion: string | null;
  descripcion_en: string | null;
  descripcion_detallada: string | null;
  descripcion_detallada_en: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  lugar: string | null;
  lugar_en: string | null;
  precio: number | null;
  moneda: string;
  imagen_portada: string | null;
  link_pago: string | null;
}

export function RetiroDetailsForm({ retiro }: { retiro: Retiro }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: retiro.nombre,
    nombre_en: retiro.nombre_en ?? "",
    descripcion: retiro.descripcion ?? "",
    descripcion_en: retiro.descripcion_en ?? "",
    descripcion_detallada: retiro.descripcion_detallada ?? "",
    descripcion_detallada_en: retiro.descripcion_detallada_en ?? "",
    fecha_inicio: retiro.fecha_inicio ?? "",
    fecha_fin: retiro.fecha_fin ?? "",
    lugar: retiro.lugar ?? "",
    lugar_en: retiro.lugar_en ?? "",
    precio: retiro.precio != null ? String(retiro.precio) : "",
    moneda: retiro.moneda ?? "MXN",
    imagen_portada: retiro.imagen_portada ?? "",
    link_pago: retiro.link_pago ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("retiros")
      .update({
        nombre: form.nombre.trim(),
        nombre_en: form.nombre_en.trim() || null,
        descripcion: form.descripcion.trim() || null,
        descripcion_en: form.descripcion_en.trim() || null,
        descripcion_detallada: form.descripcion_detallada.trim() || null,
        descripcion_detallada_en: form.descripcion_detallada_en.trim() || null,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
        lugar: form.lugar.trim() || null,
        lugar_en: form.lugar_en.trim() || null,
        precio: form.precio ? Number(form.precio) : null,
        moneda: form.moneda,
        imagen_portada: form.imagen_portada.trim() || null,
        link_pago: form.link_pago.trim() || null,
      })
      .eq("id", retiro.id);

    if (error) {
      toast.error("Error al guardar: " + error.message);
    } else {
      toast.success("Retiro actualizado");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Datos del retiro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre * (español)</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_en">Nombre (inglés, opcional)</Label>
              <Input
                id="nombre_en"
                value={form.nombre_en}
                onChange={(e) => setForm((p) => ({ ...p, nombre_en: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción breve (español)</Label>
              <Textarea
                id="descripcion"
                value={form.descripcion}
                onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                placeholder="Aparece en la página principal, en la tarjeta del retiro..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion_en">Descripción breve (inglés, opcional)</Label>
              <Textarea
                id="descripcion_en"
                value={form.descripcion_en}
                onChange={(e) => setForm((p) => ({ ...p, descripcion_en: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion_detallada">Descripción detallada (español, opcional)</Label>
              <Textarea
                id="descripcion_detallada"
                value={form.descripcion_detallada}
                onChange={(e) => setForm((p) => ({ ...p, descripcion_detallada: e.target.value }))}
                placeholder="Aparece en la página del retiro: itinerario, qué incluye, requisitos, etc."
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion_detallada_en">Descripción detallada (inglés, opcional)</Label>
              <Textarea
                id="descripcion_detallada_en"
                value={form.descripcion_detallada_en}
                onChange={(e) => setForm((p) => ({ ...p, descripcion_detallada_en: e.target.value }))}
                rows={5}
              />
            </div>
          </div>
          <p className="text-xs text-stone-400">
            Si no llenas los campos en inglés, el retiro se mostrará en español aunque el usuario tenga el sitio en inglés.
          </p>
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar (español)</Label>
              <Input
                id="lugar"
                value={form.lugar}
                onChange={(e) => setForm((p) => ({ ...p, lugar: e.target.value }))}
                placeholder="Ej: Tulum, México"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lugar_en">Lugar (inglés, opcional)</Label>
              <Input
                id="lugar_en"
                value={form.lugar_en}
                onChange={(e) => setForm((p) => ({ ...p, lugar_en: e.target.value }))}
                placeholder="Ej: Tulum, Mexico"
              />
            </div>
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
          <div className="space-y-2">
            <Label htmlFor="link_pago">Link de pago (opcional)</Label>
            <Input
              id="link_pago"
              type="url"
              value={form.link_pago}
              onChange={(e) => setForm((p) => ({ ...p, link_pago: e.target.value }))}
              placeholder="Ej: https://wetravel.com/trips/..."
            />
            <p className="text-xs text-stone-400">
              Si lo llenas, aparece un botón &ldquo;Reservar mi lugar&rdquo; en la página del retiro que lleva directo a este link.
            </p>
          </div>
          <RetiroImageUpload
            value={form.imagen_portada}
            onChange={(url) => setForm((p) => ({ ...p, imagen_portada: url }))}
          />
          <p className="text-xs text-stone-400">
            Si cargas fecha de inicio y lugar, el retiro aparece automáticamente en &ldquo;Próximos retiros&rdquo; del sitio público.
          </p>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
