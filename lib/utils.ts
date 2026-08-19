import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pickLocalized<T>(es: T, en: T | null | undefined, locale: "es" | "en"): T {
  if (locale === "en" && en) return en;
  return es;
}

export function formatDateRange(
  fechaInicio: string,
  fechaFin: string | null,
  locale: "es" | "en" = "es"
): string {
  const dateLocale = locale === "en" ? "en-US" : "es-MX";
  const start = new Date(fechaInicio + "T00:00:00");
  const end = fechaFin ? new Date(fechaFin + "T00:00:00") : null;

  const day = (d: Date) => d.toLocaleDateString(dateLocale, { day: "numeric" });
  const month = (d: Date) => d.toLocaleDateString(dateLocale, { month: "long" });

  const isSameDay = !end || start.getTime() === end.getTime();
  if (isSameDay) {
    return locale === "en" ? `${month(start)} ${day(start)}` : `${day(start)} ${month(start)}`;
  }

  const isSameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (isSameMonth) {
    return locale === "en"
      ? `${month(start)} ${day(start)}–${day(end)}`
      : `${day(start)}–${day(end)} ${month(start)}`;
  }

  return locale === "en"
    ? `${month(start)} ${day(start)} – ${month(end)} ${day(end)}`
    : `${day(start)} ${month(start)} – ${day(end)} ${month(end)}`;
}
