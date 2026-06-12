import {
  escapeXml,
  fetchLandingSeoPayload,
  localizedLandingUrl,
  normalizedSiteUrl,
  pageAllowsIndexing,
} from "../utils/landingSeo";

type NewsListResponse = {
  data?: {
    data?: Array<{
      slug?: string | null;
      updated_at?: string | null;
      published_at?: string | null;
      seo?: {
        canonical_url?: string | null;
      } | null;
    }>;
  };
};

export default defineCachedEventHandler(
  async event => {
    const config = useRuntimeConfig(event);
    const apiBase = String(config.public?.apiBase || "https://server.esterholdings.com/api");
    const siteUrl = String(config.public?.siteUrl || "https://esterholdings.space").replace(/\/+$/, "");
    const seoPayload = await fetchLandingSeoPayload(apiBase);
    const resolvedSiteUrl = normalizedSiteUrl(seoPayload, siteUrl);
    const staticUrls = (seoPayload.pages || [])
      .filter(pageAllowsIndexing)
      .filter(entry => entry.path !== "*")
      .map(entry => ({
        loc: localizedLandingUrl(resolvedSiteUrl, entry.locale, entry.path),
        lastmod: entry.updated_at || seoPayload.generated_at || new Date().toISOString(),
      }));
    const articleUrls = await loadArticleUrls(apiBase, resolvedSiteUrl, seoPayload.locales || ["en"]);
    const urls = uniqueUrls([...staticUrls, ...articleUrls]);
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(item =>
        [
          "  <url>",
          `    <loc>${escapeXml(item.loc)}</loc>`,
          `    <lastmod>${escapeXml(toIsoDate(item.lastmod))}</lastmod>`,
          "  </url>",
        ].join("\n")
      ),
      "</urlset>",
    ].join("\n");

    setHeader(event, "content-type", "application/xml; charset=UTF-8");
    setHeader(event, "cache-control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");

    return xml;
  },
  {
    maxAge: 300,
    name: "landing-sitemap",
  }
);

async function loadArticleUrls(
  apiBase: string,
  siteUrl: string,
  locales: string[]
): Promise<Array<{ loc: string; lastmod: string }>> {
  const tasks = locales.flatMap(locale => [
    loadArticleTypeUrls(apiBase, siteUrl, locale, "news", "/news"),
    loadArticleTypeUrls(apiBase, siteUrl, locale, "trader-blog", "/trader-blog"),
  ]);
  const results = await Promise.allSettled(tasks);

  return results.flatMap(result => (result.status === "fulfilled" ? result.value : []));
}

async function loadArticleTypeUrls(
  apiBase: string,
  siteUrl: string,
  locale: string,
  apiPath: string,
  publicPath: string
): Promise<Array<{ loc: string; lastmod: string }>> {
  try {
    const response = await $fetch<NewsListResponse>(`${apiBase.replace(/\/+$/, "")}/${apiPath}`, {
      query: {
        locale,
        page: 1,
        perPage: 100,
      },
      headers: {
        Accept: "application/json",
      },
    });
    const items = Array.isArray(response.data?.data) ? response.data.data : [];

    return items
      .filter(item => item.slug)
      .map(item => ({
        loc: articleSitemapUrl(siteUrl, locale, publicPath, item),
        lastmod: item.updated_at || item.published_at || new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

function articleSitemapUrl(
  siteUrl: string,
  locale: string,
  publicPath: string,
  item: {
    slug?: string | null;
    seo?: { canonical_url?: string | null } | null;
  }
): string {
  const canonicalPath = publicPathFromCanonical(item.seo?.canonical_url);

  return canonicalPath !== null
    ? `${siteUrl.replace(/\/+$/, "")}${canonicalPath}`
    : localizedLandingUrl(siteUrl, locale, `${publicPath}/${item.slug}`);
}

function publicPathFromCanonical(value: string | null | undefined): string | null {
  const canonical = String(value || "").trim();
  if (!canonical) return null;

  if (canonical.startsWith("/")) {
    return canonical;
  }

  try {
    const url = new URL(canonical);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function uniqueUrls(items: Array<{ loc: string; lastmod: string }>): Array<{ loc: string; lastmod: string }> {
  const map = new Map<string, { loc: string; lastmod: string }>();
  items.forEach(item => {
    map.set(item.loc, item);
  });

  return Array.from(map.values()).sort((left, right) => left.loc.localeCompare(right.loc));
}

function toIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();

  return date.toISOString();
}
