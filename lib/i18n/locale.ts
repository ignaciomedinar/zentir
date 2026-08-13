import { cookies, headers } from "next/headers";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";

function parseAcceptLanguage(acceptLanguage: string): Locale {
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase());

  for (const lang of preferred) {
    const base = lang.split("-")[0];
    if (locales.includes(base as Locale)) {
      return base as Locale;
    }
  }

  return "es";
}

export async function detectLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  if (saved && locales.includes(saved as Locale)) {
    return saved as Locale;
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");
  if (acceptLanguage) {
    return parseAcceptLanguage(acceptLanguage);
  }

  return "es";
}
