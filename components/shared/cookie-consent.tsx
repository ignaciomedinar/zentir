"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const GA_MEASUREMENT_ID = "G-B2LQQ39XYX";
const CONSENT_KEY = "zentir-cookie-consent";

type ConsentStatus = "pending" | "granted" | "denied";

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === "granted" || saved === "denied") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount, not derivable from props/state
      setStatus(saved);
    } else {
      setVisible(true);
    }
  }, []);

  function decide(value: "granted" | "denied") {
    localStorage.setItem(CONSENT_KEY, value);
    setStatus(value);
    setVisible(false);
  }

  return (
    <>
      {status === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {visible && (
        <div className="fixed bottom-0 inset-x-0 z-100 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#e5e0da] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#404040] leading-relaxed flex-1">
              Usamos cookies para entender cómo usas el sitio y mejorar tu experiencia. Puedes leer más en nuestro{" "}
              <Link href="/privacidad" className="text-zentir hover:underline font-medium">
                aviso de privacidad
              </Link>
              .
            </p>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                onClick={() => decide("denied")}
                className="text-sm border border-[#cdcdcd] bg-transparent hover:bg-zinc-100"
              >
                Rechazar
              </Button>
              <Button
                onClick={() => decide("granted")}
                className="text-sm bg-zentir hover:bg-zentir/90 text-white"
              >
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
