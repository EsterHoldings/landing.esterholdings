<template>
  <main class="news-detail">
    <UiContainer>
      <article
        v-if="article"
        class="news-detail__article">
        <NuxtLink
          :to="backPath"
          class="news-detail__back">
          ← {{ backLabel }}
        </NuxtLink>

        <header class="news-detail__header">
          <time
            v-if="article.publishedAt"
            class="news-detail__date">
            {{ article.publishedAt }}
          </time>
          <h1>{{ article.title }}</h1>
          <p v-if="article.subtitle">{{ article.subtitle }}</p>
        </header>

        <div
          v-if="article.image"
          class="news-detail__cover">
          <img
            class="news-detail__cover-image"
            :class="{ 'news-detail__cover-image--loaded': isCoverLoaded }"
            :src="currentCoverImage"
            :alt="article.title"
            @load="handleImageLoad"
            @error="handleImageError" />
        </div>

        <div
          class="news-detail__content"
          v-html="renderedContent"></div>
      </article>

      <section
        v-else
        class="news-detail__not-found">
        <h1>Article not found</h1>
        <p>The requested article is not available.</p>
      </section>
    </UiContainer>
  </main>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { setResponseStatus, useAsyncData, useHead, useRequestEvent, useRoute, useSeoMeta } from "#app";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import useAppCore from "~/composables/useAppCore";
  import type { NewsArticleType, NewsItem } from "~/composables/core/modules/news/news.types";
  import { renderArticleContent } from "~/utils/renderArticleContent";

  const route = useRoute();
  const { t } = useI18n();
  const appCore = useAppCore();
  const fallbackImage = "/static/newsBg.jpg";
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

  const { data: articleData } = await useAsyncData<NewsItem | false>(
    `legacy-article-detail-${legacyLocalePrefix.value}-${legacySlug.value}`,
    async () => {
      const newsArticle = await fetchArticle(NewsArticleTypeValue.NEWS);
      if (newsArticle) return newsArticle;

      return (await fetchArticle(NewsArticleTypeValue.TRADER_BLOG)) || false;
    }
  );

  if (!articleData.value) {
    const event = useRequestEvent();
    if (event) {
      setResponseStatus(event, 404, "Legacy article not found");
    }
  }

  const article = computed<NewsItem | null>(() => articleData.value || null);
  const renderedContent = computed(() => renderArticleContent(article.value?.content || ""));
  const currentCoverImage = ref(fallbackImage);
  const isCoverLoaded = ref(false);
  const backLabel = computed(() =>
    article.value?.articleType === "trader_blog"
      ? t("landing.pages.trading.traders_blog_title", "Trader Blog")
      : t("landing.pages.company.news.back", "Company news")
  );
  const backPath = computed(() =>
    article.value?.articleType === "trader_blog" ? localizedPath("/trader-blog") : localizedPath("/company-news")
  );

  watch(
    () => article.value?.image,
    value => {
      currentCoverImage.value = value || fallbackImage;
      isCoverLoaded.value = false;
    },
    { immediate: true }
  );

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

    try {
      const response = await appCore.news.getBySlug(legacySlug.value, {
        locale: apiLocale.value,
        articleType,
        legacyPath: legacyPath.value,
      });

      return response.data.data;
    } catch {
      return null;
    }
  }

  function localizedPath(path: string): string {
    const prefix = apiLocale.value ? `/${apiLocale.value}` : "";
    return `${prefix}${path}`;
  }

  function handleImageLoad(): void {
    isCoverLoaded.value = true;
  }

  function handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src.includes(fallbackImage)) return;

    currentCoverImage.value = fallbackImage;
    isCoverLoaded.value = false;
  }
</script>

<style scoped lang="scss">
  .news-detail {
    position: relative;
    z-index: 0;
    padding: 42px 0 80px;
    background: var(--landing-bg);

    &__article {
      width: 100%;
    }

    &__back {
      display: inline-flex;
      margin-bottom: 24px;
      color: var(--landing-accent);
      font-size: 14px;
      font-weight: 800;
      text-decoration: none;
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: clamp(34px, 4vw, 58px);
        line-height: 1.06;
        font-weight: 800;
      }

      p {
        margin: 0;
        color: var(--landing-text-secondary);
        font-size: 18px;
        line-height: 1.58;
      }
    }

    &__date {
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 800;
    }

    &__cover {
      width: 100%;
      aspect-ratio: 16 / 8.5;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid var(--landing-border-strong);
      background:
        linear-gradient(
          color-mix(in srgb, var(--landing-surface-muted) 88%, transparent),
          color-mix(in srgb, var(--landing-surface-muted) 88%, transparent)
        ),
        url("/static/newsBg.jpg") center / cover;
    }

    &__cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.24s ease;

      &--loaded {
        opacity: 1;
      }
    }

    &__content {
      width: 100%;
      position: relative;
      z-index: 0;
      isolation: isolate;
      contain: paint;
      margin-top: 32px;
      color: var(--landing-text-primary);
      font-size: 17px;
      line-height: 1.72;
      overflow-wrap: anywhere;

      :deep(h2),
      :deep(h3) {
        margin: 30px 0 12px;
        color: var(--landing-text-primary);
        line-height: 1.22;
      }

      :deep(h2) {
        font-size: 28px;
      }

      :deep(h3) {
        font-size: 22px;
      }

      :deep(p) {
        margin: 0 0 18px;
        color: var(--landing-text-secondary);
      }

      :deep(ul) {
        margin: 0 0 18px;
        padding-left: 22px;
        color: var(--landing-text-secondary);
      }

      :deep(a) {
        color: var(--landing-accent);
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      :deep(strong) {
        color: var(--landing-text-primary);
        font-weight: 800;
      }

      :deep(img) {
        display: block;
        width: 100%;
        max-width: 100%;
        height: auto;
        margin: 28px 0;
        border-radius: 8px;
      }

      :deep(hr) {
        margin: 28px 0;
        border: 0;
        border-top: 1px solid var(--landing-border-strong);
      }
    }

    &__not-found {
      min-height: 360px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;

      h1,
      p {
        margin: 0;
      }

      h1 {
        color: var(--landing-text-primary);
        font-size: clamp(34px, 4vw, 58px);
        line-height: 1.06;
        font-weight: 800;
      }

      p {
        color: var(--landing-text-secondary);
        font-size: 18px;
        line-height: 1.58;
      }
    }
  }

  @media (max-width: 640px) {
    .news-detail {
      padding: 28px 0 56px;

      &__cover {
        aspect-ratio: 4 / 3;
      }
    }
  }
</style>
