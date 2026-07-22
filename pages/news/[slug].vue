<template>
  <NewsArticleDetailPage
    :article="article"
    :rendered-content="renderedContent"
    :loading="isLoading" />
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";
  import { createError, useAsyncData, useHead, useRoute, useSeoMeta } from "#app";
  import { definePageMeta } from "~/.nuxt/imports";
  import { useI18n } from "vue-i18n";
  import NewsArticleDetailPage from "~/components/block/pages/NewsArticleDetailPage.vue";
  import useAppCore from "~/composables/useAppCore";
  import {
    createNewsNavigationCacheKey,
    setNewsNavigationCache,
    useNewsNavigationCache,
  } from "~/composables/useNewsNavigationCache";
  import type { NewsItem } from "~/composables/core/modules/news/news.types";
  import { renderArticleContent } from "~/utils/renderArticleContent";

  definePageMeta({
    layout: "main",
  });

  const route = useRoute();
  const { locale } = useI18n();
  const appCore = useAppCore();
  const slug = computed(() => String(route.params.slug || ""));
  const navigationCache = useNewsNavigationCache();
  const cacheKey = computed(() => createNewsNavigationCacheKey("news", locale.value, slug.value));

  const {
    data: articleData,
    status,
    error,
  } = await useAsyncData(
    `news-detail-${slug.value}-${locale.value}`,
    async () => {
      const response = await appCore.news.getBySlug(slug.value, { locale: locale.value });
      return response.data.data;
    },
    {
      lazy: import.meta.client,
      default: () => (navigationCache.value?.key === cacheKey.value ? navigationCache.value.article : null),
    }
  );

  if (import.meta.server && (error.value || !articleData.value)) {
    throw createError({
      statusCode: 404,
      statusMessage: "News article not found",
    });
  }

  const article = computed<NewsItem | null>(() => articleData.value || null);
  const isLoading = computed(() => !article.value && (status.value === "idle" || status.value === "pending"));
  const renderedContent = computed(() => renderArticleContent(article.value?.content || ""));

  watch(articleData, value => {
    if (!value) return;

    setNewsNavigationCache(navigationCache, {
      key: cacheKey.value,
      article: value,
    });
  });

  useSeoMeta({
    title: computed(() => article.value?.seo.meta_title || article.value?.title || ""),
    description: computed(() => article.value?.seo.meta_description || article.value?.subtitle || ""),
    ogTitle: computed(() => article.value?.seo.og_title || article.value?.title || ""),
    ogDescription: computed(() => article.value?.seo.og_description || article.value?.subtitle || ""),
    ogImage: computed(() => article.value?.seo.og_image_url || article.value?.image || ""),
    twitterTitle: computed(() => article.value?.seo.twitter_title || article.value?.title || ""),
    twitterDescription: computed(() => article.value?.seo.twitter_description || article.value?.subtitle || ""),
    twitterImage: computed(() => article.value?.seo.twitter_image_url || article.value?.image || ""),
  });

  useHead({
    link: computed(() =>
      article.value?.seo.canonical_url
        ? [
            {
              rel: "canonical",
              href: article.value.seo.canonical_url,
            },
          ]
        : []
    ),
  });
</script>
