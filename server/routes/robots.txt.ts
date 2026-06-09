import {
  fetchLandingSeoPayload,
  localizedLandingUrl,
  normalizePath,
  normalizedSiteUrl,
  pageAllowsIndexing,
} from "../utils/landingSeo";

export default defineCachedEventHandler(
  async event => {
    const config = useRuntimeConfig(event);
    const apiBase = String(config.public?.apiBase || "https://server.esterholdings.com/api");
    const siteUrl = String(config.public?.siteUrl || "https://esterholdings.space").replace(/\/+$/, "");
    const seoPayload = await fetchLandingSeoPayload(apiBase);
    const resolvedSiteUrl = normalizedSiteUrl(seoPayload, siteUrl);
    const blockedPaths = (seoPayload.pages || [])
      .filter(entry => !pageAllowsIndexing(entry))
      .filter(entry => entry.path !== "*")
      .map(entry => normalizeRobotsPath(entry.locale, entry.path));
    const lines = [
      "User-agent: *",
      "Allow: /",
      ...Array.from(new Set(blockedPaths)).map(path => `Disallow: ${path}`),
      "",
      `Sitemap: ${resolvedSiteUrl}/sitemap.xml`,
      "",
    ];

    setHeader(event, "content-type", "text/plain; charset=UTF-8");
    setHeader(event, "cache-control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");

    return lines.join("\n");
  },
  {
    maxAge: 300,
    name: "landing-robots",
  }
);

function normalizeRobotsPath(locale: string, path: string): string {
  const normalizedPath = normalizePath(path);
  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}
