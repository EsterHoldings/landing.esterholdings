<template>
  <NewsArticleDetailPage
    :article="article"
    :rendered-content="renderedContent" />
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { createError, useAsyncData, useHead, useRoute, useSeoMeta } from "#app";
  import { definePageMeta } from "~/.nuxt/imports";
  import { useI18n } from "vue-i18n";
  import NewsArticleDetailPage from "~/components/block/pages/NewsArticleDetailPage.vue";
  import useAppCore from "~/composables/useAppCore";
  import { renderArticleContent } from "~/utils/renderArticleContent";

  definePageMeta({
    layout: "main",
  });

  const route = useRoute();
  const { locale } = useI18n();
  const appCore = useAppCore();
  const slug = computed(() => String(route.params.slug || ""));

  const { data: articleData } = await useAsyncData(`news-detail-${slug.value}-${locale.value}`, async () => {
    const response = await appCore.news.getBySlug(slug.value, { locale: locale.value });
    return response.data.data;
  });

  if (!articleData.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "News article not found",
    });
  }

  const article = computed(() => articleData.value!);
  const renderedContent = computed(() => renderArticleContent(article.value.content || ""));

  useSeoMeta({
    title: computed(() => article.value.seo.meta_title || article.value.title),
    description: computed(() => article.value.seo.meta_description || article.value.subtitle || ""),
    ogTitle: computed(() => article.value.seo.og_title || article.value.title),
    ogDescription: computed(() => article.value.seo.og_description || article.value.subtitle || ""),
    ogImage: computed(() => article.value.seo.og_image_url || article.value.image),
    twitterTitle: computed(() => article.value.seo.twitter_title || article.value.title),
    twitterDescription: computed(() => article.value.seo.twitter_description || article.value.subtitle || ""),
    twitterImage: computed(() => article.value.seo.twitter_image_url || article.value.image),
  });

  useHead({
    link: computed(() =>
      article.value.seo.canonical_url
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
