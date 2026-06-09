import { computed } from "vue";
import { useAsyncData, useHead, useRoute, useRuntimeConfig, useSeoMeta } from "#app";
import { useI18n } from "vue-i18n";
import useAppCore from "~/composables/useAppCore";
import type { LandingSeoEntry, LandingSeoPayload, LandingSeoSchema } from "~/composables/core/modules/seo/seo.types";

const fallbackSeoPayload = (): LandingSeoPayload => ({
  site: {
    name: "Ester Holdings",
    url: "https://esterholdings.space",
    default_image_url: "/favicon/favicon-512x512.png",
  },
  locales: ["en", "ru", "uk"],
  defaults: [
    {
      locale: "en",
      path: "*",
      is_active: true,
      meta_title: "Ester Holdings | Multi-asset trading platform",
      meta_description: "Trade FX, crypto, metals, commodities, indices and stocks from one Ester Holdings account.",
      robots: "index,follow",
    },
  ],
  pages: [],
  generated_at: null,
});

export async function useLandingSeo(): Promise<void> {
  const appCore = useAppCore();
  const route = useRoute();
  const config = useRuntimeConfig();
  const { locale } = useI18n();

  const { data } = await useAsyncData(
    "landing-seo-settings",
    async () => {
      try {
        const response = await appCore.seo.getLandingSeo();
        return response.data;
      } catch {
        return fallbackSeoPayload();
      }
    },
    {
      server: true,
      lazy: false,
      default: fallbackSeoPayload,
    }
  );

  const payload = computed(() => data.value || fallbackSeoPayload());
  const localeCodes = computed(() => (payload.value.locales?.length ? payload.value.locales : ["en", "ru", "uk"]));
  const currentLocale = computed(() => String(locale.value || "en"));
  const normalizedPath = computed(() => normalizeRoutePath(route.path, localeCodes.value));
  const siteUrl = computed(() =>
    normalizeSiteUrl(payload.value.site?.url || config.public?.siteUrl || "https://esterholdings.space")
  );
  const defaultImage = computed(() =>
    absoluteUrl(payload.value.site?.default_image_url || "/favicon/favicon-512x512.png", siteUrl.value)
  );

  const defaultEntry = computed(() => {
    return (
      findSeoEntry(payload.value.defaults, currentLocale.value, "*") || findSeoEntry(payload.value.defaults, "en", "*")
    );
  });
  const pageEntry = computed(() => {
    return (
      findSeoEntry(payload.value.pages, currentLocale.value, normalizedPath.value) ||
      findSeoEntry(payload.value.pages, "en", normalizedPath.value)
    );
  });

  const metaTitle = computed(() => pickSeoValue("meta_title", pageEntry.value, defaultEntry.value) || "Ester Holdings");
  const metaDescription = computed(
    () =>
      pickSeoValue("meta_description", pageEntry.value, defaultEntry.value) ||
      "Trade FX, crypto, metals, commodities, indices and stocks from one account."
  );
  const metaKeywords = computed(() => {
    const values = pageEntry.value?.meta_keywords?.length
      ? pageEntry.value.meta_keywords
      : defaultEntry.value?.meta_keywords || [];

    return values.filter(Boolean).join(", ");
  });
  const robots = computed(() => pickSeoValue("robots", pageEntry.value, defaultEntry.value) || "index,follow");
  const canonicalUrl = computed(() => {
    const explicit = pickSeoValue("canonical_url", pageEntry.value, defaultEntry.value);
    return explicit || buildCanonicalUrl(siteUrl.value, currentLocale.value, normalizedPath.value);
  });
  const ogImage = computed(() =>
    absoluteUrl(pickSeoValue("og_image_url", pageEntry.value, defaultEntry.value) || defaultImage.value, siteUrl.value)
  );
  const twitterImage = computed(() =>
    absoluteUrl(pickSeoValue("twitter_image_url", pageEntry.value, defaultEntry.value) || ogImage.value, siteUrl.value)
  );
  const schema = computed<LandingSeoSchema>(
    () => pageEntry.value?.schema_json || defaultEntry.value?.schema_json || null
  );
  const alternateLinks = computed(() => [
    { rel: "canonical", href: canonicalUrl.value },
    ...localeCodes.value.map(code => ({
      rel: "alternate",
      hreflang: code,
      href: buildCanonicalUrl(siteUrl.value, code, normalizedPath.value),
    })),
    {
      rel: "alternate",
      hreflang: "x-default",
      href: buildCanonicalUrl(siteUrl.value, "en", normalizedPath.value),
    },
  ]);

  useSeoMeta({
    title: metaTitle,
    description: metaDescription,
    robots,
    ogSiteName: computed(() => payload.value.site?.name || "Ester Holdings"),
    ogType: "website",
    ogUrl: canonicalUrl,
    ogTitle: computed(() => pickSeoValue("og_title", pageEntry.value, defaultEntry.value) || metaTitle.value),
    ogDescription: computed(
      () => pickSeoValue("og_description", pageEntry.value, defaultEntry.value) || metaDescription.value
    ),
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: computed(() => pickSeoValue("twitter_title", pageEntry.value, defaultEntry.value) || metaTitle.value),
    twitterDescription: computed(
      () => pickSeoValue("twitter_description", pageEntry.value, defaultEntry.value) || metaDescription.value
    ),
    twitterImage,
  });

  useHead(() => ({
    htmlAttrs: {
      lang: currentLocale.value,
    },
    link: alternateLinks.value,
    meta: [
      ...(metaKeywords.value ? [{ key: "keywords", name: "keywords", content: metaKeywords.value }] : []),
      { key: "application-name", name: "application-name", content: payload.value.site?.name || "Ester Holdings" },
    ],
    script: schema.value
      ? [
          {
            key: "landing-seo-schema",
            type: "application/ld+json",
            children: JSON.stringify(schema.value),
          },
        ]
      : [],
  }));
}

function findSeoEntry(entries: LandingSeoEntry[] | undefined, locale: string, path: string): LandingSeoEntry | null {
  return (
    entries?.find(entry => entry.locale === locale && normalizeSeoPath(entry.path) === normalizeSeoPath(path)) || null
  );
}

function pickSeoValue(
  key: keyof LandingSeoEntry,
  pageEntry?: LandingSeoEntry | null,
  defaultEntry?: LandingSeoEntry | null
): string {
  const pageValue = pageEntry?.[key];
  if (typeof pageValue === "string" && pageValue.trim()) return pageValue.trim();

  const defaultValue = defaultEntry?.[key];
  if (typeof defaultValue === "string" && defaultValue.trim()) return defaultValue.trim();

  return "";
}

function normalizeRoutePath(path: string, locales: string[]): string {
  const normalized = normalizeSeoPath(path);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length && locales.includes(segments[0])) {
    return normalizeSeoPath(`/${segments.slice(1).join("/")}`);
  }

  return normalized;
}

function normalizeSeoPath(path: string): string {
  if (!path || path === "*") return path || "/";

  const cleanPath = `/${path.split("?")[0].split("#")[0].replace(/^\/+/, "")}`.replace(/\/+/g, "/");
  return cleanPath === "/" ? "/" : cleanPath.replace(/\/$/, "");
}

function normalizeSiteUrl(value: unknown): string {
  const url = String(value || "https://esterholdings.space").replace(/\/+$/, "");
  return url || "https://esterholdings.space";
}

function buildCanonicalUrl(siteUrl: string, locale: string, path: string): string {
  const normalizedPath = normalizeSeoPath(path);
  const localizedPath = normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;

  return `${siteUrl}${localizedPath}`.replace(/([^:]\/)\/+/g, "$1");
}

function absoluteUrl(value: string, siteUrl: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  return `${siteUrl}/${value.replace(/^\/+/, "")}`;
}

export default useLandingSeo;
