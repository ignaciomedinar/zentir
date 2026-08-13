"use client";

import { LOCALE_COOKIE } from "@/lib/i18n/constants";
import type { Locale } from "@/lib/i18n/dictionaries";

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  function toggle() {
    const next = locale === "es" ? "en" : "es";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    onChange(next);
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={locale === "en"}
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
      className="relative inline-flex items-center h-8 w-19 rounded-full bg-zinc-100 border border-[#cdcdcd] transition-colors hover:border-zentir/60"
    >
      <span
        className={`absolute top-0.5 h-6.5 w-9 rounded-full bg-zentir shadow-sm transition-transform duration-200 ease-out ${
          locale === "en" ? "translate-x-9.5" : "translate-x-0.5"
        }`}
      />
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-semibold transition-colors ${
          locale === "es" ? "text-white" : "text-[#737373]"
        }`}
      >
        ES
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-semibold transition-colors ${
          locale === "en" ? "text-white" : "text-[#737373]"
        }`}
      >
        EN
      </span>
    </button>
  );
}
