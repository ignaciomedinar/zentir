"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const DESTINATARIOS = [
  { value: "todos", label: "Todos los usuarios" },
  { value: "usuario", label: "Solo usuarios" },
  { value: "terapeuta", label: "Solo terapeutas Zentir" },
];

export function EmailComposer() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destinatarios: "todos",
    asunto: "",
    cuerpo: "",
  });

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!form.asunto.trim() || !form.cuerpo.trim()) {
      toast.error("El asunto y el mensaje son requeridos");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error ?? "Error al enviar");
    } else {
      toast.success(`Email enviado a ${data.count} usuario/s`);
      setForm({ destinatarios: "todos", asunto: "", cuerpo: "" });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nuevo email</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Destinatarios</Label>
              <Select
                defaultValue="todos"
                onValueChange={(v) => setForm((p) => ({ ...p, destinatarios: v as string }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATARIOS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asunto">Asunto</Label>
              <Input
                id="asunto"
                value={form.asunto}
                onChange={(e) => setForm((p) => ({ ...p, asunto: e.target.value }))}
                placeholder="Ej: Nuevo material disponible"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cuerpo">Mensaje</Label>
            <Textarea
              id="cuerpo"
              value={form.cuerpo}
              onChange={(e) => setForm((p) => ({ ...p, cuerpo: e.target.value }))}
              placeholder="Escribe el mensaje para tus usuarios..."
              rows={6}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
