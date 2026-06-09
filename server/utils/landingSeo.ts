type LandingSeoEntry = {
  locale: string;
  path: string;
  is_active: boolean;
  robots?: string | null;
  updated_at?: string | null;
};

type LandingSeoPayload = {
  site?: {
    url?: string | null;
  };
  locales?: string[];
  pages?: LandingSeoEntry[];
  generated_at?: string | null;
};

export async function fetchLandingSeoPayload(apiBase: string): Promise<LandingSeoPayload> {
  try {
    const response = await $fetch<{ data?: LandingSeoPayload }>(`${apiBase.replace(/\/+$/, "")}/landing/seo`, {
      headers: {
        Accept: "application/json",
      },
    });

    return response.data || fallbackLandingSeoPayload();
  } catch {
    return fallbackLandingSeoPayload();
  }
}

export function fallbackLandingSeoPayload(): LandingSeoPayload {
  return {
    site: {
      url: "https://esterholdings.space",
    },
    locales: ["en", "ru", "uk"],
    pages: [
      {
        locale: "en",
        path: "/",
        is_active: true,
        robots: "index,follow",
      },
    ],
    generated_at: new Date().toISOString(),
  };
}

export function normalizedSiteUrl(payload: LandingSeoPayload, fallback: string): string {
  return String(payload.site?.url || fallback || "https://esterholdings.space").replace(/\/+$/, "");
}

export function pageAllowsIndexing(entry: LandingSeoEntry): boolean {
  const robots = String(entry.robots || "index,follow").toLowerCase();

  return Boolean(entry.is_active) && !robots.includes("noindex");
}

export function localizedLandingUrl(siteUrl: string, locale: string, path: string): string {
  const normalizedPath = normalizePath(path);
  const localizedPath = normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;

  return `${siteUrl}${localizedPath}`.replace(/([^:]\/)\/+/g, "$1");
}

export function normalizePath(path: string): string {
  if (!path || path === "*") return "/";

  const normalized = `/${path.split("?")[0].split("#")[0].replace(/^\/+/, "")}`.replace(/\/+/g, "/");
  return normalized === "/" ? "/" : normalized.replace(/\/$/, "");
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
