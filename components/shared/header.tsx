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
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl text-stone-800 tracking-wide">
          Zentir
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <ButtonLink variant="ghost" size="sm" href="/admin">Panel Admin</ButtonLink>
              )}
              <ButtonLink variant="ghost" size="sm" href="/biblioteca">
                <User className="w-4 h-4 mr-1" />
                Biblioteca
              </ButtonLink>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <ButtonLink variant="ghost" size="sm" href="/login">Ingresar</ButtonLink>
              <ButtonLink size="sm" href="/register">Registrarse</ButtonLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
