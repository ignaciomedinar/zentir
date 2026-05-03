"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { ProfileType } from "@/lib/types/database";

const perfiles: { value: ProfileType; label: string; desc: string }[] = [
  { value: "general", label: "Público general", desc: "Me interesa el bienestar y el autoconocimiento" },
  { value: "curioso", label: "Curioso/a", desc: "Quiero explorar prácticas de retiro y meditación" },
  { value: "terapeuta", label: "Terapeuta", desc: "Trabajo en el área de salud mental o terapias" },
  { value: "facilitador", label: "Facilitador/a", desc: "Facilito grupos, retiros o procesos de desarrollo" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    perfil_tipo: "" as ProfileType | "",
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.perfil_tipo) {
      toast.error("Por favor seleccioná tu perfil");
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${(window as Window).location.origin}/verify`,
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          perfil_tipo: form.perfil_tipo,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      router.push("/verify");
    } else {
      router.push("/biblioteca");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-stone-800">Crear cuenta</CardTitle>
          <CardDescription>Unite a la comunidad Zentir</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={form.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>¿Quién sos?</Label>
              <Select onValueChange={(v) => handleChange("perfil_tipo", v as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná tu perfil" />
                </SelectTrigger>
                <SelectContent>
                  {perfiles.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div>
                        <div className="font-medium">{p.label}</div>
                        <div className="text-xs text-stone-500">{p.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-4">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-stone-700 font-medium hover:underline">
              Ingresá
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
