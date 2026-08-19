"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { toast } from "sonner";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";

export function InscribirseButton({
  retiroId,
  isSignedIn,
  locale = "es",
}: {
  retiroId: string;
  isSignedIn: boolean;
  locale?: Locale;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [inscrito, setInscrito] = useState(false);
  const t = dictionaries[locale].inscribirse;

  async function inscribir() {
    setLoading(true);
    const res = await fetch(`/api/retiros/${retiroId}/inscribir`, { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error ?? "No se pudo completar la inscripción");
      return;
    }

    setInscrito(true);
    toast.success(
      data.yaInscrito ? "Ya estabas inscrito/a a este retiro" : "¡Listo! Te inscribiste al retiro"
    );
  }

  // Si venimos de registro/login con ?inscribir=1, inscribir automáticamente
  useEffect(() => {
    if (isSignedIn && searchParams.get("inscribir") === "1" && !inscrito) {
      const timer = setTimeout(() => inscribir(), 0);
      const url = new URL(window.location.href);
      url.searchParams.delete("inscribir");
      router.replace(url.pathname + url.search);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  if (inscrito) {
    return (
      <Button disabled className="bg-zentir/50 text-white px-8 py-3 rounded-full">
        {t.yaInscrito}
      </Button>
    );
  }

  if (!isSignedIn) {
    const next = `/retiros/${retiroId}?inscribir=1`;
    return (
      <ButtonLink
        href={`/register?next=${encodeURIComponent(next)}`}
        className="inline-flex bg-zentir hover:bg-zentir/90 text-white px-8 py-3 rounded-full text-sm font-medium"
      >
        {t.quieroAnotarme}
      </ButtonLink>
    );
  }

  return (
    <Button
      onClick={inscribir}
      disabled={loading}
      className="bg-zentir hover:bg-zentir/90 text-white px-8 py-3 rounded-full text-sm font-medium"
    >
      {loading ? t.anotando : t.quieroAnotarme}
    </Button>
  );
}
