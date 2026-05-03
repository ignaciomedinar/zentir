"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { User } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  user?: { email?: string } | null;
  isAdmin?: boolean;
}

export function Header({ user, isAdmin }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-[#cdcdcd] bg-white sticky top-0 z-50">
      <div className="max-w-300 mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-base tracking-[-0.03em]" style={{ fontFamily: "var(--font-sora)" }}>
          Zentir
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <ButtonLink href="/admin" className="text-sm text-[#737373] hover:text-black px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors">
                  Panel Admin
                </ButtonLink>
              )}
              <ButtonLink href="/biblioteca" className="text-sm text-[#737373] hover:text-black px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Biblioteca
              </ButtonLink>
              <button
                onClick={handleLogout}
                className="text-sm text-[#737373] hover:text-black px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" className="text-sm text-[#737373] hover:text-black px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors">
                Ingresar
              </ButtonLink>
              <ButtonLink href="/register" className="text-sm bg-zentir hover:bg-zentir/90 text-white px-4 py-1.5 rounded-full transition-colors">
                Registrarse
              </ButtonLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
