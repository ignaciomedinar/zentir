"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { toast } from "sonner";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    if (!email) {
      toast.error("No encontramos el correo. Intenta registrarte de nuevo.");
      return;
    }
    setResending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setResending(false);
    if (error) {
      toast.error("No se pudo reenviar el correo. Intenta de nuevo.");
    } else {
      setResent(true);
      toast.success("Correo reenviado. Revisa tu bandeja de entrada.");
    }
  }

  return (
    <CardContent className="space-y-4">
      <p className="text-sm text-stone-500">
        Si no lo ves en tu bandeja de entrada, revisa la carpeta de spam.
      </p>
      {email && !resent && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Reenviando..." : "Reenviar correo de confirmación"}
        </Button>
      )}
      {resent && (
        <p className="text-sm text-green-600 font-medium">
          ¡Correo reenviado! Revisa tu bandeja de entrada.
        </p>
      )}
      <ButtonLink variant="ghost" href="/login" className="w-full">
        Volver al inicio de sesión
      </ButtonLink>
    </CardContent>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-4xl mb-2">📩</div>
          <CardTitle className="text-2xl text-stone-800">Revisa tu correo</CardTitle>
          <CardDescription>
            Te enviamos un link de confirmación. Haz clic en él para activar tu cuenta.
          </CardDescription>
        </CardHeader>
        <Suspense fallback={<CardContent><p className="text-sm text-stone-500 py-2">Cargando...</p></CardContent>}>
          <VerifyContent />
        </Suspense>
      </Card>
    </div>
  );
}
