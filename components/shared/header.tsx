"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ButtonLink } from "@/components/ui/button-link";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

interface HeaderProps {
  user?: { email?: string } | null;
  isAdmin?: boolean;
  locale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  variant?: "light" | "dark";
}

export function Header({ user, isAdmin, locale = "es", onLocaleChange, variant = "light" }: HeaderProps) {
  const router = useRouter();
  const t = dictionaries[locale].header;
  const dark = variant === "dark";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const linkClass = dark
    ? "text-sm text-white/70 hover:text-white px-2 sm:px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
    : "text-sm text-[#737373] hover:text-black px-2 sm:px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors";

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        dark ? "bg-zentir-clay border-white/10" : "bg-background border-[#cdcdcd]"
      }`}
    >
      <div className="max-w-300 mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="Zentir"
            width={72}
            height={24}
            className={`h-7 sm:h-7 w-auto shrink-0 ${dark ? "brightness-0 invert" : ""}`}
          />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          {user ? (
            <>
              {isAdmin && (
                <ButtonLink variant="ghost" href="/admin" className={linkClass} title={t.panelAdmin}>
                  <LayoutDashboard className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">{t.panelAdmin}</span>
                </ButtonLink>
              )}
              <ButtonLink variant="ghost" href="/biblioteca" className={`${linkClass} flex items-center gap-1`} title={t.biblioteca}>
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.biblioteca}</span>
              </ButtonLink>
              <button onClick={handleLogout} className={linkClass} title={t.salir}>
                <LogOut className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">{t.salir}</span>
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              <ButtonLink
                variant="ghost"
                href="/login"
                className={`text-sm px-3 sm:px-4 py-1.5 rounded-full border bg-transparent transition-colors ${
                  dark
                    ? "border-white/30 text-white hover:bg-white/10 hover:border-zentir-warm/60 hover:text-zentir-warm"
                    : "border-[#cdcdcd] text-[#404040] hover:bg-zinc-100 hover:border-zentir/60 hover:text-zentir"
                }`}
              >
                {t.ingresar}
              </ButtonLink>
              <ButtonLink href="/register" className="text-sm bg-zentir hover:bg-zentir/90 text-white px-3 sm:px-4 py-1.5 rounded-full transition-colors">
                {t.registrarse}
              </ButtonLink>
            </div>
          )}
          {onLocaleChange && (
            <div className={`ml-2 pl-2 border-l ${dark ? "border-white/10" : "border-[#e5e0da]"}`}>
              <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
