<template>
  <NewsArticleDetailPage
    :article="article"
    :rendered-content="renderedContent"
    :loading="isLoading" />
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";
  import { setResponseStatus, useAsyncData, useHead, useRequestEvent, useRoute, useSeoMeta } from "#app";
  import NewsArticleDetailPage from "~/components/block/pages/NewsArticleDetailPage.vue";
  import useAppCore from "~/composables/useAppCore";
  import {
    createNewsNavigationCacheKey,
    setNewsNavigationCache,
    useNewsNavigationCache,
  } from "~/composables/useNewsNavigationCache";
  import type { NewsArticleType, NewsItem } from "~/composables/core/modules/news/news.types";
  import { renderArticleContent } from "~/utils/renderArticleContent";

  const route = useRoute();
  const appCore = useAppCore();
  const NewsArticleTypeValue = {
    NEWS: "news",
    TRADER_BLOG: "trader_blog",
  } as const satisfies Record<string, NewsArticleType>;

  const legacyPathSegments = computed(() => {
    const rawValue = route.params.legacySlug;
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    return values
      .flatMap(value => String(value || "").split("/"))
      .map(value => value.trim())
      .filter(Boolean);
  });
  const legacySlug = computed(() => legacyPathSegments.value.at(-1) || "");
  const legacyLocalePrefix = computed(() => {
    const firstSegment = route.path.split("/").filter(Boolean)[0] || "en";
    return firstSegment.toLowerCase();
  });
  const apiLocale = computed(() => (legacyLocalePrefix.value === "ua" ? "uk" : legacyLocalePrefix.value));
  const legacyPath = computed(() => route.path);
  const navigationCache = useNewsNavigationCache();
  const newsCacheKey = computed(() =>
    createNewsNavigationCacheKey(NewsArticleTypeValue.NEWS, apiLocale.value, legacySlug.value)
  );
  const traderBlogCacheKey = computed(() =>
    createNewsNavigationCacheKey(NewsArticleTypeValue.TRADER_BLOG, apiLocale.value, legacySlug.value)
  );

  const { data: articleData, status } = await useAsyncData<NewsItem | false>(
    `legacy-article-detail-${legacyLocalePrefix.value}-${legacySlug.value}`,
    async () => {
      const newsArticle = await fetchArticle(NewsArticleTypeValue.NEWS);
      if (newsArticle) return newsArticle;

      return (await fetchArticle(NewsArticleTypeValue.TRADER_BLOG)) || false;
    },
    {
      lazy: import.meta.client,
      default: () => {
        const cachedEntry = navigationCache.value;
        if (!cachedEntry) return false;

        const cachedPath = String(cachedEntry.article.urlPath || "").replace(/\/+$/, "");
        const currentPath = legacyPath.value.replace(/\/+$/, "");
        const matchesCurrentArticle =
          cachedEntry.key === newsCacheKey.value ||
          cachedEntry.key === traderBlogCacheKey.value ||
          cachedEntry.article.slug === legacySlug.value ||
          cachedPath === currentPath;

        return matchesCurrentArticle ? cachedEntry.article : false;
      },
    }
  );

  if (import.meta.server && !articleData.value) {
    const event = useRequestEvent();
    if (event) {
      setResponseStatus(event, 404, "Legacy article not found");
    }
  }

  const article = computed<NewsItem | null>(() => articleData.value || null);
  const isLoading = computed(() => !article.value && (status.value === "idle" || status.value === "pending"));
  const renderedContent = computed(() => renderArticleContent(article.value?.content || ""));

  watch(articleData, value => {
    if (!value) return;

    setNewsNavigationCache(navigationCache, {
      key: createNewsNavigationCacheKey(value.articleType, apiLocale.value, value.slug),
      article: value,
    });
  });

  useSeoMeta({
    title: computed(() => article.value?.seo.meta_title || article.value?.title || "Article not found"),
    description: computed(() => article.value?.seo.meta_description || article.value?.subtitle || ""),
    ogTitle: computed(() => article.value?.seo.og_title || article.value?.title || ""),
    ogDescription: computed(() => article.value?.seo.og_description || article.value?.subtitle || ""),
    ogImage: computed(() => article.value?.seo.og_image_url || article.value?.image),
    twitterTitle: computed(() => article.value?.seo.twitter_title || article.value?.title || ""),
    twitterDescription: computed(() => article.value?.seo.twitter_description || article.value?.subtitle || ""),
    twitterImage: computed(() => article.value?.seo.twitter_image_url || article.value?.image),
  });

  useHead({
    link: computed(() =>
      article.value?.seo.canonical_url
        ? [
            {
              rel: "canonical",
              href: article.value?.seo.canonical_url || "",
            },
          ]
        : []
    ),
  });

  async function fetchArticle(articleType: NewsArticleType): Promise<NewsItem | null> {
    if (!legacySlug.value) {
      return null;
    }

    const queryVariants = [
      {
        locale: apiLocale.value,
        articleType,
        legacyPath: legacyPath.value,
      },
      {
        locale: apiLocale.value,
        articleType,
      },
    ];

    for (const query of queryVariants) {
      try {
        const response = await appCore.news.getBySlug(legacySlug.value, query);

        if (response.data.data) {
          return response.data.data;
        }
      } catch {
        // Try the next lookup shape; legacy URLs are not consistent across old sections.
      }
    }

    return null;
  }
</script>
