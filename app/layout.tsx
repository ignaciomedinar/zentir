import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/shared/cookie-consent";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Zentir — Retiros y Bienestar",
  description: "Accede a materiales exclusivos de retiros, meditación y bienestar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${inter.variable} font-inter antialiased bg-white text-black`}>
        {children}
        <Toaster richColors position="top-right" />
        <CookieConsent />
      </body>
    </html>
  );
}
