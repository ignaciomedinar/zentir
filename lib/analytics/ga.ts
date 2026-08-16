import { BetaAnalyticsDataClient } from "@google-analytics/data";
import "server-only";

export interface DailyVisits {
  date: string;
  visitors: number;
}

export interface CountryVisits {
  country: string;
  visitors: number;
}

export interface AnalyticsSummary {
  configured: boolean;
  error: string | null;
  daily: DailyVisits[];
  byCountry: CountryVisits[];
  totalVisitors: number;
}

function getClient() {
  const email = process.env.GA_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !key) return null;

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: email,
      private_key: key.replace(/\\n/g, "\n"),
    },
  });
}

function formatDate(yyyymmdd: string) {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  const y = yyyymmdd.slice(0, 4);
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${d}/${m}/${y}`;
}

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const propertyId = process.env.GA_PROPERTY_ID;
  const client = getClient();

  if (!client || !propertyId) {
    return { configured: false, error: null, daily: [], byCountry: [], totalVisitors: 0 };
  }

  try {
    const [dailyReport] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const [countryReport] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    });

    const daily = (dailyReport.rows ?? []).map((r) => ({
      date: formatDate(r.dimensionValues?.[0]?.value ?? ""),
      visitors: Number(r.metricValues?.[0]?.value ?? 0),
    }));

    const byCountry = (countryReport.rows ?? []).map((r) => ({
      country: r.dimensionValues?.[0]?.value || "Desconocido",
      visitors: Number(r.metricValues?.[0]?.value ?? 0),
    }));

    const totalVisitors = byCountry.reduce((sum, c) => sum + c.visitors, 0);

    return { configured: true, error: null, daily, byCountry, totalVisitors };
  } catch (err) {
    return {
      configured: true,
      error: err instanceof Error ? err.message : "Error al consultar Google Analytics",
      daily: [],
      byCountry: [],
      totalVisitors: 0,
    };
  }
}
