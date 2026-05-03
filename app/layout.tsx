import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zentir — Retiros y Bienestar",
  description: "Accedé a materiales exclusivos de retiros, meditación y bienestar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} antialiased bg-stone-50`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
