<template>
  <UiContainer>
    <main class="company-news">
      <header class="company-news__head">
        <h1 class="company-news__title">{{ pageTitle }}</h1>
        <p class="company-news__lead">
          {{ pageSubtitle }}
        </p>
      </header>

      <div
        v-if="newsItems.length"
        class="company-news_wrapper">
        <NewsCard
          v-for="card in newsItems"
          :key="card.id"
          :image="card.image"
          :title="card.title"
          :message="card.subtitle"
          :date="card.publishedAt"
          :button-text="buttonText"
          :link="articlePath(card)" />
      </div>

      <div
        v-else
        class="company-news__empty">
        {{ emptyText }}
      </div>

      <button
        v-if="hasMore"
        type="button"
        class="company-news__load-more"
        :disabled="isLoadingMore"
        @click="loadMore">
        {{ isLoadingMore ? loadingText : loadMoreText }}
      </button>
    </main>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useAsyncData, useHead } from "#app";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import NewsCard from "~/pages/landing/pages/Company/company-news/components/NewsCard.vue";
  import useAppCore from "~/composables/useAppCore";
  import type { NewsArticleType, NewsItem, NewsListResponse } from "~/composables/core/modules/news/news.types";

  const PAGE_SIZE = 9;

  useHead({
    bodyAttrs: {
      class: "landing-news-list-route",
    },
  });

  const props = withDefaults(
    defineProps<{
      articleType?: NewsArticleType;
      titleKey?: string;
      titleFallback?: string;
      subtitleKey?: string;
      subtitleFallback?: string;
      emptyKey?: string;
      emptyFallback?: string;
      detailBasePath?: string;
      asyncKey?: string;
      localeOverride?: string | null;
      initialPage?: number;
    }>(),
    {
      articleType: "news",
      titleKey: "landing.pages.company.news.title",
      titleFallback: "Company news",
      subtitleKey: "landing.pages.company.news.subtitle",
      subtitleFallback: "Company updates, platform news and important announcements.",
      emptyKey: "landing.pages.company.news.empty",
      emptyFallback: "No company news published yet.",
      detailBasePath: "/news",
      asyncKey: "company-news-page",
      localeOverride: null,
      initialPage: 1,
    }
  );

  const { t, locale } = useI18n();
  const appCore = useAppCore();
  const buttonText = computed(() => t("landing.pages.company.news.button"));
  const pageTitle = computed(() => t(props.titleKey, props.titleFallback));
  const pageSubtitle = computed(() => t(props.subtitleKey, props.subtitleFallback));
  const emptyText = computed(() => t(props.emptyKey, props.emptyFallback));
  const loadingText = computed(() => t("landing.pages.company.news.loading", "Loading..."));
  const loadMoreText = computed(() => t("landing.pages.company.news.load_more", "Load more"));
  const detailBasePath = computed(() => props.detailBasePath.replace(/\/$/, ""));
  const effectiveLocale = computed(() => props.localeOverride || locale.value);
  const effectiveInitialPage = computed(() => Math.max(1, Number(props.initialPage) || 1));
  const currentPage = ref(effectiveInitialPage.value);
  const isLoadingMore = ref(false);
  const newsItems = ref<NewsItem[]>([]);
  const meta = ref<NewsListResponse["meta"]>({
    page: 1,
    perPage: PAGE_SIZE,
    total: 0,
    lastPage: 1,
  });

  const { data: initialPayload, refresh } = await useAsyncData(
    `${props.asyncKey}-${effectiveLocale.value}-${effectiveInitialPage.value}`,
    async () => {
      const response = await appCore.news.getList({
        page: effectiveInitialPage.value,
        perPage: PAGE_SIZE,
        locale: effectiveLocale.value,
        articleType: props.articleType,
      });
      return response.data;
    }
  );

  const hasMore = computed(() => newsItems.value.length < meta.value.total);

  function localizedPath(path: string): string {
    return effectiveLocale.value ? `/${effectiveLocale.value}${path}` : path;
  }

  function articlePath(article: NewsItem): string {
    const fallbackPath = localizedPath(`${detailBasePath.value}/${article.slug}`);

    if (props.articleType === "trader_blog") {
      return fallbackPath;
    }

    return article.urlPath || fallbackPath;
  }

  async function loadMore(): Promise<void> {
    if (isLoadingMore.value || !hasMore.value) return;

    isLoadingMore.value = true;
    try {
      const nextPage = currentPage.value + 1;
      const response = await appCore.news.getList({
        page: nextPage,
        perPage: PAGE_SIZE,
        locale: effectiveLocale.value,
        articleType: props.articleType,
      });
      newsItems.value = [...newsItems.value, ...response.data.data];
      meta.value = response.data.meta;
      currentPage.value = nextPage;
    } finally {
      isLoadingMore.value = false;
    }
  }

  watch(
    initialPayload,
    value => {
      newsItems.value = value?.data || [];
      meta.value = value?.meta || meta.value;
      currentPage.value = effectiveInitialPage.value;
    },
    { immediate: true }
  );

  watch([effectiveLocale, effectiveInitialPage], async () => {
    currentPage.value = effectiveInitialPage.value;
    await refresh();
  });
</script>

<style lang="scss" scoped>
  :global(body.landing-news-list-route .page-content),
  :global(body.landing-news-list-route .page--inner) {
    background-color: var(--landing-bg);
  }

  .company-news {
    display: flex;
    flex-direction: column;
    gap: 44px;
    padding: 30px 0 96px;
    background: var(--landing-bg);
    font-family: "DM Sans", "Inter", "Muli", sans-serif;

    &__head {
      max-width: 820px;
      margin: 0 auto;
      text-align: center;
    }

    &__title {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: clamp(44px, 5vw, 72px);
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0;
    }

    &__lead {
      max-width: 620px;
      margin: 34px auto 0;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
    }

    &_wrapper {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
      align-items: stretch;
    }

    &__empty {
      min-height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--landing-border-strong);
      border-radius: 8px;
      color: var(--landing-text-secondary);
      background: var(--landing-surface-glass);
    }

    &__load-more {
      align-self: center;
      min-width: min(440px, 100%);
      height: 66px;
      margin-top: 6px;
      padding: 0 32px;
      border: 0;
      border-radius: 14px;
      color: var(--landing-on-accent);
      background: var(--landing-accent);
      font-size: 18px;
      font-weight: 800;
      cursor: pointer;
      transition:
        opacity 0.2s ease,
        transform 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      &:disabled {
        cursor: default;
        opacity: 0.65;
      }
    }
  }

  @media (max-width: 991px) {
    .company-news {
      gap: 34px;
      padding: 18px 0 70px;

      &_wrapper {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      &__lead {
        margin-top: 22px;
      }
    }
  }

  @media (max-width: 640px) {
    .company-news {
      &__title {
        font-size: 40px;
      }

      &_wrapper {
        grid-template-columns: 1fr;
      }

      &__load-more {
        width: 100%;
        min-width: 0;
      }
    }
  }
</style>
